const EmailService = require('./EmailService');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';
const DEFAULT_THRESHOLD = 0.7;
const DEFAULT_NEGATIVE_THRESHOLD = 0.35;
const MAX_COMMENT_LENGTH = 1000;

const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string') return false;

    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getThreshold = () => {
    const threshold = Number(process.env.REVIEW_MODERATION_THRESHOLD);
    if (!Number.isFinite(threshold)) return DEFAULT_THRESHOLD;
    return clamp(threshold, 0, 1);
};

const normalizeComment = (comment) =>
    String(comment || '').trim().slice(0, MAX_COMMENT_LENGTH);

const normalizeCategory = (value) => {
    const normalized = String(value || '').trim().toLowerCase();
    if (['clean', 'negative', 'toxic'].includes(normalized)) return normalized;
    return null;
};

const extractJson = (text) => {
    if (!text) return null;
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) return null;

    try {
        return JSON.parse(text.slice(start, end + 1));
    } catch (error) {
        return null;
    }
};

const getAdminEmail = () =>
    process.env.REVIEW_MODERATION_ADMIN_EMAIL ||
    process.env.EMAIL_REPLY_TO ||
    process.env.EMAIL_USER ||
    '';

const notifyAdmin = async (payload) => {
    const to = getAdminEmail();
    if (!to) return;

    await EmailService.sendReviewModerationAlert({ ...payload, to });
};

const moderateReview = async ({
    comment,
    rating,
    productId,
    productName,
    userId,
    reviewId
}) => {
    if (!parseBoolean(process.env.REVIEW_MODERATION_ENABLED)) return null;
    if (!process.env.OPENROUTER_API_KEY) return null;

    const safeComment = normalizeComment(comment);
    if (!safeComment) return null;

    const modelName =
        process.env.REVIEW_MODERATION_MODEL ||
        process.env.OPENROUTER_MODEL ||
        DEFAULT_MODEL;

    const systemPrompt =
        'You are a content moderation classifier for product reviews. ' +
        'Classify into one of: clean, negative, toxic. ' +
        'Clean = neutral/praise. Negative = criticism without insults or harassment. ' +
        'Toxic = insults, harassment, hate, threats, or abusive language. ' +
        'Return ONLY strict JSON with keys: category (clean|negative|toxic), ' +
        'severity (number 0..1), labels (array of strings), reason (string <= 120 chars).';

    const userPrompt = `Review: "${safeComment}"`;

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'http://localhost:3001',
                'X-Title': process.env.OPENROUTER_APP_NAME || 'TechStore Chatbot'
            },
            body: JSON.stringify({
                model: modelName,
                temperature: 0,
                max_tokens: 120,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ]
            })
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        const parsed = extractJson(text);
        if (!parsed) return null;

        const severity = clamp(Number(parsed.severity) || 0, 0, 1);
        const labels = Array.isArray(parsed.labels)
            ? parsed.labels.map((item) => String(item)).filter(Boolean).slice(0, 6)
            : [];
        const reason = typeof parsed.reason === 'string'
            ? parsed.reason.trim().slice(0, 120)
            : '';
        const modelCategory = normalizeCategory(parsed.category);
        const threshold = getThreshold();
        const fallbackCategory = severity >= threshold
            ? 'toxic'
            : severity >= DEFAULT_NEGATIVE_THRESHOLD
                ? 'negative'
                : 'clean';
        const category = modelCategory || fallbackCategory;
        const isFlagged = category === 'toxic';

        const moderation = {
            category,
            isFlagged,
            score: severity,
            labels,
            reason,
            model: modelName,
            checkedAt: new Date()
        };

        if (isFlagged) {
            await notifyAdmin({
                reviewId,
                productId,
                productName,
                userId,
                rating,
                comment: safeComment,
                score: severity,
                category,
                labels,
                reason
            });
        }

        return moderation;
    } catch (error) {
        return null;
    }
};

module.exports = {
    moderateReview
};

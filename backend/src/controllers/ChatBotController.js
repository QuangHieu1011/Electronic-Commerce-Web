const Product = require('../models/ProductModel');

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_DEFAULT_MODEL = "openai/gpt-4o-mini";

const ChatBotController = {
  // Xử lý tin nhắn từ user
  handleMessage: async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Tin nhắn không được để trống'
        });
      }

      // Kiểm tra API key
      if (!process.env.OPENROUTER_API_KEY) {
        console.error('OPENROUTER_API_KEY chưa được cấu hình trong .env');
        return res.status(500).json({
          success: false,
          message: 'Chatbot chưa được cấu hình đúng'
        });
      }

      // Xử lý với OpenRouter
      const botResult = await processWithOpenRouter(message);
      const reply = typeof botResult === 'string' ? botResult : botResult.reply;
      const products = typeof botResult === 'string' ? [] : (botResult.products || []);

      return res.status(200).json({
        success: true,
        reply,
        products,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('ChatBot Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi xử lý tin nhắn',
        error: error.message
      });
    }
  }
};

const STOP_WORDS = new Set([
  'toi', 'minh', 'ban', 'shop', 'cho', 'co', 'khong', 'muon', 'mua', 'tim', 'kiem',
  'gia', 'duoi', 'tren', 'tu', 'den', 'khoang', 'trieu', 'tr', 'm', 'million',
  'ngan', 'k', 'san', 'pham', 'loai', 'nao', 'voi', 'va', 'can', 'nhu', 'cau',
  'goi', 'y', 'de', 'xuat', 'recommend', 'hot', 'ban', 'chay', 'dat', 'hang',
  'nhat', 'tot', 'nhieu', 'nguoi', 'best', 'seller', 'top', 'noi', 'bat',
  'dien', 'thoai', 'may', 'tinh'
]);

const TYPE_KEYWORDS = [
  { keywords: ['laptop', 'notebook', 'maytinhxachtay', 'gaming'], types: ['Laptop'] },
  { keywords: ['dienthoai', 'iphone', 'samsung', 'xiaomi', 'oppo', 'smartphone', 'phone'], types: ['Phone'] },
  { keywords: ['tablet', 'maytinhbang', 'ipad'], types: ['Tablet'] },
  { keywords: ['tainghe', 'headphone', 'earbuds', 'earphone'], types: ['Headphone'] },
  { keywords: ['dongho', 'smartwatch', 'watch'], types: ['Watch'] },
  { keywords: ['loa', 'speaker', 'bluetooth'], types: ['Speaker'] },
  { keywords: ['tv', 'tivi', 'television'], types: ['TV'] },
  { keywords: ['giadung', 'appliance', 'robot', 'hutbui'], types: ['Appliance'] }
];

const TYPE_REGEX_TOKENS = {
  Phone: ['phone', 'smartphone', 'dienthoai', 'dien\s*thoai'],
  Laptop: ['laptop', 'notebook', 'maytinhxachtay', 'may\s*tinh\s*xach\s*tay'],
  Tablet: ['tablet', 'maytinhbang', 'may\s*tinh\s*bang', 'ipad'],
  Headphone: ['headphone', 'tainghe', 'tai\s*nghe', 'earbuds', 'earphone'],
  Watch: ['watch', 'smartwatch', 'dongho', 'dong\s*ho'],
  Speaker: ['speaker', 'loa', 'bluetooth'],
  TV: ['tv', 'tivi', 'television'],
  Appliance: ['appliance', 'giadung', 'gia\s*dung', 'robot', 'hut\s*bui']
};

const BRAND_KEYWORDS = [
  'iphone', 'apple', 'samsung', 'xiaomi', 'oppo', 'asus', 'lenovo', 'hp', 'dell',
  'msi', 'acer', 'macbook', 'sony', 'lg', 'huawei', 'jbl', 'bose', 'anker', 'logitech'
];

const MIN_PRODUCT_LIST = 3;
const PRODUCT_SELECT_FIELDS = 'name type price discount countInStock image';

const FALLBACK_NAME_TOKENS_BY_TYPE = {
  Phone: ['iphone', 'samsung', 'xiaomi', 'oppo', 'pixel', 'galaxy', 'rog phone', 'oneplus', 'realme', 'vivo', 'nokia', 'sony'],
  Laptop: ['asus', 'lenovo', 'dell', 'hp', 'acer', 'msi', 'macbook', 'thinkpad', 'zenbook', 'ideapad', 'rog', 'legion', 'omen', 'surface', 'gram', 'gigabyte'],
  Tablet: ['ipad', 'galaxy tab', 'matepad', 'xiaomi pad', 'lenovo'],
  Headphone: ['airpods', 'galaxy buds', 'sony', 'bose', 'jbl', 'anker', 'beats'],
  Watch: ['apple watch', 'galaxy watch', 'huawei watch', 'garmin'],
  Speaker: ['jbl', 'sony', 'bose', 'anker', 'marshall'],
  TV: ['sony', 'lg', 'samsung', 'xiaomi'],
  Appliance: ['xiaomi', 'dreame', 'roborock', 'ecovacs']
};

const GAMING_KEYWORDS = ['choi game', 'gaming', 'game', 'fps', 'moba', 'esports'];

const GAMING_TOKENS_BY_TYPE = {
  Phone: ['rog', 'rog phone', 'gaming', 'redmagic', 'black shark', 'legion', 'nubia'],
  Laptop: ['rog', 'legion', 'omen', 'predator', 'gaming']
};

const normalizeText = (text) => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const compactText = (text) => text.replace(/\s+/g, '');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildNameRegex = (tokens = []) => {
  if (!tokens.length) return null;
  const pattern = tokens.map(escapeRegex).join('|');
  return new RegExp(pattern, 'i');
};

const formatVnd = (value) => {
  if (!Number.isFinite(value)) return 'N/A';
  return value.toLocaleString('vi-VN');
};

const shouldSearchProducts = (normalizedMessage) => {
  const compactMessage = compactText(normalizedMessage);
  const triggers = [
    'laptop', 'dienthoai', 'iphone', 'samsung', 'xiaomi', 'oppo', 'smartphone', 'phone',
    'tablet', 'ipad', 'tainghe', 'headphone', 'dongho', 'watch', 'loa', 'speaker',
    'tv', 'tivi', 'giadung', 'appliance', 'robot', 'gia', 'duoi', 'tren', 'mua', 'tim',
    'recommend', 'goi', 'dexuat', 'tuvan', 'top', 'hot', 'banchay', 'thinhhanh',
    'trend', 'trending', 'pho bien', 'phobien', 'choigame', 'gaming'
  ];
  return triggers.some((keyword) => normalizedMessage.includes(keyword) || compactMessage.includes(keyword));
};

const inferProductTypes = (normalizedMessage) => {
  const compactMessage = compactText(normalizedMessage);
  const types = new Set();
  TYPE_KEYWORDS.forEach(({ keywords, types: mapped }) => {
    if (keywords.some((keyword) => normalizedMessage.includes(keyword) || compactMessage.includes(keyword))) {
      mapped.forEach((type) => types.add(type));
    }
  });
  return Array.from(types);
};

const extractBrandKeywords = (normalizedMessage) => {
  const compactMessage = compactText(normalizedMessage);
  return BRAND_KEYWORDS.filter((brand) => normalizedMessage.includes(brand) || compactMessage.includes(brand));
};

const getFallbackNameTokens = (types = []) => {
  const tokens = [];
  types.forEach((type) => {
    const list = FALLBACK_NAME_TOKENS_BY_TYPE[type];
    if (list) tokens.push(...list);
  });
  return Array.from(new Set(tokens));
};

const getGamingNameTokens = (types = []) => {
  const tokens = [];
  types.forEach((type) => {
    const list = GAMING_TOKENS_BY_TYPE[type];
    if (list) tokens.push(...list);
  });
  return Array.from(new Set(tokens));
};

const mergeProducts = (primary = [], secondary = [], limit = 5) => {
  const seen = new Set(primary.map((item) => item.name));
  const merged = [...primary];

  secondary.forEach((item) => {
    if (merged.length >= limit) return;
    if (seen.has(item.name)) return;
    seen.add(item.name);
    merged.push(item);
  });

  return merged;
};

const getTypeKeywords = (type) => {
  const entry = TYPE_KEYWORDS.find(({ types }) => types.includes(type));
  return entry ? entry.keywords : [];
};

const getTypeRegexTokens = (type) => TYPE_REGEX_TOKENS[type] || getTypeKeywords(type);

const buildTypeRegex = (types = []) => {
  const tokens = [];
  types.forEach((type) => tokens.push(...getTypeRegexTokens(type)));
  if (!tokens.length) return null;
  return new RegExp(tokens.join('|'), 'i');
};

const matchesType = (productType, targetTypes = []) => {
  if (!productType || !targetTypes.length) return false;
  const normalizedType = normalizeText(productType);
  const compactType = compactText(normalizedType);

  return targetTypes.some((type) => {
    const keywords = getTypeRegexTokens(type);
    return keywords.some(
      (keyword) => normalizedType.includes(keyword) || compactType.includes(keyword)
    );
  });
};

const parsePriceToVnd = (rawValue, unit) => {
  const value = Number(String(rawValue).replace(',', '.'));
  if (!Number.isFinite(value)) return null;
  if (!unit) {
    if (value >= 1000) return Math.round(value);
    return Math.round(value * 1000000);
  }
  if (['trieu', 'tr', 'm', 'million'].includes(unit)) return Math.round(value * 1000000);
  if (['ngan', 'k'].includes(unit)) return Math.round(value * 1000);
  return Math.round(value);
};

const extractPriceFilter = (normalizedMessage) => {
  const rangeMatch = normalizedMessage.match(/tu\s+(\d+(?:[.,]\d+)?)\s*(trieu|tr|m|million|ngan|k)?\s+den\s+(\d+(?:[.,]\d+)?)\s*(trieu|tr|m|million|ngan|k)?/);
  if (rangeMatch) {
    const min = parsePriceToVnd(rangeMatch[1], rangeMatch[2]);
    const max = parsePriceToVnd(rangeMatch[3], rangeMatch[4]);
    if (min != null && max != null) {
      return { $gte: min, $lte: max };
    }
  }

  const underMatch = normalizedMessage.match(/(duoi|<|<=)\s*(\d+(?:[.,]\d+)?)\s*(trieu|tr|m|million|ngan|k)?/);
  if (underMatch) {
    const max = parsePriceToVnd(underMatch[2], underMatch[3]);
    if (max != null) {
      return { $lte: max };
    }
  }

  const overMatch = normalizedMessage.match(/(tren|>|>=)\s*(\d+(?:[.,]\d+)?)\s*(trieu|tr|m|million|ngan|k)?/);
  if (overMatch) {
    const min = parsePriceToVnd(overMatch[2], overMatch[3]);
    if (min != null) {
      return { $gte: min };
    }
  }

  return null;
};

const extractKeywords = (normalizedMessage) => {
  const tokens = normalizedMessage
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token));

  const useful = tokens.filter((token) => token.length >= 3 || /\d/.test(token));
  return Array.from(new Set(useful)).slice(0, 6);
};

const detectIntent = (normalizedMessage) => {
  const compactMessage = compactText(normalizedMessage);
  const topSellingKeywords = ['banchay', 'dathangnhat', 'hot', 'bestseller', 'top', 'noibat', 'thinhhanh', 'trend', 'trending', 'phobien'];
  const recommendKeywords = ['goiy', 'dexuat', 'recommend', 'tuvan', 'phuhop', 'nenmua'];
  const gamingKeywords = ['choigame', 'gaming', 'game', 'esports'];

  const wantsTopSelling = topSellingKeywords.some(
    (keyword) => normalizedMessage.includes(keyword) || compactMessage.includes(keyword)
  );
  const wantsRecommend = recommendKeywords.some(
    (keyword) => normalizedMessage.includes(keyword) || compactMessage.includes(keyword)
  );
  const wantsGaming = gamingKeywords.some(
    (keyword) => normalizedMessage.includes(keyword) || compactMessage.includes(keyword)
  );

  return { wantsTopSelling, wantsRecommend, wantsGaming };
};

const buildProductQuery = (normalizedMessage) => {
  const conditions = [];
  const types = inferProductTypes(normalizedMessage);
  if (types.length > 0) {
    const typeRegex = buildTypeRegex(types);
    if (typeRegex) {
      conditions.push({ type: { $regex: typeRegex } });
    }
  }

  const priceFilter = extractPriceFilter(normalizedMessage);
  if (priceFilter) {
    conditions.push({ price: priceFilter });
  }

  const brandKeywords = extractBrandKeywords(normalizedMessage);
  const keywords = extractKeywords(normalizedMessage);
  const hasType = types.length > 0;
  const hasPrice = Boolean(priceFilter);
  const shouldUseName = brandKeywords.length > 0 || (!hasType && !hasPrice && keywords.length > 0);

  if (shouldUseName) {
    const tokens = brandKeywords.length > 0 ? brandKeywords : keywords;
    if (tokens.length > 0) {
      const regex = buildNameRegex(tokens);
      if (regex) conditions.push({ name: regex });
    }
  }

  if (conditions.length === 0) return null;
  if (conditions.length === 1) return conditions[0];
  return { $and: conditions };
};

const buildProductContext = async (userMessage) => {
  const normalizedMessage = normalizeText(userMessage);
  if (!shouldSearchProducts(normalizedMessage)) {
    return { text: '', products: [] };
  }

  const intent = detectIntent(normalizedMessage);
  const types = inferProductTypes(normalizedMessage);
  let query = buildProductQuery(normalizedMessage);

  if (!query && (intent.wantsTopSelling || intent.wantsRecommend)) {
    query = {};
  }

  if (!query) {
    return { text: '', products: [] };
  }

  const sortBy = intent.wantsTopSelling
    ? { selled: -1, rating: -1 }
    : intent.wantsRecommend
      ? { rating: -1, selled: -1 }
      : { selled: -1, rating: -1 };

  try {
    let products = await Product.find(query)
      .sort(sortBy)
      .limit(5)
      .select(PRODUCT_SELECT_FIELDS);

    if (!products.length) {
      const fallbackTokens = getFallbackNameTokens(types);
      const fallbackRegex = buildNameRegex(fallbackTokens);

      if (fallbackRegex) {
        const fallbackQuery = { name: fallbackRegex };
        const priceFilter = extractPriceFilter(normalizedMessage);
        if (priceFilter) fallbackQuery.price = priceFilter;

        products = await Product.find(fallbackQuery)
          .sort(sortBy)
          .limit(5)
          .select(PRODUCT_SELECT_FIELDS);
      }
    }

    if (!products.length && types.length > 0) {
      const widerProducts = await Product.find({})
        .sort(sortBy)
        .limit(50)
        .select(PRODUCT_SELECT_FIELDS);

      const filtered = widerProducts.filter((product) => matchesType(product.type, types));
      products = filtered.slice(0, 5);
    }

    if (!products.length && (intent.wantsTopSelling || intent.wantsRecommend)) {
      products = await Product.find({})
        .sort(sortBy)
        .limit(5)
        .select(PRODUCT_SELECT_FIELDS);
    }

    if (intent.wantsGaming && types.length > 0) {
      const gamingTokens = getGamingNameTokens(types);
      const gamingRegex = buildNameRegex(gamingTokens);
      if (gamingRegex) {
        const gamingQuery = { name: gamingRegex };
        const priceFilter = extractPriceFilter(normalizedMessage);
        if (priceFilter) gamingQuery.price = priceFilter;
        const gamingProducts = await Product.find(gamingQuery)
          .sort(sortBy)
          .limit(5)
          .select(PRODUCT_SELECT_FIELDS);
        products = mergeProducts(products, gamingProducts, 5);
      }
    }

    if (products.length > 0 && products.length < MIN_PRODUCT_LIST && types.length > 0) {
      const widerProducts = await Product.find({})
        .sort(sortBy)
        .limit(80)
        .select(PRODUCT_SELECT_FIELDS);

      const filtered = widerProducts.filter((product) => matchesType(product.type, types));
      products = mergeProducts(products, filtered, 5);
    }

    if (!products.length) {
      return { text: 'Khong tim thay san pham phu hop trong kho hien tai.', products: [] };
    }

    const lines = products.map((product, index) => {
      const discountText = product.discount ? ` | Giam: ${product.discount}%` : '';
      return `- ${index + 1}. ${product.name} | Loai: ${product.type} | Gia: ${formatVnd(product.price)} VND${discountText} | Ton: ${product.countInStock}`;
    });

    const mappedProducts = products.map((product) => ({
      id: String(product._id),
      name: product.name,
      type: product.type,
      price: product.price,
      discount: product.discount,
      countInStock: product.countInStock,
      image: product.image
    }));

    return { text: lines.join('\n'), products: mappedProducts };
  } catch (error) {
    console.error('Chatbot product lookup failed:', error);
    return { text: '', products: [] };
  }
};

// Hàm xử lý với OpenRouter API
async function processWithOpenRouter(userMessage) {
  let productContext = { text: '', products: [] };

  try {
    const modelNames = [
      process.env.OPENROUTER_MODEL,
      OPENROUTER_DEFAULT_MODEL,
      "openai/gpt-4.1-mini",
      "meta-llama/llama-3.1-8b-instruct"
    ].filter(Boolean);
    
    let lastError = null;
    
    productContext = await buildProductContext(userMessage);
    const productContextText = productContext.text || 'Khong tim thay san pham phu hop trong kho hien tai.';

    const systemPrompt = `Bạn là TechStore Chatbot - chatbot thông minh của một cửa hàng điện tử trực tuyến (E-Commerce).

Nhiệm vụ của bạn:
- Trả lời các câu hỏi về sản phẩm điện tử (laptop, điện thoại, phụ kiện, v.v.)
- Hỗ trợ về đơn hàng, giao hàng, thanh toán
- Tư vấn sản phẩm phù hợp với nhu cầu khách hàng
- Giải đáp thắc mắc về chính sách bảo hành, đổi trả

Phong cách giao tiếp:
- Thân thiện, nhiệt tình, chuyên nghiệp
- Trả lời ngắn gọn, súc tích (2-4 câu)
- Sử dụng tiếng Việt
- Emoji phù hợp để tạo sự gần gũi

Thông tin về cửa hàng:
- Giao hàng toàn quốc 2-3 ngày
- Thanh toán qua PayPal hoặc COD
- Bảo hành 12-24 tháng tùy sản phẩm
- Hỗ trợ 24/7

Du lieu san pham hien co (cap nhat tu database, chi dung de tu van):
${productContextText}

Quy tac:
- Chi tu van dua tren du lieu san pham ben tren
- Neu khong co san pham phu hop, hay xin loi va hoi them nhu cau
- Khong tu che san pham khong ton tai
- Neu co tu 2 san pham tro len, hay liet ke 3-5 san pham phu hop nhat, moi dong 1 san pham
- Neu chi co 1 san pham, hay noi ro do la lua chon phu hop va hoi them tieu chi de tim them

Mau tra loi goi y (neu co nhieu san pham):
- Ten san pham | Gia | Ton kho
- Ten san pham | Gia | Ton kho`;

    for (const modelName of modelNames) {
      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER || "http://localhost:3001",
            "X-Title": process.env.OPENROUTER_APP_NAME || "TechStore Chatbot"
          },
          body: JSON.stringify({
            model: modelName,
            temperature: 0.6,
            max_tokens: 300,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMessage }
            ]
          })
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`OpenRouter HTTP ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim();

        if (text) {
          console.log(`OpenRouter success with model: ${modelName}`);
          return { reply: text, products: productContext.products };
        }
      } catch (err) {
        lastError = err;
        console.log(`Model ${modelName} failed, trying next...`);
        continue;
      }
    }
    
    // Nếu tất cả models đều fail, dùng rule-based
    throw lastError;

  } catch (error) {
    console.error('OpenRouter không khả dụng, chuyển sang rule-based chatbot');
    console.error('Error:', error.message);
    
    // Fallback: Rule-based chatbot thông minh
    return { reply: getRuleBasedResponse(userMessage), products: productContext.products };
  }
}

// Rule-based chatbot fallback
function getRuleBasedResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Database của câu trả lời
  const responses = {
    // Về sản phẩm
    'laptop|máy tính': '💻 Cửa hàng có nhiều dòng laptop từ văn phòng đến gaming với giá từ 10-50 triệu. Bạn cần laptop cho công việc gì để tôi tư vấn phù hợp nhất?',
    'điện thoại|iphone|samsung|smartphone': '📱 Chúng tôi có đa dạng điện thoại: iPhone, Samsung, Xiaomi, Oppo... Giá từ 3-30 triệu. Bạn có ngân sách và yêu cầu cụ thể nào không?',
    'tai nghe|headphone': '🎧 Cửa hàng có tai nghe gaming, thể thao và văn phòng từ 200k-5 triệu. Bạn muốn loại nào: chụp tai hay nhét tai?',
    'giá|bao nhiêu|chi phí': '💰 Giá sản phẩm khác nhau tùy dòng. Bạn có thể xem chi tiết trên trang sản phẩm hoặc cho tôi biết sản phẩm cụ thể để tôi check giá giúp bạn!',
    
    // Về giao hàng
    'giao hàng|ship|vận chuyển': '🚚 Chúng tôi giao hàng toàn quốc trong 2-3 ngày làm việc. Nội thành Hà Nội/HCM giao trong 24h. Miễn phí ship cho đơn từ 500k!',
    'bao lâu|mất bao nhiêu ngày': '⏱️ Thời gian giao hàng: 24h với nội thành HN/HCM, 2-3 ngày với tỉnh thành khác. Bạn ở khu vực nào để tôi check cụ thể?',
    
    // Về thanh toán
    'thanh toán|payment|trả tiền': '💳 Chúng tôi hỗ trợ thanh toán qua PayPal (quốc tế) và COD (thanh toán khi nhận hàng). An toàn và tiện lợi!',
    'cod|tiền mặt': '💵 Có ạ! Chúng tôi hỗ trợ COD (thanh toán khi nhận hàng) cho tất cả đơn hàng. Bạn kiểm tra hàng trước khi thanh toán nhé!',
    'paypal': '💳 PayPal được hỗ trợ đầy đủ! An toàn, nhanh chóng và được bảo vệ người mua quốc tế.',
    
    // Về bảo hành
    'bảo hành|warranty': '🛡️ Sản phẩm được bảo hành 12-24 tháng tùy loại. Bảo hành 1 đổi 1 trong 30 ngày đầu nếu có lỗi NSX.',
    'đổi trả|hoàn tiền': '🔄 Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả. Hoàn tiền 100% nếu chưa sử dụng!',
    
    // Chung
    'xin chào|hi|hello|chào': '👋 Xin chào! Tôi là TechStore Chatbot. Tôi có thể giúp bạn tìm sản phẩm, tư vấn hoặc hỗ trợ đơn hàng. Bạn cần giúp gì?',
    'cảm ơn|thanks': '🙏 Rất vui được hỗ trợ bạn! Nếu cần thêm thông tin gì, đừng ngại hỏi nhé!',
    'liên hệ|hotline|số điện thoại': '📞 Hotline: Admin (8h-22h hàng ngày)\n📧 Email: support@techstore.vn\nChúng tôi luôn sẵn sàng hỗ trợ!'
  };
  
  // Tìm response phù hợp
  for (const [keywords, response] of Object.entries(responses)) {
    const keywordList = keywords.split('|');
    if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
      return response;
    }
  }
  
  // Default response
  return '🤔 Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n\n' +
         '💻 Sản phẩm (laptop, điện thoại, phụ kiện)\n' +
         '🚚 Giao hàng và vận chuyển\n' +
         '💳 Thanh toán và COD\n' +
         '🛡️ Bảo hành và đổi trả\n\n' +
         'Hoặc liên hệ hotline Admin để được tư vấn trực tiếp!';
}

module.exports = ChatBotController;

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
      const botReply = await processWithOpenRouter(message);

      return res.status(200).json({
        success: true,
        reply: botReply,
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

// Hàm xử lý với OpenRouter API
async function processWithOpenRouter(userMessage) {
  try {
    const modelNames = [
      process.env.OPENROUTER_MODEL,
      OPENROUTER_DEFAULT_MODEL,
      "openai/gpt-4.1-mini",
      "meta-llama/llama-3.1-8b-instruct"
    ].filter(Boolean);
    
    let lastError = null;
    
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
- Hỗ trợ 24/7`;

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
          return text;
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
    return getRuleBasedResponse(userMessage);
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
    'liên hệ|hotline|số điện thoại': '📞 Hotline: 1900-xxxx (8h-22h hàng ngày)\n📧 Email: support@techstore.vn\nChúng tôi luôn sẵn sàng hỗ trợ!'
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
         'Hoặc liên hệ hotline: 1900-xxxx để được tư vấn trực tiếp!';
}

module.exports = ChatBotController;

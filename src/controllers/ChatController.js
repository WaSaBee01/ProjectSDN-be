const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/ProductModal");

exports.chatWithAI = async (req, res) => {
  try {
    const userMessage = req.body.message || "";
    const keywords = ["tìm", "mua", "gợi ý", "sản phẩm", "recommend"];
    let products = [];

    // Nếu là câu hỏi về sản phẩm
    if (keywords.some((kw) => userMessage.toLowerCase().includes(kw))) {
      const keyword = userMessage
        .replace(/(tìm|mua|gợi ý|sản phẩm|recommend)/gi, "")
        .trim();
      const regex = new RegExp(keyword, "i");
      products = await Product.find({
        $or: [{ name: regex }, { type: regex }, { description: regex }],
      }).limit(3);

      if (!products || products.length === 0) {
        products = await Product.find().sort({ createdAt: -1 }).limit(3);
      }

      return res.json({
        reply:
          products.length > 0
            ? "Dưới đây là một số sản phẩm phù hợp cho bạn:"
            : "Xin lỗi, shop không tìm thấy sản phẩm phù hợp.",
        products: products.map((p) => ({
          id: p._id,
          name: p.name,
          desc: p.description,
          price: p.price,
          image: p.image,
          discount: p.discount,
          rating: p.rating,
          url: `/product-detail/${p._id}`,
        })),
      });
    }

    // Ngược lại, gọi AI trả lời tự do
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(userMessage);
    const reply = result.response.text();

    res.json({ reply, products: [] }); // FE vẫn nhận reply, nhưng products trống
  } catch (error) {
    console.error(error?.message || error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};

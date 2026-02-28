// server/controllers/ChatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { User } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD (Waktu Lokal Server)
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

class ChatController {
  static async handleChat(req, res) {
    try {
      const UserId = req.user.id;
      const { message, history } = req.body;

      if (!message || message.trim() === "") {
        return res.status(400).json({ message: "Pesan tidak boleh kosong" });
      }

      if (message.length > 60) {
        return res.status(400).json({ message: "Pesan maksimal 60 karakter." });
      }

      const user = await User.findByPk(UserId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const todayStr = getTodayString();
      
      // Karena tipe datanya DATEONLY, Sequelize otomatis mengembalikan string YYYY-MM-DD
      const lastChatStr = user.lastChatDate; 

      // 1. Logika Reset Kuota (Jika hari berbeda dengan lastChatDate)
      if (lastChatStr !== todayStr) {
        user.chatQuota = 3;
      }

      // 2. Validasi Kuota Terakhir
      if (user.chatQuota <= 0) {
        return res.status(403).json({
          message: "Kuota harian (3/3) Anda telah habis. Silakan kembali besok.",
          remainingQuota: 0,
        });
      }

      // 3. Eksekusi AI
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite", 
        systemInstruction: `
          Kamu adalah "RBT AI Assistant", pakar teknis otomotif khususnya knalpot. 
          RBT Racing adalah toko spesialis part racing motor berkualitas tinggi khususnya Knalpot.
          
          Tujuanmu: 
          1. Membantu pelanggan memilih knalpot yang tepat.
          2. Menjelaskan produk yang ada dipasaran saat ini.
          3. Menjawab pertanyaan teknis knalpot motor.
          
          Nada bicara: Profesional, keren, dan teknis. Gunakan Bahasa Indonesia.
          Jika ditanya hal di luar konteks knalpot, jawab dengan sopan bahwa kamu hanya menjawab pertanyaan tentang knalpot.
        `,
      });

      const chat = model.startChat({
        history: history || [],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      let text = result.response.text();

      // Hapus format markdown tebal & header jika AI tetap ngeyel
      text = text.replace(/\*\*/g, "").replace(/#/g, "");

      // 4. Pemotongan Kuota & Update Tanggal Sukses
      user.chatQuota -= 1;
      user.lastChatDate = todayStr; // Update langsung dengan string hari ini
      await user.save();

      res.status(200).json({
        reply: text.trim(),
        remainingQuota: user.chatQuota,
      });

    } catch (error) {
      console.error("Gemini AI Error:", error);
      res.status(500).json({ message: "Sistem RBT AI sedang pemeliharaan." });
    }
  }

  static async getQuota(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ quota: 0 });

      const todayStr = getTodayString();
      const lastChatStr = user.lastChatDate;

      // Reset kuota jadi 3 jika hari sudah berganti, dan simpan perubahannya
      if (lastChatStr !== todayStr && user.chatQuota !== 3) {
        user.chatQuota = 3;
        await user.save(); 
      }

      res.status(200).json({ quota: user.chatQuota });
    } catch (error) {
      console.error("Get Quota Error:", error);
      res.status(500).json({ quota: 0 });
    }
  }
}

module.exports = ChatController;
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateRoadmap({ title, description, duration_weeks, level }) {
  const prompt = `Kamu adalah expert learning coach. Buatkan roadmap belajar yang detail dan terstruktur.

GOAL: Belajar "${title}"
LEVEL: ${level} (beginner = pemula, intermediate = sudah tahu dasar, advanced = sudah berpengalaman)
DURASI: ${duration_weeks} minggu
DESKRIPSI TAMBAHAN: ${description || "Tidak ada"}

INSTRUKSI PENTING:
1. Buat roadmap harian yang realistis dan terstruktur
2. Setiap minggu maksimal 5 hari belajar (Senin-Jumat), Sabtu-Minggu untuk review/istirahat
3. Estimasi waktu belajar per hari: 1-3 jam
4. Sesuaikan konten dengan level yang diberikan
5. Topik harus berurutan dari dasar ke advanced secara logis

FORMAT JSON:
{
  "title": "judul roadmap",
  "summary": "ringkasan",
  "total_weeks": ${duration_weeks},
  "tasks": [
    {
      "week": 1,
      "day": 1,
      "topic": "topik",
      "task": "deskripsi",
      "estimated_time": "1.5 jam"
    }
  ]
}

Response HARUS JSON saja.`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }, // 🔥 penting
    });
    console.log("RESPONSE:", response);

    const rawText = response.choices[0].message.content;

    // ✅ Parse JSON (step penting banget)
    const parsed = JSON.parse(rawText);

    return parsed;

  } catch (error) {
    console.error("Error generate roadmap:", error);
    // throw error; // biar bisa ditangkap di route handler dan dikirim ke client
    throw new Error("Gagal generate roadmap AI");
  }
}
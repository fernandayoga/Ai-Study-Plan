import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/models/Goal";
import { generateRoadmap } from "@/lib/ai";
import { parseAIResponse, validateRoadmap } from "@/lib/utils";

export async function POST(request) {
  try {
    // 1. Ambil data dari request
    const body = await request.json();
    const { title, description, duration_weeks, level } = body;

    // 2. Validasi input
    if (!title || !duration_weeks || !level) {
      return NextResponse.json(
        { success: false, message: "Title, duration, dan level wajib diisi" },
        { status: 400 }
      );
    }

    // 3. Generate roadmap dengan AI
    console.log("🤖 Generating roadmap for:", title);
    const parsedRoadmap = await generateRoadmap({
      title,
      description,
      duration_weeks,
      level,
    });
    console.log("✅ AI response received");

    // 4. Parse JSON dari response AI
    // const parsedRoadmap = parseAIResponse(rawAIResponse);
    console.log("✅ JSON parsed successfully");

    // 5. Validasi struktur roadmap
    const { isValid, errors } = validateRoadmap(parsedRoadmap);
    if (!isValid) {
      console.error("❌ Validation errors:", errors);
      return NextResponse.json(
        { 
          success: false, 
          message: "Format roadmap dari AI tidak valid. Coba lagi.",
          errors 
        },
        { status: 422 }
      );
    }

    // 6. Simpan ke MongoDB
    await connectDB();

    const goal = await Goal.create({
      title,
      description,
      duration_weeks,
      level,
      roadmap: parsedRoadmap.tasks.map((task) => ({
        week: task.week,
        day: task.day,
        topic: task.topic,
        task: task.task,
        estimated_time: task.estimated_time,
        is_completed: false,
      })),
      total_tasks: parsedRoadmap.tasks.length,
      completed_tasks: 0,
      ai_summary: parsedRoadmap.summary || "",
    });

    console.log("✅ Goal saved to MongoDB:", goal._id);

    return NextResponse.json({
      success: true,
      goalId: goal._id,
      message: "Roadmap berhasil dibuat!",
    });

  } catch (error) {
    console.error("❌ Error generating roadmap:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
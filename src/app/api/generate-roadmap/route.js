import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/models/Goal";
import { generateRoadmap } from "@/lib/ai";
import { parseAIResponse, validateRoadmap } from "@/lib/utils";
import { auth } from "@/lib/auth";
import ytSearch from "youtube-search-api";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

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
    // 4. Cek apakah AI menolak topik (karena tidak valid)
    if (parsedRoadmap.error) {
      console.log("❌ AI menolak topik:", parsedRoadmap.error);
      return NextResponse.json(
        { success: false, message: parsedRoadmap.error },
        { status: 400 }
      );
    }

    // 5. Validasi struktur roadmap (jika bukan error)
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

    // 6. Enrich roadmap dengan YouTube API
    console.log("🔍 Memproses pencarian video YouTube spesifik secara paralel...");
    
    await Promise.all(
      parsedRoadmap.tasks.map(async (task) => {
        if (task.resources && task.resources.length > 0) {
          const enrichedResources = await Promise.all(
            task.resources.map(async (res) => {
              if (res.keyword) {
                try {
                  const ytResult = await ytSearch.GetListByKeyword(res.keyword, false, 1);
                  if (ytResult && ytResult.items && ytResult.items.length > 0) {
                    const video = ytResult.items[0];
                    return {
                      title: video.title || res.title,
                      link: `https://www.youtube.com/watch?v=${video.id}`,
                    };
                  } else {
                    // Fallback
                    return {
                      title: res.title,
                      link: `https://www.youtube.com/results?search_query=${encodeURIComponent(res.keyword)}`,
                    };
                  }
                } catch (err) {
                  console.error("Gagal ambil dari YouTube:", err);
                  return {
                    title: res.title,
                    link: `https://www.youtube.com/results?search_query=${encodeURIComponent(res.keyword)}`,
                  };
                }
              }
              return res;
            })
          );
          task.resources = enrichedResources;
        }
      })
    );

    // 7. Simpan ke MongoDB
    await connectDB();

    const goal = await Goal.create({
      userId: session.user.id,
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
        resources: task.resources || [],
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
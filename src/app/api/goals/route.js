import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/models/Goal";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Kalau ada query ?id=xxx, ambil 1 goal dengan roadmap lengkap
    if (id) {
      const goal = await Goal.findById(id);
      if (!goal) {
        return NextResponse.json(
          { success: false, message: "Goal tidak ditemukan" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, goal });
    }

    // Default: ambil semua goals tanpa roadmap
    const goals = await Goal.find()
      .sort({ createdAt: -1 })
      .select("-roadmap");

    return NextResponse.json({ success: true, goals });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
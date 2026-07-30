import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/models/Goal";
import { auth } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Kalau ada query ?id=xxx, ambil 1 goal dengan roadmap lengkap
    if (id) {
      const goal = await Goal.findOne({ _id: id, userId: session.user.id });
      if (!goal) {
        return NextResponse.json(
          { success: false, message: "Goal tidak ditemukan" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, goal });
    }

    // Default: ambil semua goals tanpa roadmap
    const goals = await Goal.find({ userId: session.user.id })
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
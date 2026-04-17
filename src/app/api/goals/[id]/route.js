import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/models/Goal";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ← tambah await di sini

    const goal = await Goal.findById(id);

    if (!goal) {
      return NextResponse.json(
        { success: false, message: "Goal tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, goal });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ← tambah await di sini
    const body = await request.json();
    const { taskId, is_completed } = body;

    const goal = await Goal.findOneAndUpdate(
      {
        _id: id,
        "roadmap._id": taskId,
      },
      {
        $set: { "roadmap.$.is_completed": is_completed },
      },
      { new: true }
    );

    if (!goal) {
      return NextResponse.json(
        { success: false, message: "Goal atau task tidak ditemukan" },
        { status: 404 }
      );
    }

    const completedCount = goal.roadmap.filter((t) => t.is_completed).length;
    goal.completed_tasks = completedCount;
    await goal.save();

    return NextResponse.json({
      success: true,
      goal,
      message: "Task updated!",
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params; // ← tambah await di sini

    await Goal.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Goal berhasil dihapus",
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
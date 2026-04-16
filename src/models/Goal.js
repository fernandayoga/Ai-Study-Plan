import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  week: { type: Number, required: true },
  topic: { type: String, required: true },
  task: { type: String, required: true },
  estimated_time: { type: String, required: true },
  is_completed: { type: Boolean, default: false },
});

const GoalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration_weeks: { type: Number, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    description: { type: String },
    ai_summary: { type: String },        // ← tambahan baru
    roadmap: [TaskSchema],
    total_tasks: { type: Number, default: 0 },
    completed_tasks: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
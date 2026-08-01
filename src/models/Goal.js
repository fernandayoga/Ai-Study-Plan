import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  title: String,
  link: String,
});

const TaskSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  week: { type: Number, required: true },
  topic: { type: String, required: true },
  task: { type: String, required: true },
  estimated_time: { type: String, required: true },
  is_completed: { type: Boolean, default: false },
  resources: [ResourceSchema],
});

const GoalSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true   // ← wajib sekarang
    },
    title: { type: String, required: true },
    duration_weeks: { type: Number, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    description: { type: String },
    ai_summary: { type: String },
    roadmap: [TaskSchema],
    total_tasks: { type: Number, default: 0 },
    completed_tasks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hapus model lama dari cache agar schema baru (resources) terbaca di Next.js dev
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Goal;
}

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
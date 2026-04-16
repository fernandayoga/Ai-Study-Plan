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
    title: { type: String, required: true },        // "Belajar React"
    duration_weeks: { type: Number, required: true }, // 4 (minggu)
    level: { 
      type: String, 
      enum: ["beginner", "intermediate", "advanced"],
      required: true 
    },
    description: { type: String },                  // deskripsi tambahan
    roadmap: [TaskSchema],                          // array task harian
    total_tasks: { type: Number, default: 0 },
    completed_tasks: { type: Number, default: 0 },
  },
  { 
    timestamps: true  // otomatis tambah createdAt & updatedAt
  }
);

// Hindari model duplicate di development (hot reload issue)
export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
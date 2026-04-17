"use client";

import { useState } from "react";
import { Clock, CheckCircle2, Circle, Loader2 } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function TaskCard({ task, goalId, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task._id,
          is_completed: !task.is_completed,
        }),
      });

      const data = await res.json();
      if (data.success) onUpdate(data.goal);
      
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
      task.is_completed
        ? "bg-green-50 border-green-200"
        : "bg-white border-surface-200 hover:border-primary-200 hover:shadow-sm"
    }`}>
      
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="mt-0.5 flex-shrink-0 cursor-pointer"
      >
        {loading ? (
          <Loader2 size={22} className="animate-spin text-primary-500" />
        ) : task.is_completed ? (
          <CheckCircle2 size={22} className="text-green-500" />
        ) : (
          <Circle size={22} className="text-gray-300 hover:text-primary-400 transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={task.is_completed ? "success" : "primary"}>
            Day {task.day}
          </Badge>
          <span className={`text-sm font-semibold ${
            task.is_completed ? "text-green-700 line-through" : "text-gray-800"
          }`}>
            {task.topic}
          </span>
        </div>
        
        <p className={`text-sm leading-relaxed ${
          task.is_completed ? "text-green-600 line-through" : "text-gray-500"
        }`}>
          {task.task}
        </p>

        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <Clock size={12} />
          <span>{task.estimated_time}</span>
        </div>
      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import { Clock, CheckCircle2, Circle, Loader2, ExternalLink } from "lucide-react";
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
        ? "bg-green-500/10 border-green-500/30"
        : "bg-black/30 border-white/10 hover:border-primary-400 hover:shadow-sm"
    }`}>
      
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="mt-0.5 flex-shrink-0 cursor-pointer"
      >
        {loading ? (
          <Loader2 size={22} className={`animate-spin ${task.is_completed ? "text-green-500" : "text-primary-500"}`} />
        ) : task.is_completed ? (
          <CheckCircle2 size={22} className="text-green-500" />
        ) : (
          <Circle size={22} className="text-gray-300 hover:text-primary-400 transition-colors" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <Badge variant={task.is_completed ? "success" : "primary"} className="flex-shrink-0 whitespace-nowrap mt-0.5">
            Day {task.day}
          </Badge>
          <span className={`text-sm font-semibold leading-snug ${
            task.is_completed ? "text-green-400 " : "text-white"
          }`}>
            {task.topic}
          </span>
        </div>
        
        <p className={`text-sm leading-relaxed ${
          task.is_completed ? "text-green-500/80 " : "text-gray-300"
        }`}>
          {task.task}
        </p>

        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <Clock size={12} />
          <span>{task.estimated_time}</span>
        </div>

        {task.resources && task.resources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="text-xs font-medium text-gray-400 mb-2">Rekomendasi Belajar :</p>
            <div className="flex flex-wrap gap-2">
              {task.resources.map((res, i) => (
                <a 
                  key={i} 
                  href={res.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    task.is_completed 
                      ? "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20" 
                      : "bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 border-primary-500/20"
                  }`}
                >
                  <ExternalLink size={12} />
                  {res.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
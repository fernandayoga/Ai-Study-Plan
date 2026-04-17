import TaskCard from "./TaskCard";
import { CheckCircle2 } from "lucide-react";

export default function WeekSection({ weekNumber, tasks, goalId, onUpdate }) {
  const completedInWeek = tasks.filter((t) => t.is_completed).length;
  const isWeekDone = completedInWeek === tasks.length;

  return (
    <div className="mb-8">
      
      {/* Week Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold shadow-sm ${
          isWeekDone
            ? "bg-green-500 text-white"
            : "bg-primary-600 text-white"
        }`}>
          {isWeekDone ? <CheckCircle2 size={18} /> : `W${weekNumber}`}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            Minggu {weekNumber}
          </h3>
          <p className="text-xs text-gray-400">
            {completedInWeek}/{tasks.length} task selesai
          </p>
        </div>

        {/* Week Progress Bar */}
        <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden ml-2">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedInWeek / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3 pl-2">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            goalId={goalId}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}
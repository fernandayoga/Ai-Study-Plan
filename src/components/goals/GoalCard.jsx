import Link from "next/link";
import { Calendar, BarChart2, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { calcProgress, formatDuration } from "@/lib/utils";

export default function GoalCard({ goal }) {
  const progress = calcProgress(goal.completed_tasks, goal.total_tasks);
  const isDone = progress === 100;

  const levelConfig = {
    beginner: { variant: "success", label: "Beginner", emoji: "🌱" },
    intermediate: { variant: "warning", label: "Intermediate", emoji: "🌿" },
    advanced: { variant: "danger", label: "Advanced", emoji: "🌳" },
  };

  const level = levelConfig[goal.level] || levelConfig.beginner;

  return (
    <Link href={`/goals/${goal._id}`}>
      <Card className="p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant={level.variant}>
                {level.emoji} {level.label}
              </Badge>
              {isDone && (
                <Badge variant="success">
                  <CheckCircle2 size={10} className="mr-1" />
                  Selesai!
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-gray-800 truncate group-hover:text-primary-600 transition-colors">
              {goal.title}
            </h3>
          </div>
          <ArrowRight 
            size={16} 
            className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0 mt-1" 
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDuration(goal.duration_weeks)}
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 size={12} />
            {goal.total_tasks} tasks
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(goal.createdAt).toLocaleDateString("id-ID", { 
              day: "numeric", 
              month: "short" 
            })}
          </span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400">Progress</span>
            <span className={`text-xs font-semibold ${
              isDone ? "text-green-500" : "text-primary-600"
            }`}>
              {progress}%
            </span>
          </div>
          <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDone ? "bg-green-500" : "bg-primary-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {goal.completed_tasks} dari {goal.total_tasks} task selesai
          </p>
        </div>

      </Card>
    </Link>
  );
}
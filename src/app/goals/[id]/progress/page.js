"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Clock,
  Target,
  CheckCircle2,
  Circle,
  Loader2,
  TrendingUp,
  Calendar,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressRing from "@/components/ui/ProgressRing";
import { calcDetailedStats, formatMinutes, formatDuration } from "@/lib/utils";

export default function ProgressPage() {
  const { id } = useParams();
  const router = useRouter();

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoal();
  }, [id]);

  const fetchGoal = async () => {
    try {
      const res = await fetch(`/api/goals/${id}`);
      const data = await res.json();
      if (data.success) setGoal(data.goal);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Goal tidak ditemukan</p>
          <Button onClick={() => router.push("/dashboard")}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const stats = calcDetailedStats(goal.roadmap);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={22} className="text-primary-600" />
          Progress Tracking
        </h1>
        <p className="text-gray-500 text-sm mt-1">{goal.title}</p>
      </div>

      {/* Overall Progress Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-6">
          <ProgressRing progress={stats.progress} size={90} strokeWidth={7} />
          
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 mb-1">
              {stats.progress === 100 
                ? "🎉 Selamat! Roadmap Selesai!" 
                : stats.progress > 0 
                ? "Terus semangat!" 
                : "Yuk mulai belajar!"}
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              {stats.completedTasks} dari {stats.totalTasks} task sudah selesai
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">
                <Calendar size={10} className="mr-1" />
                {formatDuration(goal.duration_weeks)}
              </Badge>
              <Badge variant="default">
                <Target size={10} className="mr-1" />
                {goal.level}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Time Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                {formatMinutes(stats.completedEstimatedMinutes)}
              </p>
              <p className="text-xs text-gray-400">Waktu Belajar</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Trophy size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                {formatMinutes(stats.totalEstimatedMinutes - stats.completedEstimatedMinutes)}
              </p>
              <p className="text-xs text-gray-400">Tersisa</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Breakdown */}
      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <Calendar size={16} className="text-primary-600" />
          Progress Per Minggu
        </h3>

        <div className="space-y-4">
          {stats.weeklyStats.map((week) => (
            <div key={week.week}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Minggu {week.week}
                  </span>
                  {week.progress === 100 && (
                    <CheckCircle2 size={14} className="text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {week.completed}/{week.total} tasks
                  </span>
                  <span className={`text-xs font-semibold ${
                    week.progress === 100 ? "text-green-500" : "text-primary-600"
                  }`}>
                    {week.progress}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    week.progress === 100 ? "bg-green-500" : "bg-primary-500"
                  }`}
                  style={{ width: `${week.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Task List Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-primary-600" />
          Ringkasan Task
        </h3>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {goal.roadmap.map((task) => (
            <div
              key={task._id}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                task.is_completed
                  ? "bg-green-50 text-green-700"
                  : "bg-surface-50 text-gray-600"
              }`}
            >
              {task.is_completed 
                ? <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                : <Circle size={15} className="text-gray-300 flex-shrink-0" />
              }
              <span className={task.is_completed ? "line-through" : ""}>
                W{task.week} D{task.day} — {task.topic}
              </span>
              <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                {task.estimated_time}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={() => router.push(`/goals/${id}`)}
          size="lg"
          className="w-full sm:w-auto"
        >
          <Target size={16} className="mr-2" />
          Lanjut Belajar
        </Button>
      </div>

    </div>
  );
}
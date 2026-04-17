"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';

import {
  ArrowLeft,
  Target,
  Calendar,
  BarChart2,
  Trash2,
  Loader2,
  CheckCircle2,
  Sparkles,
  TrendingUp,

} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import RoadmapView from "@/components/roadmap/RoadmapView";
import { calcProgress, formatDuration } from "@/lib/utils";

export default function GoalDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchGoal();
  }, [id]);

  const fetchGoal = async () => {
    try {
      const res = await fetch(`/api/goals/${id}`);
      const data = await res.json();
      if (data.success) setGoal(data.goal);
    } catch (error) {
      console.error("Error fetching goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin mau hapus goal ini?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting:", error);
      setDeleting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="animate-spin text-primary-500 mx-auto mb-3"
          />
          <p className="text-gray-500 text-sm">Memuat roadmap...</p>
        </div>
      </div>
    );
  }

  // Not found state
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

  const progress = calcProgress(goal.completed_tasks, goal.total_tasks);
  const levelColors = {
    beginner: "success",
    intermediate: "warning",
    advanced: "danger",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Kembali ke Dashboard
      </button>

      {/* Header Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={levelColors[goal.level]}>{goal.level}</Badge>
              <Badge variant="default">
                <Calendar size={10} className="mr-1" />
                {formatDuration(goal.duration_weeks)}
              </Badge>
              {progress === 100 && (
                <Badge variant="success">
                  <CheckCircle2 size={10} className="mr-1" />
                  Selesai! 🎉
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {goal.title}
            </h1>

            {goal.ai_summary && (
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                <Sparkles size={12} className="inline mr-1 text-primary-500" />
                {goal.ai_summary}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href={`/goals/${id}/progress`}>
              <Button variant="secondary" size="sm">
                <TrendingUp size={16} className="mr-1.5" />
                Progress
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-400 hover:text-red-600 hover:bg-red-50"
            >
              {deleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-5 pt-5 border-t border-surface-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Progress Keseluruhan
            </span>
            <span className="text-sm font-bold text-primary-600">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 bg-surface-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                progress === 100 ? "bg-green-500" : "bg-primary-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {goal.completed_tasks} dari {goal.total_tasks} task selesai
            </span>
            <span className="text-xs text-gray-400">
              {goal.total_tasks - goal.completed_tasks} task tersisa
            </span>
          </div>
        </div>
      </Card>

      {/* Roadmap */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Target size={18} className="text-primary-600" />
          Roadmap Belajar
        </h2>

        <RoadmapView
          goal={goal}
          onUpdate={(updatedGoal) => setGoal(updatedGoal)}
        />
      </div>
    </div>
  );
}

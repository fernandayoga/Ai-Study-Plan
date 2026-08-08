"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Sparkles, 
  Target, 
  CheckCircle2, 
  TrendingUp,
  Loader2,
  BookOpen
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import GoalCard from "@/components/goals/GoalCard";
import { calcProgress } from "@/lib/utils";

export default function DashboardPage() {
  const [goals, setGoals] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      if (data.success) {
        setGoals(data.goals);
        if (data.userName) setUserName(data.userName);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hitung statistik
  const stats = {
    total: goals.length,
    completed: goals.filter((g) => calcProgress(g.completed_tasks, g.total_tasks) === 100).length,
    inProgress: goals.filter((g) => {
      const p = calcProgress(g.completed_tasks, g.total_tasks);
      return p > 0 && p < 100;
    }).length,
    totalTasks: goals.reduce((acc, g) => acc + g.total_tasks, 0),
    completedTasks: goals.reduce((acc, g) => acc + g.completed_tasks, 0),
  };

  const overallProgress = calcProgress(stats.completedTasks, stats.totalTasks);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Halo, {userName || "Learner"}! 👋
          </h1>
          <p className="text-gray-300 text-sm mt-0.5">
            Siap untuk melanjutkan petualangan belajarmu hari ini?
          </p>
        </div>
          <Link href="/goals/new">
                <Button size="sm">
                  <Plus size={16} className="mr-1.5" />
                  New Goal
                </Button>
              </Link>
      </div>

      {/* Stats Cards */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <Target size={18} className="text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-gray-300">Total Goals</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
                <p className="text-xs text-gray-300">Selesai</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
                <p className="text-xs text-gray-300">Sedang Berjalan</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <BookOpen size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{overallProgress}%</p>
                <p className="text-xs text-gray-300">Overall Progress</p>
              </div>
            </div>
          </Card>

        </div>
      )}

      {/* Goals Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Rencana Belajar Kamu
        </h2>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary-400" />
          </div>
        )}

        {/* Empty State */}
        {!loading && goals.length === 0 && (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-2xl mb-4">
              <Sparkles size={28} className="text-primary-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">
              Belum Ada Rencana Belajar
            </h3>
            <p className="text-gray-300 text-sm mb-6 max-w-xs mx-auto">
              Buat rencana belajar pertamamu dan biarkan AI merancang roadmap yang personal untukmu.
            </p>
            <Link href="/goals/new">
              <Button>
                <Plus size={16} className="mr-2" />
                Buat Goal Pertama
              </Button>
            </Link>
          </Card>
        )}

        {/* Goals Grid */}
        {!loading && goals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
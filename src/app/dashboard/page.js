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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      if (data.success) setGoals(data.goals);
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Pantau semua rencana belajar kamu
          </p>
        </div>
        
      </div>

      {/* Stats Cards */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <Target size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-400">Total Goals</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-xs text-gray-400">Selesai</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                <p className="text-xs text-gray-400">Sedang Berjalan</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <BookOpen size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
                <p className="text-xs text-gray-400">Overall Progress</p>
              </div>
            </div>
          </Card>

        </div>
      )}

      {/* Goals Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Rencana Belajar Kamu
        </h2>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-primary-500" />
          </div>
        )}

        {/* Empty State */}
        {!loading && goals.length === 0 && (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4">
              <Sparkles size={28} className="text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Belum Ada Rencana Belajar
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
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
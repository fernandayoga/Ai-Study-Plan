"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, BookOpen, Clock, BarChart2, FileText, ArrowRight, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const levels = [
  { value: "beginner", label: "Beginner", desc: "Belum tahu sama sekali", emoji: "🌱" },
  { value: "intermediate", label: "Intermediate", desc: "Sudah tahu dasarnya", emoji: "🌿" },
  { value: "advanced", label: "Advanced", desc: "Sudah cukup berpengalaman", emoji: "🌳" },
];

const durations = [1, 2, 4, 8, 12];

export default function NewGoalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration_weeks: 4,
    level: "beginner",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validasi
    if (!form.title.trim()) {
      setError("Topik belajar tidak boleh kosong!");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal generate roadmap");

      // Redirect ke halaman detail goal
      router.push(`/goals/${data.goalId}`);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-md">
          <Sparkles size={24} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Buat Rencana Belajar
        </h1>
        <p className="text-gray-500">
          Ceritakan goal kamu, AI akan buatkan roadmap yang personal
        </p>
      </div>

      <Card className="p-8 space-y-8">

        {/* Input Topik */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <BookOpen size={16} className="text-primary-600" />
            Topik yang Ingin Dipelajari
          </label>
          <input
            type="text"
            placeholder="Contoh: React.js, Machine Learning, UI/UX Design..."
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-sm"
          />
        </div>

        {/* Input Deskripsi */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText size={16} className="text-primary-600" />
            Deskripsi Tambahan
            <span className="text-gray-400 font-normal">(opsional)</span>
          </label>
          <textarea
            placeholder="Contoh: Saya ingin belajar React untuk membuat web app, sudah tahu HTML & CSS dasar..."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-sm resize-none"
          />
        </div>

        {/* Pilih Level */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <BarChart2 size={16} className="text-primary-600" />
            Level Saat Ini
          </label>
          <div className="grid grid-cols-3 gap-3">
            {levels.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => handleChange("level", lvl.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  form.level === lvl.value
                    ? "border-primary-500 bg-primary-50"
                    : "border-surface-200 bg-white hover:border-surface-300"
                }`}
              >
                <div className="text-2xl mb-1">{lvl.emoji}</div>
                <div className={`text-sm font-semibold ${form.level === lvl.value ? "text-primary-600" : "text-gray-700"}`}>
                  {lvl.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{lvl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pilih Durasi */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Clock size={16} className="text-primary-600" />
            Durasi Belajar
          </label>
          <div className="flex flex-wrap gap-2">
            {durations.map((week) => (
              <button
                key={week}
                onClick={() => handleChange("duration_weeks", week)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${
                  form.duration_weeks === week
                    ? "border-primary-500 bg-primary-50 text-primary-600"
                    : "border-surface-200 bg-white text-gray-600 hover:border-surface-300"
                }`}
              >
                {week} {week === 1 ? "Minggu" : "Minggu"}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Preview */}
        {form.title && (
          <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Preview Goal</p>
            <p className="text-sm text-gray-700">
              Belajar <span className="font-semibold text-primary-600">"{form.title}"</span> selama{" "}
              <span className="font-semibold">{form.duration_weeks} minggu</span> untuk level{" "}
              <span className="font-semibold">{form.level}</span>.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              AI sedang membuat roadmap...
            </>
          ) : (
            <>
              <Sparkles size={18} className="mr-2" />
              Generate Roadmap dengan AI
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </Button>

        <p className="text-center text-xs text-gray-400">
          Proses generate membutuhkan 10-30 detik ⏱️
        </p>

      </Card>
    </div>
  );
}
/**
 * Parse JSON dari response AI yang mungkin mengandung
 * teks tambahan atau markdown
 */
export function parseAIResponse(rawText) {
  // Coba parse langsung dulu
  try {
    return JSON.parse(rawText);
  } catch {
    // Kalau gagal, coba ekstrak JSON dari dalam teks
  }

  // Coba ekstrak dari markdown code block ```json ... ```
  const markdownMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    try {
      return JSON.parse(markdownMatch[1]);
    } catch {
      // Lanjut ke cara berikutnya
    }
  }

  // Coba cari kurung kurawal pertama dan terakhir
  const firstBrace = rawText.indexOf("{");
  const lastBrace = rawText.lastIndexOf("}");
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    try {
      return JSON.parse(rawText.slice(firstBrace, lastBrace + 1));
    } catch {
      // Semua cara gagal
    }
  }

  // Kalau semua gagal, throw error
  throw new Error("Gagal parsing response AI. Silakan coba lagi.");
}

/**
 * Validasi struktur roadmap dari AI
 */
export function validateRoadmap(data) {
  const errors = [];

  if (!data.title || typeof data.title !== "string") {
    errors.push("Field 'title' tidak valid");
  }

  if (!data.tasks || !Array.isArray(data.tasks)) {
    errors.push("Field 'tasks' harus berupa array");
  } else if (data.tasks.length === 0) {
    errors.push("Tasks tidak boleh kosong");
  } else {
    // Cek struktur tiap task
    data.tasks.forEach((task, index) => {
      if (!task.week) errors.push(`Task[${index}]: field 'week' missing`);
      if (!task.day) errors.push(`Task[${index}]: field 'day' missing`);
      if (!task.topic) errors.push(`Task[${index}]: field 'topic' missing`);
      if (!task.task) errors.push(`Task[${index}]: field 'task' missing`);
      if (!task.estimated_time) errors.push(`Task[${index}]: field 'estimated_time' missing`);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format durasi minggu ke string yang readable
 */
export function formatDuration(weeks) {
  if (weeks === 1) return "1 Minggu";
  return `${weeks} Minggu`;
}

/**
 * Hitung persentase progress
 */
export function calcProgress(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}



/**
 * Hitung statistik detail dari roadmap
 */
export function calcDetailedStats(roadmap) {
  if (!roadmap || roadmap.length === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      progress: 0,
      weeklyStats: [],
      totalEstimatedMinutes: 0,
      completedEstimatedMinutes: 0,
    };
  }

  // Group by week
  const weekMap = {};
  roadmap.forEach((task) => {
    if (!weekMap[task.week]) {
      weekMap[task.week] = { total: 0, completed: 0 };
    }
    weekMap[task.week].total++;
    if (task.is_completed) weekMap[task.week].completed++;
  });

  const weeklyStats = Object.entries(weekMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([week, data]) => ({
      week: Number(week),
      total: data.total,
      completed: data.completed,
      progress: calcProgress(data.completed, data.total),
    }));

  // Estimasi total waktu (parse "1.5 jam" → menit)
  const parseMinutes = (timeStr) => {
    if (!timeStr) return 60;
    const match = timeStr.match(/(\d+\.?\d*)/);
    if (!match) return 60;
    const num = parseFloat(match[1]);
    if (timeStr.includes("menit")) return num;
    return num * 60; // jam ke menit
  };

  const totalEstimatedMinutes = roadmap.reduce(
    (acc, t) => acc + parseMinutes(t.estimated_time), 0
  );
  const completedEstimatedMinutes = roadmap
    .filter((t) => t.is_completed)
    .reduce((acc, t) => acc + parseMinutes(t.estimated_time), 0);

  return {
    totalTasks: roadmap.length,
    completedTasks: roadmap.filter((t) => t.is_completed).length,
    progress: calcProgress(
      roadmap.filter((t) => t.is_completed).length,
      roadmap.length
    ),
    weeklyStats,
    totalEstimatedMinutes,
    completedEstimatedMinutes,
  };
}

/**
 * Format menit ke jam & menit
 */
export function formatMinutes(minutes) {
  if (minutes < 60) return `${Math.round(minutes)} menit`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (mins === 0) return `${hours} jam`;
  return `${hours} jam ${mins} menit`;
}
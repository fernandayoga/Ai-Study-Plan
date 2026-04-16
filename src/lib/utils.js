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
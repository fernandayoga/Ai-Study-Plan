import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">AI Study Planner</span>
          </div>
          <p className="text-xs text-gray-400">
            Built with Next.js & AI ✨
          </p>
        </div>
      </div>
    </footer>
  );
}
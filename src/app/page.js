import Link from "next/link";
import { 
  Sparkles, 
  Target, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// Data fitur
const features = [
  {
    icon: Brain,
    title: "AI-Powered Roadmap",
    description: "Masukkan goal kamu, AI akan buatkan rencana belajar yang terstruktur dan personal.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Calendar,
    title: "Task Harian Terstruktur",
    description: "Roadmap dipecah jadi task harian yang jelas — tinggal ikuti dan selesaikan.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Pantau kemajuan belajar kamu setiap hari dengan visual progress yang motivating.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description: "Setiap rencana disesuaikan dengan level dan durasi belajar yang kamu tentukan.",
    color: "bg-orange-50 text-orange-600",
  },
];

// Data steps
const steps = [
  { number: "01", title: "Tentukan Goal", desc: "Tulis topik yang ingin kamu pelajari, durasi, dan level kamu saat ini." },
  { number: "02", title: "Generate Roadmap", desc: "AI akan menganalisis dan membuat roadmap belajar yang personal untukmu." },
  { number: "03", title: "Mulai Belajar", desc: "Ikuti task harian dan tandai progress kamu setiap hari." },
];

export default function Home() {
  return (
    <div className="overflow-hidden">

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40 -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Sparkles size={14} />
          Powered by AI
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Belajar Lebih Cerdas
          <br />
          <span className="text-primary-600">Bersama AI</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Ceritakan goal belajar kamu, dan biarkan AI merancang 
          roadmap personal yang terstruktur — dari hari pertama sampai selesai.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/goals/new">
            <Button size="lg">
              <Sparkles size={18} className="mr-2" />
              Buat Rencana Belajar
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">
              Lihat Dashboard
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-y border-surface-200 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-gray-500">Fitur lengkap untuk perjalanan belajar yang efektif</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.color} mb-4`}>
                  <feature.icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Cara Kerjanya
          </h2>
          <p className="text-gray-500">3 langkah mudah untuk mulai belajar dengan terstruktur</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-1/2 w-full h-px bg-surface-200 -z-10" />
              )}

              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white text-xl font-bold mb-4 shadow-md">
                {step.number}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siap Mulai Belajar?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Buat rencana belajar pertamamu sekarang — gratis dan powered by AI.
          </p>
          <Link href="/goals/new">
            <Button 
              size="lg" 
              className="bg-white text-red-500 hover:bg-primary-50 shadow-lg"
            >
              <Sparkles size={18} className="mr-2" />
              Mulai Sekarang — Gratis!
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
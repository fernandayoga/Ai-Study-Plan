"use client";
import { usePathname } from "next/navigation";
import ColorBends from "./ColorBends";

export default function AppBackground() {
  const pathname = usePathname();

  if (pathname !== "/") {
    return <div className="fixed inset-0 z-[-1] bg-[#0b0410]" />;
  }

  return (
    <div className="fixed inset-0 z-[-1] bg-[#0b0410]">
      <ColorBends
        colors={["#a855f7", "#7e22ce", "#11001c"]}
        rotation={90}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        noise={0.15}
        parallax={0.5}
        iterations={1}
        intensity={1.0}
        bandWidth={6}
        transparent
        autoRotate={0}
      />
    </div>
  );
}

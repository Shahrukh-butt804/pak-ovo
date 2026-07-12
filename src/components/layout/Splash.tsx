import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

export function Splash() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("pakovo-splash-seen");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("pakovo-splash-seen", "1");
    const t = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-hero-gradient animate-splash-fade"
      aria-hidden
    >
      <div className="animate-splash-pop flex flex-col items-center">
        <img src={logo} alt="PakOvo" width={140} height={140} className="h-32 w-32 object-contain" />
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Premium Lifestyle
        </p>
      </div>
      <div className="mt-10 h-[2px] w-48 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-brand animate-progress" />
      </div>
    </div>
  );
}
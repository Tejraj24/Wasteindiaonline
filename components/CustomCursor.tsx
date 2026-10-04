"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop pointer devices
    if (window.innerWidth < 992 || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { xPercent: 20, yPercent: 20 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let xPercent = 20;
      let yPercent = 20;

      if (clientX > windowWidth * 0.85) {
        xPercent = -120;
      }
      if (clientY > windowHeight * 0.85) {
        yPercent = -120;
      }

      gsap.to(cursor, {
        xPercent,
        yPercent,
        duration: 0.2,
        ease: "power2.out",
      });

      xTo(clientX);
      yTo(clientY);

      // Check if hovering an element with data-cursor
      const target = (e.target as HTMLElement)?.closest("[data-cursor]") as HTMLElement | null;
      if (target) {
        const text = target.getAttribute("data-cursor") || "";
        setCursorText(text);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[999] transition-opacity duration-200 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
    >
      <div className="bg-brand-blue text-white px-3 py-1.5 rounded-full shadow-lg flex items-center justify-center">
        <span
          ref={textRef}
          className="text-[11px] font-bold tracking-widest uppercase whitespace-nowrap"
        >
          {cursorText}
        </span>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const springX = useSpring(0, { stiffness: 100, damping: 20 });
  const springY = useSpring(0, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springX, springY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2"
      style={{
        x: springX,
        y: springY,
      }}
    />
  );
}

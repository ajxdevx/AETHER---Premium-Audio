"use client";

import { useEffect } from "react";

export function HomePageBackground() {
  useEffect(() => {
    document.body.classList.add("home-page");

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

export function ConsoleEgg() {
  useEffect(() => {
    console.log(
      "%c⬡ QATALYST",
      [
        "color: #0d9488",
        "font-size: 22px",
        "font-weight: 900",
        "letter-spacing: -0.04em",
        "line-height: 1.6",
      ].join(";")
    );
    console.log(
      "%cInstitutional-grade carbon credit analysis.\nBuilt for the people who care about what comes next.\n\nCurious how this was built? We'd love to talk.",
      "color: #4b5563; font-size: 11px; line-height: 1.7;"
    );
  }, []);

  return null;
}

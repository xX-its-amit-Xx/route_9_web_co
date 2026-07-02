"use client";

import { useEffect } from "react";

/**
 * Two invisible meta touches, both referenced by the Design Lens:
 *
 * 1. Tab-title wink — when the visitor switches tabs, the title changes to
 *    a gentle call-back; restored the moment they return. A retention trick
 *    the lens openly confesses to ("open a different tab, then look at
 *    this one's title") — the demo IS the pitch.
 *
 * 2. Console note — a styled message for anyone who opens DevTools.
 *    Developers poke; shop owners hire developers who leave notes.
 */
export function MetaTricks() {
  useEffect(() => {
    const original = document.title;
    const away = "Your customers won't wait this long — Route 9 Web";

    const onVisibility = () => {
      document.title = document.hidden ? away : original;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, []);

  useEffect(() => {
    // Once per session — a console.log on every remount would be spam.
    if (sessionStorage.getItem("r9_console_note")) return;
    sessionStorage.setItem("r9_console_note", "1");
    console.log(
      "%cRoute 9 Web%c\n\nInspecting the inspector? Respect.\nThe Design Lens (bottom of the page) does this without F12 —\nnumbered pins explaining every trick on this site while it's used on you.\n\nBuilt in Shrewsbury. Hire someone who leaves notes.\n→ hello@route9web.com",
      "font-size:16px;font-weight:bold;color:#D4682A;",
      "font-size:12px;color:#7A6B5C;line-height:1.6;"
    );
  }, []);

  return null;
}

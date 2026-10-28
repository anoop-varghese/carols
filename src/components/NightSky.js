import React, { useEffect, useRef, useState } from "react";
import "./NightSky.css";

const stars = [
  [3, 11, 2], [9, 39, 1], [15, 77, 2], [21, 18, 1], [27, 61, 1],
  [32, 91, 2], [38, 8, 1], [44, 47, 2], [50, 83, 1], [56, 24, 1],
  [61, 71, 2], [67, 13, 1], [72, 53, 1], [78, 96, 2], [84, 35, 1],
  [89, 66, 1], [95, 16, 2], [6, 70, 1], [24, 96, 1], [40, 72, 1],
  [58, 4, 2], [74, 86, 1], [91, 5, 1], [12, 54, 1], [35, 33, 1],
  [64, 41, 1], [82, 59, 2], [97, 89, 1],
];

export default function NightSky({ active }) {
  const skyRef = useRef(null);
  const [shootingStar, setShootingStar] = useState(null);

  useEffect(() => {
    if (!active) {
      setShootingStar(null);
      return;
    }

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let launchTimer;
    let hideTimer;
    let shotId = 0;

    function scheduleLaunch() {
      launchTimer = window.setTimeout(launch, 15000 + Math.random() * 5000);
    }

    function launch() {
      if (!reducedMotion?.matches && document.visibilityState !== "hidden") {
        const width = skyRef.current.clientWidth;
        const height = skyRef.current.clientHeight;
        const direction = Math.random() < .5 ? "ltr" : "rtl";
        const angle = 9 + Math.random() * 3;
        const startY = 40 + Math.random() * Math.min(120, height * .27);
        setShootingStar({
          id: ++shotId,
          direction,
          startX: direction === "ltr" ? -130 : width + 130,
          endX: direction === "ltr" ? width + 130 : -130,
          startY,
          endY: startY + Math.tan(angle * Math.PI / 180) * (width + 260),
          angle: direction === "ltr" ? angle : -angle,
        });
        hideTimer = window.setTimeout(() => setShootingStar(null), 1400);
      }
      scheduleLaunch();
    }

    function handleMotionChange() {
      if (reducedMotion?.matches) {
        window.clearTimeout(launchTimer);
        window.clearTimeout(hideTimer);
        setShootingStar(null);
      } else {
        window.clearTimeout(launchTimer);
        scheduleLaunch();
      }
    }

    if (!reducedMotion?.matches) scheduleLaunch();
    reducedMotion?.addEventListener?.("change", handleMotionChange);
    return () => {
      window.clearTimeout(launchTimer);
      window.clearTimeout(hideTimer);
      reducedMotion?.removeEventListener?.("change", handleMotionChange);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const sky = skyRef.current;
    const scene = sky.parentElement;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia?.("(pointer: fine)");
    let pointerX = 0;
    let pointerY = 0;
    let frame = 0;

    function renderParallax() {
      frame = 0;
      const still = reducedMotion?.matches;
      const scroll = still ? 0 : Math.min(window.scrollY, 700);
      const x = still ? 0 : pointerX;
      const y = still ? 0 : pointerY;
      sky.style.setProperty("--stars-x", `${x * 7}px`);
      sky.style.setProperty("--stars-y", `${y * 5 + scroll * .12}px`);
      sky.style.setProperty("--moon-x", `${x * 11}px`);
      sky.style.setProperty("--moon-y", `${y * 8 + scroll * .2}px`);
      sky.style.setProperty("--santa-x", `${x * 18}px`);
      sky.style.setProperty("--santa-y", `${y * 12 + scroll * .34}px`);
      const foregroundScroll = Math.min(scroll, 360);
      scene.style.setProperty("--hero-parallax-y", `${foregroundScroll * 1.2}px`);
      scene.style.setProperty("--hero-parallax-opacity", `${Math.max(0, Math.min(1, (190 - scroll) / 70))}`);
      scene.style.setProperty("--forest-parallax-y", `${foregroundScroll * .28}px`);
    }

    function scheduleParallax() {
      if (!frame) frame = window.requestAnimationFrame(renderParallax);
    }

    function handlePointerMove(event) {
      if (!finePointer?.matches) return;
      pointerX = event.clientX / window.innerWidth - .5;
      pointerY = event.clientY / window.innerHeight - .5;
      scheduleParallax();
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    reducedMotion?.addEventListener?.("change", scheduleParallax);
    scheduleParallax();
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", scheduleParallax);
      reducedMotion?.removeEventListener?.("change", scheduleParallax);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [active]);

  return (
    <div className="night-sky" ref={skyRef} aria-hidden="true">
      <div className="night-stars">
        {stars.map(([top, left, size], index) => (
          <span
            className={`night-star night-star--${size}`}
            key={index}
            style={{ top: `${top}%`, left: `${left}%`, animationDelay: `${-index * .37}s` }}
          />
        ))}
      </div>
      <div className="night-moon" />
      {shootingStar && (
        <span
          key={shootingStar.id}
          className={`shooting-star shooting-star--${shootingStar.direction}`}
          style={{
            "--shoot-start-x": `${shootingStar.startX}px`,
            "--shoot-end-x": `${shootingStar.endX}px`,
            "--shoot-start-y": `${shootingStar.startY}px`,
            "--shoot-end-y": `${shootingStar.endY}px`,
            "--shoot-angle": `${shootingStar.angle}deg`,
          }}
        />
      )}
      <svg className="santa-flight" viewBox="0 0 360 170" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="santa-harness" d="M111 87C139 75 150 82 177 104" stroke="#DDBF79" strokeWidth="2" />
        <path d="M51 81C42 75 40 67 42 61M50 80C50 69 52 64 58 58M55 80C64 70 64 64 65 59" stroke="#8D6944" strokeWidth="3" strokeLinecap="round" />
        <path d="M59 90C63 82 73 79 79 81L93 89L114 91C120 92 121 97 117 100L106 104L96 101L88 107L64 104C57 102 54 97 59 90Z" fill="#A17A50" />
        <path d="M64 100L56 117M91 103L88 119M106 102L111 115" stroke="#A17A50" strokeWidth="5" strokeLinecap="round" />
        <path d="M104 92L115 85L122 87L118 93" fill="#A17A50" />
        <circle cx="116" cy="89" r="1.8" fill="#172F24" />
        <path d="M171 113C187 126 266 129 289 113L301 103L295 125C277 143 193 145 172 126Z" fill="#9D3434" />
        <path d="M171 113C187 126 266 129 289 113L301 103" stroke="#E8C780" strokeWidth="4" strokeLinecap="round" />
        <path d="M190 137C210 147 275 148 302 136M184 132L183 140M283 134L290 142" stroke="#D7B471" strokeWidth="4" strokeLinecap="round" />
        <path d="M245 101C250 74 261 62 276 68C291 75 299 93 293 108Z" fill="#833B3E" />
        <path d="M245 101C259 94 274 97 293 108" stroke="#BE7369" strokeWidth="3" />
        <path d="M208 105C205 90 209 77 224 74C240 70 253 84 250 106Z" fill="#AD3C3A" />
        <path d="M220 75C221 62 228 56 237 56C247 58 251 67 245 78" fill="#E7BF9F" />
        <path d="M223 72C229 82 242 83 247 74C244 91 228 91 223 72Z" fill="#F7EFE0" />
        <path d="M219 61C224 45 240 41 249 55L261 57L253 63Z" fill="#B13D3B" />
        <path d="M217 62C226 59 242 59 253 63" stroke="#F7EFE0" strokeWidth="7" strokeLinecap="round" />
        <circle cx="261" cy="57" r="5" fill="#F7EFE0" />
        <path d="M209 95L198 89L192 94M249 94L260 86L268 88" stroke="#AE3D3A" strokeWidth="8" strokeLinecap="round" />
        <circle cx="191" cy="94" r="5" fill="#F7EFE0" />
        <circle cx="268" cy="88" r="5" fill="#F7EFE0" />
        <path d="M179 108L168 100L177 100M195 109L188 100L195 100" stroke="#E8C780" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

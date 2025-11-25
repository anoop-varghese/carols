import React, { useState } from "react";
import "./Forest.css";

export default function Forest() {
  const [lightsOn, setLightsOn] = useState(() => {
    // initialize all lights on by default
    const keys = new Set([
      "small-0",
      "small-1",
      "small-2",
      "medium-0",
      "medium-1",
      "medium-2",
      "medium-3",
      "large-0",
      "large-1",
      "large-2",
      "large-3",
      "large-4",
      "xsmall-0",
      "xsmall-1",
      "small2-0",
      "small2-1",
      "small2-2",
    ]);
    return keys;
  });

  function toggleLight(key) {
    setLightsOn((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function isLightOn(key) {
    return lightsOn.has(key);
  }

  return (
    <>
      <div className="forest">
        {/* Forest */}
        <svg
          className="tree tree--small"
          viewBox="0 0 120 180"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Small tree"
        >
          <title>Tree small</title>
          <rect x="52" y="150" width="16" height="20" rx="2" fill="#6b3f12" />
          <polygon points="60,10 12,90 108,90" fill="#0a4b2a" />
          <polygon points="60,50 20,110 100,110" fill="#0b6623" />
          {/* Lights */}
          <g className="lights">
            <circle
              className={`light light--red ${
                isLightOn("small-0") ? "on" : "off"
              }`}
              cx="48"
              cy="70"
              r="3"
              data-key="small-0"
              tabIndex={0}
              role="button"
              aria-pressed={isLightOn("small-0")}
              onClick={() => toggleLight("small-0")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleLight("small-0");
                }
              }}
            />
            <circle
              className={`light light--yellow ${
                isLightOn("small-1") ? "on" : "off"
              }`}
              cx="72"
              cy="58"
              r="3"
              data-key="small-1"
              tabIndex={0}
              role="button"
              aria-pressed={isLightOn("small-1")}
              onClick={() => toggleLight("small-1")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleLight("small-1");
                }
              }}
            />
            <circle
              className={`light light--green ${
                isLightOn("small-2") ? "on" : "off"
              }`}
              cx="60"
              cy="94"
              r="3"
              data-key="small-2"
              tabIndex={0}
              role="button"
              aria-pressed={isLightOn("small-2")}
              onClick={() => toggleLight("small-2")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleLight("small-2");
                }
              }}
            />
          </g>
          <path
            className="garland-path"
            d="M20 80 Q60 56 100 80"
            fill="none"
            stroke="#7a3"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <svg
          className="tree tree--medium"
          viewBox="0 0 120 180"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Medium tree"
        >
          <title>Tree medium</title>
          <rect x="52" y="150" width="16" height="20" rx="2" fill="#6b3f12" />
          <polygon points="60,8 10,86 110,86" fill="#0a4b2a" />
          <polygon points="60,48 18,108 102,108" fill="#0b6623" />
          <circle cx="60" cy="20" r="5" fill="#f2c94c" />
          <g className="lights">
            {["medium-0", "medium-1", "medium-2", "medium-3"].map((k, i) => {
              const coords = [
                [38, 64],
                [70, 46],
                [52, 92],
                [84, 82],
              ][i];
              const cls =
                i === 0
                  ? "light--red"
                  : i === 1
                  ? "light--blue"
                  : i === 2
                  ? "light--yellow"
                  : "light--green";
              return (
                <circle
                  key={k}
                  className={`light ${cls} ${isLightOn(k) ? "on" : "off"}`}
                  cx={coords[0]}
                  cy={coords[1]}
                  r={3}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isLightOn(k)}
                  onClick={() => toggleLight(k)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleLight(k);
                    }
                  }}
                />
              );
            })}
          </g>
          <path
            className="garland-path"
            d="M16 72 Q60 44 104 72"
            fill="none"
            stroke="#b91d47"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <svg
          className="tree tree--large"
          viewBox="0 0 140 200"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Large tree"
        >
          <title>Tree large</title>
          <rect x="62" y="170" width="16" height="24" rx="2" fill="#6b3f12" />
          <polygon points="70,6 14,108 126,108" fill="#0a4b2a" />
          <polygon points="70,56 24,128 116,128" fill="#0b6623" />
          <polygon points="70,96 34,156 106,156" fill="#0e7a2e" />
          <circle cx="70" cy="18" r="6" fill="#f2c94c" />
          <g className="lights">
            {["large-0", "large-1", "large-2", "large-3", "large-4"].map(
              (k, i) => {
                const coords = [
                  [54, 72],
                  [86, 68],
                  [70, 102],
                  [46, 120],
                  [96, 122],
                ][i];
                const cls =
                  i === 0 || i === 4
                    ? "light--red"
                    : i === 1
                    ? "light--green"
                    : i === 2
                    ? "light--blue"
                    : "light--yellow";
                return (
                  <circle
                    key={k}
                    className={`light ${cls} ${isLightOn(k) ? "on" : "off"}`}
                    cx={coords[0]}
                    cy={coords[1]}
                    r={i === 2 ? 4 : 3.5}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isLightOn(k)}
                    onClick={() => toggleLight(k)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleLight(k);
                      }
                    }}
                  />
                );
              }
            )}
          </g>
          <path
            className="garland-path"
            d="M30 86 Q70 66 110 86"
            fill="none"
            stroke="#f2c94c"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <svg
          className="tree tree--xsmall"
          viewBox="0 0 100 150"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="XSmall tree"
        >
          <title>Tree xsmall</title>
          <rect x="40" y="120" width="12" height="18" rx="2" fill="#6b3f12" />
          <polygon points="50,14 8,80 92,80" fill="#0a4b2a" />
          <g className="lights">
            <circle
              className="light light--yellow"
              cx="40"
              cy="46"
              r="2.5"
              data-key="xsmall-0"
            />
            <circle
              className="light light--red"
              cx="62"
              cy="60"
              r="2.5"
              data-key="xsmall-1"
            />
          </g>
          <path
            className="garland-path"
            d="M18 56 Q50 36 82 56"
            fill="none"
            stroke="#7a3"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>

        <svg
          className="tree tree--small-2"
          viewBox="0 0 110 170"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Small tree 2"
        >
          <title>Tree small 2</title>
          <rect x="48" y="140" width="14" height="20" rx="2" fill="#6b3f12" />
          <polygon points="55,12 10,86 100,86" fill="#0a4b2a" />
          <g className="lights">
            <circle
              className="light light--green"
              cx="40"
              cy="68"
              r="3"
              data-key="small2-0"
            />
            <circle
              className="light light--yellow"
              cx="70"
              cy="54"
              r="3"
              data-key="small2-1"
            />
            <circle
              className="light light--red"
              cx="82"
              cy="92"
              r="3"
              data-key="small2-2"
            />
          </g>
          <path
            className="garland-path"
            d="M22 76 Q54 56 86 76"
            fill="none"
            stroke="#b91d47"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div className="candy" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <title>Candy cane</title>
          <path
            d="M10 36 C10 26,30 26,30 16"
            stroke="#fff"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M10 36 C10 26,30 26,30 16"
            stroke="#b91d47"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
        </svg>
      </div>
    </>
  );
}

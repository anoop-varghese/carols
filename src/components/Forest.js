import React, { useState } from "react";
import "./Forest.css";

const trimmings = {
  small: {
    star: [60, 9, 1],
    garlands: ["M30 104 Q60 90 90 104", "M37 134 Q60 121 83 134"],
    bulbs: [[53, 43, "gold"], [77, 83, "ice"], [35, 101, "rose"], [79, 104, "gold"], [46, 125, "ice"], [72, 138, "rose"]],
    ornaments: [[61, 68, "red"], [52, 111, "gold"], [65, 128, "silver"]],
  },
  medium: {
    star: [60, 8, 1.1],
    garlands: ["M29 101 Q60 84 91 101", "M36 136 Q60 121 84 136"],
    bulbs: [[49, 40, "gold"], [83, 69, "rose"], [36, 95, "ice"], [77, 100, "gold"], [45, 124, "rose"], [73, 139, "ice"]],
    ornaments: [[62, 72, "silver"], [58, 111, "red"], [67, 130, "gold"]],
  },
  large: {
    star: [70, 8, 1.35],
    garlands: ["M33 116 Q70 99 107 116", "M43 145 Q70 131 97 145"],
    bulbs: [[63, 44, "gold"], [99, 85, "ice"], [39, 99, "rose"], [84, 109, "gold"], [56, 133, "ice"], [82, 145, "rose"], [69, 151, "gold"]],
    ornaments: [[72, 74, "red"], [59, 115, "silver"], [94, 116, "gold"], [69, 139, "red"]],
  },
  xsmall: {
    star: [50, 13, .9],
    garlands: ["M22 87 Q50 74 78 87", "M30 111 Q50 101 70 111"],
    bulbs: [[53, 38, "gold"], [30, 72, "ice"], [70, 75, "rose"], [38, 92, "gold"], [62, 94, "ice"], [48, 110, "rose"]],
    ornaments: [[55, 68, "red"], [47, 82, "silver"], [58, 109, "gold"]],
  },
  small2: {
    star: [55, 11, 1],
    garlands: ["M24 101 Q55 86 86 101", "M31 130 Q55 117 79 130"],
    bulbs: [[47, 40, "gold"], [76, 77, "ice"], [31, 96, "rose"], [62, 100, "gold"], [42, 123, "ice"], [70, 130, "rose"]],
    ornaments: [[56, 70, "silver"], [49, 111, "red"], [60, 127, "gold"]],
  },
};

function TreeTrimmings({ variant }) {
  const { star, garlands, bulbs, ornaments } = trimmings[variant];
  return (
    <g className="tree-trimmings" aria-hidden="true">
      {garlands.map((path) => <path key={path} className="tree-garland" d={path} />)}
      {ornaments.map(([x, y, color], index) => (
        <g key={index}>
          <circle className={`tree-ornament tree-ornament--${color}`} cx={x} cy={y} r="4" />
          <circle className="tree-ornament-glint" cx={x - 1.2} cy={y - 1.3} r="1" />
        </g>
      ))}
      {bulbs.map(([x, y, color], index) => (
        <circle
          key={index}
          className={`tree-bulb tree-bulb--${color}`}
          cx={x}
          cy={y}
          r="2.7"
          style={{ animationDelay: `${-index * .43}s` }}
        />
      ))}
      <polygon
        className="tree-star"
        points="0,-6 1.8,-1.8 6,-1.8 2.6,1 3.8,5.4 0,3 -3.8,5.4 -2.6,1 -6,-1.8 -1.8,-1.8"
        transform={`translate(${star[0]} ${star[1]}) scale(${star[2]})`}
      />
    </g>
  );
}

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
          <polygon points="60,82 28,150 92,150" fill="#0e7a2e" />
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
            strokeWidth="2"
            strokeLinecap="round"
          />
          <TreeTrimmings variant="small" />
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
          <polygon points="60,80 26,150 94,150" fill="#0e7a2e" />
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
            strokeWidth="2"
            strokeLinecap="round"
          />
          <TreeTrimmings variant="medium" />
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
            strokeWidth="2"
            strokeLinecap="round"
          />
          <TreeTrimmings variant="large" />
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
          <polygon points="50,46 15,100 85,100" fill="#0b6623" />
          <polygon points="50,74 22,120 78,120" fill="#0e7a2e" />
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
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <TreeTrimmings variant="xsmall" />
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
          <polygon points="55,48 17,108 93,108" fill="#0b6623" />
          <polygon points="55,80 24,140 86,140" fill="#0e7a2e" />
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
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <TreeTrimmings variant="small2" />
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

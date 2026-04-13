import React from "react";

interface SomIconProps {
  className?: string;
}

export function SomIcon({ className }: SomIconProps) {
  return (
    <svg
      viewBox="0 0 38.382152 54.901043"
      className={className}
      width="1em"
      height="1em"
      fill="currentColor"
    >
      <g transform="translate(-37.041666,-115.28805)">
        <path
          d="m 225,435.73438 a 84.999991,84.999991 0 0 0 -85,85 84.999991,84.999991 0 0 0 85,85 84.999991,84.999991 0 0 0 60.06641,-24.9336 L 267.40039,563.13477 A 60,60 0 0 1 225,580.73438 a 60,60 0 0 1 -60,-60 60,60 0 0 1 60,-60 60,60 0 0 1 42.40039,17.5996 l 17.66602,-17.66601 A 84.999991,84.999991 0 0 0 225,435.73438 Z m -85,182.5 v 25 h 145.06641 v -25 z"
          transform="scale(0.26458333)"
        />
      </g>
    </svg>
  );
}

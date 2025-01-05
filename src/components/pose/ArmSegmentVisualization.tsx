import React from 'react';
import { Landmark } from '../../types';

interface ArmSegmentVisualizationProps {
  elbow: Landmark | null;
  shoulder: Landmark | null;
  color: string;
}

export const ArmSegmentVisualization: React.FC<ArmSegmentVisualizationProps> = ({
  elbow,
  shoulder,
  color
}) => {
  if (!elbow || !shoulder) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none">
      <line
        x1={`${shoulder.x * 100}%`}
        y1={`${shoulder.y * 100}%`}
        x2={`${elbow.x * 100}%`}
        y2={`${elbow.y * 100}%`}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle
        cx={`${shoulder.x * 100}%`}
        cy={`${shoulder.y * 100}%`}
        r="4"
        fill={color}
      />
      <circle
        cx={`${elbow.x * 100}%`}
        cy={`${elbow.y * 100}%`}
        r="4"
        fill={color}
      />
    </svg>
  );
};
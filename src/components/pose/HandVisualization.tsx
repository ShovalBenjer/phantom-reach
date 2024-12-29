import React from 'react';
import { ThreeDHand } from './ThreeDHand';
import { AmputationType, Landmark } from '../../types';

interface HandVisualizationProps {
  isDetectionActive: boolean;
  isVirtualHandEnabled: boolean;
  amputationType: AmputationType;
  leftElbow: Landmark | null;
  rightElbow: Landmark | null;
  leftShoulder: Landmark | null;
  rightShoulder: Landmark | null;
}

export const HandVisualization: React.FC<HandVisualizationProps> = ({
  isDetectionActive,
  isVirtualHandEnabled,
  amputationType,
  leftElbow,
  rightElbow,
  leftShoulder,
  rightShoulder,
}) => {
  if (!isDetectionActive) return null;

  return (
    <>
      {amputationType === 'left_arm' && (
        <ThreeDHand
          isEnabled={isVirtualHandEnabled}
          isDetectionActive={isDetectionActive}
          elbow={leftElbow}
          shoulder={leftShoulder}
        />
      )}
      {amputationType === 'right_arm' && (
        <ThreeDHand
          isEnabled={isVirtualHandEnabled}
          isDetectionActive={isDetectionActive}
          elbow={rightElbow}
          shoulder={rightShoulder}
        />
      )}
      {amputationType === 'both' && (
        <>
          <ThreeDHand
            isEnabled={isVirtualHandEnabled}
            isDetectionActive={isDetectionActive}
            elbow={leftElbow}
            shoulder={leftShoulder}
          />
          <ThreeDHand
            isEnabled={isVirtualHandEnabled}
            isDetectionActive={isDetectionActive}
            elbow={rightElbow}
            shoulder={rightShoulder}
          />
        </>
      )}
    </>
  );
};
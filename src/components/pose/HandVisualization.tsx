import React, { useState, useEffect } from 'react';
import { ThreeDHand } from './ThreeDHand';
import { CalibrationSystem, CalibrationData } from './CalibrationSystem';
import { HandModelSelector, HandModel } from './HandModelSelector';
import { gestureRecognitionService } from '../../services/gestureRecognition';
import { toast } from '@/hooks/use-toast';
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
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationData, setCalibrationData] = useState<CalibrationData | null>(null);
  const [handModel, setHandModel] = useState<HandModel>('realistic');
  const [lastGesture, setLastGesture] = useState<string | null>(null);

  useEffect(() => {
    if (isDetectionActive && leftElbow && leftShoulder) {
      const gestureResult = gestureRecognitionService.detectGesture([leftElbow, leftShoulder]);
      if (gestureResult && gestureResult.gesture !== lastGesture) {
        setLastGesture(gestureResult.gesture);
        toast({
          title: "Gesture Detected",
          description: `Detected ${gestureResult.gesture} gesture`,
        });
      }
    }
  }, [isDetectionActive, leftElbow, leftShoulder, lastGesture]);

  const handleCalibrationComplete = (data: CalibrationData) => {
    setCalibrationData(data);
    setIsCalibrating(false);
    toast({
      title: "Calibration Complete",
      description: "Your movements have been calibrated for better tracking.",
    });
  };

  if (!isDetectionActive) return null;

  return (
    <>
      <div className="absolute top-4 right-4 space-y-4 z-10">
        <HandModelSelector
          currentModel={handModel}
          onModelChange={setHandModel}
        />
        <button
          onClick={() => setIsCalibrating(true)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Calibrate
        </button>
      </div>

      {isCalibrating && (
        <CalibrationSystem
          isActive={true}
          onComplete={handleCalibrationComplete}
          onCancel={() => setIsCalibrating(false)}
        />
      )}

      {amputationType === 'left_arm' && (
        <ThreeDHand
          isEnabled={isVirtualHandEnabled}
          isDetectionActive={isDetectionActive}
          elbow={leftElbow}
          shoulder={leftShoulder}
          handModel={handModel}
          calibrationData={calibrationData}
        />
      )}
      {amputationType === 'right_arm' && (
        <ThreeDHand
          isEnabled={isVirtualHandEnabled}
          isDetectionActive={isDetectionActive}
          elbow={rightElbow}
          shoulder={rightShoulder}
          handModel={handModel}
          calibrationData={calibrationData}
        />
      )}
      {amputationType === 'both' && (
        <>
          <ThreeDHand
            isEnabled={isVirtualHandEnabled}
            isDetectionActive={isDetectionActive}
            elbow={leftElbow}
            shoulder={leftShoulder}
            handModel={handModel}
            calibrationData={calibrationData}
          />
          <ThreeDHand
            isEnabled={isVirtualHandEnabled}
            isDetectionActive={isDetectionActive}
            elbow={rightElbow}
            shoulder={rightShoulder}
            handModel={handModel}
            calibrationData={calibrationData}
          />
        </>
      )}
    </>
  );
};
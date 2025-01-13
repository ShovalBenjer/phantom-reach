import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Landmark } from '../../types';

interface CalibrationSystemProps {
  isActive: boolean;
  onComplete: (calibrationData: CalibrationData) => void;
  onCancel: () => void;
}

export interface CalibrationData {
  armLength: number;
  shoulderWidth: number;
  rangeOfMotion: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export const CalibrationSystem: React.FC<CalibrationSystemProps> = ({
  isActive,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [calibrationData, setCalibrationData] = useState<Partial<CalibrationData>>({});

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      setProgress(0);
      setCalibrationData({});
      return;
    }

    const currentStep = steps[step];
    if (!currentStep) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const stepProgress = Math.min((elapsed / currentStep.duration) * 100, 100);
      setProgress(stepProgress);

      if (stepProgress >= 100) {
        if (step < steps.length - 1) {
          setStep(s => s + 1);
          setProgress(0);
        } else {
          // Calibration complete
          if (calibrationData.shoulderWidth && calibrationData.rangeOfMotion) {
            onComplete(calibrationData as CalibrationData);
            toast({
              title: "Calibration Complete",
              description: "Your movements have been calibrated for better tracking.",
            });
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, step, calibrationData, onComplete]);

  const steps = [
    {
      instruction: "Stand in a T-pose with arms extended",
      duration: 3000,
      action: (landmarks: Landmark[]) => {
        if (landmarks[11] && landmarks[12]) {
          const shoulderWidth = Math.abs(landmarks[11].x - landmarks[12].x);
          setCalibrationData(prev => ({ ...prev, shoulderWidth }));
        }
      }
    },
    {
      instruction: "Move your arms in circular motions",
      duration: 5000,
      action: (landmarks: Landmark[]) => {
        if (landmarks[13] && landmarks[14]) {
          const { x, y } = landmarks[13];
          setCalibrationData(prev => ({
            ...prev,
            rangeOfMotion: {
              minX: Math.min(x, prev.rangeOfMotion?.minX ?? x),
              maxX: Math.max(x, prev.rangeOfMotion?.maxX ?? x),
              minY: Math.min(y, prev.rangeOfMotion?.minY ?? y),
              maxY: Math.max(y, prev.rangeOfMotion?.maxY ?? y),
            }
          }));
        }
      }
    }
  ];

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Calibration</h2>
        <p className="mb-4 text-foreground/80">{steps[step].instruction}</p>
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="hover:bg-destructive/10"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
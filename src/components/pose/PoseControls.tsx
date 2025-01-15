import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Maximize2, Minimize2 } from 'lucide-react';
import { AmputationType } from '../../types';

interface PoseControlsProps {
  isWebcamEnabled: boolean;
  isDetectionActive: boolean;
  isVirtualHandEnabled: boolean;
  isFullscreen: boolean;
  amputationType: AmputationType;
  onStartWebcam: () => void;
  onToggleDetection: () => void;
  onToggleVirtualHand: () => void;
  onToggleFullscreen: () => void;
  onAmputationTypeChange: (value: AmputationType) => void;
}

export const PoseControls: React.FC<PoseControlsProps> = ({
  isWebcamEnabled,
  isDetectionActive,
  isVirtualHandEnabled,
  isFullscreen,
  amputationType,
  onStartWebcam,
  onToggleDetection,
  onToggleVirtualHand,
  onToggleFullscreen,
  onAmputationTypeChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Select value={amputationType} onValueChange={onAmputationTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select amputation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left_arm">Left Arm</SelectItem>
            <SelectItem value="right_arm">Right Arm</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={onToggleFullscreen}
          variant="outline"
          size="icon"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onStartWebcam}
          disabled={isWebcamEnabled}
          className="bg-primary hover:bg-primary/90"
        >
          {isWebcamEnabled ? 'Webcam Enabled' : 'Enable Webcam'}
        </Button>

        {isWebcamEnabled && (
          <>
            <Button
              onClick={onToggleDetection}
              variant={isDetectionActive ? "destructive" : "default"}
            >
              {isDetectionActive ? 'Stop Detection' : 'Start Detection'}
            </Button>

            <Button
              onClick={onToggleVirtualHand}
              variant={isVirtualHandEnabled ? "secondary" : "outline"}
            >
              {isVirtualHandEnabled ? 'Hide Virtual Hand' : 'Show Virtual Hand'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
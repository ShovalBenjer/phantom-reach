import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Maximize2, Minimize2, Video, VideoOff, Hand, HandMetal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    <TooltipProvider>
      <div className="flex flex-col gap-4 animate-fade-in">
        <div className="flex gap-2">
          <Select value={amputationType} onValueChange={onAmputationTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select amputation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left_arm">Left Arm</SelectItem>
              <SelectItem value="right_arm">Right Arm</SelectItem>
              <SelectItem value="both">Both Arms</SelectItem>
            </SelectContent>
          </Select>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleFullscreen}
                variant="outline"
                size="icon"
                className="hover:scale-105 transition-transform"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onStartWebcam}
                disabled={isWebcamEnabled}
                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all"
              >
                {isWebcamEnabled ? (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Webcam Enabled
                  </>
                ) : (
                  <>
                    <VideoOff className="mr-2 h-4 w-4" />
                    Enable Webcam
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isWebcamEnabled ? 'Webcam is active' : 'Start webcam feed'}</p>
            </TooltipContent>
          </Tooltip>

          {isWebcamEnabled && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onToggleDetection}
                    variant={isDetectionActive ? "destructive" : "default"}
                    className="hover:scale-105 transition-transform"
                  >
                    {isDetectionActive ? 'Stop Detection' : 'Start Detection'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDetectionActive ? 'Stop pose detection' : 'Start pose detection'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onToggleVirtualHand}
                    variant={isVirtualHandEnabled ? "secondary" : "outline"}
                    className="hover:scale-105 transition-transform"
                  >
                    {isVirtualHandEnabled ? (
                      <>
                        <HandMetal className="mr-2 h-4 w-4" />
                        Hide Virtual Hand
                      </>
                    ) : (
                      <>
                        <Hand className="mr-2 h-4 w-4" />
                        Show Virtual Hand
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isVirtualHandEnabled ? 'Hide virtual hand visualization' : 'Show virtual hand visualization'}</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
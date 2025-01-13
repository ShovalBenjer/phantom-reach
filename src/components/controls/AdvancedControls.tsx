import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface AdvancedControlsProps {
  modelComplexity: 'Lite' | 'Full' | 'Heavy';
  smoothingEnabled: boolean;
  segmentationEnabled: boolean;
  confidenceThreshold: number;
  onModelComplexityChange: (value: 'Lite' | 'Full' | 'Heavy') => void;
  onSmoothingToggle: (enabled: boolean) => void;
  onSegmentationToggle: (enabled: boolean) => void;
  onConfidenceThresholdChange: (value: number) => void;
}

export const AdvancedControls: React.FC<AdvancedControlsProps> = ({
  modelComplexity,
  smoothingEnabled,
  segmentationEnabled,
  confidenceThreshold,
  onModelComplexityChange,
  onSmoothingToggle,
  onSegmentationToggle,
  onConfidenceThresholdChange,
}) => {
  return (
    <div className="absolute right-0 top-0">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Model Complexity</Label>
              <Select value={modelComplexity} onValueChange={onModelComplexityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lite">Lite - Faster</SelectItem>
                  <SelectItem value="Full">Full - Balanced</SelectItem>
                  <SelectItem value="Heavy">Heavy - More Accurate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Confidence Threshold ({confidenceThreshold})</Label>
              <Slider
                value={[confidenceThreshold]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => onConfidenceThresholdChange(value[0])}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Landmark Smoothing</Label>
              <Switch
                checked={smoothingEnabled}
                onCheckedChange={onSmoothingToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Background Segmentation</Label>
              <Switch
                checked={segmentationEnabled}
                onCheckedChange={onSegmentationToggle}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
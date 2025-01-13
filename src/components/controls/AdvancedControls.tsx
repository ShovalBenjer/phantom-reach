import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="space-y-6 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg">
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
  );
};
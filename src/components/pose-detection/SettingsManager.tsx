import { toast } from '@/components/ui/use-toast';
import { poseDetectionService } from '../../services/poseDetection';

interface SettingsManagerProps {
  modelComplexity: 'Lite' | 'Full' | 'Heavy';
  smoothingEnabled: boolean;
  segmentationEnabled: boolean;
  confidenceThreshold: number;
  setModelComplexity: (value: 'Lite' | 'Full' | 'Heavy') => void;
  setSmoothingEnabled: (enabled: boolean) => void;
  setSegmentationEnabled: (enabled: boolean) => void;
  setConfidenceThreshold: (value: number) => void;
  setIsLoading: (loading: boolean) => void;
}

interface SettingsHandlers {
  handleModelComplexityChange: (value: 'Lite' | 'Full' | 'Heavy') => Promise<void>;
  handleSmoothingToggle: (enabled: boolean) => void;
  handleSegmentationToggle: (enabled: boolean) => void;
  handleConfidenceThresholdChange: (value: number) => void;
}

export const SettingsManager = ({
  setModelComplexity,
  setSmoothingEnabled,
  setSegmentationEnabled,
  setConfidenceThreshold,
  setIsLoading,
}: SettingsManagerProps): SettingsHandlers => {
  const handleModelComplexityChange = async (value: 'Lite' | 'Full' | 'Heavy') => {
    setModelComplexity(value);
    setIsLoading(true);
    try {
      await poseDetectionService.updateConfig({ modelComplexity: value });
      toast({
        title: "Settings Updated",
        description: `Model complexity changed to ${value}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update model complexity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmoothingToggle = (enabled: boolean) => {
    setSmoothingEnabled(enabled);
    poseDetectionService.updateConfig({ smoothLandmarks: enabled });
  };

  const handleSegmentationToggle = (enabled: boolean) => {
    setSegmentationEnabled(enabled);
    poseDetectionService.updateConfig({ enableSegmentation: enabled });
  };

  const handleConfidenceThresholdChange = (value: number) => {
    setConfidenceThreshold(value);
    poseDetectionService.updateConfig({ minPoseDetectionConfidence: value });
  };

  return {
    handleModelComplexityChange,
    handleSmoothingToggle,
    handleSegmentationToggle,
    handleConfidenceThresholdChange,
  };
};
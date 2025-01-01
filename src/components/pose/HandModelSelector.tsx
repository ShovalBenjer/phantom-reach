import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { HandStyle } from '../../types';

export type HandModel = 'realistic' | 'robotic' | 'skeletal' | 'cartoon';

interface HandModelSelectorProps {
  currentModel: HandModel;
  onModelChange: (model: HandModel) => void;
}

export const HandModelSelector: React.FC<HandModelSelectorProps> = ({
  currentModel,
  onModelChange,
}) => {
  const models: Record<HandModel, HandStyle> = {
    realistic: {
      color: '#f0d0c0',
      metalness: 0.1,
      roughness: 0.5,
    },
    robotic: {
      color: '#808080',
      metalness: 0.8,
      roughness: 0.2,
    },
    skeletal: {
      color: '#ffffff',
      metalness: 0.3,
      roughness: 0.7,
    },
    cartoon: {
      color: '#ffb6c1',
      metalness: 0,
      roughness: 1,
    },
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Hand Model</h3>
      <Select value={currentModel} onValueChange={(value: HandModel) => onModelChange(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select hand model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="realistic">Realistic</SelectItem>
          <SelectItem value="robotic">Robotic</SelectItem>
          <SelectItem value="skeletal">Skeletal</SelectItem>
          <SelectItem value="cartoon">Cartoon</SelectItem>
        </SelectContent>
      </Select>
    </Card>
  );
};
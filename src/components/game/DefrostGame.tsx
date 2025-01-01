import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Play, Hand, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { HandModelSelector, HandModel } from '../pose/HandModelSelector';

interface Level {
  id: number;
  requiredScore: number;
  defrostSpeed: number;
  name: string;
}

const LEVELS: Level[] = [
  { id: 1, requiredScore: 0, defrostSpeed: 1, name: "Beginner Thaw" },
  { id: 2, requiredScore: 100, defrostSpeed: 1.5, name: "Quick Melt" },
  { id: 3, requiredScore: 250, defrostSpeed: 2, name: "Heat Wave" },
  { id: 4, requiredScore: 500, defrostSpeed: 2.5, name: "Inferno" },
];

export const DefrostGame: React.FC = () => {
  const [showGame, setShowGame] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);
  const [defrostProgress, setDefrostProgress] = useState(0);
  const [selectedHandModel, setSelectedHandModel] = useState<HandModel>('realistic');
  const [unlockedModels, setUnlockedModels] = useState<HandModel[]>(['realistic']);

  const startGame = () => {
    setIsPlaying(true);
    setDefrostProgress(0);
    toast({
      title: "Game Started!",
      description: `Level ${currentLevel.id}: ${currentLevel.name}`,
    });
  };

  const updateProgress = () => {
    if (isPlaying && defrostProgress < 100) {
      setDefrostProgress(prev => {
        const newProgress = prev + currentLevel.defrostSpeed;
        if (newProgress >= 100) {
          completeLevel();
        }
        return Math.min(newProgress, 100);
      });
    }
  };

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(updateProgress, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentLevel.defrostSpeed]);

  const completeLevel = () => {
    const newScore = score + (currentLevel.id * 100);
    setScore(newScore);
    setIsPlaying(false);

    // Check for level up
    const nextLevel = LEVELS.find(level => level.requiredScore > score);
    if (nextLevel && nextLevel.id !== currentLevel.id) {
      setCurrentLevel(nextLevel);
      toast({
        title: "Level Up!",
        description: `You've reached ${nextLevel.name}!`,
      });
    }

    // Unlock new hand model based on score
    if (newScore >= 250 && !unlockedModels.includes('robotic')) {
      setUnlockedModels(prev => [...prev, 'robotic']);
      toast({
        title: "New Hand Skin Unlocked!",
        description: "You've unlocked the Robotic hand skin!",
      });
    } else if (newScore >= 500 && !unlockedModels.includes('skeletal')) {
      setUnlockedModels(prev => [...prev, 'skeletal']);
      toast({
        title: "New Hand Skin Unlocked!",
        description: "You've unlocked the Skeletal hand skin!",
      });
    }
  };

  if (!showGame) {
    return (
      <div className="flex flex-col items-center space-y-6 p-4">
        <Button
          onClick={() => setShowGame(true)}
          className="px-8 py-4 text-lg hover:scale-105 transition-transform"
        >
          <Play className="mr-2" />
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-4 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <span className="text-xl font-bold">Score: {score}</span>
      </div>

      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Level {currentLevel.id}: {currentLevel.name}</h2>
        <Progress value={defrostProgress} className="h-4" />
      </div>

      <div className="flex flex-col items-center space-y-4">
        {!isPlaying ? (
          <Button
            onClick={startGame}
            className="px-8 py-4 text-lg hover:scale-105 transition-transform"
          >
            <Play className="mr-2" />
            Start Defrosting
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setIsPlaying(false)}
            className="px-8 py-4 text-lg"
          >
            Stop Game
          </Button>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Available Hand Skins</h3>
        <div className="grid grid-cols-2 gap-4">
          {unlockedModels.map((model) => (
            <Button
              key={model}
              variant={selectedHandModel === model ? "default" : "outline"}
              onClick={() => setSelectedHandModel(model)}
              className="flex items-center space-x-2"
            >
              <Hand className="w-4 h-4" />
              <span className="capitalize">{model}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Locked Skins</h3>
        <div className="grid grid-cols-2 gap-4">
          {['robotic', 'skeletal', 'cartoon'].filter(model => !unlockedModels.includes(model as HandModel)).map((model) => (
            <div
              key={model}
              className="flex items-center space-x-2 p-2 border rounded-md bg-gray-100 opacity-50"
            >
              <Star className="w-4 h-4" />
              <span className="capitalize">{model}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
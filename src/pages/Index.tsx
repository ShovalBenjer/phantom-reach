import { PoseDetectionUI } from '@/components/PoseDetectionUI';
import { TooltipProvider } from '@/components/ui/tooltip';

const Index = () => {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Virtual Hand Movement Visualization</h1>
          <PoseDetectionUI />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
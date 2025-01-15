import { PoseDetectionUI } from '@/components/PoseDetectionUI';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <img 
          src="/lovable-uploads/019da9ba-4e1c-41c1-a77c-8dcea51f53b9.png" 
          alt="Phantom Reach" 
          className="h-16 md:h-20 mx-auto mb-8 object-contain"
        />
        <PoseDetectionUI />
      </div>
    </div>
  );
};

export default Index;
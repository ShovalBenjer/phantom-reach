import { PoseDetectionUI } from '@/components/PoseDetectionUI';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/phantom-reach-logo.png" 
            alt="PhantomReach Logo" 
            className="w-64 mb-4"
            aria-label="PhantomReach - Virtual Gaming, Real Rehabilitation"
          />
          <h1 className="text-3xl font-bold text-center">PhantomReach</h1>
        </div>
        <PoseDetectionUI />
      </div>
    </div>
  );
};

export default Index;
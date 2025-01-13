import { PoseDetectionUI } from '@/components/PoseDetectionUI';
import { Hero } from '@/components/sections/Hero';
import { AboutUs } from '@/components/sections/AboutUs';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <div id="about-section" className="py-20">
        <AboutUs />
      </div>
      
      <div id="demo-section" className="container mx-auto py-8">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/phantom-reach-logo.png" 
            alt="PhantomReach Logo" 
            className="w-64 mb-4"
            aria-label="PhantomReach - Virtual Gaming, Real Rehabilitation"
          />
          <h2 className="text-3xl font-bold text-center mb-8">Interactive Demo</h2>
        </div>
        <PoseDetectionUI />
      </div>
    </div>
  );
};

export default Index;
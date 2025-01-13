import { PoseDetectionUI } from '@/components/PoseDetectionUI';
import { Hero } from '@/components/sections/Hero';
import { AboutUs } from '@/components/sections/AboutUs';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <Hero />
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-8 animate-bounce"
          onClick={() => scrollToSection('about-section')}
        >
          <ChevronDown className="h-8 w-8" />
        </Button>
      </section>
      
      {/* About Us Section */}
      <section id="about-section" className="min-h-screen py-20">
        <AboutUs />
        <div className="flex justify-center mt-12">
          <Button
            variant="default"
            size="lg"
            onClick={() => scrollToSection('demo-section')}
            className="group"
          >
            Try the Demo
            <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
          </Button>
        </div>
      </section>
      
      {/* Demo Section */}
      <section id="demo-section" className="min-h-screen py-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-12">
            <img 
              src="/lovable-uploads/e8d1ad53-0473-49c4-bc46-8e6e12722158.png" 
              alt="PhantomReach Logo" 
              className="h-16 w-auto mb-6"
              aria-label="PhantomReach - Virtual Gaming, Real Rehabilitation"
            />
            <h2 className="text-3xl font-bold text-center mb-4">Interactive Demo</h2>
            <p className="text-muted-foreground text-center max-w-2xl">
              Experience the power of PhantomReach's rehabilitation technology. 
              Follow the tutorial below to get started with your virtual rehabilitation journey.
            </p>
          </div>
          <PoseDetectionUI />
        </div>
      </section>
    </div>
  );
};

export default Index;
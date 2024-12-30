import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Camera, Target, Award } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const tutorialSteps: Step[] = [
  {
    title: "Welcome to Virtual Hand Sculptor",
    description: "Experience innovative rehabilitation through interactive gaming. Our application helps improve motor skills and provides real-time feedback for your recovery journey.",
    icon: <Award className="w-12 h-12 text-primary" />,
  },
  {
    title: "Camera Setup",
    description: "Position your camera at chest height and stand about 2 meters back. This helps us accurately track your movements.",
    icon: <Camera className="w-12 h-12 text-primary" />,
  },
  {
    title: "Calibration",
    description: "We'll guide you through a quick calibration process to ensure accurate tracking of your movements.",
    icon: <Target className="w-12 h-12 text-primary" />,
  }
];

export const GameIntroduction: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!showTutorial) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-2xl bg-background p-6 rounded-lg shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              {tutorialSteps[currentStep].icon}
            </div>
            
            <h2 className="text-2xl font-bold text-center">
              {tutorialSteps[currentStep].title}
            </h2>
            
            <p className="text-center text-muted-foreground">
              {tutorialSteps[currentStep].description}
            </p>

            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button onClick={nextStep}>
                {currentStep === tutorialSteps.length - 1 ? (
                  "Get Started"
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
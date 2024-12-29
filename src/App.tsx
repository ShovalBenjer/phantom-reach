import { PoseDetectionUI } from './components/PoseDetectionUI';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <PoseDetectionUI />
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default App;
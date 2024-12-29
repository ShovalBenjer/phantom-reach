import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PoseDetectionUI } from '../components/PoseDetectionUI';

// Mock the MediaDevices API
const mockMediaDevices = {
  getUserMedia: vi.fn()
};
Object.defineProperty(window.navigator, 'mediaDevices', {
  value: mockMediaDevices
});

describe('PoseDetectionUI', () => {
  beforeEach(() => {
    mockMediaDevices.getUserMedia.mockReset();
  });

  it('renders without crashing', () => {
    render(<PoseDetectionUI />);
    expect(screen.getByText(/Enable Webcam/i)).toBeInTheDocument();
  });

  it('handles webcam enable button click', async () => {
    mockMediaDevices.getUserMedia.mockResolvedValueOnce({});
    render(<PoseDetectionUI />);
    
    const enableButton = screen.getByText(/Enable Webcam/i);
    fireEvent.click(enableButton);
    
    expect(mockMediaDevices.getUserMedia).toHaveBeenCalled();
  });

  it('displays correct amputation type options', () => {
    render(<PoseDetectionUI />);
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    expect(screen.getByText(/Left Arm/i)).toBeInTheDocument();
    expect(screen.getByText(/Right Arm/i)).toBeInTheDocument();
    expect(screen.getByText(/Both Arms/i)).toBeInTheDocument();
  });
});
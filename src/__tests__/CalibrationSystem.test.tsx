import { render, screen, act } from '@testing-library/react';
import { CalibrationSystem } from '../components/pose/CalibrationSystem';
import { vi } from 'vitest';

describe('CalibrationSystem', () => {
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnComplete.mockReset();
    mockOnCancel.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders calibration instructions', () => {
    render(
      <CalibrationSystem
        isActive={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Stand in a T-pose/i)).toBeInTheDocument();
  });

  it('shows progress during calibration', () => {
    render(
      <CalibrationSystem
        isActive={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('handles cancellation', () => {
    render(
      <CalibrationSystem
        isActive={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText(/Cancel/i);
    cancelButton.click();

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
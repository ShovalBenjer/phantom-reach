import { Landmark, HandStyle } from '../types';

export class VirtualHandService {
  private ctx: CanvasRenderingContext2D;
  private requestId: number | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get canvas context');
    this.ctx = context;
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderHand(landmark: Landmark | null, style: HandStyle = {}): void {
    if (!landmark) return;

    const { radius = 15, color = 'rgba(0, 255, 0, 0.6)' } = style;
    const x = landmark.x * this.canvas.width;
    const y = landmark.y * this.canvas.height;

    // Use requestAnimationFrame for smooth rendering
    if (this.requestId) cancelAnimationFrame(this.requestId);
    
    this.requestId = requestAnimationFrame(() => {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();
    });
  }

  dispose(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }
}
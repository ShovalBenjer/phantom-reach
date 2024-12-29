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

    const { radius = 15, color = 'rgba(0, 255, 0, 0.6)', showVirtualHand = false } = style;
    const x = landmark.x * this.canvas.width;
    const y = landmark.y * this.canvas.height;

    if (this.requestId) cancelAnimationFrame(this.requestId);
    
    this.requestId = requestAnimationFrame(() => {
      // Draw elbow point
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();

      if (showVirtualHand) {
        // Calculate hand position and angle
        const handLength = 100;
        const angle = Math.atan2(landmark.y - 0.5, landmark.x - 0.5) + Math.PI / 4; // Adjusted angle
        
        const handX = x + Math.cos(angle) * handLength;
        const handY = y + Math.sin(angle) * handLength;

        // Draw arm with gradient
        const gradient = this.ctx.createLinearGradient(x, y, handX, handY);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(handX, handY);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Draw modern hand shape
        this.ctx.save();
        this.ctx.translate(handX, handY);
        this.ctx.rotate(angle);

        // Palm
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, radius * 1.5, radius * 2, 0, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Fingers
        const fingerCount = 5;
        const fingerSpacing = (Math.PI / 3) / (fingerCount - 1);
        const fingerLength = radius * 2.5;
        const baseAngle = -Math.PI / 6;

        for (let i = 0; i < fingerCount; i++) {
          const fingerAngle = baseAngle + (fingerSpacing * i);
          const fingerX = Math.cos(fingerAngle) * fingerLength;
          const fingerY = Math.sin(fingerAngle) * fingerLength;

          // Draw finger segments
          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);
          
          // Control points for curved fingers
          const cp1x = fingerX * 0.5;
          const cp1y = fingerY * 0.3;
          const cp2x = fingerX * 0.7;
          const cp2y = fingerY * 0.7;
          
          this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, fingerX, fingerY);
          this.ctx.lineWidth = 6;
          this.ctx.lineCap = 'round';
          this.ctx.strokeStyle = color;
          this.ctx.stroke();

          // Finger tips
          this.ctx.beginPath();
          this.ctx.arc(fingerX, fingerY, 3, 0, 2 * Math.PI);
          this.ctx.fillStyle = color;
          this.ctx.fill();
        }

        this.ctx.restore();
      }
    });
  }

  dispose(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }
}
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
        // Calculate hand position based on elbow angle
        const handLength = 100;
        const angle = Math.atan2(landmark.y - 0.5, landmark.x - 0.5);
        
        const handX = x + Math.cos(angle) * handLength;
        const handY = y + Math.sin(angle) * handLength;

        // Draw arm line
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(handX, handY);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Draw hand
        this.ctx.beginPath();
        this.ctx.arc(handX, handY, radius * 1.2, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw fingers
        const fingerLength = 30;
        const fingerSpread = Math.PI / 4;
        const baseFingerAngle = angle - (fingerSpread * 2);

        for (let i = 0; i < 5; i++) {
          const fingerAngle = baseFingerAngle + (fingerSpread * i);
          const fingerX = handX + Math.cos(fingerAngle) * fingerLength;
          const fingerY = handY + Math.sin(fingerAngle) * fingerLength;

          this.ctx.beginPath();
          this.ctx.moveTo(handX, handY);
          this.ctx.lineTo(fingerX, fingerY);
          this.ctx.stroke();

          this.ctx.beginPath();
          this.ctx.arc(fingerX, fingerY, radius * 0.5, 0, 2 * Math.PI);
          this.ctx.fill();
        }
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
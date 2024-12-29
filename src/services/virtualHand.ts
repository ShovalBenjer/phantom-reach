import { Landmark, HandStyle } from '../types';

export class VirtualHandService {
  private ctx: CanvasRenderingContext2D;
  private requestId: number | null = null;
  private lastPose: { x: number; y: number } | null = null;
  private smoothingFactor = 0.3;

  constructor(private canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get canvas context');
    this.ctx = context;
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderHand(landmark: Landmark | null, shoulderLandmark: Landmark | null, style: HandStyle): void {
    if (!landmark) return;

    const defaultStyle: HandStyle = {
      radius: 15,
      color: 'rgba(0, 255, 0, 0.6)',
      metalness: 0.5,
      roughness: 0.5,
      showVirtualHand: false,
      ...style
    };
    
    let x = landmark.x * this.canvas.width;
    let y = landmark.y * this.canvas.height;
    
    if (this.lastPose) {
      x = this.lastPose.x + (x - this.lastPose.x) * this.smoothingFactor;
      y = this.lastPose.y + (y - this.lastPose.y) * this.smoothingFactor;
    }
    
    this.lastPose = { x, y };

    if (this.requestId) cancelAnimationFrame(this.requestId);
    
    this.requestId = requestAnimationFrame(() => {
      // Draw elbow point
      this.ctx.beginPath();
      this.ctx.arc(x, y, defaultStyle.radius || 15, 0, 2 * Math.PI);
      this.ctx.fillStyle = defaultStyle.color;
      this.ctx.fill();

      if (defaultStyle.showVirtualHand) {
        // Calculate hand angle based on shoulder if available
        let angle;
        if (shoulderLandmark) {
          const shoulderX = shoulderLandmark.x * this.canvas.width;
          const shoulderY = shoulderLandmark.y * this.canvas.height;
          angle = Math.atan2(y - shoulderY, x - shoulderX);
        } else {
          angle = Math.atan2(landmark.y - 0.5, landmark.x - 0.5);
        }

        const handLength = 80;
        const handX = x + Math.cos(angle) * handLength;
        const handY = y + Math.sin(angle) * handLength;

        // Draw modern hand
        this.drawModernHand(x, y, handX, handY, angle, defaultStyle.color);
      }
    });
  }

  private drawModernHand(startX: number, startY: number, handX: number, handY: number, angle: number, color: string): void {
    // Create gradient for arm
    const gradient = this.ctx.createLinearGradient(startX, startY, handX, handY);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');

    // Draw stylized arm
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(handX, handY);
    this.ctx.lineWidth = 12;
    this.ctx.strokeStyle = gradient;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();

    // Draw palm
    this.ctx.beginPath();
    this.ctx.arc(handX, handY, 20, 0, 2 * Math.PI);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Draw fingers with curved paths
    const fingerCount = 5;
    const fingerSpread = Math.PI / 3;
    const baseFingerAngle = angle - (fingerSpread / 2);
    
    for (let i = 0; i < fingerCount; i++) {
      const fingerAngle = baseFingerAngle + (fingerSpread * (i / (fingerCount - 1)));
      const fingerLength = 30 + (i === 2 ? 10 : 0); // Make middle finger longer
      
      // Calculate control points for curved fingers
      const cp1x = handX + Math.cos(fingerAngle) * (fingerLength * 0.5);
      const cp1y = handY + Math.sin(fingerAngle) * (fingerLength * 0.5);
      const endX = handX + Math.cos(fingerAngle) * fingerLength;
      const endY = handY + Math.sin(fingerAngle) * fingerLength;

      // Draw curved finger
      this.ctx.beginPath();
      this.ctx.moveTo(handX, handY);
      this.ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
      this.ctx.lineWidth = 8;
      this.ctx.strokeStyle = gradient;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();

      // Draw finger tip
      this.ctx.beginPath();
      this.ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    }
  }

  dispose(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
    this.lastPose = null;
  }
}
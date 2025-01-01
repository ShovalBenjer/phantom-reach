# Virtual Hand Sculptor

A real-time pose detection application that visualizes virtual hands based on webcam input. This project uses MediaPipe for pose detection and Three.js for 3D hand visualization.

## Features

- Real-time pose detection using webcam input
- 3D hand visualization that follows user movements
- Support for different amputation types (left arm, right arm, or both)
- Fullscreen mode support
- FPS monitoring
- Smooth hand movement interpolation

## Technology Stack

- **React + TypeScript**: Frontend framework and type safety
- **Three.js**: 3D graphics rendering
- **MediaPipe**: Pose detection
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components

## Project Structure

```
src/
├── components/
│   ├── PoseDetectionUI.tsx     # Main pose detection component
│   └── pose/
│       ├── PoseControls.tsx    # UI controls for pose detection
│       └── ThreeDHand.tsx      # 3D hand visualization component
├── services/
│   ├── poseDetection.ts        # Pose detection service
│   └── 3dHandService.ts        # 3D hand rendering service
├── config/
│   └── detection.ts            # Configuration constants
└── types/
    └── index.ts                # TypeScript type definitions
```

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Usage Guide

1. **Enable Webcam**
   - Click the "Enable Webcam" button
   - Grant webcam permissions when prompted

2. **Start Detection**
   - Click "Start Detection" to begin pose tracking
   - Select your preferred amputation type (left arm, right arm, or both)

3. **Adjust Settings**
   - Toggle virtual hand visibility
   - Use fullscreen mode for better visualization
   - Monitor FPS for performance

## Configuration

Key settings can be found in `src/config/detection.ts`:
- Pose detection confidence thresholds
- Webcam resolution settings
- Frame processing intervals

## Browser Support

- Requires WebGL support for 3D rendering
- Works best on modern browsers (Chrome, Firefox, Safari)
- Requires webcam access through `getUserMedia` API

## Performance Considerations

- Targets 30 FPS for pose detection
- Uses position smoothing for natural hand movement
- Implements pose detection buffering for stability
- Optimized 3D rendering with proper resource management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Pose and Virtual Hand Interaction Application by PhantomReach



This is a modern web application built using **React**, **TypeScript**, and **Vite**, designed to explore and demonstrate capabilities in real-time **pose detection** and **virtual hand interaction**. Leveraging the power of **MediaPipe Tasks Vision**, the application processes video input to identify human poses and potentially track hand movements. This data is then used to enable interactive experiences, such as controlling virtual elements or receiving feedback based on physical posture and gestures. The user interface is crafted using **Shadcn UI** components styled with **Tailwind CSS** for a clean, responsive, and accessible design. The project structure follows State-of-the-Art (SOTA) practices for maintainability and scalability.

## Features

*   **Real-time Pose Detection:** Utilizes the latest models from **MediaPipe Tasks Vision** to accurately detect and track human poses from a webcam or video feed in real time.
*   **Virtual Hand Tracking & Interaction:** Processes detected hand landmarks to enable virtual hand representations or facilitate interactions within the application environment based on hand gestures and positions.
*   **Interactive Visualizations:** Provides visual feedback and overlays on the video feed to show detected landmarks, skeletons, and virtual hand elements using the Canvas API.
*   **Data Statistics and Visualization:** Potentially displays statistics related to pose data or interactions, possibly visualized using charting libraries like Recharts.
*   **Configurable Detection Settings:** Allows users to adjust parameters for the pose detection model (e.g., detection confidence, tracking confidence) through intuitive controls.
*   **Responsive User Interface:** Built with Shadcn UI and Tailwind CSS to ensure a seamless experience across various devices and screen sizes.
*   **Navigation:** Implements routing with React Router DOM for easy navigation between different sections or pages of the application (e.g., Detection page, Landing page).
*   **Form Handling and Validation:** Uses React Hook Form and Zod for robust form management and data validation, likely for configuration or input forms.
*   **Visual Effects:** Includes components for rendering visual effects, potentially enhancing the interactive experience.
*   **Device Detection:** Adapts behavior or features based on the user's device (desktop vs. mobile) using `device-detector-js`.


## Technologies Used

*   **React:** A popular JavaScript library for building user interfaces. Provides a component-based architecture for building interactive web applications.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript. Enhances code quality, maintainability, and helps catch errors early.
*   **Vite:** A next-generation frontend tooling that provides an extremely fast development experience with Hot Module Replacement (HMR) and an optimized build process.
*   **MediaPipe Tasks Vision:** A library from Google that provides pre-trained on-device machine learning models for vision tasks, including pose and hand detection.
*   **Shadcn UI:** A collection of re-usable components built using Radix UI and Tailwind CSS. Provides accessible and customizable UI building blocks.
*   **Tailwind CSS:** A utility-first CSS framework that enables rapid styling directly in your markup.
*   **Zod:** A TypeScript-first schema declaration and validation library, used here likely for data validation in forms or API responses.
*   **React Hook Form:** A performance-optimized library for form management in React, simplifying form state, validation, and submission.
*   **React Router DOM:** Standard library for routing in React applications, allowing for navigation between different components/pages.
*   **Framer Motion:** A library for production-ready motion and animation in React. Likely used for smooth UI transitions or animations.
*   **Recharts:** A composable charting library built with React and D3. Likely used for visualizing any statistical data collected from pose or interaction.
*   **date-fns:** A modern JavaScript date utility library.
*   **device-detector-js:** A library to detect details about the user's device.
*   **lucide-react:** A collection of beautiful open-source icons.
*   **next-themes:** A library for managing themes (like dark mode) in Next.js and React applications.
*   **sonner:** A toast library for displaying notifications.
*   **vaul:** A drawer component for React.
*   **@mediapipe/tasks-vision:** The core library for MediaPipe vision tasks.
*   **@radix-ui/*:** Core unstyled, accessible components used by Shadcn UI.
*   **@tanstack/react-query:** Powerful asynchronous state management library for fetching, caching and updating data in React.
*   **class-variance-authority & clsx:** Utilities for conditionally applying CSS classes.
*   **cmdk:** A command menu component.
*   **embla-carousel-react:** A carousel component.
*   **input-otp:** A component for inputting one-time passwords.
*   **react-day-picker:** A flexible date picker component.
*   **react-resizable-panels:** Components for creating resizable layouts.
*   **tailwind-merge & tailwindcss-animate:** Utilities for working with Tailwind CSS.

## Installation

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    ```
    Replace `<repository_url>` with the actual URL of your repository.
2.  **Navigate to the project directory:**
    ```bash
    cd <project_directory_name>
    ```
3.  **Install dependencies:**
    This project uses Bun as a package manager.
    ```bash
    bun install
    ```

## Usage

1.  **Start the development server:**
    ```bash
    bun run dev
    ```
2.  Open your web browser and visit the address shown in the terminal (usually `http://localhost:5173`).

Navigate through the application to explore the pose detection and virtual hand features.

## Project Structure

The project follows a standard SOTA (State-of-the-Art) front-end structure:

*   `public/`: Contains static assets like `index.html`, favicon, images, etc.
*   `src/`: Contains the main application source code.
    *   `components/`: Houses reusable React components, including UI components from Shadcn (`ui/`) and specific application components.
    *   `pages/`: Top-level components representing different pages or views of the application.
    *   `services/`: Contains logic for interacting with external APIs, libraries (like MediaPipe), or complex business logic.
    *   `utils/`: Utility functions and helper modules.
    *   `hooks/`: Custom React hooks for encapsulating logic.
    *   `config/`: Application configuration settings.
    *   `lib/`: Common helper functions or library initializations.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a Pull Request.

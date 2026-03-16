# 🚀 Kavsar Kamera

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 📸 Description
**Kavsar Kamera** is a high-performance, world-class web camera application designed to provide a seamless photography and videography experience directly within your browser. Built with a focus on speed, privacy, and modern aesthetics, it leverages the power of WebRTC to deliver real-time, low-latency media streams with zero plugin requirements.

---

## ✨ Features
- 🎥 **Real-time Preview**: High-definition camera streaming with optimized latency and adaptive bitrate.
- 📸 **Instant Snapshots**: Capture high-resolution photos with a single click and instant previews.
- 📼 **Buffer Recording**: (Beta) Record video clips directly to your browser with local persistence.
- 🌓 **Adaptive UI**: Premium design with glassmorphism effects and native dark mode support.
- 🔒 **Privacy First**: All media processing happens client-side; your data never leaves the browser.
- 🎨 **Modern Filters**: Subtle CSS-based real-time filters for enhanced visual storytelling.

---

## 🧰 Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend**: [React](https://reactjs.org/) (Hooks & Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Type Checking)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Media Engine**: Native [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 📦 Installation
Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KosimovM/kavsar-kamera.git
   cd kavsar-kamera
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

---

## ⚙️ Environment Variables
Create a `.env.local` file in the root directory and add any necessary configurations (if applicable):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Optional: Add keys for cloud storage or analytics
```

---

## ▶️ Running the Project
Launch the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

To build for production:
```bash
npm run build
npm start
```

---

## 📁 Project Structure
```text
kavsar-kamera/
├── public/              # Static assets (logos, icons)
├── src/
│   ├── app/            # Next.js App Router (pages & layouts)
│   ├── components/     # Reusable UI components (Camera, Gallery, Controls)
│   ├── hooks/          # Custom hooks (useCamera, useMediaRecorder)
│   ├── lib/            # Utility functions and shared logic
│   ├── types/          # TypeScript interfaces and types
│   └── styles/         # Global CSS and Tailwind configurations
├── .env.local          # Environment variables
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

---

## 📷 Usage Guide
1. **Grant Permissions**: Upon opening the app, allow the browser to access your camera and microphone.
2. **Select Device**: Use the settings icon to switch between front and back cameras or different input devices.
3. **Capture**: Click the central "Capture" button to take a high-quality photo.
4. **View**: Access your recently captured photos in the floating gallery at the bottom.
5. **Download**: Click the download icon on any image in the gallery to save it to your local machine.

---

## 🛣 Roadmap / Future Features
- [ ] 🎨 **Advanced Image Editor**: Crop, rotate, and annotate captured photos.
- [ ] ☁️ **Cloud Storage**: Optional integration with Supabase or Firebase for cross-device access.
- [ ] 🎭 **AR Masks**: Real-time face tracking and augmented reality filters.
- [ ] 🎙 **Microphone Controls**: Advanced audio gain and noise suppression settings for video recording.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author
**KosimovM**
- GitHub: [@KosimovM](https://github.com/KosimovM)
- Email: [qosimovm622@gmail.com](mailto:qosimovm622@gmail.com)

---

<p align="center">
  Built with ❤️ for the Modern Web
</p>

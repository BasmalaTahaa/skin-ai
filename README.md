# Skin Analysis AI - Frontend Application

A beautiful, elegant skin analysis AI platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Girly, Elegant Design** - Soft pink, rose, lavender color palette with modern UI
- 📸 **Image Upload** - Drag & drop skin image upload with preview
- 🤖 **AI Analysis** - Mock ML classification with confidence scores
- 💬 **Chat Assistant** - Personalized skincare chatbot with context awareness
- 📊 **Progress Tracking** - Daily routine checklist and progress monitoring
- 👤 **User Profile** - Analysis history and account management

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── layout.tsx               # Root layout
├── globals.css              # Global styles
│
├── dashboard/               # Dashboard routes (with layout)
│   ├── layout.tsx           # Dashboard layout (Sidebar + Topbar)
│   ├── page.tsx             # Dashboard home
│   ├── upload/
│   ├── result/
│   ├── chat/
│   ├── tracking/
│   └── profile/
│
├── upload/                  # Standalone upload page
├── result/                  # Standalone result page
├── chat/                    # Standalone chat page
├── tracking/                # Standalone tracking page
└── profile/                 # Standalone profile page

components/
├── Sidebar.tsx              # Navigation sidebar
├── Topbar.tsx               # Top navigation bar
├── UploadCard.tsx           # Image upload component
├── ResultCard.tsx           # Analysis result display
├── ChatMessage.tsx          # Chat message bubble
└── ProgressCard.tsx         # Progress tracking card
```

## Design System

### Colors
- **Soft Pink**: `#FFE5E5`
- **Rose**: `#FFB3BA`
- **Lavender**: `#E5D4FF`
- **Peach**: `#FFD9B3`
- **Light Beige**: `#FFF8F0`
- **Pink Accent**: `#FF9AA2`
- **Lavender Accent**: `#C7B2FF`

### Typography
- Font: Inter (Google Fonts)
- Clean, friendly, professional

## Features Overview

### Landing Page (`/`)
Beautiful hero section with feature highlights and call-to-action buttons.

### Dashboard (`/dashboard`)
Main dashboard with quick actions and recent activity.

### Upload (`/upload`)
Drag & drop image upload with preview and analysis button.

### Result (`/result`)
Displays analysis results with confidence scores and next steps.

### Chat (`/chat`)
AI-powered skincare assistant with context-aware responses.

### Tracking (`/tracking`)
Daily routine checklist, progress bars, and weekly statistics.

### Profile (`/profile`)
User information, analysis history, and settings.

## Mock Data

Currently using mock data for:
- ML classification results (stored in sessionStorage)
- User profile information
- Chat responses (keyword-based)
- Progress tracking data

## Next Steps

To integrate with a real backend:
1. Replace sessionStorage with API calls
2. Implement real ML model integration
3. Add authentication
4. Connect to database for persistent storage
5. Implement real-time chat with backend

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```
Trained model weights: https://www.kaggle.com/basmalatahaamer/models
Place the .pt files in backend/models_ml/ before running the backend.

## License

This project is part of a graduation project.


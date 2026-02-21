# Bruna Alves Photography - Frontend

![Site Preview](public/images/home-brunaphoto.PNG)

## Overview
This is the frontend application for **Bruna Alves Photography**, a professional photography portfolio and blog platform. Originally started as an MVP, it has evolved into a feature-rich application with a custom content management system (CMS) for blogging.

**Live Site:** [brunaalvesphoto.com](https://brunaalvesphoto.com)

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Features

### Public Facing
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop using Tailwind CSS 4.
- **Portfolio Showcase**: High-quality image galleries to display photography work.
- **Blog System**: A complete blog with categories, pagination, and rich text content.
- **Internationalization (i18n)**: Full support for English (en) and Portuguese (pt) with seamless switching.
- **Contact Integration**: Direct WhatsApp integration and email contact forms.
- **SEO Optimization**: Dynamic metadata, sitemaps, and structured data (JSON-LD).
- **Performance**: Image optimization using `sharp` and Next.js optimization features.

### Admin & Management
- **Secure Authentication**: Google OAuth integration for secure admin access.
- **Admin Dashboard**: Protected area with business KPI overview (revenue, bookings, package performance, payment status).
- **Post Management**: Create, edit, and delete blog posts.
- **Package Management**: Create, edit, and delete photography packages from the admin panel.
- **Payment Link Generation**: Generate dynamic payment links for FULL, DEPOSIT, and BALANCE flows.
- **Bookings Management**: View and manage client bookings tied to payment sessions.
- **Block Editor**: Custom-built block-based editor for writing blog posts (Text, Images, etc.).
- **Image Upload**: Integration with backend for handling image uploads.

## 🚀 Impact & Performance Metrics
This project was engineered with a mobile-first approach, focusing heavily on **Core Web Vitals** and user retention.

- **⚡ 100/100 Lighthouse Score:** Achieved perfect scores in Performance, Accessibility, Best Practices, and SEO.
- **📉 96% Reduction in Asset Size:** Implemented a custom Node.js script using `Sharp` to automate image compression (WebP conversion), reducing gallery load times drastically.
- **📈 60% Conversion Increase:** Optimized UX and WhatsApp integration led to a significant increase in client lead generation compared to the previous solution.
- **🌍 Internationalization:** Seamless English/Portuguese switching with SEO-friendly routing.

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: Custom components with [Lucide React](https://lucide.dev/) icons.
- **Animations**: [AOS](https://michalsnik.github.io/aos/) (Animate On Scroll).
- **Authentication**: [Google OAuth](https://developers.google.com/identity/gsi/web) + JWT.
- **State Management**: React Context API (Auth, Translations).
- **Data Fetching**: Axios.
- **Payments**: Stripe Checkout integration (dynamic sessions and payment links).
- **Image Processing**: Sharp, Browser Image Compression.
- **Analytics**: Google Analytics, Vercel Analytics.

## Project Structure

```
brunaalvesphoto-frontend/
├── public/                 # Static assets (images, robots.txt)
├── scripts/                # Utility scripts (image optimization)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── [locale]/       # Localized pages (public + admin + login)
│   │   │   ├── admin/      # Admin dashboard, packages, bookings, posts
│   │   │   └── login/      # Localized login route
│   │   ├── api/            # Internal API routes (if any)
│   │   └── layout.tsx      # Root layout
│   ├── client/
│   │   └── _components/    # Reusable UI components
│   ├── context/            # React Context providers (Auth, Translation)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries (API client, translations)
│   ├── schemas/            # Zod validation schemas
│   ├── styles/             # CSS modules and global styles
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:iurylenonalves/brunaalvesphoto-frontend.git
   cd brunaalvesphoto-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001 # URL of your backend API

   # Google OAuth
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   
   # Analytics (Optional)
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

The project follows a **Client-Server** architecture where this repository serves as the Frontend.

- **Frontend**: Handles UI, client-side routing, and user interactions. It communicates with the backend via RESTful APIs.
- **Backend**: Handles database operations, authentication logic, payment session generation (Stripe), webhooks, and file storage.

### Backend Integration (Required)
This frontend is strictly designed to work with its dedicated backend API. For full functionality (Blog posts, Contact emails, Admin login), you must have the API running locally or accessible via a URL.

- **Backend Repository:** [Bruna Alves Photography API](https://github.com/iurylenonalves/api-brunaphoto-vercel)
- **Setup:** Follow the instructions in the backend's README to start the server (typically on port 3001).

### Key Architectural Decisions
- **App Router**: Uses Next.js 13+ App Router for better performance and server components.
- **Localization**: URL-based localization (`/[locale]/...`) ensures SEO-friendly multi-language support.
- **Component-Based**: UI is built with small, reusable components located in `src/client/_components`.
- **Strict Typing**: TypeScript is used throughout to ensure type safety.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

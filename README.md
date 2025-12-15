# Exam App

A modern, full-stack web application for managing and taking online exams, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Authentication**: Powered by NextAuth.js for robust session management.
- **User Flows**:
  - Login & Registration with form validation (React Hook Form + Zod).
  - Forgot Password & OTP Verification.
  - Password Reset functionality.
- **Role-Based Access Control**: Secure routes and features based on user account status.

### 📚 Exam Management
- **Diplomas & Exams**: Browse various diplomas and their associated exams.
- **Infinite Scrolling**: Smooth browsing experience for diploma lists using `react-infinite-scroll-component`.
- **Interactive Exams**:
  - **Dynamic Question Cards**: Clean interface for answering questions.
  - **Real-time Timer**: Visual countdown timer with alerts for low time (using Recharts).
  - **Progress Tracking**: Visual progress bar to track exam completion status.
  - **Instant Feedback**: Immediate validation of answers upon completion.
- **Detailed Results**:
  - Comprehensive score summary with visual donut charts.
  - Question-by-question review with correct/incorrect indicators.

### 👤 User Account
- **Profile Management**: Update personal information and settings.
- **Security**: options to change password or delete account with confirmation steps.

### 🎨 UI/UX Design
- **Modern Interface**: Built with Tailwind CSS and `shadcn/ui` components.
- **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop.
- **Toast Notifications**: Interactive user feedback using `sonner`.
- **Loading States**: Skeleton loaders and spinners for smooth data fetching UX.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router pages & layouts
│   ├── (auth)/           # Authentication routes (login, register, etc.)
│   ├── (home)/           # Main dashboard routes (diplomas, account, etc.)
│   └── api/              # API routes (NextAuth, etc.)
├── components/           # Reusable UI components
│   ├── ui/               # Base UI elements (shadcn/ui)
│   ├── layout/           # Header, Sidebar, etc.
│   └── features/         # Feature-specific components
├── hooks/                # Custom React hooks (useDiplomas, etc.)
├── lib/                  # Utilities, types, and helper functions
├── providers/            # React Context providers (QueryClient, etc.)
└── actions/              # Server Actions for data mutations
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Yarn or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd exam-app
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add necessary variables (e.g., API endpoints, NextAuth secret).

API='https://exam.elevateegy.com/api/v1'
NEXTAUTH_SECRET="kOQJU2v2CQ2eHbRiWKnbKxJVSY7qXRcbeRTfCbSWJTA=" 
NEXTAUTH_URL='http://localhost:3000'

4. **Run the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Build for Production

To create an optimized production build:

```bash
yarn build
yarn start
```

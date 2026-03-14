# El-Learning Platform

A modern, responsive e-learning platform built with React and Vite. This application provides a comprehensive learning management system with dedicated experiences for both students and instructors.

## 🌟 Features

### 🎓 For Students
- **Course Catalog**: Browse and discover available courses.
- **My Courses**: Track your registered courses and learning progress.
- **Course Player**: Seamless video integration for watching course lectures.
- **Quizzes**: Test your knowledge with interactive quizzes.
- **Student Dashboard & Profile**: Manage your account and view your learning statistics.

### 👨‍🏫 For Instructors
- **Instructor Dashboard & Analytics**: Monitor course performance and student engagement.
- **Course Management**: Create, edit, and manage your courses.
- **Quiz Builder**: Create assessments to evaluate student understanding.

### 🎨 General Features
- **Dark Mode Support**: Built-in light/dark theme toggling for a better user experience.
- **Responsive Design**: Works beautifully across desktop, tablet, and mobile devices.
- **Interactive UI**: Fluid animations and toast notifications for an engaging experience.

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & React-Redux
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Media & UI**: `react-player`, `react-dropzone`, `react-hot-toast`, `react-icons`

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository and navigate to the project folder:
   ```bash
   cd el-learning
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` (or the port specified in your terminal).

## 🏗️ Building for Production

To create a production-ready build, run:
```bash
npm run build
```
You can then preview the production build locally with:
```bash
npm run preview
```

## 📝 Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the application for production.
- `npm run lint`: Runs ESLint to find and fix problems in your code.
- `npm run preview`: Bootup a local web server that serves the built solution from the `dist` folder.

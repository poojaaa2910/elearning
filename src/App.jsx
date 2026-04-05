import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/useAuthStore';
import { useAdaptiveSettings } from './hooks/useAdaptiveSettings';
import { useAdminStore } from './stores/useAdminStore';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import FieldsPage from './pages/FieldsPage';
import FieldPage from './pages/FieldPage';
import CoursePage from './pages/CoursePage';
import MilestonePage from './pages/MilestonePage';
import QuizPage from './pages/QuizPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseListPage from './pages/admin/CourseListPage';
import CourseFormPage from './pages/admin/CourseFormPage';
import FileUploadPage from './pages/admin/FileUploadPage';
import QuizEditorPage from './pages/admin/QuizEditorPage';

// Check if user needs to complete onboarding
const needsOnboarding = (user) => {
  if (!user) return false;
  return !user.preferredLearning || 
         !user.visionDifficulty || 
         !user.readingSpeed ||
         user.colorBlindMode === undefined ||
         user.cognitiveMode === undefined ||
         user.onboardingCompleted === false;
};

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  
  // Show loading while checking auth
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#537A5A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Logged in but needs onboarding - redirect to onboarding
  if (needsOnboarding(user)) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const OnboardingRoute = ({ children, isEditing = false }) => {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  
  // Show loading while checking auth
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#537A5A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If editing (from dashboard), allow access
  if (isEditing) {
    return children;
  }
  
  // If onboarding is already complete, redirect to dashboard
  if (!needsOnboarding(user)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const checkAdminStatus = useAdminStore((state) => state.checkAdminStatus);
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user?.uid) {
        await checkAdminStatus(user.uid);
      }
      setChecking(false);
    };
    checkAdmin();
  }, [user?.uid]);

  if (!initialized || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#537A5A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const AppContent = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);
  const initializedRef = useRef(false);
  const location = useLocation();
  useAdaptiveSettings();
  
  useEffect(() => {
    if (!initializedRef.current && initialized === false) {
      initializedRef.current = true;
      initialize();
    }
  }, [initialize, initialized]);

  const isEditingFromDashboard = location.state?.from === 'dashboard';
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Onboarding - only for users who haven't completed it */}
      <Route path="/onboarding" element={
        <OnboardingRoute isEditing={isEditingFromDashboard}>
          <OnboardingPage />
        </OnboardingRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<CourseListPage />} />
        <Route path="/admin/courses/new" element={<CourseFormPage />} />
        <Route path="/admin/courses/:courseId" element={<CourseFormPage />} />
        <Route path="/admin/courses/:courseId/files" element={<FileUploadPage />} />
        <Route path="/admin/courses/:courseId/quiz" element={<QuizEditorPage />} />
      </Route>
      
      {/* Protected routes - require login AND completed onboarding */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Navigate to="/dashboard" replace /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><DashboardPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/fields" element={
        <ProtectedRoute>
          <Layout><FieldsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/field/:fieldId" element={
        <ProtectedRoute>
          <Layout><FieldPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/course/:courseId" element={
        <ProtectedRoute>
          <Layout><CoursePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/milestone/:courseId/:milestoneId" element={
        <ProtectedRoute>
          <Layout><MilestonePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/quiz/:courseId" element={
        <ProtectedRoute>
          <Layout><QuizPage /></Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
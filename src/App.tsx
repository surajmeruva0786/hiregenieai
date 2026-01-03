import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import HomePage from './pages/public/HomePage';
import FeaturesPage from './pages/public/FeaturesPage';
import PricingPage from './pages/public/PricingPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import JobsList from './pages/jobs/JobsList';
import CreateJob from './pages/jobs/CreateJob';
import JobDetail from './pages/jobs/JobDetail';
import CandidatesList from './pages/candidates/CandidatesList';
import UploadResumes from './pages/candidates/UploadResumes';
import CandidateProfile from './pages/candidates/CandidateProfile';
import InterviewDashboard from './pages/interviews/InterviewDashboard';
import AIInsights from './pages/ai-insights/AIInsights';
import Workflows from './pages/workflows/Workflows';
import Analytics from './pages/analytics/Analytics';
import Billing from './pages/billing/Billing';
import Settings from './pages/settings/Settings';

// Student Pages
import StudentDashboardLayout from './components/layout/StudentDashboardLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import JobBoard from './pages/student/JobBoard';
import JobDetailsPublic from './pages/student/JobDetailsPublic';
import MyApplications from './pages/student/MyApplications';
import MyInterviews from './pages/student/MyInterviews';
import StudentProfile from './pages/student/StudentProfile';
import TakeInterview from './pages/student/TakeInterview';

function App() {
  const { currentUser, isAuthenticated, isLoading, logout } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const userType = currentUser?.userType || 'recruiter';

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={userType === 'student' ? '/student/dashboard' : '/dashboard'} /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to={userType === 'student' ? '/student/dashboard' : '/dashboard'} /> : <SignupPage />}
        />

        {/* Recruiter Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated && userType === 'recruiter' ? (
              <DashboardLayout onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobsList />} />
          <Route path="jobs/create" element={<CreateJob />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="candidates" element={<CandidatesList />} />
          <Route path="candidates/upload" element={<UploadResumes />} />
          <Route path="candidates/:id" element={<CandidateProfile />} />
          <Route path="interviews" element={<InterviewDashboard />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Student Dashboard Routes */}
        <Route
          path="/student"
          element={
            isAuthenticated && userType === 'student' ? (
              <StudentDashboardLayout onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<Navigate to="/student/dashboard" />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="jobs" element={<JobBoard />} />
          <Route path="jobs/:id" element={<JobDetailsPublic />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="interviews" element={<MyInterviews />} />
          <Route path="interviews/:id" element={<TakeInterview />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
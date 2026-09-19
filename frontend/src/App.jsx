import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TestCaseGenerator from './pages/TestCaseGenerator';
import BugReportGenerator from './pages/BugReportGenerator';
import QAChat from './pages/QAChat';
import TestDataGenerator from './pages/TestDataGenerator';
import Feedback from './pages/Feedback';
import { getAuthRedirectPath } from './utils/authStorage';

function AuthRedirect() {
  return <Navigate to={getAuthRedirectPath()} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="test-cases" element={<TestCaseGenerator />} />
        <Route path="bug-reports" element={<BugReportGenerator />} />
        <Route path="chat" element={<QAChat />} />
        <Route path="test-data" element={<TestDataGenerator />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>

      <Route path="*" element={<AuthRedirect />} />
    </Routes>
  );
}

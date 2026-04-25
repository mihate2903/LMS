import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import PageWrapper from './components/layout/PageWrapper';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminLessonsPage from './pages/AdminLessonsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import StudyPage from './pages/StudyPage';
import ProfilePage from './pages/ProfilePage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminSupportPage from './pages/AdminSupportPage';
import SupportModal from './components/common/SupportModal';

function App() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  const handleOpenSupport = () => {
    console.log("Opening support modal...");
    setIsSupportOpen(true);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar onOpenSupport={handleOpenSupport} />
        <main className="flex-grow flex flex-col">
          <PageWrapper>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/course/:id" element={<CourseDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/checkout/:id" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/courses/:courseId/lessons" element={<AdminLessonsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/support" element={<AdminSupportPage />} />
              <Route path="/admin/profile" element={<AdminProfilePage />} />
              <Route path="/study/:id" element={<StudyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </PageWrapper>
        </main>
        <Footer />
        <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      </div>
    </Router>
  );
}

export default App;


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import LandingPage from '../pages/LandingPage';
import AdminDashboard from '../pages/AdminDashboard';
import FeedbackListPage from '../pages/FeedbackListPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Portal Portal Landing */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />

      {/* Admin Dashboard Console Sections */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      
      <Route
        path="/admin/feedback"
        element={
          <AdminLayout>
            <FeedbackListPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <AdminLayout>
            <AnalyticsPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminLayout>
            <SettingsPage />
          </AdminLayout>
        }
      />

      {/* 404 Fallback Segment */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

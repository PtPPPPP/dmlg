import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

const HomePage = lazy(() => import('../pages/HomePage'));
const AthletesPage = lazy(() => import('../pages/AthletesPage'));
const AthleteDetailPage = lazy(() => import('../pages/AthleteDetailPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const ComparePage = lazy(() => import('../pages/ComparePage'));
const GuidePage = lazy(() => import('../pages/GuidePage'));
const DataAdminPage = lazy(() => import('../pages/DataAdminPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/athletes" element={<AthletesPage />} />
          <Route path="/athletes/:id" element={<AthleteDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/data-admin" element={<DataAdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

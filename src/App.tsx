import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Consultation from './pages/Consultation';
import BlogList from './pages/BlogList';
import BlogDetails from './pages/BlogDetails';
import Dashboard from './pages/Dashboard';
import ExerciseTracker from './pages/ExerciseTracker';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracker" element={<ExerciseTracker />} />
            <Route path="/workout" element={<Navigate to="/tracker" replace />} />
            <Route path="/exercise-tracker" element={<Navigate to="/tracker" replace />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}


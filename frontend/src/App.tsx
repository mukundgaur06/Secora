import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TelemetryBar } from './components/status/TelemetryBar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { SecurityPage } from './pages/SecurityPage';
import { DocsPage } from './pages/DocsPage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { LabsPage } from './pages/LabsPage';
import { UsagePage } from './pages/UsagePage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Simple client-side router
  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void-950 flex flex-col items-center justify-center font-mono text-xs text-emerald-400 cyber-grid">
        <div className="p-6 bg-void-900 border border-emerald-500/30 rounded-xl space-y-3 text-center shadow-2xl">
          <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="font-bold tracking-wider">INITIALIZING SECORA SECURITY CONSOLE...</div>
          <div className="text-[10px] text-slate-500">// VERIFYING CRYPTOGRAPHIC TOKEN</div>
        </div>
      </div>
    );
  }

  // Guard protected routes
  const isAppRoute = currentPath.startsWith('/app') || currentPath.startsWith('/admin');
  if (isAppRoute && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-void-950">
        <TelemetryBar />
        <Navbar currentPath="/login" onNavigate={navigate} />
        <LoginPage onNavigate={navigate} />
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  const renderCurrentPage = () => {
    if (currentPath === '/') return <LandingPage onNavigate={navigate} />;
    if (currentPath === '/features') return <FeaturesPage onNavigate={navigate} />;
    if (currentPath === '/security') return <SecurityPage onNavigate={navigate} />;
    if (currentPath === '/docs') return <DocsPage />;
    if (currentPath === '/pricing') return <PricingPage onNavigate={navigate} />;
    if (currentPath === '/login') return <LoginPage onNavigate={navigate} />;
    if (currentPath === '/register') return <RegisterPage onNavigate={navigate} />;

    // Authenticated routes
    if (currentPath === '/app') return <DashboardPage onNavigate={navigate} />;
    if (currentPath.startsWith('/app/chat')) return <ChatPage onNavigate={navigate} />;
    if (currentPath === '/app/knowledge') return <KnowledgePage />;
    if (currentPath === '/app/labs') return <LabsPage />;
    if (currentPath === '/app/usage') return <UsagePage />;
    if (currentPath.startsWith('/admin')) return <AdminPage />;

    // Default
    return <LandingPage onNavigate={navigate} />;
  };

  const isChatRoute = currentPath.startsWith('/app/chat');

  return (
    <div className="min-h-screen flex flex-col bg-void-950 selection:bg-emerald-500/30 selection:text-emerald-200">
      <TelemetryBar />
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <div className="flex-1">
        {renderCurrentPage()}
      </div>
      {!isChatRoute && <Footer onNavigate={navigate} />}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

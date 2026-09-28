import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { HomePlanner } from './components/planners/HomePlanner';
import { PartyPlanner } from './components/planners/PartyPlanner';
import { JewelryPlanner } from './components/planners/JewelryPlanner';
import { PlanResultView } from './components/PlanResultView';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { AuthModal } from './components/AuthModal';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { PlanResult } from './types';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [activePlan, setActivePlan] = useState<PlanResult | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (view: string) => {
    // If navigating to dashboard or profile and not authenticated, show auth modal
    if (['dashboard', 'history', 'profile'].includes(view) && !isAuthenticated) {
      handleOpenAuth('login');
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanGenerated = (plan: PlanResult) => {
    setActivePlan(plan);
    setCurrentView('plan-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlan = (plan: PlanResult) => {
    setActivePlan(plan);
    setCurrentView('plan-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewPlan = (type?: string) => {
    if (type === 'home') setCurrentView('home-planner');
    else if (type === 'party') setCurrentView('party-planner');
    else if (type === 'jewelry') setCurrentView('jewelry-planner');
    else setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigate}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {currentView === 'home-planner' && (
          <HomePlanner
            onBack={() => handleNavigate('dashboard')}
            onPlanGenerated={handlePlanGenerated}
          />
        )}

        {currentView === 'party-planner' && (
          <PartyPlanner
            onBack={() => handleNavigate('dashboard')}
            onPlanGenerated={handlePlanGenerated}
          />
        )}

        {currentView === 'jewelry-planner' && (
          <JewelryPlanner
            onBack={() => handleNavigate('dashboard')}
            onPlanGenerated={handlePlanGenerated}
          />
        )}

        {currentView === 'plan-result' && activePlan && (
          <PlanResultView
            plan={activePlan}
            onBack={() => handleNavigate('dashboard')}
            onNewPlan={handleNewPlan}
          />
        )}

        {currentView === 'history' && (
          <HistoryPage
            onSelectPlan={handleSelectPlan}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'profile' && (
          <ProfilePage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setCurrentView('dashboard');
        }}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        onOpenPlanner={handleNavigate}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

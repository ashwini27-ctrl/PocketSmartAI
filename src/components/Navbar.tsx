import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  Home,
  PartyPopper,
  Sparkles,
  LayoutDashboard,
  History,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [plannerDropdownOpen, setPlannerDropdownOpen] = useState(false);

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setPlannerDropdownOpen(false);
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'home-planner', label: 'Home Planner' },
    { id: 'party-planner', label: 'Party Planner' },
    { id: 'jewelry-planner', label: 'Jewelry Planner' },
    { id: 'history', label: 'History' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 focus:outline-none group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:bg-blue-600 transition-colors">
              <Wallet className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
                  PocketSmart
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block font-medium">
                Smart Budget & Recommendations
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => handleNav('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'landing'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </button>

            {/* Planners Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPlannerDropdownOpen(!plannerDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  ['home-planner', 'party-planner', 'jewelry-planner'].includes(currentView)
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Planners</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {plannerDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setPlannerDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleNav('home-planner')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Home className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium text-slate-900">Home Planner</div>
                      <div className="text-xs text-slate-400">Furniture & interiors</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNav('party-planner')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <PartyPopper className="w-4 h-4 text-violet-600" />
                    <div>
                      <div className="font-medium text-slate-900">Party Planner</div>
                      <div className="text-xs text-slate-400">Events & celebrations</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNav('jewelry-planner')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-medium text-slate-900">Jewelry Planner</div>
                      <div className="text-xs text-slate-400">Gold & festive sets</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('history')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'history'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              History
            </button>

            <button
              onClick={() => handleNav('profile')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'profile'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Profile
            </button>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name || 'Account'}</span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loginAsDemo()}
                  className="text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-md font-medium border border-blue-200 transition-colors"
                >
                  Quick Demo Login
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-sm text-slate-700 hover:text-slate-900 px-3 py-1.5 font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="text-sm bg-slate-900 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium shadow-sm transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            {!isAuthenticated && (
              <button
                onClick={() => loginAsDemo()}
                className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded font-medium"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <div className="flex items-center justify-between py-2 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                      <div className="text-xs text-slate-500">{user?.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full text-center py-2 px-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="w-full text-center py-2 px-3 bg-slate-900 rounded-lg text-sm font-medium text-white shadow-sm"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (Ultra convenient on phone) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-1.5 px-3 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleNav('landing')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            currentView === 'landing' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          Home
        </button>
        <button
          onClick={() => handleNav('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            currentView === 'dashboard' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          Dashboard
        </button>
        <button
          onClick={() => handleNav('home-planner')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            ['home-planner', 'party-planner', 'jewelry-planner'].includes(currentView)
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-orange-500" />
          Plan
        </button>
        <button
          onClick={() => handleNav('history')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            currentView === 'history' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          History
        </button>
        <button
          onClick={() => handleNav('profile')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            currentView === 'profile' ? 'text-blue-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          Profile
        </button>
      </div>
    </>
  );
};

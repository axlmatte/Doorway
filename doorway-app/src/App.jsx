import { Component, useState } from 'react';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import ExploreScreen from './screens/ExploreScreen';

class ScreenErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Screen render error:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6 text-center flex-1 flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-red-600 mb-2">
            Failed to load screen
          </p>
          <p className="text-xs text-slate-600 mb-4 break-words">
            {this.state.error.message}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 rounded-full bg-[#1E88E5] text-white text-xs font-semibold"
            >
              Retry
            </button>
            {this.props.onReset && (
              <button
                type="button"
                onClick={() => {
                  this.setState({ error: null });
                  this.props.onReset();
                }}
                className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [user, setUser] = useState(null);

  const goToAuth = () => setScreen('auth');

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setScreen('explore');
  };

  const handleUpdateUser = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUser,
    }));
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('auth');
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-0 sm:p-6">
      <div className="w-full max-w-[390px] h-[844px] bg-white sm:rounded-[44px] shadow-2xl overflow-hidden relative flex flex-col">
        <ScreenErrorBoundary
          key={screen}
          onReset={() => {
            setUser(null);
            setScreen('onboarding');
          }}
        >
          {screen === 'onboarding' && (
            <OnboardingScreen onGetStarted={goToAuth} />
          )}

          {screen === 'auth' && (
            <AuthScreen onAuthSuccess={handleAuthSuccess} />
          )}

          {screen === 'explore' && (
            <ExploreScreen
              user={user}
              onLogout={handleLogout}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </ScreenErrorBoundary>
      </div>
    </div>
  );
}
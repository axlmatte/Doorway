import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const STORAGE_KEY = 'doorway_accounts';

function getSavedAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccount(newAccount) {
  const accounts = getSavedAccounts();
  const updated = [...accounts, newAccount];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

function formatNameFromEmail(email) {
  const rawName = email.split('@')[0].replace(/[._]+/g, ' ').trim();
  if (!rawName) return 'Member';
  return rawName
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function AuthScreen({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setError('Please enter both your email and password.');
      return;
    }

    if (!normalizedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const accounts = getSavedAccounts();

    if (isSignUp) {
      if (!agreed) {
        setError('Please agree to the Terms & Conditions to continue.');
        return;
      }

      const alreadyExists = accounts.some(
        (acc) => acc.email.toLowerCase() === normalizedEmail
      );
      if (alreadyExists) {
        setError('An account with this email already exists. Try signing in.');
        return;
      }

      const newUser = {
        name: formatNameFromEmail(normalizedEmail),
        email: normalizedEmail,
        password,
      };

      saveAccount(newUser);
      onAuthSuccess({ name: newUser.name, email: newUser.email });
    } else {
      const matchedAccount = accounts.find(
        (acc) =>
          acc.email.toLowerCase() === normalizedEmail &&
          acc.password === password
      );

      if (!matchedAccount) {
        setError('Invalid email or password. Sign up first if you are new.');
        return;
      }

      onAuthSuccess({
        name: matchedAccount.name,
        email: matchedAccount.email,
      });
    }
  };

  const handleSocialLogin = (provider) => {
    const providerEmail = `${provider.toLowerCase()}.member@doorway.app`;
    const accounts = getSavedAccounts();
    const existing = accounts.find(
      (acc) => acc.email.toLowerCase() === providerEmail
    );

    if (existing) {
      onAuthSuccess({ name: existing.name, email: existing.email });
      return;
    }

    const socialUser = {
      name: `${provider} User`,
      email: providerEmail,
      password: null,
    };
    saveAccount(socialUser);
    onAuthSuccess({ name: socialUser.name, email: socialUser.email });
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50/70 px-7 pt-12 pb-8 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="text-2xl font-extrabold tracking-tight text-[#1E88E5] mb-3">
            doorway
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {isSignUp ? "Let's create your account" : 'Welcome back'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unlock your personalized experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-slate-200/80 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-11 py-3.5 rounded-full bg-white border border-slate-200/80 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {isSignUp && (
            <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-500">
                I agree to all <span className="text-slate-700 font-medium">Terms & Conditions</span>
              </span>
            </label>
          )}

          {error && (
            <p className="text-xs text-red-500 font-medium px-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-full bg-[#1E88E5] hover:bg-blue-600 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition"
          >
            {isSignUp ? 'Sign up' : 'Log in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] text-slate-400">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full py-3 px-4 rounded-full bg-white border border-slate-200/90 hover:bg-slate-50 flex items-center justify-center gap-3 text-xs font-semibold text-slate-700 transition"
          >
            <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 via-red-500 to-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
              G
            </span>
            {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full py-3 px-4 rounded-full bg-white border border-slate-200/90 hover:bg-slate-50 flex items-center justify-center gap-3 text-xs font-semibold text-slate-700 transition"
          >
            <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white text-[11px] font-bold flex items-center justify-center">
              f
            </span>
            {isSignUp ? 'Sign up with Facebook' : 'Continue with Facebook'}
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            className="w-full py-3 px-4 rounded-full bg-white border border-slate-200/90 hover:bg-slate-50 flex items-center justify-center gap-3 text-xs font-semibold text-slate-700 transition"
          >
            <span className="text-sm leading-none"></span>
            {isSignUp ? 'Sign up with Apple' : 'Continue with Apple'}
          </button>
        </div>
      </div>

      {/* Mode Switch */}
      <p className="text-center text-xs text-slate-500 mt-6">
        {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
        <button
          type="button"
          onClick={() => {
            setIsSignUp((prev) => !prev);
            setError('');
          }}
          className="text-[#1E88E5] font-semibold hover:underline"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
}
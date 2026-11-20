import { useState } from 'react';
import {
  MapPin,
  Bell,
  Search,
  SlidersHorizontal,
  Heart,
  ArrowUpRight,
  Star,
  Home,
  MessageSquare,
  User,
  LogOut,
  Pencil,
  ShieldCheck,
  Building2,
  Settings,
  Sun,
  Moon,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react';

const ACCOUNTS_STORAGE_KEY = 'doorway_accounts';

const CATEGORIES = ['Trending', 'House', 'Apartment', 'Villa'];

const RECOMMENDED_PROPERTIES = [
  {
    id: 1,
    title: 'Modern Glass Villa',
    price: '$19,995,000',
    location: 'Newport Coast, CA 92657',
    category: 'Villa',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Coastal Estate',
    price: '$39,995,000',
    location: '11 Pelican Dr, Newport',
    category: 'House',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Skyline Penthouse',
    price: '$8,450,000',
    location: 'Los Angeles, CA 90015',
    category: 'Apartment',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
  },
];

const POPULAR_PROPERTIES = [
  {
    id: 4,
    title: 'Pelican Hill',
    price: '$842.00',
    location: 'Alabama, United States',
    rating: '5.0',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Villa del Prato',
    price: '$15,748',
    location: 'California, United States',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&auto=format&fit=crop&q=80',
  },
];

function updateStoredAccount(currentEmail, nextName, nextEmail) {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    const accounts = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(accounts)) return { ok: true };

    const normalizedCurrent = (currentEmail || '').trim().toLowerCase();
    const normalizedNext = nextEmail.trim().toLowerCase();

    const emailTakenByOther = accounts.some(
      (acc) =>
        acc.email?.toLowerCase() === normalizedNext &&
        acc.email?.toLowerCase() !== normalizedCurrent
    );

    if (emailTakenByOther) {
      return { ok: false, error: 'That email is already used by another account.' };
    }

    let found = false;
    const updatedAccounts = accounts.map((acc) => {
      if (acc.email?.toLowerCase() === normalizedCurrent) {
        found = true;
        return {
          ...acc,
          name: nextName,
          email: normalizedNext,
        };
      }
      return acc;
    });

    if (!found && normalizedNext) {
      updatedAccounts.push({
        name: nextName,
        email: normalizedNext,
        password: null,
      });
    }

    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
    return { ok: true, email: normalizedNext };
  } catch {
    return { ok: false, error: 'Could not save changes to local storage.' };
  }
}

export default function ExploreScreen({ user, onLogout, onUpdateUser }) {
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([1, 4]);
  const [activeTab, setActiveTab] = useState('home');

  // App-wide light/dark theme toggle
  const [darkTheme, setDarkTheme] = useState(false);

  // Editable profile state
  const [profileName, setProfileName] = useState(user?.name || 'Guest User');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'No email signed in');
  const [profileImage, setProfileImage] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(user?.name || 'Guest User');
  const [draftEmail, setDraftEmail] = useState(user?.email || 'No email signed in');
  const [draftImage, setDraftImage] = useState('');
  const [editError, setEditError] = useState('');

  // Verified profile & Owner ID state
  const [isVerified, setIsVerified] = useState(false);
  const [ownerId, setOwnerId] = useState('');
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [ownerIdInput, setOwnerIdInput] = useState('');
  const [verifyError, setVerifyError] = useState('');

  // Quick status banner for Host / Settings actions
  const [statusMessage, setStatusMessage] = useState('');

  const isProfileView = activeTab === 'profile';

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openProfileView = () => {
    setActiveTab('profile');
    setStatusMessage('');
  };

  const startEditingProfile = () => {
    setDraftName(profileName);
    setDraftEmail(profileEmail);
    setDraftImage(profileImage);
    setEditError('');
    setIsEditingProfile(true);
    setStatusMessage('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setEditError('');

    const trimmedName = draftName.trim();
    const trimmedEmail = draftEmail.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      setEditError('Please enter both a name and an email.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setEditError('Please enter a valid email address.');
      return;
    }

    const storageResult = updateStoredAccount(
      profileEmail || user?.email,
      trimmedName,
      trimmedEmail
    );

    if (!storageResult.ok) {
      setEditError(storageResult.error || 'Could not save account changes.');
      return;
    }

    const savedEmail = storageResult.email || trimmedEmail;
    setProfileName(trimmedName);
    setProfileEmail(savedEmail);
    setProfileImage(draftImage.trim());
    setIsEditingProfile(false);
    setStatusMessage('Profile saved. Use your updated email when logging in.');

    if (typeof onUpdateUser === 'function') {
      onUpdateUser({
        ...user,
        name: trimmedName,
        email: savedEmail,
      });
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraftImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const cleanedId = ownerIdInput.trim();
    if (cleanedId.length < 4) {
      setVerifyError('Please enter a valid Owner ID (at least 4 characters).');
      return;
    }
    setOwnerId(cleanedId);
    setIsVerified(true);
    setShowVerifyForm(false);
    setVerifyError('');
    setStatusMessage('Owner ID verified. Your Verified badge is now active.');
  };

  const filteredRecommended = RECOMMENDED_PROPERTIES.filter((property) => {
    const matchesCategory =
      selectedCategory === 'Trending' || property.category === selectedCategory;
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderAvatar = (sizeClass = 'w-10 h-10', iconClass = 'w-5 h-5') => {
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={profileName}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white shadow-sm shrink-0`}
        />
      );
    }

    return (
      <span
        className={`${sizeClass} rounded-full bg-black text-white flex items-center justify-center ring-2 ring-white shadow-sm shrink-0`}
      >
        <User className={`${iconClass} fill-white text-white`} />
      </span>
    );
  };

  return (
    <div
      className={`flex-1 flex flex-col relative overflow-hidden transition-colors ${
        darkTheme ? 'bg-slate-950 text-white' : 'bg-slate-50/70 text-slate-900'
      }`}
    >
      {/* Scrollable Content with Transparent Scrollbar Track */}
      <div
        className={`flex-1 overflow-y-auto px-5 pt-8 pb-28 transition-colors ${
          darkTheme
            ? '[color-scheme:dark] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700 hover:[&::-webkit-scrollbar-thumb]:bg-slate-600'
            : '[color-scheme:light] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400'
        }`}
      >
        {isProfileView ? (
          /* User Profile View */
          <div>
            {/* Profile Top Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Explore
              </button>

              <span className="text-xs font-bold tracking-wide uppercase text-slate-400">
                Profile
              </span>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>

            {/* Avatar + Edit Pen + Verified Badge */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3">
                {renderAvatar('w-24 h-24', 'w-11 h-11')}

                <button
                  type="button"
                  onClick={startEditingProfile}
                  aria-label="Edit profile"
                  title="Edit profile"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1E88E5] hover:bg-blue-600 text-white flex items-center justify-center ring-2 ring-white shadow-md transition"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <h1 className="text-lg font-bold">{profileName}</h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[11px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-0.5">{profileEmail}</p>

              {isVerified && ownerId ? (
                <p className="text-[11px] text-emerald-500 mt-1">
                  Owner ID Verified: {ownerId}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowVerifyForm((prev) => !prev);
                    setVerifyError('');
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E88E5]/10 text-[#1E88E5] hover:bg-[#1E88E5]/20 text-xs font-semibold transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verify Profile
                </button>
              )}
            </div>

            {/* Owner ID Verification Form */}
            {showVerifyForm && !isVerified && (
              <form
                onSubmit={handleVerifySubmit}
                className={`mb-5 p-4 rounded-2xl border space-y-3 ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200/80 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">Owner ID Verification</p>
                  <button
                    type="button"
                    onClick={() => setShowVerifyForm(false)}
                    aria-label="Close verification form"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter your Owner ID to receive a verified badge on your profile.
                </p>
                <input
                  type="text"
                  value={ownerIdInput}
                  onChange={(e) => setOwnerIdInput(e.target.value)}
                  placeholder="Enter Owner ID (e.g. OWN-84920)"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#1E88E5] ${
                    darkTheme
                      ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                  }`}
                />
                {verifyError && (
                  <p className="text-[11px] text-red-500 font-medium">{verifyError}</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#1E88E5] hover:bg-blue-600 text-white text-xs font-semibold transition"
                >
                  Submit Owner ID
                </button>
              </form>
            )}

            {/* Inline Edit Profile Form (triggered by pen icon) */}
            {isEditingProfile && (
              <form
                onSubmit={handleSaveProfile}
                className={`mb-5 p-4 rounded-2xl border space-y-3 ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200/80 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">Edit Profile</p>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    aria-label="Cancel editing"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="Your name"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#1E88E5] ${
                      darkTheme
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#1E88E5] ${
                      darkTheme
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Profile Image URL or Upload
                  </label>
                  <input
                    type="text"
                    value={draftImage}
                    onChange={(e) => setDraftImage(e.target.value)}
                    placeholder="Paste image URL (leave blank for black default)"
                    className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#1E88E5] mb-2 ${
                      darkTheme
                        ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-[#1E88E5]/10 file:text-[#1E88E5]"
                    />
                    {draftImage && (
                      <button
                        type="button"
                        onClick={() => setDraftImage('')}
                        className="text-[11px] text-slate-400 hover:text-red-500 shrink-0"
                      >
                        Use default black
                      </button>
                    )}
                  </div>
                </div>

                {editError && (
                  <p className="text-[11px] text-red-500 font-medium">{editError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#1E88E5] hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </form>
            )}

            {statusMessage && (
              <p className="mb-4 text-center text-xs font-medium text-[#1E88E5]">
                {statusMessage}
              </p>
            )}

            {/* Requested Options Only: Host, Settings, Dark/Light Theme Switch */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() =>
                  setStatusMessage(
                    isVerified
                      ? 'Host dashboard ready for your verified listings.'
                      : 'Host mode selected. Verify your Owner ID above to publish listings.'
                  )
                }
                className={`w-full px-4 py-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-white'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800 shadow-sm'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-[#1E88E5]" />
                  Host
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setStatusMessage('Settings opened.')}
                className={`w-full px-4 py-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-white'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800 shadow-sm'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-[#1E88E5]" />
                  Settings
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setDarkTheme((prev) => !prev)}
                className={`w-full px-4 py-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold transition ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-white'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800 shadow-sm'
                }`}
              >
                <span className="flex items-center gap-3">
                  {darkTheme ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#1E88E5]" />
                  )}
                  {darkTheme ? 'Light Theme' : 'Dark Theme'}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    darkTheme
                      ? 'bg-amber-400/15 text-amber-300'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {darkTheme ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Default Explore View */
          <>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={openProfileView}
                aria-label={`${profileName} profile`}
                className="relative flex items-center"
              >
                {renderAvatar('w-10 h-10', 'w-5 h-5')}
                {isVerified && (
                  <span
                    title="Verified"
                    className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white absolute -bottom-0.5 -right-0.5"
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>

              <div className="text-center">
                <span className="block text-[10px] text-slate-400">Current location</span>
                <div
                  className={`flex items-center justify-center gap-1 text-xs font-semibold ${
                    darkTheme ? 'text-slate-100' : 'text-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>California, USA</span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center relative transition ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2.5 right-2.5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className={`flex-1 flex items-center rounded-full pl-4 pr-1.5 py-1.5 shadow-sm border ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-100'
                }`}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find something new"
                  className={`flex-1 text-xs placeholder:text-slate-400 focus:outline-none bg-transparent ${
                    darkTheme ? 'text-white' : 'text-slate-800'
                  }`}
                />
                <span className="w-8 h-8 rounded-full bg-[#1E88E5] text-white flex items-center justify-center">
                  <Search className="w-3.5 h-3.5" />
                </span>
              </div>

              <button
                type="button"
                aria-label="Filters"
                className={`w-11 h-11 rounded-full border shadow-sm flex items-center justify-center transition ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
                      isActive
                        ? 'bg-[#1E88E5] text-white shadow-sm shadow-blue-500/25'
                        : darkTheme
                          ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                          : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Recommended Property */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold">Recommended Property</h2>
                <button
                  type="button"
                  className="text-[11px] font-medium text-slate-400 hover:text-blue-500"
                >
                  See all
                </button>
              </div>

              <div className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar">
                {filteredRecommended.map((property) => {
                  const isLiked = favorites.includes(property.id);
                  return (
                    <div
                      key={property.id}
                      className={`min-w-[215px] rounded-3xl p-2.5 shadow-sm border ${
                        darkTheme
                          ? 'bg-slate-900 border-slate-800'
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="relative h-36 rounded-2xl overflow-hidden mb-2.5">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => toggleFavorite(property.id)}
                          aria-label="Save property"
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow-sm"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between px-1">
                        <div>
                          <p className="text-sm font-bold text-[#1E88E5]">{property.price}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                            {property.location}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label="View details"
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                            darkTheme
                              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600'
                          }`}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Most Popular */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold">Most Popular</h2>
                <button
                  type="button"
                  className="text-[11px] font-medium text-slate-400 hover:text-blue-500"
                >
                  See all
                </button>
              </div>

              <div className="space-y-3">
                {POPULAR_PROPERTIES.map((item) => {
                  const isLiked = favorites.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl p-2.5 shadow-sm border flex items-center gap-3 ${
                        darkTheme
                          ? 'bg-slate-900 border-slate-800'
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold truncate">{item.title}</h3>
                          <button
                            type="button"
                            onClick={() => toggleFavorite(item.id)}
                            aria-label="Favorite"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isLiked ? 'fill-red-500 text-red-500' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-[#1E88E5] mt-0.5">{item.price}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {item.location}
                          </span>
                          <span
                            className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                              darkTheme ? 'text-slate-200' : 'text-slate-700'
                            }`}
                          >
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {item.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="absolute bottom-5 left-5 right-5 h-16 rounded-full bg-slate-900 px-3 flex items-center justify-between shadow-xl">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'search', icon: Search, label: 'Search' },
          { id: 'messages', icon: MessageSquare, label: 'Messages' },
          { id: 'saved', icon: Heart, label: 'Saved' },
          { id: 'profile', icon: User, label: 'Profile' },
        ].map((nav) => {
          const Icon = nav.icon;
          const isActive = activeTab === nav.id;
          return (
            <button
              key={nav.id}
              type="button"
              aria-label={nav.label}
              onClick={() => setActiveTab(nav.id)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                isActive
                  ? 'bg-[#1E88E5] text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
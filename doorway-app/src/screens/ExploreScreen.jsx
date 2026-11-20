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
  PawPrint,
  ChevronDown,
} from 'lucide-react';

const ACCOUNTS_STORAGE_KEY = 'doorway_accounts';
const USD_TO_PHP_RATE = 64;

const CATEGORIES = ['Trending', 'House', 'Apartment', 'Villa'];
const RENTAL_TERMS = ['Monthly', 'Daily', 'Yearly'];
const PRESET_LOCATIONS = [
  'Manila, Philippines',
  'California, USA',
  'New York, USA',
  'Tokyo, Japan',
  'London, UK',
];

const PH_KEYWORDS = [
  'philippines',
  'manila',
  'cebu',
  'davao',
  'makati',
  'taguig',
  'bgc',
  'quezon',
  'pasig',
  'baguio',
  'tarlac',
  'concepcion',
  'pampanga',
  'clark',
  'subic',
  'boracay',
  'palawan',
  'iloilo',
  'batangas',
  'laguna',
  'cavite',
];

function isPhilippinesLocation(locationText = '') {
  const normalized = locationText.trim().toLowerCase();
  return PH_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function formatPropertyPrice(usdAmount, rentalTerm, activeLocation) {
  const unitSuffix =
    rentalTerm === 'Daily' ? 'day' : rentalTerm === 'Yearly' ? 'yr' : 'mo';

  if (isPhilippinesLocation(activeLocation)) {
    const phpAmount = Math.round(usdAmount * USD_TO_PHP_RATE);
    return `₱${phpAmount.toLocaleString('en-PH')} / ${unitSuffix}`;
  }

  return `$${usdAmount.toLocaleString('en-US')} / ${unitSuffix}`;
}

const RECOMMENDED_PROPERTIES = [
  {
    id: 1,
    title: 'Modern Glass Villa',
    usdPrice: 4500,
    location: 'Newport Coast, California, USA',
    area: 'California, USA',
    category: 'Villa',
    rentalTerm: 'Monthly',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Coastal Estate',
    usdPrice: 650,
    location: 'Pelican Dr, California, USA',
    area: 'California, USA',
    category: 'House',
    rentalTerm: 'Daily',
    petFriendly: false,
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Skyline Penthouse',
    usdPrice: 54000,
    location: 'Los Angeles, California, USA',
    area: 'California, USA',
    category: 'Apartment',
    rentalTerm: 'Yearly',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    title: 'BGC Horizon Loft',
    usdPrice: 1250,
    location: 'Taguig, Manila, Philippines',
    area: 'Manila, Philippines',
    category: 'Apartment',
    rentalTerm: 'Monthly',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    title: 'Alabang Courtyard Villa',
    usdPrice: 190,
    location: 'Muntinlupa, Manila, Philippines',
    area: 'Manila, Philippines',
    category: 'Villa',
    rentalTerm: 'Daily',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 15,
    title: 'Quezon Heritage House',
    usdPrice: 11250,
    location: 'Quezon City, Manila, Philippines',
    area: 'Manila, Philippines',
    category: 'House',
    rentalTerm: 'Yearly',
    petFriendly: false,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 9,
    title: 'Manhattan Brownstone',
    usdPrice: 72000,
    location: 'Upper East Side, New York, USA',
    area: 'New York, USA',
    category: 'House',
    rentalTerm: 'Yearly',
    petFriendly: false,
    image:
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 10,
    title: 'Shibuya Modern Suite',
    usdPrice: 3400,
    location: 'Shibuya, Tokyo, Japan',
    area: 'Tokyo, Japan',
    category: 'Apartment',
    rentalTerm: 'Monthly',
    petFriendly: false,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 11,
    title: 'Kensington Townhouse',
    usdPrice: 58000,
    location: 'Kensington, London, UK',
    area: 'London, UK',
    category: 'House',
    rentalTerm: 'Yearly',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&auto=format&fit=crop&q=80',
  },
];

const POPULAR_PROPERTIES = [
  {
    id: 4,
    title: 'Pelican Hill Retreat',
    usdPrice: 842,
    location: 'Newport Beach, California, USA',
    area: 'California, USA',
    rating: '5.0',
    rentalTerm: 'Daily',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Villa del Prato',
    usdPrice: 15748,
    location: 'Beverly Hills, California, USA',
    area: 'California, USA',
    rating: '4.9',
    rentalTerm: 'Monthly',
    petFriendly: false,
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Cedar Park Residence',
    usdPrice: 9500,
    location: 'Makati, Manila, Philippines',
    area: 'Manila, Philippines',
    rating: '4.8',
    rentalTerm: 'Yearly',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 16,
    title: 'Ortigas Sky Flat',
    usdPrice: 85,
    location: 'Pasig, Manila, Philippines',
    area: 'Manila, Philippines',
    rating: '4.9',
    rentalTerm: 'Daily',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 12,
    title: 'SoHo Studio Loft',
    usdPrice: 410,
    location: 'SoHo, New York, USA',
    area: 'New York, USA',
    rating: '4.9',
    rentalTerm: 'Daily',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 13,
    title: 'Aoyama Garden Villa',
    usdPrice: 4900,
    location: 'Minato, Tokyo, Japan',
    area: 'Tokyo, Japan',
    rating: '5.0',
    rentalTerm: 'Monthly',
    petFriendly: true,
    image:
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 14,
    title: 'Chelsea Mews House',
    usdPrice: 520,
    location: 'Chelsea, London, UK',
    area: 'London, UK',
    rating: '4.8',
    rentalTerm: 'Daily',
    petFriendly: false,
    image:
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=300&auto=format&fit=crop&q=80',
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

  // Changeable location state
  const [currentLocation, setCurrentLocation] = useState('Manila, Philippines');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [customLocationInput, setCustomLocationInput] = useState('');

  // Filter state: Monthly, Daily, Yearly, Pet Friendly
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTerms, setSelectedTerms] = useState([]);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);

  // App-wide light/dark theme toggle
  const [darkTheme, setDarkTheme] = useState(false);

  // Editable profile state
  const [profileName, setProfileName] = useState(user?.name || 'Member');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(user?.name || 'Member');
  const [draftEmail, setDraftEmail] = useState(user?.email || '');
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

  const activeFilterCount = selectedTerms.length + (petFriendlyOnly ? 1 : 0);

  const toggleRentalTerm = (term) => {
    setSelectedTerms((prev) =>
      prev.includes(term) ? prev.filter((item) => item !== term) : [...prev, term]
    );
  };

  const resetFilters = () => {
    setSelectedTerms([]);
    setPetFriendlyOnly(false);
  };

  const handleSaveCustomLocation = (e) => {
    e.preventDefault();
    if (!customLocationInput.trim()) return;
    setCurrentLocation(customLocationInput.trim());
    setCustomLocationInput('');
    setShowLocationPicker(false);
  };

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

  // Strictly match listings belonging only to the selected location/area
  const matchesLocationArea = (property) => {
    const selected = currentLocation.trim().toLowerCase();
    if (!selected) return true;

    const areaText = (property.area || '').toLowerCase();
    const locText = (property.location || '').toLowerCase();

    if (areaText === selected || locText.includes(selected) || areaText.includes(selected)) {
      return true;
    }

    const tokens = selected
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length >= 2);

    return tokens.some(
      (token) => areaText.includes(token) || locText.includes(token)
    );
  };

  const matchesPreferences = (property) => {
    const matchesArea = matchesLocationArea(property);
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTerm =
      selectedTerms.length === 0 || selectedTerms.includes(property.rentalTerm);
    const matchesPet = !petFriendlyOnly || property.petFriendly;
    return matchesArea && matchesSearch && matchesTerm && matchesPet;
  };

  const filteredRecommended = RECOMMENDED_PROPERTIES.filter((property) => {
    const matchesCategory =
      selectedCategory === 'Trending' || property.category === selectedCategory;
    return matchesCategory && matchesPreferences(property);
  });

  const filteredPopular = POPULAR_PROPERTIES.filter(matchesPreferences);

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

              {profileEmail && (
                <p className="text-xs text-slate-400 mt-0.5">{profileEmail}</p>
              )}

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

              {/* Changeable Location Button */}
              <button
                type="button"
                onClick={() => setShowLocationPicker((prev) => !prev)}
                className="text-center group"
              >
                <span className="block text-[10px] text-slate-400">
                  Current location ({isPhilippinesLocation(currentLocation) ? 'PHP ₱' : 'USD $'})
                </span>
                <div
                  className={`flex items-center justify-center gap-1 text-xs font-semibold ${
                    darkTheme ? 'text-slate-100' : 'text-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1E88E5]" />
                  <span className="max-w-[165px] truncate">{currentLocation}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#1E88E5] transition" />
                </div>
              </button>

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

            {/* Location Picker Panel */}
            {showLocationPicker && (
              <div
                className={`mb-4 p-3.5 rounded-2xl border space-y-2.5 ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200/80 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">Change Location</p>
                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(false)}
                    aria-label="Close location picker"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveCustomLocation} className="flex gap-2">
                  <input
                    type="text"
                    value={customLocationInput}
                    onChange={(e) => setCustomLocationInput(e.target.value)}
                    placeholder="Enter city or country..."
                    className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#1E88E5] ${
                      darkTheme
                        ? 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#1E88E5] text-white text-xs font-semibold hover:bg-blue-600 transition"
                  >
                    Set
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {PRESET_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setCurrentLocation(loc);
                        setShowLocationPicker(false);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                        currentLocation === loc
                          ? 'bg-[#1E88E5] text-white'
                          : darkTheme
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Bar + Filter Toggle */}
            <div className="flex items-center gap-2.5 mb-4">
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
                  placeholder={`Search in ${currentLocation}`}
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
                onClick={() => setShowFilters((prev) => !prev)}
                className={`w-11 h-11 rounded-full border shadow-sm flex items-center justify-center relative transition ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-[#1E88E5] border-[#1E88E5] text-white'
                    : darkTheme
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Preferences Panel: Monthly, Daily, Yearly, Pet Friendly */}
            {showFilters && (
              <div
                className={`mb-4 p-3.5 rounded-2xl border space-y-3 ${
                  darkTheme
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200/80 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">Filter Preferences</p>
                  <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-[11px] font-semibold text-[#1E88E5] hover:underline"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      aria-label="Close filters"
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-400 mb-1.5">
                    Rental Basis
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {RENTAL_TERMS.map((term) => {
                      const selected = selectedTerms.includes(term);
                      return (
                        <button
                          key={term}
                          type="button"
                          onClick={() => toggleRentalTerm(term)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                            selected
                              ? 'bg-[#1E88E5] text-white shadow-sm'
                              : darkTheme
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {term}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setPetFriendlyOnly((prev) => !prev)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold transition ${
                      petFriendlyOnly
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                        : darkTheme
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4" />
                      Pet Friendly
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        petFriendlyOnly
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {petFriendlyOnly ? 'YES' : 'ANY'}
                    </span>
                  </button>
                </div>
              </div>
            )}

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
                <h2 className="text-sm font-bold">
                  Recommended in {currentLocation}
                </h2>
                <span className="text-[11px] font-medium text-slate-400">
                  {filteredRecommended.length} listed
                </span>
              </div>

              {filteredRecommended.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No recommended listings found in {currentLocation} for these filters.
                </p>
              ) : (
                <div className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar">
                  {filteredRecommended.map((property) => {
                    const isLiked = favorites.includes(property.id);
                    const formattedPrice = formatPropertyPrice(
                      property.usdPrice,
                      property.rentalTerm,
                      currentLocation
                    );
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
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-semibold">
                              {property.rentalTerm}
                            </span>
                            {property.petFriendly && (
                              <span
                                title="Pet Friendly"
                                className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center"
                              >
                                <PawPrint className="w-3 h-3" />
                              </span>
                            )}
                          </div>
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
                            <p className="text-sm font-bold text-[#1E88E5]">
                              {formattedPrice}
                            </p>
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
              )}
            </div>

            {/* Most Popular */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold">
                  Popular in {currentLocation}
                </h2>
                <span className="text-[11px] font-medium text-slate-400">
                  {filteredPopular.length} listed
                </span>
              </div>

              {filteredPopular.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No popular listings found in {currentLocation} for these filters.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredPopular.map((item) => {
                    const isLiked = favorites.includes(item.id);
                    const formattedPrice = formatPropertyPrice(
                      item.usdPrice,
                      item.rentalTerm,
                      currentLocation
                    );
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
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h3 className="text-xs font-bold truncate">{item.title}</h3>
                              <span className="px-1.5 py-0.5 rounded bg-[#1E88E5]/10 text-[#1E88E5] text-[9px] font-semibold shrink-0">
                                {item.rentalTerm}
                              </span>
                              {item.petFriendly && (
                                <PawPrint
                                  className="w-3 h-3 text-emerald-500 shrink-0"
                                  title="Pet Friendly"
                                />
                              )}
                            </div>
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
                          <p className="text-xs font-bold text-[#1E88E5] mt-0.5">
                            {formattedPrice}
                          </p>
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
              )}
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
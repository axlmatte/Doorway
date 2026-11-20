import { useState } from 'react';

const SLIDES = [
  {
    title: 'Ultimate Platform for Seamless Messaging and Connected Conversations!',
  },
  {
    title: 'Discover Curated Homes and Spaces Tailored to Your Lifestyle.',
  },
  {
    title: 'Connect Directly with Verified Hosts in Just a Few Taps.',
  },
];

const AVATARS = [
  {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    size: 'w-24 h-24',
    position: 'top-20 left-1/2 -translate-x-1/2',
    ring: 'ring-4 ring-white shadow-lg',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    size: 'w-14 h-14',
    position: 'top-6 left-10',
    ring: 'ring-2 ring-white shadow-md',
  },
  {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    size: 'w-16 h-16',
    position: 'top-10 right-7',
    ring: 'ring-2 ring-white shadow-md',
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    size: 'w-12 h-12',
    position: 'top-32 right-9',
    ring: 'ring-2 ring-white shadow-md',
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    size: 'w-10 h-10',
    position: 'top-24 left-6',
    ring: 'ring-2 ring-white shadow-sm',
  },
  {
    src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    size: 'w-9 h-9',
    position: 'top-16 left-28',
    ring: 'ring-2 ring-white shadow-sm',
  },
];

export default function OnboardingScreen({ onGetStarted }) {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-50 to-white px-7 pt-10 pb-10 select-none">
      {/* Orbital Avatars Section */}
      <div className="relative h-72 w-full flex items-center justify-center">
        {/* Decorative Rings */}
        <div className="absolute w-64 h-64 rounded-full border border-blue-100/80" />
        <div className="absolute w-44 h-44 rounded-full border border-blue-100" />

        {/* Accent Dots */}
        <span className="absolute top-8 right-24 w-2.5 h-2.5 rounded-full bg-blue-500" />
        <span className="absolute bottom-14 left-24 w-4 h-4 rounded-full bg-blue-500" />
        <span className="absolute bottom-16 right-20 w-3 h-3 rounded-full bg-indigo-400" />
        <span className="absolute top-36 left-14 w-2 h-2 rounded-full bg-sky-300" />

        {/* Profile Avatars */}
        {AVATARS.map((avatar, index) => (
          <img
            key={index}
            src={avatar.src}
            alt="Community member"
            className={`absolute rounded-full object-cover transition-transform duration-500 hover:scale-105 ${avatar.size} ${avatar.position} ${avatar.ring}`}
          />
        ))}
      </div>

      {/* Bottom Copy & Action */}
      <div className="flex flex-col items-center text-center">
        {/* Pagination Dots */}
        <div className="flex items-center gap-2 mb-6">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === index ? 'w-5 bg-blue-500' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>

        <h1 className="text-[22px] font-bold text-slate-900 leading-snug tracking-tight mb-9 px-2">
          {SLIDES[activeSlide].title}
        </h1>

        <button
          type="button"
          onClick={onGetStarted}
          className="w-full py-3.5 rounded-full bg-[#1E88E5] hover:bg-blue-600 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
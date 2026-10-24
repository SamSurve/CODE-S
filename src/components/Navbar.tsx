'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Code2,
  Upload,
  Settings,
  ChevronDown,
  Terminal,
  Info,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { PRACTICALS } from '../data/practicals';
import { Practical } from '../types';
import UploadModal from './UploadModal';
import SettingsModal from './SettingsModal';
import PracticalDetailModal from './PracticalDetailModal';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isPracticalsDropdownOpen, setIsPracticalsDropdownOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModalPractical, setActiveModalPractical] = useState<Practical | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPracticalsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPracticalsDropdownOpen(false);
      }
    };

    if (isPracticalsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPracticalsDropdownOpen]);

  const handleSelectPractical = (practical: Practical) => {
    // Close dropdown automatically
    setIsPracticalsDropdownOpen(false);

    // Dispatch custom event for compiler page to pick up instantly
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aoa:load-practical', { detail: practical.id })
      );
      window.history.pushState(null, '', `/compiler?practical=${practical.id}`);
    }

    // Only invoke router if not already on /compiler to prevent unnecessary remounts
    if (pathname !== '/compiler') {
      router.push(`/compiler?practical=${practical.id}`, { scroll: false });
    }
  };

  const handleOpenInfo = (e: React.MouseEvent, practical: Practical) => {
    e.stopPropagation();
    setActiveModalPractical(practical);
    setIsPracticalsDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md transition-all">
        <div className="w-full px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <Link href="/compiler" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
                AOA Practical Codes
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Write · Run · Learn
              </span>
            </div>
          </Link>

          {/* Center / Nav Items */}
          <div className="flex items-center gap-2">
            {/* The Small "Practicals ▼" Button in Navbar (Requirement) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsPracticalsDropdownOpen(!isPracticalsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all select-none active:scale-95 ${
                  isPracticalsDropdownOpen
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800 hover:border-zinc-700'
                }`}
                aria-expanded={isPracticalsDropdownOpen}
                aria-haspopup="true"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Practicals</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isPracticalsDropdownOpen ? 'rotate-180 text-white' : 'text-zinc-400'
                  }`}
                />
              </button>

              {/* Compact Dropdown List of Numbered Practical Titles (1–11) */}
              {isPracticalsDropdownOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/80 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-zinc-800/80 bg-zinc-950/70 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Select AOA Practical (1–11)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">11 Experiments</span>
                  </div>

                  <div className="max-h-[380px] overflow-y-auto py-1 divide-y divide-zinc-800/40">
                    {PRACTICALS.map((practical, index) => {
                      const itemNumber = index + 1;
                      return (
                        <div
                          key={practical.id}
                          data-practical-id={practical.id}
                          onClick={() => handleSelectPractical(practical)}
                          className="group flex items-center justify-between px-3 py-2 hover:bg-blue-600/10 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {/* Numbered 1-11 Badge */}
                            <span className="w-5 h-5 rounded-md bg-zinc-800 group-hover:bg-blue-600 text-zinc-400 group-hover:text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors">
                              {itemNumber}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-zinc-200 group-hover:text-blue-300 truncate transition-colors">
                                {practical.title}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                                <span>{practical.expNumber}</span>
                                <span>·</span>
                                <span>{practical.paradigm}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Tiny info button to view aim & algorithm details if desired */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenInfo(e, practical)}
                              title="View Aim & Algorithm"
                              className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-3 py-2 bg-zinc-950/80 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-between">
                    <span>Click any practical to load into compiler</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">
                      Esc to close
                    </kbd>
                  </div>
                </div>
              )}
            </div>

            {/* Compiler Navigation link */}
            <Link
              href="/compiler"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === '/compiler' || pathname === '/'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compiler</span>
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Compact Upload Code Button */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm active:scale-95"
              title="Upload .c or .cpp file"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Upload Code</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Execution Engine Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              title="Execution Engine Settings (Judge0 / RapidAPI)"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Practical Details Modal (when info icon is clicked in dropdown) */}
      <PracticalDetailModal
        practical={activeModalPractical}
        isOpen={Boolean(activeModalPractical)}
        onClose={() => setActiveModalPractical(null)}
      />
    </>
  );
}

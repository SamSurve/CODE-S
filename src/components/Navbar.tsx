'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code2,
  Upload,
  Settings
} from 'lucide-react';
import UploadModal from './UploadModal';
import SettingsModal from './SettingsModal';

interface NavbarProps {
  onUploadCode?: (code: string, fileName?: string) => void;
}

export default function Navbar({ onUploadCode }: NavbarProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md transition-all">
        <div className="w-full px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Online Compiler
              </span>
            </div>
          </Link>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Upload Code Button */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm active:scale-95"
              title="Upload code file"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Upload Code</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Settings Gear Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={onUploadCode}
      />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HOTSPOT, ENABLE_PIN, LIB_SECRET_HEADER, LIB_SECRET_VALUE, SUBJECT_NAMES } from '../config';
import { Item, ItemSummary } from '../data/library/types';

interface HiddenHotspotMenuProps {
  onSelectItem: (item: Item) => void;
}

export default function HiddenHotspotMenu({ onSelectItem }: HiddenHotspotMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState<1 | 2 | 'pin'>(1);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [items, setItems] = useState<ItemSummary[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const hotspotRef = useRef<HTMLButtonElement>(null);

  // Position styles for invisible hotspot
  const hotspotStyle = useMemo(() => {
    const { corner, offsetX, offsetY } = HOTSPOT;
    const style: React.CSSProperties = {
      position: 'fixed',
      width: '28px',
      height: '28px',
      opacity: 0,
      cursor: 'default',
      border: 'none',
      outline: 'none',
      padding: 0,
      margin: 0,
      zIndex: 9999
    };
    if (corner === 'bottom-left') {
      style.bottom = `${offsetY}px`;
      style.left = `${offsetX}px`;
    } else if (corner === 'bottom-right') {
      style.bottom = `${offsetY}px`;
      style.right = `${offsetX}px`;
    } else if (corner === 'top-left') {
      style.top = `${offsetY}px`;
      style.left = `${offsetX}px`;
    } else if (corner === 'top-right') {
      style.top = `${offsetY}px`;
      style.right = `${offsetX}px`;
    }
    return style;
  }, []);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node) &&
        hotspotRef.current &&
        !hotspotRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    if (ENABLE_PIN) {
      setLevel('pin');
    } else {
      setLevel(1);
    }
    setActiveSubjectId(null);
    setSearch('');
    setIsOpen(true);
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPinError(null);
    try {
      const res = await fetch('/api/lib/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [LIB_SECRET_HEADER]: LIB_SECRET_VALUE
        },
        body: JSON.stringify({ pin })
      });
      if (res.ok) {
        setLevel(1);
      } else {
        setPinError('Invalid PIN');
      }
    } catch {
      setPinError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSubject = async (subjectId: string) => {
    setIsLoading(true);
    setActiveSubjectId(subjectId);
    try {
      const res = await fetch(`/api/lib?subject=${subjectId}`, {
        headers: {
          [LIB_SECRET_HEADER]: LIB_SECRET_VALUE
        }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setLevel(2);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExp = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/lib/item?id=${id}`, {
        headers: {
          [LIB_SECRET_HEADER]: LIB_SECRET_VALUE
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          onSelectItem(data.item);
          setIsOpen(false);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const query = search.trim().toLowerCase().replace(/^exp-?/, '');
    return items.filter((it) => it.expNo.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <>
      {/* Invisible Hotspot */}
      <button
        ref={hotspotRef}
        type="button"
        tabIndex={-1}
        onClick={toggleOpen}
        style={hotspotStyle}
      />

      {/* Small Dark Overlay Panel */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed z-[10000] bottom-10 left-3 w-72 sm:w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3 text-zinc-200 animate-in fade-in zoom-in-95 duration-150"
        >
          {level === 'pin' && (
            <form onSubmit={handleVerifyPin} className="flex flex-col gap-2.5 p-1">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="4-digit PIN"
                autoFocus
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-center font-mono text-sm tracking-widest text-zinc-100 focus:outline-none focus:border-zinc-600"
              />
              {pinError && <span className="text-[11px] text-red-400 text-center">{pinError}</span>}
              <button
                type="submit"
                disabled={isLoading || pin.length < 4}
                className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-medium rounded-lg text-zinc-200 transition-colors"
              >
                {isLoading ? '...' : 'Enter'}
              </button>
            </form>
          )}

          {level === 1 && (
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectSubject('aoa')}
                className="w-full py-2.5 px-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-200 text-left transition-colors flex items-center justify-between"
              >
                <span>{SUBJECT_NAMES.aoa}</span>
                <span className="text-[11px] text-zinc-500 font-mono">11</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSubject('java')}
                className="w-full py-2.5 px-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-200 text-left transition-colors flex items-center justify-between"
              >
                <span>{SUBJECT_NAMES.java}</span>
                <span className="text-[11px] text-zinc-500 font-mono">18</span>
              </button>
            </div>
          )}

          {level === 2 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLevel(1)}
                  className="p-1 px-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-xs text-zinc-400 hover:text-white transition-colors"
                  title="Back"
                >
                  ←
                </button>
                {items.length > 12 && (
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    autoFocus
                    className="flex-1 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700 placeholder-zinc-600"
                  />
                )}
              </div>

              <div className="grid grid-cols-3 gap-1.5 max-h-56 overflow-y-auto p-0.5">
                {filteredItems.map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => handleSelectExp(it.id)}
                    className="py-1.5 px-1 bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 hover:border-zinc-700 rounded text-[11px] font-mono text-zinc-300 hover:text-white text-center transition-colors truncate"
                  >
                    EXP-{it.expNo}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

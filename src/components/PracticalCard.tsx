'use client';

import React from 'react';
import Link from 'next/link';
import { Practical } from '../types';
import { Play, Eye, Clock, Cpu, ArrowUpRight } from 'lucide-react';

interface PracticalCardProps {
  practical: Practical;
  onOpenDetails: (p: Practical) => void;
}

export default function PracticalCard({ practical, onOpenDetails }: PracticalCardProps) {
  // Paradigm color mapping
  const getBadgeColor = (paradigm: Practical['paradigm']) => {
    switch (paradigm) {
      case 'Divide & Conquer':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Dynamic Programming':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Greedy':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Backtracking':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Branch & Bound':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700/80 p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            {practical.expNumber}
          </span>
          <span
            className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border ${getBadgeColor(
              practical.paradigm
            )}`}
          >
            {practical.paradigm}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenDetails(practical)}
          className="text-base font-bold text-zinc-100 group-hover:text-blue-400 transition-colors cursor-pointer flex items-center justify-between"
        >
          <span>{practical.title}</span>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
        </h3>

        {/* Category & Description */}
        <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {practical.aim}
        </p>

        {/* Complexity Pills */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-mono text-zinc-300">{practical.timeComplexity.average}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-500">
            <Cpu className="w-3.5 h-3.5" />
            <span className="uppercase font-mono text-[10px]">{practical.language}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => onOpenDetails(practical)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50 hover:text-white transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        <Link
          href={`/compiler?practical=${practical.id}`}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run This Code</span>
        </Link>
      </div>
    </div>
  );
}

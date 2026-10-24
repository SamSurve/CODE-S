'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import PracticalCard from '../../components/PracticalCard';
import PracticalDetailModal from '../../components/PracticalDetailModal';
import { PRACTICALS, CATEGORIES, PARADIGMS } from '../../data/practicals';
import { Practical } from '../../types';
import { Search, Filter, BookOpen, Layers, X, Sparkles, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function PracticalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedParadigm, setSelectedParadigm] = useState<string>('All');
  const [activeModalPractical, setActiveModalPractical] = useState<Practical | null>(null);

  // Filtered practicals list
  const filteredPracticals = useMemo(() => {
    return PRACTICALS.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.expNumber.toLowerCase().includes(query) ||
        p.aim.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.paradigm.toLowerCase().includes(query) ||
        p.sourceCode.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const matchesParadigm =
        selectedParadigm === 'All' || p.paradigm === selectedParadigm;

      return matchesSearch && matchesCategory && matchesParadigm;
    });
  }, [searchQuery, selectedCategory, selectedParadigm]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedParadigm !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedParadigm('All');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-blue-600/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Official College Syllabus
              </span>
              <span className="text-xs text-zinc-500">11 Full Practicals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Algorithm Practical Library
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Explore Analysis of Algorithms experiments with documented aims, step-by-step algorithms,
              time & space complexity breakdowns, verified sample test cases, and in-browser compilation.
            </p>
          </div>

          <Link
            href="/compiler"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all self-start md:self-auto"
          >
            <Terminal className="w-4 h-4" />
            <span>Open Empty Compiler</span>
          </Link>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4 p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search practicals by title, algorithm keyword, paradigm, or code (e.g. 'Dijkstra', 'Knapsack', 'Divide & Conquer')..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 p-0.5 rounded-md text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Category Filter:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Paradigm Pills */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Algorithmic Paradigm:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PARADIGMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedParadigm(p)}
                  className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                    selectedParadigm === p
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Active filter count & reset */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-500">
            <div>
              Showing <span className="font-semibold text-zinc-300">{filteredPracticals.length}</span> of{' '}
              <span className="font-semibold text-zinc-300">{PRACTICALS.length}</span> practicals
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Practicals Cards Grid */}
        {filteredPracticals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPracticals.map((practical) => (
              <PracticalCard
                key={practical.id}
                practical={practical}
                onOpenDetails={setActiveModalPractical}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center gap-3">
            <BookOpen className="w-10 h-10 text-zinc-600" />
            <h3 className="text-base font-semibold text-zinc-300">No matching practicals found</h3>
            <p className="text-xs text-zinc-500 max-w-sm">
              We couldn&apos;t find any practicals matching your current search and filter combination.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              Clear Search &amp; Filters
            </button>
          </div>
        )}
      </main>

      {/* Practical Details Modal */}
      <PracticalDetailModal
        practical={activeModalPractical}
        isOpen={Boolean(activeModalPractical)}
        onClose={() => setActiveModalPractical(null)}
      />
    </div>
  );
}

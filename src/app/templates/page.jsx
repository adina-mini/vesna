'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Search,
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { getAllTemplates, getCategories } from '@/templates/registry';

export default function TemplatesDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allTemplates = getAllTemplates();
  const categories = getCategories();

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: allTemplates.length };
    categories.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = allTemplates.filter((t) => t.category === cat.id).length;
      }
    });
    return counts;
  }, [allTemplates, categories]);

  // Filtered by category and search
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allTemplates, selectedCategory, searchQuery]);

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header & Title Area */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-paper border border-sand-300 text-olive text-xs font-sans uppercase tracking-[0.25em] font-semibold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>The Atelier Archive</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-espresso mb-4 tracking-tight">
          All Invitation Suites
        </h1>
        <p className="font-sans text-sm sm:text-base text-espresso/70 max-w-xl mx-auto leading-relaxed">
          Explore handcrafted bespoke invitation suites capturing the distinct spirit, emotion, and grandeur of your celebration.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-8 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-espresso/50 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event, style, or title (e.g. Walima, Qawwali, Sage)..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-paper border border-sand-300 text-espresso text-xs font-sans placeholder:text-espresso/45 focus:outline-none focus:border-olive focus:ring-2 focus:ring-olive/15 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 rounded-full text-espresso/40 hover:text-espresso transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-8">
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full font-sans text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-espresso text-paper font-semibold shadow-xs ring-1 ring-gold-500/30'
                    : 'bg-paper text-espresso/75 hover:text-espresso hover:bg-sand-100 border border-sand-300'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-paper/20 text-paper'
                      : 'bg-sand-200 text-espresso/80'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Templates */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group rounded-[32px] bg-paper border border-sand-300/80 overflow-hidden shadow-atelier hover:shadow-atelier-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full"
            >
              <div>
                {/* Thumbnail Header with Glass Badge and Hover Animation */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-sand-200/50">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 rounded-full bg-paper/95 backdrop-blur-md border border-sand-300 text-[10px] font-sans uppercase tracking-widest text-espresso font-semibold shadow-xs">
                      {template.categoryLabel}
                    </span>
                  </div>

                  {/* Palette Dots */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 p-1.5 rounded-full bg-paper/90 backdrop-blur-md border border-sand-300 shadow-xs">
                    {template.palette.map((hex, i) => (
                      <div
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-sand-300/80 shadow-2xs"
                        style={{ backgroundColor: hex }}
                        title={`Palette ${hex}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Card Content with elevated typography */}
                <div className="p-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso mb-2 group-hover:text-burgundy transition-colors">
                    {template.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-espresso/70 line-clamp-3 leading-relaxed mb-4">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 space-y-2.5">
                <Link
                  href={`/create?template=${template.id}`}
                  className="w-full py-2.5 rounded-xl bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider text-center block shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5 ring-1 ring-gold-500/20"
                >
                  <span>Customize This Design</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sand-300" />
                </Link>

                <Link
                  href={`/create?template=${template.id}#sample`}
                  className="w-full py-2 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-medium uppercase tracking-wider text-center block transition-all"
                >
                  View Sample Showcase
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-sand-100 border border-sand-300 flex items-center justify-center mx-auto mb-4 text-olive">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-espresso mb-2">
            No Suites Found
          </h3>
          <p className="font-sans text-xs sm:text-sm text-espresso/70 mb-6">
            We couldn’t find any suites matching &ldquo;{searchQuery}&rdquo;. Try another search keyword or browse all suites.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-6 py-2.5 rounded-full bg-espresso text-paper text-xs uppercase tracking-wider font-sans font-semibold shadow-xs"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

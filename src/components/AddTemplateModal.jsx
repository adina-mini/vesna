'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  Link as LinkIcon,
  FolderOpen,
  Eye,
  Sliders,
  Calendar,
  MapPin,
  Heart,
  AlertCircle
} from 'lucide-react';
import { optimizeImageFile } from '@/lib/imageOptimizer';

const PALETTE_PRESETS = [
  {
    name: 'Velvet Burgundy & 24k Gold',
    palette: ['#26060A', '#D4AF37', '#FAF5EF'],
  },
  {
    name: 'Imperial Emerald & Pale Gold',
    palette: ['#0E2A1F', '#C5A059', '#F8F6F0'],
  },
  {
    name: 'Midnight Sapphire & Stardust',
    palette: ['#0B1B3D', '#D4AF37', '#F2F5FA'],
  },
  {
    name: 'Obsidian Noir & Rose Gold',
    palette: ['#141414', '#E0A899', '#FAF5EF'],
  },
  {
    name: 'Terracotta Marigold & Honey',
    palette: ['#4A1E0D', '#E5A93C', '#FFFBF5'],
  },
  {
    name: 'Ivory Cream & Sage Blossom',
    palette: ['#FAF7F0', '#C9A84C', '#324530'],
  },
];

const LAYOUT_ENGINES = [
  {
    id: 'royal-arch',
    name: 'Royal Arched Pavilion',
    desc: 'Mughal scalloped alcoves, symmetrical 24k gold filigree, and formal regal dignity.',
  },
  {
    id: 'botanical-noir',
    name: 'Botanical Noir Elegance',
    desc: 'Gilded foliage borders, deep velvet textures, and romantic modern opulence.',
  },
  {
    id: 'festive-mandala',
    name: 'Festive Jharokha & Mandala',
    desc: 'Intricate golden medallion crest, vibrant warmth, and spirited celebration.',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal Atelier',
    desc: 'High-fashion editorial typography, clean double gold rules, and contemporary grace.',
  },
];

// Curated library of pictures from public/assets
const ATELIER_LIBRARY = [
  // Couples & Honorees
  { id: 'c1', label: 'Classic Royal Barat', url: '/assets/couple-hero.jpg', category: 'couples' },
  { id: 'c2', label: 'Ivory & Pale Gold Couple', url: '/assets/ivory-barat-couple.jpg', category: 'couples' },
  { id: 'c3', label: 'Crimson Velvet Couple', url: '/assets/crimson-couple.jpg', category: 'couples' },
  { id: 'c4', label: 'Emerald Imperial Couple', url: '/assets/emerald-barat-couple.jpg', category: 'couples' },
  { id: 'c5', label: 'Festive Mehndi Couple', url: '/assets/mehndi-couple.jpg', category: 'couples' },
  { id: 'c6', label: 'Modern Walima Couple', url: '/assets/reception-couple.jpg', category: 'couples' },
  { id: 'c7', label: 'Traditional Mayun Bride', url: '/assets/mayun-bride-main.jpg', category: 'couples' },
  { id: 'c8', label: 'Blush Bridal Shower', url: '/assets/bridal-shower-hero.jpg', category: 'couples' },
  { id: 'c9', label: 'Regal Engagement Couple', url: '/assets/engagement-couple.jpg', category: 'couples' },
  { id: 'c10', label: 'Emerald Anniversary Couple', url: '/assets/anniversary-couple.jpg', category: 'couples' },
  { id: 'c11', label: 'Aqiqah Prince', url: '/assets/aqiqah-boy.jpg', category: 'couples' },
  { id: 'c12', label: 'Aqiqah Princess', url: '/assets/aqiqah-girl.jpg', category: 'couples' },
  { id: 'c13', label: 'Noir Birthday Child', url: '/assets/boy-birthday-noir.jpg', category: 'couples' },
  { id: 'c14', label: 'Blush Birthday Girl', url: '/assets/girl-birthday.jpg', category: 'couples' },

  // Venues & Stages
  { id: 'v1', label: 'Grand Arched Barat Stage', url: '/assets/barat-stage-venue.jpg', category: 'venues' },
  { id: 'v2', label: 'Crystal Chandelier Ballroom', url: '/assets/walima-venue.jpg', category: 'venues' },
  { id: 'v3', label: 'Historic Haveli Barood Khana', url: '/assets/qawwali-hero.jpg', category: 'venues' },
  { id: 'v4', label: 'Imperial Banquet Pavilion', url: '/assets/venue-hall.png', category: 'venues' },
  { id: 'v5', label: 'Gilded Floral Birthday Stage', url: '/assets/birthday-venue-stage.jpg', category: 'venues' },
  { id: 'v6', label: 'Mayun Courtyard Setting', url: '/assets/mayun-setting-end.jpg', category: 'venues' },

  // Seals & Intro Gate Artworks
  { id: 's1', label: 'Mughal Gold Medallion Seal', url: '/assets/couple-golden-intro.jpg', category: 'seals' },
  { id: 's2', label: 'Bridal Rose Gold Seal', url: '/assets/bridal-girl-golden-intro.jpg', category: 'seals' },
  { id: 's3', label: 'Golden Infant Crescent Seal', url: '/assets/baby-golden-intro.jpg', category: 'seals' },
  { id: 's4', label: 'Celebration Starburst Seal', url: '/assets/birthday-golden-intro.jpg', category: 'seals' },
  { id: 's5', label: 'Royal Heirloom Crest', url: '/assets/boy-golden-intro.jpg', category: 'seals' },
];

const CATEGORY_DEFAULTS = {
  nikkah: {
    hero: '/assets/couple-hero.jpg',
    venue: '/assets/barat-stage-venue.jpg',
    intro: '/assets/couple-golden-intro.jpg',
    bride: 'Fatima Noor',
    groom: 'Sharjeel Khan',
    eventTitle: 'The Grand Barat Ceremony',
    venueName: 'The Grand Palm Royale, Lahore',
  },
  walima: {
    hero: '/assets/ivory-barat-couple.jpg',
    venue: '/assets/walima-venue.jpg',
    intro: '/assets/couple-golden-intro.jpg',
    bride: 'Ayesha Siddiqui',
    groom: 'Hamza Tariq',
    eventTitle: 'The Walima Reception',
    venueName: 'Pearl Continental Crystal Ballroom',
  },
  mehndi: {
    hero: '/assets/mehndi-couple.jpg',
    venue: '/assets/qawwali-hero.jpg',
    intro: '/assets/couple-golden-intro.jpg',
    bride: 'Zara Ahmed',
    groom: 'Daniyal Malik',
    eventTitle: 'Rung-e-Mehndi & Sangeet',
    venueName: 'Haveli Barood Khana, Lahore',
  },
  qawwali: {
    hero: '/assets/qawwali-hero.jpg',
    venue: '/assets/qawwali-hero.jpg',
    intro: '/assets/couple-golden-intro.jpg',
    bride: 'Mahnoor Khan',
    groom: 'Bilal Farooq',
    eventTitle: 'Sufi & Qawwali Night',
    venueName: 'Bagh-e-Jinnah Heritage Pavilion',
  },
  engagement: {
    hero: '/assets/engagement-couple.jpg',
    venue: '/assets/walima-venue.jpg',
    intro: '/assets/couple-golden-intro.jpg',
    bride: 'Sana Rizvi',
    groom: 'Zain Abbas',
    eventTitle: 'The Mangni Ceremony',
    venueName: 'Monal Marquee, Islamabad',
  },
  'bridal-shower': {
    hero: '/assets/bridal-shower-hero.jpg',
    venue: '/assets/walima-venue.jpg',
    intro: '/assets/bridal-girl-golden-intro.jpg',
    bride: 'Alizeh Shah',
    groom: 'Guests of Honor',
    eventTitle: 'Bespoke Bridal Shower',
    venueName: 'The Polo Lounge, Lahore',
  },
  birthday: {
    hero: '/assets/girl-birthday.jpg',
    venue: '/assets/birthday-venue-stage.jpg',
    intro: '/assets/birthday-golden-intro.jpg',
    bride: 'Inaya Khan',
    groom: 'Cherished Family',
    eventTitle: 'First Birthday Soirée',
    venueName: 'Royal Palm Country Club',
  },
  anniversary: {
    hero: '/assets/anniversary-couple.jpg',
    venue: '/assets/walima-venue.jpg',
    intro: '/assets/couple-golden-intro.jpg',
    bride: 'Begum Perveen',
    groom: 'Syed Tariq Ali',
    eventTitle: 'Silver Jubilee Celebration',
    venueName: 'Gymkhana Club, Lahore',
  },
  aqiqah: {
    hero: '/assets/aqiqah-boy.jpg',
    venue: '/assets/barat-stage-venue.jpg',
    intro: '/assets/baby-golden-intro.jpg',
    bride: 'Muhammad Rayyan',
    groom: 'Cherished Family',
    eventTitle: 'Blessed Aqiqah Celebration',
    venueName: 'Nishat Banquet Hall',
  },
};

export default function AddTemplateModal({ isOpen, onClose, onCreated }) {
  const [activeStep, setActiveStep] = useState(1); // 1: Identity, 2: Design & Palette, 3: Visuals & Pictures
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Asset Library Picker State
  const [libraryTargetField, setLibraryTargetField] = useState(null); // 'heroImage' | 'venueImage' | 'introImage' | null
  const [libraryTab, setLibraryTab] = useState('all'); // 'all' | 'couples' | 'venues' | 'seals'

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'nikkah',
    categoryLabel: 'Nikkah & Barat',
    description: '',
    badge: 'Atelier Bespoke Edition',
    themeStyle: 'royal-arch',
    palette: ['#26060A', '#D4AF37', '#FAF5EF'],
    heroImage: '/assets/couple-hero.jpg',
    venueImage: '/assets/barat-stage-venue.jpg',
    introImage: '/assets/couple-golden-intro.jpg',
    sampleBride: 'Fatima Noor',
    sampleGroom: 'Sharjeel Khan',
    sampleEventTitle: 'The Grand Barat Ceremony',
    sampleVenue: 'The Grand Palm Royale, Lahore',
    sampleCity: 'Lahore, Pakistan',
  });

  if (!isOpen) return null;

  // Auto populate defaults when category changes
  const handleCategoryChange = (newCat) => {
    const defaults = CATEGORY_DEFAULTS[newCat] || CATEGORY_DEFAULTS.nikkah;
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      heroImage: defaults.hero,
      venueImage: defaults.venue,
      introImage: defaults.intro,
      sampleBride: defaults.bride,
      sampleGroom: defaults.groom,
      sampleEventTitle: defaults.eventTitle,
      sampleVenue: defaults.venueName,
    }));
  };

  const handlePaletteSelect = (preset) => {
    setFormData({ ...formData, palette: preset.palette });
  };

  const handleColorChange = (index, value) => {
    const updated = [...formData.palette];
    updated[index] = value;
    setFormData({ ...formData, palette: updated });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimized = await optimizeImageFile(file, 1400, 0.88);
      setFormData((prev) => ({ ...prev, [field]: optimized.dataUrl }));
    } catch (err) {
      console.warn('Image optimization fallback:', err);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setFormData((prev) => ({ ...prev, [field]: loadEvt.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectFromLibrary = (url) => {
    if (libraryTargetField) {
      setFormData((prev) => ({ ...prev, [libraryTargetField]: url }));
      setLibraryTargetField(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Please provide a name for this template suite.');
      setActiveStep(1);
      return;
    }

    // Verify required pictures
    if (!formData.heroImage) {
      setErrorMessage('Hero couple portrait is required to make a template.');
      setActiveStep(3);
      return;
    }
    if (!formData.venueImage) {
      setErrorMessage('Stage venue photo is required to make a template.');
      setActiveStep(3);
      return;
    }
    if (!formData.introImage) {
      setErrorMessage('Opening wax seal / intro gate picture is required to make a template.');
      setActiveStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        categoryLabel:
          formData.category === 'nikkah'
            ? 'Nikkah & Barat'
            : formData.category === 'walima'
            ? 'Walima / Reception'
            : formData.category === 'mehndi'
            ? 'Mehndi & Mayun'
            : formData.category === 'qawwali'
            ? 'Qawwali & Sufi Night'
            : formData.category === 'engagement'
            ? 'Engagement & Mangni'
            : formData.category === 'bridal-shower'
            ? 'Bridal Shower'
            : formData.category === 'birthday'
            ? 'Birthday & Soirée'
            : formData.category === 'anniversary'
            ? 'Anniversary'
            : 'Aqiqah & Baby',
        description:
          formData.description.trim() ||
          `Handcrafted luxury suite in ${formData.name} aesthetic with 3D gold foil shimmer and responsive itinerary.`,
        badge: formData.badge.trim() || 'Atelier Bespoke Edition',
        palette: formData.palette,
        themeStyle: formData.themeStyle,
        thumbnail: formData.heroImage,
        slots: {
          intro_image: { label: 'Opening Wax Seal / Intro Gate Artwork', default: formData.introImage, required: true },
          hero_image: { label: 'Couple / Honoree Hero Portrait', default: formData.heroImage, required: true },
          venue_image: { label: 'Stage / Celebration Venue Photo', default: formData.venueImage, required: true },
        },
        sampleData: {
          bride_name: formData.sampleBride,
          groom_name: formData.sampleGroom,
          couple_initials: `${formData.sampleBride[0] || 'B'} & ${formData.sampleGroom[0] || 'G'}`,
          event_title: formData.sampleEventTitle,
          event_subtitle: 'The Celebration of Love & Union',
          event_date_display: 'Saturday • December 12, 2026',
          event_time_display: "Seven O'Clock in the Evening",
          venue_name: formData.sampleVenue,
          city_display: formData.sampleCity,
          venue_address: `${formData.sampleVenue}, ${formData.sampleCity}`,
          venue_map_url: `https://maps.google.com/?q=${encodeURIComponent(formData.sampleVenue)}`,
          hero_image: formData.heroImage,
          venue_image: formData.venueImage,
          intro_image: formData.introImage,
        },
      };

      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save template suite to atelier database.');
      }

      const created = await res.json();
      if (onCreated) {
        onCreated(created);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error creating template.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLibrary = ATELIER_LIBRARY.filter((item) =>
    libraryTab === 'all' ? true : item.category === libraryTab
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto bg-paper border border-sand-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* ========================================================= */}
        {/* MODAL HEADER                                              */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 border-b border-sand-300/80 bg-sand-100/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-espresso text-gold-500 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-espresso leading-tight">
                Craft Bespoke Template Suite
              </h2>
              <p className="font-sans text-xs text-espresso/70">
                Configure identity, colors, and the 3 required celebration pictures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-espresso/60 hover:text-espresso hover:bg-sand-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================= */}
        {/* STEP PROGRESS NAVIGATION                                  */}
        {/* ========================================================= */}
        <div className="px-6 py-3 bg-sand-100/30 border-b border-sand-300/60 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            {[
              { num: 1, label: '1. Suite Identity', icon: Layers },
              { num: 2, label: '2. Design & Palette', icon: Palette },
              { num: 3, label: '3. Required Pictures (3)', icon: ImageIcon },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              const isPast = activeStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className={`flex items-center gap-2 py-1.5 px-3.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-espresso text-paper font-semibold shadow-xs'
                      : isPast
                      ? 'text-olive hover:bg-sand-200/50 font-medium'
                      : 'text-espresso/50 hover:text-espresso'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-espresso/50 hidden sm:inline">
            Step {activeStep} of 3
          </span>
        </div>

        {/* ========================================================= */}
        {/* MODAL BODY (STEP FORMS)                                   */}
        {/* ========================================================= */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-sans flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* STEP 1: SUITE IDENTITY & ARCHITECTURE                     */}
          {/* --------------------------------------------------------- */}
          {activeStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-espresso mb-1.5">
                    Suite Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Sapphire Barat & Nikah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-sand-300 text-espresso text-sm font-sans focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-espresso mb-1.5">
                    Celebration Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-paper border border-sand-300 text-espresso text-sm font-sans focus:outline-none focus:border-olive cursor-pointer"
                  >
                    <option value="nikkah">Nikkah &amp; Barat</option>
                    <option value="walima">Walima / Reception</option>
                    <option value="mehndi">Mehndi &amp; Mayun</option>
                    <option value="qawwali">Qawwali &amp; Sufi Night</option>
                    <option value="engagement">Engagement &amp; Mangni</option>
                    <option value="bridal-shower">Bridal Shower</option>
                    <option value="birthday">Birthday &amp; Soirée</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="aqiqah">Aqiqah &amp; Baby</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-espresso mb-1.5">
                  Atelier Luxury Tagline / Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Atelier Bespoke Edition • 24k Gold Foil"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-paper border border-sand-300 text-espresso text-sm font-sans focus:outline-none focus:border-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-espresso mb-1.5">
                  Curated Suite Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the aesthetic, fabric textures, calligraphy, and cultural inspiration of this suite..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-paper border border-sand-300 text-espresso text-sm font-sans focus:outline-none focus:border-olive"
                />
              </div>

              {/* Layout Engine Selector */}
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-espresso mb-2">
                  Select Architectural Layout Engine
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LAYOUT_ENGINES.map((engine) => {
                    const isSelected = formData.themeStyle === engine.id;
                    return (
                      <div
                        key={engine.id}
                        onClick={() => setFormData({ ...formData, themeStyle: engine.id })}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-espresso text-paper border-espresso shadow-md ring-2 ring-gold-500/40'
                            : 'bg-sand-100/50 border-sand-300 text-espresso hover:border-sand-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-serif text-sm font-bold">{engine.name}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-gold-400" />}
                        </div>
                        <p className={`font-sans text-xs leading-relaxed ${isSelected ? 'text-sand-200' : 'text-espresso/70'}`}>
                          {engine.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* STEP 2: COLOR PALETTE & FINISHES                          */}
          {/* --------------------------------------------------------- */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-espresso mb-2">
                  Curated Luxury Color Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PALETTE_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePaletteSelect(preset)}
                      className="p-3.5 rounded-2xl bg-paper border border-sand-300 hover:border-olive/60 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-1.5 mb-2 h-7 rounded-lg overflow-hidden border border-sand-200">
                        {preset.palette.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex-1 h-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="font-sans text-xs font-semibold text-espresso block truncate">
                        {preset.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Color Adjustment */}
              <div className="p-5 rounded-2xl bg-sand-100/70 border border-sand-300 space-y-4">
                <h4 className="font-serif text-sm font-bold text-espresso">
                  Bespoke Hex Color Customization
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-espresso/70 mb-1">
                      Primary Shade (Dark Velvet)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.palette[0]}
                        onChange={(e) => handleColorChange(0, e.target.value)}
                        className="w-10 h-10 rounded-xl border border-sand-300 cursor-pointer p-0.5 bg-paper"
                      />
                      <input
                        type="text"
                        value={formData.palette[0]}
                        onChange={(e) => handleColorChange(0, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-paper border border-sand-300 font-mono text-xs text-espresso"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-espresso/70 mb-1">
                      Gold Shimmer Accent
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.palette[1]}
                        onChange={(e) => handleColorChange(1, e.target.value)}
                        className="w-10 h-10 rounded-xl border border-sand-300 cursor-pointer p-0.5 bg-paper"
                      />
                      <input
                        type="text"
                        value={formData.palette[1]}
                        onChange={(e) => handleColorChange(1, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-paper border border-sand-300 font-mono text-xs text-espresso"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-espresso/70 mb-1">
                      Canvas Background
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.palette[2]}
                        onChange={(e) => handleColorChange(2, e.target.value)}
                        className="w-10 h-10 rounded-xl border border-sand-300 cursor-pointer p-0.5 bg-paper"
                      />
                      <input
                        type="text"
                        value={formData.palette[2]}
                        onChange={(e) => handleColorChange(2, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-paper border border-sand-300 font-mono text-xs text-espresso"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Swatch Preview */}
              <div
                className="p-6 rounded-2xl border shadow-lg text-center space-y-2"
                style={{
                  backgroundColor: formData.palette[2],
                  borderColor: formData.palette[1],
                  color: formData.palette[0],
                }}
              >
                <Sparkles className="w-6 h-6 mx-auto" style={{ color: formData.palette[1] }} />
                <h3 className="font-serif text-2xl font-bold">
                  {formData.name || 'Suite Preview Title'}
                </h3>
                <p className="font-sans text-xs tracking-[0.2em] uppercase font-semibold" style={{ color: formData.palette[1] }}>
                  {formData.badge}
                </p>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* STEP 3: REQUIRED PICTURES & VISUAL MEDIA (3 SLOTS)        */}
          {/* --------------------------------------------------------- */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-gold-600 mt-0.5 shrink-0" />
                <div className="text-xs text-espresso/80 leading-relaxed">
                  <strong className="text-espresso font-semibold block mb-0.5">
                    3 Pictures Required to Make a Complete Suite:
                  </strong>
                  Every VESNA template requires a <strong>Couple Hero Portrait</strong>, a <strong>Stage/Venue Photo</strong>, and an <strong>Opening Wax Seal Artwork</strong>. You can upload custom high-res files from your device, choose from the atelier asset library, or paste a URL.
                </div>
              </div>

              {/* 3 Required Picture Slots Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Hero Portrait */}
                <div className="p-4 rounded-2xl bg-sand-100/60 border border-sand-300 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso">
                        1. Couple Hero Portrait *
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-sand-200 text-olive text-[10px] font-sans font-bold">
                        Required
                      </span>
                    </div>

                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-sand-200 border border-sand-300 relative shadow-inner">
                      <img
                        src={formData.heroImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-sand-200">
                    <div className="flex items-center gap-1.5">
                      <label className="flex-1 py-1.5 px-2.5 rounded-lg bg-espresso hover:bg-espresso-dark text-paper text-[11px] font-sans font-semibold text-center cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                        <Upload className="w-3 h-3 text-gold-400" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'heroImage')}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => { setLibraryTargetField('heroImage'); setLibraryTab('couples'); }}
                        className="py-1.5 px-2.5 rounded-lg bg-sand-200 hover:bg-sand-300 text-espresso text-[11px] font-sans font-semibold flex items-center gap-1 cursor-pointer"
                        title="Pick from Atelier Asset Gallery"
                      >
                        <FolderOpen className="w-3 h-3 text-olive" />
                        <span>Library</span>
                      </button>
                    </div>

                    <div className="relative flex items-center">
                      <LinkIcon className="w-3 h-3 text-espresso/40 absolute left-2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Or paste image URL..."
                        value={formData.heroImage}
                        onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-paper border border-sand-300 text-[11px] font-sans text-espresso focus:outline-none focus:border-olive"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Stage / Venue Photo */}
                <div className="p-4 rounded-2xl bg-sand-100/60 border border-sand-300 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso">
                        2. Stage / Venue Photo *
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-sand-200 text-olive text-[10px] font-sans font-bold">
                        Required
                      </span>
                    </div>

                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-sand-200 border border-sand-300 relative shadow-inner">
                      <img
                        src={formData.venueImage}
                        alt="Venue preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-sand-200">
                    <div className="flex items-center gap-1.5">
                      <label className="flex-1 py-1.5 px-2.5 rounded-lg bg-espresso hover:bg-espresso-dark text-paper text-[11px] font-sans font-semibold text-center cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                        <Upload className="w-3 h-3 text-gold-400" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'venueImage')}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => { setLibraryTargetField('venueImage'); setLibraryTab('venues'); }}
                        className="py-1.5 px-2.5 rounded-lg bg-sand-200 hover:bg-sand-300 text-espresso text-[11px] font-sans font-semibold flex items-center gap-1 cursor-pointer"
                        title="Pick from Atelier Asset Gallery"
                      >
                        <FolderOpen className="w-3 h-3 text-olive" />
                        <span>Library</span>
                      </button>
                    </div>

                    <div className="relative flex items-center">
                      <LinkIcon className="w-3 h-3 text-espresso/40 absolute left-2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Or paste image URL..."
                        value={formData.venueImage}
                        onChange={(e) => setFormData({ ...formData, venueImage: e.target.value })}
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-paper border border-sand-300 text-[11px] font-sans text-espresso focus:outline-none focus:border-olive"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Opening Wax Seal Artwork */}
                <div className="p-4 rounded-2xl bg-sand-100/60 border border-sand-300 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-espresso">
                        3. Wax Seal / Gate Artwork *
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-sand-200 text-olive text-[10px] font-sans font-bold">
                        Required
                      </span>
                    </div>

                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-sand-200 border border-sand-300 relative shadow-inner">
                      <img
                        src={formData.introImage}
                        alt="Intro seal preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-sand-200">
                    <div className="flex items-center gap-1.5">
                      <label className="flex-1 py-1.5 px-2.5 rounded-lg bg-espresso hover:bg-espresso-dark text-paper text-[11px] font-sans font-semibold text-center cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                        <Upload className="w-3 h-3 text-gold-400" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'introImage')}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => { setLibraryTargetField('introImage'); setLibraryTab('seals'); }}
                        className="py-1.5 px-2.5 rounded-lg bg-sand-200 hover:bg-sand-300 text-espresso text-[11px] font-sans font-semibold flex items-center gap-1 cursor-pointer"
                        title="Pick from Atelier Asset Gallery"
                      >
                        <FolderOpen className="w-3 h-3 text-olive" />
                        <span>Library</span>
                      </button>
                    </div>

                    <div className="relative flex items-center">
                      <LinkIcon className="w-3 h-3 text-espresso/40 absolute left-2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Or paste image URL..."
                        value={formData.introImage}
                        onChange={(e) => setFormData({ ...formData, introImage: e.target.value })}
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-paper border border-sand-300 text-[11px] font-sans text-espresso focus:outline-none focus:border-olive"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Event Information */}
              <div className="p-5 rounded-2xl bg-sand-100/50 border border-sand-300 space-y-4">
                <h4 className="font-serif text-sm font-bold text-espresso">
                  Sample Couple Names &amp; Venue
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-espresso/70 mb-1">
                      Sample Bride Name
                    </label>
                    <input
                      type="text"
                      value={formData.sampleBride}
                      onChange={(e) => setFormData({ ...formData, sampleBride: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-paper border border-sand-300 text-sm font-sans text-espresso"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-espresso/70 mb-1">
                      Sample Groom Name
                    </label>
                    <input
                      type="text"
                      value={formData.sampleGroom}
                      onChange={(e) => setFormData({ ...formData, sampleGroom: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-paper border border-sand-300 text-sm font-sans text-espresso"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-espresso/70 mb-1">
                      Sample Event Title
                    </label>
                    <input
                      type="text"
                      value={formData.sampleEventTitle}
                      onChange={(e) => setFormData({ ...formData, sampleEventTitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-paper border border-sand-300 text-sm font-sans text-espresso"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-espresso/70 mb-1">
                      Sample Venue &amp; City
                    </label>
                    <input
                      type="text"
                      value={formData.sampleVenue}
                      onChange={(e) => setFormData({ ...formData, sampleVenue: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-paper border border-sand-300 text-sm font-sans text-espresso"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* ========================================================= */}
        {/* MODAL FOOTER                                              */}
        {/* ========================================================= */}
        <div className="p-5 border-t border-sand-300/80 bg-sand-100/50 flex items-center justify-between">
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 rounded-full font-sans text-xs font-semibold uppercase tracking-wider text-espresso hover:bg-sand-200/60 cursor-pointer"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-sans text-xs font-semibold uppercase tracking-wider text-espresso/70 hover:text-espresso cursor-pointer"
            >
              Cancel
            </button>

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-6 py-2.5 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-7 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-espresso font-sans text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Crafting Suite...' : 'Publish Suite to Atelier Catalog'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ATELIER ASSET LIBRARY PICKER POPUP                        */}
        {/* ========================================================= */}
        {libraryTargetField && (
          <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-paper border border-sand-300 rounded-3xl shadow-2xl p-6 flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-gold-600" />
                  <h3 className="font-serif text-lg font-bold text-espresso">
                    Atelier High-Res Asset Archive
                  </h3>
                </div>
                <button
                  onClick={() => setLibraryTargetField(null)}
                  className="p-1 rounded-full text-espresso/50 hover:text-espresso cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-2 py-3 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Assets' },
                  { id: 'couples', label: 'Couples & Portraits' },
                  { id: 'venues', label: 'Stages & Venues' },
                  { id: 'seals', label: 'Golden Seals & Art' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setLibraryTab(tab.id)}
                    className={`px-3 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                      libraryTab === tab.id
                        ? 'bg-espresso text-paper'
                        : 'bg-sand-100 text-espresso/70 hover:bg-sand-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Gallery Grid */}
              <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 py-3">
                {filteredLibrary.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectFromLibrary(item.url)}
                    className="group rounded-2xl overflow-hidden border border-sand-300 hover:border-gold-500 hover:shadow-lg transition-all cursor-pointer relative bg-sand-200 flex flex-col"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 bg-paper text-center">
                      <span className="font-sans text-[11px] font-semibold text-espresso block truncate">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-sand-200 text-center">
                <span className="font-sans text-xs text-espresso/60">
                  Click any picture to select it for this slot
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

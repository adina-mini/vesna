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
  Eye,
  Sliders,
  Calendar,
  MapPin,
  Heart
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

const PRESET_IMAGES = {
  hero: [
    { label: 'Royal Barat Couple', url: '/assets/couple-hero.jpg' },
    { label: 'Ivory Sage Couple', url: '/assets/ivory-barat-couple.jpg' },
    { label: 'Golden Intro Art', url: '/assets/couple-golden-intro.jpg' },
  ],
  venue: [
    { label: 'Grand Stage', url: '/assets/barat-stage-venue.jpg' },
    { label: 'Crystal Ballroom', url: '/assets/walima-venue.jpg' },
    { label: 'Historic Haveli', url: '/assets/qawwali-hero.jpg' },
  ],
};

export default function AddTemplateModal({ isOpen, onClose, onCreated }) {
  const [activeStep, setActiveStep] = useState(1); // 1: Identity, 2: Design & Palette, 3: Visuals & Sample Data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      const optimized = await optimizeImageFile(file, 1200, 0.85);
      setFormData({ ...formData, [field]: optimized.dataUrl });
    } catch (err) {
      console.warn('Image optimization failed, reading raw data:', err);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setFormData({ ...formData, [field]: loadEvt.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Please provide a name for this template suite.');
      setActiveStep(1);
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
                Introduce a new celebration aesthetic to the VESNA atelier catalog
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
              { num: 1, label: 'Suite Identity', icon: Layers },
              { num: 2, label: 'Design & Palette', icon: Palette },
              { num: 3, label: 'Imagery & Sample Data', icon: ImageIcon },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              const isPast = activeStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(step.num)}
                  className={`flex items-center gap-2 py-1 px-3 rounded-full transition-all cursor-pointer ${
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
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-sans">
              {errorMessage}
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
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          {/* STEP 3: IMAGERY & SAMPLE CELEBRATION DATA                 */}
          {/* --------------------------------------------------------- */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Hero Portrait */}
                <div className="p-4 rounded-2xl bg-sand-100/50 border border-sand-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-espresso">
                      Couple Hero Portrait
                    </label>
                    <label className="cursor-pointer text-[11px] font-sans text-olive font-semibold flex items-center gap-1 hover:underline">
                      <Upload className="w-3 h-3" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'heroImage')}
                      />
                    </label>
                  </div>

                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-sand-200 border border-sand-300 relative">
                    <img
                      src={formData.heroImage}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    {PRESET_IMAGES.hero.map((img, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setFormData({ ...formData, heroImage: img.url })}
                        className="text-[10px] font-sans px-2.5 py-1 rounded-lg bg-paper border border-sand-200 hover:border-olive cursor-pointer truncate"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Venue Stage Image */}
                <div className="p-4 rounded-2xl bg-sand-100/50 border border-sand-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-espresso">
                      Stage / Venue Photo
                    </label>
                    <label className="cursor-pointer text-[11px] font-sans text-olive font-semibold flex items-center gap-1 hover:underline">
                      <Upload className="w-3 h-3" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'venueImage')}
                      />
                    </label>
                  </div>

                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-sand-200 border border-sand-300 relative">
                    <img
                      src={formData.venueImage}
                      alt="Venue preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    {PRESET_IMAGES.venue.map((img, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setFormData({ ...formData, venueImage: img.url })}
                        className="text-[10px] font-sans px-2.5 py-1 rounded-lg bg-paper border border-sand-200 hover:border-olive cursor-pointer truncate"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Event Information */}
              <div className="p-5 rounded-2xl bg-sand-100/50 border border-sand-300 space-y-4">
                <h4 className="font-serif text-sm font-bold text-espresso">
                  Default Sample Celebration Information
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
      </div>
    </div>
  );
}

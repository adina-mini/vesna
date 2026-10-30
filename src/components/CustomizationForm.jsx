'use client';

import React, { useState } from 'react';
import {
  Upload,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Check,
  CheckCircle2,
  Image as ImageIcon,
  Save,
  Send,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { optimizeImageFile } from '@/lib/imageOptimizer';

export default function CustomizationForm({
  template,
  formData,
  setFormData,
  mediaUploads,
  setMediaUploads,
  onSaveDraft,
  onPublish,
  isPublishing = false,
  isSavingDraft = false,
}) {
  const [activeTab, setActiveTab] = useState('names');
  const [uploadError, setUploadError] = useState('');
  const [processingSlot, setProcessingSlot] = useState(null);
  const [dragActiveSlot, setDragActiveSlot] = useState(null);

  // Handle generic text change
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Schedule management
  const handleScheduleChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.schedule || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, schedule: updated };
    });
  };

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...(prev.schedule || []),
        { time: '1:00 PM', tag: 'Ceremony', title: 'Special Moment', desc: 'Family and friends gather.' },
      ],
    }));
  };

  const removeScheduleItem = (index) => {
    setFormData((prev) => {
      const updated = (prev.schedule || []).filter((_, i) => i !== index);
      return { ...prev, schedule: updated };
    });
  };

  // Core file processor with client-side canvas optimization
  const processImageFile = async (slotKey, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, or WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB. Please choose a smaller photo.');
      return;
    }

    setUploadError('');
    setProcessingSlot(slotKey);

    try {
      const optimized = await optimizeImageFile(file, 1600, 0.88);
      
      setMediaUploads((prev) => ({
        ...prev,
        [slotKey]: {
          name: optimized.name,
          dataUrl: optimized.dataUrl,
          size: optimized.size,
          lastModified: file.lastModified || Date.now(),
        },
      }));

      // Immediately propagate to formData so all templates and views display it
      setFormData((prev) => ({
        ...prev,
        [slotKey]: optimized.dataUrl,
      }));
    } catch (err) {
      setUploadError(err.message || 'Failed to process and optimize image.');
    } finally {
      setProcessingSlot(null);
      setDragActiveSlot(null);
    }
  };

  const handleFileUpload = (slotKey, e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(slotKey, file);
    }
  };

  const handleDragOver = (slotKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragActiveSlot !== slotKey) {
      setDragActiveSlot(slotKey);
    }
  };

  const handleDragLeave = (slotKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragActiveSlot === slotKey) {
      setDragActiveSlot(null);
    }
  };

  const handleDrop = (slotKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSlot(null);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      processImageFile(slotKey, file);
    }
  };

  const clearSlot = (slotKey) => {
    setMediaUploads((prev) => {
      const updated = { ...prev };
      delete updated[slotKey];
      return updated;
    });
    setFormData((prev) => ({
      ...prev,
      [slotKey]: null,
    }));
  };

  const slots = template.slots || {};

  // Check completion status for each tab
  const isNamesCompleted = Boolean(formData.bride_name?.trim());
  const isDateTimeCompleted = Boolean(formData.event_date_iso || formData.event_date_display);
  const isVenueCompleted = Boolean(formData.venue_name?.trim());
  const isScheduleCompleted = Boolean(formData.schedule && formData.schedule.length > 0);
  const isPhotosCompleted = Boolean(Object.keys(mediaUploads).length > 0);

  const tabs = [
    { id: 'names', label: '1. Names', icon: Sparkles, completed: isNamesCompleted },
    { id: 'datetime', label: '2. Date & Time', icon: Calendar, completed: isDateTimeCompleted },
    { id: 'venue', label: '3. Venue', icon: MapPin, completed: isVenueCompleted },
    { id: 'schedule', label: '4. Timeline', icon: Clock, completed: isScheduleCompleted },
    { id: 'photos', label: '5. Photos', icon: ImageIcon, completed: isPhotosCompleted },
  ];

  return (
    <div className="bg-paper rounded-[32px] border border-sand-300/80 p-5 sm:p-8 text-espresso shadow-atelier">
      {/* Form Stepper Tabs with Completion Indicator */}
      <div className="flex flex-wrap gap-2 pb-5 mb-8 border-b border-sand-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-full font-sans text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-espresso text-paper shadow-xs font-semibold ring-1 ring-gold-500/30'
                  : 'bg-sand-100/80 text-espresso/70 hover:text-espresso hover:bg-sand-200 border border-sand-200 font-medium'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sand-300' : 'text-olive'}`} />
              <span>{tab.label}</span>
              {tab.completed && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-gold-400' : 'bg-emerald-600'
                  }`}
                  title="Section details entered"
                />
              )}
            </button>
          );
        })}
      </div>

      {uploadError && (
        <div className="mb-6 p-4 rounded-2xl bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: NAMES & ESSENTIAL DETAILS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'names' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-widest text-olive font-semibold block mb-1">
              Step 1 of 5
            </span>
            <h3 className="font-serif text-2xl font-bold text-espresso flex items-center gap-2">
              <span>Names &amp; Invitation Honorees</span>
            </h3>
            <p className="font-sans text-xs text-espresso/70 mt-1">
              Enter the names as you would like them to gracefully appear on your invitation card.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
                Bride&apos;s / Honoree Name <span className="text-burgundy">*</span>
              </label>
              <input
                type="text"
                value={formData.bride_name || ''}
                onChange={(e) => handleChange('bride_name', e.target.value)}
                placeholder="e.g. Fatima Hafeez"
                className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
                Groom&apos;s Full Name (Optional)
              </label>
              <input
                type="text"
                value={formData.groom_name || ''}
                onChange={(e) => handleChange('groom_name', e.target.value)}
                placeholder="e.g. Rao Sharjeel"
                className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
                Couple Monogram / Initials
              </label>
              <input
                type="text"
                value={formData.couple_initials || ''}
                onChange={(e) => handleChange('couple_initials', e.target.value)}
                placeholder="e.g. F & S"
                className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
              />
              <span className="text-[10px] text-espresso/50 mt-1 block">
                Featured on the opening wax seal ring
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
                Celebration Hashtag
              </label>
              <input
                type="text"
                value={formData.hashtag || ''}
                onChange={(e) => handleChange('hashtag', e.target.value)}
                placeholder="e.g. #FATIMAANDSHARJEEL2026"
                className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('datetime')}
              className="px-6 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Date &amp; Time</span>
              <ArrowRight className="w-3.5 h-3.5 text-olive" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DATE & TIME                                                        */}
      {/* ========================================================================= */}
      {activeTab === 'datetime' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-widest text-olive font-semibold block mb-1">
              Step 2 of 5
            </span>
            <h3 className="font-serif text-2xl font-bold text-espresso flex items-center gap-2">
              <span>Event Date &amp; Live Countdown</span>
            </h3>
            <p className="font-sans text-xs text-espresso/70 mt-1">
              This powers the dynamic real-time celebration clock that guests see on the card.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
              Exact Celebration Timestamp (Powers Countdown Clock) <span className="text-burgundy">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.event_date_iso ? formData.event_date_iso.substring(0, 16) : ''}
              onChange={(e) => handleChange('event_date_iso', e.target.value ? `${e.target.value}:00` : '')}
              className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
                Display Date (Formal Serif Typography)
              </label>
              <input
                type="text"
                value={formData.event_date_display || ''}
                onChange={(e) => handleChange('event_date_display', e.target.value)}
                placeholder="e.g. Saturday • November 7, 2026"
                className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
                Display Time (Card Subtitle)
              </label>
              <input
                type="text"
                value={formData.event_time_display || ''}
                onChange={(e) => handleChange('event_time_display', e.target.value)}
                placeholder="e.g. Seven O'Clock in the Evening"
                className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
              City &amp; Country
            </label>
            <input
              type="text"
              value={formData.city_display || ''}
              onChange={(e) => handleChange('city_display', e.target.value)}
              placeholder="e.g. Lahore, Pakistan"
              className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
            />
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('names')}
              className="px-5 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 text-espresso font-sans text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-espresso/60" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('venue')}
              className="px-6 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Venue</span>
              <ArrowRight className="w-3.5 h-3.5 text-olive" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VENUE & GOOGLE MAPS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'venue' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-widest text-olive font-semibold block mb-1">
              Step 3 of 5
            </span>
            <h3 className="font-serif text-2xl font-bold text-espresso flex items-center gap-2">
              <span>Celebration Venue &amp; Navigation</span>
            </h3>
            <p className="font-sans text-xs text-espresso/70 mt-1">
              Equip your guests with 1-click turn-by-turn directions straight to your hall.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
              Venue / Banquet Hall Name <span className="text-burgundy">*</span>
            </label>
            <input
              type="text"
              value={formData.venue_name || ''}
              onChange={(e) => handleChange('venue_name', e.target.value)}
              placeholder="e.g. The Grand Palm Royale"
              className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
              Full Physical Address
            </label>
            <input
              type="text"
              value={formData.venue_address || ''}
              onChange={(e) => handleChange('venue_address', e.target.value)}
              placeholder="e.g. Main Boulevard, Gulberg III, Lahore, Pakistan"
              className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-1.5">
              Google Maps Location Link
            </label>
            <input
              type="url"
              value={formData.venue_map_url || ''}
              onChange={(e) => handleChange('venue_map_url', e.target.value)}
              placeholder="e.g. https://maps.google.com/?q=The+Grand+Palm+Royale"
              className="w-full px-4 py-3 rounded-2xl bg-sand-50/80 border border-sand-300 text-espresso placeholder-espresso/40 text-xs focus:outline-none focus:ring-2 focus:ring-espresso focus:border-espresso transition-all"
            />
            <span className="text-[10px] text-espresso/60 mt-1.5 block">
              💡 Guests simply tap &ldquo;Open in Google Maps&rdquo; to launch navigation on iPhone or Android.
            </span>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('datetime')}
              className="px-5 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 text-espresso font-sans text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-espresso/60" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className="px-6 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Timeline</span>
              <ArrowRight className="w-3.5 h-3.5 text-olive" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SCHEDULE OF EVENTS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-widest text-olive font-semibold block mb-1">
                Step 4 of 5
              </span>
              <h3 className="font-serif text-2xl font-bold text-espresso">
                Event Timeline &amp; Program
              </h3>
            </div>
            <button
              type="button"
              onClick={addScheduleItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-espresso text-paper font-sans text-xs font-semibold uppercase tracking-wider hover:bg-espresso-dark transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-sand-300" />
              <span>Add Function</span>
            </button>
          </div>

          <div className="space-y-3">
            {(formData.schedule || []).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-sand-50/80 border border-sand-300/80 space-y-2.5 relative group hover:border-sand-400 transition-colors"
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  <input
                    type="text"
                    value={item.time || ''}
                    onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                    placeholder="e.g. 7:30 PM"
                    className="w-28 px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-espresso text-xs font-mono font-medium focus:outline-none focus:border-espresso"
                  />
                  <input
                    type="text"
                    value={item.tag || ''}
                    onChange={(e) => handleScheduleChange(idx, 'tag', e.target.value)}
                    placeholder="Tag (e.g. Arrival)"
                    className="w-32 px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-espresso text-xs focus:outline-none focus:border-espresso"
                  />
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleScheduleChange(idx, 'title', e.target.value)}
                    placeholder="Program Moment (e.g. Barat Arrival & Welcome)"
                    className="flex-grow px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-espresso text-xs font-semibold focus:outline-none focus:border-espresso"
                  />
                  <button
                    type="button"
                    onClick={() => removeScheduleItem(idx)}
                    className="p-2 text-burgundy/60 hover:text-burgundy hover:bg-burgundy/10 rounded-xl transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.desc || ''}
                  onChange={(e) => handleScheduleChange(idx, 'desc', e.target.value)}
                  placeholder="Details for this moment (e.g. Rose petal shower and traditional dhol welcome)..."
                  className="w-full px-3 py-1.5 rounded-xl bg-paper border border-sand-300 text-espresso text-xs focus:outline-none focus:border-espresso"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('venue')}
              className="px-5 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 text-espresso font-sans text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-espresso/60" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className="px-6 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 border border-sand-300 text-espresso font-sans text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Photos</span>
              <ArrowRight className="w-3.5 h-3.5 text-olive" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PHOTO UPLOAD SLOTS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'photos' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-widest text-olive font-semibold block mb-1">
              Step 5 of 5
            </span>
            <h3 className="font-serif text-2xl font-bold text-espresso">
              Personal Portrait &amp; Story Media
            </h3>
            <p className="font-sans text-xs text-espresso/70 mt-1">
              Upload your high-resolution portraits into designated template slots.
            </p>
          </div>

          {/* Educational notice */}
          <div className="p-4 rounded-2xl bg-sand-100/90 border border-sand-300 text-xs text-espresso/80 flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-olive flex-shrink-0 mt-0.5" />
            <span>
              <strong>Editorial Notice:</strong> Uploaded portraits appear below for verification. In accordance with platform privacy and rendering standards, they compile into your live invitation <strong>immediately upon clicking Publish</strong>.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Object.entries(slots).map(([slotKey, slotConfig]) => {
              const currentMedia = mediaUploads[slotKey] || (formData[slotKey] ? { dataUrl: formData[slotKey], name: 'Custom Portrait' } : null);
              const isProcessing = processingSlot === slotKey;
              const isDragOver = dragActiveSlot === slotKey;

              return (
                <div
                  key={slotKey}
                  onDragOver={(e) => handleDragOver(slotKey, e)}
                  onDragLeave={(e) => handleDragLeave(slotKey, e)}
                  onDrop={(e) => handleDrop(slotKey, e)}
                  className={`p-5 rounded-3xl bg-sand-50/80 border transition-all duration-300 flex flex-col justify-between ${
                    isDragOver
                      ? 'border-olive bg-sand-100 shadow-md ring-2 ring-olive/20'
                      : 'border-sand-300/80'
                  }`}
                >
                  <div className="mb-3">
                    <span className="font-serif text-sm font-bold text-espresso block">
                      {slotConfig.label}
                    </span>
                    <span className="text-[10px] font-sans text-espresso/50 uppercase tracking-widest block mt-0.5">
                      Slot: {slotKey}
                    </span>
                  </div>

                  {isProcessing ? (
                    <div className="h-44 rounded-2xl border border-sand-300 bg-sand-100 flex flex-col items-center justify-center gap-2 text-center p-4">
                      <Loader2 className="w-6 h-6 text-olive animate-spin" />
                      <span className="font-sans text-xs text-espresso font-semibold">
                        Optimizing portrait...
                      </span>
                      <span className="font-sans text-[10px] text-espresso/60">
                        Scaling for fast mobile display
                      </span>
                    </div>
                  ) : currentMedia ? (
                    <div className="relative rounded-2xl overflow-hidden border border-sand-300 bg-sand-100 h-44 flex items-center justify-center group shadow-2xs">
                      <img
                        src={currentMedia.dataUrl}
                        alt={slotConfig.label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-espresso/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                        <label className="px-3.5 py-1.5 rounded-full bg-paper hover:bg-sand-100 text-espresso text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-1.5">
                          <RefreshCw className="w-3 h-3 text-olive" />
                          <span>Replace</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(slotKey, e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => clearSlot(slotKey)}
                          className="px-3.5 py-1.5 rounded-full bg-burgundy hover:bg-burgundy-light text-white text-[11px] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-paper/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] text-espresso font-semibold border border-sand-300 shadow-xs flex items-center gap-1">
                        <Check className="w-3 h-3 text-olive" />
                        <span>Ready</span>
                      </div>
                    </div>
                  ) : (
                    <label className={`h-44 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer p-4 text-center group ${
                      isDragOver
                        ? 'border-olive bg-sand-200/80 scale-102'
                        : 'border-sand-300 hover:border-olive bg-paper hover:bg-sand-100/70'
                    }`}>
                      <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <Upload className="w-5 h-5 text-olive" />
                      </div>
                      <span className="font-sans text-xs font-semibold text-espresso">
                        {isDragOver ? 'Drop Image Here' : 'Upload or Drag & Drop'}
                      </span>
                      <span className="text-[10px] text-espresso/60 mt-0.5">
                        PNG, JPG, WebP up to 15MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(slotKey, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className="px-5 py-2.5 rounded-full bg-sand-100 hover:bg-sand-200 text-espresso font-sans text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-espresso/60" />
              <span>Back</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORM ACTION FOOTER (Sticky / Elevated)                                    */}
      {/* ========================================================================= */}
      <div className="mt-10 pt-6 border-t border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          id="save-draft-btn"
          type="button"
          onClick={onSaveDraft}
          disabled={isSavingDraft || isPublishing}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-paper hover:bg-sand-100 border border-sand-300 text-espresso font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4 text-olive" />
          <span>{isSavingDraft ? 'Saving Draft...' : 'Save As Draft'}</span>
        </button>

        <button
          id="publish-invitation-btn"
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-espresso hover:bg-espresso-dark text-paper font-sans text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ring-1 ring-gold-500/30"
        >
          <Send className="w-4 h-4 text-sand-300" />
          <span>{isPublishing ? 'Publishing Invitation...' : 'Publish & Generate Link'}</span>
        </button>
      </div>
    </div>
  );
}

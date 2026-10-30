'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Layers,
  ShieldAlert,
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { getAllTemplates, getTemplateById } from '@/templates/registry';
import CustomizationForm from '@/components/CustomizationForm';
import SampleCardShowcase from '@/components/SampleCardShowcase';
import PublishModal from '@/components/PublishModal';
import { saveInvitation, getInvitationById } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

function CreatePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const templateParam = searchParams.get('template') || 'royal-burgundy';
  const editIdParam = searchParams.get('edit');

  const [selectedTemplateId, setSelectedTemplateId] = useState(templateParam);
  const template = getTemplateById(selectedTemplateId);

  // Customer draft form state (NEVER passed into SampleCardShowcase)
  const [formData, setFormData] = useState({
    bride_name: '',
    groom_name: '',
    couple_initials: '',
    event_title: '',
    event_date_iso: '',
    event_date_display: '',
    event_time_display: '',
    city_display: '',
    venue_name: '',
    venue_address: '',
    venue_map_url: '',
    hashtag: '',
    schedule: template.sampleData?.schedule || [],
  });

  const [mediaUploads, setMediaUploads] = useState({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Publish modal state
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishedInviteId, setPublishedInviteId] = useState('');

  // If editing existing invitation, load its draft data
  useEffect(() => {
    if (editIdParam) {
      async function loadExisting() {
        const existing = await getInvitationById(editIdParam);
        if (existing) {
          setSelectedTemplateId(existing.template_id || 'royal-burgundy');
          if (existing.data) {
            setFormData(existing.data);
          }
          if (existing.media) {
            setMediaUploads(existing.media);
          }
        }
      }
      loadExisting();
    }
  }, [editIdParam]);

  // When switching template, preserve entered names/dates if available
  const handleTemplateChange = (newTemplateId) => {
    setSelectedTemplateId(newTemplateId);
    const newTpl = getTemplateById(newTemplateId);
    // Keep user's entered fields, just refresh schedule template if schedule was empty
    if (!formData.schedule || formData.schedule.length === 0) {
      setFormData((prev) => ({
        ...prev,
        schedule: newTpl.sampleData?.schedule || [],
      }));
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Generate unique slug/ID
  const generateUniqueId = () => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const namesSlug = (formData.bride_name && formData.groom_name)
      ? `${formData.bride_name.split(' ')[0]}-and-${formData.groom_name.split(' ')[0]}`.toLowerCase().replace(/[^a-z0-9]/g, '')
      : 'invitation';
    return `${namesSlug}-${randomHex}`;
  };

  const { user, openAuthModal } = useAuth();

  // Core execution of Save Draft
  const executeSaveDraft = async (actingUser = user) => {
    setIsSavingDraft(true);
    setErrorMessage('');
    try {
      const id = editIdParam || generateUniqueId();
      const record = {
        id,
        template_id: selectedTemplateId,
        title: `${formData.bride_name || 'Bride'} & ${formData.groom_name || 'Groom'}'s Invitation`,
        event_type: template.category,
        status: 'draft',
        user_id: actingUser?.id || null,
        data: formData,
        media: mediaUploads,
      };

      await saveInvitation(record);
      showToast('Draft saved successfully! You can resume editing anytime.');
    } catch (err) {
      setErrorMessage('Failed to save draft. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // SAVE AS DRAFT TRIGGER
  const handleSaveDraft = () => {
    if (!user) {
      openAuthModal({
        title: 'Sign In to Save Draft',
        description: 'Sign in to save your draft safely and continue customizing from any device.',
        callback: (authUser) => executeSaveDraft(authUser),
      });
      return;
    }
    executeSaveDraft(user);
  };

  // Core execution of Publish
  const executePublish = async (actingUser = user) => {
    setIsPublishing(true);
    try {
      const id = editIdParam || generateUniqueId();
      const record = {
        id,
        template_id: selectedTemplateId,
        title: `${formData.bride_name} & ${formData.groom_name || 'Union'}'s Digital Invitation`,
        event_type: template.category,
        status: 'published',
        published_at: new Date().toISOString(),
        user_id: actingUser?.id || null,
        data: formData,
        media: mediaUploads,
      };

      await saveInvitation(record);
      setPublishedInviteId(id);
      setPublishModalOpen(true);
    } catch (err) {
      setErrorMessage('Failed to publish invitation. Please check your connection and try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // PUBLISH INVITATION TRIGGER
  const handlePublish = () => {
    setErrorMessage('');

    // Validation
    if (!formData.bride_name?.trim()) {
      setErrorMessage("Please enter the bride's or honoree's name before publishing.");
      return;
    }
    if (!formData.event_date_iso && !formData.event_date_display) {
      setErrorMessage('Please enter the event date before publishing.');
      return;
    }
    if (!formData.venue_name?.trim()) {
      setErrorMessage('Please enter the celebration venue name before publishing.');
      return;
    }

    if (!user) {
      openAuthModal({
        title: 'Sign In to Publish Invitation',
        description: 'Sign in to generate your live link, track guest RSVPs, and manage your card.',
        callback: (authUser) => executePublish(authUser),
      });
      return;
    }
    executePublish(user);
  };

  const allTemplates = getAllTemplates();

  return (
    <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Top Header & Template Switcher */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-sand-300">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-sand-300 text-olive text-[11px] font-sans uppercase tracking-[0.2em] font-semibold mb-2 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-500" />
              <span>Studio Atelier</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso tracking-tight">
              Personalize Your Invitation
            </h1>
            <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-1">
              Currently editing <span className="font-semibold text-espresso">{template.name}</span> ({template.categoryLabel})
            </p>
          </div>

          {/* Template Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <span className="font-sans text-xs text-espresso/70 whitespace-nowrap hidden sm:inline font-medium">
              Switch Suite:
            </span>
            <div className="flex items-center gap-2">
              {allTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide uppercase transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    selectedTemplateId === t.id
                      ? 'bg-espresso text-paper font-semibold shadow-xs ring-1 ring-gold-500/30'
                      : 'bg-paper text-espresso/70 hover:text-espresso hover:bg-sand-100 border border-sand-300'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-sand-300/80"
                    style={{ backgroundColor: t.palette?.[0] || '#26060A' }}
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Toast */}
        {toastMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-4 rounded-2xl bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs flex items-center gap-2.5 shadow-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-burgundy flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
      </div>

      {/* TWO COLUMN STUDIO LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CUSTOMIZATION FORM (Takes 7 cols) */}
        <div className="lg:col-span-7">
          <div className="mb-4">
            <h2 className="font-serif text-xl font-bold text-espresso mb-1">
              1. Event &amp; Honoree Details
            </h2>
            <p className="font-sans text-xs sm:text-sm text-espresso/70">
              Provide event dates, venue location, schedule, and photos. Your changes are saved securely.
            </p>
          </div>

          <CustomizationForm
            template={template}
            formData={formData}
            setFormData={setFormData}
            mediaUploads={mediaUploads}
            setMediaUploads={setMediaUploads}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            isSavingDraft={isSavingDraft}
            isPublishing={isPublishing}
          />
        </div>

        {/* RIGHT COLUMN: SAMPLE SHOWCASE (Takes 5 cols) */}
        {/* STRICT ANTI-PREVIEW: strictly renders template.sampleData */}
        <div className="lg:col-span-5 lg:sticky lg:top-24" id="sample">
          <div className="mb-4">
            <h2 className="font-serif text-xl font-bold text-espresso mb-1 flex items-center gap-2">
              <Eye className="w-5 h-5 text-olive" />
              <span>2. Sample Template Showcase</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-espresso/70">
              Reference preview showing the design, animations, and typography with demo data.
            </p>
          </div>

          <SampleCardShowcase template={template} />
        </div>
      </div>

      {/* PUBLISHED SUCCESS CELEBRATION MODAL */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        invitationId={publishedInviteId}
        invitationTitle={formData.bride_name}
      />
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-espresso/70 font-sans text-xs uppercase tracking-wider">Loading Customization Studio...</div>}>
      <CreatePageInner />
    </Suspense>
  );
}

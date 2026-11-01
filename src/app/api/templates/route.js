import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'customTemplates.json');

// In-memory fallback if file system is read-only
let memoryTemplates = [];

function readTemplatesFromFile() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryTemplates = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading customTemplates.json:', err.message);
  }
  return memoryTemplates;
}

function writeTemplatesToFile(templates) {
  memoryTemplates = templates;
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(templates, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.warn('Error writing customTemplates.json:', err.message);
    return false;
  }
}

export async function GET() {
  try {
    const list = readTemplatesFromFile();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: 'Suite name is required' }, { status: 400 });
    }

    const currentList = readTemplatesFromFile();

    // Create normalized suite record
    const slug = (body.name || 'bespoke-suite')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = body.id || `suite-${slug}-${Math.random().toString(36).substring(2, 6)}`;

    const newTemplate = {
      id,
      name: body.name.trim(),
      category: body.category || 'nikkah',
      categoryLabel: body.categoryLabel || 'Bespoke Celebration',
      description: body.description || 'Bespoke luxury suite handcrafted in the VESNA atelier.',
      badge: body.badge || 'Atelier Bespoke Edition',
      palette: Array.isArray(body.palette) && body.palette.length > 0 ? body.palette : ['#26060A', '#D4AF37', '#FAF5EF'],
      themeStyle: body.themeStyle || 'royal-arch',
      thumbnail: body.thumbnail || body.sampleData?.hero_image || '/assets/couple-hero.jpg',
      isCustom: true,
      created_at: new Date().toISOString(),
      slots: {
        intro_image: { label: 'Intro Gate Artwork', default: body.sampleData?.intro_image || '/assets/couple-golden-intro.jpg' },
        hero_image: { label: 'Couple Hero Portrait', default: body.sampleData?.hero_image || '/assets/couple-hero.jpg' },
        venue_image: { label: 'Stage Venue Photo', default: body.sampleData?.venue_image || '/assets/barat-stage-venue.jpg' },
      },
      sampleData: {
        bride_name: body.sampleData?.bride_name || 'Bespoke Bride',
        groom_name: body.sampleData?.groom_name || 'Bespoke Groom',
        couple_initials: body.sampleData?.couple_initials || 'B & G',
        event_title: body.sampleData?.event_title || body.name,
        event_subtitle: body.sampleData?.event_subtitle || 'The Celebration of Love',
        event_date_iso: body.sampleData?.event_date_iso || '2026-12-12T18:00:00',
        event_date_display: body.sampleData?.event_date_display || 'Saturday • December 12, 2026',
        event_time_display: body.sampleData?.event_time_display || "Six O'Clock in the Evening",
        city_display: body.sampleData?.city_display || 'Lahore, Pakistan',
        venue_name: body.sampleData?.venue_name || 'The Royal Palm Golf & Country Club',
        venue_address: body.sampleData?.venue_address || 'Canal Bank Road, Lahore, Punjab, Pakistan',
        venue_map_url: body.sampleData?.venue_map_url || 'https://maps.google.com/?q=Royal+Palm+Lahore',
        hashtag: body.sampleData?.hashtag || `#VESNA${Date.now().toString().slice(-4)}`,
        intro_image: body.sampleData?.intro_image || '/assets/couple-golden-intro.jpg',
        hero_image: body.sampleData?.hero_image || '/assets/couple-hero.jpg',
        venue_image: body.sampleData?.venue_image || '/assets/barat-stage-venue.jpg',
        schedule: body.sampleData?.schedule || [
          { time: '6:00 PM', tag: 'Welcome', title: 'Arrival & Welcome Drinks', desc: 'Warm reception and gathering of cherished family.', icon: 'users' },
          { time: '7:00 PM', tag: 'Ceremony', title: 'Celebration Ceremony', desc: 'The ceremonial celebration and heartfelt blessings.', icon: 'heart', highlight: true },
          { time: '8:30 PM', tag: 'Royal Feast', title: 'Grand Dinner Feast', desc: 'Gourmet banquet dinner and family portraits.', icon: 'utensils' },
          { time: '11:00 PM', tag: 'Farewell', title: 'Farewell & Duas', desc: 'Heartfelt sendoff with eternal love and best wishes.', icon: 'sparkles' },
        ],
      },
    };

    // Filter out existing if same ID
    const updated = [newTemplate, ...currentList.filter((t) => t.id !== id)];
    writeTemplatesToFile(updated);

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const currentList = readTemplatesFromFile();
    const updated = currentList.filter((t) => t.id !== id);
    writeTemplatesToFile(updated);

    return NextResponse.json({ success: true, removedId: id });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}

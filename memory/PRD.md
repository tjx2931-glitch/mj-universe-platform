# MJ – விண்வெளி அனுபவம் (PRD)

## Project Overview
**Name**: MJ – விண்வெளி அனுபவம் (Space Experience)  
**Type**: Cinematic premium Tamil-first cosmic website  
**URL**: https://nakshatra-yatra.preview.emergentagent.com  
**Architecture**: React 19 + FastAPI + MongoDB  

## Architecture
- **Frontend**: React 19 + React Router DOM + Tailwind CSS + Framer Motion + Three.js + Canvas API
- **Backend**: FastAPI (port 8001) + Motor (async MongoDB)
- **Database**: MongoDB with seeded realistic data
- **Fonts**: Arima Madurai (headings) + Noto Sans Tamil (body)
- **3D**: Three.js v0.183.2 (SolarSystem3D component)
- **Animations**: Framer Motion v12 (scroll-based, parallax, horizontal)

## Pages & Routes
- `/` → HomePage (all scrollable sections)
- `/object/:id` → ObjectDetail (astronomy object detail page)
- `/gallery/:id` → GalleryDetail (gallery image detail page)

## Phase 1 Implementation (MVP - Initial Build)
- Hero video background + starfield
- Space Events (Past 20 / Present 15 / Future 15)
- Astronomy Objects grid + modal
- Timeline 25 events (vertical)
- Tamil Vedic Astrology Calculator (Rasi/Nakshatra/Lagna/Panchangam)
- Gallery 12 NASA images

## Phase 2 Implementation (Cinematic Upgrade)
### Sections Redesigned (Cinematic/Editorial)
1. **Hero**: Massive MJ typography (clamp 120-240px), parallax scroll, gradient-gold text
2. **Feature Showcase**: Split editorial - "SPACE BEGINS HERE" text + Pillars of Creation image + animated stats counters
3. **Live Astronomy (NEW)**: Lunar phase SVG visualization, upcoming events panel, space fact - live from /api/live-astronomy
4. **3D Solar System (NEW)**: Three.js canvas with 6 orbiting planets, Saturn rings, sun glow, click → info panel, gentle camera bob
5. **Space Section**: Horizontal draggable card scroll per tab, editorial portrait cards (290px wide)
6. **Astronomy Objects**: CSS Grid masonry bento layout, linked to /object/:id detail page
7. **Timeline**: Framer Motion horizontal scroll (sticky + useScroll + useTransform), 25 events
8. **Astrology Calculator**: Canvas API Kundali PNG export ("ஜாதகம் பதிவிறக்கு" button)
9. **Gallery**: CSS Grid editorial asymmetric layout with rotations, full-screen modal

### New Features
- React Router SPA with detail pages
- ObjectDetail page: Hero image + large Tamil name + data boxes + fun fact
- GalleryDetail page: Full-screen image + prev/next navigation
- Kundali PNG export via HTML5 Canvas API (no external deps)
- Live lunar phase calculation (mathematical, no API key)
- Error boundaries around 3D/animation components

## API Endpoints (All Working)
### Original
- GET /api/space/past (20), /api/space/present (15), /api/space/future (15)
- GET /api/objects (16), /api/timeline (25), /api/gallery (12)
- POST /api/astrology/calculate

### New (Phase 2)
- GET /api/live-astronomy (lunar phase + upcoming events + space fact)
- GET /api/objects/:id (single object by id)
- GET /api/gallery/:id (single gallery item by id)
- GET /api/space/event/:id (single space event by id)

## Testing Results
- **Phase 1**: Backend 100% (11/11), Frontend 100%
- **Phase 2**: Backend 100% (21/21), Frontend 100%

## Prioritized Backlog
### P1 (Next)
- [ ] SpaceEvent detail page (/space/:id)
- [ ] Search/filter space events by agency or year
- [ ] Background music toggle (space ambient)
- [ ] Mobile responsive fix for horizontal timeline

### P2 (Future)
- [ ] AR space view via device camera
- [ ] Tamil TTS for astronomical content
- [ ] Social sharing for astrology results (OG image)
- [ ] Additional language: Telugu, Malayalam

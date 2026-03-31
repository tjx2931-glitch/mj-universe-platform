# MJ – விண்வெளி அனுபவம் (PRD)

## Project Overview
**Name**: MJ – விண்வெளி அனுபவம் (Space Experience)  
**Type**: Premium Tamil-first cosmic website  
**URL**: https://nakshatra-yatra.preview.emergentagent.com  
**Created**: 2024  

## User Personas
- Tamil-speaking space enthusiasts (primary)  
- Students interested in astronomy  
- General public curious about space & Tamil astrology  
- Cultural users wanting Tamil-language space content  

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Framer Motion + Canvas API  
- **Backend**: FastAPI (port 8001) + Motor (async MongoDB)  
- **Database**: MongoDB with seeded realistic data  
- **Fonts**: Arima Madurai (headings) + Noto Sans Tamil (body)  

## Core Requirements (Static)
1. Tamil-first UI with English secondary  
2. Hero video background (user's MP4)  
3. Deep black + orange/gold cosmic theme  
4. Glassmorphism cards with neon borders  
5. Canvas-based animated starfield  
6. Real NASA/space image URLs (no placeholders)  
7. All data from MongoDB (no hardcoded frontend data)  

## What's Been Implemented (2024)

### Backend APIs
- `GET /api/space/past` - 20 historical space events  
- `GET /api/space/present` - 15 active missions (NASA, ISRO, ESA)  
- `GET /api/space/future` - 15 planned missions  
- `GET /api/objects` - 16 astronomy objects (planets, stars, constellations, galaxies)  
- `GET /api/timeline` - 25 timeline events (200 BC → 2040)  
- `GET /api/gallery` - 12 real NASA/space image gallery items  
- `POST /api/astrology/calculate` - Tamil Vedic astrology calculator (Rasi/Nakshatra/Lagna/Panchangam)  

### Frontend Sections
1. **Starfield** - Canvas-based animated stars with shooting stars  
2. **Navbar** - Glassmorphic with 6 Tamil navigation links, mobile responsive  
3. **Hero** - Fullscreen MP4 video background, MJ glow branding, Tamil tagline  
4. **Space Section** - Past/Present/Future tabs with image cards + badges  
5. **Astronomy Objects** - 16-card bento grid + detail modal  
6. **Timeline** - 25 events, vertical alternating layout, animated  
7. **Astrology Calculator** - Tamil Vedic calculator (birth date/time/place → results)  
8. **Gallery** - 12 NASA images with zoom modal + prev/next navigation  
9. **Footer** - Tamil tagline + credits  

### Data Seeded
- 50 space content entries (past/present/future)  
- 16 astronomy objects with Tamil names, real images, fun facts  
- 25 timeline events from ancient Tamil astronomy to 2040  
- 12 gallery items with Wikipedia Commons NASA images  
- 12 Rasis, 27 Nakshatras for astrology calculation  

## Testing Results (2024)
- Backend: 100% (11/11 tests passed)  
- Frontend: 100% - all major flows working  

## Prioritized Backlog

### P0 (Critical - Done)
- [x] Hero video + starfield  
- [x] Space events with real data  
- [x] Astronomy objects grid + modal  
- [x] Timeline 25 events  
- [x] Astrology calculator  
- [x] Gallery with NASA images  

### P1 (Next Phase)
- [ ] Individual object detail pages with routing  
- [ ] Space event search/filter by agency or year  
- [ ] Live astronomy data (Next sunrise/sunset, lunar phase)  
- [ ] Share astrology result as image  
- [ ] Dark/light mode toggle (currently forced dark)  

### P2 (Future)
- [ ] Mobile app wrapper (React Native)  
- [ ] AR space view (device camera overlay)  
- [ ] Tamil TTS for space content  
- [ ] User bookmarks/favorites (localStorage)  
- [ ] Additional language: Telugu, Malayalam  

# MJ – விண்வெளி அனுபவம் (PRD)

## Project Overview
**Name**: MJ – விண்வெளி அனுபவம் (Space Experience)
**Type**: Cinematic premium Tamil-first cosmic website
**URL**: https://nakshatra-yatra.preview.emergentagent.com
**Stack**: React 19 + FastAPI + MongoDB + Three.js

## Architecture
- **Frontend**: React 19 + React Router + Tailwind CSS + Framer Motion + Three.js v0.183.2
- **Backend**: FastAPI (port 8001) + Motor (async MongoDB)
- **Fonts**: Arima Madurai (headings) + Noto Sans Tamil (body)
- **3D**: Pure Three.js (NOT react-three-fiber — incompatible with React 19 dev mode)

## Phase 3 Fixes Applied (Production Fix)
1. **3D Solar System**: Reverted to pure Three.js (react-three-fiber had React 19 compatibility error in dev mode). Full implementation: 7 planets orbiting sun, drag to rotate, scroll to zoom, click planet for info panel, LIVE/DEMO mode toggle
2. **Emojis Removed**: All timeline event emoji icons removed from server.py seed data + MongoDB migration on startup
3. **Space Events Clickable**: SpaceCard onClick opens SpaceEventModal with full Tamil description, image, agency, status, date
4. **Astrology Emoji Fixed**: Empty state &#9800; replaced with CSS geometric circles
5. **server.py Syntax Error**: Fixed duplicate startup handlers and stray `)` + `return doc`

## All Pages & Routes
- `/` → HomePage (all 9 scrollable sections)
- `/object/:id` → ObjectDetail (astronomy object detail)
- `/gallery/:id` → GalleryDetail (gallery image detail)

## All API Endpoints (Working)
| Endpoint | Returns |
|---|---|
| GET /api/space/past | 20 historical events |
| GET /api/space/present | 15 active missions |
| GET /api/space/future | 15 planned missions |
| GET /api/objects | 16 celestial objects |
| GET /api/timeline | 25 timeline events (no emoji) |
| GET /api/gallery | 12 NASA gallery items |
| GET /api/live-astronomy | Lunar phase + upcoming events + space fact |
| GET /api/objects/:id | Single object detail |
| GET /api/gallery/:id | Single gallery item |
| GET /api/space/event/:id | Single space event |
| POST /api/astrology/calculate | Tamil Vedic astrology results |

## 9 Homepage Sections
1. **Hero** - Video BG, massive MJ text, parallax, starfield
2. **Feature Showcase** - "SPACE BEGINS HERE" split with Pillars of Creation image + animated stats counters
3. **Live Astronomy** - Lunar phase SVG, upcoming missions, space fact (from /api/live-astronomy)
4. **3D Solar System** - Pure Three.js: 7 orbiting planets, drag/zoom/click, info panel, LIVE/DEMO mode
5. **Space Missions** - Past/Present/Future tabs, horizontal draggable cards, click → modal
6. **Astronomy Objects** - CSS Grid masonry bento, 16 objects, click → /object/:id detail page
7. **Timeline** - Framer Motion horizontal scroll, 25 events from 200 BC to 2040
8. **Astrology Calculator** - Birth data → Rasi/Nakshatra/Lagna/Panchangam + Canvas PNG export
9. **Gallery** - Editorial CSS Grid with rotation, click → modal or /gallery/:id

## Test Results (All Iterations)
- Phase 1: Backend 100% (11/11), Frontend 100%
- Phase 2: Backend 100% (21/21), Frontend 100%
- Phase 3 (Production Fix): Backend 100%, Frontend 100%

## Known Technical Constraints
- **Do NOT use @react-three/fiber**: Incompatible with React 19 in dev mode (x-line-number error)
- **Pure Three.js only** for 3D: Works reliably with static import

## P1 Backlog (Next)
- [ ] SpaceEvent detail page /space/event/:id
- [ ] Mobile responsive improvements (horizontal timeline, masonry grid)
- [ ] Search/filter space events by agency or year
- [ ] Real NASA APOD API integration (currently uses math-based lunar phase)

## P2 Backlog
- [ ] Ambient space music toggle
- [ ] Social share OG image for astrology results
- [ ] Tamil TTS for astronomical content

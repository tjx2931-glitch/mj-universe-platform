const BASE = process.env.REACT_APP_BACKEND_URL;

const get = url => fetch(`${BASE}${url}`).then(r => r.json());
const post = (url, body) => fetch(`${BASE}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export const fetchSpacePast = () => get('/api/space/past');
export const fetchSpacePresent = () => get('/api/space/present');
export const fetchSpaceFuture = () => get('/api/space/future');
export const fetchObjects = () => get('/api/objects');
export const fetchTimeline = () => get('/api/timeline');
export const fetchGallery = () => get('/api/gallery');
export const fetchLiveAstronomy = () => get('/api/live-astronomy');
export const fetchObjectById = id => get(`/api/objects/${id}`);
export const fetchGalleryItemById = id => get(`/api/gallery/${id}`);
export const fetchSpaceEventById = id => get(`/api/space/event/${id}`);
export const calculateAstrology = data => post('/api/astrology/calculate', data);

from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime, timezone, date as ddate

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="MJ விண்வெளி API")
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# ── Models ──────────────────────────────────────────────────────────────────

class AstrologyInput(BaseModel):
    name: Optional[str] = ""
    birth_date: str
    birth_time: str
    birth_place: str

# ── Seed Data ────────────────────────────────────────────────────────────────

SPACE_DATA = [
    # PAST (20)
    {"type":"past","title_tamil":"ஸ்புட்னிக்-1 ஏவுதல்","title_english":"Sputnik-1 Launch","description_tamil":"உலகின் முதல் செயற்கைக்கோளான ஸ்புட்னிக்-1 சோவியத் யூனியனால் விண்ணில் ஏவப்பட்டது. இது விண்வெளி யுகத்தின் வரலாற்றுத் தொடக்கமாக அமைந்தது.","description_english":"Soviet Union launched Sputnik-1, the world's first artificial satellite.","date":"அக்டோபர் 4, 1957","year":1957,"image_url":"https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80","agency":"சோவியத் யூனியன்","category":"செயற்கைக்கோள்","status":"வெற்றி"},
    {"type":"past","title_tamil":"யூரி கெகாரின் - முதல் விண்வெளி பயணி","title_english":"Yuri Gagarin - First Human in Space","description_tamil":"சோவியத் விண்வெளி வீரர் யூரி கெகாரின் வஸ்டோக்-1 விண்கலத்தில் பூமியை சுற்றி வந்தார். மனித விண்வெளி பயண வரலாற்றில் இது மிகப்பெரிய சாதனை.","description_english":"Soviet cosmonaut Yuri Gagarin became the first human to travel into outer space aboard Vostok 1.","date":"ஏப்ரல் 12, 1961","year":1961,"image_url":"https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=600&q=80","agency":"சோவியத் யூனியன்","category":"மனித விண்வெளி பயணம்","status":"வெற்றி"},
    {"type":"past","title_tamil":"முதல் விண்வெளி நடை","title_english":"First Spacewalk","description_tamil":"அலெக்ஸி லியோனோவ் விண்கலத்திலிருந்து வெளியே நடந்தார். 12 நிமிட வரலாற்று சாதனை மனித தைரியத்தின் அடையாளமானது.","description_english":"Alexei Leonov performed the first spacewalk, spending 12 minutes outside the spacecraft.","date":"மார்ச் 18, 1965","year":1965,"image_url":"https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80","agency":"சோவியத் யூனியன்","category":"மனித விண்வெளி பயணம்","status":"வெற்றி"},
    {"type":"past","title_tamil":"ஆபோலோ-11 நிலவு தரையிறங்கல்","title_english":"Apollo 11 Moon Landing","description_tamil":"நீல் ஆம்ஸ்ட்ராங் மற்றும் பஸ் ஆல்ட்ரின் நிலவில் காலடி வைத்தனர். 'இது ஒரு மனிதனுக்கு சிறிய அடி, மனிதகுலத்திற்கு பெரிய பாய்ச்சல்' என்ற வாக்கியம் வரலாறானது.","description_english":"Neil Armstrong and Buzz Aldrin became the first humans to land on the Moon.","date":"ஜூலை 20, 1969","year":1969,"image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/400px-Aldrin_Apollo_11_original.jpg","agency":"NASA","category":"நிலவு ஆய்வு","status":"வெற்றி"},
    {"type":"past","title_tamil":"ஆர்யபட்ட - இந்தியாவின் முதல் செயற்கைக்கோள்","title_english":"Aryabhata - India's First Satellite","description_tamil":"இந்தியாவின் முதல் செயற்கைக்கோள் ஆர்யபட்டா சோவியத் ஏவுகணையில் விண்ணில் செலுத்தப்பட்டது. இஸ்ரோவின் பயணம் இதோடு தொடங்கியது.","description_english":"India's first satellite Aryabhata was launched aboard a Soviet rocket, marking the beginning of ISRO's journey.","date":"ஏப்ரல் 19, 1975","year":1975,"image_url":"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80","agency":"ISRO","category":"செயற்கைக்கோள்","status":"வெற்றி"},
    {"type":"past","title_tamil":"வாயேஜர்-1 ஏவுதல்","title_english":"Voyager 1 Launch","description_tamil":"வாயேஜர்-1 விண்கலம் சூரிய குடும்பத்தை தாண்டி விண்வெளியில் பயணிக்கும் நோக்கில் ஏவப்பட்டது. இன்றும் இது மனிதன் உருவாக்கிய சாதனங்களிலேயே மிக தொலைவில் இருக்கிறது.","description_english":"Voyager 1 launched to study the outer solar system and is now the most distant human-made object.","date":"செப்டம்பர் 5, 1977","year":1977,"image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80","agency":"NASA","category":"விண்வெளி ஆய்வு","status":"செயல்பாட்டில்"},
    {"type":"past","title_tamil":"ராக்கேஷ் ஷர்மா - விண்வெளியில் இந்தியர்","title_english":"Rakesh Sharma in Space","description_tamil":"இந்திய விண்வெளி வீரர் ராக்கேஷ் ஷர்மா சோவியத் விண்கலத்தில் விண்வெளி சென்றார். 'சாரே ஜஹாந் சே அச்சா' என்று நிலவிலிருந்து பாடினார்.","description_english":"Wing Commander Rakesh Sharma became the first Indian to travel to space aboard Soyuz T-11.","date":"ஏப்ரல் 3, 1984","year":1984,"image_url":"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80","agency":"ISRO / சோவியத்","category":"மனித விண்வெளி பயணம்","status":"வெற்றி"},
    {"type":"past","title_tamil":"ஹப்பிள் தொலைநோக்கி ஏவுதல்","title_english":"Hubble Space Telescope Launch","description_tamil":"ஹப்பிள் விண்வெளி தொலைநோக்கி பூமியிலிருந்து 540 கிலோமீட்டர் உயரத்தில் ஏவப்பட்டது. பிரபஞ்சத்தின் மிகவும் தெளிவான படங்களை இது வழங்கியது.","description_english":"The Hubble Space Telescope was launched, revolutionizing our understanding of the universe.","date":"ஏப்ரல் 24, 1990","year":1990,"image_url":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80","agency":"NASA","category":"தொலைநோக்கி","status":"செயல்பாட்டில்"},
    {"type":"past","title_tamil":"செவ்வாய் பாதசாரி ஆய்வு","title_english":"Mars Pathfinder Mission","description_tamil":"NASA-வின் மார்ஸ் பாத்பைண்டர் செயலியும் சோஜர்னர் ரோவரும் செவ்வாயின் மண்ணை ஆய்வு செய்தன. செவ்வாய் ஆய்வு வரலாற்றில் புதிய அத்தியாயம் தொடங்கியது.","description_english":"NASA's Mars Pathfinder successfully landed on Mars, deploying the Sojourner rover.","date":"ஜூலை 4, 1997","year":1997,"image_url":"https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&q=80","agency":"NASA","category":"செவ்வாய் ஆய்வு","status":"வெற்றி"},
    {"type":"past","title_tamil":"சர்வதேச விண்வெளி நிலையம் தொடக்கம்","title_english":"International Space Station Begins","description_tamil":"16 நாடுகள் இணைந்து உருவாக்கிய சர்வதேச விண்வெளி நிலையத்தின் முதல் பகுதி விண்வெளியில் ஏவப்பட்டது. மனித இன ஒற்றுமையின் சின்னமாக இது விளங்குகிறது.","description_english":"The first module of the International Space Station was launched, beginning humanity's permanent presence in space.","date":"நவம்பர் 20, 1998","year":1998,"image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ISS_Feb_2010.jpg/400px-ISS_Feb_2010.jpg","agency":"NASA / Roscosmos","category":"விண்வெளி நிலையம்","status":"செயல்பாட்டில்"},
    {"type":"past","title_tamil":"சந்திரயான்-1 - நீர் கண்டுபிடிப்பு","title_english":"Chandrayaan-1 - Water Discovery","description_tamil":"இஸ்ரோவின் சந்திரயான்-1 நிலவில் நீர் மூலக்கூறுகளை கண்டுபிடித்தது. இந்தியாவின் திறமையை உலகுக்கு நிரூபித்த சாதனை.","description_english":"India's Chandrayaan-1 confirmed the presence of water molecules on the Moon, a groundbreaking discovery.","date":"அக்டோபர் 22, 2008","year":2008,"image_url":"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80","agency":"ISRO","category":"நிலவு ஆய்வு","status":"வெற்றி"},
    {"type":"past","title_tamil":"க்யூரியாசிட்டி - செவ்வாய் ரோவர்","title_english":"Curiosity Rover on Mars","description_tamil":"NASA-வின் க்யூரியாசிட்டி ரோவர் செவ்வாயில் வெற்றிகரமாக தரையிறங்கியது. கேல் பள்ளத்தாக்கில் பண்டைய ஆற்றுப் படுகைகளை கண்டுபிடித்தது.","description_english":"NASA's Curiosity rover landed successfully in Gale Crater, discovering evidence of ancient water on Mars.","date":"ஆகஸ்ட் 6, 2012","year":2012,"image_url":"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80","agency":"NASA","category":"செவ்வாய் ஆய்வு","status":"செயல்பாட்டில்"},
    {"type":"past","title_tamil":"மங்கள்யான் - செவ்வாய் சுற்றுப்பாதை ஆய்வு","title_english":"Mangalyaan - Mars Orbiter Mission","description_tamil":"இஸ்ரோவின் மங்கள்யான் முதல் முயற்சியிலேயே செவ்வாயை வெற்றிகரமாக அடைந்தது. ஆசியாவின் முதல் மற்றும் உலகின் மலிவான செவ்வாய் திட்டம்.","description_english":"India's Mars Orbiter Mission (Mangalyaan) successfully entered Mars orbit on its first attempt.","date":"செப்டம்பர் 24, 2014","year":2014,"image_url":"https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&q=80","agency":"ISRO","category":"செவ்வாய் ஆய்வு","status":"வெற்றி"},
    {"type":"past","title_tamil":"நியூ ஹொரைசன்ஸ் - புளூட்டோ பயணம்","title_english":"New Horizons - Pluto Flyby","description_tamil":"NASA-வின் நியூ ஹொரைசன்ஸ் விண்கலம் புளூட்டோவை நெருங்கி பறந்தது. 'இதயம்' வடிவ நைட்ரஜன் பனி சமவெளியை கண்டுபிடித்தது.","description_english":"New Horizons flew past Pluto, revealing a heart-shaped nitrogen ice plain named Tombaugh Regio.","date":"ஜூலை 14, 2015","year":2015,"image_url":"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80","agency":"NASA","category":"கோள் ஆய்வு","status":"வெற்றி"},
    {"type":"past","title_tamil":"ஸ்பேஸ்எக்ஸ் - மீண்டும் பயன்படுத்தும் ஏவுகணை","title_english":"SpaceX Reusable Rocket Landing","description_tamil":"எலோன் மஸ்க்கின் ஸ்பேஸ்எக்ஸ் ஒரு ஏவுகணையை வெற்றிகரமாக தரையிறக்கி மீண்டும் பயன்படுத்தியது. விண்வெளி பயண செலவை குறைக்கும் புரட்சி.","description_english":"SpaceX successfully landed and reused a Falcon 9 rocket, revolutionizing spaceflight economics.","date":"டிசம்பர் 22, 2015","year":2015,"image_url":"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80","agency":"SpaceX","category":"ஏவுகணை தொழில்நுட்பம்","status":"வெற்றி"},
    {"type":"past","title_tamil":"சந்திரயான்-2 ஏவுதல்","title_english":"Chandrayaan-2 Launch","description_tamil":"சந்திரயான்-2 ஆர்பிட்டர், லேண்டர் மற்றும் ரோவர் கொண்டு நிலவை நோக்கிப் பயணித்தது. ஆர்பிட்டர் இன்றும் சிறப்பாக செயல்படுகிறது.","description_english":"Chandrayaan-2 launched with an orbiter, lander, and rover targeting the Moon's south pole.","date":"ஜூலை 22, 2019","year":2019,"image_url":"https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=600&q=80","agency":"ISRO","category":"நிலவு ஆய்வு","status":"பகுதி வெற்றி"},
    {"type":"past","title_tamil":"ஸ்பேஸ்எக்ஸ் கிரூ டிராகன் - மனித பறப்பு","title_english":"SpaceX Crew Dragon Human Flight","description_tamil":"ஸ்பேஸ்எக்ஸ் கிரூ டிராகன் வாணிஜ விண்கலத்தில் விண்வெளி வீரர்களை ISS கொண்டு சேர்த்தது. தனியார் விண்வெளி போக்குவரத்தின் தொடக்கம்.","description_english":"SpaceX Crew Dragon became the first commercial spacecraft to carry NASA astronauts to the ISS.","date":"மே 30, 2020","year":2020,"image_url":"https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80","agency":"SpaceX / NASA","category":"மனித விண்வெளி பயணம்","status":"வெற்றி"},
    {"type":"past","title_tamil":"பெர்செவரன்ஸ் - செவ்வாய் தரையிறங்கல்","title_english":"Perseverance Rover Landing","description_tamil":"NASA-வின் பெர்செவரன்ஸ் ரோவர் செவ்வாயில் தரையிறங்கியது. இங்கீனிட்டி ஹெலிகாப்டரும் முதல் வேறு கிரகத்தில் வான்வழி பறந்தது.","description_english":"Perseverance rover landed on Mars, with Ingenuity helicopter making the first powered flight on another planet.","date":"பிப்ரவரி 18, 2021","year":2021,"image_url":"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80","agency":"NASA","category":"செவ்வாய் ஆய்வு","status":"செயல்பாட்டில்"},
    {"type":"past","title_tamil":"ஜேம்ஸ் வெப் தொலைநோக்கி ஏவுதல்","title_english":"James Webb Space Telescope Launch","description_tamil":"$10 பில்லியன் மதிப்புள்ள ஜேம்ஸ் வெப் விண்வெளி தொலைநோக்கி ஏவப்பட்டது. பிரபஞ்சத்தின் ஆரம்பகால மங்கலங்களை படம்பிடிக்க இது உதவுகிறது.","description_english":"The $10 billion James Webb Space Telescope launched, designed to observe the universe's earliest galaxies.","date":"டிசம்பர் 25, 2021","year":2021,"image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80","agency":"NASA / ESA / CSA","category":"தொலைநோக்கி","status":"செயல்பாட்டில்"},
    {"type":"past","title_tamil":"சந்திரயான்-3 - தென் துருவ வெற்றி","title_english":"Chandrayaan-3 South Pole Success","description_tamil":"இந்தியா நிலவின் தென் துருவத்தில் முதல் தரையிறங்கலை சாதித்தது. விக்ரம் லேண்டர் மற்றும் பிரக்யான் ரோவர் சல்ஃபர் மற்றும் பிற தாதுக்களை கண்டுபிடித்தன.","description_english":"India became the first country to land near the Moon's south pole with Chandrayaan-3.","date":"ஆகஸ்ட் 23, 2023","year":2023,"image_url":"https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=600&q=80","agency":"ISRO","category":"நிலவு ஆய்வு","status":"வெற்றி"},
    # PRESENT (15)
    {"type":"present","title_tamil":"ஜேம்ஸ் வெப் - பிரபஞ்ச ஆய்வு","title_english":"JWST Universe Observation","description_tamil":"ஜேம்ஸ் வெப் தொலைநோக்கி 13 பில்லியன் ஆண்டுகள் பழமையான மங்கலங்களையும் புதிய கோள்களின் வளிமண்டலத்தையும் ஆய்வு செய்கிறது.","description_english":"JWST is actively observing galaxies from 13+ billion years ago and studying exoplanet atmospheres.","date":"2022 - இன்று","year":2024,"image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80","agency":"NASA / ESA / CSA","category":"தொலைநோக்கி","status":"செயல்பாட்டில்"},
    {"type":"present","title_tamil":"ஆதித்யா-எல்1 - சூரிய ஆய்வு","title_english":"Aditya-L1 Solar Mission","description_tamil":"இந்தியாவின் முதல் சூரிய ஆய்வு விண்கலம் லேக்ரன்ஜ் புள்ளி-1ல் நிலை கொண்டு சூரிய வெடிப்புகளையும் காந்த புயல்களையும் ஆய்வு செய்கிறது.","description_english":"India's first solar observatory mission is stationed at the L1 Lagrange point, studying solar phenomena.","date":"செப்டம்பர் 2, 2023 - இன்று","year":2024,"image_url":"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80","agency":"ISRO","category":"சூரிய ஆய்வு","status":"செயல்பாட்டில்"},
    {"type":"present","title_tamil":"பெர்செவரன்ஸ் - செவ்வாய் ஆய்வு","title_english":"Perseverance Mars Exploration","description_tamil":"பெர்செவரன்ஸ் ரோவர் செவ்வாயில் பண்டைய வாழ்க்கை அடையாளங்களை தேடுகிறது. 40+ km பயணித்து பல சாம்பிள்கள் சேகரித்துள்ளது.","description_english":"Perseverance continues exploring Mars, collecting rock samples and searching for signs of ancient life.","date":"பிப்ரவரி 2021 - இன்று","year":2024,"image_url":"https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&q=80","agency":"NASA","category":"செவ்வாய் ஆய்வு","status":"செயல்பாட்டில்"},
    {"type":"present","title_tamil":"ககன்யான் தயாரிப்பு","title_english":"Gaganyaan Preparation","description_tamil":"இந்தியாவின் முதல் மனித விண்வெளி பயண திட்டம் இறுதி கட்டத்தில் உள்ளது. நான்கு விண்வெளி வீரர்கள் பயிற்சி பெற்றுள்ளனர்.","description_english":"India's first crewed space mission is in final preparation with four astronaut candidates trained.","date":"2024 - தொடர்கிறது","year":2024,"image_url":"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80","agency":"ISRO","category":"மனித விண்வெளி பயணம்","status":"தயாரிப்பில்"},
    {"type":"present","title_tamil":"ஆர்டெமிஸ் நிலவு திட்டம்","title_english":"Artemis Moon Program","description_tamil":"NASA-வின் ஆர்டெமிஸ் திட்டம் மீண்டும் மனிதர்களை நிலவுக்கு அனுப்ப திட்டமிட்டுள்ளது. முதல் பெண்ணையும் முதல் கறுப்பின மனிதரையும் நிலவில் இறக்க இலக்கு.","description_english":"NASA's Artemis program aims to return humans to the Moon, including the first woman and person of color.","date":"2022 - தொடர்கிறது","year":2024,"image_url":"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80","agency":"NASA","category":"நிலவு ஆய்வு","status":"தொடர்கிறது"},
    {"type":"present","title_tamil":"ஸ்டார்ஷிப் - மிகப்பெரிய ஏவுகணை","title_english":"SpaceX Starship Development","description_tamil":"ஸ்பேஸ்எக்ஸ்-இன் ஸ்டார்ஷிப் உலகின் மிகவும் சக்திவாய்ந்த ஏவுகணையாக வடிவமைக்கப்பட்டுள்ளது. செவ்வாய் குடியேற்றத்திற்கும் நிலவு திட்டங்களுக்கும் பயன்படும்.","description_english":"SpaceX's Starship, the world's most powerful rocket, undergoes testing for Moon and Mars missions.","date":"2023 - தொடர்கிறது","year":2024,"image_url":"https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80","agency":"SpaceX","category":"ஏவுகணை","status":"சோதனையில்"},
    {"type":"present","title_tamil":"சர்வதேச விண்வெளி நிலையம்","title_english":"International Space Station Operations","description_tamil":"ISS-ல் 7 விண்வெளி வீரர்கள் தொடர்ச்சியாக வாழ்கின்றனர். கடந்த 23 ஆண்டுகளாக நிறுத்தமின்றி மனித இருப்பு கொண்ட சாதனை.","description_english":"The ISS continues hosting international crews, serving as humanity's outpost in low Earth orbit.","date":"1998 - இன்று","year":2024,"image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ISS_Feb_2010.jpg/400px-ISS_Feb_2010.jpg","agency":"NASA / Roscosmos / ESA","category":"விண்வெளி நிலையம்","status":"செயல்பாட்டில்"},
    {"type":"present","title_tamil":"பார்க்கர் சோலார் ப்ரோப்","title_english":"Parker Solar Probe","description_tamil":"பார்க்கர் சோலார் ப்ரோப் சூரியனை அதிக அண்மையில் சுற்றும் விண்கலம். சூரியனின் வெளி வளிமண்டலமான கரோனாவை ஆய்வு செய்கிறது.","description_english":"Parker Solar Probe is the fastest human-made object, studying the Sun's corona up close.","date":"ஆகஸ்ட் 2018 - இன்று","year":2024,"image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80","agency":"NASA","category":"சூரிய ஆய்வு","status":"செயல்பாட்டில்"},
    {"type":"present","title_tamil":"யூரோபா க்லிப்பர்","title_english":"Europa Clipper","description_tamil":"வியாழனின் சந்திரன் யூரோபாவில் உயிர்கள் இருக்கலாம் என நம்பப்படும் பனி மேலடுக்கின் கீழே உள்ள சமுத்திரத்தை ஆய்வு செய்ய NASA ஏவிய விண்கலம்.","description_english":"Europa Clipper launched to study Jupiter's moon Europa, which may harbor conditions for life.","date":"அக்டோபர் 2024","year":2024,"image_url":"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80","agency":"NASA","category":"கோள் ஆய்வு","status":"பயணத்தில்"},
    {"type":"present","title_tamil":"சை திட்டம் - சிறுகோள் ஆய்வு","title_english":"Psyche Mission - Asteroid Study","description_tamil":"NASA-வின் சை விண்கலம் முழுக்க முழுக்க உலோகத்தால் ஆன சிறுகோள் 16 சை-ஐ ஆய்வு செய்யப் பயணிக்கிறது. இது முதல் கோள் நுண் கோள்களின் ஆய்வு.","description_english":"NASA's Psyche spacecraft is en route to explore the metal-rich asteroid 16 Psyche.","date":"அக்டோபர் 2023","year":2024,"image_url":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80","agency":"NASA","category":"சிறுகோள் ஆய்வு","status":"பயணத்தில்"},
    {"type":"present","title_tamil":"பெபி கொலம்போ - புதன் ஆய்வு","title_english":"BepiColombo - Mercury Mission","description_tamil":"ESA மற்றும் JAXA இணைந்த பெபி கொலம்போ விண்கலம் புதன் கிரகத்தை ஆய்வு செய்ய பயணிக்கிறது. 2025-ல் புதன் சுற்றுப்பாதையில் நுழையும்.","description_english":"ESA-JAXA joint mission BepiColombo is traveling to Mercury, arriving in orbit in 2025.","date":"அக்டோபர் 2018","year":2025,"image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80","agency":"ESA / JAXA","category":"கோள் ஆய்வு","status":"பயணத்தில்"},
    {"type":"present","title_tamil":"NISAR - நாசா-இஸ்ரோ கூட்டு திட்டம்","title_english":"NISAR - NASA-ISRO Joint Mission","description_tamil":"NASA மற்றும் ISRO இணைந்து உருவாக்கிய NISAR செயற்கைக்கோள் பூமியின் புவியியல் மாற்றங்கள், பனி உருகுதல், நிலச்சரிவுகளை ஆய்வு செய்யும்.","description_english":"NASA and ISRO joint Earth observation satellite NISAR will study Earth's changing ecosystems.","date":"2025 திட்டமிட்டது","year":2025,"image_url":"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80","agency":"NASA / ISRO","category":"பூமி ஆய்வு","status":"தயாரிப்பில்"},
    {"type":"present","title_tamil":"GSLV MK3 - சக்திவாய்ந்த ஏவுகணை","title_english":"GSLV MK3 Launch Vehicle","description_tamil":"இஸ்ரோவின் GSLV MK3 ஏவுகணை பல ஐரோப்பிய OneWeb செயற்கைக்கோள்களை வெற்றிகரமாக ஏவியது. இந்தியாவின் வணிக விண்வெளி திறனை நிரூபித்தது.","description_english":"ISRO's GSLV MK3 successfully launched OneWeb satellites, demonstrating India's commercial launch capability.","date":"2022 - 2024","year":2024,"image_url":"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80","agency":"ISRO","category":"ஏவுகணை","status":"செயல்பாட்டில்"},
    {"type":"present","title_tamil":"சந்திரவெளி நுழைவாயில்","title_english":"Lunar Gateway Development","description_tamil":"நிலவை சுற்றும் சிறிய விண்வெளி நிலையமான லூனார் கேட்வே திட்டமிட்டபடி முன்னேறுகிறது. 2027-ல் ஏவப்படும் இது நிலவுக்கான ஆய்வு மேடையாக செயல்படும்.","description_english":"The Lunar Gateway, a small space station orbiting the Moon, is in development for launch by 2027.","date":"2024 - தொடர்கிறது","year":2025,"image_url":"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80","agency":"NASA / ESA / JAXA","category":"நிலவு ஆய்வு","status":"தொடர்கிறது"},
    {"type":"present","title_tamil":"SpaDeX - விண்வெளி இணைப்பு சோதனை","title_english":"SpaDeX Docking Experiment","description_tamil":"இஸ்ரோவின் SpaDeX திட்டம் விண்வெளியில் இரண்டு விண்கலங்களை இணைக்கும் தொழில்நுட்பத்தை சோதிக்கிறது. ககன்யான் மற்றும் எதிர்கால நிலவு திட்டங்களுக்கு இது அவசியம்.","description_english":"ISRO's SpaDeX tests orbital docking technology essential for Gaganyaan and future lunar missions.","date":"டிசம்பர் 2024","year":2024,"image_url":"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80","agency":"ISRO","category":"தொழில்நுட்பம்","status":"சோதனையில்"},
    # FUTURE (15)
    {"type":"future","title_tamil":"ககன்யான் - இந்தியரின் விண்வெளி பயணம்","title_english":"Gaganyaan - India's Crewed Mission","description_tamil":"இந்திய விண்வெளி வீரர்கள் GSLV MK3 ஏவுகணையில் விண்வெளிக்கு சென்று 3 நாட்கள் பூமியை சுற்றி திரும்புவர். இஸ்ரோவின் மிகப்பெரிய சாதனை.","description_english":"India will send its first human crew to space aboard GSLV MK3, orbiting Earth for 3 days.","date":"2025 திட்டமிட்டது","year":2025,"image_url":"https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80","agency":"ISRO","category":"மனித விண்வெளி பயணம்","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"ஆர்டெமிஸ்-3 - நிலவில் மனிதர்","title_english":"Artemis III - Humans on Moon","description_tamil":"முதல் பெண் மற்றும் முதல் கறுப்பின மனிதர் நிலவின் தென் துருவத்தில் தரையிறங்குவர். 52 ஆண்டுகளுக்கு பிறகு நிலவில் மனிதர் மீண்டும் காலடி வைப்பர்.","description_english":"Artemis III will land the first woman and first person of color on the Moon's south pole region.","date":"2026 திட்டமிட்டது","year":2026,"image_url":"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80","agency":"NASA","category":"நிலவு ஆய்வு","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"நான்ஸி கிரேஸ் ரோமன் தொலைநோக்கி","title_english":"Nancy Grace Roman Space Telescope","description_tamil":"ஹப்பிளை விட 100 மடங்கு அதிக பரந்த வானை ஆய்வு செய்யும் நான்ஸி கிரேஸ் ரோமன் தொலைநோக்கி ஏவப்படும். இருண்ட ஆற்றல் மற்றும் இருண்ட பொருளை ஆய்வு செய்யும்.","description_english":"Roman Space Telescope will survey the sky 100x wider than Hubble, studying dark energy and dark matter.","date":"2026 திட்டமிட்டது","year":2026,"image_url":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80","agency":"NASA","category":"தொலைநோக்கி","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"சந்திரயான்-4 திட்டம்","title_english":"Chandrayaan-4 Mission","description_tamil":"சந்திரயான்-4 நிலவிலிருந்து மண் மற்றும் பாறை மாதிரிகளை பூமிக்கு திரும்பக் கொண்டு வரும். இந்தியாவின் தொழில்நுட்ப பரிணாமத்தின் அடுத்த கட்டம்.","description_english":"Chandrayaan-4 will collect lunar soil and rock samples and return them to Earth.","date":"2028 திட்டமிட்டது","year":2028,"image_url":"https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=600&q=80","agency":"ISRO","category":"நிலவு ஆய்வு","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"சுக்ரயான் - வெள்ளி ஆய்வு","title_english":"Shukrayaan - Venus Orbiter","description_tamil":"இஸ்ரோவின் சுக்ரயான் வெள்ளி கிரகத்தின் வளிமண்டலம் மற்றும் மேற்பரப்பை ஆய்வு செய்யும். வெள்ளியில் ஒரு காலத்தில் தண்ணீர் இருந்ததா என்று ஆராயும்.","description_english":"ISRO's Shukrayaan will study Venus's atmosphere and surface, investigating its past habitability.","date":"2028 திட்டமிட்டது","year":2028,"image_url":"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80","agency":"ISRO","category":"கோள் ஆய்வு","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"JUICE - வியாழன் சந்திரன் ஆய்வு","title_english":"JUICE - Jupiter Icy Moons","description_tamil":"ESA-வின் JUICE விண்கலம் வியாழனின் பனிக்கட்டி சந்திரன்களான கனிமேட், கல்லிஸ்டோ மற்றும் யூரோபாவை ஆய்வு செய்யும். உயிரினங்கள் இருக்கலாம் என்ற நம்பிக்கை.","description_english":"ESA's JUICE mission will arrive at Jupiter in 2031 to study its icy moons for habitability.","date":"2031 வருகை","year":2031,"image_url":"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80","agency":"ESA","category":"கோள் ஆய்வு","status":"பயணத்தில்"},
    {"type":"future","title_tamil":"செவ்வாய் மாதிரி திரும்பல்","title_english":"Mars Sample Return","description_tamil":"NASA மற்றும் ESA இணைந்த செவ்வாய் மாதிரி திரும்பல் திட்டம் பெர்செவரன்ஸ் சேகரித்த பாறை மாதிரிகளை பூமிக்கு கொண்டு வரும்.","description_english":"NASA-ESA Mars Sample Return will bring Perseverance's collected rock samples back to Earth.","date":"2030 திட்டமிட்டது","year":2030,"image_url":"https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&q=80","agency":"NASA / ESA","category":"செவ்வாய் ஆய்வு","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"நிலவு தளம் நிறுவுதல்","title_english":"Lunar South Pole Base","description_tamil":"பல நாடுகள் இணைந்து நிலவின் தென் துருவத்தில் நிரந்தர ஆய்வு தளம் நிறுவ திட்டமிட்டுள்ளன. நிலவு பனியிலிருந்து தண்ணீர் மற்றும் ஆக்சிஜன் தயாரிக்கும் இலக்கு.","description_english":"Multiple nations plan to establish a permanent research base at the Moon's south pole.","date":"2030-2035","year":2032,"image_url":"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80","agency":"NASA / ISRO / ESA","category":"நிலவு ஆய்வு","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"இந்திய விண்வெளி நிலையம்","title_english":"India's Space Station","description_tamil":"இஸ்ரோ 2035-ல் தனது விண்வெளி நிலையத்தை நிறுவ திட்டமிட்டுள்ளது. இது 5 விண்வெளி வீரர்களை தாங்கும் திறன் கொண்டதாக இருக்கும்.","description_english":"ISRO plans to establish its own space station by 2035, capable of hosting a 5-person crew.","date":"2035 திட்டமிட்டது","year":2035,"image_url":"https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80","agency":"ISRO","category":"விண்வெளி நிலையம்","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"செவ்வாயில் மனிதர்","title_english":"Human Mission to Mars","description_tamil":"SpaceX Starship-ல் முதல் மனிதர்கள் செவ்வாயை நோக்கி பயணிப்பர். சுமார் 7 மாத பயணத்திற்கு பிறகு செவ்வாயில் தரையிறங்குவர்.","description_english":"First humans will travel to Mars aboard SpaceX Starship, marking humanity's first interplanetary journey.","date":"2035-2040","year":2037,"image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80","agency":"SpaceX / NASA","category":"மனித விண்வெளி பயணம்","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"ஸ்டார்ஷிப் நிலவு ஆய்வு","title_english":"Starship Lunar Mission","description_tamil":"SpaceX Starship நிலவுக்கான மனித போக்குவரத்து வாகனமாக NASA ஆர்டெமிஸ் திட்டத்தில் பயன்படுத்தப்படும். மாசிவான சுமை தாங்கும் திறன் கொண்டது.","description_english":"SpaceX Starship will serve as the Human Landing System for NASA's Artemis lunar missions.","date":"2026-2027","year":2026,"image_url":"https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80","agency":"SpaceX / NASA","category":"நிலவு ஆய்வு","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"LunaNet - நிலவு இணையம்","title_english":"LunaNet - Lunar Internet","description_tamil":"NASA-வின் LunaNet நிலவில் இணையம் மற்றும் நேர்மைப்படுத்துதல் சேவைகளை வழங்கும். நிலவில் மனித நடவடிக்கைகளுக்கு தகவல் தொடர்பு உதவும்.","description_english":"NASA's LunaNet will provide internet and navigation services on the Moon for future lunar activities.","date":"2030 திட்டமிட்டது","year":2030,"image_url":"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80","agency":"NASA","category":"தொழில்நுட்பம்","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"சர்வதேச நிலவு ஆய்வு நிலையம்","title_english":"International Lunar Research Station","description_tamil":"சீனா மற்றும் ரஷ்யா இணைந்து நிலவில் சர்வதேச ஆய்வு நிலையம் நிறுவ திட்டமிட்டுள்ளன. 2030-க்குள் தொடங்கி 2040-ல் முழு அளவில் செயல்படும்.","description_english":"China and Russia plan to build the International Lunar Research Station near the Moon's south pole.","date":"2030-2040","year":2035,"image_url":"https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=600&q=80","agency":"CNSA / Roscosmos","category":"நிலவு ஆய்வு","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"சிறுகோள் சுரங்க திட்டம்","title_english":"Asteroid Mining Initiative","description_tamil":"தனியார் நிறுவனங்கள் சிறுகோள்களில் மதிப்புமிக்க உலோகங்களை சுரங்கமிட திட்டமிட்டுள்ளன. ஒரு சிறுகோளில் 10 டிரில்லியன் டாலர் மதிப்புள்ள கனிமங்கள் இருக்கலாம்.","description_english":"Private companies plan to mine asteroids for precious metals, potentially worth trillions of dollars.","date":"2030+ திட்டமிட்டது","year":2033,"image_url":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80","agency":"தனியார் நிறுவனங்கள்","category":"சிறுகோள் ஆய்வு","status":"திட்டமிட்டது"},
    {"type":"future","title_tamil":"ஹீலியோஸ் சூரிய ஆய்வு","title_english":"Helios Solar Mission","description_tamil":"சூரியனை மிக அண்மையில் ஆய்வு செய்ய ESA திட்டமிடும் ஹீலியோஸ் விண்கலம் சூரியனிலிருந்து 28 சூரிய ஆரை தொலைவில் சுற்றும். அதிக வெப்ப தடுப்பு கவசம் கொண்டது.","description_english":"ESA's Helios mission will study the Sun from an extremely close orbit, protected by advanced heat shields.","date":"2032 திட்டமிட்டது","year":2032,"image_url":"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&q=80","agency":"ESA","category":"சூரிய ஆய்வு","status":"திட்டமிட்டது"},
]

ASTRONOMY_OBJECTS = [
    {"name_tamil":"சூரியன்","name_english":"The Sun","type":"நட்சத்திரம்","description_tamil":"நமது சூரிய குடும்பத்தின் மையமான சூரியன் ஒரு G-வகை நடுத்தர நட்சத்திரம். இதன் வெப்பநிலை மையத்தில் 15 மில்லியன் டிகிரி செல்சியஸ். சூரியன் வெளியிடும் ஆற்றல் நியூக்ளியர் சங்கம வினையால் உருவாகிறது.","description_english":"Our Sun is a G-type main-sequence star at the center of the solar system.","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/400px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg","distance":"8 ஒளி நிமிடங்கள்","size":"1,392,700 கி.மீ விட்டம்","fun_fact_tamil":"சூரியன் 99.86% சூரிய குடும்பத்தின் மொத்த நிறையை கொண்டுள்ளது!","color":"#FDB813"},
    {"name_tamil":"நிலவு / சந்திரன்","name_english":"The Moon","type":"துணைக்கோள்","description_tamil":"பூமியின் ஒரே இயற்கை துணைக்கோளான சந்திரன் 4.5 பில்லியன் ஆண்டுகள் பழமையானது. நிலவின் தாக்கம் பூமியில் கடல் அலைகளை உருவாக்குகிறது. ஒவ்வொரு ஆண்டும் 3.8 செமீ பூமியிலிருந்து விலகுகிறது.","description_english":"Earth's only natural satellite, influencing tides and stabilizing Earth's axial tilt.","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/400px-FullMoon2010.jpg","distance":"384,400 கி.மீ","size":"3,474 கி.மீ விட்டம்","fun_fact_tamil":"நிலவில் சத்தம் பரவாது - முழு அமைதி நிலவுகிறது!","color":"#C8C8C8"},
    {"name_tamil":"செவ்வாய்","name_english":"Mars","type":"கோள்","description_tamil":"சூரிய குடும்பத்தின் நான்காவது கோளான செவ்வாய் 'சிவப்பு கோள்' என அழைக்கப்படுகிறது. இரும்பு ஆக்சைட் (துரு) இருப்பதால் சிவப்பு நிறம். ஒலிம்பஸ் மான்ஸ் - சூரிய குடும்பத்தின் உயரமான மலை இங்கே உள்ளது.","description_english":"The 'Red Planet' with the largest volcano and deepest canyon in the solar system.","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/400px-OSIRIS_Mars_true_color.jpg","distance":"225 மில்லியன் கி.மீ (சராசரி)","size":"6,779 கி.மீ விட்டம்","fun_fact_tamil":"செவ்வாயில் ஒரு நாள் 24 மணி 37 நிமிடம் - பூமியை விட சிறிது நீண்டது!","color":"#CD5C5C"},
    {"name_tamil":"வியாழன்","name_english":"Jupiter","type":"கோள்","description_tamil":"சூரிய குடும்பத்தின் மிகப்பெரிய கோளான வியாழனில் 1,300 பூமிகள் அடங்கும். 'பெரிய சிவப்பு புள்ளி' 400 ஆண்டுகளுக்கும் மேலாக நீடிக்கும் ஒரு புயல் சூழல். 95 சந்திரன்கள் வியாழனை சுற்றுகின்றன.","description_english":"The largest planet in our solar system with its iconic Great Red Spot storm.","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/400px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg","distance":"778 மில்லியன் கி.மீ","size":"139,820 கி.மீ விட்டம்","fun_fact_tamil":"வியாழனின் காந்த புலம் பூமியை விட 20,000 மடங்கு வலிமையானது!","color":"#C88B3A"},
    {"name_tamil":"சனி","name_english":"Saturn","type":"கோள்","description_tamil":"சனி கிரகத்தின் அழகிய வளையங்கள் பாறைகள், பனிக்கட்டி மற்றும் தூசியால் ஆனவை. சனி நீரை விட குறைவான அடர்த்தி கொண்டது - நீரில் மிதக்கும். 146 சந்திரன்கள் உள்ளன.","description_english":"Known for its spectacular ring system made of ice and rock, Saturn would float on water.","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/400px-Saturn_during_Equinox.jpg","distance":"1.4 பில்லியன் கி.மீ","size":"116,460 கி.மீ விட்டம்","fun_fact_tamil":"சனியின் வளையங்கள் 1 கி.மீ தடிமன் மட்டுமே கொண்டவை - ஆனால் 282,000 கி.மீ அகலம்!","color":"#EAD7AA"},
    {"name_tamil":"வெள்ளி","name_english":"Venus","type":"கோள்","description_tamil":"சூரிய குடும்பத்தின் மிக சூடான கோளான வெள்ளி 465°C வெப்பநிலை கொண்டது. பூமியின் 'இரட்டையர்' என்று அழைக்கப்படும். ஆனால் அதிக CO2 வளிமண்டலம் வாழ்வுக்கு தகுதியற்றது.","description_english":"The hottest planet, often called Earth's twin despite its extreme greenhouse effect.","image_url":"https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&q=80","distance":"108.2 மில்லியன் கி.மீ","size":"12,104 கி.மீ விட்டம்","fun_fact_tamil":"வெள்ளி கிரகம் மற்ற கோள்களுக்கு எதிர்த்திசையில் சுழல்கிறது!","color":"#E8C984"},
    {"name_tamil":"புதன்","name_english":"Mercury","type":"கோள்","description_tamil":"சூரிய குடும்பத்தின் மிகவும் சிறிய மற்றும் சூரியனுக்கு மிக அருகில் உள்ள கோள். வளிமண்டலம் இல்லாததால் வெப்பநிலை -180 முதல் 430°C வரை மாறும். நிலவை ஒத்த மேற்பரப்பு.","description_english":"The smallest planet, closest to the Sun, with extreme temperature variations.","image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80","distance":"57.9 மில்லியன் கி.மீ","size":"4,879 கி.மீ விட்டம்","fun_fact_tamil":"புதனில் ஒரு ஆண்டு 88 நாட்கள் - ஆனால் ஒரு நாள் 59 பூமி நாட்கள்!","color":"#B5B5B5"},
    {"name_tamil":"யுரேனஸ்","name_english":"Uranus","type":"கோள்","description_tamil":"பனி ராட்சதன் என்று அழைக்கப்படும் யுரேனஸ் தனது பக்கத்தில் சாய்ந்து சுழல்கிறது. 27 சந்திரன்கள் மற்றும் 13 வளையங்கள் உள்ளன. மீத்தேன் வாயு நீல-பச்சை நிறத்திற்கு காரணம்.","description_english":"An ice giant that rotates on its side with 27 moons and faint ring system.","image_url":"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80","distance":"2.88 பில்லியன் கி.மீ","size":"50,724 கி.மீ விட்டம்","fun_fact_tamil":"யுரேனஸ் 84 பூமி ஆண்டுகளில் சூரியனை ஒரு முறை சுற்றுகிறது!","color":"#7DE8E8"},
    {"name_tamil":"ஒரியன் நட்சத்திர தொகுப்பு","name_english":"Orion Constellation","type":"நட்சத்திர தொகுப்பு","description_tamil":"வேட்டையாடுவோன் என்று அழைக்கப்படும் ஒரியன் நட்சத்திர தொகுப்பு இரவு வானில் மிகவும் சிறப்பாக தெரியும். பெல்டாஜிஸ் மற்றும் ரிகேல் நட்சத்திரங்கள் குறிப்பிடத்தக்கவை.","description_english":"One of the most recognizable constellations, featuring Betelgeuse and Rigel.","image_url":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80","distance":"1,344 ஒளி ஆண்டுகள் (நெபுலா)","size":"26x26 டிகிரி வானத்தில்","fun_fact_tamil":"ஒரியன் நெபுலாவில் தற்போதும் புதிய நட்சத்திரங்கள் பிறக்கின்றன!","color":"#6EA4FF"},
    {"name_tamil":"சிரியஸ்","name_english":"Sirius (Dog Star)","type":"நட்சத்திரம்","description_tamil":"இரவு வானின் மிகவும் பிரகாசமான நட்சத்திரமான சிரியஸ் 'நாய் நட்சத்திரம்' என்றும் அழைக்கப்படுகிறது. இது ஒரு இரட்டை நட்சத்திர அமைப்பு.","description_english":"The brightest star in the night sky, part of the Canis Major constellation.","image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80","distance":"8.6 ஒளி ஆண்டுகள்","size":"சூரியனை விட 1.7 மடங்கு பெரியது","fun_fact_tamil":"சிரியஸ் சூரியனை விட 25 மடங்கு அதிக ஒளி வீசுகிறது!","color":"#FFFFFF"},
    {"name_tamil":"ஆண்ட்ரோமீடா மங்கலம்","name_english":"Andromeda Galaxy","type":"மங்கலம்","description_tamil":"நமது பால்வெளிக்கு மிக அருகில் உள்ள மங்கலம் ஆண்ட்ரோமீடா. 4 பில்லியன் ஆண்டுகளில் பால்வெளியுடன் இது இணையும். 1 டிரில்லியன் நட்சத்திரங்கள் உள்ளன.","description_english":"Our nearest large galactic neighbor, set to merge with the Milky Way in 4 billion years.","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/400px-Andromeda_Galaxy_%28with_h-alpha%29.jpg","distance":"2.537 மில்லியன் ஒளி ஆண்டுகள்","size":"220,000 ஒளி ஆண்டுகள் விட்டம்","fun_fact_tamil":"ஆண்ட்ரோமீடா தினமும் 110 கி.மீ/வினாடி வேகத்தில் பூமியை நோக்கி வருகிறது!","color":"#7B61FF"},
    {"name_tamil":"பால்வெளி","name_english":"Milky Way Galaxy","type":"மங்கலம்","description_tamil":"நாம் வாழும் பால்வெளி மங்கலம் ஒரு தட்டையான சுழல் மங்கலம். 200-400 பில்லியன் நட்சத்திரங்கள் உள்ளன. மையத்தில் 'சஜிடேரியஸ் A*' என்ற பெரும் கருந்துளை உள்ளது.","description_english":"Our home galaxy, a barred spiral galaxy containing 200-400 billion stars.","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-0a-07.jpg/400px-ESO-VLT-Laser-phot-0a-07.jpg","distance":"100,000 ஒளி ஆண்டுகள் விட்டம்","size":"100,000 ஒளி ஆண்டுகள்","fun_fact_tamil":"சூரியன் பால்வெளி மையத்தை சுற்ற 225 மில்லியன் ஆண்டுகள் ஆகும்!","color":"#9B6DFF"},
    {"name_tamil":"கார்த்திகை / ப்லீயாடீஸ்","name_english":"Pleiades (Seven Sisters)","type":"நட்சத்திர குழு","description_tamil":"கார்த்திகை நட்சத்திர குழு 'ஏழு சகோதரிகள்' என்று அழைக்கப்படுகிறது. Tamil traditions நட்சத்திரங்களில் 3வது நட்சத்திரம். அழகான நீல-வெள்ளை நட்சத்திரங்கள் உள்ளன.","description_english":"The Pleiades or Seven Sisters, an open cluster of hot blue stars visible to the naked eye.","image_url":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80","distance":"444 ஒளி ஆண்டுகள்","size":"110 ஒளி ஆண்டுகள்","fun_fact_tamil":"கார்த்திகை நட்சத்திர குழுவில் சுமார் 1,000 நட்சத்திரங்கள் உள்ளன!","color":"#4FC3F7"},
    {"name_tamil":"துருவ நட்சத்திரம்","name_english":"Polaris (North Star)","type":"நட்சத்திரம்","description_tamil":"வடக்கு திசையை காட்டும் துருவ நட்சத்திரம் பூமியின் சுழல் அச்சுக்கு நேரடியாக மேலே உள்ளது. மாலுமிகளும் பயணிகளும் இதை திசை காட்டியாக பயன்படுத்தினர்.","description_english":"The North Star, located nearly directly above Earth's North Pole, used for navigation for centuries.","image_url":"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80","distance":"432.6 ஒளி ஆண்டுகள்","size":"சூரியனை விட 46 மடங்கு பெரியது","fun_fact_tamil":"துருவ நட்சத்திரம் 13,000 ஆண்டுகளில் வேகா நட்சத்திரமாக மாறும்!","color":"#FFD700"},
    {"name_tamil":"பெரிய கரடி","name_english":"Ursa Major","type":"நட்சத்திர தொகுப்பு","description_tamil":"வட வானில் காணக்கூடிய பெரிய கரடி நட்சத்திர தொகுப்பில் 'ஸ்பூன்' வடிவமான ஏழு நட்சத்திர படம் மிகவும் பிரபலமானது. இது வட துருவத்தை கண்டறிய உதவுகிறது.","description_english":"A large constellation containing the Big Dipper asterism, used to find Polaris.","image_url":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80","distance":"வேறுபட்ட தொலைவுகள்","size":"1280 சதுர டிகிரி","fun_fact_tamil":"பெரிய கரடியின் இரண்டு நட்சத்திரங்கள் துருவ நட்சத்திரத்தை நேர்கோட்டில் காட்டுகின்றன!","color":"#A8C8FF"},
    {"name_tamil":"நெப்டியூன்","name_english":"Neptune","type":"கோள்","description_tamil":"சூரிய குடும்பத்தின் கடைசி கோளான நெப்டியூன் சூரியனிலிருந்து மிக தொலைவில் உள்ளது. 2,100 கி.மீ/மணி வேக காற்று வீசும் மிக வலிமையான புயல்கள் நடக்கின்றன.","description_english":"The farthest planet, known for its supersonic winds and the Great Dark Spot storm.","image_url":"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80","distance":"4.5 பில்லியன் கி.மீ","size":"49,244 கி.மீ விட்டம்","fun_fact_tamil":"நெப்டியூனில் ஒரு சூழல் பொருள் 165 பூமி ஆண்டுகளில் சூரியனை சுற்றும்!","color":"#4169E1"},
]

TIMELINE_EVENTS = [
    {"year":-200,"title_tamil":"பண்டைய தமிழ் வானியல்","title_english":"Ancient Tamil Astronomy","description_tamil":"பண்டைய தமிழர்கள் நட்சத்திரங்களை 27 நட்சத்திரங்களாக வகைப்படுத்தினர். புறநானூறு மற்றும் சங்க இலக்கியங்கள் வானியல் அறிவை பதிவு செய்கின்றன.","type":"past","category":"வரலாறு"},
    {"year":500,"title_tamil":"ஆர்யபட்டாவின் கண்டுபிடிப்புகள்","title_english":"Aryabhata's Discoveries","description_tamil":"ஆர்யபட்டா பூமி தன்னைத்தானே சுழல்கிறது என்றும் நிலவு சூரிய ஒளியை பிரதிபலிக்கிறது என்றும் கண்டுபிடித்தார். ஆர்யபட்டீயம் என்ற நூலில் பல வானியல் கணக்குகள்.","type":"past","category":"விஞ்ஞானம்"},
    {"year":1543,"title_tamil":"கோபர்னிக்கஸ் - சூரிய மையக் கோட்பாடு","title_english":"Copernicus Heliocentric Model","description_tamil":"நிக்கோலஸ் கோபர்னிக்கஸ் சூரியன் பிரபஞ்சத்தின் மையம் என்ற கோட்பாட்டை வெளியிட்டார். இது வானியல் வரலாற்றில் புரட்சிகரமான மாற்றம்.","type":"past","category":"விஞ்ஞானம்"},
    {"year":1609,"title_tamil":"கலீலியோவின் தொலைநோக்கி","title_english":"Galileo's Telescope","description_tamil":"கலீலியோ கலீலி தொலைநோக்கியை வானியலுக்கு பயன்படுத்தி வியாழனின் சந்திரன்களையும் சனியின் வளையங்களையும் கண்டுபிடித்தார்.","type":"past","category":"கண்டுபிடிப்பு"},
    {"year":1687,"title_tamil":"நியூட்டனின் புவியீர்ப்பு விதி","title_english":"Newton's Law of Gravitation","description_tamil":"ஐசக் நியூட்டன் புவியீர்ப்பு விதியை வெளியிட்டார். இது கோள்களின் இயக்கத்தை விளக்கி வானியலை புரட்சிகரமாக்கியது.","type":"past","category":"விஞ்ஞானம்"},
    {"year":1915,"title_tamil":"ஐன்ஸ்டீனின் ஒப்பியல் கோட்பாடு","title_english":"Einstein's General Relativity","description_tamil":"ஆல்பர்ட் ஐன்ஸ்டீன் பொது ஒப்பியல் கோட்பாட்டை வெளியிட்டார். இது விண்வெளி, நேரம் மற்றும் புவியீர்ப்பு பற்றிய நமது புரிதலை மாற்றியது.","type":"past","category":"விஞ்ஞானம்"},
    {"year":1957,"title_tamil":"ஸ்புட்னிக்-1 - விண்வெளி யுகம் தொடக்கம்","title_english":"Sputnik-1: Space Age Begins","description_tamil":"உலகின் முதல் செயற்கைக்கோள் ஸ்புட்னிக்-1 விண்ணில் ஏவப்பட்டது. விண்வெளி போட்டியின் தொடக்கம்.","type":"past","category":"விண்வெளி"},
    {"year":1961,"title_tamil":"யூரி கெகாரின் - முதல் மனிதன்","title_english":"Yuri Gagarin - First Human","description_tamil":"யூரி கெகாரின் முதல் மனிதனாக விண்வெளி சென்று திரும்பினார். 108 நிமிட வரலாற்று பயணம்.","type":"past","category":"மனித விண்வெளி"},
    {"year":1969,"title_tamil":"ஆபோலோ-11 - நிலவு சாதனை","title_english":"Apollo 11 Moon Landing","description_tamil":"மனிதன் முதல் முறையாக நிலவில் காலடி வைத்தான். நீல் ஆம்ஸ்ட்ராங்கின் வரலாற்று வாக்கியம்.","type":"past","category":"நிலவு"},
    {"year":1975,"title_tamil":"ஆர்யபட்டா - இந்தியாவின் முதல் செயற்கைக்கோள்","title_english":"Aryabhata - India's First Satellite","description_tamil":"இந்தியா விண்வெளி யுகத்தில் நுழைந்தது. ISRO-வின் பயணம் தொடங்கியது.","type":"past","category":"இந்தியா"},
    {"year":1984,"title_tamil":"ராக்கேஷ் ஷர்மா - விண்வெளியில் இந்தியர்","title_english":"Rakesh Sharma in Space","description_tamil":"முதல் இந்திய விண்வெளி வீரர் ராக்கேஷ் ஷர்மா விண்வெளியிலிருந்து 'சாரே ஜஹாந் சே அச்சா' பாடினார்.","type":"past","category":"இந்தியா"},
    {"year":1990,"title_tamil":"ஹப்பிள் தொலைநோக்கி","title_english":"Hubble Space Telescope","description_tamil":"பிரபஞ்சத்தின் ஆழத்தை திறந்த ஹப்பிள் தொலைநோக்கி ஏவப்பட்டது. 1.5 மில்லியன் படங்களை எடுத்துள்ளது.","type":"past","category":"தொலைநோக்கி"},
    {"year":2008,"title_tamil":"சந்திரயான்-1","title_english":"Chandrayaan-1","description_tamil":"இந்தியாவின் முதல் நிலவு ஆய்வு திட்டம். நிலவில் நீர் இருப்பதை கண்டுபிடித்தது.","type":"past","category":"இந்தியா"},
    {"year":2014,"title_tamil":"மங்கள்யான்","title_english":"Mangalyaan (MOM)","description_tamil":"இந்தியா முதல் முயற்சியிலேயே செவ்வாயை அடைந்தது. ஆசியாவின் முதல் செவ்வாய் ஆய்வு.","type":"past","category":"இந்தியா"},
    {"year":2021,"title_tamil":"ஜேம்ஸ் வெப் தொலைநோக்கி","title_english":"James Webb Space Telescope","description_tamil":"$10 பில்லியன் மதிப்புள்ள JWST ஏவப்பட்டது. பிரபஞ்சத்தின் ஆரம்பகால படங்கள் கிடைத்தன.","type":"past","category":"தொலைநோக்கி"},
    {"year":2023,"title_tamil":"சந்திரயான்-3 வெற்றி","title_english":"Chandrayaan-3 Success","description_tamil":"இந்தியா நிலவின் தென் துருவத்தில் முதல் நாடாக தரையிறங்கியது. சல்ஃபர் கண்டுபிடிப்பு.","type":"past","category":"இந்தியா"},
    {"year":2023,"title_tamil":"ஆதித்யா-எல்1 ஏவுதல்","title_english":"Aditya-L1 Launch","description_tamil":"இந்தியாவின் முதல் சூரிய ஆய்வு விண்கலம் வெற்றிகரமாக ஏவப்பட்டது.","type":"present","category":"இந்தியா"},
    {"year":2025,"title_tamil":"ககன்யான் - இந்திய விண்வெளி வீரர்கள்","title_english":"Gaganyaan Mission","description_tamil":"இந்திய விண்வெளி வீரர்கள் முதன்முறையாக ISRO ஏவுகணையில் விண்வெளி செல்வர்.","type":"future","category":"இந்தியா"},
    {"year":2026,"title_tamil":"ஆர்டெமிஸ்-3 நிலவில்","title_english":"Artemis III Moon Landing","description_tamil":"முதல் பெண் நிலவில் காலடி வைப்பார். 52 ஆண்டுகளுக்கு பிறகு மனிதன் நிலவில்.","type":"future","category":"நிலவு"},
    {"year":2028,"title_tamil":"சந்திரயான்-4","title_english":"Chandrayaan-4","description_tamil":"நிலவிலிருந்து மண் மாதிரிகள் பூமிக்கு திரும்பும். இஸ்ரோவின் தொழில்நுட்ப முன்னேற்றம்.","type":"future","category":"இந்தியா"},
    {"year":2028,"title_tamil":"சுக்ரயான் - வெள்ளி","title_english":"Shukrayaan - Venus","description_tamil":"இஸ்ரோவின் வெள்ளி ஆய்வு திட்டம் வெள்ளியின் வளிமண்டலத்தை ஆய்வு செய்யும்.","type":"future","category":"இந்தியா"},
    {"year":2030,"title_tamil":"செவ்வாய் மாதிரி திரும்பல்","title_english":"Mars Sample Return","description_tamil":"பெர்செவரன்ஸ் சேகரித்த செவ்வாய் பாறை மாதிரிகள் பூமிக்கு வரும். வரலாற்று சாதனை.","type":"future","category":"செவ்வாய்"},
    {"year":2031,"title_tamil":"JUICE - வியாழன் சந்திரன்கள்","title_english":"JUICE at Jupiter","description_tamil":"ESA-வின் JUICE வியாழனின் பனிக்கட்டி சந்திரன்களை ஆய்வு செய்யும்.","type":"future","category":"கோள் ஆய்வு"},
    {"year":2035,"title_tamil":"இந்திய விண்வெளி நிலையம்","title_english":"Indian Space Station","description_tamil":"இஸ்ரோ தனது விண்வெளி நிலையத்தை நிறுவும். இந்தியாவின் தொழில்நுட்ப உச்சி.","type":"future","category":"இந்தியா"},
    {"year":2037,"title_tamil":"மனிதன் செவ்வாயில்","title_english":"Humans on Mars","description_tamil":"முதல் மனிதர்கள் செவ்வாயில் காலடி வைப்பர். மனிதகுலத்தின் மிகப்பெரிய பயணம்.","type":"future","category":"மனித விண்வெளி"},
]

GALLERY_ITEMS = [
    {"title_tamil":"ஹப்பிள் ஆழ்-புல படம்","title_english":"Hubble Ultra Deep Field","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg/400px-NASA-HS201427a-HubbleUltraDeepField2014-20140603.jpg","description_tamil":"13 பில்லியன் ஆண்டுகள் பழமையான மங்கலங்களின் படம். ஒவ்வொரு ஒளிப்புள்ளியும் ஒரு முழு மங்கலம்!","photographer":"NASA / ESA / Hubble","category":"பிரபஞ்சம்"},
    {"title_tamil":"சனிக்கிரக வளையங்கள்","title_english":"Saturn's Rings","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/400px-Saturn_during_Equinox.jpg","description_tamil":"சனி கிரகத்தின் அழகிய வளையங்கள் பாறை மற்றும் பனிக்கட்டியால் ஆனவை.","photographer":"NASA / Cassini","category":"கோள்கள்"},
    {"title_tamil":"வியாழன் - பெரிய சிவப்பு புள்ளி","title_english":"Jupiter's Great Red Spot","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/400px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg","description_tamil":"400 ஆண்டுகளாக நடக்கும் வியாழனின் பெரிய புயல். பூமியை விட 2 மடங்கு பெரியது.","photographer":"NASA / Hubble","category":"கோள்கள்"},
    {"title_tamil":"முழு நிலவு","title_english":"Full Moon","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/400px-FullMoon2010.jpg","description_tamil":"பூமியின் ஒரே இயற்கை துணைக்கோள். 384,400 கி.மீ தொலைவில்.","photographer":"Gregory H. Revera","category":"நிலவு"},
    {"title_tamil":"செவ்வாய் - சிவப்பு கோள்","title_english":"Mars - Red Planet","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/400px-OSIRIS_Mars_true_color.jpg","description_tamil":"இரும்பு ஆக்சைட் காரணமாக சிவப்பு நிறம் கொண்ட செவ்வாய் கிரகம்.","photographer":"ESA / Rosetta","category":"கோள்கள்"},
    {"title_tamil":"ஒரியன் நெபுலா - நட்சத்திர பிறப்பிடம்","title_english":"Orion Nebula","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/400px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg","description_tamil":"1,344 ஒளி ஆண்டு தொலைவில் உள்ள நட்சத்திர பிறப்பிடம். புதிய சூரிய குடும்பங்கள் உருவாகுகின்றன.","photographer":"NASA / ESA / Hubble","category":"நெபுலா"},
    {"title_tamil":"படைத்தல் தூண்கள்","title_english":"Pillars of Creation","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg/400px-Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg","description_tamil":"கழுகு நெபுலாவில் உள்ள நட்சத்திர பிறப்பு பகுதி. ஹப்பிளின் மிகவும் பிரபலமான படம்.","photographer":"NASA / ESA / Hubble","category":"நெபுலா"},
    {"title_tamil":"ஆண்ட்ரோமீடா மங்கலம்","title_english":"Andromeda Galaxy","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/400px-Andromeda_Galaxy_%28with_h-alpha%29.jpg","description_tamil":"நமது அண்டை மங்கலம். 2.5 மில்லியன் ஒளி ஆண்டு தொலைவில் 1 டிரில்லியன் நட்சத்திரங்கள்.","photographer":"Adam Evans","category":"மங்கலம்"},
    {"title_tamil":"பூமி - அவகாசத்திலிருந்து","title_english":"Earth from Apollo 17","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/400px-The_Earth_seen_from_Apollo_17.jpg","description_tamil":"ஆபோலோ 17 விண்கலத்திலிருந்து எடுக்கப்பட்ட பூமியின் புகழ்பெற்ற படம் 'நீல் கண்ணாடிக்குண்டு'.","photographer":"NASA Apollo 17","category":"பூமி"},
    {"title_tamil":"சூரியன் - சூரிய இயக்கவியல் ஆய்வகம்","title_english":"Sun by SDO","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/400px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg","description_tamil":"NASA-வின் சூரிய இயக்கவியல் ஆய்வகம் எடுத்த சூரியனின் புற ஊதா படம்.","photographer":"NASA SDO","category":"சூரியன்"},
    {"title_tamil":"பால்வெளி - VLT தொலைநோக்கி","title_english":"Milky Way Center","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-0a-07.jpg/400px-ESO-VLT-Laser-phot-0a-07.jpg","description_tamil":"ESO-வின் VLT தொலைநோக்கியிலிருந்து பால்வெளியின் மையம் நோக்கி எடுக்கப்பட்ட படம்.","photographer":"ESO / Y. Beletsky","category":"பால்வெளி"},
    {"title_tamil":"சர்வதேச விண்வெளி நிலையம்","title_english":"International Space Station","image_url":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ISS_Feb_2010.jpg/400px-ISS_Feb_2010.jpg","description_tamil":"பூமியிலிருந்து 408 கி.மீ உயரத்தில் உள்ள மனிதகுலத்தின் விண்வெளி வீடு.","photographer":"NASA","category":"விண்வெளி நிலையம்"},
]

# ── Astrology Calculation ─────────────────────────────────────────────────────

RASIS = [
    {"id":1,"tamil":"மேஷம்","english":"Aries","symbol":"♈","element":"நெருப்பு","quality":"சர","ruler":"செவ்வாய்"},
    {"id":2,"tamil":"ரிஷபம்","english":"Taurus","symbol":"♉","element":"நிலம்","quality":"ஸ்திர","ruler":"வெள்ளி"},
    {"id":3,"tamil":"மிதுனம்","english":"Gemini","symbol":"♊","element":"காற்று","quality":"உபய","ruler":"புதன்"},
    {"id":4,"tamil":"கடகம்","english":"Cancer","symbol":"♋","element":"நீர்","quality":"சர","ruler":"சந்திரன்"},
    {"id":5,"tamil":"சிம்மம்","english":"Leo","symbol":"♌","element":"நெருப்பு","quality":"ஸ்திர","ruler":"சூரியன்"},
    {"id":6,"tamil":"கன்னி","english":"Virgo","symbol":"♍","element":"நிலம்","quality":"உபய","ruler":"புதன்"},
    {"id":7,"tamil":"துலாம்","english":"Libra","symbol":"♎","element":"காற்று","quality":"சர","ruler":"வெள்ளி"},
    {"id":8,"tamil":"விருச்சிகம்","english":"Scorpio","symbol":"♏","element":"நீர்","quality":"ஸ்திர","ruler":"செவ்வாய்"},
    {"id":9,"tamil":"தனுசு","english":"Sagittarius","symbol":"♐","element":"நெருப்பு","quality":"உபய","ruler":"வியாழன்"},
    {"id":10,"tamil":"மகரம்","english":"Capricorn","symbol":"♑","element":"நிலம்","quality":"சர","ruler":"சனி"},
    {"id":11,"tamil":"கும்பம்","english":"Aquarius","symbol":"♒","element":"காற்று","quality":"ஸ்திர","ruler":"சனி"},
    {"id":12,"tamil":"மீனம்","english":"Pisces","symbol":"♓","element":"நீர்","quality":"உபய","ruler":"வியாழன்"},
]

NAKSHATRAS = [
    {"id":1,"tamil":"அசுவினி","english":"Ashwini","ruler":"கேது","rasi_id":1,"deity":"அஸ்வினி குமாரர்கள்"},
    {"id":2,"tamil":"பரணி","english":"Bharani","ruler":"வெள்ளி","rasi_id":1,"deity":"யமன்"},
    {"id":3,"tamil":"கார்த்திகை","english":"Krittika","ruler":"சூரியன்","rasi_id":2,"deity":"அக்னி"},
    {"id":4,"tamil":"ரோகிணி","english":"Rohini","ruler":"சந்திரன்","rasi_id":2,"deity":"பிரம்மா"},
    {"id":5,"tamil":"மிருகசீரிஷம்","english":"Mrigashirsha","ruler":"செவ்வாய்","rasi_id":3,"deity":"சோமன்"},
    {"id":6,"tamil":"திருவாதிரை","english":"Ardra","ruler":"ராகு","rasi_id":3,"deity":"ருத்ரன்"},
    {"id":7,"tamil":"புனர்பூசம்","english":"Punarvasu","ruler":"வியாழன்","rasi_id":4,"deity":"அதிதி"},
    {"id":8,"tamil":"பூசம்","english":"Pushya","ruler":"சனி","rasi_id":4,"deity":"பிருஹஸ்பதி"},
    {"id":9,"tamil":"ஆயில்யம்","english":"Ashlesha","ruler":"புதன்","rasi_id":4,"deity":"நாகன்"},
    {"id":10,"tamil":"மகம்","english":"Magha","ruler":"கேது","rasi_id":5,"deity":"பிதுர்"},
    {"id":11,"tamil":"பூரம்","english":"Purva Phalguni","ruler":"வெள்ளி","rasi_id":5,"deity":"பகன்"},
    {"id":12,"tamil":"உத்திரம்","english":"Uttara Phalguni","ruler":"சூரியன்","rasi_id":6,"deity":"அர்யமன்"},
    {"id":13,"tamil":"அஸ்தம்","english":"Hasta","ruler":"சந்திரன்","rasi_id":6,"deity":"சவிதர்"},
    {"id":14,"tamil":"சித்திரை","english":"Chitra","ruler":"செவ்வாய்","rasi_id":7,"deity":"விஷ்வகர்மா"},
    {"id":15,"tamil":"சுவாதி","english":"Swati","ruler":"ராகு","rasi_id":7,"deity":"வாயு"},
    {"id":16,"tamil":"விசாகம்","english":"Vishakha","ruler":"வியாழன்","rasi_id":8,"deity":"இந்திரன்"},
    {"id":17,"tamil":"அனுஷம்","english":"Anuradha","ruler":"சனி","rasi_id":8,"deity":"மித்ரன்"},
    {"id":18,"tamil":"கேட்டை","english":"Jyeshtha","ruler":"புதன்","rasi_id":8,"deity":"இந்திரன்"},
    {"id":19,"tamil":"மூலம்","english":"Mula","ruler":"கேது","rasi_id":9,"deity":"நிர்ருதி"},
    {"id":20,"tamil":"பூராடம்","english":"Purva Ashadha","ruler":"வெள்ளி","rasi_id":9,"deity":"ஆபஸ்"},
    {"id":21,"tamil":"உத்திராடம்","english":"Uttara Ashadha","ruler":"சூரியன்","rasi_id":10,"deity":"விஷ்வேதேவர்"},
    {"id":22,"tamil":"திருவோணம்","english":"Shravana","ruler":"சந்திரன்","rasi_id":10,"deity":"விஷ்ணு"},
    {"id":23,"tamil":"அவிட்டம்","english":"Dhanishtha","ruler":"செவ்வாய்","rasi_id":11,"deity":"அஷ்டவசுக்கள்"},
    {"id":24,"tamil":"சதயம்","english":"Shatabhisha","ruler":"ராகு","rasi_id":11,"deity":"வருணன்"},
    {"id":25,"tamil":"பூரட்டாதி","english":"Purva Bhadrapada","ruler":"வியாழன்","rasi_id":12,"deity":"அஜ ஏகபாத்"},
    {"id":26,"tamil":"உத்திரட்டாதி","english":"Uttara Bhadrapada","ruler":"சனி","rasi_id":12,"deity":"அஹிர்புத்னியன்"},
    {"id":27,"tamil":"ரேவதி","english":"Revati","ruler":"புதன்","rasi_id":12,"deity":"பூஷன்"},
]

def get_sun_rasi_index(month: int, day: int) -> int:
    if (month == 4 and day >= 14) or (month == 5 and day <= 14): return 0
    elif (month == 5 and day >= 15) or (month == 6 and day <= 14): return 1
    elif (month == 6 and day >= 15) or (month == 7 and day <= 15): return 2
    elif (month == 7 and day >= 16) or (month == 8 and day <= 16): return 3
    elif (month == 8 and day >= 17) or (month == 9 and day <= 16): return 4
    elif (month == 9 and day >= 17) or (month == 10 and day <= 17): return 5
    elif (month == 10 and day >= 18) or (month == 11 and day <= 15): return 6
    elif (month == 11 and day >= 16) or (month == 12 and day <= 15): return 7
    elif (month == 12 and day >= 16) or (month == 1 and day <= 13): return 8
    elif (month == 1 and day >= 14) or (month == 2 and day <= 12): return 9
    elif (month == 2 and day >= 13) or (month == 3 and day <= 13): return 10
    else: return 11

def calculate_astrology(data: AstrologyInput):
    try:
        birth_dt = datetime.strptime(f"{data.birth_date}T{data.birth_time}", "%Y-%m-%dT%H:%M")
    except Exception:
        birth_dt = datetime.strptime(data.birth_date, "%Y-%m-%d")

    bd = birth_dt?.date()
    ref = ddate(2000, 1, 1)
    days = (bd - ref).days

    sun_rasi_idx = get_sun_rasi_index(bd.month, bd.day)
    nak_idx = int((days % 27.32) / 27.32 * 27) % 27
    moon_rasi_idx = NAKSHATRAS[nak_idx]["rasi_id"] - 1

    hour = birth_dt.hour + birth_dt.minute / 60
    lagna_offset = int(((hour - 6) % 24) / 2)
    lagna_idx = (sun_rasi_idx + lagna_offset) % 12

    VAARA = ["ஞாயிறு","திங்கள்","செவ்வாய்","புதன்","வியாழன்","வெள்ளி","சனி"]
    weekday_map = {0:1,1:2,2:3,3:4,4:5,5:6,6:0}
    vaara = VAARA[weekday_map[birth_dt.weekday()]]

    THITHI = ["பிரதமை","துவிதியை","திருதியை","சதுர்த்தி","பஞ்சமி","ஷஷ்டி","சப்தமி","அஷ்டமி","நவமி","தசமி","ஏகாதசி","துவாதசி","திரயோதசி","சதுர்தசி","பௌர்ணமி","பிரதமை","துவிதியை","திருதியை","சதுர்த்தி","பஞ்சமி","ஷஷ்டி","சப்தமி","அஷ்டமி","நவமி","தசமி","ஏகாதசி","துவாதசி","திரயோதசி","சதுர்தசி","அமாவாசை"]
    thithi = THITHI[int(days % 30)]

    YOGA = ["விஷ்கம்பம்","பிரீதி","ஆயுஷ்மான்","சௌபாக்யம்","சோபனம்","அதிகண்டம்","சுகர்மம்","துருதி","சூலம்","கண்டம்","வ்ருத்தி","த்ருவம்","வ்யாகாதம்","ஹர்ஷணம்","வஜ்ரம்","சித்தி","வ்யதீபாதம்","வரீயான்","பரிகம்","சிவம்","சித்தம்","சாத்யம்","சுபம்","சுக்லம்","பிரம்மம்","இந்திரம்","வைத்ருதம்"]
    yoga = YOGA[(sun_rasi_idx * 3 + nak_idx) % 27]

    CHARS = {"கேது":"ஆன்மீக சிந்தனை, தியான சக்தி உங்கள் சிறப்பு குணங்கள். கேது கிரகம் மோட்ச வழியை காட்டுகிறது.","வெள்ளி":"கலை ஆர்வம், அழகு உணர்வு, காதல் வெற்றி உங்களுக்கு உண்டு. வெள்ளி கிரகம் செல்வம் தருகிறது.","சூரியன்":"தலைமை குணம், ஆட்சி திறன், நிர்வாக சக்தி உங்கள் பலம். சூரியன் புகழை தருகிறது.","சந்திரன்":"மன நிலைப்பாடு, கற்பனை சக்தி, கலை திறன் உங்களுக்கு அதிகம். சந்திரன் மனதை வழிகாட்டுகிறது.","செவ்வாய்":"தைரியம், உழைப்பு, போர் குணம் உங்கள் சிறப்பு. செவ்வாய் வெற்றியை உறுதி செய்கிறது.","ராகு":"நவீன சிந்தனை, புதுமை விரும்புதல். ராகு தனித்துவம் தருகிறது.","வியாழன்":"ஞானம், கல்வி, ஆசிரியர் குணம் உங்களிடம் உள்ளது. வியாழன் அறிவொளி தருகிறது.","சனி":"நிலைத்தன்மை, கடமை உணர்வு, நீண்ட நாள் உழைப்பு வெற்றி ரகசியம். சனி நீதி தருகிறது.","புதன்":"அறிவுக்கூர்மை, வாக்கு வலிமை, வணிக திறன் மிகுந்துள்ளது. புதன் தொடர்பு சக்தி தருகிறது."}

    ruling_planet = NAKSHATRAS[nak_idx]["ruler"]
    char = CHARS.get(ruling_planet, "உங்கள் நட்சத்திரம் சிறப்பான குணங்களை அளிக்கிறது.")

    LUCKY_COLORS = ["சிவப்பு","வெள்ளை","பச்சை","கிரீம்","நாரத்தை","நீலம்","கருப்பு","சிவப்பு","மஞ்சள்","கருப்பு","நீலம்","மஞ்சள்"]
    LUCKY_NUMBERS = [9,6,5,2,1,5,6,9,3,8,8,3]
    LUCKY_GEMS = ["மாணிக்கம்","வைரம்","மரகதம்","முத்து","மாணிக்கம்","மரகதம்","வைரம்","பவளம்","புஷ்பராகம்","நீலம்","நீலம்","புஷ்பராகம்"]

    return {
        "rasi": RASIS[sun_rasi_idx],
        "nakshatra": NAKSHATRAS[nak_idx],
        "lagna": RASIS[lagna_idx],
        "moon_rasi": RASIS[moon_rasi_idx],
        "panchangam": {"vaara": vaara, "thithi": thithi, "yoga": yoga, "nakshatra": NAKSHATRAS[nak_idx]["tamil"]},
        "characteristics": char,
        "lucky_color": LUCKY_COLORS[sun_rasi_idx],
        "lucky_number": LUCKY_NUMBERS[sun_rasi_idx],
        "lucky_gem": LUCKY_GEMS[sun_rasi_idx],
        "name": data.name or "நீங்கள்",
        "birth_place": data.birth_place,
    }

# ── Seed Function ─────────────────────────────────────────────────────────────

async def seed_db():
    try:
        if await db.space_content.count_documents({}) == 0:
            docs = [{"id": str(uuid.uuid4()), **d} for d in SPACE_DATA]
            await db.space_content.insert_many(docs)
            logger.info(f"Seeded {len(docs)} space events")
        if await db.astronomy_objects.count_documents({}) == 0:
            docs = [{"id": str(uuid.uuid4()), **d} for d in ASTRONOMY_OBJECTS]
            await db.astronomy_objects.insert_many(docs)
            logger.info(f"Seeded {len(docs)} astronomy objects")
        if await db.timeline_events.count_documents({}) == 0:
            docs = [{"id": str(uuid.uuid4()), **d} for d in TIMELINE_EVENTS]
            await db.timeline_events.insert_many(docs)
            logger.info(f"Seeded {len(docs)} timeline events")
        if await db.gallery_items.count_documents({}) == 0:
            docs = [{"id": str(uuid.uuid4()), **d} for d in GALLERY_ITEMS]
            await db.gallery_items.insert_many(docs)
            logger.info(f"Seeded {len(docs)} gallery items")
    except Exception as e:
        logger.error(f"Seed error: {e}")

# ── API Routes ────────────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "MJ விண்வெளி API v1.0", "status": "செயல்பாட்டில்"}

@api_router.get("/space/past")
async def get_past():
    docs = await db.space_content.find({"type": "past"}, {"_id": 0}).sort("year", 1).to_list(100)
    return docs

@api_router.get("/space/present")
async def get_present():
    docs = await db.space_content.find({"type": "present"}, {"_id": 0}).to_list(100)
    return docs

@api_router.get("/space/future")
async def get_future():
    docs = await db.space_content.find({"type": "future"}, {"_id": 0}).sort("year", 1).to_list(100)
    return docs

@api_router.get("/objects")
async def get_objects():
    docs = await db.astronomy_objects.find({}, {"_id": 0}).to_list(100)
    return docs

@api_router.get("/timeline")
async def get_timeline():
    docs = await db.timeline_events.find({}, {"_id": 0}).sort("year", 1).to_list(100)
    return docs

@api_router.get("/gallery")
async def get_gallery():
    docs = await db.gallery_items.find({}, {"_id": 0}).to_list(100)
    return docs

@api_router.post("/astrology/calculate")
async def astrology_calculate(data: AstrologyInput):
    try:
        result = calculate_astrology(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/live-astronomy")
async def get_live_astronomy():
    import math, random
    now = datetime.now(timezone.utc)
    ref = datetime(2000, 1, 6, 18, 14, tzinfo=timezone.utc)
    days = (now - ref).total_seconds() / 86400
    phase_days = days % 29.53059
    illumination = round(50 - 50 * math.cos(2 * math.pi * phase_days / 29.53059), 1)
    if phase_days < 1.85: phase_name = "அமாவாசை"
    elif phase_days < 7.38: phase_name = "வளர்பிறை"
    elif phase_days < 9.22: phase_name = "முதல் கால்"
    elif phase_days < 14.77: phase_name = "வளர்பிறை பூர்ணிமை"
    elif phase_days < 16.61: phase_name = "பௌர்ணமி"
    elif phase_days < 22.15: phase_name = "தேய்பிறை"
    elif phase_days < 23.99: phase_name = "கடை கால்"
    else: phase_name = "தேய்பிறை கடை"
    upcoming = await db.timeline_events.find({"type": "future"}, {"_id": 0}).sort("year", 1).limit(3).to_list(3)
    facts = [
        {"tamil": "சூரியனிலிருந்து ஒளி பூமியை அடைய 8 நிமிடங்கள் ஆகும்", "english": "Light from the Sun takes 8 minutes to reach Earth"},
        {"tamil": "பால்வெளியில் 200–400 பில்லியன் நட்சத்திரங்கள் உள்ளன", "english": "Milky Way contains 200–400 billion stars"},
        {"tamil": "வியாழன் 1,300 பூமிகளை தன்னுள் அடக்கலாம்", "english": "Jupiter could fit 1,300 Earths inside it"},
        {"tamil": "ஒரு நட்சத்திரம் சராசரியாக 10 பில்லியன் ஆண்டுகள் வாழும்", "english": "An average star lives for about 10 billion years"},
        {"tamil": "நிலவு ஒவ்வொரு ஆண்டும் 3.8 செமீ பூமியிலிருந்து விலகுகிறது", "english": "The Moon drifts 3.8 cm further from Earth each year"},
    ]
    return {"lunar": {"phase_name": phase_name, "phase_days": round(phase_days, 1), "illumination": illumination}, "upcoming_events": upcoming, "space_fact": random.choice(facts)}

@api_router.get("/objects/{item_id}")
async def get_object_by_id(item_id: str):
    doc = await db.astronomy_objects.find_one({"id": item_id}, {"_id": 0})
    if not doc: raise HTTPException(status_code=404, detail="Not found")
    return doc

@api_router.get("/gallery/{item_id}")
async def get_gallery_item_by_id(item_id: str):
    doc = await db.gallery_items.find_one({"id": item_id}, {"_id": 0})
    if not doc: raise HTTPException(status_code=404, detail="Not found")
    return doc

@api_router.get("/space/event/{item_id}")
async def get_space_event_by_id(item_id: str):
    doc = await db.space_content.find_one({"id": item_id}, {"_id": 0})
    if not doc: raise HTTPException(status_code=404, detail="Not found")
    return doc

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await seed_db()
    try:
        await db.timeline_events.update_many({}, {"$unset": {"icon": ""}})
    except Exception:
        pass

@app.on_event("shutdown")
async def shutdown():
    client.close()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import os

from app.api.routes import router

app = FastAPI(
    title="MarsAtlas Geospatial Engine",
    description="Planetary GIS & EVA Decision-Support Backend for NASA Space Apps Challenge 2026",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
def root_status():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>MarsAtlas Geospatial Engine • NASA Space Apps 2026</title>
        <style>
            body {
                background: #04070D;
                color: #F1F5F9;
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
            }
            .card {
                background: #0A0F1D;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 16px;
                padding: 36px;
                max-width: 620px;
                box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(243, 108, 61, 0.1);
            }
            .badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(52, 211, 153, 0.12);
                color: #34D399;
                border: 1px solid rgba(52, 211, 153, 0.3);
                padding: 5px 12px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.05em;
            }
            .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #34D399;
            }
            h1 {
                color: #FFFFFF;
                font-size: 22px;
                margin: 18px 0 10px 0;
                font-family: sans-serif;
                font-weight: 800;
                letter-spacing: -0.02em;
            }
            h1 span {
                color: #F36C3D;
            }
            p {
                color: #94A3B8;
                font-size: 13px;
                line-height: 1.6;
                margin: 0 0 24px 0;
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                background: #070B14;
                padding: 16px;
                border-radius: 10px;
                border: 1px solid rgba(255,255,255,0.06);
                margin-bottom: 24px;
                font-size: 11px;
            }
            .stat-label { color: #64748B; display: block; margin-bottom: 2px; }
            .stat-val { color: #38BDF8; font-weight: bold; }
            .links {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.08);
                padding-top: 20px;
            }
            .btn {
                background: #F36C3D;
                color: #FFFFFF;
                text-decoration: none;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 12px;
                font-weight: bold;
                transition: opacity 0.2s;
            }
            .btn-outline {
                background: rgba(56, 189, 248, 0.1);
                color: #38BDF8;
                border: 1px solid rgba(56, 189, 248, 0.3);
            }
            .btn:hover { opacity: 0.9; }
        </style>
    </head>
    <body>
        <div class="card">
            <span class="badge"><span class="dot"></span>FASTAPI GEOSPATIAL ENGINE ONLINE</span>
            <h1>MARS<span>ATLAS</span> BACKEND API</h1>
            <p>Planetary GIS, Horn&apos;s metric slope gradient, and NASA JSC Crew State &amp; Risk Model (CSRM) A* traverse optimization server for the NASA Space Apps Challenge 2026.</p>
            <div class="stats">
                <div><span class="stat-label">PRIMARY TARGET:</span><span class="stat-val">Jezero Crater (18.44°N, 77.45°E)</span></div>
                <div><span class="stat-label">ELEVATION MODEL:</span><span class="stat-val">USGS 1m HiRISE DTM</span></div>
                <div><span class="stat-label">METABOLIC WORKLOAD:</span><span class="stat-val">Pandolf-Santee (G=0.376)</span></div>
                <div><span class="stat-label">RAD DOSIMETRY:</span><span class="stat-val">0.560 mSv/sol (MSL RAD)</span></div>
            </div>
            <div class="links">
                <a class="btn" href="https://mars-atlas-nasa.vercel.app">Launch Frontend Console &rarr;</a>
                <a class="btn btn-outline" href="/docs">Swagger API Docs &rarr;</a>
                <a class="btn btn-outline" href="/api/health">Health Check &rarr;</a>
            </div>
        </div>
    </body>
    </html>
    """

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)

# Contributing to MarsAtlas

Thank you for your interest in contributing to **MarsAtlas**! MarsAtlas is an open-source planetary geospatial intelligence and EVA mission-planning prototype developed for the **NASA International Space Apps Challenge 2026** (*Interplanetary Survival Guide: Martian Map*).

---

## 1. Core Principles & Golden Rules

1. **Epistemic Rigor & Transparency:** Always distinguish between real spacecraft observations, derived calculations, prototype surrogate data, and illustrative models. Never label synthetic or surrogate data as certified NASA observations.
2. **Never Commit Secrets:** Do not commit API keys, personal tokens, private credentials, or live `.env` files. Always use `.env.example` templates with safe placeholders.
3. **Never Commit Large Orbital Rasters:** Multi-gigabyte raw GeoTIFF files (such as the 1.8 GB HiRISE DTM mosaic) must not be committed to Git. Active processed grids are hosted under `data/processed/`.
4. **Document Accurate Status:** If a feature is conceptual or planned, document it as such. Do not document unintegrated external layers as operational.
5. **Verify Tests Before Pushing:** Always execute the backend test suite (`pytest`) before proposing changes.

---

## 2. Development Workflow

### Backend Setup (FastAPI + Python 3.12)
```bash
cd backend
python -m venv .venv
# Activate virtual environment:
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Run automated tests
python -m pytest tests/test_geospatial_engine.py -v

# Run local development server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API docs are available at `http://127.0.0.1:8000/docs`.

### Frontend Setup (Next.js 16 + React 19 + TypeScript)
```bash
cd frontend
npm install

# Type-check and production build check
npm run build

# Start development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 3. Epistemic Classification Tiers

When adding new data layers or analytical models, contributors must classify them according to one of the following four tiers:

* **Tier 1 — Measured Spacecraft Observations:** Raw or calibrated telemetry from spacecraft instruments (e.g., NASA-AMMOS MMGIS rover waypoints, Mars 2020 raw imagery, MEDA weather publications).
* **Tier 2 — Derived Computational Estimates:** Topographic derivatives computed using validated numerical algorithms (e.g., Horn's $3 \times 3$ slope gradient $\theta$, local elevation standard deviation roughness $\sigma_z$).
* **Tier 3 — Explicit Modeling Assumptions:** Parametric bioenergetic models, spacesuit mass assumptions ($W=75\text{kg}, L=85\text{kg}$), or empirical terrain impedance functions ($\eta$).
* **Tier 4 — Hypothetical Mission Simulations:** Multi-criteria A* path trajectories, comparative trade-off scorecards, and automated Flight Director briefings.

---

## 4. Commit Message Convention

Follow standard Conventional Commits:
* `feat:` A new user-facing capability or dataset integration
* `fix:` A bug fix in pathfinding, geodesy, or UI components
* `docs:` Documentation updates or scientific disclosures
* `test:` Adding or refining verification test suites
* `chore:` Dependency maintenance or configuration updates

---

## 5. Code of Conduct

All contributors and community members are expected to maintain a professional, respectful, collaborative, and scientifically honest environment.

**Explore Mars. Understand Terrain. Plan Every Traverse.** 🔴

# Contributing to MarsAtlas

Thank you for your interest in contributing to **MarsAtlas**! MarsAtlas is an open-source planetary geospatial intelligence and EVA mission-planning platform developed for the **NASA International Space Apps Challenge 2026** (*Interplanetary Survival Guide: Martian Map*).

---

## 1. Repository Standards & Golden Rules

1. **Clean & Modular Structure**: Keep frontend, backend, data, and docs cleanly decoupled.
2. **Never Commit Secrets**: Do not commit API keys, credentials, tokens, or private environment files (`.env`). Use `.env.example`.
3. **Never Commit Large Raw Datasets**: Raw multi-gigabyte orbital rasters (such as the 1.8 GB HiRISE DTM GeoTIFF) must not be pushed to GitHub. Processed, compressed `.npz` arrays (<25 MB) and lightweight GeoJSONs are hosted or cached under `data/processed/`.
4. **Epistemic Rigor**: Maintain strict separation between verified spacecraft measurements (Tier 1), derived computational estimates (Tier 2), modeling assumptions (Tier 3), and hypothetical simulations (Tier 4). Never mark a simulated calculation as certified NASA data.
5. **Test Before Committing**: Run both frontend and backend validation suites before pushing changes.

---

## 2. Development Workflow

### Backend (FastAPI + Python 3.12)
```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest tests/test_geospatial_engine.py -v
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (Next.js 16 + React 19 + TypeScript)
```bash
cd frontend
npm install
npm run build   # Type-checking and production bundle validation
npm run dev     # Local development server
```

---

## 3. Commit Message Convention

Follow standard Conventional Commits:
- `feat:` for a new user-facing capability or dataset integration
- `fix:` for a bug fix in pathfinding or projection rendering
- `docs:` for documentation updates
- `test:` for adding or modifying verification tests
- `chore:` for dependency updates or build configuration

---

## 4. Code of Conduct

All contributors are expected to uphold a respectful, collaborative, and inclusive scientific environment.

**Explore Mars. Understand Terrain. Plan Every Traverse.** 🔴

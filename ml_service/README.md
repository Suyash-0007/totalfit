# TotalFit ML Service (FastAPI)

## Setup

```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Endpoints

- POST `/predict-injury`
- POST `/analyze-performance`
- POST `/generate-plan`
- GET `/health`

All POST endpoints accept JSON bodies and return mocked responses suitable for development. Later we can replace the logic with Vertex AI calls.



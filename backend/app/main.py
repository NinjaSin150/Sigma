from fastapi import FastAPI
from .routes import projects, jobs

app = FastAPI(title="Guard API", version="0.1.0")

app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "guard-api"}

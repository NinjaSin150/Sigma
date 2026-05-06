from math import ceil
from uuid import uuid4
from fastapi import APIRouter, HTTPException
from ..models.schemas import JobCreate, Job

router = APIRouter()
JOBS: dict[str, Job] = {}
CLIP_SECONDS = 10


@router.post("", response_model=Job)
def create_job(payload: JobCreate) -> Job:
    chunks = ceil(payload.duration_seconds / CLIP_SECONDS)
    jid = str(uuid4())
    job = Job(
        id=jid,
        project_id=payload.project_id,
        prompt=payload.prompt,
        duration_seconds=payload.duration_seconds,
        mode=payload.mode,
        status="queued",
        chunks_total=chunks,
        chunks_done=0,
        download_url=None,
    )
    JOBS[jid] = job
    return job


@router.get("/{job_id}", response_model=Job)
def get_job(job_id: str) -> Job:
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

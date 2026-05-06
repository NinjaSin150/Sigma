from pydantic import BaseModel, Field
from typing import Literal


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str | None = None


class Project(BaseModel):
    id: str
    name: str
    description: str | None = None


class JobCreate(BaseModel):
    project_id: str
    prompt: str
    duration_seconds: int = Field(ge=5, le=1020, description="Max 17 minutes")
    mode: Literal["text_to_video", "image_to_video"] = "text_to_video"


class Job(BaseModel):
    id: str
    project_id: str
    prompt: str
    duration_seconds: int
    mode: str
    status: Literal["queued", "rendering", "stitching", "completed", "failed"]
    chunks_total: int
    chunks_done: int
    download_url: str | None = None

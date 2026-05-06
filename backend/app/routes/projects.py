from fastapi import APIRouter
from uuid import uuid4
from ..models.schemas import ProjectCreate, Project

router = APIRouter()
PROJECTS: dict[str, Project] = {}


@router.post("", response_model=Project)
def create_project(payload: ProjectCreate) -> Project:
    pid = str(uuid4())
    project = Project(id=pid, name=payload.name, description=payload.description)
    PROJECTS[pid] = project
    return project


@router.get("", response_model=list[Project])
def list_projects() -> list[Project]:
    return list(PROJECTS.values())

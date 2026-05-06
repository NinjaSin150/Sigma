from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


def test_health() -> None:
    r = client.get('/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'ok'


def test_project_and_job_flow() -> None:
    p = client.post('/projects', json={'name': 'Demo Project'})
    assert p.status_code == 200
    project = p.json()
    assert 'id' in project

    j = client.post(
        '/jobs',
        json={
            'project_id': project['id'],
            'prompt': 'A knight walking through fog',
            'duration_seconds': 120,
            'mode': 'text_to_video',
        },
    )
    assert j.status_code == 200
    job = j.json()
    assert job['chunks_total'] == 12
    assert job['status'] == 'queued'

    g = client.get(f"/jobs/{job['id']}")
    assert g.status_code == 200
    assert g.json()['id'] == job['id']


def test_duration_bounds() -> None:
    low = client.post(
        '/jobs',
        json={
            'project_id': 'p',
            'prompt': 'x',
            'duration_seconds': 4,
            'mode': 'text_to_video',
        },
    )
    assert low.status_code == 422

    high = client.post(
        '/jobs',
        json={
            'project_id': 'p',
            'prompt': 'x',
            'duration_seconds': 1021,
            'mode': 'text_to_video',
        },
    )
    assert high.status_code == 422

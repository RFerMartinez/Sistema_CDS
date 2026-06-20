# tests/conftest.py
import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
from src.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def admin_token(client):
    login_payload = {
        "username": "davorcristoff04@gmail.com",
        "password": "45104930_Davor"
    }
    response = client.post("/auth/login", data=login_payload)
    assert response.status_code == 200, f"Fallo el login del Administrador: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def empleado_token(client):
    login_payload = {
        "username": "34568237",
        "password": "Joseabito26"
    }
    response = client.post("/auth/login", data=login_payload)
    assert response.status_code == 200, f"Fallo el login del Empleado: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture(scope="function")
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

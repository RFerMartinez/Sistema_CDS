import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from src.main import app
from src.core.session import get_db

# Mock para simular conexión a DB en pruebas
async def override_get_db():
    # En un entorno real, aquí inicializamos asyncpg.connect('.../test_db')
    # Simularemos un objeto de conexión para el ejemplo
    class MockConnection:
        async def fetchval(self, query, *args): return True
        async def execute(self, query, *args): return "UPDATE 1"
        async def fetch(self, query, *args): return []
    
    yield MockConnection()

app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture
async def async_client():
    """Cliente asíncrono para consumir los endpoints de FastAPI"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        yield client


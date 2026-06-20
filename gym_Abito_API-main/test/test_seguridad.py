import pytest
from httpx import AsyncClient
from src.main import app

@pytest.mark.asyncio
async def test_acceso_denegado_sin_token_valido(async_client: AsyncClient):
    """
    Validar que la capa de seguridad (OAuth2PasswordBearer) rechace la petición
    inmediatamente si no se envía un token de autenticación en los headers.
    """

    response = await async_client.put(
        "/cuotas/1",
        json={"pagada": True, "monto": 5000, "mes": "Enero", "idFacturacion": None}
    )

    esperado = 401
    print(f"\n[Seguridad] Acceso denegado sin token válido")
    print(f"  HTTP esperado: {esperado}")
    print(f"  HTTP obtenido: {response.status_code}")
    print(f"  Respuesta: {response.json()}")

    assert response.status_code == esperado
    assert response.json()["detail"] == "Not authenticated"

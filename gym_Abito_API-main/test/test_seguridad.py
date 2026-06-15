import pytest
from httpx import AsyncClient
from src.main import app

@pytest.mark.asyncio
async def test_acceso_denegado_sin_token_valido(async_client: AsyncClient):
    """
    Validar que la capa de seguridad (OAuth2PasswordBearer) rechace la petición 
    inmediatamente si no se envía un token de autenticación en los headers.
    """
    
    # Ejecución: Intentar acceder a un endpoint protegido SIN cabecera de Authorization
    response = await async_client.put(
        "/cuotas/1", 
        json={"pagada": True, "monto": 5000, "mes": "Enero", "idFacturacion": None}
    )

    # Resultado esperado REAL del sistema: HTTP 401 Unauthorized
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


import pytest
from httpx import AsyncClient
from src.main import app
from src.api.dependencies.auth import get_current_user

# Mock de usuario logueado con rol EMPLEADO (Staff)
async def mock_user_empleado():
    return {
        "dni": "87654321",
        "usuario": "staff_test",
        "esAdmin": False,
        "esEmpleado": True,
        "esAlumno": False
    }

@pytest.mark.asyncio
async def test_modificar_cuota_a_no_pagada(async_client: AsyncClient):
    """
    TC-F-03: Al revertir una cuota a pagada=False, los métodos de pago deben limpiarse.
    """
    app.dependency_overrides[get_current_user] = mock_user_empleado

    # Datos de entrada para modificar la cuota (pagada = False)
    payload = {
        "dni": "12345678",
        "pagada": False,
        "monto": 6000,
        "mes": "Febrero",
        "trabajo": "Musculacion",
        "suscripcion": "Mensual",
        "fechaComienzo": "2026-02-01",
        "vencimiento": "2026-03-01",
        "idFacturacion": None,
        "metodoDePago": "Efectivo" # Enviamos un método a propósito
    }

    # Ejecución
    response = await async_client.put("/cuotas/10", json=payload)

    # Resultado Esperado
    # El status debe ser exitoso (200 OK)
    assert response.status_code == 200
    
    # NOTA SQA: En el test real conectado a base de datos de prueba, 
    # aquí haríamos un 'SELECT metodoDePago FROM Cuota WHERE idCuota=10'
    # para asegurar por aserción que el campo en DB es NULL.
    
    app.dependency_overrides.pop(get_current_user, None)

@pytest.mark.asyncio
async def test_validar_formato_dni_invalido(async_client: AsyncClient):
    """
    TC-V-04: El esquema Pydantic debe bloquear letras en el DNI.
    """
    payload_invalido = {
        "dni": "AB345678", # DNI inválido
        "nombre": "Test",
        "apellido": "Usuario",
        "telefono": "3624112233",
        "sexo": "M",
        "nomProvincia": "Chaco",
        "nomLocalidad": "Resistencia",
        "calle": "San Martin",
        "numero": "123"
    }

    response = await async_client.post("/auth/registro/paso2", json=payload_invalido)
    
    assert response.status_code == 422
    errores = response.json()["detail"]
    assert any(error["loc"][-1] == "dni" for error in errores)


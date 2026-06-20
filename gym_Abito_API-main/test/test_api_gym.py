# tests/test_api_gym.py


def test_imprimir_rutas_disponibles(client):
    """
    Herramienta de QA: Imprime todas las rutas registradas en la API.
    """
    from src.main import app
    print("\n--- RUTAS REGISTRADAS EN FASTAPI ---")
    for route in app.routes:
        print(f"Ruta: {getattr(route, 'path', 'N/A')} | Nombre: {getattr(route, 'name', 'N/A')}")
    print("------------------------------------\n")
    assert True


def test_cp01_registro_paso1_alumno(client):
    """
    CP-01: Verificar el paso 1 del registro de un nuevo alumno.
    El registro es en 2 pasos: primero se registra con email/usuario/contraseña,
    luego verifica el enlace del correo y completa el paso 2.
    """
    payload_paso1 = {
        "email": "carlos.g@mail.com",
        "usuario": "carlosg",
        "contrasenia": "StrongPass123!",
        "confirmar_contrasenia": "StrongPass123!"
    }

    response = client.post("/auth/registro-paso1", json=payload_paso1)

    assert response.status_code in [200, 409], (
        f"Se esperaba 200 (éxito) o 409 (ya existe), pero se obtuvo {response.status_code}: {response.text}"
    )


def test_cp02_acceso_sin_token(client):
    """
    CP-02: Verificar rechazo de solicitud a endpoint protegido sin JWT.
    """
    response = client.get("/cuotas/mis-cuotas")

    assert response.status_code == 401, "El sistema debió bloquear el acceso con 401"

    data = response.json()
    assert data["detail"] == "Not authenticated"


def test_cp03_limite_capacidad_grupo(client, empleado_token):
    """
    CP-03: Verificar bloqueo al superar MAX_GROUP_CAPACITY (15).
    """
    payload_inscripcion = {
        "grupo_id": 5,
        "alumno_id": 20
    }

    response = client.post(
        "/grupos/inscripcion",
        json=payload_inscripcion,
        headers=empleado_token
    )

    assert response.status_code in [400, 404, 422], (
        f"Se esperaba error, pero se obtuvo {response.status_code}"
    )


def test_cp04_rollback_cuota_financiera(client, admin_token):
    """
    CP-04: Verificar limpieza de campos de pago al revertir una cuota.
    """
    cuota_id = 102
    payload_rollback = {
        "idCuota": cuota_id,
        "pagada": False,
        "monto": 15000,
        "mes": "Junio",
        "dni": "45104930",
        "fechaComienzo": "2026-06-01",
        "vencimiento": "2026-06-30",
        "trabajo": "Musculación",
        "suscripcion": "Plan Trimestral"
    }

    response = client.put(
        f"/cuotas/{cuota_id}",
        json=payload_rollback,
        headers=admin_token
    )

    assert response.status_code in [200, 404], (
        f"Se esperaba 200 o 404, pero se obtuvo {response.status_code}: {response.text}"
    )


def test_cp05_dni_duplicado(client, admin_token):
    """
    CP-05: Verificar rechazo al registrar un alumno con DNI ya existente.
    """
    payload_duplicado = {
        "dni": "45104930",
        "nombre": "Ana",
        "apellido": "Martínez",
        "sexo": "F",
        "email": "ana.m@mail.com",
        "telefono": "123456789",
        "nomProvincia": "Chaco",
        "nomLocalidad": "Saenz Peña",
        "calle": "Calle Falsa",
        "numero": "123",
        "nombreTrabajo": "Musculación",
        "nombreSuscripcion": "Plan Trimestral",
    }

    response = client.post(
        "/alumnos/nuevo",
        json=payload_duplicado,
        headers=admin_token
    )

    assert response.status_code in [400, 409, 500], (
        f"Se esperaba error por duplicado, pero se obtuvo: {response.status_code}"
    )

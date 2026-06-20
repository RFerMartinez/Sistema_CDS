import pytest
import pytest_asyncio
from datetime import date

try:
    import asyncpg
    HAS_ASYNCPG = True
except ImportError:
    HAS_ASYNCPG = False

from src.services.cuotaServices import generar_cuotas_masivas_mensuales


@pytest_asyncio.fixture(scope="function")
async def db_conn():
    """
    Fixture que conecta directamente a la BD de pruebas.
    Ajustá la DSN según tu entorno local.
    """
    if not HAS_ASYNCPG:
        pytest.skip("asyncpg no disponible")

    try:
        conn = await asyncpg.connect(
            host="localhost",
            port=5432,
            user="postgres",
            password="FerBD42276",
            database="db_gym_test"
        )
    except Exception as e:
        pytest.skip(f"No se pudo conectar a la BD de pruebas: {e}")

    yield conn
    await conn.close()


@pytest.mark.asyncio
async def test_tc_f_01_generacion_masiva_cuotas_mensuales(db_conn, mocker):
    """
    ID: TC-F-01
    Descripción: Validar la generación masiva de cuotas para alumnos activos.
    Tipo: Prueba de Integración (Requiere BD de pruebas).
    """
    mock_date = mocker.patch("src.services.cuotaServices.date")
    mock_date.today.return_value = date(2026, 6, 5)

    await db_conn.execute("""
        INSERT INTO "Persona" (dni, nombre, apellido, telefono, sexo)
        VALUES
            ('11111111', 'Alumno', 'Uno', '3624111111', 'M'),
            ('22222222', 'Alumno', 'Dos', '3624222222', 'F')
        ON CONFLICT (dni) DO NOTHING;

        INSERT INTO "Suscripcion" ("nombreSuscripcion", precio)
        VALUES ('Pase Libre', 15000)
        ON CONFLICT ("nombreSuscripcion") DO NOTHING;

        INSERT INTO "Trabajo" ("nombreTrabajo")
        VALUES ('Funcional')
        ON CONFLICT ("nombreTrabajo") DO NOTHING;

        INSERT INTO "Alumno" (dni, "nombreSuscripcion", "nombreTrabajo")
        VALUES
            ('11111111', 'Pase Libre', 'Funcional'),
            ('22222222', 'Pase Libre', 'Funcional')
        ON CONFLICT (dni) DO NOTHING;

        INSERT INTO "AlumnoActivo" (dni)
        VALUES ('11111111'), ('22222222')
        ON CONFLICT (dni) DO NOTHING;
    """)

    filas_insertadas = await generar_cuotas_masivas_mensuales(db_conn)

    assert filas_insertadas >= 2, f"Se esperaban al menos 2 inserciones, se insertaron {filas_insertadas}"

    cuotas_generadas = await db_conn.fetch("""
        SELECT "idCuota", pagada, titular
        FROM "Cuota"
        WHERE mes = 'Junio' AND EXTRACT(YEAR FROM "fechaFin") = 2026
    """)

    assert len(cuotas_generadas) >= 2, "No se encontraron las cuotas generadas en la BD."

    for cuota in cuotas_generadas:
        assert cuota["pagada"] is False, f"La cuota {cuota['idCuota']} se generó como pagada."
        assert cuota["titular"] is not None, f"La cuota {cuota['idCuota']} no tiene titular."

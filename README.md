# WHOIS Domains API

API para verificar si un dominio está disponible para registro o si ya está registrado.

## Descripción

Esta herramienta proporciona una API REST que permite consultar la disponibilidad de dominios utilizando el protocolo WHOIS. La API devuelve información sobre si un dominio está disponible para registro o si ya está registrado, junto con los datos completos de WHOIS.

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/yourusername/whois-domains.git
cd whois-domains
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto (o modificar el existente)
   - Definir el puerto (por defecto es 3000):
   ```
   PORT=3000
   ```

## Uso

### Iniciar el servidor

```bash
# Modo producción
npm start

# Modo desarrollo (con recarga automática)
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Endpoints de la API

#### Verificar disponibilidad de dominio

```
GET /api/check?domain=example.com
```

Parámetros:
- `domain` (requerido): El nombre de dominio a verificar (ej: example.com)

Respuesta exitosa (200 OK):
```json
{
  "domain": "example.com",
  "available": false,
  "whoisData": "... datos completos del WHOIS ..."
}
```

Respuesta de error (400 Bad Request):
```json
{
  "error": "Invalid domain format",
  "available": null
}
```

## Ejemplos

### Consultar disponibilidad de un dominio

```bash
curl "http://localhost:3000/api/check?domain=example.com"
```

### Script de prueba

El proyecto incluye un script de prueba (`test.js`) que demuestra cómo usar la API programáticamente:

```bash
# Instalar dependencias si aún no lo has hecho
npm install

# Asegúrate de que el servidor esté en ejecución en otra terminal
npm start

# En una nueva terminal, ejecuta el script de prueba
node test.js
```

El script de prueba verifica varios dominios y muestra los resultados en la consola.

## Tecnologías utilizadas

- Node.js
- Express.js
- WHOIS (protocolo)

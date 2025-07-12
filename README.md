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
   - Definir las siguientes variables:
   ```
   PORT=3000
   JWT_SECRET=your_super_secret_key_for_whois_api
   API_TOKEN=your_api_key_for_authentication
   ```

## Uso

### Autenticación

La API está protegida con autenticación mediante token Bearer. Para utilizar la API, debes:

1. Obtener un token de autenticación enviando tu API key al endpoint `/api/token`
2. Incluir el token en el encabezado `Authorization` de tus solicitudes con el formato `Bearer <token>`

#### Obtener un token de autenticación

```bash
curl -X POST http://localhost:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your_api_key_for_authentication"}'
```

Respuesta exitosa (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Este token es válido por 24 horas.

### Iniciar el servidor

```bash
# Modo producción
npm start

# Modo desarrollo (con recarga automática)
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Endpoints de la API

#### Obtener token de autenticación

```
POST /api/token
```

Cuerpo de la solicitud (JSON):
```json
{
  "apiKey": "your_api_key_for_authentication"
}
```

Respuesta exitosa (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Verificar disponibilidad de dominio

```
GET /api/check?domain=example.com
```

Encabezados:
- `Authorization` (requerido): Bearer token obtenido de `/api/token`

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

Primero, obtén un token de autenticación:

```bash
curl -X POST http://localhost:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "your_api_key_for_authentication"}'
```

Luego, usa el token para consultar la disponibilidad del dominio:

```bash
curl "http://localhost:3000/api/check?domain=example.com" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Script de prueba

El proyecto incluye un script de prueba (`test.js`) que demuestra cómo usar la API programáticamente, incluyendo el proceso de autenticación:

```bash
# Instalar dependencias si aún no lo has hecho
npm install

# Asegúrate de que el servidor esté en ejecución en otra terminal
npm start

# En una nueva terminal, ejecuta el script de prueba
node test.js
```

El script de prueba:
1. Obtiene un token de autenticación usando la API key
2. Utiliza el token para realizar consultas autenticadas
3. Verifica varios dominios y muestra los resultados en la consola

El script utiliza la variable de entorno `API_TOKEN` o un valor predeterminado para la autenticación.

## Tecnologías utilizadas

- Node.js
- Express.js
- WHOIS (protocolo)
- JWT (JSON Web Tokens) para autenticación

## Guía para usar la API con Postman

### Obtener un token de autenticación

1. Abre Postman y crea una nueva solicitud
2. Configura la solicitud:
   - Método: **POST**
   - URL: `http://localhost:3000/api/token`
   - En la pestaña "Headers", añade:
     - Key: `Content-Type`
     - Value: `application/json`
   - En la pestaña "Body":
     - Selecciona "raw"
     - Selecciona "JSON" en el menú desplegable
     - Ingresa el siguiente JSON:
     ```json
     {
       "apiKey": "example_api_token_for_testing"
     }
     ```
     > **Importante**: Debes usar exactamente el mismo valor de API key que está configurado en el archivo `.env` del servidor. El valor predeterminado es `example_api_token_for_testing`.

3. Haz clic en "Send" para enviar la solicitud
4. Si la API key es correcta, recibirás una respuesta con un token JWT
   > **Nota**: Este token es válido por 24 horas. Después de este período, necesitarás obtener un nuevo token.

### Usar el token para consultar dominios

1. Crea una nueva solicitud en Postman
2. Configura la solicitud:
   - Método: **GET**
   - URL: `http://localhost:3000/api/check?domain=example.com`
   - En la pestaña "Headers", añade:
     - Key: `Authorization`
     - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (reemplaza con tu token obtenido en el paso anterior)

3. Haz clic en "Send" para enviar la solicitud
4. Deberías recibir la información sobre la disponibilidad del dominio

### Solución de problemas

#### Error "Invalid API key"

Si recibes el error "Invalid API key", verifica lo siguiente:

1. Asegúrate de que estás enviando la solicitud al endpoint correcto: `/api/token`
2. Verifica que estás usando el método HTTP correcto: `POST`
3. Comprueba que has configurado el header `Content-Type: application/json`
4. Asegúrate de que el cuerpo de la solicitud contiene el JSON correcto:
   ```json
   {
     "apiKey": "example_api_token_for_testing"
   }
   ```
5. Confirma que el valor de `apiKey` coincide exactamente con el valor configurado en el archivo `.env` del servidor
6. Si has modificado el valor en el archivo `.env`, asegúrate de reiniciar el servidor para que los cambios surtan efecto

#### Error "Invalid or expired token"

Si recibes el error "Invalid or expired token", puede deberse a lo siguiente:

1. El token ha expirado (después de 24 horas de su emisión)
2. El token ha sido modificado o está mal formateado
3. Estás usando un token que fue generado con una clave secreta diferente

Solución:
1. Obtén un nuevo token de autenticación haciendo una solicitud POST a `/api/token`
2. Asegúrate de incluir el token completo en el header de autorización, con el formato `Bearer <token>`
3. Verifica que el token no haya sido truncado o modificado al copiarlo

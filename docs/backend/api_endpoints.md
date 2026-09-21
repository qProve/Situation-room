# Api Endpoints
Api endpoints provided by *Situation room* backend.

All endpoints start with **/api**.

| **Group** | **Endpoint** | **Body** | **On Success** | **Middleware** |
| --- | --- | --- | --- | --- |
| Auth | `/api/auth/register` | `username* (string), password* (string)` | Status: 201 | `authRateLimit` |
| Auth | `/api/auth/login` | `username* (string), password* (string)` | JWT token | `authRateLimit` |
| Events | `/api/events/eonet` | - | `data (json)` | - |
| Events | `/api/events/usgs` | - | `data (json)` | - |
| Events | `/api/events/opensky` | - | `data (json)` | - |
| Events | `/api/events/trainstracking` | - | `data (json)` | - |
| User | - | - | - | - |
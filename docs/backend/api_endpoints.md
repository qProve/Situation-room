# Api Endpoints
Api endpoints provided by *Situation room* backend.

All endpoints start with **/api**.

### Auth Group (/auth):
1) **/register**
    - Body:
      - username* - string
      - password* - string
    - On success:
      - status 201
    - Middleware:
      - authRateLimit
2) **/login**
    - Body:
      - username* - string
      - password* - string
    - On success:
      - JWT token
    - Middleware:
      - authRateLimit

### User Group (/user):

### Events Group (/events):
1) **/nasa**
    - On success:
      - data - json
2) **/usgs**
   - On success:
      - data - json
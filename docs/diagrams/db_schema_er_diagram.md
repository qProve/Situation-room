```mermaid
---
title: Database schema
---
erDiagram
    User {
        int id PK
        string username UK
        string password
    }

    GeoPoint {
        int id PK
        PointType point_type
        float longitude
        float latitude
        json metadata
    }
```
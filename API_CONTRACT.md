# **General**

- Base path: /api
- Content type: application/json; charset=utf-8
- Unified error format: 

```json
{"error": "human-readable message", "code": "OPTIONAL_ERROR_CODE"}
```

## Health Check

`GET /api/health`

200 OK

```json
{ "ok": true}
```

## Extract Requirements

`Post /api/extract`

Extracts **AppName, Entities, Roles, Features** from natural language description and stores the record.

### Request:

```json
{
  "description": "I want an app to manage student courses and grades. Teachers add courses, students enrol, and admins manage reports."
}
```

**Validation:**

`description`: string, minimum length 5

### Responses

- 201 Created

```json
{
  "_id": "6730f5b0c7f3e1a2b3456789",
  "rawDescription": "I want an app to manage student courses and grades...",
  "aiParsed": {
    "appName": "Course Manager",
    "entities": ["Student", "Course", "Grade"],
    "roles": ["Teacher", "Student", "Admin"],
    "features": ["Add course", "Enrol students", "View reports"]
  },
  "meta": {
    "createdAt": "2025-09-18T01:23:45.000Z",
    "model": "gpt-4o-mini",
    "promptVersion": "v1",
    "source": "web_form"
  }
}
```

- 400 Bad Request

```json
{ "error": "description is required (>=5 chars)" }
```

- 502 Bad Gateway (Ai service issue)

```json
{ "error": "AI service unavailable", "code": "AI_UPSTREAM" }
```

- 500 Internal Server Error

```json
{ "error": "Internal Server Error" }
```

## Get Single Requirement

`GET /api/requirements/:id`

Retrieve one requirement record by its `_id`

**Path Params**

`id`: string (Mongo ObjectId)

### Responses

- 200 OK

```json
{
  "_id": "6730f5b0c7f3e1a2b3456789",
  "rawDescription": "I want an app to manage student courses and grades...",
  "aiParsed": {
    "appName": "Course Manager",
    "entities": ["Student", "Course", "Grade"],
    "roles": ["Teacher", "Student", "Admin"],
    "features": ["Add course", "Enrol students", "View reports"]
  },
  "meta": {
    "createdAt": "2025-09-18T01:23:45.000Z",
    "model": "gpt-4o-mini",
    "promptVersion": "v1",
    "source": "web_form"
  }
}
```

- 404 Not Found

```json
{ "error": "not found" }
```

## List Requirements

`GET /api/requirements?limit=10&offset=0`

Returned a paginated list of extracted requirements.

**Query Params**

`limit`: number (1-50, default 10)

`offset`: number (default 0)

### Responses

200 OK

```json
{
  "items": [
    {
      "_id": "6730f5b0c7f3e1a2b3456789",
      "aiParsed": {
        "appName": "Course Manager",
        "entities": ["Student","Course","Grade"],
        "roles": ["Teacher","Student","Admin"],
        "features": ["Add course","Enrol students","View reports"]
      },
      "meta": { "createdAt": "2025-09-18T01:23:45.000Z" }
    }
  ],
  "total": 1
}
```




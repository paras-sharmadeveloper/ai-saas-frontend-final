# Tone, Voice Type & Voice API Documentation

Base URL: `http://localhost:8000/api`
Auth: All endpoints require `Authorization: Bearer {token}`

---

## 1. Tones API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tones` | List all tones |
| GET | `/api/tones/{id}` | Get single tone |
| POST | `/api/tones` | Create tone |
| PUT | `/api/tones/{id}` | Update tone |
| DELETE | `/api/tones/{id}` | Delete tone |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Tone name (e.g. Friendly) |
| description | string | No | Short description |

### Example — Create

```json
POST /api/tones
Authorization: Bearer {token}

{
  "name": "Friendly",
  "description": "Warm and approachable"
}
```

### Response `201`

```json
{
  "message": "Tone created",
  "data": {
    "id": 1,
    "name": "Friendly",
    "description": "Warm and approachable",
    "created_at": "2026-04-20T10:00:00.000000Z",
    "updated_at": "2026-04-20T10:00:00.000000Z"
  }
}
```

---

## 2. Voice Types API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/voice-types` | List all voice types (includes voices) |
| GET | `/api/voice-types/{id}` | Get single voice type (includes voices) |
| POST | `/api/voice-types` | Create voice type |
| PUT | `/api/voice-types/{id}` | Update voice type |
| DELETE | `/api/voice-types/{id}` | Delete voice type |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Voice type name (e.g. Female, Male) |

### Example — Create

```json
POST /api/voice-types
Authorization: Bearer {token}

{
  "name": "Female"
}
```

### Response `201`

```json
{
  "message": "Voice type created",
  "data": {
    "id": 1,
    "name": "Female",
    "voices": []
  }
}
```

---

## 3. Voices API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/voices` | List all voices (includes voice type) |
| GET | `/api/voices/{id}` | Get single voice (includes voice type) |
| POST | `/api/voices` | Create voice |
| PUT | `/api/voices/{id}` | Update voice |
| DELETE | `/api/voices/{id}` | Delete voice |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| voice_type_id | integer | Yes | ID from `voice_types` table |
| name | string | Yes | Voice name (e.g. Sarah) |
| style | string | No | Style description (e.g. American, warm) |
| audio_url | string | No | URL to audio preview file |

### Example — Create

```json
POST /api/voices
Authorization: Bearer {token}

{
  "voice_type_id": 1,
  "name": "Sarah",
  "style": "American, warm",
  "audio_url": "https://example.com/audio/sarah.mp3"
}
```

### Response `201`

```json
{
  "message": "Voice created",
  "data": {
    "id": 1,
    "voice_type_id": 1,
    "name": "Sarah",
    "style": "American, warm",
    "audio_url": "https://example.com/audio/sarah.mp3",
    "voice_type": {
      "id": 1,
      "name": "Female"
    }
  }
}
```

### Example — Update

```json
PUT /api/voices/1
Authorization: Bearer {token}

{
  "style": "British, professional"
}
```

### Example — Delete

```json
DELETE /api/voices/1
Authorization: Bearer {token}
```

### Response `200`

```json
{
  "message": "Voice deleted"
}
```


submit url 

# Agent API Documentation

Base URL: `http://localhost:8000/api`

---

## 1. Create Agent

**Endpoint:** `POST /agent/create`

**Auth:** Not required

**Description:** Creates an ElevenLabs AI agent, registers a webhook, and saves the client + prompt to the database.

### Request Body (JSON)

| Field           | Type   | Required | Description                          |
|----------------|--------|----------|--------------------------------------|
| company_name   | string | Yes      | Name of the company                  |
| business_type  | string | Yes      | Type of business (e.g. "retail")     |
| system_prompt  | string | Yes      | AI agent system prompt               |
| first_message  | string | No       | First message the agent will say     |
| language       | string | No       | Language code (default: `en`)        |

### Example Request

```json
POST /api/agent/create
Content-Type: application/json

{
  "company_name": "Acme Corp",
  "business_type": "E-commerce",
  "system_prompt": "You are a helpful sales assistant for Acme Corp.",
  "first_message": "Hello! How can I help you today?",
  "language": "en"
}
```

### Success Response `200 OK`

```json
{
  "success": true,
  "message": "Agent created successfully",
  "client": {
    "id": 1,
    "user_id": 1,
    "company_name": "Acme Corp",
    "business_type": "E-commerce",
    "elevenlabs_agent_id": "agent_abc123",
    "elevenlabs_agent_name": "Acme Corp Agent",
    "elevenlabs_webhook_id": "webhook_xyz456",
    "elevenlabs_webhook_secret": "secret_token",
    "is_active": true,
    "created_at": "2026-04-18T10:00:00.000000Z",
    "updated_at": "2026-04-18T10:00:00.000000Z"
  },
  "agent_id": "agent_abc123"
}
```

### Error Response `500`

```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 2. Update Agent Prompt

**Endpoint:** `PATCH /agent/{client}/prompt`

**Auth:** Not required

**Description:** Updates the system prompt of an existing ElevenLabs agent and syncs it in the database.

### URL Parameter

| Parameter | Type    | Description                        |
|----------|---------|------------------------------------|
| client   | integer | The `id` of the Client record in DB |

### Request Body (JSON)

| Field          | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| system_prompt | string | Yes      | New system prompt for the agent      |
| first_message | string | No       | Updated first message                |
| language      | string | No       | Language code (default: `en`)        |

### Example Request

```json
PATCH /api/agent/1/prompt
Content-Type: application/json

{
  "system_prompt": "You are an updated assistant for Acme Corp.",
  "first_message": "Hi there! What can I do for you?",
  "language": "en"
}
```

### Success Response `200 OK`

```json
{
  "success": true,
  "message": "Prompt updated successfully"
}
```

### Error Response `500`

```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 3. Tones API

**Auth:** Required (Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tones` | List all tones |
| GET | `/api/tones/{id}` | Get single tone |
| POST | `/api/tones` | Create tone |
| PUT | `/api/tones/{id}` | Update tone |
| DELETE | `/api/tones/{id}` | Delete tone |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Tone name (e.g. Friendly) |
| description | string | No | Short description |

### Example Request

```json
POST /api/tones
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Friendly",
  "description": "Warm and approachable"
}
```

### Success Response `201`

```json
{
  "message": "Tone created",
  "data": { "id": 1, "name": "Friendly", "description": "Warm and approachable" }
}
```

---

## 4. Languages API

**Auth:** Required (Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/languages` | List all languages |
| GET | `/api/languages/{id}` | Get single language |
| POST | `/api/languages` | Create language |
| PUT | `/api/languages/{id}` | Update language |
| DELETE | `/api/languages/{id}` | Delete language |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Language name (e.g. English) |

### Example Request

```json
POST /api/languages
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "English"
}
```

### Success Response `201`

```json
{
  "message": "Language created",
  "data": { "id": 1, "name": "English" }
}
```

---

## 5. Voice Types API

**Auth:** Required (Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/voice-types` | List all voice types (with voices) |
| GET | `/api/voice-types/{id}` | Get single voice type (with voices) |
| POST | `/api/voice-types` | Create voice type |
| PUT | `/api/voice-types/{id}` | Update voice type |
| DELETE | `/api/voice-types/{id}` | Delete voice type |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Voice type name (e.g. Female, Male) |

### Example Request

```json
POST /api/voice-types
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Female"
}
```

### Success Response `201`

```json
{
  "message": "Voice type created",
  "data": { "id": 1, "name": "Female", "voices": [] }
}
```

---

## 6. Voices API

**Auth:** Required (Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/voices` | List all voices (with voice type) |
| GET | `/api/voices/{id}` | Get single voice (with voice type) |
| POST | `/api/voices` | Create voice |
| PUT | `/api/voices/{id}` | Update voice |
| DELETE | `/api/voices/{id}` | Delete voice |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| voice_type_id | integer | Yes | ID from voice_types table |
| name | string | Yes | Voice name (e.g. Sarah) |
| style | string | No | Style description (e.g. American, warm) |
| audio_url | string | No | URL to audio preview |

### Example Request

```json
POST /api/voices
Authorization: Bearer {token}
Content-Type: application/json

{
  "voice_type_id": 1,
  "name": "Sarah",
  "style": "American, warm",
  "audio_url": "https://example.com/audio/sarah.mp3"
}
```

### Success Response `201`

```json
{
  "message": "Voice created",
  "data": {
    "id": 1,
    "voice_type_id": 1,
    "name": "Sarah",
    "style": "American, warm",
    "audio_url": "https://example.com/audio/sarah.mp3",
    "voice_type": { "id": 1, "name": "Female" }
  }
}
```

---

## 7. Services API

**Auth:** Required (Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List logged-in user's services |
| GET | `/api/services/{id}` | Get single service |
| POST | `/api/services` | Create service |
| PUT | `/api/services/{id}` | Update service |
| DELETE | `/api/services/{id}` | Delete service |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Service name (e.g. Customer Support) |
| description | string | No | What does this service involve |

### Example Request

```json
POST /api/services
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Customer Support",
  "description": "Handles all inbound customer queries"
}
```

### Success Response `201`

```json
{
  "message": "Service created",
  "data": { "id": 1, "user_id": 1, "name": "Customer Support", "description": "Handles all inbound customer queries" }
}
```

---

## 8. Agent Suggestions API

**Auth:** Required (Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suggestions` | List all suggestions |
| GET | `/api/suggestions/{id}` | Get single suggestion |
| POST | `/api/suggestions` | Create suggestion |
| PUT | `/api/suggestions/{id}` | Update suggestion |
| DELETE | `/api/suggestions/{id}` | Delete suggestion |

### Request Body (POST / PUT)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Suggestion title |
| tone | string | No | Tone name |
| language | string | No | Language code |
| voice_recording | string | No | File path or URL |
| style | string | No | Style label |
| url | string | No | Related URL |
| call_goal | string | No | Goal of the call |
| qualifying_questions | array | No | Array of question strings |
| escalation_triggers | array | No | Array of trigger strings |

### Example Request

```json
POST /api/suggestions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Lead Qualification",
  "tone": "Professional",
  "language": "en",
  "call_goal": "Qualify leads and schedule follow-up meetings",
  "qualifying_questions": ["What is your budget?", "What is your timeline?"],
  "escalation_triggers": ["High-value lead requesting demo"]
}
```

### Success Response `201`

```json
{
  "message": "Suggestion created",
  "data": { "id": 1, "title": "Lead Qualification", ... }
}
```

---

## 9. Phone Numbers API

**Auth:** Required (Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/phone-numbers/available` | Browse available Twilio numbers |
| POST | `/api/phone-numbers/buy` | Purchase a number |
| GET | `/api/phone-numbers` | List my purchased numbers |
| DELETE | `/api/phone-numbers/{id}` | Release a number |
| PATCH | `/api/phone-numbers/{id}/agent` | Assign/unassign agent to number |

### Browse Available Numbers Query Params

| Param | Type | Description |
|-------|------|-------------|
| country | string | ISO country code (default: US) |
| search | string | Search string |
| match | string | `contains` or `starts` (default: contains) |

### Buy Number Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone_number | string | Yes | Phone number to purchase |

### Assign Agent Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| agent_id | integer\|null | No | Agent ID to assign, null to unassign |

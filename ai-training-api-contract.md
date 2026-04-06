# AI Training API Contract

Base URL: `http://localhost:8080/admin/ai-training`

---

## Data Shape

```ts
// Full AI Training Config object
interface AITrainingConfig {
  id: string;                        // Unique identifier (returned by server)

  // Basic Info
  aiName: string;                    // e.g. "Vernal Assistant"
  greetingMessage: string;           // e.g. "Hi there! Welcome to Vernal."
  closingMessage: string;            // e.g. "Thanks for chatting! Have a great day."

  // Company Context
  companyDescription: string;        // e.g. "Vernal is an AI-powered voice agent platform."
  companyUrl: string;                // e.g. "https://vernal.com"
  servicesOffered: string;           // e.g. "AI voice agents, lead qualification..."
  targetAudience: string;            // e.g. "Small to medium businesses"

  // AI Behavior
  tone: "friendly" | "professional";
  goal: "lead" | "support" | "sales";
  responseStyle: "concise" | "detailed";

  // Qualifying Questions
  qualifyingQuestions: string[];     // e.g. ["What is your budget?", "When do you need this?"]

  // FAQ / Knowledge Base
  faqs: {
    question: string;
    answer: string;
  }[];

  // Advanced
  customInstructions: string;        // Free-form custom AI instructions
}
```

---

## CRUD Endpoints

| Method   | Endpoint                              | Description                        |
|----------|---------------------------------------|------------------------------------|
| GET      | `/admin/ai-training`                  | Fetch current AI training config   |
| POST     | `/admin/ai-training`                  | Create a new AI training config    |
| PUT      | `/admin/ai-training/:id`              | Update full config by ID           |
| PATCH    | `/admin/ai-training/:id`              | Partial update config by ID        |
| DELETE   | `/admin/ai-training/:id`              | Delete config by ID                |

---

## Request / Response Examples

### GET `/admin/ai-training`
**Response 200:**
```json
{
  "id": "abc123",
  "aiName": "Vernal Assistant",
  "greetingMessage": "Hi there! Welcome to Vernal. How can I help you today?",
  "closingMessage": "Thanks for chatting! Have a great day.",
  "companyDescription": "Vernal is an AI-powered voice agent platform.",
  "companyUrl": "https://vernal.com",
  "servicesOffered": "AI voice agents, lead qualification, customer support automation",
  "targetAudience": "Small to medium businesses",
  "tone": "friendly",
  "goal": "lead",
  "responseStyle": "concise",
  "qualifyingQuestions": ["What is your budget?", "When do you need this?"],
  "faqs": [
    { "question": "What are your hours?", "answer": "We're available 24/7." }
  ],
  "customInstructions": ""
}
```

### POST `/admin/ai-training`
**Request Body:** Full `AITrainingConfig` object (without `id`)
**Response 201:** Created config with `id`

### PUT `/admin/ai-training/:id`
**Request Body:** Full `AITrainingConfig` object
**Response 200:** Updated config

### PATCH `/admin/ai-training/:id`
**Request Body:** Partial fields only (e.g. `{ "tone": "professional" }`)
**Response 200:** Updated config

### DELETE `/admin/ai-training/:id`
**Response 204:** No content

---

## Error Responses

```json
{ "error": "Not Found", "message": "Config not found", "statusCode": 404 }
{ "error": "Bad Request", "message": "Validation failed", "statusCode": 400 }
{ "error": "Unauthorized", "message": "Token missing or invalid", "statusCode": 401 }
```

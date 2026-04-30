# Subscription Plans — Backend Reference

All plans must be accepted by `POST /api/stripe/create-payment-intent`.

## Request Payload

```json
{
  "plan": "<plan_id>",
  "billing_cycle": "<monthly | annual | test>"
}
```

---

## Plans

### 1. Starter
| Field          | Value                  |
|----------------|------------------------|
| `plan` (id)    | `starter`              |
| `billing_cycle`| `monthly` or `annual`  |
| Monthly Price  | $49 / month            |
| Annual Price   | $41.65 / month         |
| Currency       | USD                    |
| Features       | 200 minutes/month, Australian voice, Calendar sync, SMS follow-ups, Email support |

---

### 2. Growth *(Most Popular)*
| Field          | Value                  |
|----------------|------------------------|
| `plan` (id)    | `growth`               |
| `billing_cycle`| `monthly` or `annual`  |
| Monthly Price  | $129 / month           |
| Annual Price   | $109.65 / month        |
| Currency       | USD                    |
| Features       | 800 minutes/month, All Starter features, CRM integrations, Invoicing + quoting, Smart call routing, Priority support |

---

### 3. Scale
| Field          | Value                  |
|----------------|------------------------|
| `plan` (id)    | `scale`                |
| `billing_cycle`| `monthly` or `annual`  |
| Monthly Price  | $349 / month           |
| Annual Price   | $296.65 / month        |
| Currency       | USD                    |
| Features       | Unlimited minutes, All Growth features, Multi-location, Custom voice training, API access, Dedicated manager |

---

### 4. Free *(Test tab only)*
| Field          | Value                  |
|----------------|------------------------|
| `plan` (id)    | `free`                 |
| `billing_cycle`| `test`                 |
| Price          | ₹0 (no charge)         |
| Currency       | INR                    |
| Note           | No Stripe payment — activates directly via `/api/subscription/validate` |
| Features       | 1 AI Agent, 50 calls/month, Basic voice, Email support |

---

### 5. Test Rupee *(Test tab only)*
| Field          | Value                  |
|----------------|------------------------|
| `plan` (id)    | `test_rupee`           |
| `billing_cycle`| `test`                 |
| Price          | ₹1                     |
| Currency       | INR                    |
| Note           | Goes through Stripe — used for payment flow testing |
| Features       | Same as Starter, Test payment only, ₹1 INR charge |

---

## Summary Table

| plan_id      | billing_cycle         | Price       | Currency | Stripe? |
|--------------|-----------------------|-------------|----------|---------|
| `starter`    | `monthly`             | $49/mo      | USD      | Yes     |
| `starter`    | `annual`              | $41.65/mo   | USD      | Yes     |
| `growth`     | `monthly`             | $129/mo     | USD      | Yes     |
| `growth`     | `annual`              | $109.65/mo  | USD      | Yes     |
| `scale`      | `monthly`             | $349/mo     | USD      | Yes     |
| `scale`      | `annual`              | $296.65/mo  | USD      | Yes     |
| `free`       | `test`                | ₹0          | INR      | No      |
| `test_rupee` | `test`                | ₹1          | INR      | Yes     |

---

## Notes for Backend

- `free` plan skips Stripe entirely — frontend calls `POST /api/subscription/validate` directly with `{ plan: "free" }`.
- `test_rupee` must be a valid plan in the backend and accepted by `POST /api/stripe/create-payment-intent`.
- All other plans go through the normal Stripe payment intent flow.
- The `billing_cycle` field should be used to determine which Stripe Price ID to attach to the payment intent.

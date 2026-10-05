# Team invoices

A server-rendered Express app with a login form and an invoice list.

> This repository is a disposable test fixture for [Observed](https://github.com/esau-morais/observed).

## Develop

```bash
npm install
npm start   # http://localhost:3000 (set PORT to change it)
```

Sign in as `ada`. The demo password is not committed. Developers have it in the
`DEMO_PASSWORD` environment variable, and CI reads it from the `DEMO_PASSWORD`
Actions secret.

## Invoice request

```mermaid
---
config:
  flowchart:
    theme: dark
  fontFamily: monospace
---
flowchart LR
  Browser --> Authentication --> Audit --> Invoices
```

## Entity relationship

```mermaid
---
config:
  er:
    theme: dark
  fontFamily: monospace
---
erDiagram
  CUSTOMER ||--o{ ORDER : places
```

## Requirements

```mermaid
---
config:
  requirement:
    theme: dark
  fontFamily: monospace
---
requirementDiagram
  requirement invoice_request {
    id: 1
    text: "Invoice request"
    risk: low
    verifymethod: test
  }
```

## Sequence

```mermaid
---
config:
  sequence:
    theme: dark
  wrap: true
  fontFamily: monospace
---
sequenceDiagram
  Browser->>Invoices: Load the current invoice list for this account
  Invoices-->>Browser: Return the invoice list
```

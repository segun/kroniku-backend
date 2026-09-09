# Kroniku backend (Milestone 5)

NestJS + MySQL backend for sync, authentication, search, and account lifecycle.

Concrete request/response examples for client integration live in [../docs/backend-api-contract.md](../docs/backend-api-contract.md).

## Stack

- NestJS 11
- TypeORM 0.3
- MySQL 8+
- JWT auth (account + device-bound sessions)

## Local setup

1. Install dependencies:

```bash
yarn install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Start MySQL and create the database from `.env` (default: `kroniku`).

4. Run in dev mode:

```bash
yarn start:dev
```

Health check:

```bash
GET /
```

## Sync and encryption contract

Server accepts event payloads as opaque ciphertext and never attempts to decrypt them.

### Required event fields for sync push

- `eventId`: stable client event identifier
- `version`: monotonic integer version per event
- `encryptedPayload`: client-side encrypted event payload blob
- `payloadHash`: deterministic hash of encrypted payload used for conflict detection

### Optional searchable projection

To support keyword retrieval while keeping source payload encrypted, client may send a reduced text projection:

- `searchText`
- `title`
- `detail`
- `source`

This projection is user-controlled and can be minimized or omitted.

### Conflict handling

- If incoming `version` is greater than server version: apply update.
- If equal version and different `payloadHash`: record `same_version_conflict` and keep server copy.
- If lower version: record `ignored_stale`.

## API summary

### Auth

- `POST /auth/provider`

The endpoint accepts a verified Google or Apple OpenID Connect ID token, links or creates the account, upserts device metadata, and returns a JWT. Password authentication is not supported.

### Sync

- `POST /sync/push` (JWT required)
- `GET /sync/pull?since=ISO_DATE` (JWT required)

### Search

- `POST /search/keyword` (JWT required)
- `POST /search/natural` (JWT required, retrieval opt-in required)

Natural search uses retrieval-first full-text ranking over projected text fields with a keyword-overlap fallback.

### Account lifecycle

- `PATCH /account/retrieval-opt-in`
- `GET /account/export`
- `DELETE /account`

## Notes

- `DB_SYNC=false` is the default and should stay off when migrations are available.
- For production, disable schema sync and use migrations.
- Use a strong `JWT_SECRET` in non-dev environments.

## OpenAPI

Generate machine-readable OpenAPI from controllers:

```bash
yarn openapi:generate
```

Generated artifact:

- `../docs/openapi.json`

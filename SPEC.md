# Kroniku product specification

**Status:** Draft v0.2  
**Last updated:** 2026-07-31

## 1. Vision

Kroniku is a private, source-driven memory system that turns operating-system signals into coherent personal memories.

The product is not organized around isolated features. It is organized around memory sources that answer core memory questions:

- where was I
- when was it
- why was I there
- who was involved
- what happened
- what evidence exists
- what happened next

Kroniku's long-term category is a searchable digital autobiography, built with explicit user consent and local-first trust.

## 1.1 Product north star

When a user asks about a past moment, Kroniku should return the right memory with enough context to be immediately useful.

## 2. Product strategy

### 2.1 Primary product unit: Context Card

Every meaningful timeline entry is represented as a Context Card built from one or more sources.

Each card may include:

- event identity (title, source type, confidence)
- time context (timestamp plus semantic labels such as before sunrise/weekend/public holiday)
- location context (place, trip segment, duration)
- environmental context (weather)
- activity context (motion state, optional health state)
- social context (calendar attendees, contacts, user notes)
- evidence (photos, documents, receipts)
- follow-up links (related events or tasks)

### 2.2 Memory-source tiers

#### Tier 1: excellent signals (high value, low friction)

- Location
- Calendar
- WeatherKit (iOS)
- Time semantics
- Motion
- HealthKit (permissioned)
- Photos

#### Tier 2: high-value enrichment

- Voice notes + transcription + extraction
- Shared notes
- Contacts
- Bluetooth context

#### Tier 3+

- Tier 3: financial memory (bank/receipt context where supported)
- Tier 4: communication memory (email/work suite integrations)
- Tier 5: document memory
- Tier 6: travel memory
- Tier 7: watch-derived memory
- Tier 8: car memory (CarPlay plus supported vehicle APIs)
- Tier 9: home-memory integrations

### 2.3 Differentiation

- Source fusion over single-feature utilities.
- Context-first memory cards instead of raw event logs.
- Native-platform depth over shallow cross-platform sensor access.
- Trust model that prioritizes consent clarity, local storage, and selective sync.

## 3. Current release goal (local iOS MVP)

Deliver a dependable local-first iOS app that can persist manual contact memories and display them on a timeline while preparing the architecture for Tier 1 integrations.

This release is intentionally narrow: prove that users gain value from reliable capture, coherent timeline structure, and clear privacy controls before scaling integrations.

### In scope now

- Native SwiftUI interface.
- SwiftData-backed timeline models and repository.
- Typed Contact Moment capture and timeline rendering.
- Contact Moment validation and editable timestamp.
- Contact Moment detail screen.
- Settings/privacy screen with permission rationale.
- Unit tests for event creation and ordering.

### Next in scope (post-MVP Tier 1)

- Calendar import with explicit opt-in.
- Weather snapshots attached to meaningful events.
- Location and place-learning foundation.
- Motion context foundation.

### Explicitly out of scope for current milestone

- Access to call logs, SMS history, or third-party notifications.
- Continuous background capture before consent and battery strategy are validated.
- Automatic silent persistence of uncertain speech extraction.
- Car integrations, smart-home integrations, team collaboration, and billing.

## 4. Core user stories

1. As a user, I can open Kroniku and view a chronological timeline of memories.
2. As a user, I can save a typed Contact Moment with a specific timestamp and note.
3. As a user, I can open a memory detail view that explains linked context.
4. As a user, I can understand exactly which sources are enabled and revoke them.
5. As a user, I can later see calendar, weather, and place context merged into one card.
6. As a user, I can eventually search memories with natural language once retrieval is enabled.

## 5. Domain model

### 5.1 MemoryEvent

Canonical timeline entity.

- id
- occurredAt
- createdAt
- updatedAt
- primarySource: manual, location, calendar, weather, motion, health, photo, note, voice, finance, document, travel, watch, vehicle, home
- title
- detail (optional)
- confidenceScore (optional)
- locationRef (optional)
- personRefs (optional list)
- linkedEventIDs (optional list)

### 5.2 ContactMoment

User-authored interpersonal memory.

- id
- personName (free text in early versions)
- interactionType: call, text, meeting, email, other
- occurredAt
- note
- placeID (optional)
- captureMethod: typed, voice, shortcut

### 5.3 ContextAttachment

Source-specific context attached to a MemoryEvent.

- id
- eventID
- sourceType
- payloadType
- payloadData
- capturedAt
- providerMetadata

Examples: weather snapshot, calendar metadata, motion segment, health summary, photo link.

### 5.4 Place and WeatherSnapshot

- Place tracks learned locations and visit aggregates.
- WeatherSnapshot stores observed weather attributes at event time/location.

## 6. Privacy, consent, and guardrails

| Source capability | Permission | Product rule |
|---|---|---|
| Calendar context | Calendar access | Request only when user enables calendar source. |
| Voice notes | Microphone + speech recognition | Capture only on explicit action; confirm extracted fields before save when confidence is low. |
| Location/place | Location permission | Use bounded collection and clear battery/privacy disclosure. |
| Motion | Motion/activity permission | Capture only for context enrichment; user can disable independently. |
| Weather | Event-time location | Fetch on meaningful events, not continuous polling. |
| Health context | HealthKit selective read scopes | Strictly opt-in with granular category control. |
| Photos | Photo library scoped access | Attach only user-selected or permitted event-adjacent assets. |
| Contacts | Contacts permission | Resolve names for user benefit; never upload entire address book by default. |
| Notifications from other apps | N/A | Not supported on iOS; do not imply access. |
| Calls/SMS logs | N/A | Never requested. |

## 7. Architecture

### 7.1 Clients

- iOS: Swift, SwiftUI, SwiftData, EventKit, Core Location, Core Motion, WeatherKit, HealthKit, Photos, Speech.
- Android: Kotlin, Jetpack Compose, Room, Calendar Provider, Fused Location, Activity Recognition, Health Connect equivalents where applicable.

Clients share behavioral contracts and source semantics, not shared UI code.

### 7.2 Backend (later phase)

- Account and device identity.
- Encrypted sync and conflict handling.
- Retrieval and summarization services for opted-in users.
- Connector layer for financial, communication, and travel providers.

### 7.3 Intelligence model

1. Deterministic source fusion and timeline construction.
2. Confidence-scored extraction and deduplication.
3. Optional AI retrieval/summarization as a query layer over user-authorized data.

## 8. Roadmap checkpoints

1. Local MVP: persistent manual contact memories + timeline + privacy controls.
2. Tier 1 context fusion: location, calendar, weather, motion, time semantics.
3. Tier 2 enrichment: voice, contacts, notes, bluetooth context.
4. Tier 3-6 connectors: finance, communication, documents, travel.
5. Tier 7-9 ambient context: watch, vehicle, home.

Execution principle: maximize user value per permission requested.

## 9. Success criteria (current milestone)

- iOS app builds and runs in simulator.
- Typed Contact Moment persists and appears in timeline after relaunch.
- Timeline ordering is deterministic and covered by tests.
- Settings screen clearly documents what data is and is not accessed.
- Data model supports future source attachments without schema rewrite.

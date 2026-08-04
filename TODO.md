# Kroniku execution checklist

**Legend:** `[ ]` not started · `[-]` in progress · `[x]` complete

## Milestone 0 — Project foundation

- [x] Establish monorepo layout: `backend`, `frontend/ios`, and `frontend/android`.
- [x] Create the native SwiftUI iOS project.
- [x] Create initial Timeline, Places, Memory, and Contact Moment UI scaffolding.
- [x] Verify the iOS project builds for the simulator.
- [x] Document product scope, privacy boundaries, and delivery milestones.
- [x] Add `.gitignore` and initial project metadata.
- [x] Make the first commit.

## Milestone 1 — Local iOS MVP and Context Card foundation

- [x] Define persistent SwiftData models for MemoryEvent, ContactMoment, Place, and WeatherSnapshot.
- [x] Replace timeline demo data with a repository-backed data source.
- [x] Save a typed Contact Moment and display it in the timeline.
- [x] Add validation and an editable timestamp to Contact Moment capture.
- [x] Create a Contact Moment detail screen.
- [x] Add a Settings/privacy screen.
- [x] Add unit tests for event creation and timeline ordering.
- [x] Define a base Context Card schema that can attach source-specific metadata.

**Exit condition:** a user can manually add a contact memory and find it in a persistent local timeline with an extensible Context Card data model.

## Milestone 2 — Tier 1 context fusion (calendar, weather, location, motion, time)

- [x] Integrate EventKit with an opt-in calendar-permission screen.
- [x] Import calendar events into the timeline as read-only source events.
- [x] Link calendar attendees/locations only when the user opts in.
- [x] Add location-consent onboarding and bounded visit capture.
- [x] Add WeatherKit snapshots to meaningful events.
- [x] Add motion-state attachment (driving, walking, running, cycling, stationary).
- [x] Add time semantics (sunrise/sunset/weekend/public-holiday labels).
- [x] Add privacy tests for permission denial, revocation, and partial consent states.

**Exit condition:** timeline cards merge authorized Tier 1 sources into coherent memory context.

## Milestone 2b — Post-MVP Tier 1 follow-ons

- [x] Add calendar import with explicit opt-in and source-level consent controls.
- [x] Attach weather snapshots to meaningful events.
- [x] Establish a location/place-learning foundation for future enrichment.
- [x] Add motion-context foundation for activity-aware memory cards.

## Milestone 3 — Tier 1 expansion (HealthKit and photos)

- [x] Add HealthKit opt-in onboarding with granular metric toggles.
- [x] Break onboarding into multiple pages if a single page will be too long. 
- [x] Add option to resume onboarding in case user mistakenly dispose the onboarding sheet
- [x] Attach selected health summaries to eligible memory events.
- [x] Add photo-linking flow and event-adjacent attachment support.
- [x] Add timeline filters for places, interactions, calendar, weather, motion, health, and photos.
- [-] Verify source-level disable and data-retention behavior per source.

**Exit condition:** Tier 1 source set is available with clear per-source user control.

## Milestone 4 — Tier 2 enrichment (voice, notes, contacts, bluetooth)

- [ ] Add microphone permission rationale and explicit recording control.
- [ ] Add on-device speech recognition/transcription flow.
- [ ] Show extracted person, interaction type, and timestamp for user confirmation.
- [ ] Add user-shared note ingestion and event linking.
- [ ] Add contacts opt-in and person-resolution flow.
- [ ] Add bluetooth context capture (car/headphones/speaker) for memory enrichment.
- [ ] Add confidence scoring and review UI for extracted entities.

**Exit condition:** user-authored and user-confirmed enrichment flows produce higher-quality memory cards.

## Milestone 5 — Search and sync

- [ ] Design backend API, authentication, and encrypted sync contract.
- [ ] Implement account creation and device registration.
- [ ] Sync the local event store with conflict handling.
- [ ] Add keyword search.
- [ ] Add retrieval-first natural-language search behind an opt-in setting.
- [ ] Add data export and account deletion.

**Exit condition:** users can securely sync their history and retrieve it through search.

## Milestone 6 — Android parity

- [ ] Bootstrap a Kotlin/Jetpack Compose Android app under `frontend/android`.
- [ ] Implement the same local timeline and Contact Moment workflow.
- [ ] Add Android calendar and speech integrations.
- [ ] Establish API-contract tests shared between iOS and Android.

## Milestone 7 — Tier 3+ connectors

- [ ] Design financial-memory connector contracts (bank/receipt providers where supported).
- [ ] Design communication-memory connectors (Gmail/Outlook/Microsoft 365).
- [ ] Add document upload and structured extraction pipeline.
- [ ] Add travel-memory ingestion for flights/hotels/rail confirmations.
- [ ] Add source reliability and provenance badges on memory cards.

## Later / explicitly deferred

- [ ] Tier 7 Apple Watch integrations.
- [ ] Tier 8 car context (CarPlay and supported vehicle APIs).
- [ ] Tier 9 home-context integrations (locks/lights/thermostats/cameras).
- [ ] Reliable always-on trip detection after battery/privacy validation.
- [ ] Access to call logs, SMS history, or third-party notifications.
- [ ] Continuous background capture before consent and battery strategy are validated.
- [ ] Automatic silent persistence of uncertain speech extraction.
- [ ] Family sharing and shared memories.
- [ ] Team/field-intelligence product.
- [ ] Paid plans and billing.

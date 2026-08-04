# Kroniku

Kroniku is a private, native mobile memory system for the real world. It fuses operating-system signals into coherent memories users can search, review, and trust.

The product is organized around memory sources rather than one-off features. The first execution priority is high-value, low-friction sources like location, calendar, weather, time semantics, motion, health context, and photos.

Kroniku's ambition is larger than a timeline app: build a searchable digital autobiography with explicit user consent at every step.

## Product promise

**Your life, remembered—on your terms.**

Kroniku turns events into private Context Cards, where each card combines place, time, activity, people, and evidence. A user should be able to ask or search for things such as:

- “When did I last visit Eko Hotel?”
- “Which day did it rain during that meeting?”
- “When did I meet Mr. Fola?”
- “What happened before and after that call?”

## Why native

Kroniku is built natively in Swift and Kotlin to access platform capabilities deeply, handle permissions correctly, and deliver reliable on-device behavior.

## Source tiers

- Tier 1: location, calendar, weather, time semantics, motion, HealthKit, photos.
- Tier 2: voice notes, notes sharing, contacts, bluetooth context.
- Tier 3+: finance, communication integrations, documents, travel, watch, car, and home context.

## Privacy principles

- No call-log, SMS, dialer, or message-history access.
- Contact interactions come from user-entered text, voice capture, or explicit user-approved integrations.
- Request only the permissions needed for a feature.
- Prefer on-device processing and local storage; cloud sync is opt-in.
- Use AI for high-value retrieval and summaries, never to process every raw event.

## Repository layout

```text
backend/            API, sync, authentication, and shared services
frontend/
  ios/              Native SwiftUI iOS application
  android/          Native Kotlin/Jetpack Compose Android application
```

See [SPEC.md](SPEC.md) for the product and technical specification, and [TODO.md](TODO.md) for the delivery plan.

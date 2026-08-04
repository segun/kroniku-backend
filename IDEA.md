# Kroniku idea brief

## Core shift

Kroniku is not a driving app. Kroniku is a personal memory operating system.

Every operating system already knows an incredible amount about a person's life. Kroniku's job is to fuse those signals into coherent memory.

## Why this matters

People do not forget because they are careless. They forget because daily life is fragmented across apps, sensors, and moments.

Kroniku should quietly assemble high-value context so users can remember with confidence.

A memory is not just a timestamp. A useful memory answers:

- where was I
- when was it
- why was I there
- who was involved
- what happened
- what evidence exists
- what happened next

## Product shape

Kroniku ingests memory sources in tiers. Each tier adds meaningful context without overwhelming the user with setup friction.

## Source tiers

### Tier 1: excellent signals (high value, low friction)

- Location
- Calendar
- WeatherKit (iOS)
- Time semantics
- Motion
- HealthKit
- Photos

Tier 1 examples:

- You visited Victoria Island for 2 hours.
- You met Mr. Fola.
- It was raining heavily during the meeting.
- You left home before sunrise.
- Walked 4 km around Hyde Park.

### Tier 2: very valuable

- Voice notes and transcription
- User-shared notes
- Contacts
- Bluetooth context (car/headphones/speaker)

### Tier 3: financial memory

- Connected banking or receipt/email ingestion (where supported)
- Fuel, restaurants, hotels, flights, shopping

### Tier 4: communication memory

- Gmail, Outlook, Microsoft 365 integrations
- Proposal sent, invoice received, contract signed

### Tier 5: documents

- User-uploaded files with extraction (company, amount, date)

### Tier 6: travel

- Flights, hotels, rail tickets, boarding passes

### Tier 7: watch context

- Workout, heart rate, sleep, mindfulness, and related supported metrics

### Tier 8: car context

- CarPlay and vehicle API integrations where available
- Fuel/charging, mileage, parking context where supported

### Tier 9: home context

- Smart locks, lights, thermostats, cameras

## Defining experience: Context Cards

Each memory should be presented as a context card assembled from multiple sources.

Example:

```text
July 17, 2026
10:04 AM
Location: Victoria Island
Weather: 31 C, Sunny
Motion: Drove from Lekki
Health: Heart Rate 82 bpm
Calendar: Quarterly Sales Meeting
Voice: "Client approved proposal"
Photos: 3
Duration: 2h 14m
Walking: 1.2 km
After: Fueled at Chevron
```

Users should not have to manually build this. Kroniku assembles it from authorized signals and lets users correct or enrich details.

## Principles

1. Automatic first: capture high-confidence context with clear permission boundaries.
2. User control always: users can review, edit, revoke, and delete.
3. Local-first trust: keep personal history local by default; sync is opt-in.
4. AI as retrieval layer: AI helps search and summarize, but memory is the product.
5. Source transparency: every permission has a clear reason and privacy explanation.

## Strategic advantage

Native Swift and Kotlin clients are a strategic fit for Kroniku. The product depends on deep operating-system integrations, nuanced permission handling, and reliable on-device behavior.

## Long-term vision

Think in memory sources, not isolated features.

This creates a searchable digital autobiography:

- Where was I?
- Why was I there?
- Who was involved?
- What happened?
- What evidence supports it?
- What happened next?

If it happened and the user authorized the source, Kroniku should help remember it.

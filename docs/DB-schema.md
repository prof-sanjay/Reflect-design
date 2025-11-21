# Database Schema Diagram

This document contains an ER diagram for the main backend models in `be/models` and a short summary of relationships. Add screenshots or export the Mermaid diagram to PNG/SVG if you need an image.

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String username
        String email
        String role
    }

    PROFILE {
        ObjectId _id PK
        ObjectId userId FK
        String name
        String phone
    }

    THERAPIST {
        ObjectId _id PK
        ObjectId userId FK
        String specialization
        Number pricePerSession
    }

    BOOKING {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId therapistId FK
        Date date
        String time
        String status
    }

    APPOINTMENT {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId therapistUserId FK
        Date scheduledDate
        Number duration
    }

    CHAT {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId therapistId FK
        Date lastMessage
    }

    MESSAGE {
        ObjectId _id PK
        ObjectId senderId FK
        String content
        Date timestamp
    }

    WELLNESS {
        ObjectId _id PK
        ObjectId userId FK
        Date date
        Number sleepHours
        String mood
    }

    REFLECTION {
        ObjectId _id PK
        ObjectId userId FK
        Date date
        String mood
    }

    JOURNAL {
        ObjectId _id PK
        ObjectId userId FK
        Date date
        String mood
    }

    TASK {
        ObjectId _id PK
        ObjectId userId FK
        String text
        Boolean completed
    }

    GOAL {
        ObjectId _id PK
        ObjectId userId FK
        String title
        Date deadline
    }

    HABIT {
        ObjectId _id PK
        ObjectId userId FK
        String name
    }

    PROMPT {
        ObjectId _id PK
        String text
        ObjectId createdBy FK
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId userId FK
        String type
        String title
    }

    ADMINALERT {
        ObjectId _id PK
        ObjectId userId FK
        String alertType
        String severity
    }

    %% Relationships
    USER ||--|| PROFILE : has
    USER ||--o{ THERAPIST : may_have_profile
    USER ||--o{ BOOKING : makes
    THERAPIST ||--o{ BOOKING : receives
    USER ||--o{ APPOINTMENT : schedules
    USER ||--o{ CHAT : participates
    THERAPIST ||--o{ CHAT : participates
    CHAT ||--o{ MESSAGE : contains
    MESSAGE }o--|| USER : sent_by
    USER ||--o{ WELLNESS : records
    USER ||--o{ REFLECTION : writes
    USER ||--o{ JOURNAL : writes
    USER ||--o{ TASK : owns
    USER ||--o{ GOAL : owns
    USER ||--o{ HABIT : tracks
    USER ||--o{ PROMPT : creates
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ ADMINALERT : flagged_for
    ADMINALERT }o--|| USER : resolved_by

```

Legend:
- `PK` = Primary key (MongoDB `_id` ObjectId)
- `FK` = Reference to another model (`ObjectId`)
- Cardinality notes: `||` means one, `o{` means many

How to use:
- Open this file in a Markdown viewer that supports Mermaid (VS Code with Mermaid Preview extension or GitHub when rendered) to view the diagram.
- To export to PNG/SVG locally, install `mmdc` (Mermaid CLI) or use an online Mermaid renderer.

Next steps I can do for you:
- Generate a PNG/SVG export of this diagram and add it to `docs/`.
- Produce separate per-model diagrams or a higher-detail ER with all fields included.
- Create a Graphviz DOT version if you prefer that format.

If you want a PNG now, tell me and I'll try to generate it (or give commands to run locally).

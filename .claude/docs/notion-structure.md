# YP Notion Structure

> Notion handles visual workflows; Convex handles structured data.
> No duplication - each system does what it's best at.

## Workspace Structure

```
📁 YouthPerformance
├── 🎬 Video Production (Notion-native)
│   ├── 📋 Video Pipeline (Kanban)
│   ├── 📝 Script Templates
│   ├── 🎯 Shot Lists
│   └── 📅 Shoot Schedule
│
├── 📰 Content Calendar (Synced from Convex)
│   ├── 📊 SEO Content Status (read-only view)
│   └── ✍️ Editorial Queue (for James/Adam review)
│
├── 🎨 Brand Hub
│   ├── 🎨 Style Guide
│   ├── 🖼️ Asset Library
│   ├── 🗣️ Voice Guides (Adam / James)
│   └── 📐 Design System
│
└── 📋 Operations
    ├── 🏃 Sprint Board
    ├── 📈 Metrics Dashboard
    └── 📝 Meeting Notes
```

---

## Database Schemas

### 🎬 Video Pipeline

| Property | Type | Options |
|----------|------|---------|
| Title | Title | - |
| Status | Select | Concept → Script → Pre-prod → Shooting → Editing → Review → Published |
| Expert | Select | Adam, James, Both |
| Cluster | Multi-select | Silent Basketball, Home Training, Girls Basketball, Speed/Agility |
| Drill Link | URL | Link to Convex drill (or playbook page) |
| Script | Relation | → Scripts database |
| Shot List | Relation | → Shot Lists database |
| Due Date | Date | - |
| Assignee | Person | - |
| Priority | Select | P0, P1, P2 |
| Duration | Number | Target video length (seconds) |
| Platform | Multi-select | YouTube, Instagram, TikTok, Academy |

### 📝 Scripts Database

| Property | Type | Notes |
|----------|------|-------|
| Title | Title | Script name |
| Video | Relation | → Video Pipeline |
| Expert Voice | Select | Adam, James |
| Status | Select | Draft, Review, Approved |
| Hook | Rich Text | Opening 3 seconds |
| Body | Rich Text | Main content |
| CTA | Rich Text | Call to action |
| Coaching Cues | Rich Text | Key points to hit |
| B-Roll Notes | Rich Text | What supplemental footage needed |

### 🎯 Shot Lists

| Property | Type | Notes |
|----------|------|-------|
| Title | Title | Shot list name |
| Video | Relation | → Video Pipeline |
| Location | Select | Gym, Outdoor, Home, Studio |
| Equipment | Multi-select | Camera, Tripod, Lights, Mic, etc. |
| Talent | Multi-select | Adam, James, Kid Athlete, Parent |
| Shots | Relation | → Individual Shots (sub-database) |

---

## Sync Strategy: Notion ↔ Convex

### What Syncs FROM Convex → Notion (read-only in Notion)

| Convex Table | Notion View | Sync Frequency |
|--------------|-------------|----------------|
| `contentQueue` (stage=review) | Editorial Queue | Real-time webhook |
| `drills` (status=published) | Drill Library | Daily |
| Content metrics | Dashboard embeds | Daily |

### What Lives ONLY in Notion

| Content | Why Notion |
|---------|-----------|
| Video scripts | Rich text editing, comments |
| Shot lists | Visual planning, assignments |
| Brand assets | Easy browsing, visual |
| Meeting notes | Collaboration |

### What Lives ONLY in Convex

| Content | Why Convex |
|---------|-----------|
| Drill structured data | Type-safe, API access |
| User accounts | Auth integration |
| Payments | Stripe webhooks |
| SEO content generation | Automated pipeline |

---

## Clawdbot Integration Examples

### Create a new video in pipeline
```
"Add a new video for silent basketball dribbling drills,
assign to Adam, P0 priority, due next Friday"
```

### Query video status
```
"What videos are in editing status?"
```

### Update script
```
"Mark the silent-dribbling-101 script as approved"
```

### Link drill to video
```
"Connect the new apartment-dribbling video to
the drill at /basketball/drills/apartment-ball-handling"
```

---

## Automation Ideas

1. **Content → Video trigger**: When a drill hits 1000 views, auto-create video card in Notion
2. **Review complete → Publish**: When James/Adam approve in Notion, trigger Convex publish
3. **Video published → Content update**: When video goes live, update the related drill with embed

---

## Getting Started Checklist

- [ ] Create Notion integration at notion.so/my-integrations
- [ ] Store API key: `echo "ntn_xxx" > ~/.config/notion/api_key`
- [ ] Create "YouthPerformance" workspace
- [ ] Create Video Pipeline database with schema above
- [ ] Share workspace with integration
- [ ] Test with Clawdbot: "Search my Notion for Video Pipeline"

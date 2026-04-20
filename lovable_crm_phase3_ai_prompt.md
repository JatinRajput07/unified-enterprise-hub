# Lovable Prompt — Enterprise CRM: Phase 3 — AI-First Smart CRM

---

## 🔒 PRESERVE EVERYTHING FROM PHASE 1 & 2

Do NOT break or remove anything already built:
- CRM Shell (Header, L1, L2, Right Strip, Footer)
- All 10 module dashboards and their pages
- Light theme + dark mode toggle
- All forms, modals, tables, mock data
- RBAC / System Admin UI
- WayOfWork full lifecycle
- All other module pages

Only ADD and EXTEND. Zero regressions.

---

## 🧠 CORE AI PHILOSOPHY

This CRM is now **AI-first**. Claude AI (Anthropic API) is embedded everywhere.
The goal: **humans make decisions, AI does everything else**.

- AI observes context (current module, user role, recent activity)
- AI suggests, auto-fills, categorizes, summarizes, predicts
- Every AI action is visible + explainable (no black box)
- User can accept, edit, or dismiss any AI suggestion
- AI assistant is always one click away — persistent in UI

---

## 🔑 ANTHROPIC API SETUP

Use this exact API call pattern everywhere AI is invoked:

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: yourPromptHere }]
  })
});
const data = await response.json();
const result = data.content[0].text;
```

API key is handled by the environment — do not hardcode it.

All AI calls: show loading state (shimmer/skeleton), handle errors gracefully with fallback UI.

---

## 🤖 FEATURE 1 — ARIA: AI Assistant (Global)

### What is ARIA?
**ARIA** = Automated Research & Intelligent Assistant
A persistent AI chat panel embedded in the CRM. Knows the user's role, current module, recent data, and can take actions.

---

### UI Placement

**Right Strip** — add ARIA icon (✦ or sparkle icon) at top of right utility strip.

Click → opens a **slide-over panel** (380px wide) from the right side, over the content (does not push layout).

Panel stays open while user navigates between pages.

---

### ARIA Panel UI

```
┌─────────────────────────────────────┐
│  ✦ ARIA  [AI Assistant]    [×] [—]  │
│  Context: Sales > Pipeline          │
│  Role: Manager | Team: Enterprise   │
├─────────────────────────────────────┤
│                                     │
│  [Chat messages area - scrollable]  │
│                                     │
│  ARIA: "You have 3 deals closing    │
│  this week. TechCorp deal has been  │
│  inactive for 8 days — want me to   │
│  draft a follow-up email?"          │
│                                     │
│  [Yes, draft it] [No thanks]        │
│                                     │
│  User: "Summarize this week"        │
│                                     │
│  ARIA: "This week: 12 new leads,    │
│  2 deals won (₹8.4L), 1 deal lost. │
│  Win rate up 4%. Best performer:    │
│  Priya Mehta (3 deals closed)."     │
│                                     │
├─────────────────────────────────────┤
│  Quick Actions:                     │
│  [📊 Summarize] [📝 Draft] [🔍 Find]│
├─────────────────────────────────────┤
│  [Type a message...        ] [Send] │
└─────────────────────────────────────┘
```

---

### ARIA Capabilities (by module context)

**Sales context:**
- "Summarize my pipeline this week"
- "Which deals are at risk of going cold?"
- "Draft a follow-up email for [deal name]"
- "What's my win rate this month?"
- "Find all leads from e-commerce industry"

**Finance context:**
- "Summarize expenses this month"
- "Which invoices are overdue?"
- "Generate a P&L summary for Q1"
- "Which department is over budget?"

**PMS context:**
- "Which projects are at risk of missing deadline?"
- "Summarize hours logged this week"
- "Who is overallocated this week?"
- "Draft a project status update for TechCorp"

**WayOfWork context:**
- "Summarize pending review queue"
- "Which employees haven't submitted WoWs this week?"
- "Generate training plan for new joiner"

**Any module:**
- "What needs my attention today?" → AI priority digest
- "Show me everything overdue"
- "Who is most active this week?"
- "Generate a weekly report"

---

### ARIA API Prompt Pattern

When user sends a message, build context-aware prompt:

```javascript
const ariaPrompt = `
You are ARIA, an intelligent AI assistant embedded inside an Enterprise CRM.

Current context:
- Module: ${activeModule}
- User: ${user.name}, Role: ${user.role}
- Department: ${user.department}, Team: ${user.team}
- Current page: ${currentPage}

CRM Data Summary (mock):
${JSON.stringify(relevantMockData, null, 2)}

User message: "${userMessage}"

Respond in a concise, professional tone. 
- If the user asks to draft content, produce the full draft.
- If summarizing, use bullet points with key numbers.
- If predicting/warning, explain why briefly.
- Always end with 1 suggested next action the user can take.
- Keep response under 150 words unless drafting content.
`;
```

---

### ARIA Proactive Suggestions

On page load of any dashboard, ARIA auto-generates a **"Today's Digest"** card at the top of the main content area (dismissible):

```
┌─────────────────────────────────────────────────────┐
│  ✦ ARIA Digest — Good morning, Rahul            [×] │
│                                                     │
│  • 3 deals closing this week — review pipeline      │
│  • Invoice #INV-0047 overdue by 5 days              │
│  • 2 WoWs pending your review                       │
│  • Project "Nykaa App" enters critical zone today   │
│                                                     │
│  [Take me there →]                    [Dismiss]     │
└─────────────────────────────────────────────────────┘
```

API call on dashboard load:
```javascript
const digestPrompt = `
Generate a morning digest for ${user.name} (${user.role}) based on this CRM data:
${JSON.stringify(dashboardData)}

List 3-5 most important things needing attention today.
Format: bullet points, each under 12 words.
Prioritize: overdue items, upcoming deadlines, pending approvals, at-risk items.
`;
```

---

## 🤖 FEATURE 2 — AI Smart Forms (Auto-fill + Suggestions)

### Concept
Every create/edit form in the CRM has AI assistance. As user types, AI suggests completions, auto-categorizes, and pre-fills related fields.

---

### Implementation: AI Assist Button on Every Form

Add a **"✦ AI Assist"** button at the top of every create/edit form.

**Behavior:**
1. User fills in the Title field (minimum 3 words typed)
2. AI Assist button activates (glows)
3. User clicks "✦ AI Assist"
4. AI analyzes the title + any filled fields
5. AI suggests values for all empty fields
6. Shows suggestion overlay on each field with "Accept" / "Edit" / "Skip"

---

### Per-Module AI Form Suggestions

**Sales — Create Lead / Deal form:**
- User types company name → AI suggests: Industry, Company size, Expected deal value range, Suggested next step
- User types deal title → AI suggests: Stage, Probability %, Close date estimate, Assigned owner

API prompt:
```javascript
`Based on this deal being created in a CRM:
Title: "${title}"
Company: "${company}"

Suggest realistic values for:
- Industry (one of: Technology, Finance, Healthcare, E-commerce, Manufacturing, Other)
- Deal stage (one of: Lead, Qualified, Proposal, Negotiation, Won, Lost)
- Probability % (0-100)
- Estimated value in INR
- Suggested next action (one sentence)

Respond ONLY as JSON: { industry, stage, probability, estimatedValue, nextAction }`
```

**Finance — Create Expense form:**
- User types expense title → AI suggests: Category, Tax applicability, Approver
- User types amount → AI flags if unusually high vs historical average

**WayOfWork — Create WoW form:**
- User types WoW title → AI suggests: Type, Frequency, Estimated time, Tools used, 3 process steps
- AI generates a draft description based on title

API prompt:
```javascript
`A user is documenting their work process in a WayOfWork system.
WoW Title: "${title}"

Generate suggestions for:
- Type (Workflow/Activity/Process/SOP/Checklist/Report/Meeting)
- Frequency (Daily/Weekly/Bi-weekly/Monthly/Quarterly/Ad-hoc)
- Estimated time (number + unit: minutes or hours)
- Tools likely used (array of 2-4 tool names)
- 3 process steps (array of short step descriptions)
- Brief description (2 sentences)

Respond ONLY as JSON: { type, frequency, estimatedTime, estimatedUnit, tools, steps, description }`
```

**FRD — Create FRD form:**
- User types project name + scope → AI generates a complete FRD skeleton:
  - Overview section
  - User Roles section
  - 5 functional requirements (FR-001 to FR-005)
  - 2 non-functional requirements
  - 3 assumptions

**PMS — Create Task form:**
- User types task title → AI suggests: Priority, Estimated hours, Suggested assignee (based on workload)

**Master Sheet — Create Project form:**
- User types project name + type → AI suggests: Tech stack, Estimated duration, Recommended team size, Risk level

---

### AI Suggestion UI Pattern

When AI returns suggestions, show them as soft-highlighted field overlays:

```
Title:       [Nykaa Mobile App Redesign          ]

Type:        [Web App ✦ AI suggested    ] [✓ Accept] [✎ Edit]
Tech Stack:  [React Native, Node.js     ] [✓ Accept] [✎ Edit]  
Duration:    [3 months                  ] [✓ Accept] [✎ Edit]
Team Size:   [4 members                 ] [✓ Accept] [✎ Edit]

              [✓ Accept All]  [✎ Review Each]  [✗ Dismiss]
```

Accepted suggestions fill the actual form field.
Show "AI suggested" badge (small, dismissible) on accepted fields.

---

## 🤖 FEATURE 3 — AI Auto-Categorization

### Concept
When records are created/imported, AI automatically categorizes them — no manual selection needed.

---

### Where it applies:

**Expenses:** User submits expense with title + amount → AI sets Category automatically
- "Team lunch at Barbeque Nation" → Category: "Meals & Entertainment"
- "Adobe Creative Cloud subscription" → Category: "Software & Tools"
- "Flight to Mumbai for client meeting" → Category: "Travel"

Show: "✦ Auto-categorized as [Category]" chip below field with "Change" link.

**Leads:** New lead submitted → AI sets Industry, Company size tier, Lead score (1-10)

**Tasks:** New task created → AI sets Priority based on title keywords
- "Fix critical payment bug" → Priority: Critical
- "Update homepage copy" → Priority: Low

**WoW:** Submitted → AI sets Type and Frequency if not filled

**Notifications:** Incoming notification → AI labels it: Urgent / Important / Informational / FYI

---

### Auto-categorization API prompt pattern:
```javascript
`Categorize this ${recordType} for an enterprise CRM.

Input: "${userInput}"
${additionalContext}

Available categories: ${categories.join(', ')}

Respond ONLY as JSON: { category: "...", confidence: 0.0-1.0, reason: "one sentence" }
`
```

Show confidence: if < 0.7 → show as suggestion (user must confirm). If ≥ 0.7 → auto-apply with "Change" option.

---

## 🤖 FEATURE 4 — AI Report Generator

### Placement
Every module's Reports page gets an **"✦ Generate AI Report"** button at the top.

Also available via ARIA: "Generate weekly sales report"

---

### Report Generator UI

Click "✦ Generate AI Report" → Modal:

```
┌─────────────────────────────────────────┐
│  ✦ Generate AI Report                   │
├─────────────────────────────────────────┤
│  Report Type:                           │
│  ○ Weekly Summary    ○ Monthly Summary  │
│  ○ Performance       ○ Risk Analysis    │
│  ○ Custom (describe below)              │
│                                         │
│  Period:  [This Week ▾]                 │
│                                         │
│  Include:                               │
│  ☑ Key metrics    ☑ Trends              │
│  ☑ Top performers ☑ Action items        │
│  ☐ Raw data table                       │
│                                         │
│  Custom instructions (optional):        │
│  [Focus on deals above ₹5L...        ]  │
│                                         │
│  [✦ Generate Report]    [Cancel]        │
└─────────────────────────────────────────┘
```

On generate → loading state (animated) → report renders in a new full-screen overlay:

---

### AI Report Output UI

```
┌──────────────────────────────────────────────────────┐
│  ✦ AI Generated Report                [Export PDF]   │
│  Sales Weekly Summary — Week of Apr 14–20, 2025      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  EXECUTIVE SUMMARY                                   │
│  ─────────────────                                   │
│  [AI-generated 3-4 sentence summary paragraph]       │
│                                                      │
│  KEY METRICS                                         │
│  ─────────────                                       │
│  • New Leads: 24 (+12% vs last week)                 │
│  • Deals Closed: 5 (₹18.2L total)                   │
│  • Win Rate: 71% (↑ from 65%)                        │
│  • Pipeline Value: ₹1.24 Cr                          │
│                                                      │
│  TOP PERFORMERS                                      │
│  ───────────────                                     │
│  1. Priya Mehta — 3 deals, ₹8.4L                    │
│  2. Dev Tiwari — 2 deals, ₹5.1L                     │
│                                                      │
│  RISKS & ATTENTION NEEDED                            │
│  ──────────────────────────                          │
│  • TechCorp deal inactive 8 days — follow up         │
│  • 4 leads uncontacted > 5 days                      │
│                                                      │
│  RECOMMENDED ACTIONS                                 │
│  ─────────────────────                               │
│  1. [Follow up TechCorp →]                           │
│  2. [Assign cold leads →]                            │
│  3. [Review pipeline →]                              │
│                                                      │
│  [Export PDF]  [Copy Text]  [Share]  [Regenerate]    │
└──────────────────────────────────────────────────────┘
```

API prompt for report:
```javascript
`You are a business analyst AI generating a ${reportType} for the ${module} module.

Period: ${period}
User: ${user.name}, Role: ${user.role}

CRM Data:
${JSON.stringify(moduleData, null, 2)}

Generate a professional business report with these sections:
1. Executive Summary (3-4 sentences)
2. Key Metrics (bullet points with numbers and % change)
3. Top Performers (if applicable)
4. Risks & Items Needing Attention
5. Recommended Actions (3 specific, actionable items)

Use professional business language. Include specific numbers from the data.
Format with clear section headers.
`
```

---

## 🤖 FEATURE 5 — AI Smart Notifications

### Concept
Raw notifications get AI-processed before showing to user.
AI decides: Is this urgent? Should user be interrupted now? What's the best summary?

---

### Notification Intelligence Layer

Every notification goes through AI scoring before display:

```javascript
const notifPrompt = `
Score this CRM notification for urgency and importance.

Notification: "${notifText}"
User Role: ${user.role}
Time: ${currentTime}

Respond ONLY as JSON:
{
  "priority": "critical|high|medium|low",
  "label": "Urgent|Important|FYI|Info",
  "summary": "10 words max rewritten summary",
  "shouldInterrupt": true/false,
  "suggestedAction": "one short action label"
}
`
```

---

### Smart Notification UI

**Bell icon in header** shows:
- Red badge: critical count
- Amber badge: high priority count

**Notification Panel** (slide from top-right):

```
┌─────────────────────────────────────────┐
│  Notifications              [Mark all]  │
│  ✦ AI-prioritized                       │
├─────────────────────────────────────────┤
│  🔴 URGENT — 2                          │
│  ┌─────────────────────────────────┐    │
│  │ Invoice #047 overdue 5 days     │    │
│  │ TechCorp — ₹2.4L unpaid        │    │
│  │ [Send Reminder →]    2h ago     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  🟡 IMPORTANT — 5                       │
│  ┌─────────────────────────────────┐    │
│  │ 2 WoWs pending your review      │    │
│  │ [Review Now →]       4h ago     │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ℹ FYI — 12                            │
│  [Show all FYI notifications ▾]         │
└─────────────────────────────────────────┘
```

Each notification has:
- AI priority label (colored)
- AI-rewritten summary (concise)
- Suggested action button (AI-generated label)
- Original timestamp

**Daily Digest notification** (9 AM mock):
- One notification from ARIA: "✦ Your Morning Digest is ready" → opens ARIA panel

---

## 🤖 FEATURE 6 — AI Predictions

### Deal Win Probability (Sales Module)

On every Deal card / row, show AI-predicted win probability:

```
Deal: Infosys Cloud Migration
Stage: Proposal
Value: ₹8.5L
AI Win Probability: ██████░░░░ 62%  ↑ from 54% last week
```

Clicking the probability → tooltip/popover:
```
✦ AI Analysis
Why 62%:
• Deal active for 12 days (healthy)
• 2 meetings completed
• Proposal sent 3 days ago
• Similar deals: 65% close rate at this stage

Risks:
• No response in 3 days
• Competitor mentioned in last call note

Suggested: Follow up today
```

API prompt:
```javascript
`Predict the win probability for this sales deal.

Deal data: ${JSON.stringify(dealData)}
Historical context: Similar deals at "Proposal" stage have 65% close rate.

Analyze and respond ONLY as JSON:
{
  "probability": 0-100,
  "trend": "up|down|stable",
  "trendDelta": number,
  "positiveFactors": ["...", "..."],
  "riskFactors": ["...", "..."],
  "suggestedAction": "one sentence"
}
`
```

---

### Project Delay Risk Prediction (PMS Module)

On Project cards and list, show risk badge:

```
Project: Nykaa App Redesign
Deadline: May 15
⚠️ AI Risk: HIGH — 73% chance of delay

Reasons: Hours behind schedule, 2 open blockers, team utilization at 94%
[View Details]
```

On PMS dashboard, add **"AI Risk Analysis"** card:
- Lists all at-risk projects sorted by delay probability
- Color coded: 🔴 >70% | 🟡 40-70% | 🟢 <40%

---

### Expense Anomaly Detection (Finance Module)

On Expenses page, AI flags unusual expenses:

```
⚠️ AI Flag: This expense (₹45,000 — Team Dinner) is 3.2x higher
than your team's average meal expense (₹14,000).
[Review] [Approve Anyway] [Reject]
```

On Finance dashboard, add **"AI Anomalies"** card showing flagged items.

---

## 🤖 FEATURE 7 — AI Automation Builder (Enhanced)

Upgrade existing Automations section in every module with AI-powered rule suggestions.

### AI Suggested Automations

On every module's Automations page, add **"✦ AI Suggestions"** section at top:

```
✦ ARIA suggests these automations for Sales:

[Enable]  When a deal is inactive for 7+ days
          → Send follow-up reminder to deal owner
          "Based on 8 deals going cold this month"

[Enable]  When lead score drops below 3
          → Auto-assign to review queue
          "2 leads lost last week due to this"

[Enable]  When deal moves to Negotiation
          → Notify Sales Manager
          "Currently done manually — 100% of cases"
```

Each suggestion has context ("why ARIA is suggesting this").

---

### Natural Language Automation Creation

In automation rule builder, add **"✦ Describe in plain English"** option:

```
Instead of building rules manually, describe what you want:

[When a project deadline is missed, notify the PM and their manager,
 and automatically change project status to Overdue           ]

[✦ Generate Rule]
```

AI converts plain text to structured rule:
```javascript
`Convert this automation description to a structured rule for a CRM:

"${userDescription}"
Module: ${module}

Respond ONLY as JSON:
{
  "trigger": { "event": "...", "condition": "..." },
  "actions": [
    { "type": "notify", "target": "...", "message": "..." },
    { "type": "update_field", "field": "...", "value": "..." }
  ],
  "name": "Short automation name"
}
`
```

Show generated rule in visual builder for user to confirm before saving.

---

## 🎨 AI UI DESIGN SYSTEM

### AI Elements — Visual Identity

All AI-powered elements use consistent visual treatment:

**AI Badge/Label:**
```css
.ai-badge {
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: white;
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
/* Content: ✦ AI  or  ✦ ARIA */
```

**AI Suggestion Field Overlay:**
- Light purple/indigo tinted background on suggested fields
- Small "✦ AI suggested" label below field
- Accept (✓) and Edit (✎) icons inline

**AI Loading State:**
- Animated shimmer with subtle purple tint
- Text: "✦ ARIA is thinking..." with pulsing dot

**AI Confidence Indicator:**
- Green dot: High confidence (≥ 80%)
- Amber dot: Medium confidence (50–80%)
- Show as tooltip: "AI is 84% confident in this suggestion"

**ARIA Panel:**
- Header: deep indigo/violet gradient
- Messages: clean chat bubbles (user = right, ARIA = left with ✦ icon)
- Quick action chips below ARIA messages (clickable)

---

## 📍 WHERE AI APPEARS IN THE UI (Complete Map)

| Location | AI Feature |
|----------|-----------|
| Every dashboard (top) | ARIA Digest card (dismissible) |
| Header → Right Strip | ARIA chat panel icon (✦) |
| Notification bell | AI-prioritized, grouped notifications |
| Every create/edit form | "✦ AI Assist" button + field suggestions |
| Sales → Deal rows | Win probability bar + % |
| Sales → Pipeline | Risk indicators on cold deals |
| PMS → Project cards | Delay risk badge + % |
| PMS → Resources | Overallocation warning (AI flagged) |
| Finance → Expenses | Anomaly flags on unusual amounts |
| Finance → Dashboard | AI Anomalies card |
| Every Reports page | "✦ Generate AI Report" button |
| Every Automations page | AI suggested automations + NL builder |
| WoW → Create | AI form fill suggestions |
| FRD → Create | AI skeleton generator |
| Notification panel | AI priority grouping + smart summaries |
| ARIA panel (persistent) | Full conversational AI assistant |

---

## ⚡ AI PERFORMANCE RULES

- All AI calls: non-blocking (never freeze UI)
- Show loading skeleton/shimmer during AI call
- Timeout after 10 seconds → show fallback: "AI suggestion unavailable. Please fill manually."
- Cache AI suggestions per session (don't re-call for same input)
- AI errors: silent fail with graceful fallback (no error modals)
- Never make AI calls on every keystroke — debounce 800ms or trigger on button click
- AI calls happen in background when user navigates to a page (pre-fetch digest)

---

## 🧩 MOCK AI RESPONSES

Since this is frontend-only with mock data, simulate AI responses with realistic hardcoded responses that rotate/vary. When Anthropic API is called and returns a result, use it. When API is unavailable, use mock responses.

Mock response examples must be realistic, not generic:
- Specific numbers from mock data
- Indian context (₹, Indian names, Indian companies)
- Actionable suggestions, not vague

---

## ✅ ACCEPTANCE CRITERIA — PHASE 3

**ARIA Assistant:**
- [ ] ✦ icon in right strip opens ARIA panel
- [ ] ARIA panel slides in from right, stays open across navigation
- [ ] User can type any question and get AI response
- [ ] Quick action chips work (Summarize / Draft / Find)
- [ ] ARIA Digest card appears on every dashboard (dismissible)
- [ ] Digest shows 3-5 relevant items based on current module

**Smart Forms:**
- [ ] Every create/edit form has "✦ AI Assist" button
- [ ] Clicking AI Assist shows suggestions for empty fields
- [ ] Accept / Edit / Skip works per field
- [ ] "Accept All" fills all suggested fields
- [ ] AI suggested badge shown on accepted fields

**Auto-categorization:**
- [ ] Expenses auto-categorized on title input
- [ ] Leads auto-scored on creation
- [ ] Tasks auto-prioritized based on title
- [ ] Confidence shown — low confidence = suggestion only

**AI Report Generator:**
- [ ] Every Reports page has "✦ Generate AI Report" button
- [ ] Modal with report type + period + options
- [ ] Report renders with all 5 sections
- [ ] Export PDF and Copy Text buttons work

**Smart Notifications:**
- [ ] Notifications grouped by AI priority (Urgent / Important / FYI)
- [ ] Each notification has AI summary + action button
- [ ] Critical count badge on bell icon

**Predictions:**
- [ ] Win probability shown on every Sales deal row
- [ ] Probability popover with factors and risks
- [ ] Project delay risk badge on PMS project cards
- [ ] AI Risk Analysis card on PMS dashboard
- [ ] Expense anomaly flags on Finance expenses

**AI Automations:**
- [ ] AI suggested automations shown at top of automations page
- [ ] Each suggestion has "Enable" button and context reason
- [ ] NL automation creator: type description → AI generates rule → confirm

**Design:**
- [ ] All AI elements use ✦ icon consistently
- [ ] AI badge gradient (indigo → violet) consistent everywhere
- [ ] AI loading shimmer with purple tint
- [ ] Confidence indicators (green/amber dots)
- [ ] ARIA panel header in deep indigo

---

*Phase 3 builds on Phase 1 (Shell + Sales + System Admin) and Phase 2 (All 10 modules complete). This phase makes the CRM AI-first using Claude AI (Anthropic API). Preserve all existing work. Add AI as an intelligent layer on top.*

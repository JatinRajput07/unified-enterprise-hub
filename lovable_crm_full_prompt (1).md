# Lovable Prompt — Enterprise CRM: Full Build (Phase 2)

---

## 🔒 PRESERVE EVERYTHING EXISTING

Do NOT break or remove anything already built:
- CRM Shell layout (Header, L1 sidebar, L2 sidebar, Right strip, Footer)
- Sales module (all pages)
- System Admin / RBAC UI
- Mock data structure
- Dark/light theme toggle mechanism

Only ADD and EXTEND. No regressions.

---

## 🎨 THEME CHANGE — Dark → Light + Colorful (Professional)

Switch the default theme from dark to **light, colorful, and professional**.

### New Color System
```css
/* Base */
--bg-base:        #F8FAFC;
--bg-surface:     #FFFFFF;
--bg-elevated:    #F1F5F9;
--bg-hover:       #EFF6FF;
--border:         #E2E8F0;

/* Text */
--text-primary:   #0F172A;
--text-secondary: #64748B;
--text-disabled:  #CBD5E1;

/* Module accent colors */
--accent-wayofwork:  #6366F1;
--accent-finance:    #0EA5E9;
--accent-sysadmin:   #EF4444;
--accent-pms:        #8B5CF6;
--accent-master:     #14B8A6;
--accent-sales:      #3B82F6;
--accent-frd:        #F59E0B;
--accent-portfolio:  #EC4899;
--accent-staffing:   #10B981;
--accent-canteen:    #F97316;

/* Status */
--success: #22C55E;
--warning: #F59E0B;
--danger:  #EF4444;
--info:    #3B82F6;
```

### Light Theme Rules
- Header: white bg, bottom border #E2E8F0
- L1 sidebar: #F8FAFC bg, active item = module accent left border (3px) + tinted bg
- L2 sidebar: white bg, section labels muted uppercase 10px
- Cards: white bg, 1px solid #E2E8F0, border-radius 8px
- KPI card: left border 3px solid (module accent)
- Tables: alternating rows #F8FAFC / white, hover #EFF6FF
- Primary button: module accent bg + white text
- Keep dark mode working via footer toggle

---

## 🗂️ MODULE 1 — WayOfWork (WoW) — COMPLETE BUILD

### What is WayOfWork?
Every employee documents their own work — what they do, how they do it, how long it takes, what tools they use, step-by-step. Manager validates. Approved WoWs become training material assignable to other employees for role readiness and promotions.

---

### L2 Sidebar Menu Items:
Dashboard | My WoWs | Create WoW | Review Queue | Assign Training | My Training | WoW Library | Automations

---

### `/wayofwork` — Dashboard

**KPI Cards (7 cards):**
- Total WoWs | Approved | Pending Review | Rejected | Assigned as Training | My Training Pending | Avg Completion Time

**Charts:**
- Bar chart: WoWs by frequency (Daily / Weekly / Monthly / Bi-weekly / Quarterly / Ad-hoc)
- Donut: WoW types (Workflow / Activity / Process / SOP / Checklist / Report / Meeting)

**Tables:**
- "My Recent WoWs" — title, type badge, frequency, status, submitted date
- "Pending My Review" — visible to Manager/Admin only

**Activity Log (right column):**
- "Priya M submitted Daily Standup WoW — 2m ago"
- "Manager approved Report Generation Process — 15m ago"
- "WoW assigned to Rahul as training — 1h ago"

---

### `/wayofwork/my-wows` — My WoW List

**Full table columns:**
Title | Type | Frequency | Status | Time Required | Submitted | Approval Status | Actions

**Status badges:** Draft (gray) | Submitted (blue) | Approved (green) | Rejected (red) | Training Assigned (purple)

**Actions per row:** View | Edit (Draft/Rejected only) | Submit | Delete (Draft only)

**Filters:** Type | Frequency | Status | Date Range

**Bulk actions toolbar:** Submit Selected | Delete Selected

---

### `/wayofwork/create` — Create / Edit WoW

Full form with ALL these fields:

**BASIC INFO**
- Title * (text input)
- Description * (rich text — bold, italic, bullet list, numbered list, headings)
- Responsibility * (who owns this — text)
- Type * (select: Workflow | Activity | Process | SOP | Checklist | Report | Meeting | Other)
- Frequency * (select: Daily | Weekly | Bi-weekly | Monthly | Quarterly | Ad-hoc | One-time)

**TIME & EFFORT**
- Estimated Time per Occurrence * (number + unit dropdown: minutes / hours)
- Actual Average Time (optional)
- Best Time to Perform (Morning / Afternoon / End of Day / Anytime)

**STEPS / PROCESS (dynamic list)**
- Step 1 text input, Step 2 text input... up to 20 steps
- "+ Add Step" button
- Drag to reorder (drag handle icon)
- Delete step (x button)

**TOOLS & SYSTEMS USED**
- Multi-tag input (type + enter: "Slack", "Jira", "Excel")

**ATTACHMENTS**
- Upload files (PDF, DOC, XLSX, PNG, MP4) — shows file list with remove button
- Add Link (URL input + link title) — shows as card: favicon + title + URL + remove
- Supports YouTube, Drive, Loom, Notion links

**VISIBILITY**
- Visible to: My Team only | My Department | Organization-wide

**NOTES / TIPS**
- Optional plain text area

**Form Actions:**
- `Save as Draft` — saves, status = Draft
- `Submit for Review` — status → Submitted, notifies manager
- `Cancel`

Validation: required fields, inline errors, cannot submit with empty required fields.

---

### `/wayofwork/review` — Review Queue (Manager / Admin / Dept Head only)

Hidden for Employees — render only if role = Manager, Dept Head, or Admin.

**Split layout:**
- Left panel (35%): scrollable list of pending WoWs
  - Employee avatar + name | WoW title | Type chip | Submitted date
  - Click to load in right panel
- Right panel (65%): full read-only WoW detail + attachments

**Action buttons (right panel bottom):**
- `Approve` (green) → status = Approved, notify employee
- `Reject` (red) → modal: "Reason for rejection" textarea (required) → status = Rejected, notify employee with reason
- `Request Changes` (amber) → same as reject, different label in notification

**Filter bar:** Department | Team | Type | Date Range

---

### `/wayofwork/assign-training` — Assign as Training (Manager / Admin)

**Step 1:** Search Approved WoWs — searchable table (title, type, owner, department)
- Select one or multiple WoWs via checkbox

**Step 2:** Click "Assign as Training" → Modal opens:
- Assignee multi-select (from team members)
- Due Date (date picker, optional)
- Note to trainee (textarea, optional)
- `Confirm Assign` button

On submit: WoW appears in assignee's My Training with status "Not Started".

---

### `/wayofwork/training` — My Training

**Table:** WoW Title | Assigned By | Type | Assigned Date | Due Date | Status | Actions

**Status:** Not Started (gray) | In Progress (blue) | Completed (green)

**Actions per row:**
- `View WoW` — read-only full detail view in slide-over panel
- `Mark In Progress` — updates status
- `Mark Completed` — updates status, notifies assigner
- Progress bar per row

---

### `/wayofwork/library` — WoW Library

Searchable org-wide library of all Approved WoWs (filtered by visibility setting).

**Filter bar:** Department | Type | Frequency | Author | Tags

**Card grid view:**
- Title | Type badge | Frequency badge | Owner avatar + name | Approved date
- Click → read-only slide-over detail view

---

### `/wayofwork/automations` — WoW Automations

List of active automations with toggle on/off:
- "When WoW is submitted → Notify manager"
- "When WoW is approved → Notify employee"
- "When WoW is rejected → Notify employee with reason"
- "When training is assigned → Notify trainee"
- "3 days before training due date → Send reminder"

"+ New Automation" → rule builder modal:
- Trigger dropdown | Condition | Action
- Save automation

---

## 💰 MODULE 2 — Finance — ALL PAGES

L2 Menu: Dashboard | Invoices | Expenses | Budget | P&L | Reports | Approvals | Automations

### `/finance` — Dashboard
KPI Cards: Total Revenue MTD | Total Expenses MTD | Net P&L | Pending Invoices | Overdue Amount | Budget Utilization %

Charts: Revenue vs Expenses line (12 months) | Expense breakdown donut

Tables: Recent Invoices (last 10) | Pending Approvals | Top 5 Expense Categories

Activity Log: "Invoice #INV-0042 paid by TechCorp — 5m ago"

---

### `/finance/invoices` — Invoices

Table: Invoice # | Client | Amount | Issue Date | Due Date | Status | Actions

Status: Draft (gray) | Sent (blue) | Paid (green) | Overdue (red) | Cancelled (gray)

Actions: View | Edit | Download PDF | Mark as Paid | Send Reminder | Delete

"+ Create Invoice" button → slide-over form:
- Client name, Invoice #, Issue date, Due date
- Line items table (description, qty, rate, tax%) — add/remove rows, auto-calculate total
- Notes, payment terms
- Save Draft / Send Invoice

Filters: Status | Date Range | Client | Amount Range

---

### `/finance/expenses` — Expenses

Table: Title | Category | Amount | Submitted By | Date | Status | Receipt | Actions

Status: Pending (amber) | Approved (green) | Rejected (red) | Reimbursed (teal)

"+ Add Expense" → form: title, amount, category, date, description, receipt upload

Approval flow: Manager sees pending → Approve / Reject with reason

---

### `/finance/budget` — Budget

Top cards per department: Allocated | Spent | Remaining | % Used with color progress bar

Table: Department | Category | Allocated | Spent | Remaining | Status

"Set Budget" (Admin only) → modal: dept, category, amount, period

---

### `/finance/pl` — P&L Statement

Period selector: Monthly / Quarterly / Yearly

Statement with sections: Revenue | COGS | Gross Profit | Operating Expenses | Net Profit/Loss

YoY comparison column. Export: PDF | Excel buttons.

---

### `/finance/reports` — Reports

Cards: Revenue Summary | Expense Report | Invoice Aging | Budget vs Actual | Cash Flow

Each card: description + "Generate Report" → table/chart + Export button

---

### `/finance/approvals` — Approvals

Unified pending list: expenses + budget requests. Approve / Reject with reason. Bulk actions.

---

## 📋 MODULE 3 — PMS — ALL PAGES

L2 Menu: Dashboard | Projects | My Tasks | Timesheets | Resources | Reports | Automations

### `/pms` — Dashboard
KPI Cards: Active Projects | On Track | At Risk | Overdue | Hours Logged (MTD) | Team Utilization %

Charts: Project health grid (RAG cards) | Hours per project (bar) | Timeline this week (compact Gantt)

### `/pms/projects` — All Projects
Table: Name | Client | PM | Status | Start | Deadline | Hours (Logged/Total) | Health | Actions

Create Project → form (all fields from Master Sheet)

### `/pms/projects/[id]` — Project Detail (8 tabs)
1. Overview — client, PM, team, dates, budget, status summary
2. Team — members, roles, join dates, hours contributed
3. Timeline — Gantt chart with phases and milestones
4. Tasks — Kanban (To Do / In Progress / Review / Done) + list view toggle
5. Hours — time log table: who, when, hours, description
6. Changes — client change requests and addons with approval status
7. Documents — files and links
8. Activity — full audit log

### `/pms/tasks` — My Tasks
Table + Kanban toggle: Task | Project | Priority | Due Date | Status | Actions

Priority: Critical (red) | High (orange) | Medium (amber) | Low (gray)

### `/pms/timesheets` — Timesheets
Weekly grid: rows = projects, columns = Mon-Sun. Click cell → hours + description modal.
Submit week → manager approval. Table view: Date | Project | Task | Hours | Status.

### `/pms/resources` — Resources
Heatmap: member × week, color = utilization %. Table: Member | Projects | Allocated hrs/wk | Available.

### `/pms/reports` — Reports
Project Status | Resource Utilization | Hours Summary | Deadline Tracker — each generates table + chart.

---

## 📊 MODULE 4 — Master Sheet — ALL PAGES

L2 Menu: Dashboard | Projects | Change Requests | Analytics

### `/master-sheet` — Dashboard
KPI Cards: Total Projects | Active | Completed | Total Client Value | Avg Duration | On-Time %

Charts: Projects by status (donut) | Revenue by month (bar) | Projects by team (bar)

### `/master-sheet/projects` — Master Registry

Mega table columns:
Project ID | Name | Client | Client Contact | PM | Team | Start | Original Deadline | Current Deadline | Status | Type | Tech Stack | Contracted Hours | Spent Hours | Budget | Actual Cost | Addons | Changes | Health

Expandable row → full client details, all team members, change log, invoices, documents.

"+ Create Project" / "Edit" → full form:

CLIENT: Name*, Company, Email, Phone, Country, Timezone

PROJECT: Name*, Type (Web/Mobile/API/Design/Consulting/Other), Description, Tech Stack (multi-tag), Repo URL, Staging URL, Production URL

TEAM: PM* (user select), Developers (multi-select), Designer, QA, Other roles (dynamic)

TIMELINE: Start Date*, Original Deadline*, Current Deadline (auto-filled), Milestones (name + date, dynamic)

FINANCIALS: Contracted Hours, Rate type (hourly/fixed), Contract Value, Payment Schedule

STATUS: Status dropdown, Health dropdown, Completion % slider

### `/master-sheet/changes` — Change Requests
Table: Project | Change Title | Requested By | Date | Impact (hrs/cost) | Status | Approved By

Status: Pending | Approved | Rejected | Implemented

### `/master-sheet/analytics` — Analytics
On-time delivery rate | Budget overrun analysis | Team performance | Client retention charts.

---

## 🛒 MODULE 5 — Sales — EXTEND EXISTING

Preserve all existing pages. Add:

### `/sales/activities` — Activities
Table: Type | Contact/Company | Done By | Date | Notes | Outcome | Next Step

Types: Call | Email | Meeting | Demo | Proposal Sent | Follow-up

"+ Log Activity" → modal form

### `/sales/forecasts` — Forecasts
Table: Deal | Owner | Value | Close Date | Probability % | Weighted Value | Stage

Chart: Forecast by month (stacked bar by stage)

Summary cards: Total Pipeline | Weighted Forecast | Best Case | Commit

---

## 📝 MODULE 6 — FRD — ALL PAGES

L2 Menu: Dashboard | All FRDs | Create FRD | Review Queue | Archived | Automations

### `/frd` — Dashboard
KPI Cards: Total FRDs | Drafts | In Review | Approved | Archived | Avg Review Time (days)

### `/frd/documents` — All FRDs
Table: Title | Project | Author | Version | Status | Created | Updated | Actions

Status: Draft | In Review | Approved | Archived

Actions: View | Edit | Duplicate | Download PDF | Archive | Delete

### `/frd/create` — Create FRD
Fields:
- Title*, Project link (select from Master Sheet), Version (auto v1.0), Author (current user)
- Description / Scope (rich text)
- Sections (dynamic, drag to reorder): Section Name + rich text body + Requirements sub-table
- Requirements table per section: Req ID (auto FR-001) | Description | Priority (Must/Should/Could/Won't) | Status
- Attachments (files + links)
- Reviewer select + Submit for Review button

### `/frd/[id]` — FRD Detail
Full rendered document, version history sidebar, comment thread per section, Approve / Request Changes (reviewer only), Download PDF.

### `/frd/review` — Review Queue (Reviewer / Manager / Admin)
Same split-panel layout as WoW review. Approve / Request Changes.

---

## 🗂️ MODULE 7 — Portfolio — ALL PAGES

L2 Menu: Dashboard | Clients | Projects | Health | Automations

### `/portfolio` — Dashboard
KPI Cards: Total Clients | Active Projects | Completed | Portfolio Value | Avg Project Value | Client Retention %

Charts: By industry (donut) | Revenue by client (bar) | Timeline Gantt overview

### `/portfolio/clients` — Clients
Card grid (toggle to table): Logo/initials | Company | Industry | Country | Active Projects | Total Value | Health

Client detail page `/portfolio/clients/[id]` tabs: Overview | Projects | Contacts | Invoices | Documents | Activity

### `/portfolio/projects` — Projects
Card view: project name, client, duration, tech stack badge cluster, outcome, PM avatar

Toggle to table view.

### `/portfolio/health` — Health RAG
Grid of cards per active project: name, client, PM, health badge (🟢🟡🔴), days to deadline, hours remaining.

Filter by: On Track | At Risk | Overdue

---

## 👥 MODULE 8 — Staffing Solutions — ALL PAGES

L2 Menu: Dashboard | Employees | Jobs | Candidates | Interviews | Headcount | Allocations | Automations

### `/staffing` — Dashboard
KPI Cards: Total Headcount | Open Positions | Candidates in Pipeline | Interviews This Week | Offers Extended | Avg Time to Hire (days)

Charts: Headcount by department (bar) | Hiring funnel | Open vs Filled (bar)

### `/staffing/employees` — Employee Directory
Table: Name | Emp ID | Department | Team | Role | Manager | Join Date | Status | Actions

Status: Active (green) | On Leave (amber) | Probation (blue) | Resigned (gray) | Terminated (red)

Employee detail `/staffing/employees/[id]` tabs: Profile | Role History | Teams | WoW Training | Documents | Notes

### `/staffing/jobs` — Job Openings
Table: Title | Department | Team | Type | Posted | Applicants | Status | Actions

Status: Draft | Open | Closed | On Hold

"+ Create Job" → form: title, dept, description, requirements, salary range, type (Full-time/Part-time/Contract)

### `/staffing/candidates` — Candidate Pipeline
Kanban stages: Applied → Screening → Interview 1 → Interview 2 → Technical Test → Offer → Hired / Rejected

Candidate card: Name | Role | Source | Date | Assigned To

Candidate detail slide-over: resume viewer area, interview notes, stage history, star rating

Toggle to table view.

### `/staffing/interviews` — Interview Schedule
Calendar view (week toggle) + Table view

Table: Candidate | Role | Round | Interviewer(s) | Date & Time | Mode (Online/Offline) | Status | Feedback

"+ Schedule Interview" → modal form

### `/staffing/headcount` — Headcount Planning
Table: Department | Current | Planned | Variance | Budget

Chart: Headcount trend 12 months (line)

### `/staffing/allocations` — Allocations
Which employees are on which projects. Sync display with PMS resources.

---

## 🍽️ MODULE 9 — Canteen — ALL PAGES

L2 Menu: Dashboard | Menu | Orders | Inventory | Feedback | Reports | Automations

### `/canteen` — Dashboard
KPI Cards: Today's Orders | Meals This Month | Revenue MTD | Most Popular Item | Avg Rating ⭐ | Waste %

Charts: Orders by day bar (30 days) | Category breakdown donut

### `/canteen/menu` — Menu Management
Table: Item Name | Category | Price | Available Today | Calories | Allergens | Photo | Actions

Categories: Breakfast | Lunch | Dinner | Snacks | Beverages

"+ Add Item" → form: name, category, price, description, photo upload, allergens multi-tag, available toggle

"Mark Available Today" toggle per item.

### `/canteen/orders` — Orders
Table: Order # | Employee | Items | Total | Time | Status | Actions

Status: Pending (amber) | Preparing (blue) | Ready (teal) | Delivered (green) | Cancelled (red)

Order detail modal: itemized bill, employee name, timestamps.

Filter: Date | Status | Employee

### `/canteen/inventory` — Inventory
Table: Item | Category | Current Stock | Unit | Reorder Level | Status | Last Updated | Actions

Status: In Stock (green) | Low Stock (amber) | Out of Stock (red)

Low stock alert cards at top.

"+ Add Stock" → form: item, quantity, supplier, cost.

### `/canteen/feedback` — Feedback
Table: Employee | Date | Item | Rating (⭐) | Comment | Actions

Summary section: Avg rating per item (top 5 / bottom 5) | Rating trend line chart

"+ Submit Feedback" → modal: select item, star rating, comment

### `/canteen/reports` — Reports
Daily Order Summary | Monthly Revenue | Inventory Consumption | Popular Items | Waste Report

Each → table + chart + Export button.

---

## 🌐 GLOBAL RULES — APPLY TO ALL MODULES

### Every Dashboard Page Must Have:
1. KPI cards row (5–8 cards) with trend arrows ↑↓ and % change vs last period
2. At least 2 charts (primary + secondary)
3. Data table with sort, filter, pagination (25/50/100 rows)
4. Activity log (right column or bottom section)
5. Primary CTA button ("+ Create", "+ Add", etc.)

### Every Page Must Have:
- Breadcrumb in topbar: "Module > Page"
- No empty states without a CTA button
- Every button has an action (no dead buttons)
- All filter chips actually filter the displayed data
- All create/edit modals submit and update UI with mock data
- Status badges consistently colored across all modules
- Loading skeleton for tables (not spinners)

### Empty State Design (when table/list is empty):
- Centered illustration placeholder (simple SVG shape, not image)
- Title: "No [items] yet"
- Subtitle: "Get started by creating your first [item]"
- Primary CTA button

### Automations Page (every module has `/module/automations`):
List of automations with:
- Name | Trigger | Action | Status (Active/Inactive) | Last Triggered | Toggle

"+ New Automation" → rule builder:
- Trigger: dropdown "When [event]..."
- Condition: "If [field] is [value]"
- Action: "Then [notify / update / assign / create]"
- Save button

### Notifications System:
- All form submits trigger in-app notification
- Approval flows notify reviewer
- Rejections notify submitter with reason
- Bell icon in header shows unread count badge
- Notification panel: grouped by module, mark as read, filter by module

---

## 🧩 MOCK DATA

Use realistic Indian context mock data throughout:

Names: Rahul Sharma, Priya Mehta, Anita Kapoor, Dev Tiwari, Kiran Bose, Sara Joshi, Aarav Patel, Meera Nair, Vikram Singh, Neha Gupta

Companies: TechCorp India, Infosys, HCL Technologies, Wipro, Zomato, Swiggy, Razorpay, Zepto, Urban Company, Nykaa

Currency: ₹ (INR) for all financial figures

Realistic figures: Invoice amounts ₹50,000–₹15,00,000 | Salaries ₹4L–₹25L | Project values ₹2L–₹50L

All tables: minimum 8–10 rows of varied data

Dates: Last 90 days to next 90 days range

Status variety: Not all rows same status — mix Active/Pending/Completed/Rejected

---

## ✅ ACCEPTANCE CRITERIA

- [ ] Default theme: light, colorful, professional — dark mode toggle still works
- [ ] All 10 modules in L1 sidebar with unique accent colors
- [ ] Every L2 menu item navigates to a populated, functional page
- [ ] WayOfWork: full lifecycle working (create → submit → review → approve/reject → assign training → complete)
- [ ] Finance: all 7 pages with mock data and functional forms
- [ ] PMS: all 6 pages, project detail has all 8 tabs populated
- [ ] Master Sheet: mega table with expandable rows, full create/edit form
- [ ] Sales: extended with Activities and Forecasts pages
- [ ] FRD: create + review + approval flow working
- [ ] Portfolio: client cards + RAG health grid
- [ ] Staffing: Kanban pipeline + interview calendar
- [ ] Canteen: menu + orders + inventory + feedback all functional
- [ ] Zero empty pages
- [ ] Zero dead buttons
- [ ] All modals functional with mock data update on submit
- [ ] Activity log on every dashboard
- [ ] Automations section on every module
- [ ] Global search Cmd+K works
- [ ] Notifications bell updates
- [ ] Breadcrumb correct on every page

---

*This is a continuation build. Preserve existing shell and Sales + System Admin. Extend with all modules above. Light theme by default.*

# Product Requirements Document (PRD)

## Darbo įrankių apskaitos valdymo sistema
### Work Tool Inventory Management System

**Version:** 1.0  
**Date:** 2024  
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Problem](#business-problem)
3. [System Overview](#system-overview)
4. [User Roles](#user-roles)
5. [Feature List](#feature-list)
6. [Permissions Matrix](#permissions-matrix)
7. [User Workflows](#user-workflows)
8. [Pages & User Interface](#pages--user-interface)
9. [Database Schema](#database-schema)
10. [API Requirements](#api-requirements)
11. [Technical Specifications](#technical-specifications)
12. [Future Improvements](#future-improvements)

---

## Executive Summary

The Work Tool Inventory Management System is a comprehensive web application designed to help construction companies efficiently track, manage, and account for their work tools. The system leverages QR code technology to enable quick tool identification and tracking, supports multi-user access with role-based permissions, and provides real-time analytics for inventory management.

**Key Objectives:**
- Digitize tool inventory management
- Reduce tool loss and misplacement
- Improve accountability through employee tracking
- Enable project-based tool allocation
- Provide real-time visibility into tool status and location

---

## Business Problem

Construction companies face significant challenges in managing their tool inventory:

1. **Tool Loss and Theft:** Without proper tracking, tools frequently go missing, resulting in financial losses and project delays.

2. **Lack of Accountability:** Companies struggle to identify which employee has which tool at any given time, making it difficult to recover tools or assign responsibility.

3. **Inefficient Manual Processes:** Traditional paper-based or spreadsheet tracking is time-consuming, error-prone, and doesn't scale.

4. **Project Allocation Confusion:** Tools are often assigned to projects without clear tracking, leading to confusion about tool availability and location.

5. **No Historical Data:** Companies lack insights into tool usage patterns, maintenance needs, and inventory trends.

6. **Mobile Accessibility:** Field workers need quick access to tool information without returning to the office.

**Solution:** A digital inventory management system with QR code tracking, mobile-friendly interface, and comprehensive reporting capabilities.

---

## System Overview

### Core Functionality

The system provides a centralized platform for:
- **Tool Registration:** Add new tools to inventory with detailed information
- **QR Code Generation:** Automatically generate unique QR codes for each tool
- **Employee Management:** Create and manage employee accounts with role-based access
- **Project Management:** Assign tools to specific projects using project codes (e.g., P2652)
- **Check-out/Check-in:** Track tool movements between employees and projects
- **Status Tracking:** Monitor tool status (available, checked out, maintenance, retired)
- **Usage History:** Maintain complete audit trail of all tool transactions
- **Analytics Dashboard:** Visualize inventory metrics and trends

### Technology Stack

- **Frontend Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Internationalization:** Lithuanian (default), English

### System Architecture

- **Web Application:** Responsive web interface accessible from desktop and mobile devices
- **Mobile-Optimized:** QR code scanning functionality optimized for mobile browsers
- **RESTful API:** Backend API for all data operations
- **Database:** Relational database with proper normalization

---

## User Roles

### 1. Administrator

**Responsibilities:**
- Full system access and configuration
- User management (create, edit, deactivate accounts)
- Tool inventory management (add, edit, delete tools)
- Project management
- System settings and configuration
- View all reports and analytics
- Generate QR codes and print stickers
- Override check-out/check-in operations if needed

**Access Level:** Full system access

### 2. Employee

**Responsibilities:**
- View available tools
- Check out tools for assigned projects
- Return tools
- Scan QR codes to view tool information
- View personal tool history
- Update personal profile

**Access Level:** Limited to personal operations and assigned tools

---

## Feature List

### 1. Authentication & Authorization

#### 1.1 User Authentication
- **Login:** Email/password authentication
- **Session Management:** Secure session handling with NextAuth
- **Password Reset:** Self-service password reset functionality
- **Multi-language Support:** Login page available in Lithuanian and English

#### 1.2 Role-Based Access Control
- Role-based permission system
- Route protection based on user roles
- API endpoint protection

### 2. Tool Inventory Management

#### 2.1 Tool Registration
- Add new tools with details:
  - Tool name
  - Category/type
  - Manufacturer
  - Model number
  - Serial number
  - Purchase date
  - Purchase price
  - Description
  - Initial status
- Automatic QR code generation upon tool creation
- Bulk import capability (CSV/Excel)

#### 2.2 Tool Management
- Edit tool information
- Update tool status
- Archive/retire tools
- Delete tools (with restrictions)
- Search and filter tools
- View tool details

#### 2.3 QR Code Management
- Generate unique QR codes for each tool
- Print QR code stickers (PDF generation)
- QR code contains tool ID and basic information
- Mobile-optimized QR scanning interface

### 3. Employee Management

#### 3.1 Employee Accounts
- Create employee accounts (Administrator only)
- Edit employee information:
  - Name
  - Email
  - Phone number
  - Department
  - Role
  - Status (active/inactive)
- Deactivate/reactivate accounts
- View employee tool history

#### 3.2 Employee Profile
- Self-service profile management
- View personal tool assignments
- View personal check-out history

### 4. Project Management

#### 4.1 Project Codes
- Create project codes (e.g., P2652)
- Project code format: Letter prefix + numbers
- Project information:
  - Project code
  - Project name
  - Description
  - Start date
  - End date (optional)
  - Status (active/completed)
- Assign tools to projects

#### 4.2 Project Assignment
- Link tools to projects during check-out
- View all tools assigned to a project
- Project-based reporting

### 5. Tool Check-out & Return

#### 5.1 Check-out Process
- Select tool(s) to check out
- Select employee (or self for employees)
- Select project code
- Add notes/remarks
- Confirm check-out
- Update tool status to "Checked Out"
- Record transaction in history

#### 5.2 Return Process
- Scan QR code or select tool from list
- Verify tool condition
- Add return notes
- Confirm return
- Update tool status to "Available"
- Record return transaction

#### 5.3 Check-out Methods
- **Web Interface:** Standard check-out form
- **QR Code Scanning:** Mobile-optimized scanning interface
- **Bulk Operations:** Check out multiple tools at once

### 6. Tool Status Tracking

#### 6.1 Status Types
- **Available:** Tool is in inventory and ready for use
- **Checked Out:** Tool is currently assigned to an employee/project
- **Maintenance:** Tool is under maintenance/repair
- **Retired:** Tool is no longer in active use
- **Lost:** Tool has been reported as lost
- **Damaged:** Tool is damaged and needs attention

#### 6.2 Status Management
- Update tool status manually
- Automatic status updates during check-out/return
- Status change history

### 7. Tool Usage History

#### 7.1 Transaction History
- Complete audit trail of all tool movements
- History includes:
  - Date and time
  - Action type (check-out, return, status change)
  - Employee involved
  - Project code
  - Tool information
  - Notes/remarks
- Filterable and searchable history

#### 7.2 Reporting
- Tool usage reports
- Employee activity reports
- Project tool allocation reports
- Status distribution reports

### 8. QR Code Scanning

#### 8.1 Mobile Scanning Interface
- Mobile-optimized QR code scanner
- Camera access for QR code scanning
- Manual QR code entry option
- Display tool information after scan
- Quick actions (check-out, return, view details)

#### 8.2 QR Code Information
- Tool ID
- Tool name
- Current status
- Current assignment (if checked out)
- Quick action buttons

### 9. QR Sticker Printing

#### 9.1 Sticker Generation
- Generate printable QR code stickers
- PDF format for printing
- Multiple size options
- Include tool name and ID on sticker
- Batch printing capability

### 10. Dashboard & Analytics

#### 10.1 Administrator Dashboard
- **Key Metrics:**
  - Total tools in inventory
  - Tools currently checked out
  - Tools available
  - Tools in maintenance
  - Total employees
  - Active projects
- **Charts & Visualizations:**
  - Tool status distribution (pie chart)
  - Check-out trends over time (line chart)
  - Most used tools (bar chart)
  - Employee activity (table/chart)
  - Project tool allocation
- **Recent Activity:**
  - Latest check-outs
  - Latest returns
  - Recent status changes

#### 10.2 Employee Dashboard
- Currently checked out tools
- Personal tool history
- Quick actions (check-out, return)

### 11. Search & Filtering

#### 11.1 Tool Search
- Search by:
  - Tool name
  - Category
  - Status
  - Serial number
  - Manufacturer
  - Current assignment
- Advanced filtering options
- Saved search filters

#### 11.2 Employee Search
- Search employees by name, email, department

#### 11.3 Project Search
- Search projects by code or name

### 12. Internationalization (i18n)

#### 12.1 Language Support
- Lithuanian (default)
- English
- Language switcher in navigation
- All UI elements translated
- Date/time formatting per locale

---

## Permissions Matrix

| Feature | Administrator | Employee |
|---------|--------------|----------|
| **Authentication** |
| Login | ✓ | ✓ |
| View own profile | ✓ | ✓ |
| Edit own profile | ✓ | ✓ |
| **Tool Management** |
| View tools | ✓ | ✓ |
| Add tools | ✓ | ✗ |
| Edit tools | ✓ | ✗ |
| Delete tools | ✓ | ✗ |
| Generate QR codes | ✓ | ✗ |
| Print QR stickers | ✓ | ✗ |
| **Employee Management** |
| View employees | ✓ | ✗ |
| Add employees | ✓ | ✗ |
| Edit employees | ✓ | ✗ |
| Deactivate employees | ✓ | ✗ |
| View all employee history | ✓ | ✗ |
| **Project Management** |
| View projects | ✓ | ✓ |
| Create projects | ✓ | ✗ |
| Edit projects | ✓ | ✗ |
| Delete projects | ✓ | ✗ |
| **Check-out/Return** |
| Check out tools | ✓ | ✓ (self only) |
| Return tools | ✓ | ✓ |
| View all check-outs | ✓ | ✗ |
| View own check-outs | ✓ | ✓ |
| **Status Management** |
| Update tool status | ✓ | ✗ |
| View status history | ✓ | ✗ |
| **History & Reports** |
| View all history | ✓ | ✗ |
| View own history | ✓ | ✓ |
| View analytics dashboard | ✓ | ✗ |
| Export reports | ✓ | ✗ |
| **System Settings** |
| Configure system settings | ✓ | ✗ |
| Manage languages | ✓ | ✗ |

---

## User Workflows

### Workflow 1: Tool Registration (Administrator)

1. Administrator navigates to "Tools" → "Add New Tool"
2. Fills in tool information form:
   - Tool name (required)
   - Category (required)
   - Manufacturer
   - Model number
   - Serial number
   - Purchase date
   - Purchase price
   - Description
3. Sets initial status (default: "Available")
4. Submits form
5. System generates unique QR code automatically
6. Administrator can print QR sticker immediately or later
7. Tool appears in inventory list

### Workflow 2: Tool Check-out (Employee)

**Method A: Web Interface**
1. Employee navigates to "Check-out Tools"
2. Searches/selects tool(s) from available inventory
3. Selects project code from dropdown
4. Adds optional notes
5. Confirms check-out
6. System updates tool status to "Checked Out"
7. Transaction recorded in history
8. Employee receives confirmation

**Method B: QR Code Scanning (Mobile)**
1. Employee opens mobile app/browser
2. Navigates to "Scan QR Code"
3. Grants camera permission
4. Scans tool's QR code
5. System displays tool information
6. Employee selects project code
7. Adds optional notes
8. Confirms check-out
9. System updates status and records transaction

### Workflow 3: Tool Return (Employee)

**Method A: Web Interface**
1. Employee navigates to "My Tools" or "Return Tools"
2. Views currently checked out tools
3. Selects tool to return
4. Verifies tool condition
5. Adds return notes (optional)
6. Confirms return
7. System updates status to "Available"
8. Transaction recorded

**Method B: QR Code Scanning**
1. Employee scans tool's QR code
2. System displays tool information and current assignment
3. Employee confirms return
4. Adds return notes (optional)
5. System updates status and records transaction

### Workflow 4: Project Assignment

1. Administrator creates new project:
   - Project code (e.g., P2652)
   - Project name
   - Description
   - Start date
2. During tool check-out, employee/project manager selects project code
3. System links tool to project
4. Administrator can view all tools assigned to project
5. Project reports show tool allocation

### Workflow 5: Tool Status Update (Administrator)

1. Administrator navigates to tool details
2. Updates tool status (e.g., to "Maintenance")
3. Adds status change notes
4. System records status change in history
5. Tool removed from available inventory if needed

### Workflow 6: QR Sticker Printing (Administrator)

1. Administrator navigates to tool details
2. Clicks "Print QR Sticker"
3. System generates PDF with QR code
4. Administrator prints sticker
5. Sticker affixed to tool
6. Tool can now be scanned for quick identification

### Workflow 7: Employee Account Creation (Administrator)

1. Administrator navigates to "Employees" → "Add Employee"
2. Fills in employee information:
   - Name (required)
   - Email (required, unique)
   - Phone number
   - Department
   - Role (Administrator/Employee)
3. System sends welcome email with temporary password
4. Employee receives email and sets permanent password
5. Employee can now log in

### Workflow 8: Viewing Analytics (Administrator)

1. Administrator navigates to Dashboard
2. Views key metrics and charts
3. Filters data by date range, project, employee, etc.
4. Exports reports if needed
5. Uses insights for inventory management decisions

---

## Pages & User Interface

### Public Pages

#### 1. Login Page (`/login`)
- Email and password fields
- Language switcher
- "Forgot Password" link
- Error message display
- Responsive design

### Authenticated Pages

#### 2. Dashboard (`/dashboard`)
- **Administrator View:**
  - Key metrics cards
  - Charts and visualizations
  - Recent activity feed
  - Quick action buttons
- **Employee View:**
  - Currently checked out tools
  - Quick check-out/return actions
  - Personal activity summary

#### 3. Tools Management

##### 3.1 Tools List (`/tools`)
- Table/grid view of all tools
- Search and filter bar
- Status badges
- Quick actions (view, edit, check-out)
- Pagination
- Export option (Administrator)

##### 3.2 Tool Details (`/tools/[id]`)
- Complete tool information
- Current status and assignment
- QR code display
- Transaction history
- Action buttons (edit, check-out, return, print QR)
- Status update form (Administrator)

##### 3.3 Add Tool (`/tools/new`)
- Tool registration form
- All required and optional fields
- Form validation
- Submit button

##### 3.4 Edit Tool (`/tools/[id]/edit`)
- Pre-filled form with existing data
- Update capability
- Save/Cancel buttons

#### 4. Employee Management

##### 4.1 Employees List (`/employees`)
- Table of all employees
- Search functionality
- Status indicators
- Action buttons (view, edit, deactivate)

##### 4.2 Employee Details (`/employees/[id]`)
- Employee information
- Currently checked out tools
- Tool history
- Activity statistics

##### 4.3 Add Employee (`/employees/new`)
- Employee registration form
- Role selection
- Form validation

##### 4.4 Edit Employee (`/employees/[id]/edit`)
- Pre-filled form
- Update capability

#### 5. Project Management

##### 5.1 Projects List (`/projects`)
- Table of all projects
- Status indicators
- Tool count per project
- Search and filter

##### 5.2 Project Details (`/projects/[code]`)
- Project information
- Assigned tools list
- Project timeline
- Reports

##### 5.3 Add Project (`/projects/new`)
- Project creation form
- Project code generation/input
- Date pickers

##### 5.4 Edit Project (`/projects/[code]/edit`)
- Pre-filled form
- Update capability

#### 6. Check-out/Return

##### 6.1 Check-out Page (`/checkout`)
- Tool selection interface
- Project code selector
- Notes field
- Confirmation dialog

##### 6.2 Return Page (`/return`)
- Currently checked out tools list
- Return form
- Condition verification
- Notes field

##### 6.3 My Tools (`/my-tools`)
- Employee's currently checked out tools
- Quick return actions
- Tool history

#### 7. QR Code Scanner (`/scan`)
- Mobile-optimized interface
- Camera view for scanning
- Manual entry option
- Tool information display after scan
- Quick action buttons

#### 8. History & Reports

##### 8.1 Transaction History (`/history`)
- Complete transaction log
- Filters (date, employee, tool, project, action type)
- Export functionality
- Pagination

##### 8.2 Reports (`/reports`)
- Pre-defined report templates
- Custom date range selection
- Export options (PDF, CSV, Excel)
- Report types:
  - Tool usage report
  - Employee activity report
  - Project allocation report
  - Status distribution report

#### 9. Settings

##### 9.1 Profile Settings (`/settings/profile`)
- Personal information edit
- Password change
- Language preference

##### 9.2 System Settings (`/settings/system`) - Administrator only
- System configuration
- Default settings
- Email templates
- Notification preferences

#### 10. Navigation Components

- **Header:**
  - Logo/Brand name
  - Main navigation menu
  - User profile dropdown
  - Language switcher
  - Notifications (optional)

- **Sidebar (Desktop):**
  - Navigation links
  - User role indicator
  - Quick actions

- **Mobile Menu:**
  - Hamburger menu
  - Collapsible navigation
  - User profile access

### UI/UX Requirements

- **Responsive Design:** Mobile-first approach, works on all screen sizes
- **Accessibility:** WCAG 2.1 AA compliance
- **Loading States:** Skeleton loaders and progress indicators
- **Error Handling:** User-friendly error messages
- **Success Feedback:** Toast notifications for actions
- **Form Validation:** Real-time validation with clear error messages
- **Consistent Design:** shadcn/ui component library for consistency
- **Dark Mode:** Optional dark theme support (future enhancement)

---

## Database Schema

### Entity Relationship Diagram Overview

```
User (Employees)
  ├── ToolTransaction (check-outs/returns)
  ├── ProjectAssignment
  └── UserSettings

Tool
  ├── ToolTransaction
  ├── ToolStatusHistory
  ├── QRCode
  └── ProjectAssignment

Project
  ├── ProjectAssignment
  └── ToolTransaction

ToolTransaction
  ├── User (employee)
  ├── Tool
  └── Project
```

### Detailed Schema

#### 1. User Table

```sql
User {
  id              String   @id @default(uuid())
  email           String   @unique
  password        String   // hashed
  name            String
  phone           String?
  department      String?
  role            Role     @default(EMPLOYEE) // ADMIN, EMPLOYEE
  status          UserStatus @default(ACTIVE) // ACTIVE, INACTIVE
  language        String   @default("lt") // "lt", "en"
  emailVerified   DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  checkOuts       ToolTransaction[]
  settings        UserSettings?
}
```

#### 2. Tool Table

```sql
Tool {
  id              String   @id @default(uuid())
  name            String
  category        String
  manufacturer    String?
  modelNumber     String?
  serialNumber    String?  @unique
  purchaseDate    DateTime?
  purchasePrice   Decimal?
  description     String?
  status          ToolStatus @default(AVAILABLE)
  qrCode          String   @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  transactions    ToolTransaction[]
  statusHistory   ToolStatusHistory[]
  projectAssignments ProjectAssignment[]
}
```

#### 3. Project Table

```sql
Project {
  id              String   @id @default(uuid())
  code            String   @unique // e.g., "P2652"
  name            String
  description     String?
  startDate       DateTime
  endDate         DateTime?
  status          ProjectStatus @default(ACTIVE) // ACTIVE, COMPLETED, CANCELLED
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  assignments     ProjectAssignment[]
  transactions    ToolTransaction[]
}
```

#### 4. ToolTransaction Table

```sql
ToolTransaction {
  id              String   @id @default(uuid())
  toolId          String
  userId          String
  projectId       String?
  actionType      TransactionType // CHECKOUT, RETURN, STATUS_CHANGE
  previousStatus  ToolStatus?
  newStatus       ToolStatus
  notes           String?
  createdAt       DateTime @default(now())
  
  // Relations
  tool            Tool     @relation(fields: [toolId], references: [id])
  user            User     @relation(fields: [userId], references: [id])
  project         Project? @relation(fields: [projectId], references: [id])
  
  @@index([toolId])
  @@index([userId])
  @@index([projectId])
  @@index([createdAt])
}
```

#### 5. ToolStatusHistory Table

```sql
ToolStatusHistory {
  id              String   @id @default(uuid())
  toolId          String
  previousStatus  ToolStatus
  newStatus       ToolStatus
  changedBy       String   // userId
  reason          String?
  notes           String?
  createdAt       DateTime @default(now())
  
  // Relations
  tool            Tool     @relation(fields: [toolId], references: [id])
  
  @@index([toolId])
  @@index([createdAt])
}
```

#### 6. ProjectAssignment Table

```sql
ProjectAssignment {
  id              String   @id @default(uuid())
  toolId          String
  projectId       String
  assignedAt      DateTime @default(now())
  unassignedAt    DateTime?
  isActive        Boolean  @default(true)
  
  // Relations
  tool            Tool     @relation(fields: [toolId], references: [id])
  project         Project  @relation(fields: [projectId], references: [id])
  
  @@index([toolId])
  @@index([projectId])
  @@index([isActive])
}
```

#### 7. UserSettings Table

```sql
UserSettings {
  id              String   @id @default(uuid())
  userId          String   @unique
  language        String   @default("lt")
  theme           String?  @default("light")
  notifications   Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### 8. Session Table (NextAuth)

```sql
Session {
  id           String   @id
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

Account {
  id                String  @id
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
}
```

### Enums

```typescript
enum Role {
  ADMIN
  EMPLOYEE
}

enum UserStatus {
  ACTIVE
  INACTIVE
}

enum ToolStatus {
  AVAILABLE
  CHECKED_OUT
  MAINTENANCE
  RETIRED
  LOST
  DAMAGED
}

enum TransactionType {
  CHECKOUT
  RETURN
  STATUS_CHANGE
}

enum ProjectStatus {
  ACTIVE
  COMPLETED
  CANCELLED
}
```

### Indexes

- User: `email` (unique), `role`, `status`
- Tool: `serialNumber` (unique), `qrCode` (unique), `status`, `category`
- Project: `code` (unique), `status`
- ToolTransaction: `toolId`, `userId`, `projectId`, `createdAt`, `actionType`
- ProjectAssignment: `toolId`, `projectId`, `isActive`

---

## API Requirements

### Authentication Endpoints

#### POST `/api/auth/login`
- **Description:** User login
- **Request Body:** `{ email: string, password: string }`
- **Response:** `{ user: User, token: string }`
- **Status Codes:** 200 (success), 401 (invalid credentials)

#### POST `/api/auth/logout`
- **Description:** User logout
- **Response:** `{ message: string }`
- **Status Codes:** 200 (success)

#### POST `/api/auth/register` (Administrator only)
- **Description:** Create new user account
- **Request Body:** `{ email: string, name: string, role: Role, ... }`
- **Response:** `{ user: User }`
- **Status Codes:** 201 (created), 400 (validation error), 409 (email exists)

#### POST `/api/auth/reset-password`
- **Description:** Request password reset
- **Request Body:** `{ email: string }`
- **Response:** `{ message: string }`
- **Status Codes:** 200 (success)

### Tool Endpoints

#### GET `/api/tools`
- **Description:** Get list of tools with filtering
- **Query Parameters:** `status`, `category`, `search`, `page`, `limit`
- **Response:** `{ tools: Tool[], total: number, page: number }`
- **Status Codes:** 200 (success)

#### GET `/api/tools/[id]`
- **Description:** Get tool details
- **Response:** `{ tool: Tool, currentAssignment: ProjectAssignment?, history: ToolTransaction[] }`
- **Status Codes:** 200 (success), 404 (not found)

#### POST `/api/tools`
- **Description:** Create new tool (Administrator only)
- **Request Body:** Tool creation data
- **Response:** `{ tool: Tool, qrCode: string }`
- **Status Codes:** 201 (created), 400 (validation error)

#### PATCH `/api/tools/[id]`
- **Description:** Update tool (Administrator only)
- **Request Body:** Partial tool data
- **Response:** `{ tool: Tool }`
- **Status Codes:** 200 (success), 404 (not found)

#### DELETE `/api/tools/[id]`
- **Description:** Delete tool (Administrator only)
- **Response:** `{ message: string }`
- **Status Codes:** 200 (success), 404 (not found)

#### GET `/api/tools/[id]/qr-code`
- **Description:** Get QR code image/data for tool
- **Response:** QR code image or data
- **Status Codes:** 200 (success), 404 (not found)

#### POST `/api/tools/[id]/qr-print`
- **Description:** Generate printable QR sticker PDF
- **Response:** PDF file
- **Status Codes:** 200 (success), 404 (not found)

#### POST `/api/tools/scan`
- **Description:** Scan QR code and return tool information
- **Request Body:** `{ qrCode: string }`
- **Response:** `{ tool: Tool, currentAssignment: ProjectAssignment? }`
- **Status Codes:** 200 (success), 404 (not found)

### Check-out/Return Endpoints

#### POST `/api/transactions/checkout`
- **Description:** Check out tool(s)
- **Request Body:** `{ toolIds: string[], projectId: string, notes?: string }`
- **Response:** `{ transactions: ToolTransaction[] }`
- **Status Codes:** 201 (created), 400 (validation error), 409 (tool unavailable)

#### POST `/api/transactions/return`
- **Description:** Return tool(s)
- **Request Body:** `{ toolIds: string[], notes?: string }`
- **Response:** `{ transactions: ToolTransaction[] }`
- **Status Codes:** 200 (success), 400 (validation error)

#### GET `/api/transactions`
- **Description:** Get transaction history
- **Query Parameters:** `toolId`, `userId`, `projectId`, `actionType`, `startDate`, `endDate`, `page`, `limit`
- **Response:** `{ transactions: ToolTransaction[], total: number }`
- **Status Codes:** 200 (success)

#### GET `/api/transactions/[id]`
- **Description:** Get transaction details
- **Response:** `{ transaction: ToolTransaction }`
- **Status Codes:** 200 (success), 404 (not found)

### Employee Endpoints

#### GET `/api/employees`
- **Description:** Get list of employees (Administrator only)
- **Query Parameters:** `search`, `role`, `status`, `page`, `limit`
- **Response:** `{ employees: User[], total: number }`
- **Status Codes:** 200 (success)

#### GET `/api/employees/[id]`
- **Description:** Get employee details
- **Response:** `{ employee: User, currentTools: Tool[], history: ToolTransaction[] }`
- **Status Codes:** 200 (success), 404 (not found)

#### POST `/api/employees`
- **Description:** Create employee account (Administrator only)
- **Request Body:** Employee creation data
- **Response:** `{ employee: User }`
- **Status Codes:** 201 (created), 400 (validation error)

#### PATCH `/api/employees/[id]`
- **Description:** Update employee (Administrator only or self)
- **Request Body:** Partial employee data
- **Response:** `{ employee: User }`
- **Status Codes:** 200 (success), 404 (not found)

#### DELETE `/api/employees/[id]`
- **Description:** Deactivate employee (Administrator only)
- **Response:** `{ message: string }`
- **Status Codes:** 200 (success), 404 (not found)

### Project Endpoints

#### GET `/api/projects`
- **Description:** Get list of projects
- **Query Parameters:** `status`, `search`, `page`, `limit`
- **Response:** `{ projects: Project[], total: number }`
- **Status Codes:** 200 (success)

#### GET `/api/projects/[code]`
- **Description:** Get project details
- **Response:** `{ project: Project, assignedTools: Tool[], transactions: ToolTransaction[] }`
- **Status Codes:** 200 (success), 404 (not found)

#### POST `/api/projects`
- **Description:** Create new project (Administrator only)
- **Request Body:** Project creation data
- **Response:** `{ project: Project }`
- **Status Codes:** 201 (created), 400 (validation error), 409 (code exists)

#### PATCH `/api/projects/[code]`
- **Description:** Update project (Administrator only)
- **Request Body:** Partial project data
- **Response:** `{ project: Project }`
- **Status Codes:** 200 (success), 404 (not found)

#### DELETE `/api/projects/[code]`
- **Description:** Delete project (Administrator only)
- **Response:** `{ message: string }`
- **Status Codes:** 200 (success), 404 (not found)

### Dashboard & Analytics Endpoints

#### GET `/api/dashboard/stats`
- **Description:** Get dashboard statistics
- **Query Parameters:** `startDate`, `endDate` (optional)
- **Response:** `{ totalTools: number, checkedOut: number, available: number, inMaintenance: number, totalEmployees: number, activeProjects: number }`
- **Status Codes:** 200 (success)

#### GET `/api/dashboard/charts`
- **Description:** Get chart data for dashboard
- **Query Parameters:** `chartType`, `startDate`, `endDate`
- **Response:** Chart data based on type
- **Status Codes:** 200 (success)

#### GET `/api/dashboard/recent-activity`
- **Description:** Get recent activity feed
- **Query Parameters:** `limit` (default: 10)
- **Response:** `{ activities: ToolTransaction[] }`
- **Status Codes:** 200 (success)

### Reports Endpoints

#### GET `/api/reports/tool-usage`
- **Description:** Generate tool usage report
- **Query Parameters:** `toolId`, `startDate`, `endDate`, `format` (pdf/csv/excel)
- **Response:** Report file or data
- **Status Codes:** 200 (success)

#### GET `/api/reports/employee-activity`
- **Description:** Generate employee activity report
- **Query Parameters:** `userId`, `startDate`, `endDate`, `format`
- **Response:** Report file or data
- **Status Codes:** 200 (success)

#### GET `/api/reports/project-allocation`
- **Description:** Generate project tool allocation report
- **Query Parameters:** `projectId`, `format`
- **Response:** Report file or data
- **Status Codes:** 200 (success)

### Settings Endpoints

#### GET `/api/settings/profile`
- **Description:** Get user profile settings
- **Response:** `{ user: User, settings: UserSettings }`
- **Status Codes:** 200 (success)

#### PATCH `/api/settings/profile`
- **Description:** Update user profile
- **Request Body:** Partial user data
- **Response:** `{ user: User }`
- **Status Codes:** 200 (success)

#### PATCH `/api/settings/preferences`
- **Description:** Update user preferences (language, theme, etc.)
- **Request Body:** `{ language?: string, theme?: string, notifications?: boolean }`
- **Response:** `{ settings: UserSettings }`
- **Status Codes:** 200 (success)

#### GET `/api/settings/system` (Administrator only)
- **Description:** Get system settings
- **Response:** System configuration
- **Status Codes:** 200 (success)

#### PATCH `/api/settings/system` (Administrator only)
- **Description:** Update system settings
- **Request Body:** System configuration data
- **Response:** Updated settings
- **Status Codes:** 200 (success)

### API Standards

- **RESTful Design:** Follow REST principles
- **HTTP Methods:** GET (read), POST (create), PATCH (update), DELETE (delete)
- **Status Codes:** Proper HTTP status codes
- **Error Handling:** Consistent error response format: `{ error: string, message: string, code?: string }`
- **Pagination:** Use `page` and `limit` query parameters
- **Filtering:** Query parameters for filters
- **Sorting:** `sortBy` and `sortOrder` query parameters
- **Authentication:** Bearer token in Authorization header
- **Validation:** Request validation with clear error messages
- **Rate Limiting:** Implement rate limiting for API endpoints

---

## Technical Specifications

### Frontend Architecture

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **State Management:** React Context API / Zustand (if needed)
- **Form Handling:** React Hook Form
- **Validation:** Zod
- **HTTP Client:** Fetch API / Axios
- **UI Components:** shadcn/ui
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **QR Code:** qrcode.js / react-qr-code
- **PDF Generation:** jsPDF / @react-pdf/renderer

### Backend Architecture

- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Password Hashing:** bcrypt
- **Validation:** Zod
- **File Upload:** (if needed) multer / form-data

### Database

- **Type:** PostgreSQL (latest stable version)
- **Migrations:** Prisma Migrate
- **Connection Pooling:** Prisma connection pooling
- **Backups:** Automated daily backups (infrastructure requirement)

### Security

- **Authentication:** NextAuth.js with secure session management
- **Password Security:** bcrypt hashing with salt rounds
- **CSRF Protection:** Built into NextAuth
- **XSS Protection:** React's built-in XSS protection, input sanitization
- **SQL Injection:** Prisma ORM prevents SQL injection
- **Rate Limiting:** API rate limiting
- **HTTPS:** Required in production
- **Environment Variables:** Secure storage of secrets

### Performance

- **Caching:** Next.js built-in caching, React Query for API caching
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic with Next.js
- **Database Indexing:** Proper indexes on frequently queried fields
- **Pagination:** Implement pagination for large datasets

### Deployment

- **Hosting:** Vercel (recommended for Next.js) or similar
- **Database Hosting:** Managed PostgreSQL service (e.g., Supabase, Railway, AWS RDS)
- **Environment:** Separate environments for development, staging, production
- **CI/CD:** Automated deployment pipeline
- **Monitoring:** Error tracking and performance monitoring

### Browser Support

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers:** iOS Safari, Chrome Mobile
- **Progressive Enhancement:** Graceful degradation for older browsers

---

## Future Improvements

### Phase 2 Features

#### 1. Mobile Application
- Native iOS and Android apps
- Offline capability
- Push notifications
- Enhanced QR scanning with native camera

#### 2. Advanced Analytics
- Predictive analytics for tool maintenance
- Usage pattern analysis
- Cost analysis and ROI calculations
- Custom report builder

#### 3. Maintenance Scheduling
- Automated maintenance reminders
- Maintenance history tracking
- Service provider management
- Maintenance cost tracking

#### 4. Barcode Support
- Support for barcode scanning in addition to QR codes
- Barcode generation for tools

#### 5. Multi-location Support
- Warehouse/location management
- Location-based tool tracking
- Transfer tools between locations

#### 6. Tool Categories & Templates
- Pre-defined tool categories with templates
- Bulk operations using templates
- Category-specific workflows

#### 7. Notifications System
- Email notifications for check-outs, returns, overdue tools
- In-app notifications
- SMS notifications (optional)
- Customizable notification preferences

#### 8. Advanced Search
- Full-text search across all fields
- Saved searches
- Search suggestions
- Advanced filtering with multiple criteria

#### 9. Integration Capabilities
- API for third-party integrations
- Webhook support
- Export to accounting software
- Integration with project management tools

#### 10. Photo Attachments
- Upload photos of tools
- Photo documentation for check-out/return
- Damage reporting with photos

#### 11. Tool Reservations
- Reserve tools for future use
- Reservation calendar
- Automatic check-out on reservation date

#### 12. Cost Tracking
- Tool depreciation calculation
- Cost per project tracking
- Budget management
- Financial reporting

#### 13. Access Control Enhancements
- Department-based permissions
- Custom role creation
- Permission templates
- Audit log for permission changes

#### 14. Bulk Operations
- Bulk tool import/export
- Bulk status updates
- Bulk check-out/return
- Bulk QR code generation and printing

#### 15. Dashboard Customization
- Customizable dashboard widgets
- User-specific dashboard layouts
- Saved dashboard views

#### 16. Advanced Reporting
- Scheduled report generation
- Report templates
- Automated report delivery
- Data visualization enhancements

#### 17. Dark Mode
- System-wide dark theme
- User preference for theme
- Automatic theme switching

#### 18. Accessibility Improvements
- Screen reader optimization
- Keyboard navigation enhancements
- High contrast mode
- Font size adjustments

#### 19. Multi-tenant Support
- Support for multiple companies/organizations
- Organization isolation
- Organization-specific branding

#### 20. API Enhancements
- GraphQL API option
- WebSocket support for real-time updates
- API versioning
- Comprehensive API documentation

### Technical Improvements

1. **Performance Optimization:**
   - Database query optimization
   - Caching strategies
   - CDN integration
   - Image optimization

2. **Scalability:**
   - Horizontal scaling support
   - Database sharding (if needed)
   - Load balancing
   - Microservices architecture (if needed)

3. **Testing:**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright/Cypress)
   - Test coverage goals (80%+)

4. **Documentation:**
   - API documentation (OpenAPI/Swagger)
   - User documentation
   - Developer documentation
   - Video tutorials

5. **Monitoring & Logging:**
   - Application performance monitoring
   - Error tracking (Sentry)
   - User analytics
   - Database query monitoring

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **Tool Loss Reduction:** 30% reduction in tool loss within 6 months
2. **Check-out Efficiency:** 50% reduction in time to check-out tools
3. **User Adoption:** 90% of employees actively using the system within 3 months
4. **Data Accuracy:** 99% accuracy in tool status tracking
5. **System Uptime:** 99.9% availability
6. **User Satisfaction:** 4.5/5 average user rating

### Measurement Methods

- System analytics and usage statistics
- User surveys and feedback
- Tool loss tracking (before/after comparison)
- Time tracking for operations
- Error rate monitoring
- Performance metrics

---

## Appendix

### Glossary

- **Check-out:** Process of assigning a tool to an employee/project
- **Check-in/Return:** Process of returning a tool to inventory
- **Project Code:** Unique identifier for a project (e.g., P2652)
- **QR Code:** Quick Response code used for tool identification
- **Tool Status:** Current state of a tool (Available, Checked Out, etc.)
- **Transaction:** Record of a tool movement (check-out, return, status change)

### Acronyms

- **PRD:** Product Requirements Document
- **API:** Application Programming Interface
- **ORM:** Object-Relational Mapping
- **QR:** Quick Response
- **UI:** User Interface
- **UX:** User Experience
- **i18n:** Internationalization
- **RBAC:** Role-Based Access Control

---

**Document End**

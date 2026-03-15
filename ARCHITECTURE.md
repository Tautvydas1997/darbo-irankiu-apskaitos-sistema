# System Architecture Document

## Darbo įrankių apskaitos valdymo sistema
### Work Tool Inventory Management System

**Version:** 1.0  
**Date:** 2024  
**Status:** Draft

---

## Table of Contents

1. [Overview](#overview)
2. [Recommended Folder Structure](#recommended-folder-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Structure](#database-structure)
6. [Authentication Flow](#authentication-flow)
7. [Route Protection](#route-protection)
8. [API Routes](#api-routes)
9. [QR Code Workflow](#qr-code-workflow)
10. [QR Scanning Workflow](#qr-scanning-workflow)
11. [Tool Transaction Workflow](#tool-transaction-workflow)
12. [Internationalization (i18n) Structure](#internationalization-i18n-structure)
13. [Dashboard Structure](#dashboard-structure)
14. [Mobile Scanning UX Structure](#mobile-scanning-ux-structure)
15. [Recommended Libraries](#recommended-libraries)
16. [Implementation Order](#implementation-order)

---

## Overview

This document outlines the complete system architecture for the Work Tool Inventory Management System built with Next.js 14 App Router. The architecture follows modern best practices, ensuring scalability, maintainability, and optimal performance.

### Architecture Principles

- **Separation of Concerns:** Clear separation between UI, business logic, and data access
- **Type Safety:** Full TypeScript coverage across the application
- **Server Components First:** Leverage Next.js 14 Server Components for optimal performance
- **Progressive Enhancement:** Works without JavaScript where possible
- **Mobile-First:** Responsive design with mobile-optimized workflows
- **Security First:** Authentication, authorization, and input validation at every layer

---

## Recommended Folder Structure

```
darbo-irankiu-apskaitos-sistema/
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example environment variables
├── .gitignore
├── package.json
├── pnpm-lock.yaml                # or package-lock.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── prisma/
│   ├── schema.prisma            # Prisma schema definition
│   ├── migrations/              # Database migrations
│   └── seed.ts                  # Database seeding script
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── src/
│   ├── app/                     # Next.js 14 App Router
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/         # Protected route group
│   │   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── tools/
│   │   │   │   ├── page.tsx     # Tools list
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx # Tool details
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── employees/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [code]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── return/
│   │   │   │   └── page.tsx
│   │   │   ├── my-tools/
│   │   │   │   └── page.tsx
│   │   │   ├── scan/
│   │   │   │   └── page.tsx     # QR scanner page
│   │   │   ├── history/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       ├── profile/
│   │   │       │   └── page.tsx
│   │   │       └── system/
│   │   │           └── page.tsx
│   │   ├── api/                 # API routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   └── register/
│   │   │   │       └── route.ts
│   │   │   ├── tools/
│   │   │   │   ├── route.ts     # GET, POST /api/tools
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts # GET, PATCH, DELETE /api/tools/[id]
│   │   │   │   │   ├── qr-code/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── qr-print/
│   │   │   │   │       └── route.ts
│   │   │   │   └── scan/
│   │   │   │       └── route.ts
│   │   │   ├── employees/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── projects/
│   │   │   │   ├── route.ts
│   │   │   │   └── [code]/
│   │   │   │       └── route.ts
│   │   │   ├── transactions/
│   │   │   │   ├── route.ts
│   │   │   │   ├── checkout/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── return/
│   │   │   │   │   └── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── stats/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── charts/
│   │   │   │   │   └── route.ts
│   │   │   │   └── recent-activity/
│   │   │   │       └── route.ts
│   │   │   ├── reports/
│   │   │   │   ├── tool-usage/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── employee-activity/
│   │   │   │   │   └── route.ts
│   │   │   │   └── project-allocation/
│   │   │   │       └── route.ts
│   │   │   └── settings/
│   │   │       ├── profile/
│   │   │       │   └── route.ts
│   │   │       ├── preferences/
│   │   │       │   └── route.ts
│   │   │       └── system/
│   │   │           └── route.ts
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing/redirect page
│   │   ├── loading.tsx          # Global loading UI
│   │   ├── error.tsx            # Global error boundary
│   │   ├── not-found.tsx        # 404 page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...              # Other shadcn components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── tools/
│   │   │   ├── ToolCard.tsx
│   │   │   ├── ToolTable.tsx
│   │   │   ├── ToolForm.tsx
│   │   │   ├── ToolDetails.tsx
│   │   │   ├── QRCodeDisplay.tsx
│   │   │   └── ToolStatusBadge.tsx
│   │   ├── employees/
│   │   │   ├── EmployeeCard.tsx
│   │   │   ├── EmployeeTable.tsx
│   │   │   ├── EmployeeForm.tsx
│   │   │   └── EmployeeDetails.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectTable.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   └── ProjectDetails.tsx
│   │   ├── transactions/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── ReturnForm.tsx
│   │   │   ├── TransactionTable.tsx
│   │   │   └── TransactionCard.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ChartCard.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── qr/
│   │   │   ├── QRScanner.tsx
│   │   │   ├── QRCodeGenerator.tsx
│   │   │   └── QRStickerPDF.tsx
│   │   ├── reports/
│   │   │   ├── ReportFilters.tsx
│   │   │   ├── ReportTable.tsx
│   │   │   └── ReportExport.tsx
│   │   └── shared/
│   │       ├── SearchBar.tsx
│   │       ├── FilterBar.tsx
│   │       ├── Pagination.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── LanguageSwitcher.tsx
│   ├── lib/                     # Utility libraries
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── db.ts                # Database utilities
│   │   ├── utils.ts             # General utilities
│   │   ├── validations/         # Zod schemas
│   │   │   ├── tool.ts
│   │   │   ├── employee.ts
│   │   │   ├── project.ts
│   │   │   ├── transaction.ts
│   │   │   └── auth.ts
│   │   ├── api/                 # API client utilities
│   │   │   ├── client.ts        # API client setup
│   │   │   └── errors.ts        # Error handling
│   │   └── i18n/                # Internationalization
│   │       ├── config.ts
│   │       ├── messages/
│   │       │   ├── lt.ts        # Lithuanian translations
│   │       │   └── en.ts        # English translations
│   │       └── server.ts        # Server-side i18n
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTools.ts
│   │   ├── useTransactions.ts
│   │   ├── useQRScanner.ts
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   ├── types/                   # TypeScript types
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── tool.ts
│   │   ├── project.ts
│   │   ├── transaction.ts
│   │   └── api.ts
│   ├── server/                  # Server-side code
│   │   ├── actions/             # Server Actions
│   │   │   ├── tools.ts
│   │   │   ├── employees.ts
│   │   │   ├── projects.ts
│   │   │   ├── transactions.ts
│   │   │   └── auth.ts
│   │   ├── services/            # Business logic services
│   │   │   ├── tool.service.ts
│   │   │   ├── employee.service.ts
│   │   │   ├── project.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── qr.service.ts
│   │   │   └── report.service.ts
│   │   ├── middleware/          # Custom middleware
│   │   │   └── auth.middleware.ts
│   │   └── utils/               # Server utilities
│   │       ├── permissions.ts
│   │       ├── validation.ts
│   │       └── errors.ts
│   └── styles/                  # Additional styles
│       └── components.css
├── tests/                       # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                        # Documentation
│   ├── API.md
│   └── DEPLOYMENT.md
└── scripts/                     # Utility scripts
    ├── seed.ts
    └── migrate.ts
```

### Folder Structure Explanation

#### `/src/app`
Next.js 14 App Router directory. Contains all routes and pages.

- **Route Groups `(auth)` and `(dashboard)`**: Organize routes without affecting URL structure
- **Dynamic Routes `[id]` and `[code]`**: Handle dynamic parameters
- **Layout Files**: Shared layouts for route groups
- **Special Files**: `loading.tsx`, `error.tsx`, `not-found.tsx` for error boundaries

#### `/src/components`
Reusable React components organized by feature.

- **`ui/`**: Base UI components from shadcn/ui
- **Feature folders**: Components specific to features (tools, employees, etc.)
- **`shared/`**: Common components used across features

#### `/src/lib`
Utility libraries and configurations.

- **`prisma.ts`**: Prisma client singleton pattern
- **`auth.ts`**: NextAuth configuration
- **`validations/`**: Zod schemas for type-safe validation
- **`i18n/`**: Internationalization setup

#### `/src/hooks`
Custom React hooks for reusable logic.

#### `/src/types`
TypeScript type definitions shared across the application.

#### `/src/server`
Server-side code (Server Actions, services, middleware).

- **`actions/`**: Next.js Server Actions for mutations
- **`services/`**: Business logic layer
- **`middleware/`**: Custom middleware functions

#### `/prisma`
Database schema and migrations.

---

## Frontend Architecture

### Component Architecture

```
┌─────────────────────────────────────────┐
│         Page Component (Server)         │
│  - Data fetching (Server Components)    │
│  - Layout composition                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Feature Components (Client)        │
│  - Interactive UI                       │
│  - Form handling                        │
│  - State management                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      UI Components (shadcn/ui)          │
│  - Base components                      │
│  - Styling (TailwindCSS)                │
└─────────────────────────────────────────┘
```

### Server Components vs Client Components

#### Server Components (Default)
- **Data Fetching:** Direct database queries
- **Static Content:** Text, layouts
- **No Interactivity:** No event handlers, useState, useEffect
- **Performance:** Reduced JavaScript bundle size

**Example:**
```typescript
// app/tools/page.tsx (Server Component)
import { getTools } from '@/server/actions/tools';
import ToolTable from '@/components/tools/ToolTable';

export default async function ToolsPage() {
  const tools = await getTools();
  return <ToolTable tools={tools} />;
}
```

#### Client Components
- **Interactivity:** Forms, buttons, modals
- **State Management:** useState, useReducer
- **Effects:** useEffect, event handlers
- **Browser APIs:** localStorage, window, etc.

**Example:**
```typescript
// components/tools/ToolForm.tsx (Client Component)
'use client';

import { useState } from 'react';
import { createTool } from '@/server/actions/tools';

export default function ToolForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ... form logic
}
```

### State Management Strategy

#### 1. Server State
- **Fetching:** Server Components with direct DB access
- **Mutations:** Server Actions
- **Caching:** Next.js built-in caching + React Cache

#### 2. Client State
- **Form State:** React Hook Form
- **UI State:** useState (modals, dropdowns, etc.)
- **Global State:** React Context (user, theme, language)
- **Optional:** Zustand for complex global state

#### 3. Data Fetching Pattern

```typescript
// Server Component - Direct DB access
async function getTools() {
  const prisma = getPrismaClient();
  return await prisma.tool.findMany();
}

// Client Component - API route or Server Action
async function createTool(data: ToolInput) {
  'use server';
  // Server Action
  return await toolService.create(data);
}
```

### Form Handling

**Library:** React Hook Form + Zod

```typescript
// Example: Tool Form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toolSchema } from '@/lib/validations/tool';

function ToolForm() {
  const form = useForm({
    resolver: zodResolver(toolSchema),
    defaultValues: { /* ... */ }
  });
  
  const onSubmit = async (data) => {
    await createTool(data);
  };
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

### Error Handling

#### Global Error Boundary
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

#### API Error Handling
```typescript
// lib/api/errors.ts
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return { status: error.status, message: error.message };
  }
  return { status: 500, message: 'Internal server error' };
}
```

---

## Backend Architecture

### API Route Structure

Next.js 14 API routes follow RESTful conventions:

```typescript
// app/api/tools/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTools, createTool } from '@/server/services/tool.service';
import { toolSchema } from '@/lib/validations/tool';
import { requireAuth, requireRole } from '@/server/middleware/auth.middleware';

// GET /api/tools
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    
    const tools = await getTools({
      status: searchParams.get('status'),
      search: searchParams.get('search'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    });
    
    return NextResponse.json(tools);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

// POST /api/tools
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    requireRole(session, 'ADMIN');
    
    const body = await request.json();
    const validatedData = toolSchema.parse(body);
    
    const tool = await createTool(validatedData, session.user.id);
    
    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    );
  }
}
```

### Server Actions

Server Actions provide a simpler alternative to API routes for mutations:

```typescript
// server/actions/tools.ts
'use server';

import { revalidatePath } from 'next/cache';
import { toolService } from '@/server/services/tool.service';
import { toolSchema } from '@/lib/validations/tool';
import { requireAuth, requireRole } from '@/server/middleware/auth.middleware';

export async function createTool(data: unknown) {
  try {
    const session = await requireAuth();
    requireRole(session, 'ADMIN');
    
    const validatedData = toolSchema.parse(data);
    const tool = await toolService.create(validatedData, session.user.id);
    
    revalidatePath('/tools');
    return { success: true, data: tool };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Service Layer

Business logic is separated into service classes:

```typescript
// server/services/tool.service.ts
import { prisma } from '@/lib/prisma';
import { generateQRCode } from '@/server/services/qr.service';
import { ToolStatus, type Tool, type CreateToolInput } from '@/types/tool';

export class ToolService {
  async create(input: CreateToolInput, userId: string): Promise<Tool> {
    // Generate QR code
    const qrCode = await generateQRCode();
    
    // Create tool
    const tool = await prisma.tool.create({
      data: {
        ...input,
        qrCode,
        status: ToolStatus.AVAILABLE,
        createdAt: new Date(),
      },
      include: {
        transactions: false,
        projectAssignments: false,
      },
    });
    
    return tool;
  }
  
  async findById(id: string): Promise<Tool | null> {
    return await prisma.tool.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        projectAssignments: {
          where: { isActive: true },
          include: { project: true },
        },
      },
    });
  }
  
  async updateStatus(
    id: string,
    newStatus: ToolStatus,
    userId: string,
    reason?: string
  ): Promise<Tool> {
    const tool = await prisma.tool.findUnique({ where: { id } });
    if (!tool) throw new Error('Tool not found');
    
    // Create transaction record
    await prisma.toolTransaction.create({
      data: {
        toolId: id,
        userId,
        actionType: 'STATUS_CHANGE',
        previousStatus: tool.status,
        newStatus,
        notes: reason,
      },
    });
    
    // Update tool status
    return await prisma.tool.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}

export const toolService = new ToolService();
```

### Middleware

Custom middleware for authentication and authorization:

```typescript
// server/middleware/auth.middleware.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { Role } from '@prisma/client';

export async function requireAuth(request?: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  
  return session;
}

export function requireRole(session: { user: { role: Role } }, role: Role) {
  if (session.user.role !== role && session.user.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }
}

export function hasPermission(
  userRole: Role,
  requiredRole: Role
): boolean {
  if (requiredRole === 'ADMIN') {
    return userRole === 'ADMIN';
  }
  return true; // Employees can access employee-level features
}
```

---

## Database Structure

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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

model User {
  id            String      @id @default(uuid())
  email         String      @unique
  password      String
  name          String
  phone         String?
  department    String?
  role          Role        @default(EMPLOYEE)
  status        UserStatus  @default(ACTIVE)
  language      String      @default("lt")
  emailVerified DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  checkOuts     ToolTransaction[]
  settings      UserSettings?

  @@index([email])
  @@index([role])
  @@index([status])
}

model Tool {
  id            String      @id @default(uuid())
  name          String
  category      String
  manufacturer  String?
  modelNumber   String?
  serialNumber  String?     @unique
  purchaseDate  DateTime?
  purchasePrice Decimal?
  description   String?
  status        ToolStatus  @default(AVAILABLE)
  qrCode        String      @unique
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  transactions       ToolTransaction[]
  statusHistory      ToolStatusHistory[]
  projectAssignments ProjectAssignment[]

  @@index([status])
  @@index([category])
  @@index([qrCode])
  @@index([serialNumber])
}

model Project {
  id          String      @id @default(uuid())
  code        String      @unique
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime?
  status      ProjectStatus @default(ACTIVE)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  assignments ProjectAssignment[]
  transactions ToolTransaction[]

  @@index([code])
  @@index([status])
}

model ToolTransaction {
  id             String          @id @default(uuid())
  toolId         String
  userId         String
  projectId      String?
  actionType     TransactionType
  previousStatus ToolStatus?
  newStatus      ToolStatus
  notes          String?
  createdAt      DateTime        @default(now())

  tool    Tool     @relation(fields: [toolId], references: [id], onDelete: Cascade)
  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  project Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([toolId])
  @@index([userId])
  @@index([projectId])
  @@index([createdAt])
  @@index([actionType])
}

model ToolStatusHistory {
  id             String     @id @default(uuid())
  toolId         String
  previousStatus ToolStatus
  newStatus      ToolStatus
  changedBy      String
  reason         String?
  notes          String?
  createdAt      DateTime   @default(now())

  tool Tool @relation(fields: [toolId], references: [id], onDelete: Cascade)

  @@index([toolId])
  @@index([createdAt])
}

model ProjectAssignment {
  id           String   @id @default(uuid())
  toolId       String
  projectId    String
  assignedAt   DateTime @default(now())
  unassignedAt DateTime?
  isActive     Boolean  @default(true)

  tool    Tool    @relation(fields: [toolId], references: [id], onDelete: Cascade)
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([toolId])
  @@index([projectId])
  @@index([isActive])
}

model UserSettings {
  id           String   @id @default(uuid())
  userId       String   @unique
  language     String   @default("lt")
  theme        String?  @default("light")
  notifications Boolean @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// NextAuth required models
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### Database Connection

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Authentication Flow

### NextAuth Configuration

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || user.status !== 'ACTIVE') {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### Authentication Flow Diagram

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────────────┐
│  NextAuth Handler   │
│  /api/auth/[...]    │
└──────┬──────────────┘
       │
       │ 2. Validate credentials
       ▼
┌─────────────────────┐
│  CredentialsProvider │
│  - Query database    │
│  - Verify password   │
└──────┬──────────────┘
       │
       │ 3. Generate JWT
       ▼
┌─────────────────────┐
│  JWT Callback       │
│  - Add user data    │
│  - Add role         │
└──────┬──────────────┘
       │
       │ 4. Create session
       ▼
┌─────────────────────┐
│  Session Callback   │
│  - Return session   │
└──────┬──────────────┘
       │
       │ 5. Set cookie
       ▼
┌─────────────┐
│   Client    │
│  (Logged in)│
└─────────────┘
```

### Login Implementation

```typescript
// app/(auth)/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError('An error occurred');
    }
  };

  return <LoginForm onSubmit={handleSubmit} error={error} />;
}
```

---

## Route Protection

### Middleware for Route Protection

```typescript
// middleware.ts (root level)
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'ADMIN';
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    // Redirect authenticated users away from auth pages
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/settings/system') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Component-Level Protection

```typescript
// components/auth/ProtectedRoute.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Role } from '@prisma/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && requiredRole) {
      if (session.user.role !== requiredRole && session.user.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
    }
  }, [session, status, router, requiredRole]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (requiredRole && session?.user.role !== requiredRole && session?.user.role !== 'ADMIN') {
    return null;
  }

  return <>{children}</>;
}
```

### Server-Side Protection

```typescript
// server/middleware/auth.middleware.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  return session;
}

export async function requireRole(role: Role) {
  const session = await requireAuth();
  
  if (session.user.role !== role && session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  
  return session;
}
```

### Usage in Pages

```typescript
// app/(dashboard)/settings/system/page.tsx
import { requireRole } from '@/server/middleware/auth.middleware';
import SystemSettings from '@/components/settings/SystemSettings';

export default async function SystemSettingsPage() {
  await requireRole('ADMIN');
  
  return <SystemSettings />;
}
```

---

## API Routes

### API Route Structure

All API routes follow this pattern:

```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/server/middleware/auth.middleware';
import { resourceService } from '@/server/services/resource.service';
import { resourceSchema } from '@/lib/validations/resource';

// GET /api/[resource]
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    
    const resources = await resourceService.findMany({
      // Parse query parameters
    });
    
    return NextResponse.json(resources);
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/[resource]
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    requireRole(session, 'ADMIN'); // If needed
    
    const body = await request.json();
    const validatedData = resourceSchema.parse(body);
    
    const resource = await resourceService.create(validatedData, session.user.id);
    
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
```

### Dynamic Routes

```typescript
// app/api/tools/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tools/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Implementation
}

// PATCH /api/tools/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Implementation
}

// DELETE /api/tools/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Implementation
}
```

### Error Handling Utility

```typescript
// lib/api/errors.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## QR Code Workflow

### QR Code Generation

```typescript
// server/services/qr.service.ts
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function generateQRCode(): Promise<string> {
  // Generate unique QR code string
  const qrCode = `TOOL-${nanoid(12)}`;
  
  // Verify uniqueness
  const exists = await prisma.tool.findUnique({
    where: { qrCode },
  });
  
  if (exists) {
    // Retry if collision (unlikely)
    return generateQRCode();
  }
  
  return qrCode;
}

export async function generateQRCodeImage(qrCode: string): Promise<Buffer> {
  const qrDataURL = await QRCode.toDataURL(qrCode, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    width: 300,
    margin: 1,
  });
  
  // Convert data URL to buffer
  const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

export async function generateQRCodeForTool(toolId: string): Promise<Buffer> {
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
  });
  
  if (!tool) {
    throw new Error('Tool not found');
  }
  
  // QR code contains tool ID and basic info
  const qrData = JSON.stringify({
    id: tool.id,
    qrCode: tool.qrCode,
    name: tool.name,
  });
  
  return await generateQRCodeImage(qrData);
}
```

### QR Sticker PDF Generation

```typescript
// server/services/qr.service.ts (continued)
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateQRStickerPDF(
  toolId: string,
  toolName: string
): Promise<Buffer> {
  const qrImage = await generateQRCodeForTool(toolId);
  
  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([200, 100]); // Sticker size
  
  // Embed QR code image
  const qrPngImage = await pdfDoc.embedPng(qrImage);
  page.drawImage(qrPngImage, {
    x: 10,
    y: 40,
    width: 60,
    height: 60,
  });
  
  // Add text
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText(toolName, {
    x: 80,
    y: 70,
    size: 12,
    font,
  });
  
  page.drawText(`ID: ${toolId.slice(0, 8)}`, {
    x: 80,
    y: 50,
    size: 10,
    font,
  });
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
```

### API Route for QR Code

```typescript
// app/api/tools/[id]/qr-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { generateQRCodeForTool } from '@/server/services/qr.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const qrImage = await generateQRCodeForTool(params.id);
    
    return new NextResponse(qrImage, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
```

### API Route for QR Sticker PDF

```typescript
// app/api/tools/[id]/qr-print/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/server/middleware/auth.middleware';
import { generateQRStickerPDF } from '@/server/services/qr.service';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    requireRole(session, 'ADMIN');
    
    const tool = await prisma.tool.findUnique({
      where: { id: params.id },
    });
    
    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }
    
    const pdf = await generateQRStickerPDF(tool.id, tool.name);
    
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="qr-sticker-${tool.qrCode}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
```

### Component for QR Display

```typescript
// components/tools/QRCodeDisplay.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface QRCodeDisplayProps {
  toolId: string;
  qrCode: string;
}

export default function QRCodeDisplay({ toolId, qrCode }: QRCodeDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrint = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools/${toolId}/qr-print`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-sticker-${qrCode}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to print QR sticker', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        src={`/api/tools/${toolId}/qr-code`}
        alt="QR Code"
        width={200}
        height={200}
        className="border rounded"
      />
      <p className="text-sm text-muted-foreground">QR Code: {qrCode}</p>
      <Button onClick={handlePrint} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Print QR Sticker'}
      </Button>
    </div>
  );
}
```

---

## QR Scanning Workflow

### QR Scanner Component

```typescript
// components/qr/QRScanner.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const router = useRouter();
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error(err);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = async (qrData: string) => {
    stopScanning();
    
    try {
      // Parse QR code data
      const data = JSON.parse(qrData);
      const toolId = data.id;
      
      // Navigate to tool details or scan result page
      router.push(`/tools/${toolId}?from=scan`);
    } catch (err) {
      // If QR code is not JSON, treat as tool ID
      router.push(`/tools/${qrData}?from=scan`);
    }
  };

  const handleManualInput = () => {
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Card className="w-full max-w-md p-4">
        <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}
        
        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
          />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Camera not active
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mb-4">
          {!isScanning ? (
            <Button onClick={startScanning} className="flex-1">
              Start Scanning
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="destructive" className="flex-1">
              Stop Scanning
            </Button>
          )}
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Or enter QR code manually:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter QR code"
              className="flex-1 px-3 py-2 border rounded"
            />
            <Button onClick={handleManualInput} disabled={!manualInput.trim()}>
              Go
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
```

### QR Code Scanning Library Integration

For actual QR code detection, use a library like `@zxing/library`:

```typescript
// hooks/useQRScanner.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export function useQRScanner(videoRef: React.RefObject<HTMLVideoElement>) {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setResult(null);
      
      if (!codeReaderRef.current || !videoRef.current) return;
      
      const result = await codeReaderRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, error) => {
          if (result) {
            setResult(result.getText());
          }
          if (error && error.name !== 'NotFoundException') {
            setError(error.message);
          }
        }
      );
    } catch (err) {
      setError('Failed to start scanning');
      console.error(err);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    setResult(null);
  };

  return { result, error, startScanning, stopScanning };
}
```

### Scan Result Page

```typescript
// app/(dashboard)/scan/page.tsx
import QRScanner from '@/components/qr/QRScanner';
import { requireAuth } from '@/server/middleware/auth.middleware';

export default async function ScanPage() {
  await requireAuth();
  
  return (
    <div className="container mx-auto py-8">
      <QRScanner />
    </div>
  );
}
```

### Mobile-Optimized Scanning UX

```typescript
// components/qr/MobileQRScanner.tsx
'use client';

import { useEffect, useState } from 'react';
import { useQRScanner } from '@/hooks/useQRScanner';
import { useRouter } from 'next/navigation';

export default function MobileQRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { result, error, startScanning, stopScanning } = useQRScanner(videoRef);
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (result) {
      handleScanResult(result);
    }
  }, [result]);

  const handleScanResult = async (qrData: string) => {
    stopScanning();
    
    try {
      // Fetch tool information
      const response = await fetch(`/api/tools/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: qrData }),
      });
      
      if (!response.ok) {
        throw new Error('Tool not found');
      }
      
      const { tool } = await response.json();
      
      // Show quick action modal or navigate
      router.push(`/tools/${tool.id}?from=scan&action=quick`);
    } catch (err) {
      // Show error and allow retry
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Camera viewport - full screen on mobile */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-white rounded-lg w-64 h-64">
            {/* Scanning frame */}
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-black/80 p-4 flex flex-col gap-2">
        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}
        
        <button
          onClick={isActive ? stopScanning : startScanning}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg"
        >
          {isActive ? 'Stop' : 'Start Scanning'}
        </button>
      </div>
    </div>
  );
}
```

---

## Tool Transaction Workflow

### Check-out Workflow

```typescript
// server/services/transaction.service.ts
import { prisma } from '@/lib/prisma';
import { ToolStatus, TransactionType } from '@prisma/client';

export class TransactionService {
  async checkout(
    toolIds: string[],
    userId: string,
    projectId?: string,
    notes?: string
  ) {
    // Start transaction
    return await prisma.$transaction(async (tx) => {
      const transactions = [];
      
      for (const toolId of toolIds) {
        // Check tool availability
        const tool = await tx.tool.findUnique({
          where: { id: toolId },
        });
        
        if (!tool) {
          throw new Error(`Tool ${toolId} not found`);
        }
        
        if (tool.status !== ToolStatus.AVAILABLE) {
          throw new Error(`Tool ${toolId} is not available`);
        }
        
        // Create transaction record
        const transaction = await tx.toolTransaction.create({
          data: {
            toolId,
            userId,
            projectId,
            actionType: TransactionType.CHECKOUT,
            previousStatus: tool.status,
            newStatus: ToolStatus.CHECKED_OUT,
            notes,
          },
        });
        
        // Update tool status
        await tx.tool.update({
          where: { id: toolId },
          data: { status: ToolStatus.CHECKED_OUT },
        });
        
        // Create project assignment if project provided
        if (projectId) {
          await tx.projectAssignment.create({
            data: {
              toolId,
              projectId,
              isActive: true,
            });
        }
        
        transactions.push(transaction);
      }
      
      return transactions;
    });
  }
  
  async return(
    toolIds: string[],
    userId: string,
    notes?: string
  ) {
    return await prisma.$transaction(async (tx) => {
      const transactions = [];
      
      for (const toolId of toolIds) {
        const tool = await tx.tool.findUnique({
          where: { id: toolId },
          include: {
            projectAssignments: {
              where: { isActive: true },
            },
          },
        });
        
        if (!tool) {
          throw new Error(`Tool ${toolId} not found`);
        }
        
        if (tool.status !== ToolStatus.CHECKED_OUT) {
          throw new Error(`Tool ${toolId} is not checked out`);
        }
        
        // Create transaction record
        const transaction = await tx.toolTransaction.create({
          data: {
            toolId,
            userId,
            projectId: tool.projectAssignments[0]?.projectId,
            actionType: TransactionType.RETURN,
            previousStatus: tool.status,
            newStatus: ToolStatus.AVAILABLE,
            notes,
          },
        });
        
        // Update tool status
        await tx.tool.update({
          where: { id: toolId },
          data: { status: ToolStatus.AVAILABLE },
        });
        
        // Deactivate project assignment
        if (tool.projectAssignments.length > 0) {
          await tx.projectAssignment.updateMany({
            where: {
              toolId,
              isActive: true,
            },
            data: {
              isActive: false,
              unassignedAt: new Date(),
            },
          });
        }
        
        transactions.push(transaction);
      }
      
      return transactions;
    });
  }
}

export const transactionService = new TransactionService();
```

### Check-out API Route

```typescript
// app/api/transactions/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/server/middleware/auth.middleware';
import { transactionService } from '@/server/services/transaction.service';
import { checkoutSchema } from '@/lib/validations/transaction';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    
    const validatedData = checkoutSchema.parse(body);
    
    const transactions = await transactionService.checkout(
      validatedData.toolIds,
      session.user.id,
      validatedData.projectId,
      validatedData.notes
    );
    
    return NextResponse.json({ transactions }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
```

### Check-out Component

```typescript
// components/transactions/CheckoutForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@/lib/validations/transaction';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

export default function CheckoutForm({ availableTools, projects }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
  });
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/transactions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Check-out failed');
      }
      
      // Show success message
      // Redirect or refresh
    } catch (error) {
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Tool selection */}
      {/* Project selection */}
      {/* Notes */}
      <Button type="submit" disabled={isSubmitting}>
        Check Out Tools
      </Button>
    </form>
  );
}
```

---

## Internationalization (i18n) Structure

### i18n Configuration

```typescript
// lib/i18n/config.ts
export const locales = ['lt', 'en'] as const;
export const defaultLocale = 'lt' as const;

export type Locale = typeof locales[number];

export const localeNames: Record<Locale, string> = {
  lt: 'Lietuvių',
  en: 'English',
};
```

### Translation Files

```typescript
// lib/i18n/messages/lt.ts
export const lt = {
  common: {
    save: 'Išsaugoti',
    cancel: 'Atšaukti',
    delete: 'Ištrinti',
    edit: 'Redaguoti',
    search: 'Ieškoti',
    loading: 'Kraunama...',
  },
  auth: {
    login: 'Prisijungti',
    logout: 'Atsijungti',
    email: 'El. paštas',
    password: 'Slaptažodis',
    invalidCredentials: 'Neteisingi prisijungimo duomenys',
  },
  tools: {
    title: 'Įrankiai',
    addTool: 'Pridėti įrankį',
    toolName: 'Įrankio pavadinimas',
    category: 'Kategorija',
    status: 'Būsena',
    available: 'Prieinamas',
    checkedOut: 'Išduotas',
    maintenance: 'Remontuojamas',
  },
  // ... more translations
};
```

```typescript
// lib/i18n/messages/en.ts
export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    loading: 'Loading...',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    invalidCredentials: 'Invalid credentials',
  },
  tools: {
    title: 'Tools',
    addTool: 'Add Tool',
    toolName: 'Tool Name',
    category: 'Category',
    status: 'Status',
    available: 'Available',
    checkedOut: 'Checked Out',
    maintenance: 'Maintenance',
  },
  // ... more translations
};
```

### Server-Side i18n

```typescript
// lib/i18n/server.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { defaultLocale, type Locale } from './config';
import * as lt from './messages/lt';
import * as en from './messages/en';

const messages = {
  lt,
  en,
};

export async function getLocale(): Promise<Locale> {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { language: true },
    });
    
    if (user?.language && (user.language === 'lt' || user.language === 'en')) {
      return user.language as Locale;
    }
  }
  
  return defaultLocale;
}

export async function getTranslations() {
  const locale = await getLocale();
  return messages[locale];
}
```

### Client-Side i18n Hook

```typescript
// hooks/useTranslations.ts
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import * as lt from '@/lib/i18n/messages/lt';
import * as en from '@/lib/i18n/messages/en';

const messages = { lt, en };

export function useTranslations() {
  const { data: session } = useSession();
  const [locale, setLocale] = useState<'lt' | 'en'>('lt');
  
  useEffect(() => {
    // Get locale from user settings or default
    const userLocale = session?.user?.language || 'lt';
    setLocale(userLocale as 'lt' | 'en');
  }, [session]);
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  return { t, locale };
}
```

### Language Switcher Component

```typescript
// components/shared/LanguageSwitcher.tsx
'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const { locale, t } = useTranslations();
  
  const switchLanguage = async (newLocale: 'lt' | 'en') => {
    await fetch('/api/settings/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: newLocale }),
    });
    
    window.location.reload();
  };
  
  return (
    <div className="flex gap-2">
      <Button
        variant={locale === 'lt' ? 'default' : 'outline'}
        onClick={() => switchLanguage('lt')}
        size="sm"
      >
        LT
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        onClick={() => switchLanguage('en')}
        size="sm"
      >
        EN
      </Button>
    </div>
  );
}
```

---

## Dashboard Structure

### Dashboard Page Structure

```typescript
// app/(dashboard)/dashboard/page.tsx
import { requireAuth } from '@/server/middleware/auth.middleware';
import { getDashboardStats } from '@/server/services/dashboard.service';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import EmployeeDashboard from '@/components/dashboard/EmployeeDashboard';

export default async function DashboardPage() {
  const session = await requireAuth();
  
  if (session.user.role === 'ADMIN') {
    return <AdminDashboard />;
  }
  
  return <EmployeeDashboard userId={session.user.id} />;
}
```

### Admin Dashboard Component

```typescript
// components/dashboard/AdminDashboard.tsx
import { getDashboardStats, getRecentActivity } from '@/server/services/dashboard.service';
import StatsCard from '@/components/dashboard/StatsCard';
import ChartCard from '@/components/dashboard/ChartCard';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const recentActivity = await getRecentActivity(10);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tools"
          value={stats.totalTools}
          icon="Tool"
        />
        <StatsCard
          title="Checked Out"
          value={stats.checkedOut}
          icon="CheckCircle"
        />
        <StatsCard
          title="Available"
          value={stats.available}
          icon="Package"
        />
        <StatsCard
          title="In Maintenance"
          value={stats.inMaintenance}
          icon="Wrench"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Tool Status Distribution"
          type="pie"
          data={stats.statusDistribution}
        />
        <ChartCard
          title="Check-out Trends"
          type="line"
          data={stats.checkoutTrends}
        />
      </div>
      
      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} />
    </div>
  );
}
```

### Dashboard Service

```typescript
// server/services/dashboard.service.ts
import { prisma } from '@/lib/prisma';
import { ToolStatus } from '@prisma/client';

export async function getDashboardStats() {
  const [
    totalTools,
    checkedOut,
    available,
    inMaintenance,
    totalEmployees,
    activeProjects,
  ] = await Promise.all([
    prisma.tool.count(),
    prisma.tool.count({ where: { status: ToolStatus.CHECKED_OUT } }),
    prisma.tool.count({ where: { status: ToolStatus.AVAILABLE } }),
    prisma.tool.count({ where: { status: ToolStatus.MAINTENANCE } }),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.project.count({ where: { status: 'ACTIVE' } }),
  ]);
  
  // Get status distribution
  const statusDistribution = await prisma.tool.groupBy({
    by: ['status'],
    _count: true,
  });
  
  // Get checkout trends (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const checkoutTrends = await prisma.toolTransaction.groupBy({
    by: ['createdAt'],
    where: {
      actionType: 'CHECKOUT',
      createdAt: { gte: thirtyDaysAgo },
    },
    _count: true,
  });
  
  return {
    totalTools,
    checkedOut,
    available,
    inMaintenance,
    totalEmployees,
    activeProjects,
    statusDistribution,
    checkoutTrends,
  };
}

export async function getRecentActivity(limit: number = 10) {
  return await prisma.toolTransaction.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      tool: { select: { name: true } },
      user: { select: { name: true } },
      project: { select: { code: true, name: true } },
    },
  });
}
```

---

## Mobile Scanning UX Structure

### Mobile-Optimized Layout

```typescript
// app/(dashboard)/scan/page.tsx (Mobile optimized)
import { requireAuth } from '@/server/middleware/auth.middleware';
import MobileQRScanner from '@/components/qr/MobileQRScanner';
import { headers } from 'next/headers';

export default async function ScanPage() {
  await requireAuth();
  
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  
  if (isMobile) {
    return <MobileQRScanner />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <QRScanner /> {/* Desktop version */}
    </div>
  );
}
```

### Quick Action Modal (Mobile)

```typescript
// components/qr/QuickActionModal.tsx
'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuickActionModalProps {
  tool: {
    id: string;
    name: string;
    status: string;
    currentAssignment?: {
      userId: string;
      projectId?: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickActionModal({ tool, isOpen, onClose }: QuickActionModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCheckout = () => {
    router.push(`/checkout?toolId=${tool.id}`);
    onClose();
  };
  
  const handleReturn = async () => {
    setIsProcessing(true);
    try {
      await fetch('/api/transactions/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolIds: [tool.id] }),
      });
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleViewDetails = () => {
    router.push(`/tools/${tool.id}`);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <h2 className="text-xl font-bold">{tool.name}</h2>
        <p className="text-sm text-muted-foreground">
          Status: {tool.status}
        </p>
        
        <div className="flex flex-col gap-2 mt-4">
          {tool.status === 'AVAILABLE' ? (
            <Button onClick={handleCheckout} className="w-full">
              Check Out
            </Button>
          ) : (
            <Button onClick={handleReturn} disabled={isProcessing} className="w-full">
              Return Tool
            </Button>
          )}
          
          <Button onClick={handleViewDetails} variant="outline" className="w-full">
            View Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Recommended Libraries

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "qrcode": "^1.5.3",
    "@zxing/library": "^0.20.0",
    "pdf-lib": "^1.17.1",
    "recharts": "^2.10.0",
    "nanoid": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/qrcode": "^1.5.5",
    "prisma": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

### Library Explanations

1. **next-auth**: Authentication and session management
2. **@prisma/client**: Database ORM client
3. **zod**: Schema validation
4. **react-hook-form**: Form state management
5. **qrcode**: QR code generation
6. **@zxing/library**: QR code scanning
7. **pdf-lib**: PDF generation for QR stickers
8. **recharts**: Dashboard charts and visualizations
9. **date-fns**: Date manipulation and formatting
10. **nanoid**: Unique ID generation for QR codes

---

## Implementation Order

### Phase 1: Foundation (Week 1-2)

1. **Project Setup**
   - Initialize Next.js 14 project
   - Configure TypeScript
   - Set up TailwindCSS
   - Install shadcn/ui components

2. **Database Setup**
   - Set up PostgreSQL
   - Configure Prisma
   - Create database schema
   - Run initial migrations
   - Create seed script

3. **Authentication**
   - Configure NextAuth
   - Create login page
   - Implement session management
   - Set up route protection middleware

### Phase 2: Core Features (Week 3-4)

4. **User Management**
   - Employee list page
   - Employee creation/editing
   - User profile management

5. **Tool Management**
   - Tool list page
   - Tool creation form
   - Tool details page
   - Tool editing

6. **Project Management**
   - Project list page
   - Project creation
   - Project details

### Phase 3: Transactions (Week 5-6)

7. **Check-out/Return**
   - Check-out form
   - Return form
   - Transaction history
   - Status updates

8. **QR Code System**
   - QR code generation
   - QR code display
   - QR sticker PDF generation
   - QR scanning interface

### Phase 4: Advanced Features (Week 7-8)

9. **Dashboard**
   - Statistics cards
   - Charts and visualizations
   - Recent activity feed
   - Role-based dashboards

10. **Internationalization**
    - Set up i18n structure
    - Create translation files
    - Implement language switcher
    - Translate all UI elements

11. **Mobile Optimization**
    - Mobile-responsive layouts
    - Mobile QR scanner
    - Touch-optimized interactions

### Phase 5: Polish & Testing (Week 9-10)

12. **Testing**
    - Unit tests
    - Integration tests
    - E2E tests

13. **Performance Optimization**
    - Code splitting
    - Image optimization
    - Database query optimization
    - Caching strategies

14. **Documentation**
    - API documentation
    - User guide
    - Deployment guide

### Phase 6: Deployment (Week 11-12)

15. **Deployment Preparation**
    - Environment configuration
    - Database migration scripts
    - CI/CD setup

16. **Deployment**
    - Deploy to production
    - Monitor and fix issues
    - User training

---

## Additional Considerations

### Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/tool_inventory"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

### Type Safety

Ensure full TypeScript coverage:
- Strict mode enabled
- No `any` types
- Proper type definitions for all entities
- Type-safe API routes

### Security Best Practices

1. **Input Validation**: Zod schemas for all inputs
2. **SQL Injection**: Prisma ORM prevents SQL injection
3. **XSS Protection**: React's built-in protection + sanitization
4. **CSRF Protection**: NextAuth built-in protection
5. **Password Hashing**: bcrypt with salt rounds
6. **Rate Limiting**: Implement for API routes
7. **HTTPS**: Required in production

### Performance Optimization

1. **Server Components**: Use for data fetching
2. **Caching**: Next.js built-in caching
3. **Database Indexing**: Proper indexes on frequently queried fields
4. **Pagination**: Implement for large datasets
5. **Image Optimization**: Next.js Image component
6. **Code Splitting**: Automatic with Next.js

---

**Document End**

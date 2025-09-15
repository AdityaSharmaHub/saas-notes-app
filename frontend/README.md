# SaaS Notes Frontend

React/Next.js frontend for the Multi-tenant SaaS Notes Application with authentication, role-based UI, and subscription management.

## Features

### ✅ **Authentication**
- JWT-based login system
- Auto-redirect based on authentication status
- Persistent login sessions
- Secure token management

### ✅ **Multi-Tenant UI**
- Tenant-specific branding in header
- Tenant isolation (users only see their tenant's data)
- Support for Acme and Globex test accounts

### ✅ **Role-Based Interface**
- **Admin Features:**
  - Can upgrade subscriptions
  - Access to tenant management
  - All member capabilities
- **Member Features:**
  - Create, view, edit, delete notes
  - View subscription status

### ✅ **Subscription Management**
- Visual subscription status indicators
- Free plan limit enforcement (3 notes max)
- "Upgrade to Pro" prompts for free users at limit
- One-click subscription upgrades (Admin only)
- Real-time limit updates after upgrade

### ✅ **Notes Management**
- Full CRUD operations (Create, Read, Update, Delete)
- Rich note editor with title and content
- Character count indicators
- Responsive grid layout
- Empty state handling

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Custom Components
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Authentication:** JWT tokens with Context

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```bash
cp .env.example .env.local
```

Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend runs on http://localhost:3000

## Project Structure

```
├── app/
│   ├── globals.css           # Global styles and Tailwind
│   ├── layout.js             # Root layout with AuthProvider
│   ├── page.js               # Landing page
│   ├── login/
│   │   └── page.js           # Login page with test accounts
│   └── dashboard/
│       ├── layout.js         # Protected dashboard layout
│       └── page.js           # Notes management interface
├── lib/
│   ├── AuthContext.js        # Authentication context and state
│   └── api.js                # API utility functions
├── components/               # Reusable components (if needed)
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json
```

## Pages Overview

### **Landing Page** (`/`)
- Marketing page with feature highlights
- Test account information
- Auto-redirect to dashboard if authenticated

### **Login Page** (`/login`)
- Email/password form
- Quick-fill buttons for test accounts
- Password visibility toggle
- Error handling and validation

### **Dashboard** (`/dashboard`)
- Protected route (requires authentication)
- Notes grid with create/edit/delete
- Subscription status and upgrade options
- Tenant information in header

## Key Features Implementation

### **Authentication Flow**
```javascript
// AuthContext manages auth state globally
const { user, login, logout, isAuthenticated } = useAuth();

// Protected routes check authentication
useEffect(() => {
  if (!loading && !isAuthenticated) {
    router.push('/login');
  }
}, [loading, isAuthenticated]);
```

### **API Integration**
```javascript
// Centralized API functions
import { notesApi, tenantsApi } from '../lib/api';

// Create note with error handling
const result = await notesApi.create({ title, content });
```

### **Subscription Limits**
- Free plan users see note count (e.g., "2/3 used")
- Create button disabled when at limit
- Upgrade modal appears when limit reached
- Real-time UI updates after upgrade

### **Tenant Isolation**
- All API calls automatically include user's tenant context
- UI shows tenant name and subscription status
- Users can only see/manage their tenant's notes

## Test Accounts

All accounts use password: `password`

| Email | Role | Tenant | Description |
|-------|------|--------|-------------|
| `admin@acme.test` | Admin | Acme | Can upgrade subscriptions, manage all notes |
| `user@acme.test` | Member | Acme | Can manage notes only |
| `admin@globex.test` | Admin | Globex | Can upgrade subscriptions, manage all notes |
| `user@globex.test` | Member | Globex | Can manage notes only |

## Responsive Design

- **Mobile-first:** Works on all device sizes
- **Grid Layout:** Responsive note cards
- **Touch-friendly:** Large tap targets
- **Modern UI:** Clean, professional interface

### Found any issues? 
Mail me at [adisharma.connect@gmail.com](adisharma.connect@gmail.com)
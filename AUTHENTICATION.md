# Authentication Implementation

This implementation provides secure authentication for the Meetup Buddy application with the following features:

## Features Implemented

### 1. Dashboard Protection
- Dashboard routes (`/dashboard/*`) are now protected and only accessible after login
- Unauthenticated users are automatically redirected to the auth page
- After successful login, users are redirected back to their intended destination

### 2. Session Persistence (30 Days)
- User sessions are stored in browser localStorage for 30 days
- Automatic session refresh to maintain user login state
- Session expiry checking and cleanup

### 3. Authentication Context
- Global authentication state management using React Context
- Real-time auth state updates across the application
- Automatic token refresh and session management

## Files Added/Modified

### New Files:
- `middleware.ts` - Route protection middleware
- `lib/auth-context.tsx` - Authentication context provider
- `components/auth-navigation.tsx` - Authentication-aware navigation
- `components/protected-route.tsx` - Protected route wrapper component

### Modified Files:
- `app/layout.tsx` - Added AuthProvider wrapper
- `lib/supabase.ts` - Enhanced with session persistence configuration
- `components/auth/AuthForm.tsx` - Updated to use auth context
- `app/dashboard/page.tsx` - Added protection wrapper

## Setup Instructions

### 1. Environment Configuration
Copy the example environment file and configure your Supabase credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup
Run this SQL in your Supabase SQL editor to create the profiles table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## How It Works

### Route Protection
The middleware (`middleware.ts`) intercepts all requests and:
1. Checks if the user has a valid session
2. Redirects unauthenticated users away from protected routes
3. Redirects authenticated users away from the auth page

### Session Management
The auth context (`lib/auth-context.tsx`):
1. Maintains global authentication state
2. Handles login/logout operations
3. Stores session data in localStorage for 30-day persistence
4. Automatically refreshes tokens
5. Provides auth state to all components

### Protected Routes
The ProtectedRoute component wraps sensitive pages to ensure only authenticated users can access them.

## Usage

### Accessing Protected Routes
```tsx
import { ProtectedRoute } from '@/components/protected-route'

export default function SensitivePage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

### Using Authentication Context
```tsx
import { useAuth } from '@/lib/auth-context'

export default function MyComponent() {
  const { user, signOut, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}
```

## Security Features

1. **Session Expiry**: Sessions automatically expire after 30 days
2. **Secure Storage**: Uses Supabase's secure session management
3. **Route Protection**: Middleware prevents unauthorized access
4. **Token Refresh**: Automatic token refresh to maintain sessions
5. **Cleanup**: Expired sessions are automatically cleaned up

## Testing

1. Visit `/dashboard` without being logged in → Should redirect to `/auth`
2. Sign up/Sign in → Should redirect to `/dashboard`
3. Refresh the page → Should maintain login state
4. Close browser and reopen within 30 days → Should still be logged in
5. After 30 days → Should require re-authentication

## Troubleshooting

### Common Issues:

1. **Middleware errors**: Ensure Supabase environment variables are set
2. **Profile table errors**: Run the SQL setup commands in Supabase
3. **Session not persisting**: Check browser localStorage and Supabase configuration
4. **Redirect loops**: Verify middleware configuration and route setup

### Debug Mode:
The application includes debug information in development mode to help troubleshoot authentication issues.
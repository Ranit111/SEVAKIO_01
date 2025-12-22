# Google Authentication Setup

## Firebase Configuration

To enable Google Sign-In, follow these steps:

### Step 1: Enable Google Provider in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (rato-aeaac)
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google**
5. Toggle the switch to **Enable**
6. Select a **Project support email** (required)
7. Add your app's domain under **Authorized domains** (usually added automatically)
8. Click **Save**

### Step 2: Create OAuth 2.0 Credentials (If not auto-created)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**
4. Create a new OAuth 2.0 Web Client ID if needed
5. Add authorized redirect URIs:
   - `http://localhost:3000`
   - Your production domain (e.g., `https://yourdomain.com`)

### Step 3: Test Google Sign-In
1. Start your dev server: `npm run dev`
2. Navigate to `/signup`
3. Click **Sign Up with Google**
4. You should see the Google auth popup
5. After successful login, you'll be redirected to `/`

## Features Implemented
- ✅ Google Sign-In with popup
- ✅ Error handling for:
  - Popup closed by user
  - Popup blocked by browser
  - Network errors
  - Other auth errors
- ✅ User-friendly error messages in modal
- ✅ Loading state during authentication
- ✅ Automatic redirect to home page (/) on success
- ✅ Existing UI/JSX preserved

## Troubleshooting

### Popup not showing?
- Check browser popup blocker settings
- Make sure domain is authorized in Firebase Console
- Check browser console for errors

### "auth/cancelled-popup-request" error?
- User cancelled the popup - they'll see a friendly message

### Network errors?
- Check internet connection
- Verify Firebase config in `.env.local`

## Production Checklist
- ✅ Enable Google provider in Firebase Console
- ✅ Add production domain to authorized URIs
- ✅ Test with real Google account
- ✅ No JSX/UI changes
- ✅ Error handling implemented
- ✅ Clean, production-ready code

# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps
3. Name your project (e.g., `adaptive-learn`)
4. Disable Google Analytics (optional, for simplicity)

## Step 2: Enable Authentication

1. In your Firebase project, go to **Build → Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Set Up Firestore Database

1. Go to **Build → Firestore Database**
2. Click "Create Database"
3. Select a location (closest to your users)
4. Start in **Test mode** (for development)
   - This allows read/write for 30 days
   - For production, set proper security rules

## Step 4: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register app (give it a name like "web")
5. Copy the `firebaseConfig` object

## Step 5: Configure Environment Variables

Create `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FASTAPI_URL=http://localhost:8000
```

## Step 6: Security Rules (For Production)

In Firestore, go to "Rules" and use these:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /progress/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == docId.split('_')[0];
    }
    match /behavior_logs/{docId} {
      allow read, write: if request.auth != null;
    }
    // Courses are public read
    match /courses/{courseId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Step 7: Enable Firebase in Console

Make sure to enable:
- ✅ Authentication (Email/Password)
- ✅ Firestore Database

---

## Troubleshooting

**"Permission denied" errors:**
- Check that you're authenticated
- Verify Firestore rules allow your operations

**Auth issues:**
- Ensure Email/Password is enabled in Authentication settings

**Cannot create user:**
- Check that password is at least 6 characters
- Ensure email format is valid
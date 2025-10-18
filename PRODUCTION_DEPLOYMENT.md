# Production Deployment Guide

## Current Status: TEST MODE ⚠️

**Live Site:** https://cunmayday.github.io/UseCase
**Admin Panel:** https://cunmayday.github.io/UseCase/admin.html

### Current Configuration:
- ✅ Site is live and functional
- ⚠️ Firestore in **TEST MODE** (anyone can read/write)
- ⚠️ Firebase Storage in **TEST MODE** (anyone can upload)
- ❌ Authentication NOT enforced
- ❌ Security rules NOT configured for production

**⚠️ WARNING:** In test mode, anyone can:
- View all use cases ✓ (this is OK)
- Add new use cases ✗ (NOT OK for production)
- Edit existing use cases ✗ (NOT OK for production)
- Delete use cases ✗ (NOT OK for production)
- Upload images ✗ (NOT OK for production)

---

## When to Lock Down (Production Mode)

**Do this when:**
- You've tested the site thoroughly
- You've migrated all data
- You're ready for public/official launch
- You want to restrict editing to authorized admins only

**Don't do this until:**
- You've tested adding/editing use cases
- You've verified image uploads work
- You've added all initial content
- You're comfortable with the Firebase setup

---

## Steps to Enable Production Security

### Step 1: Enable Firebase Authentication

1. **Go to Firebase Console**
   - Navigate to your project
   - Click **Authentication** in left sidebar
   - Click **"Get started"** (if not already done)

2. **Enable Email/Password**
   - Click **"Sign-in method"** tab
   - Find **"Email/Password"**
   - Toggle **Enable** to ON
   - Click **"Save"**

3. **Add Admin Users**
   - Click **"Users"** tab
   - Click **"Add user"**
   - Enter email (e.g., youremail@purdue.edu)
   - Create a strong password
   - Click **"Add user"**
   - Repeat for each admin

4. **Save Admin Credentials**
   - Email: ___________________
   - Password: ___________________
   - Keep this information secure!

---

### Step 2: Update Firestore Security Rules

1. **Go to Firestore Database**
   - Firebase Console → Firestore Database
   - Click **"Rules"** tab

2. **Replace Test Mode Rules**

   **Current (Test Mode):**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;  // ⚠️ ANYONE can read/write
       }
     }
   }
   ```

   **Replace with (Production Mode):**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow anyone to read use cases (public catalog)
       match /useCases/{document=**} {
         allow read: if true;                    // ✅ Public can view
         allow write: if request.auth != null;   // ✅ Only admins can edit
       }
     }
   }
   ```

3. **Click "Publish"**

---

### Step 3: Update Storage Security Rules

1. **Go to Storage**
   - Firebase Console → Storage
   - Click **"Rules"** tab

2. **Replace Test Mode Rules**

   **Current (Test Mode):**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;  // ⚠️ ANYONE can upload
       }
     }
   }
   ```

   **Replace with (Production Mode):**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;                    // ✅ Public can view images
         allow write: if request.auth != null;   // ✅ Only admins can upload
       }
     }
   }
   ```

3. **Click "Publish"**

---

### Step 4: Test Admin Access

1. **Go to Admin Panel**
   - Visit: https://cunmayday.github.io/UseCase/admin.html

2. **Try to Login**
   - Enter the admin email/password you created
   - Click **"Sign In"**
   - You should see the admin panel with use cases list

3. **Test Functionality**
   - ✅ Can view existing use cases
   - ✅ Can edit a use case
   - ✅ Can add a new test use case
   - ✅ Can upload an image
   - ✅ Can delete the test use case

4. **Test Public Access**
   - Open main site in incognito/private window: https://cunmayday.github.io/UseCase
   - ✅ Should see all use cases
   - ✅ Can filter and sort
   - ✅ Can view details
   - ❌ Admin panel should require login

---

### Step 5: Verify Security

**Test that non-admins CANNOT edit:**

1. **Open Browser Console**
   - Go to: https://cunmayday.github.io/UseCase
   - Press F12 to open Developer Tools
   - Go to Console tab

2. **Try to Write to Firestore (Should Fail)**
   ```javascript
   // Paste this in console:
   db.collection('useCases').add({title: 'Hacker Test'})
   ```
   - Should see: **"Missing or insufficient permissions"** ✅
   - If it succeeds ✗ - Your rules aren't configured correctly!

3. **Try to Upload to Storage (Should Fail)**
   ```javascript
   // Paste this in console:
   storage.ref().child('test.txt').putString('test')
   ```
   - Should see: **"User does not have permission"** ✅
   - If it succeeds ✗ - Your rules aren't configured correctly!

---

## Rollback to Test Mode (If Needed)

If you need to go back to open access for testing:

### Firestore Rules (Test Mode):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Storage Rules (Test Mode):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

---

## Security Best Practices

### ✅ DO:
- Use strong passwords for admin accounts
- Add only trusted users as admins
- Monitor Firebase Usage tab for unusual activity
- Review Firestore/Storage rules regularly
- Keep admin credentials secure
- Use different passwords for each admin

### ❌ DON'T:
- Share admin passwords in email/chat
- Leave test mode enabled in production
- Give admin access to everyone
- Commit passwords to GitHub
- Use simple/guessable passwords
- Ignore Firebase security warnings

---

## Monitoring & Maintenance

### Check Usage Regularly:
1. Firebase Console → Usage tab
2. Monitor:
   - Document reads/writes
   - Storage uploads/downloads
   - Authentication sign-ins

### Stay Within Free Tier:
- **Firestore:** 50,000 reads/day, 20,000 writes/day
- **Storage:** 5 GB total, 1 GB/day downloads
- **Authentication:** Unlimited

### Set Up Billing Alerts (Optional):
1. Firebase Console → Project Settings
2. Click "Usage and billing"
3. Set up budget alerts

---

## Current Status Checklist

- [ ] Firebase project created
- [x] Firestore database created (TEST MODE)
- [x] Firebase Storage enabled (TEST MODE)
- [ ] Firebase Authentication enabled
- [ ] Admin users created
- [x] Data migrated to Firestore
- [x] Site deployed to GitHub Pages
- [ ] Production security rules configured
- [ ] Admin access tested
- [ ] Security verified

---

## Quick Reference

### Live URLs:
- **Main Site:** https://cunmayday.github.io/UseCase
- **Admin Panel:** https://cunmayday.github.io/UseCase/admin.html
- **GitHub Repo:** https://github.com/cunmayday/UseCase
- **Firebase Console:** https://console.firebase.google.com

### Admin Credentials:
- Email: ___________________
- Password: ___________________

### Next Steps:
1. Test site thoroughly in current test mode
2. Add all initial content via admin panel
3. When ready for production, follow Steps 1-5 above
4. Verify security is working
5. Monitor usage regularly

---

**Last Updated:** 2025-10-17
**Status:** TEST MODE - Not ready for production
**Action Required:** Enable authentication and security rules before public launch

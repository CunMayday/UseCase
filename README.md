# AI Use Case Catalog - Complete Setup Guide

A dynamic web catalog for AI tool use cases at Purdue University, powered by Firebase for real-time updates and easy content management.

## 🎯 Features

- Browse and filter AI use cases by tool type and user group
- Dynamic content management (add/edit use cases without coding)
- Image upload for screenshots
- Real-time updates from Firebase
- Responsive design with Purdue branding
- Admin authentication for content management

---

## 📋 Prerequisites

- A Google account (for Firebase)
- Git installed on your computer
- A GitHub account
- Basic understanding of command line/terminal

---

## 🔥 Part 1: Firebase Setup (Step-by-Step)

### Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Open your web browser
   - Navigate to: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click the **"Add project"** or **"Create a project"** button
   - Enter project name: `purdue-ai-catalog` (or your preferred name)
   - Click **"Continue"**

3. **Google Analytics (Optional)**
   - You'll be asked if you want to enable Google Analytics
   - **Recommendation:** Toggle it OFF for simplicity (you can enable later)
   - Click **"Create project"**
   - Wait for Firebase to set up your project (takes ~30 seconds)
   - Click **"Continue"** when it's ready

### Step 2: Register Your Web App with Firebase

1. **Add Web App to Project**
   - You should now be on the Firebase project dashboard
   - Look for the web icon `</>` (looks like `</>`code brackets)
   - Click on it to add a web app

2. **Register App**
   - App nickname: `AI Use Case Catalog` (or any name you prefer)
   - **Do NOT** check "Also set up Firebase Hosting" (we'll use GitHub Pages)
   - Click **"Register app"**

3. **Copy Your Firebase Config**
   - You'll see a code snippet that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "purdue-ai-catalog.firebaseapp.com",
     projectId: "purdue-ai-catalog",
     storageBucket: "purdue-ai-catalog.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef123456"
   };
   ```
   - **IMPORTANT:** Keep this window open or copy this somewhere safe - you'll need it soon!
   - Click **"Continue to console"**

### Step 3: Set Up Firestore Database

1. **Navigate to Firestore**
   - In the left sidebar, click **"Build"** (or "Product categories")
   - Click **"Firestore Database"**
   - Click **"Create database"** button

2. **Choose Security Rules**
   - Select **"Start in test mode"** (we'll configure security later)
   - Click **"Next"**

3. **Choose Location**
   - Select a location close to you (e.g., `us-central` for USA)
   - **Important:** This cannot be changed later
   - Click **"Enable"**
   - Wait for Firestore to be created (~1 minute)

4. **Configure Security Rules**
   - Once created, click on the **"Rules"** tab at the top
   - Replace the existing rules with this:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow anyone to read use cases
       match /useCases/{document=**} {
         allow read: if true;
         // Only authenticated users can write
         allow write: if request.auth != null;
       }
     }
   }
   ```
   - Click **"Publish"**
   - This allows anyone to view use cases, but only logged-in admins can edit

### Step 4: Set Up Firebase Storage (for Images)

1. **Navigate to Storage**
   - In the left sidebar, click **"Storage"**
   - Click **"Get started"**

2. **Configure Security Rules**
   - You'll see default security rules
   - Click **"Next"**

3. **Choose Location**
   - Use the same location you chose for Firestore
   - Click **"Done"**
   - Wait for Storage to be created

4. **Update Storage Rules**
   - Click on the **"Rules"** tab
   - Replace with this:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         // Anyone can read images
         allow read: if true;
         // Only authenticated users can upload images
         allow write: if request.auth != null;
       }
     }
   }
   ```
   - Click **"Publish"**

### Step 5: Set Up Firebase Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click **"Authentication"**
   - Click **"Get started"**

2. **Enable Email/Password Sign-In**
   - Click on the **"Sign-in method"** tab at the top
   - Find **"Email/Password"** in the list
   - Click on it
   - Toggle **"Enable"** to ON (should turn blue)
   - Click **"Save"**

3. **Add Your Admin User**
   - Click on the **"Users"** tab at the top
   - Click **"Add user"**
   - Enter your email (e.g., `youremail@purdue.edu`)
   - Enter a password (make it strong! at least 8 characters)
   - Click **"Add user"**
   - **IMPORTANT:** Save this email and password - you'll use it to login to the admin panel!

---

## 💻 Part 2: Configure Your Website Code

### Step 6: Update Firebase Configuration in Your Code

1. **Locate Your Firebase Config**
   - Go back to your Firebase Console
   - Click the gear icon ⚙️ next to "Project Overview"
   - Click **"Project settings"**
   - Scroll down to "Your apps" section
   - Find your web app
   - Click the **"Config"** radio button (not "CDN")
   - Copy the `firebaseConfig` object

2. **Update `firebase-config.js`**
   - Open the file `firebase-config.js` in your project folder
   - Find these lines:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY_HERE",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     // ... etc
   };
   ```
   - Replace `YOUR_API_KEY_HERE` and other placeholder values with your actual values from Firebase

   **Example:**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyAbc123-YourActualKey",
     authDomain: "purdue-ai-catalog.firebaseapp.com",
     projectId: "purdue-ai-catalog",
     storageBucket: "purdue-ai-catalog.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abc123def456"
   };
   ```

3. **Save the file**

---

## 📤 Part 3: Migrate Your Existing Data to Firebase

### Step 7: Upload Use Cases to Firestore

1. **Open Migration Tool**
   - Open `migrate-to-firebase.html` in your web browser
   - You can double-click the file or right-click → Open with → your browser

2. **Run Migration**
   - You should see a page titled "Migrate Use Cases to Firebase"
   - Click the **"Start Migration"** button
   - Wait for it to complete (should take a few seconds)
   - You should see: "✓ Successfully migrated 6 use cases to Firebase!"

3. **Verify Data in Firebase**
   - Go back to Firebase Console
   - Click **"Firestore Database"** in the left sidebar
   - Click on the **"Data"** tab
   - You should see a collection called `useCases`
   - Click on it to see your 6 use cases
   - Each one should have fields like `title`, `ai_tool`, `for_use_by`, `sections`, etc.

**If you see an error:**
- Check that you updated `firebase-config.js` correctly
- Make sure you're online
- Check browser console for error messages (F12 → Console tab)

---

## 🚀 Part 4: Deploy to GitHub Pages

### Step 8: Create GitHub Repository

1. **Create New Repository**
   - Go to https://github.com
   - Sign in to your account
   - Click the **"+"** icon in top right
   - Click **"New repository"**

2. **Configure Repository**
   - Repository name: `ai-use-case-catalog` (or your preferred name)
   - Description: `AI Use Case Catalog for Purdue University`
   - Select **"Public"** (required for free GitHub Pages)
   - **Do NOT** check "Add a README" (you already have one)
   - Click **"Create repository"**

### Step 9: Push Your Code to GitHub

1. **Open Terminal/Command Prompt**
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `terminal`, press Enter

2. **Navigate to Your Project Folder**
   ```bash
   cd "C:\Users\cuneyt\Documents\GitHub\UseCase\UseCase"
   ```
   (Adjust the path to match where your files are)

3. **Initialize Git (if not already done)**
   ```bash
   git init
   ```

4. **Add All Files**
   ```bash
   git add .
   ```

5. **Commit Files**
   ```bash
   git commit -m "Initial commit with Firebase integration"
   ```

6. **Add Remote Repository**
   - Replace `YOUR-USERNAME` with your GitHub username:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/ai-use-case-catalog.git
   ```

7. **Push to GitHub**
   ```bash
   git branch -M main
   git push -u origin main
   ```

8. **Enter GitHub Credentials**
   - You may be prompted to login to GitHub
   - Enter your username and password (or personal access token)

### Step 10: Enable GitHub Pages

1. **Go to Repository Settings**
   - Open your repository on GitHub
   - Click the **"Settings"** tab (top right area)

2. **Navigate to Pages**
   - In the left sidebar, scroll down and click **"Pages"**

3. **Configure Source**
   - Under "Source", select **"main"** branch
   - Leave folder as **"/ (root)"**
   - Click **"Save"**

4. **Wait for Deployment**
   - GitHub will take 1-2 minutes to build your site
   - Refresh the page
   - You should see a green box that says: "Your site is live at https://YOUR-USERNAME.github.io/ai-use-case-catalog/"

5. **Visit Your Site**
   - Click the URL to open your live website!

---

## 🔐 Part 5: Using the Admin Panel

### Step 11: Access Admin Panel

1. **Go to Admin Page**
   - Add `/admin.html` to your website URL
   - Example: `https://YOUR-USERNAME.github.io/ai-use-case-catalog/admin.html`

2. **Login**
   - Enter the email and password you created in Firebase Authentication (Step 5)
   - Click **"Sign In"**

3. **You're In!**
   - You should now see the Admin Panel with a list of use cases
   - You can now add, edit, or delete use cases

### Step 12: Add a New Use Case

1. **Click "Add New Use Case"**

2. **Fill Out the Form**
   - **Title** (required): e.g., "Resume Builder Assistant"
   - **AI Tool** (required): Select from dropdown (GEM/NLM/WEBAPP)
   - **For Use By** (required): e.g., "Students"
   - **Purpose** (required): Describe what it does
   - **Instructions**: How to set it up
   - **Prompts**: The prompts to use
   - **Variations**: What can be changed
   - **Notes**: Tips and warnings
   - **Links/Video**: URLs to demos or videos
   - **Setup Screenshot**: Upload an image (optional)
   - **Use Screenshot**: Upload an image (optional)

3. **Save**
   - Click **"Save Use Case"**
   - Wait for "Use case saved successfully!"
   - You'll be redirected back to the admin panel

4. **View Your New Use Case**
   - Go back to the main site: `https://YOUR-USERNAME.github.io/ai-use-case-catalog/`
   - Your new use case should appear immediately!

### Step 13: Edit an Existing Use Case

1. **From Admin Panel**
   - Click **"Edit"** next to any use case

2. **Make Changes**
   - Update any fields you want to change
   - Upload new screenshots if needed (will replace old ones)

3. **Save**
   - Click **"Save Use Case"**
   - Changes appear on the site immediately

### Step 14: Delete a Use Case

1. **From Admin Panel**
   - Click **"Delete"** next to any use case
   - Confirm the deletion
   - The use case and its images will be permanently deleted

---

## 👥 Part 6: Add More Admin Users (Optional)

### Step 15: Add Additional Admins

1. **Go to Firebase Console**
   - Navigate to **Authentication** → **Users** tab

2. **Add User**
   - Click **"Add user"**
   - Enter their email and create a password
   - Share the credentials with them securely
   - They can now login to the admin panel

---

## 🔧 Troubleshooting

### Problem: "Error loading use cases"

**Solution:**
- Check that `firebase-config.js` has your correct Firebase credentials
- Verify Firestore is enabled in Firebase Console
- Check browser console (F12) for specific error messages

### Problem: "Can't login to admin"

**Solution:**
- Verify the email/password are correct
- Check that you created a user in Firebase Authentication
- Make sure Authentication is enabled with Email/Password provider

### Problem: "Images won't upload"

**Solution:**
- Verify Firebase Storage is enabled
- Check that storage rules allow authenticated writes
- Make sure you're logged in as admin
- Check file size (Firebase has limits on free tier)

### Problem: "Changes don't appear on GitHub Pages"

**Solution:**
- Wait 1-2 minutes for GitHub to rebuild the site
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check GitHub Actions tab to see if build succeeded

### Problem: "Website shows old static data"

**Solution:**
- Clear browser cache
- Make sure you pushed the updated code to GitHub
- Verify `index.html` includes Firebase scripts (not `data.js`)

---

## 📁 Important Files

### Core Website Files
- `index.html` - Main catalog page
- `detail.html` - Dynamic detail page (loads from Firebase)
- `admin.html` - Admin panel for managing use cases
- `styles.css` - Main styling
- `admin-styles.css` - Admin-specific styles

### JavaScript Files
- `firebase-config.js` - **YOUR FIREBASE CREDENTIALS** ⚠️
- `app.js` - Main catalog logic
- `detail.js` - Detail page logic
- `admin.js` - Admin panel logic

### Data Files
- `use_cases.json` - Original static data (used for migration)
- `data.js` - OLD static data file (no longer used)

### Utility Files
- `migrate-to-firebase.html` - Tool to upload data to Firebase
- `README.md` - This file!

---

## 🔒 Security Notes

### ⚠️ IMPORTANT: Firebase Config Security

The file `firebase-config.js` contains your Firebase API keys. **This is OK to commit to GitHub** because:

1. Firebase API keys are meant to be public (they identify your project)
2. Security is enforced by Firebase Security Rules (not by hiding keys)
3. Your Firestore and Storage rules only allow authenticated users to write

**However, you should:**
- Never commit Firebase **service account keys** (private JSON files)
- Never put admin passwords in code
- Keep the Firebase Console access restricted

### Firestore Security Rules

Current rules allow:
- ✅ Anyone can READ use cases (public catalog)
- ❌ Only authenticated users can WRITE (admins only)

**To make catalog private:**
```javascript
match /useCases/{document=**} {
  allow read: if request.auth != null;  // Only admins can read
  allow write: if request.auth != null; // Only admins can write
}
```

---

## 🎨 Customization

### Change Purdue Colors

Edit `styles.css` and update the `:root` CSS variables:
```css
:root {
    --campus-gold: #C28E0E;
    --athletic-gold: #CEB888;
    --purdue-black: #000000;
    /* etc... */
}
```

### Add More AI Tool Types

1. Add option to `index.html` filters
2. Add option to `admin.html` form
3. Update `getToolName()` function in `firebase-config.js`

---

## 📞 Support

### Firebase Documentation
- Firestore: https://firebase.google.com/docs/firestore
- Storage: https://firebase.google.com/docs/storage
- Authentication: https://firebase.google.com/docs/auth

### GitHub Pages Documentation
- https://pages.github.com/

---

## 📝 License

© 2024 Purdue University. All rights reserved.

---

## ✅ Final Checklist

Before going live, make sure:
- [ ] Firebase project created and configured
- [ ] Firestore database enabled with security rules
- [ ] Firebase Storage enabled with security rules
- [ ] Firebase Authentication enabled with admin user
- [ ] `firebase-config.js` updated with your credentials
- [ ] Data migrated to Firebase successfully
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled and working
- [ ] Can login to admin panel
- [ ] Can add/edit/delete use cases
- [ ] Images upload successfully
- [ ] Changes appear on live site immediately

---

**🎉 Congratulations! Your AI Use Case Catalog is now live and fully functional!**

You can now manage all content through the admin panel without touching any code. Share the admin credentials with trusted colleagues, and they can add use cases too!

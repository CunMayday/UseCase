# Quick Start Guide

## Your Live Site

🌐 **Main Site:** https://cunmayday.github.io/UseCase
🔐 **Admin Panel:** https://cunmayday.github.io/UseCase/admin.html
💾 **GitHub Repo:** https://github.com/cunmayday/UseCase

---

## ⚠️ Current Status: TEST MODE

Your site is **LIVE** but in **TEST MODE**:
- ✅ Anyone can VIEW use cases (good)
- ⚠️ Anyone can EDIT use cases (temporary - for testing)
- 📝 Authentication will be added later

---

## What You Can Do Right Now

### 1. View Your Catalog
Visit: https://cunmayday.github.io/UseCase
- Browse use cases
- Test filtering (by tool, by user)
- Test sorting
- Click on use cases to see details

### 2. Add/Edit Content (No Login Required - Test Mode)
Visit: https://cunmayday.github.io/UseCase/admin.html
- You can access without logging in (test mode)
- Add new use cases
- Edit existing ones
- Upload screenshots
- Delete use cases

### 3. Test Everything
- Add a test use case
- Upload test images
- Edit it
- Delete it
- Make sure everything works!

---

## Next Steps (When Ready for Production)

📖 See: **PRODUCTION_DEPLOYMENT.md** for detailed instructions

**Quick version:**
1. Enable Firebase Authentication
2. Create admin user(s)
3. Update Firestore security rules
4. Update Storage security rules
5. Test admin login
6. Site is now secured!

---

## Important Files Reference

| File | Purpose |
|------|---------|
| **README.md** | Complete Firebase setup guide |
| **PRODUCTION_DEPLOYMENT.md** | How to lock down for production |
| **PROJECT_CONTEXT.md** | Full project history and context |
| **CLAUDE.md** | Guidelines for AI development |
| **FIREBASE_MIGRATION_SUMMARY.md** | What changed in Firebase migration |
| **QUICK_START.md** | This file - quick reference |

---

## Common Tasks

### Update Your Site
1. Edit files locally
2. Commit: `git add . && git commit -m "description"`
3. Push: `git push`
4. Wait 1-2 minutes for GitHub Pages to rebuild

### Add Content (Test Mode)
1. Go to admin panel
2. Click "Add New Use Case"
3. Fill out form
4. Upload screenshots
5. Click "Save"
6. Refresh main site to see it

### Check Firebase Data
1. Visit: https://console.firebase.google.com
2. Select your project
3. Click "Firestore Database" to see data
4. Click "Storage" to see uploaded images

---

## Need Help?

**Firebase Issues:**
- Check: README.md (complete setup guide)
- Check: PRODUCTION_DEPLOYMENT.md (security setup)

**Site Not Updating:**
- Wait 1-2 minutes after pushing to GitHub
- Clear browser cache (Ctrl+F5)
- Check GitHub Actions tab for build status

**Data Issues:**
- Check Firebase Console → Firestore Database
- Verify data was migrated (should see useCases collection)

---

## Repository Structure

```
UseCase/
├── index.html              # Main catalog page
├── detail.html             # Dynamic detail page
├── admin.html              # Admin panel
├── firebase-config.js      # Your Firebase credentials
├── app.js                  # Main app logic
├── detail.js               # Detail page logic
├── admin.js                # Admin logic
├── styles.css              # Main styling
├── admin-styles.css        # Admin styling
├── use_cases.json          # Original data (for migration)
├── migrate-to-firebase.html # Migration tool
└── Documentation/
    ├── README.md
    ├── PRODUCTION_DEPLOYMENT.md
    ├── PROJECT_CONTEXT.md
    ├── CLAUDE.md
    ├── FIREBASE_MIGRATION_SUMMARY.md
    └── QUICK_START.md (this file)
```

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Site shows old data | Clear cache, wait for GitHub rebuild |
| Can't see use cases | Check Firebase config in `firebase-config.js` |
| Admin panel not working | Check browser console (F12) for errors |
| Images not loading | Check Firebase Storage is enabled |
| Changes not saving | Check browser console for Firebase errors |

---

**Happy editing! 🎉**

When you're ready to lock down the site for production, follow: **PRODUCTION_DEPLOYMENT.md**

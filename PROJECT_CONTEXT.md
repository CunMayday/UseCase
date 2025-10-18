# AI Use Case Catalog - Project Context & Status

## Project Information

**Live Site:** https://cunmayday.github.io/UseCase
**GitHub Repo:** https://github.com/cunmayday/UseCase
**Admin Panel:** https://cunmayday.github.io/UseCase/admin.html

### ✅ Current Status:
1. **DEPLOYED** - Live at GitHub Pages with Firebase backend
2. **Authentication** - Enabled with Firebase Auth (admin users can log in)
3. **Security Rules** - Firestore and Storage rules configured for production
4. **Repository Name** - UseCase (capitalized)
5. **Google Workspace Integration** - Uses Google Sign-In for Purdue University (@purdue.edu) accounts

## Project Purpose
Create a web-based catalog of AI tool use cases for Purdue University, allowing faculty, staff, and students to browse, filter, and view detailed information about approved AI tools and their applications.

## What Was Accomplished

### Session Overview
Built a complete static website from a Word document containing AI use case examples. The site features filtering, sorting, and detailed views following Purdue University branding guidelines.

### Phase 1: Initial Setup & Extraction
**Completed:**
- Extracted content from `AI Use case catalog.docx` using python-docx library
- Parsed 6 use cases from document tables
- Created structured JSON data format
- Generated initial website files

**Files Created:**
- `extract_docx.py` - Extracts raw content from Word document
- `docx_content.json` - Raw extracted data
- `parse_usecases.py` - Parses tables into structured use cases
- `use_cases.json` - Complete structured data

### Phase 2: Website Development
**Completed:**
- Created main catalog page (`index.html`) with:
  - Filtering by User Type (Faculty/Staff/Students)
  - Filtering by AI Tool (Gemini Gem/Notebook LM/Web Apps)
  - Sorting (Default/Title/Tool/User)
  - Results count display
  - Responsive card layout

- Created styling (`styles.css`) with:
  - Purdue University official colors
  - Campus Gold (#C28E0E) for primary highlights
  - Athletic Gold (#CEB888) for secondary elements
  - Purdue Black (#000000) for text
  - Responsive design for mobile/tablet/desktop
  - Card-based layout with hover effects

- Created functionality (`app.js`) with:
  - Dynamic filtering and sorting
  - Card generation from data
  - Navigation to detail pages
  - Reset filters functionality

- Generated individual detail pages (`use-case-1.html` through `use-case-6.html`)

### Phase 3: Data Standardization
**Problem Encountered:**
- Some use cases had missing sections (Instructions, Variations, Notes)
- Data extraction had mixed up Instructions and Notes in some cases
- No consistent template enforced

**Solution Implemented:**
1. **Created `rebuild_json.py`** - Rebuilds data from source with proper extraction
2. **Updated `generate_detail_pages.py`** to:
   - Always display all 6 required sections
   - Show placeholder text for empty sections
   - Support screenshot fields
   - Handle Web Apps tool type

3. **Standardized Template Format:**
   - Purpose
   - Instructions
   - Prompts
   - Variations
   - Notes
   - Links/Screenshots/Video (with sub-sections for video link, demo link, setup screenshot, use screenshot)

4. **Added placeholder styling** - Gray italic text for empty fields

### Phase 4: Tool Type Expansion
**Completed:**
- Added "Web Apps" as third AI tool type (in addition to Gemini Gem and Notebook LM)
- Updated filters in `index.html`
- Updated display logic in `app.js`
- Updated generator in `generate_detail_pages.py`

### Phase 5: Data Integrity Fixes
**Issues Fixed:**
- Use Case 1 (Outcome and Rubric Assistant): Separated Instructions from Notes, added missing Variations
- Use Case 6 (Audio overviews): Added proper Instructions that were in wrong field
- All use cases now have complete data from original document

## Current State

### What's Working
✅ Static website fully functional
✅ All 6 use cases displayed correctly
✅ Filtering by User Type works
✅ Filtering by AI Tool works (GEM/NLM/WEBAPP)
✅ Sorting works (Default/Title/Tool/User)
✅ Detail pages show all 6 sections
✅ Placeholder text for empty sections
✅ Purdue branding applied throughout
✅ Responsive design for mobile/desktop
✅ Works from local files (no server needed)

### Latest Enhancement (2025-10-18)
✅ **Multiple User Type Selection**
- Admin form now supports selecting multiple user types via checkboxes
- Available options: Students, Faculty, Curriculum, Staff, Administration
- Data stored as array in Firestore for each use case
- Filtering logic updated to work with multiple user types per use case
- Detail pages and catalog cards display comma-separated list of user types
- Backward compatible with existing single-value entries

## Use Cases Included

1. **Outcome and Rubric Assistant** (GEM) - Faculty & Curriculum Specialists
2. **Mock Interviewer** (GEM) - Students
3. **Lecture Assistant** (GEM) - Students
4. **Meeting/Training Assistant** (NLM) - Faculty/staff
5. **Knowledge base Manager** (NLM) - Faculty/staff
6. **Audio overviews of Book Chapters** (NLM) - Students

## Technology Stack

### Current (Dynamic - DEPLOYED)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Database:** Firebase Firestore (NoSQL document database)
- **File Storage:** Firebase Storage (for screenshot images)
- **Authentication:** Firebase Auth with Google Sign-In
- **Hosting:** GitHub Pages (static site) + Firebase (data/images)
- **Styling:** Custom CSS with Purdue branding
- **Admin Panel:** Full CRUD interface for managing use cases

## Project Goals

### Completed Goals ✅
- ✅ Extract data from Word document
- ✅ Create browsable catalog website
- ✅ Implement filtering and sorting
- ✅ Apply Purdue branding
- ✅ Generate detail pages for each use case
- ✅ Standardize template format
- ✅ Add placeholder support for missing data
- ✅ Set up Firebase project
- ✅ Configure Firestore database
- ✅ Configure Firebase Storage for images
- ✅ Add Firebase SDK to website
- ✅ Migrate data to Firestore
- ✅ Create form for adding new use cases
- ✅ Create form for editing existing use cases
- ✅ Add image upload functionality
- ✅ Implement Firebase authentication
- ✅ Deploy to GitHub Pages
- ✅ Configure Firebase security rules
- ✅ Add admin user accounts
- ✅ Integrate Google Sign-In for Purdue accounts
- ✅ Support multiple user type selection per use case

### Future Enhancements (Planned)
- Search functionality (keyword search across use cases)
- Tags/categories beyond just tool type
- Comments or ratings system
- Export to PDF functionality
- Analytics to track popular use cases
- Email notifications for new submissions

## Next Steps

### Step 1: Firebase Setup
**What to do:**
1. Create Firebase project at console.firebase.google.com
2. Enable Firestore Database
3. Enable Firebase Storage
4. Enable Firebase Authentication
5. Get Firebase config (API keys, project ID, etc.)

**What you'll need:**
- Google account
- Firebase project name (suggest: "purdue-ai-catalog")

### Step 2: Migrate Data to Firebase
**What to do:**
1. Add Firebase SDK scripts to `index.html`
2. Add Firebase config to project
3. Create script to upload `use_cases.json` data to Firestore
4. Update `app.js` to read from Firestore instead of `data.js`
5. Test that filtering/sorting still works

### Step 3: Add Editing Interface
**What to do:**
1. Create `edit.html` - Form page for adding/editing use cases
2. Add authentication check (only logged-in users can access)
3. Create form with all 6 template sections
4. Add image upload for screenshots
5. Save to Firestore when submitted
6. Regenerate catalog view automatically

### Step 4: Deploy
**What to do:**
1. Push code to GitHub repository
2. Enable GitHub Pages
3. Configure Firebase security rules
4. Add admin users to Firebase Auth
5. Test production deployment

## Important Decisions Made

### Why Static First, Then Firebase?
- **Pro:** Get working website quickly to validate design
- **Pro:** Can demo to stakeholders before backend complexity
- **Pro:** Easier to understand and modify
- **Con:** Manual updates required initially

### Why GitHub Pages + Firebase (Not All Firebase)?
- **Pro:** Free hosting on GitHub Pages
- **Pro:** Familiar Git workflow for code changes
- **Pro:** Separation of code (GitHub) and data (Firebase)
- **Pro:** Easy rollback if issues arise

### Why All 6 Sections Required?
- **Pro:** Consistent user experience
- **Pro:** Clear template for contributors
- **Pro:** Easy to identify missing information
- **Con:** Some sections show placeholders

## Key Files Reference

### Main Files (Don't Delete)
- `index.html` - Main catalog page
- `styles.css` - All styling
- `app.js` - Filtering/sorting logic
- `data.js` - Current data source
- `use_cases.json` - Master data file
- `use-case-*.html` - Detail pages

### Python Scripts (For Updates)
- `extract_docx.py` - Extract from Word
- `rebuild_json.py` - Rebuild JSON
- `generate_detail_pages.py` - Create HTML pages

### Documentation
- `README.md` - How to use the website
- `CLAUDE.md` - Guidelines for AI assistant
- `PROJECT_CONTEXT.md` - This file

## How to Resume Development

### If Updating Data
1. Read `CLAUDE.md` for formatting guidelines
2. Edit `use_cases.json`
3. Run `python generate_detail_pages.py`
4. Test in browser

### If Adding Firebase
1. Review "Next Steps" section above
2. Read Firebase documentation
3. Start with Step 1 (Firebase Setup)
4. Keep existing HTML/CSS/styling unchanged
5. Only modify data fetching in `app.js`

### If Adding Features
1. Review `CLAUDE.md` for design guidelines
2. Maintain Purdue color palette
3. Test all existing functionality still works
4. Update this file with new features added

## Questions to Consider Before Next Session

1. **Who will be authorized to add/edit use cases?**
   - Only you?
   - Specific faculty/staff?
   - Anyone at Purdue?

2. **Approval workflow needed?**
   - Should new submissions require review before publishing?
   - Or publish immediately?

3. **Domain/URL?**
   - Use github.io subdomain?
   - Need custom domain (e.g., ai-catalog.purdue.edu)?

4. **Analytics?**
   - Track which use cases are most viewed?
   - Track user engagement?

## Success Metrics

### Current Status
- ✅ 6 use cases cataloged
- ✅ 3 AI tools supported (GEM, NLM, WEBAPP)
- ✅ 100% Purdue brand compliant
- ✅ Mobile responsive
- ✅ Zero server costs (static)

### Production Status
- ✅ Non-technical users can add use cases via admin panel
- ✅ Image uploads working for screenshots
- ✅ Real-time updates (no regeneration needed)
- ✅ User authentication working with Google Sign-In
- ✅ Deployed and accessible online at https://cunmayday.github.io/UseCase
- ✅ Multiple user types per use case supported

## Notes for Future Development

### Keep in Mind
- Purdue branding is non-negotiable - always use official colors
- All 6 template sections must always be present
- Placeholder text helps identify missing content
- Mobile users are important - test responsive design
- Keep it simple - faculty/staff need to use this easily

### Avoid
- Don't overcomplicate the UI
- Don't remove the standardized template
- Don't break the filtering/sorting
- Don't deploy without testing
- Don't hardcode sensitive data (use environment variables for Firebase config)

## Contact & Resources

### Purdue Branding Guidelines
- Colors documented in `CLAUDE.md`
- Follow university style guide for any text content

### Original Source
- `AI Use case catalog.docx` - Keep this as reference
- If document updated, re-run extraction scripts

### Version Control
- Use Git for all code changes
- Create meaningful commit messages
- Tag releases when deploying

---

**Last Updated:** 2025-10-18
**Status:** Production Deployment Complete with Multiple User Type Support
**Next Session:** Content management and potential feature additions

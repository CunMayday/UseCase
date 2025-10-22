# AI Use Case Catalog

A Firebase-powered dynamic catalog showcasing real, practical examples of AI tool usage. Browse use cases for Gemini Gems, Notebook LM, and Web Apps with filtering, sorting, and detailed instructions.

**Live Site:** https://cunmayday.github.io/UseCase

## Key Features

- **Dynamic Content Management** - All use cases stored in Firebase Firestore with real-time updates
- **Advanced Filtering** - Filter by AI tool type and target user (Faculty, Staff, Students, etc.)
- **Smart Sorting** - Sort by recently modified, newest, title, tool, or user type
- **PDF Export** - Generate professional PDFs for individual or multiple use cases with cover page and table of contents
- **Timestamp Tracking** - Automatic tracking of creation and modification dates
- **Editor Panel** - Authenticated interface for adding, editing, and deleting use cases
- **Image Management** - Firebase Storage integration for setup and usage screenshots
- **Responsive Design** - Optimized for desktop, tablet, and mobile viewing
- **Purdue Branding** - Official Purdue University colors and styling

## For End Users

### Browsing Use Cases

Visit https://cunmayday.github.io/UseCase to explore the catalog.

**Filter Options:**
- **User Type** - Faculty, Staff, Students, All
- **AI Tool** - Gemini Gem, Notebook LM, Web Apps, All Tools

**Sort Options:**
- Recently Modified (default)
- Newest
- Title (A-Z)
- AI Tool
- User Type

### Use Case Information

Each use case includes:

1. **Purpose** - What the activity accomplishes
2. **Instructions** - Detailed setup guide
3. **Prompts** - Ready-to-use prompts for the AI tool
4. **Variations** - How to adapt for different needs
5. **Notes** - Tips, warnings, and best practices
6. **Links/Screenshots/Video** - Visual guides and demonstrations

### Exporting PDFs

- **Single Use Case** - Click the "Export to PDF" button on any detail page
- **Multiple Use Cases** - Use filters to select specific use cases, then click "Export Filtered to PDF" on the main page
- PDFs include professional cover page, table of contents, and complete use case details

## For Developers

### Tech Stack

- **Frontend** - Vanilla JavaScript, HTML5, CSS3
- **Hosting** - GitHub Pages
- **Database** - Firebase Firestore
- **Storage** - Firebase Storage
- **Authentication** - Firebase Auth (email/password)
- **PDF Generation** - jsPDF library

### Project Structure

```
UseCase/
├── index.html              # Main catalog page with filters/sorting
├── editor.html             # Editor panel for managing use cases
├── styles.css              # Purdue-branded styling
├── editor-styles.css       # Editor panel styling
├── app.js                  # Catalog logic (filtering, sorting, PDF export)
├── editor.js               # Editor panel logic (CRUD operations)
├── firebase-config.js      # Firebase initialization and helpers
├── detail.js               # Detail page logic
├── use-case-X.html         # Individual use case detail pages
├── CLAUDE.md               # AI assistant instructions
└── RECENT_CHANGES.md       # Session handoff document
```

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/cunmayday/UseCase.git
   cd UseCase
   ```

2. **Firebase Configuration**
   - The project uses Firebase web SDK (firebase-config.js)
   - Firebase web API keys are meant to be public
   - Security is enforced through Firestore Security Rules

3. **Open in browser**
   - Open `index.html` directly in a web browser
   - No build process or local server required
   - Works from `file://` protocol

4. **Editor Access**
   - Navigate to `editor.html`
   - Contact caltinoz@purdueglobal.edu for editor credentials

### Firebase Configuration

**Firestore Database:**
- Collection: `useCases`
- Security Rules: Public read, authenticated write
- Automatic timestamps: `createdAt`, `updatedAt`

**Firebase Storage:**
- Bucket: `purdue-ai-catalog.firebasestorage.app`
- Structure: `use-cases/{docId}/{imageType}`
- Allowed types: JPG, PNG, GIF, WebP (max 5MB)

**Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /useCases/{document=**} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Authenticated write
    }
  }
}
```

**Storage Security Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /use-cases/{document=**} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Authenticated write
    }
  }
}
```

### Design Guidelines

**Purdue University Colors:**
- Campus Gold: `#C28E0E` (primary highlights)
- Athletic Gold: `#CEB888` (secondary elements)
- Purdue Black: `#000000` (primary text)
- Dark Gray: `#373A36` (secondary text)
- Gray: `#9D968D` (supporting elements)
- White: `#FFFFFF` (backgrounds)
- Light Background: `#F5F5F5`

**Typography:**
- Font: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Body: 1.05rem, line-height 1.6-1.7
- Code/Prompts: 'Courier New', monospace

**Component Patterns:**
- Cards: White background, 2px border, 8px radius, 5px Campus Gold top border
- Badges: Campus Gold/Athletic Gold background, uppercase, 0.85rem
- Buttons: Dark Gray background, white text, hover to Black
- Hover effects: `translateY(-5px)` with enhanced shadow

### Data Structure

**Use Case Document:**
```javascript
{
  id: "auto-generated-id",
  title: "Use Case Title",
  ai_tool: "GEM|NLM|WEBAPP",
  for_use_by: "Faculty|Staff|Students|etc",
  submitted_by: "email@purdueglobal.edu",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  sections: {
    purpose: "Purpose of the activity",
    instructions: "Setup instructions",
    prompts: "AI prompts to use",
    variations: "Possible variations",
    notes: "Tips and warnings",
    links: "Resources and links",
    screenshot_setup: "Firebase Storage URL",
    screenshot_use: "Firebase Storage URL"
  }
}
```

**AI Tool Types:**
- `GEM` - Gemini Gem
- `NLM` - Notebook LM
- `WEBAPP` - Web Apps

### Critical Technical Notes

1. **Orphan Document Prevention**
   - Creating a new use case creates a temporary document first
   - If image upload fails, the temp document is automatically deleted
   - See `editor.js` lines 225-358 for cleanup logic
   - Prevents crashes in sorting and PDF export from missing required fields

2. **Timestamp Handling**
   - `createdAt`: Set once on creation using `serverTimestamp()`
   - `updatedAt`: Updated on every save using `serverTimestamp()`
   - Timestamps are Firestore Timestamp objects, use `.toDate()` for display

3. **PDF Export Pagination**
   - Long text sections split line-by-line with page break checks
   - Each line checked against `maxY` (280mm) before rendering
   - New pages created automatically when content would overflow
   - See `app.js` `addSection()` function

4. **Sorting Implementation**
   - Default sort: "Recently Modified" (updatedAt descending)
   - Timestamp sorting requires `.toMillis()` conversion
   - String comparisons use `.localeCompare()` for proper alphabetical order

### Development Workflow

**Adding New Use Cases:**
1. Log in to editor panel at `editor.html`
2. Fill out the form with all required fields
3. Upload setup and use screenshots (optional but recommended)
4. Click "Save Use Case"
5. New use case appears immediately on catalog page

**Editing Existing Use Cases:**
1. Click "Edit" button on any use case card in editor panel
2. Modify fields as needed
3. Upload new screenshots to replace existing ones (optional)
4. Click "Save Use Case"

**Deleting Use Cases:**
1. Click "Delete" button on any use case card in editor panel
2. Confirm deletion
3. Associated images automatically deleted from Firebase Storage

### Deployment

The site is automatically deployed via GitHub Pages from the `main` branch.

**To deploy changes:**
1. Commit and push changes to `main` branch
2. GitHub Pages automatically rebuilds
3. Changes live at https://cunmayday.github.io/UseCase within 1-2 minutes

**No build process required** - All files are static HTML/CSS/JS

### Security Philosophy

**Why Firebase API Keys Are Public:**
- Firebase web API keys are designed to be public
- They identify your Firebase project, not authenticate users
- Security enforced through Firestore Security Rules and Authentication
- Public read access allows catalog browsing without login
- Write access restricted to authenticated editor accounts

**Editor Authentication:**
- Email/password accounts manually created in Firebase Console
- Only authorized Purdue Global staff receive credentials
- All write operations require authentication
- Firestore Security Rules enforce server-side validation

### Contributing

This is an internal Purdue University Global project. To request changes or report issues, contact caltinoz@purdueglobal.edu.

For editor access, contact the same email address.

### Recent Updates

- **Orphan Document Cleanup** - Automatic deletion of temp documents on failed uploads
- **PDF Export Enhancements** - Professional cover page and table of contents
- **PDF Pagination Fix** - Proper handling of long text sections across pages
- **Default Sort Change** - Recently Modified now default for better UX
- **Timestamp Tracking** - All use cases track creation and modification dates
- **Submitted By Field** - Track which editor submitted each use case
- **Bulk PDF Export** - Export filtered sets of use cases to single PDF
- **Editor Panel** - Complete CRUD interface with authentication

---

**Project Status:** Production
**Last Updated:** January 2025
**Maintained By:** Purdue University Global
**Contact:** caltinoz@purdueglobal.edu

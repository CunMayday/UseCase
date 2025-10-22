# Claude Instructions - AI Use Case Catalog Project

## Project Information

**Live Site:** https://cunmayday.github.io/UseCase
**GitHub Repo:** https://github.com/cunmayday/UseCase
**Editor Panel:** https://cunmayday.github.io/UseCase/editor.html

### ⚠️ Current Configuration:
1. **Production** - Firestore with secure rules (authenticated writes required)
2. **Authentication** - Email/password authentication (manually created accounts)
3. **Repository Name** - UseCase (not ai-use-case-catalog)
4. **Institution** - Purdue University Global (not just "Purdue University")

## Project Overview
This is a Firebase-powered dynamic catalog for AI tool use cases at Purdue University Global. It displays use cases for tools like Gemini Gems, Notebook LM, and Web Apps, with filtering, sorting, timestamp tracking, and detailed view pages. Editors can add/edit/delete content through a web interface with authentication.

## Design Guidelines

### Purdue University Branding Colors
**IMPORTANT:** Always use these exact colors for any new components:

```css
--campus-gold: #C28E0E;        /* Primary gold for highlights and accents */
--athletic-gold: #CEB888;      /* Softer gold for secondary elements */
--purdue-black: #000000;       /* Primary text and strong accents */
--gray: #9D968D;              /* Supporting text and borders */
--dark-gray: #373A36;         /* Secondary text */
--white: #FFFFFF;             /* Clean backgrounds and contrast */
--light-bg: #F5F5F5;          /* Light backgrounds */
--border-color: #D3D3D3;      /* Borders */
```

**Color Usage:**
- Headers/Hero: Black gradient background
- Primary CTAs/Highlights: Campus Gold (#C28E0E)
- Secondary elements/badges: Athletic Gold (#CEB888)
- Body text: Purdue Black (#000000)
- Supporting text: Dark Gray (#373A36)
- Placeholders: Gray (#9D968D)

### Typography
- Font family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Headings: Bold, Campus Gold or Purdue Black
- Body text: 1.05rem, line-height 1.6-1.7
- Code/Prompts: 'Courier New', monospace

### Component Styling Patterns

#### Cards
```css
- White background
- 2px border (#D3D3D3)
- 8px border-radius
- 5px top border: Campus Gold gradient
- Hover: translateY(-5px) with enhanced shadow
- Box shadow on hover: 0 8px 20px rgba(0,0,0,0.15)
```

#### Badges
```css
- Tool badge: Campus Gold background, white text
- User badge: Athletic Gold background, black text
- Padding: 0.35rem 0.75rem
- Border-radius: 20px
- Font-size: 0.85rem, uppercase, letter-spacing: 0.5px
```

#### Buttons
```css
- Primary: Dark Gray background, white text
- Hover: Black background with translateY(-2px)
- Padding: 0.75rem 1.5rem
- Border-radius: 5px
```

#### Section Blocks (Detail Pages)
```css
- Margin-bottom: 2.5rem
- Padding-bottom: 2rem
- Border-bottom: 2px solid light-bg
- H2 headings: Campus Gold, 3px Athletic Gold bottom border
```

## Data Structure

### Use Case Object Format
```json
{
  "id": "use-case-X",
  "title": "Use Case Title",
  "submitted_by": "Name or department (optional)",
  "ai_tool": "GEM|NLM|WEBAPP",
  "for_use_by": "Faculty|Staff|Students|etc",
  "createdAt": "Firestore Timestamp (auto-generated on creation)",
  "updatedAt": "Firestore Timestamp (auto-updated on every edit)",
  "sections": {
    "purpose": "Purpose text",
    "instructions": "Setup instructions",
    "prompts": "Prompts to use",
    "variations": "Possible variations",
    "notes": "Tips and warnings",
    "links": "Links and resources",
    "screenshot_setup": "URL to setup screenshot",
    "screenshot_use": "URL to use screenshot"
  }
}
```

### AI Tool Types
- `GEM` = Gemini Gem
- `NLM` = Notebook LM
- `WEBAPP` = Web Apps

### Required Sections (Always Display All 6)
1. **Purpose** - Purpose of the activity
2. **Instructions** - Detailed instructions for setting it up
3. **Prompts** - All the prompts that need to be entered
4. **Variations** - What can be changed to meet different needs
5. **Notes** - Warnings, tips for effective use
6. **Links/Screenshots/Video** - With subsections:
   - Link to video demonstration: [to be added]
   - Link to public demo:
   - Screenshot of setup: [to be added]
   - Screenshot of use: [to be added]

**IMPORTANT:** If a section is empty, show placeholder text in gray italic (`<em class='placeholder'>`)

## Key Features

### Implemented Features
1. **Dynamic Firebase-Powered Catalog** - All use cases stored in Firestore, displayed dynamically
2. **Filtering & Sorting** - Filter by user type and AI tool, sort by newest, recently modified, title, tool, or user type
3. **Timestamp Tracking** - Automatic createdAt and updatedAt timestamps for all use cases
4. **Timestamp Display** - Creation and modification dates shown at bottom of detail pages (not in PDF exports)
5. **PDF Export** - Individual and bulk PDF export with professional cover page and table of contents
6. **Editor Panel** - Authenticated interface for adding/editing/deleting use cases
7. **Image Upload** - Firebase Storage integration for screenshot uploads
8. **Responsive Design** - Mobile-friendly layout following Purdue branding
9. **Orphan Document Cleanup** - Automatic cleanup of failed upload attempts to prevent database corruption

### Current Sorting Options
- **Recently Modified** (default) - Shows most recently edited use cases first
- **Newest** - Shows most recently created use cases first
- **Title (A-Z)** - Alphabetical by title
- **AI Tool** - Groups by tool type
- **User Type** - Groups by intended user

## File Structure

### Core Website Files
- `index.html` - Main catalog page with filters/sorting, link to editor
- `styles.css` - All styling (Purdue branded)
- `app.js` - JavaScript for filtering, sorting, display logic, bulk PDF export
- `detail.html` - Template for detail pages
- `detail.js` - Dynamic detail page loading and individual PDF export
- `editor.html` - Editor panel for managing use cases (formerly admin.html)
- `editor.js` - Editor logic with authentication and CRUD operations
- `editor-styles.css` - Editor panel styling
- `firebase-config.js` - Firebase configuration (public API keys)

### Deprecated/Legacy Files (no longer used)
- `data.js` - Old static data file (replaced by Firebase)
- `use-case-1.html` through `use-case-X.html` - Old static detail pages (replaced by dynamic detail.html)
- `use_cases.json`, `docx_content.json` - Old data files (migrated to Firebase)
- Python scripts - No longer needed (data managed through editor panel)

## Development Workflow

### Adding/Editing Use Cases (Current Method)
1. Go to **editor.html** and log in with editor credentials
2. Click "+ Add New Use Case" or "Edit" on existing case
3. Fill in form fields (all sections, user types, tool type)
4. Upload screenshots if needed (optional)
5. Click "Save Use Case"
6. Changes are immediately live in Firestore and visible on the site

### Managing Use Cases
- **Add**: Editor panel → Add New Use Case button
- **Edit**: Editor panel → Edit button next to use case
- **Delete**: Editor panel → Delete button (requires confirmation)
- **View**: Main catalog → Click any use case card → View Details

### One-Time Maintenance Tasks
- **Add timestamps to existing cases**: Already done, timestamps now auto-added
- **Clean up orphaned documents**: Use `cleanup_orphaned_docs.html` if needed (already in .gitignore)

## Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include descriptive comments for major sections
- Maintain consistent indentation (4 spaces)

### CSS
- Use CSS variables for colors (defined in `:root`)
- Group related styles together
- Comment major sections
- Mobile-first responsive design

### JavaScript
- Use `const` for data that doesn't change
- Use clear, descriptive function names
- Add comments for complex logic
- Keep functions focused on single responsibility

## Responsive Design Breakpoints
```css
@media (max-width: 768px) {
  /* Tablet and mobile adjustments */
  - Single column layouts
  - Adjusted font sizes
  - Simplified navigation
}
```

## Testing Checklist
Before committing changes:
- [ ] Test all filters (User Type, AI Tool)
- [ ] Test all sorting options
- [ ] Verify detail pages display all 6 sections
- [ ] Check placeholder text shows for empty sections
- [ ] Test on mobile viewport
- [ ] Verify Purdue colors are correct
- [ ] Check all links are working

## Important Notes

### Browser Compatibility
- Works directly from file:// protocol and HTTPS
- Firebase SDK loaded via CDN
- Tested on Chrome, Firefox, Safari, Edge

### Firebase Security
- **API Key is PUBLIC** - This is intentional and safe for client-side Firebase SDK
- **Security is enforced by Firestore Security Rules**, not by hiding the API key
- Current rules: Public read, authenticated write only
- Only manually created editor accounts can modify data
- No self-registration allowed

### Critical Technical Notes

**1. Orphan Document Prevention (IMPORTANT)**
- When creating a new use case, a temporary document is created first to get an ID for image uploads
- If upload fails, the temporary document is automatically deleted to prevent orphans
- Orphaned documents (missing title/ai_tool) cause crashes in sorting and PDF export
- See editor.js lines 257-356 for cleanup logic
- Use cleanup_orphaned_docs.html to find/remove any existing orphans

**2. Timestamp Handling**
- createdAt: Set once when use case is created (using serverTimestamp())
- updatedAt: Updated every time use case is saved (using serverTimestamp())
- Timestamps are Firestore Timestamp objects, must use .toDate() to display
- Existing use cases without timestamps will show nothing (not an error)

**3. PDF Export Pagination**
- Long text sections (especially prompts) are split line-by-line with page break checks
- Each line is checked against maxY (280mm) before rendering
- New pages created automatically when content would overflow
- See app.js addSection() function for implementation

**4. Sorting Implementation**
- Default sort: "Recently Modified" (updatedAt desc, falls back to createdAt)
- Sorting by timestamps requires .toMillis() conversion
- Missing timestamps default to 0 (appear last in sorted list)
- See app.js sortUseCases() function for all sort logic

### Don't Break These Rules
1. **Never** remove the 6 required sections from detail pages
2. **Always** use Purdue University Global (not just "Purdue University")
3. **Always** use Purdue brand colors (no custom colors)
4. **Always** show placeholder text for empty fields
5. **Never** expose Firebase service account keys (only client SDK config is public)
6. **Always** clean up temporary documents if operations fail

## Common Tasks

### Add a New Tool Type
1. Add to filter dropdown in `index.html`
2. Update tool name mapping in `firebase-config.js` (getToolName function)
3. Update tool name logic in `app.js` and `detail.js`
4. Test filtering on main page

### Change Styling
1. Edit `styles.css` or `editor-styles.css`
2. Use existing CSS variables when possible (defined in :root)
3. Maintain Purdue color palette
4. Test responsive design on mobile

### Troubleshoot Sorting Issues
1. Check that all use cases have createdAt and updatedAt fields in Firestore
2. If missing, use editor panel to edit and save the use case (will add timestamps)
3. Verify sortUseCases() function properly handles missing timestamps
4. Check browser console for errors

### Clean Up Database Issues
1. Log in to editor.html
2. Check for use cases with missing data
3. Either fix them manually or use cleanup_orphaned_docs.html
4. Verify no documents have only `{ temp: true }` in Firestore console

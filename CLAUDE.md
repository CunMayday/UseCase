# Claude Instructions - AI Use Case Catalog Project

## Project Information

**Live Site:** https://cunmayday.github.io/UseCase
**GitHub Repo:** https://github.com/cunmayday/UseCase
**Admin Panel:** https://cunmayday.github.io/UseCase/admin.html

### ⚠️ Current Configuration:
1. **Test Build** - Firestore in TEST MODE (open access for development)
2. **Authentication** - Will be enabled later for production
3. **Repository Name** - UseCase (not ai-use-case-catalog)

## Project Overview
This is a Firebase-powered dynamic catalog for AI tool use cases at Purdue University. It displays use cases for tools like Gemini Gems, Notebook LM, and Web Apps, with filtering, sorting, and detailed view pages. Admins can add/edit/delete content through a web interface.

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

## File Structure

### Core Website Files
- `index.html` - Main catalog page with filters/sorting
- `styles.css` - All styling (Purdue branded)
- `app.js` - JavaScript for filtering, sorting, display logic
- `data.js` - Simplified use case data for card display
- `use-case-1.html` through `use-case-X.html` - Individual detail pages

### Data Files
- `use_cases.json` - Complete structured data for all use cases
- `docx_content.json` - Original extracted content from Word doc
- `AI Use case catalog.docx` - Source document

### Python Scripts
- `extract_docx.py` - Extracts content from Word document
- `parse_usecases.py` - Parses extracted content into structured data
- `rebuild_json.py` - Rebuilds use_cases.json with proper escaping
- `generate_detail_pages.py` - Generates individual HTML detail pages

## Development Workflow

### Adding New Use Cases
1. Edit `use_cases.json` to add new entry
2. Run `python generate_detail_pages.py` to create new detail page
3. Update `data.js` with simplified version for card display
4. Test filtering and detail page display

### Updating Existing Use Cases
1. Edit `use_cases.json`
2. Run `python generate_detail_pages.py` to regenerate pages
3. Test changes in browser

### Regenerating from Source Document
If the Word document is updated:
```bash
python extract_docx.py
python parse_usecases.py
python rebuild_json.py
python generate_detail_pages.py
```

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
- Works directly from file:// protocol (no server needed)
- Data embedded in `data.js` to avoid CORS issues
- Tested on Chrome, Firefox, Safari, Edge

### Future Firebase Integration
When adding Firebase:
- Keep GitHub Pages for hosting
- Add Firebase SDK scripts to HTML
- Replace `data.js` with Firebase Firestore queries
- Add Firebase Storage for screenshots
- Add authentication for editors
- Keep existing styling and layout exactly as-is

### Don't Break These Rules
1. **Never** remove the 6 required sections from detail pages
2. **Always** use Purdue brand colors (no custom colors)
3. **Always** show placeholder text for empty fields
4. **Always** regenerate detail pages after editing `use_cases.json`
5. **Never** commit changes without testing filters and sorting

## Common Tasks

### Add a New Tool Type
1. Add to filter dropdown in `index.html`
2. Update tool name logic in `app.js` (displayUseCases function)
3. Update tool name logic in `generate_detail_pages.py`
4. Test filtering

### Change Styling
1. Edit `styles.css`
2. Use existing CSS variables when possible
3. Maintain Purdue color palette
4. Test responsive design

### Fix Data Issues
1. Check `docx_content.json` for original data
2. Edit `use_cases.json` or run `rebuild_json.py`
3. Regenerate detail pages
4. Test in browser

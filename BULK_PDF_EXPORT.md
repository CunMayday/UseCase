# Bulk PDF Export Feature

## Overview

Added functionality to export multiple use cases to a single PDF file based on the current filtering and sorting status on the main page.

## What Was Added

### 1. Export Button on Main Page
- **Location**: Next to "Use Cases" heading on [index.html](index.html:72)
- **Label**: "📄 Export Filtered to PDF"
- **Appearance**: Gold button (using Purdue branding colors)
- **Functionality**: Exports all currently displayed/filtered use cases to a single PDF

### 2. Bulk PDF Export Function
- **File**: [app.js](app.js:173)
- **Function**: `exportFilteredToPDF()`
- **Features**:
  - Exports all use cases currently displayed after filtering/sorting
  - Shows progress indicator (e.g., "Generating PDF (3/6)...")
  - Each use case starts on a new page
  - Includes all 6 sections for each use case
  - Includes screenshots if available
  - Same styling as single PDF export (Purdue colors, badges, etc.)

### 3. University Name Correction
Updated all references from "Purdue University" to "Purdue University Global":
- [index.html](index.html:85) footer
- [admin.html](admin.html:148) footer
- [detail.html](detail.html:29) footer (already correct)
- [detail.js](detail.js:433) PDF footer
- [app.js](app.js:407) PDF footer
- [generate_detail_pages.py](generate_detail_pages.py:146) template
- All detail pages (use-case-1.html through use-case-6.html) regenerated

## How It Works

### User Workflow

1. **Visit main page**: https://cunmayday.github.io/UseCase
2. **Apply filters** (optional):
   - Filter by User Type (Faculty, Staff, Students, etc.)
   - Filter by AI Tool (Gemini Gem, Notebook LM, Web Apps)
   - Sort by Title, Tool, or User
3. **Click "Export Filtered to PDF"**
4. **Progress shows**: Button text updates to show progress (e.g., "⏳ Generating PDF (2/6)...")
5. **PDF downloads**: File named `AI_Use_Cases_X_cases.pdf` (where X is the number of cases)

### What Gets Exported

**All currently displayed use cases**, respecting:
- ✅ Current filters (user type, AI tool)
- ✅ Current sorting (title, tool, user, or default)

**Each use case includes**:
- Title with black header background
- Tool and User badges (colored)
- All 6 sections:
  1. Purpose
  2. Instructions
  3. Prompts
  4. Variations
  5. Notes
  6. Links / Screenshots / Video
- Setup screenshot (if available)
- Use screenshot (if available)
- Page break between cases

**PDF Footer**:
- "© 2024 Purdue University Global. AI Use Case Catalog"
- Generation date

## Examples

### Example 1: Export All Use Cases
1. Don't apply any filters
2. Click "Export Filtered to PDF"
3. Gets PDF with all 6 use cases

### Example 2: Export Only Faculty Cases
1. Filter by User Type: "Faculty"
2. Click "Export Filtered to PDF"
3. Gets PDF with only faculty use cases

### Example 3: Export Gemini Gems for Students
1. Filter by User Type: "Students"
2. Filter by AI Tool: "Gemini Gem"
3. Sort by: "Title (A-Z)"
4. Click "Export Filtered to PDF"
5. Gets PDF with matching cases, sorted alphabetically

## Technical Details

### Progress Tracking

```javascript
// Tracks which use cases are currently displayed
let currentlyDisplayedUseCases = [];

// Updated whenever filters/sorting changes
function displayUseCases(cases) {
    currentlyDisplayedUseCases = cases;
    // ... display logic
}
```

### PDF Generation

- **Library**: jsPDF (same as single export)
- **Colors**: Purdue branding (Campus Gold #C28E0E, Athletic Gold #CEB888)
- **Page format**: A4 portrait
- **Margins**: 20mm
- **Processing**: Sequential (processes each use case one at a time)
- **Screenshots**: Fetched via Firebase Storage URLs, converted to base64, embedded in PDF

### Page Breaks

```javascript
// Add page break between use cases (except first one)
if (i > 0) {
    doc.addPage();
}
```

### Performance Considerations

- **Images**: Each screenshot is fetched and converted to base64
- **Large exports**: Exporting many cases with screenshots may take time
- **Progress indicator**: Updates button text to show progress
- **Error handling**: Catches errors and alerts user

## Files Modified

1. **[index.html](index.html)**
   - Added section-header wrapper
   - Added "Export Filtered to PDF" button
   - Updated footer to "Purdue University Global"

2. **[styles.css](styles.css)**
   - Added `.section-header` flex layout
   - Updated `.use-cases-section h2` margin
   - Added responsive styles for mobile

3. **[app.js](app.js)**
   - Added `currentlyDisplayedUseCases` tracking variable
   - Updated `displayUseCases()` to track displayed cases
   - Added `getImageAsBase64()` helper function
   - Added `getImageDimensions()` helper function
   - Added `exportFilteredToPDF()` main export function
   - Added event listener for export button

4. **[detail.js](detail.js)**
   - Updated PDF footer to "Purdue University Global"

5. **[admin.html](admin.html)**
   - Updated footer to "Purdue University Global"

6. **[generate_detail_pages.py](generate_detail_pages.py)**
   - Updated footer template to "Purdue University Global"

7. **All detail pages** (use-case-1.html through use-case-6.html)
   - Regenerated with correct university name

## Responsive Design

### Desktop
```
┌────────────────────────────────────────────┐
│  Use Cases (6)  [📄 Export Filtered to PDF] │
└────────────────────────────────────────────┘
```

### Mobile
```
┌────────────────────────────┐
│  Use Cases (6)             │
│  [📄 Export Filtered to PDF] │
└────────────────────────────┘
```

Button stacks below heading on narrow screens.

## Testing Scenarios

### Test 1: Export All Cases
- [ ] No filters applied
- [ ] Click export button
- [ ] Verify PDF has all 6 use cases
- [ ] Verify page breaks between cases
- [ ] Verify footer says "Purdue University Global"

### Test 2: Export Filtered Cases
- [ ] Apply user type filter (e.g., Faculty)
- [ ] Click export button
- [ ] Verify PDF has only filtered cases
- [ ] Verify correct use cases included

### Test 3: Export Sorted Cases
- [ ] Sort by Title (A-Z)
- [ ] Click export button
- [ ] Verify PDF has use cases in alphabetical order

### Test 4: Export Single Case
- [ ] Filter to show only one case
- [ ] Click export button
- [ ] Verify PDF has one use case
- [ ] Compare to individual export from detail page

### Test 5: Progress Indicator
- [ ] Click export button
- [ ] Watch button text update with progress
- [ ] Verify it shows "Generating PDF (X/Y)..."
- [ ] Verify button is disabled during export

### Test 6: Error Handling
- [ ] Disconnect from internet
- [ ] Try to export (screenshots will fail)
- [ ] Verify graceful error handling
- [ ] Verify button re-enables after error

## Known Limitations

1. **Screenshot loading**: If Firebase Storage is slow, export may take time
2. **Large PDFs**: Exporting all cases with screenshots creates large files
3. **Browser memory**: Very large exports might cause memory issues in some browsers
4. **No cancel**: Once export starts, can't cancel (could add in future)

## Future Enhancements

### Possible Improvements
1. **Cancel button**: Allow user to cancel during export
2. **Table of contents**: Add TOC at beginning of PDF
3. **Page numbers**: Add page numbers to each page
4. **Custom selection**: Allow selecting specific use cases (checkboxes)
5. **Export formats**: Add Word, Excel, or JSON export options
6. **Batch size limit**: Warn or limit very large exports
7. **Background processing**: Use Web Workers for better performance

## Comparison: Single vs. Bulk Export

| Feature | Single Export | Bulk Export |
|---------|--------------|-------------|
| **Location** | Detail page | Main page |
| **Button** | "Export as PDF" | "Export Filtered to PDF" |
| **Source** | One use case | All displayed cases |
| **Page breaks** | N/A | Between each case |
| **Progress** | No indicator | Shows "X/Y" progress |
| **Filename** | `UseCase_Title.pdf` | `AI_Use_Cases_X_cases.pdf` |
| **Filters respected** | N/A | Yes |
| **Sorting respected** | N/A | Yes |

## Summary

This feature allows users to export multiple use cases at once based on their current view of the catalog. It respects all filtering and sorting, making it easy to generate targeted PDF collections (e.g., "all Gemini Gems for Faculty" or "all Student resources sorted alphabetically").

The implementation reuses the existing PDF generation code from detail.js, ensuring consistent styling and formatting across single and bulk exports.

All references to "Purdue University" have been corrected to "Purdue University Global" throughout the application.

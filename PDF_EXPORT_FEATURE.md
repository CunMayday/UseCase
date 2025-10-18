# PDF Export Feature

**Date Added:** 2025-10-18

## Overview

Users can export individual use cases as professionally formatted PDF files directly from the detail page. The PDFs include all text content, full-size screenshots, and Purdue University branding.

## User Experience

### How to Export:
1. Navigate to any use case detail page
2. Click the **"📄 Export as PDF"** button in the header (next to "Back to Catalog")
3. Wait for the PDF to generate (button shows "⏳ Generating PDF...")
4. PDF automatically downloads with filename based on use case title

### Example Filename:
- Use Case Title: "Mock Interviewer"
- Generated PDF: `Mock_Interviewer.pdf`

## PDF Contents

### Header (Purdue Gold Background):
- Use case title in white text
- Purdue Campus Gold (#C28E0E) background

### Metadata:
- AI Tool name (e.g., "Gemini Gem")
- Target audience (e.g., "Students, Faculty")

### All Sections (in order):
1. **Purpose** - Why this use case exists
2. **Instructions** - How to set it up
3. **Prompts** - All prompts to enter
4. **Variations** - How to adapt it
5. **Notes** - Tips and warnings
6. **Links / Video** - External resources

### Screenshots:
- **Setup Screenshot** - Full-size image showing setup
- **Use Screenshot** - Full-size image showing usage
- Images are embedded directly in PDF (not links)
- Automatically placed on new page if needed

### Footer:
- Copyright: "© 2024 Purdue University. AI Use Case Catalog"
- Generation date

## Technical Implementation

### Files Modified

#### [detail.html](c:\Users\cuneyt\Documents\GitHub\UseCase\UseCase\detail.html)
**Added:**
- Export button in header
- jsPDF library CDN link

**Code Location:**
```html
<!-- Line 14: Export button -->
<button id="export-pdf-btn" class="btn-secondary" style="display: none;">
    📄 Export as PDF
</button>

<!-- Line 44: jsPDF library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

#### [detail.js](c:\Users\cuneyt\Documents\GitHub\UseCase\UseCase\detail.js)
**Added Functions:**

1. **`getImageAsBase64(imageUrl)`** (Line 164)
   - Converts Firebase Storage image URLs to base64 data
   - Required to embed images in PDF
   - Handles CORS properly using fetch + FileReader

2. **`exportToPDF()`** (Line 181)
   - Main PDF generation function
   - Creates jsPDF document
   - Applies Purdue branding
   - Adds all sections with proper formatting
   - Embeds full-size screenshots
   - Handles pagination automatically
   - Saves PDF with sanitized filename

**Key Variables:**
- `currentUseCase` (Line 6) - Stores loaded use case data globally for export

**Event Listener:**
- Button click handler attached on page load (Line 378)

### Libraries Used

**jsPDF v2.5.1**
- CDN: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
- License: MIT
- Purpose: Client-side PDF generation
- Why chosen:
  - No backend required
  - Excellent image support
  - Good text wrapping
  - Active development
  - Small file size (~250KB)

### Purdue Branding in PDF

**Colors Used:**
```javascript
const campusGold = [194, 142, 14];    // #C28E0E - Headers, section titles
const black = [0, 0, 0];               // #000000 - Body text
const darkGray = [51, 51, 51];         // #333333 - Meta info
const gray = [128, 128, 128];          // #808080 - Placeholders, footer
```

**Typography:**
- Font family: Helvetica (PDF-safe)
- Title: 18pt bold
- Section headers: 14pt bold (Campus Gold)
- Body text: 10pt normal
- Meta info: 10pt normal (Dark Gray)
- Footer: 8pt (Gray)

**Layout:**
- Page size: A4 (210mm × 297mm)
- Margins: 20mm on all sides
- Content width: 170mm
- Portrait orientation

### Image Handling

**Process:**
1. Fetch image from Firebase Storage URL
2. Convert to Blob
3. Convert Blob to base64 using FileReader
4. Embed base64 in PDF using `doc.addImage()`

**Image Sizing:**
- Width: Full content width (170mm)
- Height: 75% of width (maintains approximate aspect ratio)
- Format: JPEG (works with all image types)

**Pagination:**
- Checks available space before adding image
- Creates new page if image doesn't fit
- Prevents images from being cut off

**Error Handling:**
- If image fails to load, continues PDF generation
- Logs error to console but doesn't break export
- User sees PDF without that particular image

### Placeholder Handling

Empty sections still appear in PDF but styled differently:
- **Text color:** Gray (instead of black)
- **Font style:** Italic (instead of normal)
- **Content:** Shows placeholder text (e.g., "Purpose of the activity")

## Future Enhancements

### Phase 2: Multiple Use Case Export (Planned)

**Location:** Main catalog page (index.html)

**Features:**
- Add checkbox to each use case card
- "Select All" / "Deselect All" buttons
- "Export Selected as PDF" button
- Generate single PDF with all selected use cases
- Table of contents on first page
- Page numbers

**Implementation Plan:**
1. Add checkboxes to use case cards in [app.js](c:\Users\cuneyt\Documents\GitHub\UseCase\UseCase\app.js)
2. Create `exportMultipleToPDF()` function
3. Loop through selected use cases
4. Add page breaks between use cases
5. Generate table of contents with page numbers

**Estimated Code Changes:**
- `index.html`: Add checkbox UI and export button
- `app.js`: Add selection state management
- `app.js`: Create new `exportMultipleToPDF()` function
- Reuse existing `getImageAsBase64()` helper

### Phase 3: Export Current View (Planned)

**Feature:**
- Button: "Export All Filtered Results"
- Exports whatever is currently displayed after filtering/sorting
- Example: Filter by "Faculty" + "Gemini Gem" → Export all matching cases

**Use Cases:**
- "Export all Faculty use cases"
- "Export all Notebook LM use cases"
- "Export all Student resources"

**Implementation:**
- Use existing filter logic from `filterUseCases()`
- Pass filtered array to `exportMultipleToPDF()`

### Phase 4: Additional Export Formats (Optional)

**Markdown Export:**
- Much simpler to implement
- Good for GitHub documentation
- Images as links (not embedded)
- Fast generation

**DOCX Export:**
- More complex
- Requires docx.js library
- Editable in Microsoft Word
- Larger file size

## Troubleshooting

### PDF Export Button Doesn't Appear
**Cause:** Use case failed to load
**Fix:** Refresh page, check Firebase connection

### PDF Missing Screenshots
**Cause:** CORS issue or image URL invalid
**Fix:**
- Check Firebase Storage security rules allow public read
- Verify image URLs in Firestore are valid
- Check browser console for fetch errors

### PDF Shows "Generating" Forever
**Cause:** JavaScript error during generation
**Fix:**
- Open browser console (F12)
- Look for red error messages
- Check if jsPDF library loaded (Network tab)

### Filename Contains Special Characters
**Cause:** Use case title has non-alphanumeric characters
**Fix:** Filename automatically sanitizes (replaces special chars with `_`)
- "Mock Interviewer?" → `Mock_Interviewer_.pdf`

### PDF Layout Looks Wrong
**Cause:** Very long text content or very large images
**Fix:**
- Pagination should handle this automatically
- Check console for warnings
- Report issue with specific use case ID

## Code Maintenance

### To Modify PDF Layout:

**Change margins:**
```javascript
// Line 207-208 in detail.js
const margin = 20;  // Change this value (in mm)
const contentWidth = pageWidth - (margin * 2);
```

**Change header color:**
```javascript
// Line 200 in detail.js
const campusGold = [194, 142, 14];  // RGB values
```

**Change font sizes:**
```javascript
// Various lines in detail.js
doc.setFontSize(18);  // Title - Line 214
doc.setFontSize(14);  // Section headers - Line 241
doc.setFontSize(10);  // Body text - Line 254
doc.setFontSize(8);   // Footer - Line 355
```

**Add new section to PDF:**
```javascript
// Add after line 287 in detail.js
const newSectionData = getContent('new_field', 'Placeholder text');
addSection('New Section Title', newSectionData.text, newSectionData.isPlaceholder);
```

### To Update jsPDF Library:

1. Check latest version: https://github.com/parallax/jsPDF/releases
2. Update CDN link in `detail.html` (line 44)
3. Test PDF export thoroughly
4. Update this documentation with new version number

**Current Version:** 2.5.1 (October 2023)
**Next Check:** Check for updates quarterly

### To Add Watermark:

```javascript
// Add after line 356 in detail.js (in footer section)
doc.setTextColor(200, 200, 200);  // Light gray
doc.setFontSize(40);
doc.text('DRAFT', pageWidth/2, 150, {
    angle: 45,
    align: 'center',
    opacity: 0.3
});
```

### To Add Page Numbers:

```javascript
// Replace lines 351-357 in detail.js
const pageCount = doc.internal.getNumberOfPages();
for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(...gray);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, 287);
}
```

## Testing Checklist

When making changes to PDF export, test these scenarios:

- [ ] Export use case with all sections filled
- [ ] Export use case with empty sections (placeholders)
- [ ] Export use case with both screenshots
- [ ] Export use case with one screenshot only
- [ ] Export use case with no screenshots
- [ ] Export use case with very long text content
- [ ] Export use case with special characters in title
- [ ] Test on Chrome browser
- [ ] Test on Firefox browser
- [ ] Test on Safari browser (if available)
- [ ] Verify Purdue colors match branding
- [ ] Verify filename is valid and readable
- [ ] Verify footer shows correct date
- [ ] Check PDF file size is reasonable (<5MB)

## Performance Notes

**PDF Generation Time:**
- No screenshots: ~500ms
- With 1 screenshot: ~1-2 seconds
- With 2 screenshots: ~2-4 seconds

**Factors affecting speed:**
- Screenshot file sizes
- Network speed (fetching images from Firebase)
- Browser performance
- Image encoding to base64

**Optimization Tips:**
- Consider compressing images before upload in admin panel
- Could cache base64 images for repeated exports (future enhancement)
- jsPDF compression is automatic

## Related Files

- [detail.html](c:\Users\cuneyt\Documents\GitHub\UseCase\UseCase\detail.html) - Export button UI
- [detail.js](c:\Users\cuneyt\Documents\GitHub\UseCase\UseCase\detail.js) - PDF generation logic
- [styles.css](c:\Users\cuneyt\Documents\GitHub\UseCase\UseCase\styles.css) - Button styling (btn-secondary class)
- [PROJECT_CONTEXT.md](c:\Users\cuneyt\Documents\GitHub\UseCase\UseCase\PROJECT_CONTEXT.md) - Project overview
- [CLAUDE.md](c:\Users\cuneyt\Documents\GitHub\UseCase\UseCase\CLAUDE.md) - Development guidelines

---

**Status:** ✅ Complete and Deployed (Phase 1)
**Next Steps:** Test in production, gather user feedback, plan Phase 2 (multiple export)
**Maintenance:** Check jsPDF updates quarterly, monitor for browser compatibility issues

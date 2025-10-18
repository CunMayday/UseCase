# AI Use Case Catalog Website

A modern, filterable catalog of AI use cases for Purdue University, featuring approved AI tools (Gemini and Notebook LM) with use cases organized by user type and tool.

## Features

- **Filtering & Sorting**: Filter use cases by user type (Faculty, Staff, Students) and AI tool (Gemini Gem, Notebook LM)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Purdue Branding**: Follows official Purdue University color guidelines
  - Campus Gold (#C28E0E)
  - Athletic Gold (#CEB888)
  - Purdue Black (#000000)
  - Supporting grays and whites

## Files Included

### Main Website Files
- `index.html` - Main catalog page with filtering and sorting
- `use-case-1.html` through `use-case-6.html` - Individual detail pages for each use case
- `styles.css` - Purdue-branded styling
- `app.js` - JavaScript for filtering, sorting, and interaction
- `use_cases.json` - Structured data for all use cases

### Source Files (for development/updates)
- `AI Use case catalog.docx` - Original source document
- `extract_docx.py` - Script to extract content from Word document
- `parse_usecases.py` - Script to parse and structure use case data
- `generate_detail_pages.py` - Script to generate individual HTML pages

## How to View the Website

### Option 1: Open Directly (Simplest - Works Fully!)
1. Simply open `index.html` in your web browser
2. All features including filtering and sorting will work

### Option 2: Use a Local Web Server (Optional)
Using Python's built-in HTTP server:

```bash
# Navigate to the directory
cd "C:\Users\cuneyt\Documents\GitHub\UseCase\UseCase"

# Python 3
python -m http.server 8000

# Then open your browser to:
http://localhost:8000
```

Using Node.js (if you have it installed):
```bash
npx http-server -p 8000
```

### Option 3: Deploy to a Web Server
Upload all `.html`, `.css`, `.js`, and `.json` files to your web server.

## Use Cases Included

1. **Outcome and Rubric Assistant** (Gemini Gem) - For Faculty & Curriculum Specialists
2. **Mock Interviewer** (Gemini Gem) - For Students
3. **Lecture Assistant** (Gemini Gem) - For Students
4. **Meeting/Training Assistant** (Notebook LM) - For Faculty/Staff
5. **Knowledge base Manager** (Notebook LM) - For Faculty/Staff
6. **Audio overviews of Book Chapters** (Notebook LM) - For Students

## How to Update Use Cases

If the source document (`AI Use case catalog.docx`) is updated:

1. Replace the `.docx` file with the new version
2. Run the extraction and parsing scripts:
   ```bash
   python extract_docx.py
   python parse_usecases.py
   python generate_detail_pages.py
   ```
3. The website will be updated with new content

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Important Notes

- **Approved Tools**: Only Gemini and Notebook LM are currently approved for use at Purdue
- **Gems Limitation**: Gems cannot currently be shared. Custom GPTs are shown to demonstrate potential
- **Organization**: Use cases can be filtered by AI tool type or intended user group

## Support

For questions about AI tools and policies, contact your department administrator.

## License

© 2024 Purdue University. All rights reserved.

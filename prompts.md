# Prompts and Changes Log

This file tracks all user requests and the changes made in response. **Latest changes appear at the top.**

---

## 3. Change default sort to Last Edited and update prompts.md organization

**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"make the default sort to be by last edited, newest at the top. Also, in the prompts.md file, the latest updates should go to the top. Update prompts.md so that these latest changes go to the top, and update AGENTS.md to properly state this instruction."

**Changes Made:**

1. **editor.js** - Changed default sort column
   - Changed `currentSortColumn` from 'title' to 'updated' (line 11)
   - Added clarifying comment that 'asc' for updated column shows newest first (line 12)

2. **prompts.md** - Reorganized with latest changes at top
   - Moved latest changes to top of file
   - Updated header to clarify "Latest changes appear at the top"
   - Renumbered entries with newest being #3, working backwards

3. **AGENTS.md** - Updated context tracking instructions
   - Modified instruction to specify latest changes go at the top
   - Updated example counter to show descending order

**Feature Summary:**
- Editor table now defaults to sorting by Last Edited (newest first)
- Prompts.md now organized with most recent changes at the top for easier reference
- AGENTS.md updated to reflect new prompts.md organization standard

---

## 2. Add sorting and Last Edited column to editor table

**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"now we will make three changes to the main edit page where the cases are listed to be edited (editor.html). first is that there should be a sort button that works the same way as the sort button in the view list. Or maybe we can sort by clicking the column name in the title bar. second, i noticed that the title bar that says 'TITLE....TOOL...FOR...' and so on changes color when mouse is hovered over it. IT should not change colors. Last is to add a new column here that shows the last edited date for the cases listed."

**Changes Made:**

1. **editor.js** - Implemented sorting functionality and Last Edited column
   - Added sorting state variables: `editorUseCases`, `currentSortColumn`, `currentSortDirection` (lines 9-12)
   - Modified `loadUseCasesEditor()` to store use case data and call sorting function (lines 64-95)
   - Created `sortAndDisplayEditorUseCases()` function to handle sorting by title, tool, for, and last edited date (lines 97-192)
   - Added `sortEditorBy(column)` function to handle column header clicks and toggle sort direction (lines 194-206)
   - Added "Last Edited" column to table with formatted dates (line 154, 164-174, 181)
   - Added sort indicators (▲/▼) to show current sort column and direction (lines 140-145, 151-155)
   - Made all column headers clickable for sorting except "Actions"

2. **editor-styles.css** - Fixed hover color issue and added sortable column styling
   - Changed `.editor-table tr:hover` to `.editor-table tbody tr:hover` to prevent header rows from changing color on hover (line 82)
   - Added `.editor-table th.sortable` styling with cursor pointer and user-select none (lines 77-81)
   - Added `.editor-table th.sortable:hover` with subtle background color change to indicate clickability (lines 83-85)

**Feature Summary:**
- Editor table now supports sorting by clicking column headers (Title, Tool, For, Last Edited)
- Sort indicators (▲/▼) show which column is sorted and in which direction
- Added "Last Edited" column showing the last modification date (or creation date if never modified)
- Fixed table header hover issue - only table body rows change color on hover, not headers
- Sortable headers have pointer cursor and subtle hover effect for better UX
- Default sort is by Title (A-Z)
- Date sorting shows newest first by default

---

## 1. Add screenshot removal functionality to editor

**Agent:** Claude (Sonnet 4.5)

**User Prompt:**
"check CLAUDE.md for context and AGENTS.md for general instructions. We want to add a button to be able to remove the attached screenshots from the details pages, because currently I don't see a way to remove a screenshot that's been uploaded."

**Changes Made:**

1. **editor.html** - Added remove button UI
   - Added "Remove Screenshot" button for setup screenshot (line 131)
   - Added "Remove Screenshot" button for use screenshot (line 138)
   - Buttons are hidden by default with `style="display: none;"`

2. **editor.js** - Implemented removal logic
   - Added tracking variables `pendingRemoveSetup` and `pendingRemoveUse` (lines 6-7)
   - Updated `resetForm()` to reset removal flags and hide buttons (lines 126-132)
   - Updated `editUseCase()` to show remove buttons only when screenshots exist (lines 166-184)
   - Modified form submission to delete screenshots from Firebase Storage when marked for removal (lines 277-296)
   - Added event handlers for remove buttons with confirmation dialogs (lines 385-416)

3. **editor-styles.css** - Added styling
   - Added `.btn-remove-image` class styling with red background (#dc3545) to indicate destructive action (lines 216-233)
   - Updated `.image-preview` to use flexbox column layout (line 197)
   - Added hover effects with transform and shadow

**Feature Summary:**
- Users can now remove uploaded screenshots from use cases
- Remove buttons appear below screenshot previews when editing
- Clicking "Remove Screenshot" shows confirmation dialog
- Screenshots are marked for removal and deleted from Firebase Storage when form is saved
- Empty string is saved to Firestore to remove the screenshot URL
- Follows Purdue branding with red color for destructive action

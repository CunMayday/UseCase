// Global use cases array
let useCases = [];
let currentlyDisplayedUseCases = [];

// Load use cases from Firebase
async function loadUseCases() {
    try {
        const snapshot = await useCasesCollection.get();
        useCases = [];

        snapshot.forEach(doc => {
            useCases.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Apply initial sort to 'recently-modified'
        const sortBy = document.getElementById('sort-by').value || 'recently-modified';
        const sorted = sortUseCases(useCases, sortBy);

        displayUseCases(sorted);
        updateResultsCount(useCases.length);
    } catch (error) {
        console.error('Error loading use cases:', error);
        document.getElementById('use-cases-grid').innerHTML =
            '<p style="color: red;">Error loading use cases. Please check Firebase configuration.</p>';
    }
}

// Display use cases
function displayUseCases(cases) {
    const grid = document.getElementById('use-cases-grid');
    const noResults = document.getElementById('no-results');

    // Store currently displayed cases for PDF export
    currentlyDisplayedUseCases = cases;

    if (cases.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    grid.innerHTML = cases.map(useCase => {
        const purpose = useCase.sections?.purpose || 'No description available.';
        const toolName = getToolName(useCase.ai_tool);
        const forUseBy = Array.isArray(useCase.for_use_by) ? useCase.for_use_by.join(', ') : (useCase.for_use_by || 'General');

        return `
            <div class="use-case-card" onclick="window.location.href='detail.html?id=${useCase.id}'">
                <h3>${useCase.title}</h3>
                <div class="card-meta">
                    <span class="badge badge-tool">${toolName}</span>
                    <span class="badge badge-user">${forUseBy}</span>
                </div>
                <p class="card-purpose">${purpose}</p>
                <a href="detail.html?id=${useCase.id}" class="card-link" onclick="event.stopPropagation()">View Details</a>
            </div>
        `;
    }).join('');
}

// Update results count
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    resultsCount.textContent = `(${count} ${count === 1 ? 'use case' : 'use cases'})`;
}

// Filter use cases
function filterUseCases() {
    const userFilter = document.getElementById('filter-user').value.toLowerCase();
    const toolFilter = document.getElementById('filter-tool').value;

    let filtered = useCases.filter(useCase => {
        // Handle for_use_by as array
        let userMatch = userFilter === 'all';
        if (!userMatch) {
            if (Array.isArray(useCase.for_use_by)) {
                userMatch = useCase.for_use_by.some(user => user.toLowerCase().includes(userFilter));
            } else if (useCase.for_use_by) {
                userMatch = useCase.for_use_by.toLowerCase().includes(userFilter);
            }
        }

        const toolMatch = toolFilter === 'all' || useCase.ai_tool === toolFilter;

        return userMatch && toolMatch;
    });

    // Apply sorting
    const sortBy = document.getElementById('sort-by').value;
    filtered = sortUseCases(filtered, sortBy);

    displayUseCases(filtered);
    updateResultsCount(filtered.length);
}

// Sort use cases
function sortUseCases(cases, sortBy) {
    const sorted = [...cases];

    switch(sortBy) {
        case 'newest':
            sorted.sort((a, b) => {
                // Sort by createdAt timestamp (newest first)
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA; // Descending order (newest first)
            });
            break;
        case 'recently-modified':
            sorted.sort((a, b) => {
                // Sort by updatedAt timestamp (most recently modified first)
                const timeA = a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
                const timeB = b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
                return timeB - timeA; // Descending order (most recent first)
            });
            break;
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'tool':
            sorted.sort((a, b) => {
                if (a.ai_tool === b.ai_tool) {
                    return a.title.localeCompare(b.title);
                }
                return a.ai_tool.localeCompare(b.ai_tool);
            });
            break;
        case 'user':
            sorted.sort((a, b) => {
                const userA = Array.isArray(a.for_use_by) ? a.for_use_by.join(', ') : (a.for_use_by || '');
                const userB = Array.isArray(b.for_use_by) ? b.for_use_by.join(', ') : (b.for_use_by || '');
                if (userA === userB) {
                    return a.title.localeCompare(b.title);
                }
                return userA.localeCompare(userB);
            });
            break;
        default:
            // Default to newest
            sorted.sort((a, b) => {
                const timeA = a.createdAt?.toMillis?.() || 0;
                const timeB = b.createdAt?.toMillis?.() || 0;
                return timeB - timeA;
            });
            break;
    }

    return sorted;
}

// Reset filters
function resetFilters() {
    document.getElementById('filter-user').value = 'all';
    document.getElementById('filter-tool').value = 'all';
    document.getElementById('sort-by').value = 'recently-modified';
    filterUseCases();
}

// Helper function to convert image URL to base64
async function getImageAsBase64(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error loading image:', error);
        return null;
    }
}

// Helper function to get image dimensions
function getImageDimensions(base64) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
            resolve({ width: 800, height: 600 }); // Default
        };
        img.src = base64;
    });
}

// Export currently filtered/sorted use cases to PDF
async function exportFilteredToPDF() {
    if (!currentlyDisplayedUseCases || currentlyDisplayedUseCases.length === 0) {
        alert('No use cases to export.');
        return;
    }

    const button = document.getElementById('export-filtered-pdf-btn');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = `⏳ Generating PDF...`;

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Purdue Colors
        const campusGold = [194, 142, 14];
        const athleticGold = [206, 184, 136];
        const black = [0, 0, 0];
        const darkGray = [51, 51, 51];
        const mediumGray = [102, 102, 102];
        const lightGray = [153, 153, 153];
        const white = [255, 255, 255];
        const lightBg = [245, 245, 245];

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // ==================== COVER PAGE ====================
        // Tan/beige background
        doc.setFillColor(220, 200, 170);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Black sidebar on right
        doc.setFillColor(...black);
        doc.rect(155, 0, 55, pageHeight, 'F');

        // Purdue Global text in sidebar
        doc.setTextColor(...white);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('PURDUE', 162, 50);
        doc.text('GLOBAL', 162, 56);

        // Main title - black box with white text
        doc.setFillColor(...black);
        doc.rect(0, 120, 155, 20, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('AI USE-CASE CATALOG', 10, 133);

        // Subtitle
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Real, practical examples of AI use', 10, 155);

        // Footer info
        doc.setTextColor(...mediumGray);
        doc.setFontSize(8);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 10, 280);
        doc.text(`${currentlyDisplayedUseCases.length} use cases`, 10, 285);

        // ==================== TABLE OF CONTENTS PAGE ====================
        doc.addPage();

        // Header with brown background
        doc.setFillColor(139, 90, 43);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Contents', margin, 20);

        let tocY = 50;
        doc.setTextColor(...black);
        doc.setFontSize(11);

        // List all use cases with page numbers
        currentlyDisplayedUseCases.forEach((useCase, index) => {
            const pageNum = index + 3; // Page 1 is cover, page 2 is TOC, cases start at page 3

            // Tool badge
            const toolName = getToolName(useCase.ai_tool);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(`[${toolName}]`, margin, tocY);

            // Title
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            const titleText = useCase.title.length > 50 ? useCase.title.substring(0, 50) + '...' : useCase.title;
            doc.text(titleText, margin + 25, tocY);

            // Page number
            doc.setFont('helvetica', 'normal');
            doc.text(String(pageNum), pageWidth - margin - 10, tocY);

            // Dotted line
            doc.setDrawColor(...lightGray);
            doc.setLineWidth(0.1);
            const dotSpacing = 2;
            const lineY = tocY - 1;
            const lineStartX = margin + 25 + doc.getTextWidth(titleText) + 5;
            const lineEndX = pageWidth - margin - 15;
            for (let x = lineStartX; x < lineEndX; x += dotSpacing) {
                doc.circle(x, lineY, 0.2, 'F');
            }

            tocY += 8;

            // Add new page if needed for TOC
            if (tocY > 260 && index < currentlyDisplayedUseCases.length - 1) {
                doc.addPage();
                tocY = 30;
            }
        });

        // ==================== USE CASE PAGES ====================

        // Helper function to add section with proper pagination
        const addSection = (title, content, isPlaceholder = false) => {
            // Check if we need a new page before starting section
            if (doc.lastYPosition && doc.lastYPosition > 270) {
                doc.addPage();
                doc.lastYPosition = 20;
            }

            if (!doc.lastYPosition) {
                doc.lastYPosition = 20;
            }

            // Section title with light gray background
            doc.setFillColor(245, 245, 245);
            doc.rect(margin - 2, doc.lastYPosition - 5, contentWidth + 4, 8, 'F');

            doc.setTextColor(...darkGray);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, doc.lastYPosition);
            doc.lastYPosition += 8;

            // Section content
            if (isPlaceholder) {
                doc.setTextColor(...lightGray);
                doc.setFont('helvetica', 'italic');
            } else {
                doc.setTextColor(...black);
                doc.setFont('helvetica', 'normal');
            }
            doc.setFontSize(10);

            const lines = doc.splitTextToSize(content, contentWidth);
            const lineHeight = 5;
            const maxY = 280; // Leave room for page margins

            // Add lines one by one, checking for page breaks
            for (let i = 0; i < lines.length; i++) {
                // Check if we need a new page
                if (doc.lastYPosition + lineHeight > maxY) {
                    doc.addPage();
                    doc.lastYPosition = 20;
                }

                doc.text(lines[i], margin, doc.lastYPosition);
                doc.lastYPosition += lineHeight;
            }

            doc.lastYPosition += 7; // Add spacing after section
        };

        // Helper to check content
        const getContent = (sections, field, placeholder) => {
            const content = sections?.[field] || '';
            if (content.trim()) {
                return { text: content, isPlaceholder: false };
            }
            return { text: placeholder, isPlaceholder: true };
        };

        // Process each use case
        for (let i = 0; i < currentlyDisplayedUseCases.length; i++) {
            const useCase = currentlyDisplayedUseCases[i];

            // Update progress
            button.textContent = `⏳ Processing ${i + 1}/${currentlyDisplayedUseCases.length}...`;

            // Add page break before each use case (cover and TOC are already done)
            doc.addPage();

            doc.lastYPosition = 20;

            // Header - BLACK background with white text
            doc.setFillColor(...black);
            doc.rect(0, 0, pageWidth, 20, 'F');
            doc.setTextColor(...white);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(useCase.title, margin, 12);

            doc.lastYPosition = 28;

            // Meta information - Colored badges
            const toolName = getToolName(useCase.ai_tool);
            const forUseBy = Array.isArray(useCase.for_use_by)
                ? useCase.for_use_by.join(', ')
                : (useCase.for_use_by || 'General');

            // Tool badge (Campus Gold background)
            doc.setFillColor(...campusGold);
            doc.roundedRect(margin, doc.lastYPosition, 35, 7, 2, 2, 'F');
            doc.setTextColor(...white);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.text(toolName, margin + 2, doc.lastYPosition + 5);

            // User badge (Athletic Gold background)
            doc.setFillColor(...athleticGold);
            const userBadgeWidth = doc.getTextWidth(forUseBy) + 4;
            doc.roundedRect(margin + 38, doc.lastYPosition, userBadgeWidth, 7, 2, 2, 'F');
            doc.setTextColor(...darkGray);
            doc.text(forUseBy, margin + 40, doc.lastYPosition + 5);

            doc.lastYPosition += 15;

            // Submitted by (if present)
            if (useCase.submitted_by) {
                doc.setTextColor(...mediumGray);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.text(`Submitted by: ${useCase.submitted_by}`, margin, doc.lastYPosition);
                doc.lastYPosition += 10;
            }

            // Add all sections
            const purposeData = getContent(useCase.sections, 'purpose', 'Purpose of the activity');
            addSection('Purpose', purposeData.text, purposeData.isPlaceholder);

            const instructionsData = getContent(useCase.sections, 'instructions', 'Detailed instructions for setting it up.');
            addSection('Instructions', instructionsData.text, instructionsData.isPlaceholder);

            const promptsData = getContent(useCase.sections, 'prompts', 'All the prompts that need to be entered.');
            addSection('Prompts', promptsData.text, promptsData.isPlaceholder);

            const variationsData = getContent(useCase.sections, 'variations', 'What can be changed to meet different needs.');
            addSection('Variations', variationsData.text, variationsData.isPlaceholder);

            const notesData = getContent(useCase.sections, 'notes', 'Warnings, tips for effective use.');
            addSection('Notes', notesData.text, notesData.isPlaceholder);

            const linksData = getContent(useCase.sections, 'links', 'Link to video demonstration: [to be added]\nLink to public demo:');
            addSection('Links / Video', linksData.text, linksData.isPlaceholder);

            // Add screenshots if they exist
            const setupScreenshot = useCase.sections?.screenshot_setup || '';
            const useScreenshot = useCase.sections?.screenshot_use || '';

            if (setupScreenshot) {
                if (doc.lastYPosition > 200) {
                    doc.addPage();
                    doc.lastYPosition = 20;
                }

                doc.setFillColor(245, 245, 245);
                doc.rect(margin - 2, doc.lastYPosition - 5, contentWidth + 4, 8, 'F');
                doc.setTextColor(...darkGray);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Setup Screenshot', margin, doc.lastYPosition);
                doc.lastYPosition += 10;

                const imageData = await getImageAsBase64(setupScreenshot);
                if (imageData) {
                    const dimensions = await getImageDimensions(imageData);
                    const aspectRatio = dimensions.height / dimensions.width;
                    const imgWidth = contentWidth;
                    const imgHeight = imgWidth * aspectRatio;

                    if (doc.lastYPosition + imgHeight > 280) {
                        doc.addPage();
                        doc.lastYPosition = 20;
                    }

                    let format = 'JPEG';
                    if (imageData.includes('data:image/png')) format = 'PNG';
                    else if (imageData.includes('data:image/jpeg') || imageData.includes('data:image/jpg')) format = 'JPEG';
                    else if (imageData.includes('data:image/webp')) format = 'WEBP';

                    doc.addImage(imageData, format, margin, doc.lastYPosition, imgWidth, imgHeight);
                    doc.lastYPosition += imgHeight + 10;
                }
            }

            if (useScreenshot) {
                if (doc.lastYPosition > 200) {
                    doc.addPage();
                    doc.lastYPosition = 20;
                }

                doc.setFillColor(245, 245, 245);
                doc.rect(margin - 2, doc.lastYPosition - 5, contentWidth + 4, 8, 'F');
                doc.setTextColor(...darkGray);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Use Screenshot', margin, doc.lastYPosition);
                doc.lastYPosition += 10;

                const imageData = await getImageAsBase64(useScreenshot);
                if (imageData) {
                    const dimensions = await getImageDimensions(imageData);
                    const aspectRatio = dimensions.height / dimensions.width;
                    const imgWidth = contentWidth;
                    const imgHeight = imgWidth * aspectRatio;

                    if (doc.lastYPosition + imgHeight > 280) {
                        doc.addPage();
                        doc.lastYPosition = 20;
                    }

                    let format = 'JPEG';
                    if (imageData.includes('data:image/png')) format = 'PNG';
                    else if (imageData.includes('data:image/jpeg') || imageData.includes('data:image/jpg')) format = 'JPEG';
                    else if (imageData.includes('data:image/webp')) format = 'WEBP';

                    doc.addImage(imageData, format, margin, doc.lastYPosition, imgWidth, imgHeight);
                    doc.lastYPosition += imgHeight + 10;
                }
            }
        }

        // Footer on last page
        const pageCount = doc.internal.getNumberOfPages();
        doc.setPage(pageCount);
        doc.setTextColor(...mediumGray);
        doc.setFontSize(8);
        doc.text('© 2025 Purdue University Global. AI Use Case Catalog', margin, 287);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, 287);

        // Save the PDF
        const fileName = `AI_Use_Cases_${currentlyDisplayedUseCases.length}_cases.pdf`;
        doc.save(fileName);

        button.disabled = false;
        button.textContent = originalText;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message);
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Event listeners - Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load use cases from Firebase
    loadUseCases();

    // Set up event listeners
    document.getElementById('filter-user').addEventListener('change', filterUseCases);
    document.getElementById('filter-tool').addEventListener('change', filterUseCases);
    document.getElementById('sort-by').addEventListener('change', filterUseCases);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    document.getElementById('export-filtered-pdf-btn').addEventListener('click', exportFilteredToPDF);
});

// Get use case ID from URL
const urlParams = new URLSearchParams(window.location.search);
const useCaseId = urlParams.get('id');

// Store current use case data globally for PDF export
let currentUseCase = null;

// Load and display use case
async function loadUseCase() {
    if (!useCaseId) {
        document.getElementById('detail-content').innerHTML =
            '<p class="error">No use case ID provided.</p>';
        return;
    }

    try {
        const doc = await useCasesCollection.doc(useCaseId).get();

        if (!doc.exists) {
            document.getElementById('detail-content').innerHTML =
                '<p class="error">Use case not found.</p>';
            return;
        }

        const useCase = doc.data();
        currentUseCase = useCase; // Store for PDF export
        displayUseCase(useCase);

        // Show export button
        document.getElementById('export-pdf-btn').style.display = 'block';
    } catch (error) {
        console.error('Error loading use case:', error);
        document.getElementById('detail-content').innerHTML =
            '<p class="error">Error loading use case. Please try again.</p>';
    }
}

// Display use case details
function displayUseCase(useCase) {
    // Update title
    document.getElementById('use-case-title').textContent = useCase.title;
    document.title = `${useCase.title} - AI Use Case Catalog`;

    // Update meta badges
    const toolName = getToolName(useCase.ai_tool);
    const forUseBy = Array.isArray(useCase.for_use_by) ? useCase.for_use_by.join(', ') : (useCase.for_use_by || 'General');
    const submittedByHTML = useCase.submitted_by ? `<p class="submitted-by">Submitted by: ${useCase.submitted_by}</p>` : '';

    document.getElementById('use-case-meta').innerHTML = `
        <span class="badge badge-tool">${toolName}</span>
        <span class="badge badge-user">${forUseBy}</span>
        ${submittedByHTML}
    `;

    // Helper function to get section content or placeholder
    function getContent(field, placeholder) {
        const content = useCase.sections?.[field] || '';
        return content.trim() ? content : `<em class='placeholder'>${placeholder}</em>`;
    }

    // Build sections HTML
    let sectionsHTML = '';

    // Purpose
    sectionsHTML += `
        <div class="section-block">
            <h2>Purpose</h2>
            <p>${getContent('purpose', 'Purpose of the activity')}</p>
        </div>
    `;

    // Instructions
    sectionsHTML += `
        <div class="section-block">
            <h2>Instructions</h2>
            <p>${getContent('instructions', 'Detailed instructions for setting it up.')}</p>
        </div>
    `;

    // Prompts
    const promptsContent = useCase.sections?.prompts || '';
    if (promptsContent.trim()) {
        sectionsHTML += `
            <div class="section-block">
                <h2>Prompts</h2>
                <div class="prompt-block">${promptsContent}</div>
            </div>
        `;
    } else {
        sectionsHTML += `
            <div class="section-block">
                <h2>Prompts</h2>
                <p><em class='placeholder'>All the prompts that need to be entered.</em></p>
            </div>
        `;
    }

    // Variations
    sectionsHTML += `
        <div class="section-block">
            <h2>Variations</h2>
            <p>${getContent('variations', 'What can be changed to meet different needs.')}</p>
        </div>
    `;

    // Notes
    sectionsHTML += `
        <div class="section-block">
            <h2>Notes</h2>
            <p>${getContent('notes', 'Warnings, tips for effective use.')}</p>
        </div>
    `;

    // Links/Screenshots/Video
    let linksHTML = '';

    // Links
    const linksText = useCase.sections?.links || '';
    if (linksText.trim()) {
        const linksFormatted = linksText.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );
        linksHTML += `<p>${linksFormatted}</p>`;
    } else {
        linksHTML += '<p><em class="placeholder">Link to video demonstration: [to be added]<br>Link to public demo:</em></p>';
    }

    // Screenshots
    const setupScreenshot = useCase.sections?.screenshot_setup || '';
    const useScreenshot = useCase.sections?.screenshot_use || '';

    if (setupScreenshot) {
        linksHTML += `
            <div class="screenshot">
                <h3>Setup Screenshot</h3>
                <img src="${setupScreenshot}" alt="Setup Screenshot">
            </div>
        `;
    } else {
        linksHTML += '<p><em class="placeholder">Screenshot of setup: [to be added]</em></p>';
    }

    if (useScreenshot) {
        linksHTML += `
            <div class="screenshot">
                <h3>Use Screenshot</h3>
                <img src="${useScreenshot}" alt="Use Screenshot">
            </div>
        `;
    } else {
        linksHTML += '<p><em class="placeholder">Screenshot of use: [to be added]</em></p>';
    }

    sectionsHTML += `
        <div class="section-block">
            <h2>Links / Screenshots / Video</h2>
            ${linksHTML}
        </div>
    `;

    // Set the content
    document.getElementById('detail-content').innerHTML = sectionsHTML;
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

// Export current use case as PDF
async function exportToPDF() {
    if (!currentUseCase) {
        alert('No use case loaded to export.');
        return;
    }

    const button = document.getElementById('export-pdf-btn');
    button.disabled = true;
    button.textContent = '⏳ Generating PDF...';

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Purdue Colors
        const campusGold = [194, 142, 14];     // #C28E0E
        const athleticGold = [206, 184, 136];  // #CEB888
        const black = [0, 0, 0];                // #000000
        const darkGray = [51, 51, 51];         // #333333
        const mediumGray = [102, 102, 102];    // #666666
        const lightGray = [153, 153, 153];     // #999999
        const white = [255, 255, 255];

        let yPosition = 20;
        const pageWidth = 210;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // Header - BLACK background with white text (matching website)
        doc.setFillColor(...black);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(currentUseCase.title, margin, 12);

        yPosition = 28;

        // Meta information - Colored badges
        const toolName = getToolName(currentUseCase.ai_tool);
        const forUseBy = Array.isArray(currentUseCase.for_use_by)
            ? currentUseCase.for_use_by.join(', ')
            : (currentUseCase.for_use_by || 'General');

        // Tool badge (Campus Gold background)
        doc.setFillColor(...campusGold);
        doc.roundedRect(margin, yPosition, 35, 7, 2, 2, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(toolName, margin + 2, yPosition + 5);

        // User badge (Athletic Gold background)
        doc.setFillColor(...athleticGold);
        const userBadgeWidth = doc.getTextWidth(forUseBy) + 4;
        doc.roundedRect(margin + 38, yPosition, userBadgeWidth, 7, 2, 2, 'F');
        doc.setTextColor(...darkGray);
        doc.text(forUseBy, margin + 40, yPosition + 5);

        yPosition += 15;

        // Submitted by (if present)
        if (currentUseCase.submitted_by) {
            doc.setTextColor(...mediumGray);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.text(`Submitted by: ${currentUseCase.submitted_by}`, margin, yPosition);
            yPosition += 10;
        }

        // Helper function to add section
        const addSection = (title, content, isPlaceholder = false) => {
            // Check if we need a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            // Section title with light gray background
            doc.setFillColor(245, 245, 245); // Very light gray background
            doc.rect(margin - 2, yPosition - 5, contentWidth + 4, 8, 'F');

            doc.setTextColor(...darkGray);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, yPosition);
            yPosition += 8;

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
            doc.text(lines, margin, yPosition);
            yPosition += (lines.length * 5) + 7;
        };

        // Helper function to check content
        const getContent = (field, placeholder) => {
            const content = currentUseCase.sections?.[field] || '';
            if (content.trim()) {
                return { text: content, isPlaceholder: false };
            }
            return { text: placeholder, isPlaceholder: true };
        };

        // Add all sections
        const purposeData = getContent('purpose', 'Purpose of the activity');
        addSection('Purpose', purposeData.text, purposeData.isPlaceholder);

        const instructionsData = getContent('instructions', 'Detailed instructions for setting it up.');
        addSection('Instructions', instructionsData.text, instructionsData.isPlaceholder);

        const promptsData = getContent('prompts', 'All the prompts that need to be entered.');
        addSection('Prompts', promptsData.text, promptsData.isPlaceholder);

        const variationsData = getContent('variations', 'What can be changed to meet different needs.');
        addSection('Variations', variationsData.text, variationsData.isPlaceholder);

        const notesData = getContent('notes', 'Warnings, tips for effective use.');
        addSection('Notes', notesData.text, notesData.isPlaceholder);

        const linksData = getContent('links', 'Link to video demonstration: [to be added]\nLink to public demo:');
        addSection('Links / Video', linksData.text, linksData.isPlaceholder);

        // Add screenshots if they exist
        const setupScreenshot = currentUseCase.sections?.screenshot_setup || '';
        const useScreenshot = currentUseCase.sections?.screenshot_use || '';

        if (setupScreenshot) {
            // Check if we need a new page
            if (yPosition > 200) {
                doc.addPage();
                yPosition = 20;
            }

            // Section header with gray background
            doc.setFillColor(245, 245, 245);
            doc.rect(margin - 2, yPosition - 5, contentWidth + 4, 8, 'F');
            doc.setTextColor(...darkGray);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Setup Screenshot', margin, yPosition);
            yPosition += 10;

            const imageData = await getImageAsBase64(setupScreenshot);
            if (imageData) {
                const dimensions = await getImageDimensions(imageData);
                const aspectRatio = dimensions.height / dimensions.width;

                // Calculate image size to fit page width
                const imgWidth = contentWidth;
                const imgHeight = imgWidth * aspectRatio;

                // Check if image fits on current page
                if (yPosition + imgHeight > 280) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Detect image format from base64
                let format = 'JPEG';
                if (imageData.includes('data:image/png')) format = 'PNG';
                else if (imageData.includes('data:image/jpeg') || imageData.includes('data:image/jpg')) format = 'JPEG';
                else if (imageData.includes('data:image/webp')) format = 'WEBP';

                console.log(`Adding setup screenshot: format=${format}, width=${imgWidth}mm, height=${imgHeight}mm`);

                doc.addImage(imageData, format, margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 10;
            } else {
                console.warn('Setup screenshot failed to load');
                doc.setTextColor(...lightGray);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.text('[Screenshot failed to load]', margin, yPosition);
                yPosition += 10;
            }
        }

        if (useScreenshot) {
            // Check if we need a new page
            if (yPosition > 200) {
                doc.addPage();
                yPosition = 20;
            }

            // Section header with gray background
            doc.setFillColor(245, 245, 245);
            doc.rect(margin - 2, yPosition - 5, contentWidth + 4, 8, 'F');
            doc.setTextColor(...darkGray);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Use Screenshot', margin, yPosition);
            yPosition += 10;

            const imageData = await getImageAsBase64(useScreenshot);
            if (imageData) {
                const dimensions = await getImageDimensions(imageData);
                const aspectRatio = dimensions.height / dimensions.width;

                // Calculate image size to fit page width
                const imgWidth = contentWidth;
                const imgHeight = imgWidth * aspectRatio;

                // Check if image fits on current page
                if (yPosition + imgHeight > 280) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Detect image format from base64
                let format = 'JPEG';
                if (imageData.includes('data:image/png')) format = 'PNG';
                else if (imageData.includes('data:image/jpeg') || imageData.includes('data:image/jpg')) format = 'JPEG';
                else if (imageData.includes('data:image/webp')) format = 'WEBP';

                console.log(`Adding use screenshot: format=${format}, width=${imgWidth}mm, height=${imgHeight}mm`);

                doc.addImage(imageData, format, margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 10;
            } else {
                console.warn('Use screenshot failed to load');
                doc.setTextColor(...lightGray);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.text('[Screenshot failed to load]', margin, yPosition);
                yPosition += 10;
            }
        }

        // Footer on last page
        const pageCount = doc.internal.getNumberOfPages();
        doc.setPage(pageCount);
        doc.setTextColor(...mediumGray);
        doc.setFontSize(8);
        doc.text('© 2024 Purdue University Global. AI Use Case Catalog', margin, 287);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, 287);

        // Save the PDF
        const fileName = `${currentUseCase.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        doc.save(fileName);

        button.disabled = false;
        button.textContent = '📄 Export as PDF';
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message);
        button.disabled = false;
        button.textContent = '📄 Export as PDF';
    }
}

// Load use case on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUseCase();

    // Set up export button click handler
    document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
});

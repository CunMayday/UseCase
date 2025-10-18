// Get use case ID from URL
const urlParams = new URLSearchParams(window.location.search);
const useCaseId = urlParams.get('id');

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
        displayUseCase(useCase);
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
    document.getElementById('use-case-meta').innerHTML = `
        <span class="badge badge-tool">${toolName}</span>
        <span class="badge badge-user">${forUseBy}</span>
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

// Load use case on page load
document.addEventListener('DOMContentLoaded', loadUseCase);

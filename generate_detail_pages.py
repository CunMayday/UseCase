import json
import re

# Load use cases
with open('use_cases.json', 'r', encoding='utf-8') as f:
    use_cases = json.load(f)

# HTML template for detail pages
def create_detail_page(use_case):
    # Determine tool name
    if use_case['ai_tool'] == 'GEM':
        tool_name = "Gemini Gem"
    elif use_case['ai_tool'] == 'NLM':
        tool_name = "Notebook LM"
    elif use_case['ai_tool'] == 'WEBAPP':
        tool_name = "Web Apps"
    else:
        tool_name = use_case['ai_tool']

    # Helper function to get section content or placeholder
    def get_section_content(section_key, placeholder):
        content = use_case['sections'].get(section_key, '').strip()
        return content if content else f"<em class='placeholder'>{placeholder}</em>"

    # Build sections HTML - ALWAYS show all 6 sections
    sections_html = ""

    # Purpose
    purpose_content = get_section_content('purpose', 'Purpose of the activity')
    sections_html += f"""
        <div class="section-block">
            <h2>Purpose</h2>
            <p>{purpose_content}</p>
        </div>
        """

    # Instructions
    instructions_content = get_section_content('instructions', 'Detailed instructions for setting it up.')
    sections_html += f"""
        <div class="section-block">
            <h2>Instructions</h2>
            <p>{instructions_content}</p>
        </div>
        """

    # Prompts
    prompts_content = use_case['sections'].get('prompts', '').strip()
    if not prompts_content:
        prompts_content = "All the prompts that need to be entered."
        sections_html += f"""
        <div class="section-block">
            <h2>Prompts</h2>
            <p><em class='placeholder'>{prompts_content}</em></p>
        </div>
        """
    else:
        sections_html += f"""
        <div class="section-block">
            <h2>Prompts</h2>
            <div class="prompt-block">{prompts_content}</div>
        </div>
        """

    # Variations
    variations_content = get_section_content('variations', 'What can be changed to meet different needs.')
    sections_html += f"""
        <div class="section-block">
            <h2>Variations</h2>
            <p>{variations_content}</p>
        </div>
        """

    # Notes
    notes_content = get_section_content('notes', 'Warnings, tips for effective use.')
    sections_html += f"""
        <div class="section-block">
            <h2>Notes</h2>
            <p>{notes_content}</p>
        </div>
        """

    # Links/Screenshots/Video
    links_text = use_case['sections'].get('links', '').strip()
    screenshot_setup = use_case['sections'].get('screenshot_setup', '').strip()
    screenshot_use = use_case['sections'].get('screenshot_use', '').strip()

    # Build links section content
    links_html = ""
    if links_text:
        # Convert URLs to clickable links
        links_formatted = re.sub(
            r'(https?://[^\s]+)',
            r'<a href="\1" target="_blank">\1</a>',
            links_text
        )
        links_html += f"<p>{links_formatted}</p>"
    else:
        links_html += "<p><em class='placeholder'>Link to video demonstration: [to be added]<br>Link to public demo:</em></p>"

    # Add screenshot placeholders
    if screenshot_setup:
        links_html += f"<div class='screenshot'><h3>Setup Screenshot</h3><img src='{screenshot_setup}' alt='Setup Screenshot'></div>"
    else:
        links_html += "<p><em class='placeholder'>Screenshot of setup: [to be added]</em></p>"

    if screenshot_use:
        links_html += f"<div class='screenshot'><h3>Use Screenshot</h3><img src='{screenshot_use}' alt='Use Screenshot'></div>"
    else:
        links_html += "<p><em class='placeholder'>Screenshot of use: [to be added]</em></p>"

    sections_html += f"""
        <div class="section-block">
            <h2>Links / Screenshots / Video</h2>
            {links_html}
        </div>
        """

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{use_case['title']} - AI Use Case Catalog</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="detail-header">
        <div class="container">
            <a href="index.html" class="back-link">← Back to Catalog</a>
            <h1>{use_case['title']}</h1>
            <div class="detail-meta">
                <span class="badge badge-tool">{tool_name}</span>
                <span class="badge badge-user">{use_case.get('for_use_by', 'General')}</span>
            </div>
        </div>
    </header>

    <main class="container">
        <div class="detail-content">
            {sections_html}
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 Purdue University. All rights reserved.</p>
            <p>For more information about AI tools and policies, contact your department administrator.</p>
        </div>
    </footer>
</body>
</html>
"""

    return html_content

# Generate detail pages
for use_case in use_cases:
    filename = f"{use_case['id']}.html"
    html_content = create_detail_page(use_case)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"Created: {filename}")

print(f"\nSuccessfully generated {len(use_cases)} detail pages!")

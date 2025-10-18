import json
import re

# Load the extracted content
with open('docx_content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

tables = data['tables']
paragraphs = data['paragraphs']

# Parse use cases from tables
use_cases = []

# The headings tell us the names
headings = [p['text'] for p in paragraphs if p['style'] == 'Heading 1']
print(f"Found {len(headings)} headings:")
for h in headings:
    print(f"  - {h}")

# Each table represents one use case
for idx, table in enumerate(tables):
    if idx >= len(headings):
        print(f"Skipping table {idx} - no heading")
        continue

    title = headings[idx]

    # Skip the template
    if "Template" in title:
        print(f"Skipping template: {title}")
        continue

    # Extract AI tool type from title
    tool_match = re.match(r'\[(.*?)\]', title)
    ai_tool = tool_match.group(1) if tool_match else "Unknown"
    clean_title = re.sub(r'\[.*?\]\s*', '', title)

    use_case = {
        'id': f'use-case-{idx+1}',
        'title': clean_title,
        'ai_tool': ai_tool,
        'sections': {}
    }

    # Parse table rows - each row has section info
    for row_idx, row in enumerate(table):
        if len(row) >= 2:
            # First cell often contains "For use by" info
            left_cell = row[0].strip()
            right_cell = row[1].strip()

            # Try to extract user type from left cell
            if row_idx == 0:
                for_use_match = re.search(r'For use by:\s*([^\n]+)', left_cell)
                if for_use_match:
                    use_case['for_use_by'] = for_use_match.group(1).strip()

                # Check for purpose in right cell
                if 'Purpose' in right_cell or 'purpose' in right_cell.lower():
                    purpose_text = re.sub(r'^Purpose\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
                    use_case['sections']['purpose'] = purpose_text

            # Instructions
            elif 'Instructions' in right_cell or 'instructions' in right_cell.lower():
                inst_text = re.sub(r'^Instructions?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
                use_case['sections']['instructions'] = inst_text

            # Setup
            elif 'Setup' in left_cell and 'Setup' in right_cell.lower():
                setup_text = re.sub(r'^Setup:?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
                if setup_text:
                    use_case['sections']['setup'] = setup_text

            # Prompts
            elif 'Prompts' in right_cell or 'prompts' in right_cell.lower():
                prompt_text = re.sub(r'^Prompts?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
                use_case['sections']['prompts'] = prompt_text

            # Variations
            elif 'Variations' in right_cell or 'variations' in right_cell.lower():
                var_text = re.sub(r'^Variations?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
                use_case['sections']['variations'] = var_text

            # Notes
            elif 'Notes' in right_cell or 'notes' in right_cell.lower():
                notes_text = re.sub(r'^Notes?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
                use_case['sections']['notes'] = notes_text

            # Screenshots/Video/Links
            elif 'Screenshots' in right_cell or 'Video' in right_cell or 'Links' in right_cell:
                links_text = re.sub(r'^(Screenshots?/Video(/Link)?|Links/Screenshots/Video)\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
                use_case['sections']['links'] = links_text

    use_cases.append(use_case)
    print(f"\nParsed: {use_case['title']}")
    print(f"  Tool: {use_case['ai_tool']}")
    print(f"  For: {use_case.get('for_use_by', 'N/A')}")
    print(f"  Sections: {list(use_case['sections'].keys())}")

# Save parsed use cases
with open('use_cases.json', 'w', encoding='utf-8') as f:
    json.dump(use_cases, f, indent=2, ensure_ascii=False)

print(f"\n✓ Successfully parsed {len(use_cases)} use cases")
print(f"✓ Saved to use_cases.json")

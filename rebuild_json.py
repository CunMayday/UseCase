import json
import re

# Read original parsed content
with open('docx_content.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

paragraphs = data['paragraphs']
tables = data['tables']

# Get headings
headings = [p['text'] for p in paragraphs if p['style'] == 'Heading 1']

use_cases = []

# Process each table (each is a use case)
for idx, table in enumerate(tables):
    if idx >= len(headings) or "Template" in headings[idx]:
        continue

    title = headings[idx]
    tool_match = re.match(r'\[(.*?)\]', title)
    ai_tool = tool_match.group(1) if tool_match else "Unknown"
    clean_title = re.sub(r'\[.*?\]\s*', '', title)

    use_case = {
        'id': f'use-case-{idx+1}',
        'title': clean_title,
        'ai_tool': ai_tool,
        'for_use_by': '',
        'sections': {}
    }

    # Parse table rows
    for row in table:
        if len(row) >= 2:
            left_cell = row[0].strip()
            right_cell = row[1].strip()

            # Extract user type
            for_use_match = re.search(r'For use by:\s*([^\n]+)', left_cell)
            if for_use_match and not use_case['for_use_by']:
                use_case['for_use_by'] = for_use_match.group(1).strip()

            # Extract sections
            if 'Purpose' in right_cell:
                use_case['sections']['purpose'] = re.sub(r'^Purpose\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
            elif 'Instructions' in right_cell:
                use_case['sections']['instructions'] = re.sub(r'^Instructions?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
            elif 'Prompts' in right_cell:
                use_case['sections']['prompts'] = re.sub(r'^Prompts?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
            elif 'Variations' in right_cell:
                use_case['sections']['variations'] = re.sub(r'^Variations?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
            elif 'Notes' in right_cell:
                use_case['sections']['notes'] = re.sub(r'^Notes?\s*\n', '', right_cell, flags=re.IGNORECASE).strip()
            elif 'Screenshot' in right_cell or 'Video' in right_cell or 'Links' in right_cell:
                use_case['sections']['links'] = re.sub(r'^(Screenshots?/Video(/Link)?|Links/Screenshots/Video)\s*\n', '', right_cell, flags=re.IGNORECASE).strip()

    # Add empty screenshot fields
    use_case['sections']['screenshot_setup'] = ''
    use_case['sections']['screenshot_use'] = ''

    use_cases.append(use_case)

# Save to JSON
with open('use_cases.json', 'w', encoding='utf-8') as f:
    json.dump(use_cases, f, indent=2, ensure_ascii=False)

print(f"Rebuilt use_cases.json with {len(use_cases)} use cases")

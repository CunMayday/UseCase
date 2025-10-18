const state = {
  useCases: [],
  filtered: [],
  activeId: null,
  filters: {
    search: '',
    audiences: new Set(),
    tools: new Set(),
    sort: 'title-asc'
  }
};

const selectors = {
  searchInput: document.querySelector('#searchInput'),
  audienceFilters: document.querySelector('#audienceFilters'),
  toolFilters: document.querySelector('#toolFilters'),
  clearButton: document.querySelector('#clearFilters'),
  sortSelect: document.querySelector('#sortSelect'),
  list: document.querySelector('#useCaseList'),
  detail: document.querySelector('#useCaseDetail')
};

async function init() {
  try {
    const response = await fetch('data/use_cases.json');
    if (!response.ok) {
      throw new Error('Unable to load use case data');
    }
    const data = await response.json();
    state.useCases = data;
    buildFilters();
    attachEvents();
    applyFilters(true);
  } catch (error) {
    renderError(error.message);
    console.error(error);
  }
}

function buildFilters() {
  const audienceSet = new Set();
  const toolSet = new Set();

  state.useCases.forEach((useCase) => {
    useCase.audiences.forEach((aud) => audienceSet.add(aud));
    useCase.aiTools.forEach((tool) => toolSet.add(tool));
  });

  const sortedAudiences = Array.from(audienceSet).sort((a, b) => a.localeCompare(b));
  const sortedTools = Array.from(toolSet).sort((a, b) => a.localeCompare(b));

  selectors.audienceFilters.innerHTML = sortedAudiences
    .map((aud) => createCheckboxTemplate('audience', aud))
    .join('');

  selectors.toolFilters.innerHTML = sortedTools
    .map((tool) => createCheckboxTemplate('tool', tool))
    .join('');
}

function createCheckboxTemplate(group, value) {
  const id = `${group}-${value.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  return `
    <label class="filter-option" for="${id}">
      <input type="checkbox" id="${id}" value="${value}" data-group="${group}">
      <span>${value}</span>
    </label>
  `;
}

function attachEvents() {
  selectors.searchInput.addEventListener('input', (event) => {
    state.filters.search = event.target.value.trim().toLowerCase();
    applyFilters();
  });

  selectors.audienceFilters.addEventListener('change', handleCheckboxChange);
  selectors.toolFilters.addEventListener('change', handleCheckboxChange);

  selectors.clearButton.addEventListener('click', () => {
    state.filters.search = '';
    state.filters.audiences.clear();
    state.filters.tools.clear();
    selectors.searchInput.value = '';
    selectors.audienceFilters.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = false;
    });
    selectors.toolFilters.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = false;
    });
    applyFilters(true);
  });

  selectors.sortSelect.addEventListener('change', (event) => {
    state.filters.sort = event.target.value;
    applyFilters();
  });
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const { group, value } = checkbox.dataset;
  if (!group) {
    return;
  }
  const targetSet = group === 'audience' ? state.filters.audiences : state.filters.tools;
  if (checkbox.checked) {
    targetSet.add(value);
  } else {
    targetSet.delete(value);
  }
  applyFilters();
}

function applyFilters(resetActive = false) {
  const { search, audiences, tools, sort } = state.filters;

  const filtered = state.useCases.filter((useCase) => {
    const matchesAudience = audiences.size === 0 || useCase.audiences.some((aud) => audiences.has(aud));
    const matchesTool = tools.size === 0 || useCase.aiTools.some((tool) => tools.has(tool));

    if (!matchesAudience || !matchesTool) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystack = [
      useCase.title,
      useCase.summary,
      useCase.description,
      ...useCase.sections.map((section) => `${section.heading} ${section.body}`)
    ]
      .join(' \n ')
      .toLowerCase();

    return haystack.includes(search);
  });

  const sorted = sortUseCases(filtered, sort);

  state.filtered = sorted;

  if (resetActive || !state.activeId || !sorted.some((item) => item.id === state.activeId)) {
    state.activeId = sorted.length > 0 ? sorted[0].id : null;
  }

  renderList();
  renderDetail();
}

function sortUseCases(list, sort) {
  const sorted = [...list];
  switch (sort) {
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'audience':
      return sorted.sort((a, b) => (a.audiences[0] || '').localeCompare(b.audiences[0] || ''));
    case 'tool':
      return sorted.sort((a, b) => (a.aiTools[0] || '').localeCompare(b.aiTools[0] || ''));
    case 'title-asc':
    default:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
}

function renderList() {
  if (!state.filtered.length) {
    selectors.list.innerHTML = '<li class="empty-state">No use cases match your filters yet.</li>';
    return;
  }

  selectors.list.innerHTML = state.filtered
    .map((useCase) => {
      const isActive = state.activeId === useCase.id;
      const summary = truncate(useCase.summary || useCase.description, 180);
      const audienceChips = useCase.audiences
        .map((aud) => `<span class="chip" aria-label="Audience: ${aud}">${aud}</span>`)
        .join('');
      const toolChips = useCase.aiTools
        .map((tool) => `<span class="chip" aria-label="Tool: ${tool}">${tool}</span>`)
        .join('');

      return `
        <li>
          <button class="use-case-card${isActive ? ' is-active' : ''}" data-id="${useCase.id}" aria-pressed="${isActive}">
            <h3>${useCase.title}</h3>
            <p>${summary}</p>
            <div class="meta-chips">${audienceChips}${toolChips}</div>
          </button>
        </li>
      `;
    })
    .join('');

  selectors.list.querySelectorAll('.use-case-card').forEach((card) => {
    card.addEventListener('click', () => {
      state.activeId = Number(card.dataset.id);
      renderList();
      renderDetail();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  });
}

function renderDetail() {
  if (!state.activeId) {
    selectors.detail.innerHTML = `
      <div class="placeholder">
        <h3>No use case selected</h3>
        <p>Adjust your filters or pick a use case from the list to view its full description.</p>
      </div>
    `;
    return;
  }

  const useCase = state.useCases.find((item) => item.id === state.activeId);
  if (!useCase) {
    selectors.detail.innerHTML = `
      <div class="placeholder">
        <h3>Use case not found</h3>
        <p>The selected use case could not be loaded. Try refreshing the page.</p>
      </div>
    `;
    return;
  }

  const audienceChips = useCase.audiences
    .map((aud) => `<span class="chip">${aud}</span>`)
    .join('');
  const toolChips = useCase.aiTools
    .map((tool) => `<span class="chip">${tool}</span>`)
    .join('');

  const purposeSection = useCase.sections.find((section) => section.heading.toLowerCase() === 'purpose');
  const sectionsHtml = useCase.sections
    .filter((section) => section.body && section.body.trim().length > 0 && section.heading.toLowerCase() !== 'purpose')
    .map((section) => `
      <section class="section">
        <h3>${section.heading}</h3>
        ${formatBody(section.body)}
      </section>
    `)
    .join('');

  selectors.detail.innerHTML = `
    <header>
      <h2>${useCase.title}</h2>
      ${purposeSection ? formatBody(purposeSection.body) : ''}
      <div class="detail-meta">
        ${audienceChips}
        ${toolChips}
      </div>
    </header>
    ${sectionsHtml}
  `;
}

function truncate(text, limit = 160) {
  if (!text) return '';
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}

function formatBody(body) {
  if (!body) {
    return '<p>Details coming soon.</p>';
  }

  const lines = body.split('\n');
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      const itemsHtml = listItems.map((item) => `<li>${linkify(item)}</li>`).join('');
      blocks.push(`<ul>${itemsHtml}</ul>`);
      listItems = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    if (/^[•\-]/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[•\-]\s*/, ''));
    } else {
      flushList();
      blocks.push(`<p>${linkify(trimmed)}</p>`);
    }
  });

  flushList();
  return blocks.join('');
}

function linkify(text) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlPattern, (url) => {
    const cleanUrl = url.replace(/[.,);]+$/, '');
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>`;
  });
}

function renderError(message) {
  selectors.detail.innerHTML = `
    <div class="placeholder">
      <h3>Something went wrong</h3>
      <p>${message}</p>
    </div>
  `;
  selectors.list.innerHTML = '';
}

init();

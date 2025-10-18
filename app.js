// Global use cases array
let useCases = [];

// Load use cases from Firebase
async function loadUseCases() {
    try {
        const snapshot = await useCasesCollection.orderBy('title').get();
        useCases = [];

        snapshot.forEach(doc => {
            useCases.push({
                id: doc.id,
                ...doc.data()
            });
        });

        displayUseCases(useCases);
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

        return `
            <div class="use-case-card" onclick="window.location.href='detail.html?id=${useCase.id}'">
                <h3>${useCase.title}</h3>
                <div class="card-meta">
                    <span class="badge badge-tool">${toolName}</span>
                    <span class="badge badge-user">${useCase.for_use_by || 'General'}</span>
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
        const userMatch = userFilter === 'all' ||
            (useCase.for_use_by && useCase.for_use_by.toLowerCase().includes(userFilter));
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
                const userA = a.for_use_by || '';
                const userB = b.for_use_by || '';
                if (userA === userB) {
                    return a.title.localeCompare(b.title);
                }
                return userA.localeCompare(userB);
            });
            break;
        default:
            // Keep default order
            break;
    }

    return sorted;
}

// Reset filters
function resetFilters() {
    document.getElementById('filter-user').value = 'all';
    document.getElementById('filter-tool').value = 'all';
    document.getElementById('sort-by').value = 'default';
    filterUseCases();
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
});

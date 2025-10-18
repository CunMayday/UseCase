// Current user
let currentUser = null;
let editingId = null;

// Auth state observer
auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        showAdminPanel();
        document.getElementById('user-email').textContent = user.email;
        loadUseCasesAdmin();
    } else {
        showLoginSection();
    }
});

// Show/Hide sections
function showLoginSection() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('form-section').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('form-section').style.display = 'none';
}

function showFormSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('form-section').style.display = 'block';
}

// Login
document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    try {
        await auth.signInWithEmailAndPassword(email, password);
        errorEl.textContent = '';
    } catch (error) {
        errorEl.textContent = error.message;
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut();
});

// Load use cases for admin
async function loadUseCasesAdmin() {
    const loadingEl = document.getElementById('admin-loading');
    const listEl = document.getElementById('admin-use-cases');

    try {
        const snapshot = await useCasesCollection.orderBy('title').get();

        if (snapshot.empty) {
            listEl.innerHTML = '<p>No use cases yet. Click "Add New Use Case" to create one.</p>';
            loadingEl.style.display = 'none';
            return;
        }

        let html = '<table class="admin-table"><thead><tr><th>Title</th><th>Tool</th><th>For</th><th>Actions</th></tr></thead><tbody>';

        snapshot.forEach(doc => {
            const data = doc.data();
            const forUseBy = Array.isArray(data.for_use_by) ? data.for_use_by.join(', ') : (data.for_use_by || 'N/A');
            html += `
                <tr>
                    <td>${data.title}</td>
                    <td>${getToolName(data.ai_tool)}</td>
                    <td>${forUseBy}</td>
                    <td class="actions">
                        <button onclick="editUseCase('${doc.id}')" class="btn-small btn-edit">Edit</button>
                        <button onclick="deleteUseCase('${doc.id}', '${data.title}')" class="btn-small btn-delete">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        listEl.innerHTML = html;
        loadingEl.style.display = 'none';
    } catch (error) {
        console.error('Error loading use cases:', error);
        listEl.innerHTML = '<p class="error">Error loading use cases.</p>';
        loadingEl.style.display = 'none';
    }
}

// Add new use case
document.getElementById('add-new-btn').addEventListener('click', () => {
    resetForm();
    document.getElementById('form-title').textContent = 'Add New Use Case';
    editingId = null;
    showFormSection();
});

// Cancel form
document.getElementById('cancel-form-btn').addEventListener('click', () => {
    showAdminPanel();
});
document.getElementById('cancel-form-btn-2').addEventListener('click', () => {
    showAdminPanel();
});

// Reset form
function resetForm() {
    document.getElementById('use-case-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('setup-preview').innerHTML = '';
    document.getElementById('use-preview').innerHTML = '';
    document.getElementById('form-status').textContent = '';
}

// Edit use case
async function editUseCase(id) {
    editingId = id;
    document.getElementById('form-title').textContent = 'Edit Use Case';

    try {
        const doc = await useCasesCollection.doc(id).get();
        const data = doc.data();

        document.getElementById('edit-id').value = id;
        document.getElementById('title').value = data.title || '';
        document.getElementById('ai_tool').value = data.ai_tool || '';

        // Handle for_use_by as array
        const userTypes = Array.isArray(data.for_use_by) ? data.for_use_by : (data.for_use_by ? [data.for_use_by] : []);
        document.querySelectorAll('input[name="user_type"]').forEach(checkbox => {
            checkbox.checked = userTypes.includes(checkbox.value);
        });

        document.getElementById('purpose').value = data.sections?.purpose || '';
        document.getElementById('instructions').value = data.sections?.instructions || '';
        document.getElementById('prompts').value = data.sections?.prompts || '';
        document.getElementById('variations').value = data.sections?.variations || '';
        document.getElementById('notes').value = data.sections?.notes || '';
        document.getElementById('links').value = data.sections?.links || '';

        // Show existing screenshots
        if (data.sections?.screenshot_setup) {
            document.getElementById('setup-preview').innerHTML =
                `<img src="${data.sections.screenshot_setup}" alt="Setup"><p>Current screenshot (upload new to replace)</p>`;
        }
        if (data.sections?.screenshot_use) {
            document.getElementById('use-preview').innerHTML =
                `<img src="${data.sections.screenshot_use}" alt="Use"><p>Current screenshot (upload new to replace)</p>`;
        }

        showFormSection();
    } catch (error) {
        console.error('Error loading use case:', error);
        alert('Error loading use case for editing.');
    }
}

// Delete use case
async function deleteUseCase(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }

    try {
        // Get the document to delete images
        const doc = await useCasesCollection.doc(id).get();
        const data = doc.data();

        // Delete images from storage
        if (data.sections?.screenshot_setup) {
            await deleteImage(data.sections.screenshot_setup);
        }
        if (data.sections?.screenshot_use) {
            await deleteImage(data.sections.screenshot_use);
        }

        // Delete document
        await useCasesCollection.doc(id).delete();

        alert('Use case deleted successfully!');
        loadUseCasesAdmin();
    } catch (error) {
        console.error('Error deleting use case:', error);
        alert('Error deleting use case: ' + error.message);
    }
}

// Submit form
document.getElementById('use-case-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const statusEl = document.getElementById('form-status');
    statusEl.textContent = 'Saving...';
    statusEl.className = 'status-message';

    try {
        // Gather checked user types
        const selectedUserTypes = [];
        document.querySelectorAll('input[name="user_type"]:checked').forEach(checkbox => {
            selectedUserTypes.push(checkbox.value);
        });

        // Validate at least one user type is selected
        if (selectedUserTypes.length === 0) {
            statusEl.textContent = 'Please select at least one user type.';
            statusEl.className = 'status-message error';
            return;
        }

        // Gather form data
        const useCaseData = {
            title: document.getElementById('title').value,
            ai_tool: document.getElementById('ai_tool').value,
            for_use_by: selectedUserTypes,
            sections: {
                purpose: document.getElementById('purpose').value,
                instructions: document.getElementById('instructions').value,
                prompts: document.getElementById('prompts').value,
                variations: document.getElementById('variations').value,
                notes: document.getElementById('notes').value,
                links: document.getElementById('links').value,
                screenshot_setup: '',
                screenshot_use: ''
            }
        };

        // Determine if adding or editing
        let docId = editingId;
        if (!docId) {
            // Create new document to get ID
            const newDoc = await useCasesCollection.add({ temp: true });
            docId = newDoc.id;
        } else {
            // Load existing screenshots if not uploading new ones
            const existingDoc = await useCasesCollection.doc(docId).get();
            const existingData = existingDoc.data();
            useCaseData.sections.screenshot_setup = existingData.sections?.screenshot_setup || '';
            useCaseData.sections.screenshot_use = existingData.sections?.screenshot_use || '';
        }

        // Upload images if provided
        const setupFile = document.getElementById('screenshot_setup').files[0];
        const useFile = document.getElementById('screenshot_use').files[0];

        if (setupFile) {
            statusEl.textContent = 'Uploading setup screenshot...';
            useCaseData.sections.screenshot_setup = await uploadImage(setupFile, docId, 'setup.jpg');
        }

        if (useFile) {
            statusEl.textContent = 'Uploading use screenshot...';
            useCaseData.sections.screenshot_use = await uploadImage(useFile, docId, 'use.jpg');
        }

        // Save to Firestore
        statusEl.textContent = 'Saving to database...';
        await useCasesCollection.doc(docId).set(useCaseData);

        statusEl.textContent = 'Use case saved successfully!';
        statusEl.className = 'status-message success';

        setTimeout(() => {
            showAdminPanel();
            loadUseCasesAdmin();
        }, 1500);

    } catch (error) {
        console.error('Error saving use case:', error);
        statusEl.textContent = 'Error: ' + error.message;
        statusEl.className = 'status-message error';
    }
});

// Image preview
document.getElementById('screenshot_setup').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('setup-preview').innerHTML =
                `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('screenshot_use').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('use-preview').innerHTML =
                `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

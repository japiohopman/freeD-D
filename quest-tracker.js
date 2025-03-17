// Quest Tracker JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // API endpoints
    const API_BASE = '/api/quest-tracker';
    const ENDPOINTS = {
        mainQuests: `${API_BASE}/main-quests`,
        sideQuests: `${API_BASE}/side-quests`,
        npcs: `${API_BASE}/npcs`,
        locations: `${API_BASE}/locations`
    }
    });

    // Bootstrap modals
    const mainQuestModal = new bootstrap.Modal(document.getElementById('addMainQuestModal'));
    const sideQuestModal = new bootstrap.Modal(document.getElementById('addSideQuestModal'));
    const npcModal = new bootstrap.Modal(document.getElementById('addNpcModal'));
    const locationModal = new bootstrap.Modal(document.getElementById('addLocationModal'));
    const editQuestModal = new bootstrap.Modal(document.getElementById('editQuestModal'));
    const editNpcModal = new bootstrap.Modal(document.getElementById('editNpcModal'));
    const editLocationModal = new bootstrap.Modal(document.getElementById('editLocationModal'));

    // Load all data on page load
    loadAllData();

    // Add event listeners for save buttons
    document.getElementById('saveMainQuestBtn').addEventListener('click', saveMainQuest);
    document.getElementById('saveSideQuestBtn').addEventListener('click', saveSideQuest);
    document.getElementById('saveNpcBtn').addEventListener('click', saveNpc);
    document.getElementById('saveLocationBtn').addEventListener('click', saveLocation);
    document.getElementById('updateQuestBtn').addEventListener('click', updateQuest);
    document.getElementById('updateNpcBtn').addEventListener('click', updateNpc);
    document.getElementById('updateLocationBtn').addEventListener('click', updateLocation);

    // Function to load all data
    function loadAllData() {
        loadMainQuests();
        loadSideQuests();
        loadNpcs();
        loadLocations();
    }

    // Load main quests
    async function loadMainQuests() {
        try {
            const response = await fetch(ENDPOINTS.mainQuests);
            const result = await response.json();
            
            if (result.success) {
                displayMainQuests(result.data);
                updateMainQuestDropdowns(result.data);
            } else {
                console.error('Failed to load main quests:', result.error);
            }
        } catch (error) {
            console.error('Error loading main quests:', error);
        }
    }

    // Load side quests
    async function loadSideQuests() {
        try {
            const response = await fetch(ENDPOINTS.sideQuests);
            const result = await response.json();
            
            if (result.success) {
                displaySideQuests(result.data);
            } else {
                console.error('Failed to load side quests:', result.error);
            }
        } catch (error) {
            console.error('Error loading side quests:', error);
        }
    }

    // Load NPCs
    async function loadNpcs() {
        try {
            const response = await fetch(ENDPOINTS.npcs);
            const result = await response.json();
            
            if (result.success) {
                displayNpcs(result.data);
                updateNpcCheckboxes(result.data);
            } else {
                console.error('Failed to load NPCs:', result.error);
            }
        } catch (error) {
            console.error('Error loading NPCs:', error);
        }
    }

    // Load locations
    async function loadLocations() {
        try {
            const response = await fetch(ENDPOINTS.locations);
            const result = await response.json();
            
            if (result.success) {
                displayLocations(result.data);
                updateLocationCheckboxes(result.data);
                updateLocationDropdowns(result.data);
            } else {
                console.error('Failed to load locations:', result.error);
            }
        } catch (error) {
            console.error('Error loading locations:', error);
        }
    }

    // Display main quests
    function displayMainQuests(quests) {
        const container = document.getElementById('mainQuestsList');
        
        if (quests.length === 0) {
            container.innerHTML = '<div class="text-center py-3 text-muted">No main quests found</div>';
            return;
        }
        
        container.innerHTML = '';
        
        quests.forEach(quest => {
            const card = document.createElement('div');
            card.className = `card quest-card main-quest mb-3 ${quest.status}`;
            
            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${quest.title}</h5>
                        <span class="badge bg-${quest.status === 'active' ? 'success' : quest.status === 'completed' ? 'primary' : 'danger'}">${quest.status}</span>
                    </div>
                    <p class="card-text">${quest.description}</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-primary me-2 view-quest-btn" data-id="${quest.id}" data-type="main">View Details</button>
                        <button class="btn btn-sm btn-outline-secondary me-2 edit-quest-btn" data-id="${quest.id}" data-type="main">Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete-quest-btn" data-id="${quest.id}" data-type="main">Delete</button>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
            
            // Add event listeners
            card.querySelector('.view-quest-btn').addEventListener('click', () => viewQuestDetails(quest.id, true));
            card.querySelector('.edit-quest-btn').addEventListener('click', () => openEditQuestModal(quest.id, true));
            card.querySelector('.delete-quest-btn').addEventListener('click', () => deleteQuest(quest.id, true));
        });
    }

    // Display side quests
    function displaySideQuests(quests) {
        const container = document.getElementById('sideQuestsList');
        
        if (quests.length === 0) {
            container.innerHTML = '<div class="text-center py-3 text-muted">No side quests found</div>';
            return;
        }
        
        container.innerHTML = '';
        
        quests.forEach(quest => {
            const card = document.createElement('div');
            card.className = `card quest-card side-quest mb-3 ${quest.status}`;
            
            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">${quest.title}</h5>
                        <span class="badge bg-${quest.status === 'active' ? 'success' : quest.status === 'completed' ? 'primary' : 'danger'}">${quest.status}</span>
                    </div>
                    <p class="card-text">${quest.description}</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-primary me-2 view-quest-btn" data-id="${quest.id}" data-type="side">View Details</button>
                        <button class="btn btn-sm btn-outline-secondary me-2 edit-quest-btn" data-id="${quest.id}" data-type="side">Edit</button>
                        <button class="btn btn-sm btn-outline-danger delete-quest-btn" data-id="${quest.id}" data-type="side">Delete</button>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
            
            // Add event listeners
            card.querySelector('.view-quest-btn').addEventListener('click', () => viewQuestDetails(quest.id, false));
            card.querySelector('.edit-quest-btn').addEventListener('click', () => openEditQuestModal(quest.id, false));
            card.querySelector('.delete-quest-btn').addEventListener('click', () => deleteQuest(quest.id, false));
        });
    }

    // Display NPCs
    function displayNpcs(npcs) {
        const container = document.getElementById('npcsList');
        
        if (npcs.length === 0) {
            container.innerHTML = '<div class="text-center py-3 text-muted">No NPCs found</div>';
            return;
        }
        
        container.innerHTML = '';
        
        npcs.forEach(npc => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-3';
            
            col.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${npc.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${npc.role}</h6>
                        <p class="card-text">${npc.description}</p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-secondary me-2 edit-npc-btn" data-id="${npc.id}">Edit</button>
                            <button class="btn btn-sm btn-outline-danger delete-npc-btn" data-id="${npc.id}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(col);
            
            // Add event listeners
            col.querySelector('.edit-npc-btn').addEventListener('click', () => openEditNpcModal(npc.id));
            col.querySelector('.delete-npc-btn').addEventListener('click', () => deleteNpc(npc.id));
        });
    }

    // Display locations
    function displayLocations(locations) {
        const container = document.getElementById('locationsList');
        
        if (locations.length === 0) {
            container.innerHTML = '<div class="text-center py-3 text-muted">No locations found</div>';
            return;
        }
        
        container.innerHTML = '';
        
        locations.forEach(location => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-3';
            
            col.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${location.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${capitalizeFirstLetter(location.type)}</h6>
                        <p class="card-text">${location.description}</p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-secondary me-2 edit-location-btn" data-id="${location.id}">Edit</button>
                            <button class="btn btn-sm btn-outline-danger delete-location-btn" data-id="${location.id}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(col);
            
            // Add event listeners
            col.querySelector('.edit-location-btn').addEventListener('click', () => openEditLocationModal(location.id));
            col.querySelector('.delete-location-btn').addEventListener('click', () => deleteLocation(location.id));
        });
    }

    // Update NPC checkboxes in quest forms
    function updateNpcCheckboxes(npcs) {
        const containers = [
            document.getElementById('mainQuestNpcCheckboxes'),
            document.getElementById('sideQuestNpcCheckboxes'),
            document.getElementById('editQuestNpcCheckboxes')
        ];
        
        containers.forEach(container => {
            if (!container) return;
            
            container.innerHTML = '';
            
            if (npcs.length === 0) {
                container.innerHTML = '<p class="text-muted">No NPCs available</p>';
                return;
            }
            
            npcs.forEach(npc => {
                const div = document.createElement('div');
                div.className = 'form-check';
                
                div.innerHTML = `
                    <input class="form-check-input npc-checkbox" type="checkbox" value="${npc.id}" id="npc-${container.id}-${npc.id}">
                    <label class="form-check-label" for="npc-${container.id}-${npc.id}">
                        ${npc.name} (${npc.role})
                    </label>
                `;
                
                container.appendChild(div);
            });
        });
    }

    // Update location checkboxes in quest forms
    function updateLocationCheckboxes(locations) {
        const containers = [
            document.getElementById('mainQuestLocationCheckboxes'),
            document.getElementById('sideQuestLocationCheckboxes'),
            document.getElementById('editQuestLocationCheckboxes')
        ];
        
        containers.forEach(container => {
            if (!container) return;
            
            container.innerHTML = '';
            
            if (locations.length === 0) {
                container.innerHTML = '<p class="text-muted">No locations available</p>';
                return;
            }
            
            locations.forEach(location => {
                const div = document.createElement('div');
                div.className = 'form-check';
                
                div.innerHTML = `
                    <input class="form-check-input location-checkbox" type="checkbox" value="${location.id}" id="location-${container.id}-${location.id}">
                    <label class="form-check-label" for="location-${container.id}-${location.id}">
                        ${location.name} (${capitalizeFirstLetter(location.type)})
                    </label>
                `;
                
                container.appendChild(div);
            });
        });
    }

    // Update location dropdowns in NPC forms
    function updateLocationDropdowns(locations) {
        const selects = [
            document.getElementById('npcLocation'),
            document.getElementById('editNpcLocation')
        ];
        
        selects.forEach(select => {
            if (!select) return;
            
            // Keep the first option (None) and remove the rest
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location.id;
                option.textContent = `${location.name} (${capitalizeFirstLetter(location.type)})`;
                select.appendChild(option);
            });
        });
    }

    // Update main quest dropdowns in side quest forms
    function updateMainQuestDropdowns(mainQuests) {
        const selects = [
            document.getElementById('relatedMainQuest'),
            document.getElementById('editRelatedMainQuest')
        ];
        
        selects.forEach(select => {
            if (!select) return;
            
            // Keep the first option (None) and remove the rest
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            mainQuests.forEach(quest => {
                const option = document.createElement('option');
                option.value = quest.id;
                option.textContent = quest.title;
                select.appendChild(option);
            });
        });
    }

    // Save main quest
    async function saveMainQuest() {
        const title = document.getElementById('mainQuestTitle').value;
        const description = document.getElementById('mainQuestDescription').value;
        const status = document.getElementById('mainQuestStatus').value;
        
        // Get selected NPCs
        const npcCheckboxes = document.querySelectorAll('#mainQuestNpcCheckboxes .npc-checkbox:checked');
        const relatedNpcIds = Array.from(npcCheckboxes).map(cb => parseInt(cb.value));
        
        // Get selected locations
        const locationCheckboxes = document.querySelectorAll('#mainQuestLocationCheckboxes .location-checkbox:checked');
        const relatedLocationIds = Array.from(locationCheckboxes).map(cb => parseInt(cb.value));
        
        try {
            const response = await fetch(ENDPOINTS.mainQuests, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    status,
                    relatedNpcIds,
                    relatedLocationIds
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Reset form and close modal
                document.getElementById('addMainQuestForm').reset();
                mainQuestModal.hide();
                
                // Reload quests
                loadMainQuests();
                
                // Show success message
                alert('Main quest added successfully!');
            } else {
                console.error('Failed to add main quest:', result.error);
                alert(`Failed to add main quest: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding main quest:', error);
            alert(`Error adding main quest: ${error.message}`);
        }
    }

    // Save side quest
    async function saveSideQuest() {
        const title = document.getElementById('sideQuestTitle').value;
        const description = document.getElementById('sideQuestDescription').value;
        const status = document.getElementById('sideQuestStatus').value;
        const relatedMainQuestId = document.getElementById('relatedMainQuest').value;
        
        // Get selected NPCs
        const npcCheckboxes = document.querySelectorAll('#sideQuestNpcCheckboxes .npc-checkbox:checked');
        const relatedNpcIds = Array.from(npcCheckboxes).map(cb => parseInt(cb.value));
        
        // Get selected locations
        const locationCheckboxes = document.querySelectorAll('#sideQuestLocationCheckboxes .location-checkbox:checked');
        const relatedLocationIds = Array.from(locationCheckboxes).map(cb => parseInt(cb.value));
        
        try {
            const response = await fetch(ENDPOINTS.sideQuests, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    status,
                    relatedMainQuestId: relatedMainQuestId ? parseInt(relatedMainQuestId) : null,
                    relatedNpcIds,
                    relatedLocationIds
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Reset form and close modal
                document.getElementById('addSideQuestForm').reset();
                sideQuestModal.hide();
                
                // Reload quests
                loadSideQuests();
                
                // Show success message
                alert('Side quest added successfully!');
            } else {
                console.error('Failed to add side quest:', result.error);
                alert(`Failed to add side quest: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding side quest:', error);
            alert(`Error adding side quest: ${error.message}`);
        }
    }

    // Save NPC
    async function saveNpc() {
        const name = document.getElementById('npcName').value;
        const description = document.getElementById('npcDescription').value;
        const role = document.getElementById('npcRole').value;
        const locationId = document.getElementById('npcLocation').value;
        
        try {
            const response = await fetch(ENDPOINTS.npcs, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    role,
                    locationId: locationId ? parseInt(locationId) : null
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Reset form and close modal
                document.getElementById('addNpcForm').reset();
                npcModal.hide();
                
                // Reload NPCs
                loadNpcs();
                
                // Show success message
                alert('NPC added successfully!');
            } else {
                console.error('Failed to add NPC:', result.error);
                alert(`Failed to add NPC: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding NPC:', error);
            alert(`Error adding NPC: ${error.message}`);
        }
    }

    // Save location
    async function saveLocation() {
        const name = document.getElementById('locationName').value;
        const description = document.getElementById('locationDescription').value;
        const type = document.getElementById('locationType').value;
        
        try {
            const response = await fetch(ENDPOINTS.locations, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    type
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Reset form and close modal
                document.getElementById('addLocationForm').reset();
                locationModal.hide();
                
                // Reload locations
                loadLocations();
                
                // Show success message
                alert('Location added successfully!');
            } else {
                console.error('Failed to add location:', result.error);
                alert(`Failed to add location: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding location:', error);
            alert(`Error adding location: ${error.message}`);
        }
    }

    // View quest details
    async function viewQuestDetails(questId, isMainQuest) {
        try {
            const endpoint = isMainQuest ? `${ENDPOINTS.mainQuests}/${questId}` : `${ENDPOINTS.sideQuests}/${questId}`;
            const response = await fetch(endpoint);
            const result = await response.json();
            
            if (result.success) {
                const quest = result.data;
                
                // Create a modal to display quest details
                const modalHtml = `
                    <div class="modal fade" id="questDetailsModal" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">${quest.title}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <span class="badge bg-${quest.status === 'active' ? 'success' : quest.status === 'completed' ? 'primary' : 'danger'}">${quest.status}</span>
                                        <span class="badge bg-${isMainQuest ? 'danger' : 'primary'}">${isMainQuest ? 'Main Quest' : 'Side Quest'}</span>
                                    </div>
                                    
                                    <h6>Description:</h6>
                                    <p>${quest.description}</p>
                                    
                                    ${!isMainQuest && quest.relatedMainQuestId ? `
                                        <h6>Related Main Quest:</h6>
                                        <p>${quest.relatedMainQuest ? quest.relatedMainQuest.title : 'Unknown'}</p>
                                    ` : ''}
                                    
                                    <h6>Related NPCs:</h6>
                                    ${quest.relatedNpcs && quest.relatedNpcs.length > 0 ? `
                                        <ul>
                                            ${quest.relatedNpcs.map(npc => `<li>${npc.name} (${npc.role})</li>`).join('')}
                                        </ul>
                                    ` : '<p>No related NPCs</p>'}
                                    
                                    <h6>Related Locations:</h6>
                                    ${quest.relatedLocations && quest.relatedLocations.length > 0 ? `
                                        <ul>
                                            ${quest.relatedLocations.map(location => `<li>${location.name} (${capitalizeFirstLetter(location.type)})</li>`).join('')}
                                        </ul>
                                    ` : '<p>No related locations</p>'}
                                    
                                    <div class="mt-3">
                                        <small class="text-muted">Created: ${new Date(quest.dateCreated).toLocaleString()}</small><br>
                                        <small class="text-muted">Last Updated: ${new Date(quest.lastUpdated).toLocaleString()}</small>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add modal to the document
                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = modalHtml;
                document.body.appendChild(modalContainer);
                
                // Show the modal
                const modal = new bootstrap.Modal(document.getElementById('questDetailsModal'));
                modal.show();
                
                // Remove modal from DOM when hidden
                document.getElementById('questDetailsModal').addEventListener('hidden.bs.modal', function() {
                    document.body.removeChild(modalContainer);
                });
            } else {
                console.error('Failed to load quest details:', result.error);
                alert(`Failed to load quest details: ${result.error}`);
            }
        } catch (error) {
            console.error('Error loading quest details:', error);
            alert(`Error loading quest details: ${error.message}`);
        }
    }

    // Open edit quest modal
    async function openEditQuestModal(questId, isMainQuest) {
        try {
            const endpoint = isMainQuest ? `${ENDPOINTS.mainQuests}/${questId}` : `${ENDPOINTS.sideQuests}/${questId}`;
            const response = await fetch(endpoint);
            const result = await response.json();
            
            if (result.success) {
                const quest = result.data;
                
                // Set form values
                document.getElementById('editQuestId').value = quest.id;
                document.getElementById('editQuestType').value = isMainQuest ? 'main' : 'side';
                document.getElementById('editQuestTitle').value = quest.title;
                document.getElementById('editQuestDescription').value = quest.description;
                document.getElementById('editQuestStatus').value = quest.status;
                
                // Show/hide related main quest dropdown for side quests
                const relatedMainQuestDiv = document.getElementById('editRelatedMainQuestDiv');
                if (isMainQuest) {
                    relatedMainQuestDiv.classList.add('d-none');
                } else {
                    relatedMainQuestDiv.classList.remove('d-none');
                    if (quest.relatedMainQuestId) {
                        document.getElementById('editRelatedMainQuest').value = quest.relatedMainQuestId;
                    } else {
                        document.getElementById('editRelatedMainQuest').value = '';
                    }
                }
                
                // Check related NPCs
                const npcCheckboxes = document.querySelectorAll('#editQuestNpcCheckboxes .npc-checkbox');
                npcCheckboxes.forEach(checkbox => {
                    checkbox.checked = quest.relatedNpcIds.includes(parseInt(checkbox.value));
                });
                
                // Check related locations
                const locationCheckboxes = document.querySelectorAll('#editQuestLocationCheckboxes .location-checkbox');
                locationCheckboxes.forEach(checkbox => {
                    checkbox.checked = quest.relatedLocationIds.includes(parseInt(checkbox.value));
                });
                
                // Show the modal
                editQuestModal.show();
            } else {
                console.error('Failed to load quest for editing:', result.error);
                alert(`Failed to load quest for editing: ${result.error}`);
            }
        } catch (error) {
            console.error('Error loading quest for editing:', error);
            alert(`Error loading quest for editing: ${error.message}`);
        }
    }

    // Update quest
    async function updateQuest() {
        const questId = parseInt(document.getElementById('editQuestId').value);
        const questType = document.getElementById('editQuestType').value;
        const isMainQuest = questType === 'main';
        
        const title = document.getElementById('editQuestTitle').value;
        const description = document.getElementById('editQuestDescription').value;
        const status = document.getElementById('editQuestStatus').value;
        
        // Get selected NPCs
        const npcCheckboxes = document.querySelectorAll('#editQuestNpcCheckboxes .npc-checkbox:checked');
        const relatedNpcIds = Array.from(npcCheckboxes).map(cb => parseInt(cb.value));
        
        // Get selected locations
        const locationCheckboxes = document.querySelectorAll('#editQuestLocationCheckboxes .location-checkbox:checked');
        const relatedLocationIds = Array.from(locationCheckboxes).map(cb => parseInt(cb.value));
        
        // Prepare update data
        const updateData = {
            title,
            description,
            status,
            relatedNpcIds,
            relatedLocationIds
        };
        
        // Add related main quest ID for side quests
        if (!isMainQuest) {
            const relatedMainQuestId = document.getElementById('editRelatedMainQuest').value;
            updateData.relatedMainQuestId = relatedMainQuestId ? parseInt(relatedMainQuestId) : null;
        }
        
        try {
            const endpoint = isMainQuest ? `${ENDPOINTS.mainQuests}/${questId}` : `${ENDPOINTS.sideQuests}/${questId}`;
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Close modal
                editQuestModal.hide();
                
                // Reload quests
                if (isMainQuest) {
                    loadMainQuests();
                } else {
                    loadSideQuests();
                }
                
                // Show success message
                alert(`${isMainQuest ? 'Main' : 'Side'} quest updated successfully!`);
            } else {
                console.error(`Failed to update ${isMainQuest ? 'main' : 'side'} quest:`, result.error);
                alert(`Failed to update ${isMainQuest ? 'main' : 'side'} quest: ${result.error}`);
            }
       
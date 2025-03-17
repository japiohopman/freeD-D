document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const clearChatButton = document.getElementById('clear-chat');
    const toggleInfoButton = document.getElementById('toggle-info');
    const infoPanel = document.getElementById('info-panel');
    const dynamicBackground = document.getElementById('dynamic-background');




    // Add character import button and file input
    const importCharacterButton = document.createElement('button');
    importCharacterButton.id = 'import-character';
    importCharacterButton.title = 'Importeer karakter';
    importCharacterButton.innerHTML = '<i class="header-button fa-solid fa-floppy-disk" style="background-color: rgba(255, 255, 255, 0);"></i>';



    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'character-file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';

    

    
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  



    // Add the new elements to the UI - using header-buttons instead of action-buttons
    const headerButtons = document.querySelector('.header-buttons');
    if (headerButtons) {
        // Insert import button before the clear chat button
        headerButtons.insertBefore(importCharacterButton, clearChatButton);
        document.body.appendChild(fileInput); // Append file input to body
    } else {
        console.error('Could not find .header-buttons container');
    }

    // Game state variables
    let gameState = {
        gold: 0,
        xp: 0,
        location: 'Tavern',
        playerInfo: {
            name: 'Adventurer',
            class: 'Fighter Level 1',
            hp: '10/10',
            ac: 12
        },
        npcs: []
    };

    // Initialize Swiper carousel
    const swiper = new Swiper('.swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,

        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Configure marked.js options
    marked.setOptions({
        breaks: true,  // Add line breaks on single line breaks
        gfm: true      // Enable GitHub Flavored Markdown
    });

    // Function to update game stats in UI
    function updateGameStats() {
        document.getElementById('gold-amount').textContent = gameState.gold;
        document.getElementById('xp-amount').textContent = gameState.xp;
        document.getElementById('current-location').textContent = gameState.location;

        // Update player info
        document.getElementById('player-name').textContent = gameState.playerInfo.name;
        document.getElementById('player-class').textContent = gameState.playerInfo.class;
        document.getElementById('player-hp').textContent = gameState.playerInfo.hp;
        document.getElementById('player-ac').textContent = gameState.playerInfo.ac;

        // Update background based on location
        updateBackgroundForLocation(gameState.location);

        // Update audio based on location
        updateAudioForLocation(gameState.location);
    }

    function sanitizeLocationName(locationName) {
        return locationName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    
    //Create unsanitized location data with sanitized keys
    const unsanitizedLocationData = {
        'forest': { music: 'music/forest.mp3', ambience: 'sounds/forest-ambience.mp3' },
        'beach': { music: 'music/beach.mp3', ambience: 'sounds/beach-ambience.mp3' },
        'alchemist’s spire': { music: 'music/spire.mp3', ambience: 'sounds/spire-ambience.mp3' },
        'arcane trinket': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'ashen wastes': { music: 'music/wasteland.mp3', ambience: 'sounds/wasteland-ambience.mp3' },
        'azure expanse': { music: 'music/ocean.mp3', ambience: 'sounds/ocean-ambience.mp3' },
        'back alley': { music: 'music/city_night.mp3', ambience: 'sounds/city_night-ambience.mp3' },
        'blackwood': { music: 'music/forest_dark.mp3', ambience: 'sounds/forest_dark-ambience.mp3' },
        'blind man’s alley': { music: 'music/city_night.mp3', ambience: 'sounds/city_night-ambience.mp3' },
        'bloodfang wastes': { music: 'music/wasteland.mp3', ambience: 'sounds/wasteland-ambience.mp3' },
        'cartographer’s quarter': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'celestial current': { music: 'music/ocean.mp3', ambience: 'sounds/ocean-ambience.mp3' },
        'celestial towers': { music: 'music/temple.mp3', ambience: 'sounds/temple-ambience.mp3' },
        'citadel': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'coastal path exit': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'coastal paths': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'command center': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'compass rose academy': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'crooked mast inn': { music: 'music/tavern.mp3', ambience: 'sounds/tavern-ambience.mp3' },
        'crystal pond': { music: 'music/nature.mp3', ambience: 'sounds/nature-ambience.mp3' },
        'decaying hulks': { music: 'music/shipwreck.mp3', ambience: 'sounds/shipwreck-ambience.mp3' },
        'deep roads': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'docks': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'drakenspur': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'drunken dragon': { music: 'music/tavern.mp3', ambience: 'sounds/tavern-ambience.mp3' },
        'dun korrim': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'echoing descent': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'elven isles': { music: 'music/elven-isles.mp3', ambience: 'sounds/forest-ambience.mp3' },
        'emerald wilds': { music: 'music/forest.mp3', ambience: 'sounds/forest-ambience.mp3' },
        'emperor’s spire': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'erelion': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'evergold bank': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'forum of kings': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'forgotten vault': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'fungus garden': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'gilded amphitheater': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'gilded bazaar': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'gilded feather': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'gilded fang': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'gilded tankard': { music: 'music/tavern.mp3', ambience: 'sounds/tavern-ambience.mp3' },
        'golden loom': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'golden plains': { music: 'music/plains.mp3', ambience: 'sounds/plains-ambience.mp3' },
        'grand cathedral of solmara': { music: 'music/temple.mp3', ambience: 'sounds/temple-ambience.mp3' },
        'grand library of lore': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'grand menagerie': { music: 'music/nature.mp3', ambience: 'sounds/nature-ambience.mp3' },
        'griffin aviary': { music: 'music/nature.mp3', ambience: 'sounds/nature-ambience.mp3' },
        'guard towers': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'hall of champions': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'hammerdeep': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'hidden alcoves': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'hidden sewer entrance': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'hollow range': { music: 'music/mountains.mp3', ambience: 'sounds/mountains-ambience.mp3' },
        'imperial road': { music: 'music/plains.mp3', ambience: 'sounds/plains-ambience.mp3' },
        'iron district': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'iron fang armory': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'jade dominion': { music: 'music/jungle.mp3', ambience: 'sounds/jungle-ambience.mp3' },
        'karak vurn': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'kazak dur': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'kraken’s maw': { music: 'music/ocean_storm.mp3', ambience: 'sounds/ocean_storm-ambience.mp3' },
        'laughing barrel': { music: 'music/tavern.mp3', ambience: 'sounds/tavern-ambience.mp3' },
        'leviathan’s maw': { music: 'music/ocean_storm.mp3', ambience: 'sounds/ocean_storm-ambience.mp3' },
        'lonely arch': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'lower city': { music: 'music/city_night.mp3', ambience: 'sounds/city_night-ambience.mp3' },
        'main chamber': { music: 'music/temple.mp3', ambience: 'sounds/temple-ambience.mp3' },
        'mariner’s path': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'market district': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'maw of the deep': { music: 'music/ocean_storm.mp3', ambience: 'sounds/ocean_storm-ambience.mp3' },
        'merchant’s current': { music: 'music/ocean.mp3', ambience: 'sounds/ocean-ambience.mp3' },
        'merchant’s guildhall': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'merging of the moons': { music: 'music/temple.mp3', ambience: 'sounds/temple-ambience.mp3' },
        'moonlit masquerade': { music: 'music/city_night.mp3', ambience: 'sounds/city_night-ambience.mp3' },
        'mystic herb': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'noble’s garden': { music: 'music/nature.mp3', ambience: 'sounds/nature-ambience.mp3' },
        'obsidian spire': { music: 'music/desert.mp3', ambience: 'sounds/desert-ambience.mp3' },
        'observatory': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'old lighthouse': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'old man finn’s spice emporium': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'old man hemlock’s pier': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'old prison': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'open waters': { music: 'music/ocean.mp3', ambience: 'sounds/ocean-ambience.mp3' },
        'outer walls': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'porthaven': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'priests’ chambers': { music: 'music/temple.mp3', ambience: 'sounds/temple-ambience.mp3' },
        'salty siren': { music: 'music/tavern.mp3', ambience: 'sounds/tavern-ambience.mp3' },
        'scribe’s quill': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'seagull’s cove': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'shadowed dagger': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'shadowed pouch': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'ship graveyard': { music: 'music/shipwreck.mp3', ambience: 'sounds/shipwreck-ambience.mp3' },
        'shipwright’s hangar': { music: 'music/docks.mp3', ambience: 'sounds/docks-ambience.mp3' },
        'shrine of whispering winds': { music: 'music/temple.mp3', ambience: 'sounds/temple-ambience.mp3' },
        'silent ruins': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'silver quill': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'silvervein hold': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'small beach': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'stormcoast': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'stalls': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'sunken grotto': { music: 'music/underwater.mp3', ambience: 'sounds/underwater-ambience.mp3' },
        'sunken ruins of aztara': { music: 'music/jungle.mp3', ambience: 'sounds/jungle-ambience.mp3' },
        'sunken vessels': { music: 'music/shipwreck.mp3', ambience: 'sounds/shipwreck-ambience.mp3' },
        'sunspire mountains': { music: 'music/mountains.mp3', ambience: 'sounds/mountains-ambience.mp3' },
        'sylvaris': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'tanner’s row': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'thalindor': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'thalmyr': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'tidepool gardens': { music: 'music/nature.mp3', ambience: 'sounds/nature-ambience.mp3' },
        'titan’s grave': { music: 'music/mountains.mp3', ambience: 'sounds/mountains-ambience.mp3' },
        'titan’s road': { music: 'music/mountains.mp3', ambience: 'sounds/mountains-ambience.mp3' },
        'titan’s spine mountains': { music: 'music/mountains.mp3', ambience: 'sounds/mountains-ambience.mp3' },
        'toll house': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'training grounds': { music: 'music/castle.mp3', ambience: 'sounds/castle-ambience.mp3' },
        'undermarch': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'underwater crypt': { music: 'music/underwater.mp3', ambience: 'sounds/underwater-ambience.mp3' },
        'uncharted waters': { music: 'music/ocean.mp3', ambience: 'sounds/ocean-ambience.mp3' },
        'upper city': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'vael’tharun': { music: 'music/underwater.mp3', ambience: 'sounds/underwater-ambience.mp3' },
        'valtarian empire': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'valtas': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'valtaria': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'veil of aether': { music: 'music/temple.mp3', ambience: 'sounds/temple-ambience.mp3' },
        'veil of mists': { music: 'music/forest_foggy.mp3', ambience: 'sounds/forest_foggy-ambience.mp3' },
        'vermin court': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'warehouse district': { music: 'music/city.mp3', ambience: 'sounds/city-ambience.mp3' },
        'watcher’s point': { music: 'music/coastal.mp3', ambience: 'sounds/coastal-ambience.mp3' },
        'whispering drain': { music: 'music/dungeon.mp3', ambience: 'sounds/dungeon-ambience.mp3' },
        'whispering market': { music: 'music/market.mp3', ambience: 'sounds/market-ambience.mp3' },
        'whispering reef': { music: 'music/ocean.mp3', ambience: 'sounds/ocean-ambience.mp3' },
        'wind chime terrace': { music: 'music/nature.mp3', ambience: 'sounds/nature-ambience.mp3' },
        'worldscar': { music: 'music/mountains.mp3', ambience: 'sounds/mountains-ambience.mp3' },
        'xylos': { music: 'music/jungle.mp3', ambience: 'sounds/jungle-ambience.mp3' }
    };
    
    const locationSounds = {};
    for (const [key, value] of Object.entries(unsanitizedLocationData)) {
        const sanitizedKey = sanitizeLocationName(key);
        locationSounds[sanitizedKey] = value;
    }

function setLocationSound(soundPath) {
    soundEffects.src = soundPath;
    soundEffects.loop = true;
    try {
        soundEffects.play();
    } catch (e) {
        console.error("Sound effect playback prevented:", e);
    }
}

function updateAudioForLocation(location) {
    const sanitizedLocation = sanitizeLocationName(location); // Sanitize here!

    backgroundMusic.pause();
    soundEffects.pause();

    setBackgroundMusic(sanitizedLocation); // Sanitize here!
}

function setBackgroundMusic(sanitizedLocation) { // Use sanitized name
    const soundData = locationSounds[sanitizedLocation];
    if (soundData) {
        backgroundMusic.src = soundData.music;
        setLocationSound(soundData.ambience);

        backgroundMusic.oncanplaythrough = () => {
            backgroundMusic.play().catch(e => console.error("Music playback prevented:", e));
            backgroundMusic.oncanplaythrough = null;
        };
    } else {
        backgroundMusic.src = 'music/default.mp3';
    }
}

function updateBackgroundForLocation(location) {
    dynamicBackground.className = 'background-overlay';
    const sanitizedLocation = sanitizeLocationName(location); // Sanitize here!
    if (locationSounds[sanitizedLocation]) {
        dynamicBackground.classList.add(`location-${sanitizedLocation}`);
    }
}

function generateLocationCSS(locationSounds) {
    const styles = Object.entries(locationSounds).map(([location, data]) => `
        .location-${location} {
            background-image: url('./images/${location}.jpg');
            z-index: 0;
            background-size: cover;
            background-position: center;
        }
    `).join('');
    return `<style>${styles}</style>`;
}

    const locationCSS = generateLocationCSS(locationSounds);
    document.head.insertAdjacentHTML('beforeend', locationCSS);

    // Function to add or update an NPC in the carousel
    function updateNPC(npc) {
        // Check if this NPC already exists in our state
        const existingIndex = gameState.npcs.findIndex(n => n.id === npc.id);

        if (existingIndex >= 0) {
            // Update existing NPC
            gameState.npcs[existingIndex] = npc;
        } else {
            // Add new NPC
            gameState.npcs.push(npc);

            // Create a new slide for this NPC
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.setAttribute('data-npc-id', npc.id);

            slide.innerHTML = `
                <div class="character-card npc-card">
                    <div class="character-header">
                        <h3>${npc.name}</h3>
                    </div>
                    <div class="character-avatar">
                        <img src="${npc.avatar || 'https://placehold.co/100x100/333333/ffffff?text=NPC'}" alt="${npc.name}">
                    </div>
                    <div class="character-details">
                        <div class="character-name">${npc.name}</div>
                        <div class="character-role">${npc.role || 'Unknown'}</div>
                        <div class="character-description">
                            ${npc.description || 'No information available.'}
                        </div>
                    </div>
                </div>
            `;

            // Add the slide to the swiper
            swiper.appendSlide(slide);
            swiper.update();
        }
    }

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        function updateBackgroundForLocation(location) {
            dynamicBackground.className = 'background-overlay'; //Reset
            const locationLower = sanitizeLocationName(location); // use sanitize function
            if (locationSounds[locationLower]) {
                dynamicBackground.classList.add(`location-${locationLower}`);
            }
        }

        // Parse markdown for bot messages only (not for user messages)
        if (isUser) {
            const messageParagraph = document.createElement('p');
            messageParagraph.textContent = message;
            messageContent.appendChild(messageParagraph);
        } else {
            // Parse markdown for bot responses
            messageContent.innerHTML = marked.parse(message);

            // Process the response for game state updates
            processResponseForGameUpdates(message);
        }

        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);

        // Save message to localStorage
        saveChatHistory(message, isUser ? 'user' : 'bot');

        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to process bot responses for game updates
    function processResponseForGameUpdates(message) {
        // Look for special markers in the message that indicate game state changes

        // Gold updates - handle both addition and subtraction
        const goldAddMatch = message.match(/\+(\d+) gold/i) || message.match(/\+(\d+)GP/i);
        const goldSubtractMatch = message.match(/\-(\d+) gold/i) || message.match(/\-(\d+)GP/i) ||
            message.match(/spend (\d+) gold/i) || message.match(/spent (\d+) gold/i) ||
            message.match(/costs? (\d+) gold/i) || message.match(/paid (\d+) gold/i);

        if (goldAddMatch) {
            gameState.gold += parseInt(goldAddMatch[1]);
        } else if (goldSubtractMatch) {
            gameState.gold -= parseInt(goldSubtractMatch[1]);
            // Ensure gold doesn't go below zero
            if (gameState.gold < 0) gameState.gold = 0;
        }

        // XP updates - only handle addition with expanded patterns
        const xpAddMatch = message.match(/\+(\d+) XP/i) ||
            message.match(/\+(\d+) experience/i) ||
            message.match(/earned (\d+) XP/i) ||
            message.match(/gained (\d+) XP/i) ||
            message.match(/receive (\d+) XP/i) ||
            message.match(/received (\d+) XP/i) ||
            message.match(/earn (\d+) experience/i) ||
            message.match(/gain (\d+) experience/i);

        if (xpAddMatch) {
            gameState.xp += parseInt(xpAddMatch[1]);
            console.log(`XP increased by ${xpAddMatch[1]}. New total: ${gameState.xp}`);
        }

       // Location updates - using a specific marker and sanitization
       const locationMarkerMatch = message.match(/\[LOCATION:([A-Za-z0-9\s]+)\]/i);
       if (locationMarkerMatch) {
           const newLocation = sanitizeLocationName(locationMarkerMatch[1].trim()); // Sanitize here!
           if (newLocation !== sanitizeLocationName(gameState.location)) { // Sanitize for comparison!
               gameState.location = newLocation;
           }
       }


        // Update the UI with new game state
        updateGameStats();

        // Save game state to localStorage
        saveGameState();
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.classList.add('message', 'bot-message');
        indicatorDiv.id = 'typing-indicator';

        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }

        indicatorDiv.appendChild(typingIndicator);
        chatMessages.appendChild(indicatorDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Function to send message to the server
    async function sendMessage(message) {
        try {
            showTypingIndicator();

            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    gameState // Send current game state to provide context
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            removeTypingIndicator();

            if (data.reply) {
                addMessage(data.reply);

                // Check if the response includes game state updates
                if (data.gameState) {
                    updateGameStateFromResponse(data.gameState);
                }
            } else {
                addMessage('Sorry, er ging iets mis. Probeer het later nog eens.');
            }
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            addMessage('Sorry, er ging iets mis met de verbinding. Probeer het later nog eens.');
        }
    }

    // Function to update game state from server response
    function updateGameStateFromResponse(newState) {
        if (newState.gold !== undefined) gameState.gold = newState.gold;
        if (newState.xp !== undefined) gameState.xp = newState.xp;
        if (newState.location) gameState.location = newState.location;

        if (newState.playerInfo) {
            gameState.playerInfo = { ...gameState.playerInfo, ...newState.playerInfo };
        }

        // Handle NPCs
        if (newState.npcs && Array.isArray(newState.npcs)) {
            newState.npcs.forEach(npc => {
                updateNPC(npc);
            });
        }

        // Update UI
        updateGameStats();

        // Save updated state
        saveGameState();
    }

    // Save message to localStorage
    function saveChatHistory(text, sender) {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatHistory.push({ text, sender });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }

    // Save game state to localStorage
    function saveGameState() {
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }

    // Load game state from localStorage
    function loadGameState() {
        const savedState = localStorage.getItem("gameState");
        if (savedState) {
            gameState = JSON.parse(savedState);

            // Rebuild NPC carousel
            gameState.npcs.forEach(npc => {
                // Only add slides for NPCs that don't already have one
                if (!document.querySelector(`.swiper-slide[data-npc-id="${npc.id}"]`)) {
                    updateNPC(npc);
                }
            });

            updateGameStats();
        }
    }

    // Load chat history from localStorage
    function loadChatHistory() {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

        if (chatHistory.length === 0) {
            // Add welcome message if no history exists
            addMessage("# Welkom bij de D&D Chatbot!\n\nIk ben je D&D assistent. Hoe kan ik je helpen met je Dungeons & Dragons avontuur?");
        } else {
            // Clear the messages div first to avoid duplicates
            chatMessages.innerHTML = '';

            // Add each message from history
            chatHistory.forEach(({ text, sender }) => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

                const messageContent = document.createElement('div');
                messageContent.classList.add('message-content');

                // Parse markdown for bot messages only
                if (sender === 'user') {
                    const messageParagraph = document.createElement('p');
                    messageParagraph.textContent = text;
                    messageContent.appendChild(messageParagraph);
                } else {
                    // Parse markdown for bot responses
                    messageContent.innerHTML = marked.parse(text);
                }

                messageDiv.appendChild(messageContent);
                chatMessages.appendChild(messageDiv);
            });

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Function to clear chat history
    function clearChatHistory() {
        // Clear chat history from localStorage
        localStorage.removeItem("chatHistory");

        // Reset game state variables
        gameState.gold = 0;
        gameState.xp = 0;
        gameState.location = 'Tavern';

        // Update UI with reset game state
        updateGameStats();

        // Save the reset game state to localStorage
        saveGameState();

        // Clear chat messages from UI
        chatMessages.innerHTML = "";

        // Add welcome message after clearing
        addMessage("# Welkom bij de D&D Chatbot!\n\nIk ben je D&D assistent. Hoe kan ik je helpen met je Dungeons & Dragons avontuur?");
    }

    // Function to handle character import from JSON file
    function importCharacter(file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                // Parse the JSON file
                const characterData = JSON.parse(event.target.result);

                // Update player info in game state
                gameState.playerInfo = {
                    name: characterData.charname || 'Adventurer',
                    class: characterData.classlevel || 'Fighter Level 1',
                    hp: `${characterData.currenthp || 10}/${characterData.maxhp || 10}`,
                    ac: characterData.ac || 12
                };

                // Update gold and XP if available
                if (characterData.gp) {
                    gameState.gold = parseInt(characterData.gp) || 0;
                }

                if (characterData.experiencepoints) {
                    gameState.xp = parseInt(characterData.experiencepoints) || 0;
                }

                // Update UI
                updateGameStats();

                // Save updated state
                saveGameState();

                // Notify user
                addMessage(`# Character Imported Successfully!\n\nWelcome, **${gameState.playerInfo.name}** (${gameState.playerInfo.class}).\n\nYour character has been loaded with:\n- HP: ${gameState.playerInfo.hp}\n- AC: ${gameState.playerInfo.ac}\n- Gold: ${gameState.gold}\n- XP: ${gameState.xp}`);

                // Log character details to console for debugging
                console.log('Character imported:', characterData);

            } catch (error) {
                console.error('Error parsing character file:', error);
                addMessage('Sorry, there was an error importing your character. Please check the file format and try again.');
            }
        };

        reader.onerror = function () {
            console.error('Error reading file');
            addMessage('Sorry, there was an error reading your character file. Please try again.');
        };

        // Read the file as text
        reader.readAsText(file);
    }

    // Event listener for send button
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            sendMessage(message);
        }
    });

    // Event listener for Enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, true);
                userInput.value = '';
                sendMessage(message);
            }
        }
    });

    // Event listener for clear chat button
    clearChatButton.addEventListener('click', clearChatHistory);

    // Event listener for import character button
    importCharacterButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Event listener for file input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importCharacter(e.target.files[0]);
            // Reset file input so the same file can be selected again
            e.target.value = '';
        }
    });

    // Load chat history when the page loads
    loadChatHistory();

    // Event listener for toggle info button
    toggleInfoButton.addEventListener('click', () => {
        infoPanel.classList.toggle('active');

        // Update swiper when panel becomes visible
        if (infoPanel.classList.contains('active')) {
            swiper.update();
        }
    });

    // Function to get the current date and time
    function getCurrentDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        console.log(`Current Date: ${date}`);
        console.log(`Current Time: ${time}`);
        return `${date} ${time}`;
    }

    // Call the function to log the current date and time
    getCurrentDateTime();

    // Display the current date and time in the footer
    document.getElementById('current-date-time').innerText = getCurrentDateTime();

    // Load game state when the page loads
    loadGameState();
});

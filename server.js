import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using ES module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client with Deepseek configuration
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Unified Deepseek API call function using OpenAI SDK
async function callDeepseekAPI(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Encourage participation by addressing all team members, prompting them with questions, and weaving their actions into the story. If a player has been silent for too long, subtly draw them back in by describing how their character perceives the scene or by having an NPC interact with them directly. Make each character's choices and presence feel meaningful, ensuring that no one is left out.Balance the focus among all players, avoiding long stretches where only one character is involved. If a scene primarily involves one player, introduce opportunities for others to contribute, whether through insight, reactions, or supporting actions. If a decision is being made, prompt the entire team for input rather than defaulting to a single leader.Use natural dialogue and dynamic descriptions to create an immersive group experience. Encourage teamwork by presenting challenges that require cooperation, ensuring that every player has moments to shine. NPCs should recognize and respond to multiple team members, addressing them based on their roles, personalities, and past actions.Keep the story flowing while maintaining engagement. If a player hesitates, guide them with subtle nudges rather than rushing them. Ensure that every interaction, from combat to roleplay, acknowledges and includes the whole group. Adapt fluidly to unexpected choices while maintaining a sense of shared adventure and camaraderie." 
        },
        { role: "user", content: userMessage }
      ],
      model: "deepseek-chat",
    });

    console.log('API Response received successfully');
    return completion;
  } catch (error) {
    console.error('API Error:', {
      status: error.status,
      message: error.message,
      type: error.type,
      code: error.code
    });
    throw error;
  }
}

// Main chat route using the unified API call function
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const gameState = req.body.gameState || {};
    
    // Log the location from gameState
    console.log('Current location:', gameState.location || 'Unknown');
    
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create a context-aware prompt that includes game state information
    const contextMessage = `
Current game state:
- Location: ${gameState.location || 'Unknown'}
- Gold: ${gameState.gold || 0}
- XP: ${gameState.xp || 0}
- Character: ${gameState.playerInfo?.name || 'Adventurer'}, ${gameState.playerInfo?.class || 'Fighter'}

The player says: ${userMessage}

Respond as a D&D Dungeon Master. Use Markdown formatting. When appropriate, include game mechanics like "+10 gold" or "You enter the forest [LOCATION:Forest]" so the interface can track progress.  If the player enters a new location, ensure the location is clearly stated and formatted as: [LOCATION:NewLocationName]. Guidelines for Describing New Locations
When player characters (PCs) enter a new location, provide an immersive, detailed description that sets the scene, conveys the atmosphere, and highlights key elements. Ensure consistency with established world details.

1. Environmental Description
Atmosphere & Mood: Capture the location's feeling (e.g., bustling, eerie, tranquil) using sensory details.
Visuals: Describe architecture, lighting, weather, and significant structures.
Sounds & Smells: Note background noise and dominant scents.
Scale & Layout: Indicate whether the space is vast, confined, towering, or claustrophobic.

Notable Landmarks & Points of Interest

Highlight major locations such as:
Taverns, shops, temples, markets, or fortifications.
Ruins, shrines, hidden entrances, or guarded areas.

Key NPCs

Introduce important NPCs who are:
Authority Figures: Guards, merchants, or faction leaders.
Unusual or Suspicious: Those acting strangely or standing out.
Accessible: NPCs who can engage the PCs immediately.
Appearance: Race, attire, distinctive features.
Demeanor: Friendly, hostile, secretive, preoccupied.
Actions: What they are doing upon the PCs arrival.

Exploration Paths & Exits

Mention routes leading deeper into the location:
Obvious Paths: Doors, alleys, staircases, tunnels.
Signage & Clues: Written directions or hidden messages.
Terrain: Natural or man-made elements guiding movement.

Example Output:

_"As you pass the iron gates, the Market District of Porthaven unfolds--a lively maze of stalls and stone buildings, lanterns casting flickering light. The scent of spiced meats and fresh fish mingles with hot wax from scribes shops. Merchants haggle, coins clink, and distant sea birds cry overhead.

A towering automaton stands motionless, gears faintly clicking. Ahead, a robed figure exchanges whispered words with a merchant, gloved hands gesturing toward a locked chest. A narrow alley winds between two buildings, barely wide enough to pass through, while a tavern sign reads 'The Gilded Gull'--its door ajar, laughter spilling from within."_

Adherence to Established World Details

Follow Documented Details: Expand descriptions while maintaining accuracy.

Maintain NPC Consistency: Names, personalities, and affiliations must match the file.

Respect Travel & Restrictions: Use recorded travel times, routes, and barriers.

Record Deviations: Any necessary changes must be justified and documented.
`;

    const apiResponse = await callDeepseekAPI(contextMessage);
    
    let reply = apiResponse.choices && apiResponse.choices[0]?.message?.content;
    const locationMatch = reply?.match(/\[LOCATION:([A-Za-z0-9\s]+)\]/i);

    let updatedGameState = gameState;
    if (locationMatch) {
        updatedGameState = { ...gameState, location: locationMatch[1].trim() };
        reply = reply.replace(/\[LOCATION:[A-Za-z0-9\s]+\]/i, ''); // Remove the marker from the reply
    }

    res.json({ reply: reply || 'No response from API', gameState: updatedGameState }); // send updated game state

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Er ging iets mis.' });
  }
});

// Test route
app.post('/chat-test', async (req, res) => {
  try {
    const response = await callDeepseekAPI("Hallo, hoe gaat het?");
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Er ging iets mis met de API-aanroep.' });
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in je browser om de chatbot te gebruiken.`);
});
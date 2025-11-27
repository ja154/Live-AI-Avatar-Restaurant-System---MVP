const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory session storage for demo
let currentSession = null;

/**
 * POST /api/demo/start
 * Start avatar session
 */
app.post('/api/demo/start', async (req, res) => {
  try {
    console.log('🎬 Starting demo avatar session...');

    // Step 1: Initialize HeyGen streaming session
    const heygenResponse = await axios.post(
      'https://api.heygen.com/v1/streaming.new',
      {
        avatar_id: process.env.HEYGEN_AVATAR_ID,
        quality: 'medium',
        voice: {
          voice_id: process.env.HEYGEN_VOICE_ID,
          rate: 1.0,
        },
        version: 'v2',
      },
      {
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const sessionData = heygenResponse.data.data;
    currentSession = {
      sessionId: sessionData.session_id,
      sdp: sessionData.sdp,
      iceServers: sessionData.ice_servers,
      createdAt: new Date(),
    };

    console.log('✅ HeyGen session created:', currentSession.sessionId);

    res.json({
      success: true,
      session: currentSession,
    });
  } catch (error) {
    console.error('❌ Failed to start session:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

/**
 * POST /api/demo/speak
 * Make avatar speak
 */
app.post('/api/demo/speak', async (req, res) => {
  try {
    const { text } = req.body;

    if (!currentSession) {
      return res.status(400).json({
        success: false,
        error: 'No active session. Start session first.',
      });
    }

    console.log(`🗣️  Avatar speaking: \"${text}\"`);

    // Send speak command to HeyGen
    await axios.post(
      'https://api.heygen.com/v1/streaming.task',
      {
        session_id: currentSession.sessionId,
        text: text,
        task_type: 'talk',
      },
      {
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      success: true,
      message: 'Avatar is speaking',
    });
  } catch (error) {
    console.error('❌ Failed to speak:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

/**
 * POST /api/demo/chat
 * Chat with avatar (using Gemini)
 */
app.post('/api/demo/chat', async (req, res) => {
  try {
    const { message } = req.body;

    console.log(`💬 Customer: \"${message}\"`);

    // Simple Gemini API call
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a friendly restaurant AI assistant. Customer said: \"${message}\". 
                
Respond naturally in under 30 words. Be warm and helpful.

Menu: Burger ($12), Pizza ($15), Salad ($9), Coke ($3)`,
              },
            ],
          },
        ],
      }
    );

    const aiResponse = geminiResponse.data.candidates[0].content.parts[0].text;
    console.log(`🤖 Avatar: \"${aiResponse}\"`);

    // Make avatar speak the response
    if (currentSession) {
      await axios.post(
        'https://api.heygen.com/v1/streaming.task',
        {
          session_id: currentSession.sessionId,
          text: aiResponse,
          task_type: 'talk',
        },
        {
          headers: {
            'X-Api-Key': process.env.HEYGEN_API_KEY,
          },
        }
      );
    }

    res.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error('❌ Chat failed:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

/**
 * POST /api/demo/stop
 * Stop avatar session
 */
app.post('/api/demo/stop', async (req, res) => {
  try {
    if (currentSession) {
      await axios.post(
        'https://api.heygen.com/v1/streaming.stop',
        {
          session_id: currentSession.sessionId,
        },
        {
          headers: {
            'X-Api-Key': process.env.HEYGEN_API_KEY,
          },
        }
      );

      console.log('🛑 Session stopped:', currentSession.sessionId);
      currentSession = null;
    }

    res.json({
      success: true,
      message: 'Session stopped',
    });
  } catch (error) {
    console.error('❌ Failed to stop:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/demo/status
 * Get session status
 */
app.get('/api/demo/status', (req, res) => {
  res.json({
    success: true,
    active: !!currentSession,
    session: currentSession
      ? {
          sessionId: currentSession.sessionId,
          uptime: Math.floor((Date.now() - currentSession.createdAt) / 1000),
        }
      : null,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
\u001b[1;36m\u001b[1;36m╔════════════════════════════════════════╗\u001b[0m
\u001b[1;36m║   🍽️  Restaurant Avatar Demo Server   ║\u001b[0m\n\u001b[1;36m╚════════════════════════════════════════╝\u001b[0m

\u001b[1;32m🌐 Server running: http://localhost:${PORT}\u001b[0m
\u001b[1;32m📱 Demo UI: http://localhost:${PORT}\u001b[0m

\u001b[1;36m📋 API Endpoints:\u001b[0m
  POST /api/demo/start   - Start avatar session
  POST /api/demo/speak   - Make avatar speak
  POST /api/demo/chat    - Chat with avatar
  POST /api/demo/stop    - Stop session
  GET  /api/demo/status  - Get session status

\u001b[1;36m🔑 Configuration:\u001b[0m
  HeyGen Avatar: ${process.env.HEYGEN_AVATAR_ID}
  Gemini: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}\n  
Ready to test! 🚀
  `);
});

// const axios = require('axios');
// const Chat = require('../models/Chat');

// const GEMINI_API_KEY = "AIzaSyDV9tbm2z4j6l2IFHgwAhIWrl0nW961V5Y4";
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// const chatWithGemini = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: 'Message is required' });
//   }

//   try {
//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `
//                   You are AgriBot, an expert farming assistant. Provide clear, practical, and accurate solutions to farming-related questions. Focus on crop management, pest control, irrigation, soil health, and sustainable practices. If the question is unrelated to farming, say: "I’m here to help with farming questions! Please ask something agriculture-related."
//                   ${message}
//                 `
//               }
//             ]
//           }
//         ]
//       },
//       {
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );

//     const botResponse = response.data.candidates[0].content.parts[0].text;

//     // Save chat to MongoDB
//     const chat = new Chat({
//       userMessage: message,
//       botResponse: botResponse,
//     });
//     await chat.save();

//     res.json({ response: botResponse });
//   } catch (error) {
//     console.error('Gemini API error:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to get response from AgriBot' });
//   }
// };

// module.exports = { chatWithGemini };
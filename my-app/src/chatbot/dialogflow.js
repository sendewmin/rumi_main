const { SessionsClient } = require('@google-cloud/dialogflow');

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { message, sessionId } = req.body;

    const credentials = JSON.parse(process.env.DIALOGFLOW_CREDENTIALS);

    const client  = new SessionsClient({ credentials });
    const project = process.env.DIALOGFLOW_PROJECT_ID;
    const session = client.projectAgentSessionPath(project, sessionId);

    const request = {
      session,
      queryInput: {
        text: { text: message, languageCode: 'en' },
      },
    };

    const [response] = await client.detectIntent(request);
    const reply      = response.queryResult.fulfillmentText;

    res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Sorry, I'm having trouble right now. Please try again." });
  }
};
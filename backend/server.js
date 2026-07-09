import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

app.post('/api/generate-test-cases', async (req, res) => {
  try {
    const { ticket } = req.body;

    if (!ticket) {
      return res.status(400).json({ error: 'Ticket data is required' });
    }

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    console.log('🤖 Generating test cases for ticket:', ticket.id);

    const prompt = `You are a QA test case generator for mobile applications. Generate comprehensive test cases for the following Jira ticket.

Ticket: ${ticket.id}
Name: ${ticket.name}
Type: ${ticket.type}
Platform: ${ticket.platform}

Generate 5-7 detailed test cases covering:
1. Happy path scenarios
2. Edge cases
3. Error handling
4. User role-based scenarios
5. Compliance/NDIS specific checks (if applicable)

Return ONLY a valid JSON array (no markdown, no extra text) with this structure:
[
  {
    "title": "Test case title",
    "component": "Component name",
    "platform": "${ticket.platform}",
    "steps": "1. Step one\\n2. Step two\\n3. Step three",
    "expectedResult": "What should happen",
    "preconditions": "Any prerequisites",
    "priority": "High/Medium/Low"
  }
]`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Claude API error:', error);
      return res.status(response.status).json({ error: error.error?.message || 'Claude API error' });
    }

    const data = await response.json();
    console.log('✅ API response received');
    const content = data.content[0].text;

    // Extract JSON from response
    let jsonStr = content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const testCases = JSON.parse(jsonStr);
    console.log(`✨ Generated ${testCases.length} test cases`);

    res.json({ testCases });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

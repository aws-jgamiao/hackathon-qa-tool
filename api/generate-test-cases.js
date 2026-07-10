const ANTHROPIC_API_KEY = process.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ticket, acceptanceCriteria = [] } = req.body;

    if (!ticket) {
      return res.status(400).json({ error: 'Ticket data is required' });
    }

    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    console.log('🤖 Generating test cases for ticket:', ticket.id);
    console.log('📝 Acceptance criteria:', acceptanceCriteria);

    const criteria = acceptanceCriteria.filter(c => c && c.trim());
    const testCaseCount = criteria.length || 1;

    const criteriaText = criteria
      .map((c, i) => `${i + 1}. ${c}`)
      .join('\n');

    const prompt = `You are a QA test case generator for NDIS and Flowlogic mobile applications. Generate detailed test cases that match professional QA standards.

Ticket: ${ticket.id}
Name: ${ticket.name}
Type: ${ticket.type}
Platform: ${ticket.platform}
${ticket.description ? `Description: ${ticket.description}` : ''}

${criteriaText ? `Acceptance Criteria:
${criteriaText}

` : ''}Generate exactly ${testCaseCount} detailed test cases - one for each acceptance criterion. Each test case must follow professional QA format with complete details.

Return ONLY a valid JSON array (no markdown, no extra text) with exactly ${testCaseCount} test cases. Each test case MUST have:
- A clear, descriptive title starting with "Verify" or "Test"
- Detailed description explaining what is being tested
- Complete pre-conditions list
- Numbered step-by-step test steps (separate each step with \\n)
- Clear expected result

Structure:
[
  {
    "title": "Verify [what is being tested]",
    "description": "Detailed explanation of what this test verifies and why it matters",
    "component": "Component/Feature name",
    "platform": "${ticket.platform}",
    "steps": "1. First action\\n2. Second action\\n3. Verification step",
    "expectedResult": "Detailed expected outcome",
    "preconditions": "Line 1 precondition\\nLine 2 precondition\\nLine 3 precondition"
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
        model: 'claude-haiku-4-5',
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
}

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function generateTestCases(ticket) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Claude API key not configured. Add VITE_ANTHROPIC_API_KEY to .env');
  }

  console.log('🤖 Starting test case generation for ticket:', ticket.id);

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

  try {
    console.log('📡 Calling Claude API...');
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1-20250805',
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
      console.error('❌ Claude API error response:', error);
      throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ API response received');
    const content = data.content[0].text;

    // Extract JSON from response (handle potential markdown wrapping)
    let jsonStr = content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const testCases = JSON.parse(jsonStr);
    console.log(`✨ Generated ${testCases.length} test cases:`, testCases);

    // Add IDs and metadata
    const enrichedCases = testCases.map((tc, index) => ({
      id: `TC-${Date.now()}-${index}`,
      ...tc,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null
    }));

    console.log('🎉 Test cases ready for database:', enrichedCases);
    return enrichedCases;
  } catch (error) {
    console.error('❌ Error generating test cases:', error);
    throw error;
  }
}

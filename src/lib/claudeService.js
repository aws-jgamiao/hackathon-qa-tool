// Use the same origin in production, localhost:3001 in development
const BACKEND_URL = import.meta.env.MODE === 'production'
  ? window.location.origin
  : 'http://localhost:3001';

export async function generateTestCases(ticket, acceptanceCriteria = []) {
  console.log('🤖 Starting test case generation for ticket:', ticket.id);
  console.log('📝 Acceptance criteria:', acceptanceCriteria);

  try {
    console.log('📡 Calling backend API...');
    const response = await fetch(`${BACKEND_URL}/api/generate-test-cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ticket, acceptanceCriteria })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Backend error response:', error);
      throw new Error(`Backend error: ${error.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ API response received');
    const testCases = data.testCases;

    console.log(`✨ Generated ${testCases.length} test cases:`, testCases);

    // Add IDs and metadata
    const enrichedCases = testCases.map((tc, index) => ({
      id: `TC-${Date.now()}-${index}`,
      ...tc,
      status: 'Pending',
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

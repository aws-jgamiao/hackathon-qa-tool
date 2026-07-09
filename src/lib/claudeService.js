const BACKEND_URL = 'http://localhost:3001';

export async function generateTestCases(ticket) {
  console.log('🤖 Starting test case generation for ticket:', ticket.id);

  try {
    console.log('📡 Calling backend API...');
    const response = await fetch(`${BACKEND_URL}/api/generate-test-cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ticket })
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

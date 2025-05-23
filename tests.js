// Test file for Aura Clock Tab
// These tests run when ?debug=true is in the URL

// Only run tests if TestHarness is available
if (window.TestHarness) {
    // Basic state manager tests
    TestHarness.test('State Manager: Initial State', () => {
        const state = window.stateManager.getState();
        TestHarness.assert(state !== undefined, 'State should be defined');
        TestHarness.assert(state.clockStyle === 'digital', 'Default clock style should be digital');
    });

    TestHarness.test('State Manager: State Updates', () => {
        const testValue = 'test-' + Date.now();
        
        // Test setting state
        window.stateManager.setState({ testValue });
        const state = window.stateManager.getState();
        
        TestHarness.assert(
            state.testValue === testValue,
            'State should be updated with new value'
        );
    });

    TestHarness.test('State Manager: Subscriptions', (done) => {
        const testValue = 'test-subscription-' + Date.now();
        let subscriptionCalled = false;
        
        // Subscribe to state changes
        const unsubscribe = window.stateManager.subscribe((prevState, newState) => {
            if (newState.testSubscription === testValue) {
                subscriptionCalled = true;
                TestHarness.assert(
                    prevState.testSubscription === undefined,
                    'Previous state should not have testSubscription'
                );
                TestHarness.assert(
                    newState.testSubscription === testValue,
                    'New state should have updated testSubscription'
                );
                done();
            }
        });
        
        // Trigger state change
        window.stateManager.setState({ testSubscription: testValue });
        
        // Cleanup
        return () => unsubscribe();
    });

    // Error logger tests
    TestHarness.test('Error Logger: Log Error', (done) => {
        if (!window.errorLogger) {
            console.warn('Error logger not available');
            done();
            return;
        }
        
        const testError = new Error('Test error ' + Date.now());
        window.errorLogger.logError(testError, { test: 'data' });
        
        // Verify error was logged
        window.errorLogger.getErrorLogs((logs) => {
            const found = logs.some(log => 
                log.message === testError.message && 
                log.context.test === 'data'
            );
            
            TestHarness.assert(found, 'Error should be in logs');
            done();
        });
    });

    // Run all tests when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Running tests...');
        
        TestHarness.run().then(results => {
            console.log('Test Results:', {
                passed: results.passedCount,
                failed: results.total - results.passedCount,
                total: results.total,
                duration: results.duration.toFixed(2) + 'ms'
            });
            
            // Display results in the UI if there are any failures
            if (results.passedCount < results.total) {
                const testResults = document.createElement('div');
                testResults.style.position = 'fixed';
                testResults.style.bottom = '10px';
                testResults.style.right = '10px';
                testResults.style.background = 'rgba(0,0,0,0.8)';
                testResults.style.color = '#fff';
                testResults.style.padding = '10px';
                testResults.style.borderRadius = '4px';
                testResults.style.zIndex = '9999';
                testResults.style.maxWidth = '300px';
                testResults.style.maxHeight = '200px';
                testResults.style.overflow = 'auto';
                testResults.style.fontFamily = 'monospace';
                testResults.style.fontSize = '12px';
                
                testResults.innerHTML = `
                    <div style="margin-bottom: 5px; font-weight: bold;">
                        Tests: ${results.passedCount}/${results.total} passed
                    </div>
                    ${results.results.map(r => `
                        <div style="color: ${r.passed ? '#4CAF50' : '#F44336'}; margin: 2px 0;">
                            ${r.passed ? '✓' : '✗'} ${r.name} (${r.duration}ms)
                            ${!r.passed ? `<div style="color: #FF9800; margin-left: 10px;">${r.error}</div>` : ''}
                        </div>
                    `).join('')}
                `;
                
                document.body.appendChild(testResults);
            }
        });
    });
}

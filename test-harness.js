// Simple Test Harness
// Provides basic testing utilities for the extension

const TestHarness = {
    tests: [],
    currentTest: 0,
    results: [],
    
    /**
     * Register a test
     * @param {string} name - Test name
     * @param {Function} testFn - Test function (can be async)
     */
    test(name, testFn) {
        this.tests.push({ name, fn: testFn });
    },
    
    /**
     * Assert that a condition is true
     * @param {boolean} condition - Condition to test
     * @param {string} message - Message to display if assertion fails
     * @throws {Error} If assertion fails
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    },
    
    /**
     * Run all registered tests
     */
    async run() {
        this.results = [];
        this.currentTest = 0;
        
        console.group('Running Tests');
        
        for (const test of this.tests) {
            this.currentTest++;
            console.log(`[${this.currentTest}/${this.tests.length}] ${test.name}`);
            
            const startTime = performance.now();
            let passed = false;
            let error = null;
            
            try {
                await test.fn();
                passed = true;
            } catch (e) {
                error = e;
                console.error('❌ Test failed:', e);
            } finally {
                const duration = (performance.now() - startTime).toFixed(2);
                
                this.results.push({
                    name: test.name,
                    passed,
                    duration: parseFloat(duration),
                    error: error ? error.message : null
                });
                
                console.log(`   ${passed ? '✅' : '❌'} ${test.name} (${duration}ms)`);
            }
        }
        
        const passedCount = this.results.filter(r => r.passed).length;
        const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
        
        console.groupEnd();
        console.log(`\nTests completed: ${passedCount}/${this.tests.length} passed (${totalDuration.toFixed(2)}ms)`);
        
        return {
            passed: passedCount === this.tests.length,
            total: this.tests.length,
            passedCount,
            duration: totalDuration,
            results: this.results
        };
    },
    
    /**
     * Get test results
     * @returns {Array} Array of test results
     */
    getResults() {
        return this.results;
    },
    
    /**
     * Reset the test harness
     */
    reset() {
        this.tests = [];
        this.results = [];
        this.currentTest = 0;
    }
};

// Add to global scope if running in a browser environment
if (typeof window !== 'undefined') {
    window.TestHarness = TestHarness;
}

// Example usage (commented out):
/*
TestHarness.test('Example passing test', () => {
    TestHarness.assert(1 + 1 === 2, '1 + 1 should equal 2');
});

TestHarness.test('Example failing test', () => {
    TestHarness.assert(1 + 1 === 3, '1 + 1 should not equal 3');
});

// Run tests when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    TestHarness.run().then(results => {
        console.log('Test results:', results);
    });
});
*/

// Export for CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestHarness;
}

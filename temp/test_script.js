
    // User-provided code
    function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Swap elements
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
 return s
}

    // Test execution logic
    const testCases = [{"input":"[\"h\",\"e\",\"l\",\"l\",\"o\"]","output":"[\"o\",\"l\",\"l\",\"e\",\"h\"]"},{"input":"[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]","output":"[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]"},{"input":"[\"a\"]","output":"[\"a\"]"},{"input":"[\"r\",\"a\",\"c\",\"e\",\"c\",\"a\",\"r\"]","output":"[\"r\",\"a\",\"c\",\"e\",\"c\",\"a\",\"r\"]"}];

    function runTests() {
      const results = [];

      testCases.forEach((testCase, index) => {
        try {
          // Extract function name dynamically
          const functionMatch = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/.exec(`function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Swap elements
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
 return s
}`);
          const functionName = functionMatch ? functionMatch[1] : null;

          if (!functionName) {
            throw new Error('No valid function found in code');
          }

          // Parse input 
          const parsedInput = JSON.parse(testCase.input);
          const startTime = process.hrtime();
          
          // Execute the function
          const result = eval(`${functionName}(${JSON.stringify(parsedInput)})`);
          
          const endTime = process.hrtime(startTime);
          const executionTime = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);

          results.push({
            testCase: index + 1,
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: result,
            executionTime: parseFloat(executionTime),
            passed: result.toString() === JSON.parse(testCase.output).toString(),
          });
        } catch (err) {
          results.push({
            testCase: index + 1,
            input: testCase.input,
            expectedOutput: testCase.output,
            error: err instanceof Error ? err.message : 'Unknown error',
            actualOutput: undefined,
            executionTime: 0,
            passed: false,
          });
        }
      });

      return results;
    }

    // Execute tests and output results
    const results = runTests();
    console.log(JSON.stringify(results));
    
// isomorphic
var window;
const math = (window !== undefined) ? window.math : require("../math");

const verbose = true;
const bar = "============================================================";
// globals keep track of tests for more information during a fail
let name = "beginning of tests";
let testNumber = 1;
const failedTests = [];

// math constants
const sqrt05 = Math.sqrt(0.5);


const testName = function (newName) {
  name = newName;
  testNumber = 1;
};
/**
 * test equal runs the equivalent() function which incorporates an epsilon
 * such that the test "1e-8 is equivalent to 0" will come back true
 */
const testEqual = function (...args) {
  if (!math.core.equivalent(...args)) {
    // test failed
    const message = `xxx test failed. #${testNumber} of ${name}`;
    failedTests.push({ message, args });
    if (verbose) { console.log(message); }
  } else {
    // test passed
    if (verbose) {
      console.log(`... test passed #${testNumber} of ${name}`);
    }
  }
  testNumber += 1;
};

testName("get two vectors");
testEqual([[1, 2], [3, 4]], math.segment(1, 2, 3, 4));

const a = math.core.intersection.circle_line_new([0, 0], 5, [8, -12], [-5, 7]);

console.log(a);

/**
 * queries
 */

if (failedTests.length) {
  console.log(`${bar}\nFailed tests and arguments\n`);
  failedTests.forEach(test => console.log(`${test.message}\n${test.args}\n${bar}`));
  throw new Error("tests failed");
} else {
  console.log(`${bar}\nall tests pass\n${bar}\n`);
}

const {Parser} = require('../src/parser');
const assert = require('assert');
const parser = new Parser();

function exec() {
    const program = `
    for (let i = 0; i < 10; i += 1) {
        x += i;
      }
    `
    // const program = "'hello'";
    // const program = '  "   hello"';
    
    const ast = parser.parse(program);
    
    console.log(JSON.stringify(ast, null, 2));
}

exec();

const tests = [
    require('./literal-test'),
    require('./statement-test'),
    require('./block-test'),
    require('./empty-test'),
    require('./math-test'),
    require('./assign-test'),
    require('./variable-test'),
    require('./if-test'),
    require('./relational-test'),
    require('./equality-test'),
    require('./logical-test'),
    require('./unary-test'),
    require('./control-test'),
];

function test(program, expected) {
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
    // console.log('Actual:', ast);
    // console.log('Expected:', expected);
}

tests.forEach(testRun => testRun(test))

console.log('all assertions passed! ')
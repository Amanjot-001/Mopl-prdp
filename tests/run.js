const {Parser} = require('../src/parser');
const assert = require('assert');
const parser = new Parser();

function exec() {
    const program = `
    x + 5 > 10 == true;
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
    require('./realational-test')
];

function test(program, expected) {
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
}

tests.forEach(testRun => testRun(test))

console.log('all assertions passed! ')
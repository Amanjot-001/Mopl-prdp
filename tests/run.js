const {Parser} = require('../parser');

const parser = new Parser();

const program = `23
// comment
`;
// const program = "'hello'";
// const program = '  "   hello"';

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));
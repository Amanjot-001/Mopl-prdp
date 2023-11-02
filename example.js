const { Tokenizer} = require('./src/tokenizer');
const { Parser } = require('./src/parser');
const { Generator } = require('./gen');

const tokenizer = new Tokenizer();
const parser = new Parser();
const generator = new Generator();

const program = ` let x = 5;
    while(x == 5) {
    x += 1;
    };
`;

console.log('Program: \n\n', program);

console.log('__________________\n');

console.log('Tokens: \n');

tokenizer.init(program);
let token = tokenizer.getNextToken();
while(token != null) {
    console.log(token);
    token = tokenizer.getNextToken();
}

console.log('__________________\n');

let ast = parser.parse(program);
console.log('AST: \n\n', JSON.stringify(ast, null, 2));

console.log('__________________\n');

let code = generator.generate(ast);

console.log('Generated Code: \n\n', code);

console.log('__________________\n');

console.log('Result: \n\n' + eval(code) + '\n');
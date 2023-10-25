const { Tokenizer} = require('./src/tokenizer');
const { Parser } = require('./src/parser');

const tokenizer = new Tokenizer();
const parser = new Parser();

const program = ` 2 + 2;`;


console.log('Program: \n\n', program);

console.log('__________________\n')

console.log('Tokens: \n');

tokenizer.init(program);
let token = tokenizer.getNextToken();
while(token != null) {
    console.log(token);
    token = tokenizer.getNextToken();
}

console.log('__________________\n')

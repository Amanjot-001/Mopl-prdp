const {Tokenizer} = require('./tokenizer');

class Parser {
    constructor() {
        this._string = '';
        this._Tokenizer = new Tokenizer();
    }

    parse(string) {
        this._string = string;
        this._Tokenizer.init(string);

        this._lookahead = this._Tokenizer.getNextToken();

        return this.program();
    }

    // main entry point
    program() {
        return {
            type: 'Program',
            body: this.NumericLiteral()
        };
    }

    NumericLiteral() {
        const token = this._eat('NUMBER');
        return {
            type: 'NumericLiteral',
            value: Number(token.value)
        };
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if(token == null) {
            throw new SyntaxError(
                `Unexpected end of input, expected: "${tokenType}` 
            );
        }

        if(token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}", expected: "${tokenType}"`
            )
        }

        this._lookahead = this._Tokenizer.getNextToken();

        return token;
    }
}

module.exports = {
    Parser
};
class Parser {

    constructor() {
        
    }

    parse(string) {
        this._string = string;
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
        return {
            type: 'NumericLiteral',
            value: Number(this._string)
        };
    }
}

module.exports = {
    Parser
};
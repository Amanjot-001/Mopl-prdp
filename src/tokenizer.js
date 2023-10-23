const Spec = [
    [/^\d+/, 'NUMBER'],
    [/^"[^"]*"/, 'STRING'],
    [/^'[^']*'/, 'STRING'],

    // whitespaces
    [/^\s+/, null],

    // comments
    [/^\/\/.*/, null],

    //multiline comments
    [/^\/\*[\s\S]*?\*\//, null],

    //semicolon
    [/^;/, ';'],

    // curly braces
    [/^\{/, '{'],
    [/^\}/, '}'],

    // *
    [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],

    // parenthesis
    [/^\(/, '('],
    [/^\)/, ')'],

    //identifiers ... also includes numbers so its below
    [/^\w+/, 'IDENTIFIER'],

    // assignment operators = , *= , += , -= , /=
    [/^=/, 'SIMPLE_ASSIGN'],
    [/^[\*\/\+\-]=/, 'COMPLEX_ASSIGN'],

    // + and -
    [/^[+\-]/, 'ADDITIVE_OPERATOR'],

]

class Tokenizer {
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    // end of file or not
    _isEOF() {
        return this._cursor === this._string.length;
    }

    hasMoreTokens() {
       return this._cursor < this._string.length;
    }

    getNextToken() {
        if(!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for(const [regex, tokenType] of Spec) {
            const tokenValue = this._match(regex, string);

            if(tokenValue == null)
                continue;

            if(tokenType == null)
                return this.getNextToken();
            
            return {
                type: tokenType,
                value: tokenValue
            };
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}"`);
    }

    _match(regex, string) {
        const matched = regex.exec(string);
        if(matched == null) {
            return null;
        }
        this._cursor += matched[0].length;

        return matched[0];
    }
}

module.exports = {
    Tokenizer
}
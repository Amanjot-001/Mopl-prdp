const {Tokenizer} = require('./tokenizer');

const DefaultFactory = {
    Program(body) {
        return {
            type: 'Program',
            body
        };
    },

    EmptyStatement() {
        return {
            type: 'EmptyStatement'
        };
    },

    BlockStatement(body) {
        return {
            type: 'BlockStatement',
            body,
        }
    },

    ExpressionStatement(expression) {
        return {
            type: 'ExpressionStatement',
            expression
        };
    },

    NumericLiteral(value) {
        return {
            type: 'NumericLiteral',
            value
        };
    },

    StringLiteral(value) {
        return {
            type: 'StringLiteral',
            value
        };
    },
}

const SExpressionFactory = {
    Program(body) {
        return ['begin', body];
    },

    EmptyStatement() {},

    BlockStatement(body) {
        return ['begin', body];
    },

    ExpressionStatement(expression) {
        return expression;
    },

    NumericLiteral(value) {
        return value;
    },

    StringLiteral(value) {
        return `${value}`;
    },
}

const AST_MODE = 'default';

const factory = AST_MODE === 'default' ? DefaultFactory : SExpressionFactory;

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
        return factory.Program(this.StatementList());
    }

    StatementList(stopLookAhead = null) {
        const statementList = [this.Statement()];

        // to avoid left recursion
        while(this._lookahead != null && this._lookahead.type !== stopLookAhead) {
            statementList.push(this.Statement())
        }

        return statementList;
    }

    Statement() {
        switch (this._lookahead.type) {
            case ';':
                return this.EmptyStatement();
            case '{':
                return  this.BlockStatement();
            default :
                return this.ExpressionStatement();
        }
    }

    EmptyStatement() {
        this._eat(';');

        return factory.EmptyStatement();
    }

    BlockStatement() {
        this._eat('{');
        const body = this._lookahead.type !== '}' ? this.StatementList('}') : [];
        this._eat('}');

        return factory.BlockStatement(body);
    }

    ExpressionStatement() {
        const expression = this.Expression();
        this._eat(';');

        return factory.ExpressionStatement(expression);
    }

    Expression() {
        return this.AdditiveExpression();
    }

    // no left recursion
    // Additive has lower precedence than literal
    // lower the precedence closer to the program
    // for + and -
    AdditiveExpression() {
        let left = this.Literal();

        while(this._lookahead.type === 'Additive_Operator') {
            const operator = this._eat('Additive_Operator').value;
            const right = this.Literal();
        }

        left = {
          type: 'BinaryExpression',
          operator,
          left,
          right
        }

        return left;
    }

    Literal() {
        switch(this._lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral();
            case 'STRING':
                return this.StringLiteral();
        }
        throw new SyntaxError(
            `Unexpected literal production  `
        )
    }

    NumericLiteral() {
        const token = this._eat('NUMBER');

        return factory.NumericLiteral(Number(token.value));
    }

    StringLiteral() {
        const token = this._eat('STRING');

        return factory.StringLiteral(token.value.slice(1, -1));
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if(token == null) {
            throw new SyntaxError(
                `Unexpected end of input, expected: "${tokenType}"` 
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
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
            case 'let':
                return this.VariableStatement();
            case 'if':
                return this.IfStatement();
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

    VariableStatement() {
        this._eat('let');
        const declarations = this.VariableDeclarationList();
        this._eat(';');
        return {
            type: 'VariableStatement',
            declarations
        };
    }

    VariableDeclarationList() {
        const declarations = [];
        
        do {
            declarations.push(this.VariableDeclaration());
        }   while(this._lookahead.type === ',' && this._eat(','));

        return declarations;
    }

    VariableDeclaration() {
        const id = this.Identifier();

        const init = this._lookahead.type !== ';' && this._lookahead.type !== ','
            ? this.VariableInitializer()
            : null;
        
        return {
            type: 'VariableDeclaration',
            id,
            init
        };
    }

    VariableInitializer() {
        this._eat('SIMPLE_ASSIGN');
        return this.AssignmentExpression();
    }

    ExpressionStatement() {
        const expression = this.Expression();
        this._eat(';');

        return factory.ExpressionStatement(expression);
    }

    Expression() {
        return this.AssignmentExpression();
    }

    AssignmentExpression() {
        const left = this.AdditiveExpression();

        if(!this._isAssignmentOperator(this._lookahead.type))
            return left;
        
        return {
            type: 'AssignmentExpression',
            operator: this.AssignmentOperator().value,
            left: this._checkValidAssignmentTarget(left),
            right: this.AssignmentExpression()
        };
    }

    AssignmentOperator() {
        if(this._lookahead.type === 'SIMPLE_ASSIGN')
            return this._eat('SIMPLE_ASSIGN');
        
        return this._eat('COMPLEX_ASSIGN');
    }

    _isAssignmentOperator(tokenType) {
        return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN';
    }

    LeftHandSideExpression() {
        return this.Identifier();
    }

    Identifier() {
        const name = this._eat('IDENTIFIER').value;

        return {
            type: 'Identifier',
            name
        };
    }

    _checkValidAssignmentTarget(node) {
        if(node.type === 'Identifier')
            return node;
        
        throw new SyntaxError('Invalid left hand side in assignment expression');
    }


    // no left recursion
    // Additive has lower precedence than literal
    // lower the precedence closer to the program
    // for + and -
    AdditiveExpression() {
        return this._BinaryExpression(
            'MultiplicativeExpression',
            'ADDITIVE_OPERATOR'
        );
    }

    MultiplicativeExpression() {
        return this._BinaryExpression(
            'PrimaryExpression',
            'MULTIPLICATIVE_OPERATOR'
        );
    }

    _BinaryExpression(builderName, operatorToken) {
        let left = this[builderName]();

        while(this._lookahead.type === operatorToken) {
            const operator = this._eat(operatorToken).value;
            const right = this[builderName]();

            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            }
        }

        return left;
    }

    PrimaryExpression() {
        if(this._isLiteral(this._lookahead.type))
            return this.Literal();
        switch(this._lookahead.type) {
            case '(':
                return this.ParenthesizedExpression();
            default:
                return this.LeftHandSideExpression();
        }
    }

    _isLiteral(tokenType) {
        return tokenType === 'NUMBER' || tokenType === 'STRING';
    }

    ParenthesizedExpression() {
        this._eat('(');
        const expression = this.Expression();
        this._eat(')');
        return expression;
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
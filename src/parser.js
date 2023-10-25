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
            case 'def':
                return this.FunctionDeclaration();
            case 'class':
                return this.ClassDeclaration();
            case 'return':
                return this.ReturnStatement();
            case 'while':
            case 'do':
            case 'for':
                return this.IterationStatement();
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

    ClassDeclaration() {
        this._eat('class');

        const id = this.Identifier();

        const superClass = 
            this._lookahead.type === 'extends'
            ? this.ClassExtends()
            : null;
        
        const body = this.BlockStatement();

        return {
            type: 'ClassDeclaration',
            id,
            superClass,
            body
        };
    }

    ClassExtends() {
        this._eat('extends');
        return this.Identifier();
    }


    FunctionDeclaration() {
        this._eat('def');
        const name = this.Identifier();

        this._eat('(');

        const params = this._lookahead.type !== ')'
        ? this.FormalParamList() : [];

        this._eat(')');

        const body = this.BlockStatement();

        return {
            type: 'FunctionDeclaration',
            name,
            params,
            body
        };
    }

    FormalParamList() {
        const params = [];

        do {
            params.push(this.Identifier());
        }   while(this._lookahead === ',' && this._eat(','));

        return params;
    }

    ReturnStatement() {
        this._eat('return');
        const argument = this._lookahead.type !== ';' ? this.Expression() : null;
        this._eat(';');

        return  {
            type: 'ReturnStatement',
            argument
        };
    }

    IterationStatement() {
        switch(this._lookahead.type) {
            case 'while':
                return this.WhileStatement();
            case 'do':
                return this.DoWhileStatement();
            case 'for':
                return this.ForStatement();
        }
    }

    WhileStatement() {
        this._eat('while');
        this._eat('(');
        const test = this.Expression();
        this._eat(')');

        const body = this.Statement();
        this._eat(';')
        return {
            type: 'WhileStatement',
            test,
            body
        };
    }

    DoWhileStatement() {
        this._eat('do');
        const body = this.Statement();
        this._eat('while');
        this._eat('(');
        const test = this.Expression();
        this._eat(')');

        this._eat(';')

        return {
            type: 'DoWhileStatement',
            body,
            test
        };
    }

    ForStatement() {
        this._eat('for');
        this._eat('(');
        
        const init = this._lookahead.type !== ';' ? this.ForStatementInit() : null;
        this._eat(';');

        const test = this._lookahead.type !== ';' ? this.Expression() : null;
        this._eat(';');

        const update = this._lookahead.type !== ')' ? this.Expression() : null;
        this._eat(')');

        const body = this.Statement();

        return {
            type: 'ForStatement',
            init,
            test,
            update,
            body
        };
    }

    ForStatementInit() {
        if(this._lookahead.type === 'let') {
            return this.VariableStatementInit()
        }
        return this.Expression();
    }

    IfStatement() {
        this._eat('if');
        this._eat('(');
        const test = this.Expression();
        this._eat(')');

        const consequent = this.Statement();

        const alternate = this._lookahead != null && this._lookahead.type === 'else'
        ? this._eat('else') && this.Statement()
        : null;

        return {
            type: 'IfStatement',
            test,
            consequent,
            alternate
        };
    }

    // just without ;
    VariableStatementInit() {
        this._eat('let');
        const declarations = this.VariableDeclarationList();
        return {
            type: 'VariableStatement',
            declarations
        };
    }

    VariableStatement() {
        const variableStatement = this.VariableStatementInit();
        this._eat(';');
        return variableStatement;
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
        const left = this.LogicalORExpression();

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

    LogicalORExpression() {
        return this._LogicalExpression('LogicalANDExpression', 'LOGICAL_OR');
    }

    LogicalANDExpression() {
        return this._LogicalExpression('EqualityExpression', 'LOGICAL_AND');
    }

    EqualityExpression() {
        return this._BinaryExpression('RelationalExpression', 'EQUALITY_OPERATOR')
    }

    RelationalExpression() {
        return this._BinaryExpression('AdditiveExpression', 'RELATIONAL_OPERATOR');
    }

    _isAssignmentOperator(tokenType) {
        return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN';
    }

    Identifier() {
        const name = this._eat('IDENTIFIER').value;

        return {
            type: 'Identifier',
            name
        };
    }

    _checkValidAssignmentTarget(node) {
        if(node.type === 'Identifier' || node.type === 'MemberExpression')
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
            'UnaryExpression',
            'MULTIPLICATIVE_OPERATOR'
        );
    }

    _LogicalExpression(builderName, operatorToken) {
        let left = this[builderName]();

        while(this._lookahead.type === operatorToken) {
            const operator = this._eat(operatorToken).value;

            const right = this[builderName]();

            left = {
                type: 'LogicalExpression',
                operator,
                left,
                right
            };
        }
        return left;
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

    UnaryExpression() {
        let operator;
        switch(this._lookahead.type) {
            case 'ADDITIVE_OPERATOR':
                operator = this._eat('ADDITIVE_OPERATOR').value;
                break;
            case 'LOGICAL_NOT':
                operator = this._eat('LOGICAL_NOT').value;
                break;
        }

        if(operator != null) {
            return {
                type: 'UnaryExpression',
                operator,
                argument: this.UnaryExpression()
            };
        }

        return this.LeftHandSideExpression();
    }

    LeftHandSideExpression() {
        return this.CallMemberExpression();
    }

    CallMemberExpression() {
        if(this._lookahead.type === 'super') {
            return this._CallExpression(this.Super());
        }

        const member = this.MemberExpression();

        if(this._lookahead.type === '(') {
            return this._CallExpression(member);
        }

        return member;
    }

    _CallExpression(callee) {
        let callExpression = {
            type: 'CallExpression',
            callee,
            arguments: this.Arguments()
        };

        if(this._lookahead.type === '(') {
            callExpression = this._CallExpression(callExpression);
        }
        return callExpression;
    }

    Arguments() {
        this._eat('(');

        const argumentList = this._lookahead.type !== ')' ? this.ArgumentList() : [];  

        this._eat(')');

        return argumentList;
    }

    ArgumentList() {
        const argumentList = [];

        do {
            argumentList.push(this.AssignmentExpression());
        }   while(this._lookahead.type === ',' && this._eat(','));

        return argumentList;
    }

    MemberExpression() {
        let object = this.PrimaryExpression();

        while(this._lookahead.type === '.' || this._lookahead.type === '[') {
            if(this._lookahead.type === '.') {
                this._eat('.');
                const property = this.Identifier();
                object = {
                    type: 'MemberExpression',
                    computed: false,
                    object,
                    property
                };
            }

            if(this._lookahead.type === '[') {
                this._eat('[');
                const property = this.Expression();
                this._eat(']');
                object = {
                    type: 'MemberExpression',
                    computed: true,
                    object,
                    property
                };
            }
        }
        return object;
    }

    PrimaryExpression() {
        if(this._isLiteral(this._lookahead.type))
            return this.Literal();
        switch(this._lookahead.type) {
            case '(':
                return this.ParenthesizedExpression();
            case 'IDENTIFIER':
                return this.Identifier();
            case 'this':
                return this.ThisExpression();
            case 'new':
                return this.NewExpression();
            default:
                return this.LeftHandSideExpression();
        }
    }

    NewExpression() {
        this._eat('new');
        return  {
            type: 'NewExpression',
            callee: this.MemberExpression(),
            arguments: this.Arguments()
        };
    }

    ThisExpression() {
        this._eat('this');
        return {
            type: 'ThisExpression',
        };
    }

    Super() {
        this._eat('super');

        return {
            type: 'Super'
        };
    }

    _isLiteral(tokenType) {
        return (
            tokenType === 'NUMBER' ||
            tokenType === 'STRING' ||
            tokenType === 'true' ||
            tokenType === 'false' ||
            tokenType === 'null'
        );
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
            case 'true' :
                return this.BooleanLiteral(true);
            case 'false':
                return this.BooleanLiteral(false);
            case 'null':
                return this.NullLiteral();
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

    BooleanLiteral(value) {
        this._eat(value ? 'true' : 'false');
        return {
            type: 'BooleanLiteral',
            value
        };
    }

    NullLiteral() {
        this._eat('null');
        return {
            type: 'NullLiteral',
            value: null
        }
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
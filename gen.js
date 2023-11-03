class Generator {
    constructor() {
        this.code = '';
    }

    generate(node) {
        if (node.type === "Program") {
            this.code = this.StatementList(node.body).join('\n');
            return this.code;
        } else {
            throw new Error("Unsupported AST node type: " + node.type);
        }
    }

    StatementList(body) {
        return body.map((statement) => this.Statement(statement));
    }

    Statement(node) {
        switch (node.type) {
            case 'EmptyStatement':
                return this.EmptyStatement();
            case 'BlockStatement':
                return this.BlockStatement(node.body);
            case 'VariableStatement':
                return this.VariableStatement(node);
            case 'IfStatement':
                return this.IfStatement(node);
            case 'FunctionDeclaration':
                return this.FunctionDeclaration(node);
            case 'ClassDeclaration':
                return this.ClassDeclaration();
            case 'ReturnStatement':
                return this.ReturnStatement(node);
            case 'WhileStatement':
            case 'DoWhileStatement':
            case 'ForStatement':
                return this.IterationStatement(node);
            case 'ExpressionStatement':
                return this.ExpressionStatement(node)
            default:
                return this.Expression(node);
        }
    }

    EmptyStatement(node) {
        return '';
    }

    BlockStatement(body) {
        return '\n' + this.StatementList(body).join('\n') + '\n';
    }

    VariableStatement(node) {
        return 'let ' + node.declarations.map(declaration => this.VariableDeclaration(declaration));
    }

    VariableDeclaration(node) {
        const id = this.Expression(node.id);
        const init = this.Expression(node.init);

        return `${id} = ${init}`;
    }

    FunctionDeclaration(node) {
        const name = this.Identifier(node.name);
        const params = node.params.map(param => this.Expression(param)).join('\n');
        const body = this.Statement(node.body);

        return `function ${name} (${params}) {\n${body}\n}`;
    }

    IterationStatement(node) {
        switch (node.type) {
            case 'WhileStatement':
                return this.WhileStatment(node);
            case 'DoWhileStatement':
                return this.DoWhileStatment(node);
            case 'ForStatement':
                return this.ForStatement(node);
            default:
                return '';
        }
    }

    WhileStatment(node) {
        const test = this.Expression(node.test);
        const body = this.Statement(node.body);

        return `while(${test}) {\n${body}\n;}`
    }

    DoWhileStatment(node) {
        const body = this.Statement(node.body);
        const test = this.Expression(node.test);

        return `do{\n${body}\n} while(${test});`
    }

    ForStatement(node) {
        const init = node.init ? this.Statement(node.init) : '';
        const test = node.test ? this.Expression(node.test) : '';
        const update = node.update ? this.Expression(node.update) : '';
        const body = this.Statement(node.body);

        return `for(${init}; ${test}; ${update}) {\n${body}\n}`;
    }

    IfStatement(node) {
        const test = this.Expression(node.test);
        const consequent = node.consequent.body.map(statements => this.Statement(statements)).join('\n');
        const alternate = node.alternate ? this.Statement(node.alternate) : '';

        return `if (${test}) {\n${consequent}\n}\n${alternate}`
    }

    ReturnStatement(node) {
        const argument = this.Statement(node.argument);

        return `return ${argument}`;
    }

    ExpressionStatement(node) {
        return this.Expression(node.expression);
    }

    Expression(node) {
        switch (node.type) {
            case 'BinaryExpression':
                return this.BinaryExpression(node);
            case 'AssignmentExpression':
                return this.AssignmentExpression(node);
            case 'Identifier':
                return this.Identifier(node);
            case 'NumericLiteral':
                return this.NumericLiteral(node);
            case 'StringLiteral':
                return this.StringLiteral(node);
            case 'CallExpression':
                return this.CallExpression(node);
            case 'BooleanLiteral':
                return this.BooleanLiteral(node);
            case 'NullLiteral':
                return this.NullLiteral(node);
            default:
                return '';
        }
    }

    CallExpression(node) {
        const callee = this.Identifier(node.callee);
        const argumentList = node.arguments.map(argument => this.Expression(argument)).join('\n');

        return `${callee}(${argumentList});`
    }

    AssignmentExpression(node) {
        const identifier = this.Expression(node.left);
        const operator = node.operator;
        const right = this.Expression(node.right);

        return `${identifier} ${operator} ${right}`;
    }

    BinaryExpression(node) {
        const left = this.Expression(node.left);
        const operator = node.operator;
        const right = this.Expression(node.right);

        return `${left} ${operator} ${right}`;
    }

    Identifier(node) {
        return node.name;
    }

    NumericLiteral(node) {
        return node.value.toString();
    }

    StringLiteral(node) {
        return `'${node.value}'`;
    }

    BooleanLiteral(node) {
        return `${node.value}`;
    }

    NullLiteral(node) {
        return `${node.value}`;
    }
}

module.exports = {
    Generator
}
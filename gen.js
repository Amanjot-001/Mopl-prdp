class Generator {
    constructor() {
        this.code = '';
    }

    generate(node) {
        if (node.type === "Program") {
            this.code = this.StatementList(node.body).join('/n');
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
                return this.FunctionDeclaration();
            case 'ClassDeclaration':
                return this.ClassDeclaration();
            case 'ReturnStatement':
                return this.ReturnStatement();
            case 'WhileStatement':
            case 'DoWhileStatement':
            case 'ForStatement':
                return this.IterationStatement();
            case 'ExpressionStatement':
                return this.ExpressionStatement(node)
            default:
                return '';
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

    IfStatement(node) {
        const test = this.Expression(node.test);
        console.log(node.consequent.body)
        const consequent = node.consequent.body.map(statements => this.Statement(statements)).join('\n');
        const alternate = node.alternate ? this.Statement(node.alternate) : '';

        return `if (${test}) {\n${consequent}\n}\n${alternate}`
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
            default:
                return '';
        }
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

        return `${left} ${operator} ${right};`;
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
}

module.exports = {
    Generator
}
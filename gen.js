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
                return this.VariableStatement();
            case 'IfStatement':
                return this.IfStatement();
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
        return '\n' +  this.StatementList(body).join('\n') + '\n';
    }

    ExpressionStatement(node) {
        return this.Expression(node.expression);
    }

    Expression(node) {
        return this.BinaryExpression(node);
    }

    BinaryExpression(node) {
        const left = this.NumericLiteral(node.left);
        const operator = node.operator;
        const right = this.NumericLiteral(node.right);

        return `${left} ${operator} ${right};`;
    }

    NumericLiteral(node) {
        return node.value.toString();
    }
}

module.exports = {
    Generator
}
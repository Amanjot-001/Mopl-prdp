class Generator {
    constructor() {
        this.code = '';
    }

    generate(node) {
        if (node.type === "Program") {
            this.code = this.StatementList(node.body);
            return this.code;
        } else {
            throw new Error("Unsupported AST node type: " + node.type);
        }
    }

    StatementList(body) {
        body.map(statement => this.Statement(statement));
    }

    Statement(node) {
        switch (node.type) {
            case 'EmptyStatement':
                return this.EmptyStatement();
            case 'BlockStatement':
                return this.BlockStatement();
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
                return this.ExpressionStatement()
            default:
                return '';
        }
    }

    EmptyStatement(node) {
        return '';
    }

    ExpressionStatement(node) {
        return this.Expression(node.expression);
    }

    Expression(node) {
        return this.BinaryExpression(node);
    }

    BinaryExpression(node) {
        this.code += this.NumericLiteral(node.left);
        this.code += ` ${node.operator} `;
        this.code += this.NumericLiteral(node.right);
    }

    NumericLiteral(node) {
        return node.value.toString();
    }
}

module.exports = {
    Generator
}
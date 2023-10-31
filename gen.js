class Generator {
    constructor() {
        this.code = '';
    }

    generate(node) {
        if (node.type === "Program") {
            this.StatementList(node.body);
            return this.code;
        } else {
            throw new Error("Unsupported AST node type: " + node.type);
        }
    }

    StatementList(body) {
        body.map(statement => this.ExpressionStatement(statement));
    }

    Statement(node) {
        switch (node.type) {
            case ';':
                return this.EmptyStatement();
            case '{':
                return this.BlockStatement();
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
            default:
                return this.ExpressionStatement();
        }
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
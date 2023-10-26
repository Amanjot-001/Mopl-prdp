class Generator {
    constructor() {
        this.code = '';
    }

    generate(node) {
        if (node.type === "Program") {
            this.ExpressionStatement(node.body);
            return this.code;
        } else {
            throw new Error("Unsupported AST node type: " + node.type);
        }
    }

    ExpressionStatement(node) {
        return this.Expression(node[0].expression);
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
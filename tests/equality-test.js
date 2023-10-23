module.exports = test => {
    test(`x + 5 > 10 == true;`, {
        type: "Program",
        body: [
            {
                type: "ExpressionStatement",
                expression: {
                    type: "BinaryExpression",
                    operator: "==",
                    left: {
                        type: "BinaryExpression",
                        operator: ">",
                        left: {
                            type: "BinaryExpression",
                            operator: "+",
                            left: {
                                type: "Identifier",
                                name: "x"
                            },
                            right: {
                                type: "NumericLiteral",
                                value: 5
                            }
                        },
                        right: {
                            type: "NumericLiteral",
                            value: 10
                        }
                    },
                    right: {
                        type: "BooleanLiteral",
                        value: true
                    }
                }
            }
        ]
    })

    test(`x + 5 > 10 == false;`, {
        type: "Program",
        body: [
            {
                type: "ExpressionStatement",
                expression: {
                    type: "BinaryExpression",
                    operator: "==",
                    left: {
                        type: "BinaryExpression",
                        operator: ">",
                        left: {
                            type: "BinaryExpression",
                            operator: "+",
                            left: {
                                type: "Identifier",
                                name: "x"
                            },
                            right: {
                                type: "NumericLiteral",
                                value: 5
                            }
                        },
                        right: {
                            type: "NumericLiteral",
                            value: 10
                        }
                    },
                    right: {
                        type: "BooleanLiteral",
                        value: false
                    }
                }
            }
        ]
    })
}
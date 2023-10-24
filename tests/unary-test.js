module.exports = test => {
    test(`-x;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UnaryExpression',
                    operator: '-',
                    argument: {
                        type: 'Identifier',
                        name: 'x'
                    }
                }
            }
        ]
    })

    test(`!x;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UnaryExpression',
                    operator: '!',
                    argument: {
                        type: 'Identifier',
                        name: 'x'
                    }
                }
            }
        ]
    })

    test(`-x * +10;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'UnaryExpression',
                        operator: '-',
                        argument: {
                            type: 'Identifier',
                            name: 'x'
                        }
                    },
                    right: {
                        type: 'UnaryExpression',
                        operator: '+',
                        argument: {
                            type: 'NumericLiteral',
                            name: 10
                        }
                    }
                }
            }
        ]
    })
}
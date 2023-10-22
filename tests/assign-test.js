module.exports = test => {
    test(`x = 23;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 23
                    }
                }
            }
        ]
    })
}
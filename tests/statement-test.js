module.exports = test => {
    test(`
    
    23; 
    "hello";
    `, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'NumericLiteral',
                    value: 23
                }
            },
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }
        ]
    })
}
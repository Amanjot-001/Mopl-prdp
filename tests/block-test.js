module.exports = test => {
    test(`
    {
        23;
        "hello";
    }`, {
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
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
            }
        ]
    })


    // empty block
    test(`
    {
    }`, {
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: []
            }
        ]
    })

    // nested block
    test(`
    {
        23;
        {
            "hello";
        }
    }`, {
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'NumericLiteral',
                            value: 23
                        }
                    },
                    {
                        type: 'BlockStatement',
                        body: [
                            {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'StringLiteral',
                                    value: 'hello'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    })
}
module.exports = test => {
    test(`
    def square(x) {
        return x*x;
    }
    `, {
        type: 'Program',
        body: [
            {
                type: 'FunctionDeclaration',
                name: {
                    type: 'Identifier',
                    name: 'sqaure'
                },
                params: [
                    {
                        type: 'Identifier',
                        name: 'x'
                    }
                ],
                body: {
                    type: 'BlockStatement',
                    body: [
                        {
                            type: 'ReturnStatement',
                            argument: {
                                type: 'BinaryExpression',
                                operator: '*',
                                left: {
                                    type: 'Identifier',
                                    name: 'x'
                                },
                                right: {
                                    type: 'identifier',
                                    name: 'x'
                                }
                            }
                        },
                    ],
                }
            }
        ]
    })
}
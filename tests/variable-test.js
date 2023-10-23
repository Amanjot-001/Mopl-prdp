module.exports = test => {
    test(`let x = 23;`, {
        type: 'Program',
        body: [
            {
                type: 'VariableStatement',
                declarations: [
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        init: {
                            type: 'NumericLiteral',
                            value: 23
                        }
                    }
                ]
            }
        ]
    })

    test(`let x;`, {
        type: 'Program',
        body: [
            {
                type: 'VariableStatement',
                declarations: [
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        init: null
                    }
                ]
            }
        ]
    })

    test(`let x, y;`, {
        type: 'Program',
        body: [
            {
                type: 'VariableStatement',
                declarations: [
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        init: null
                    },
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'y'
                        },
                        init: null
                    }
                ]
            }
        ]
    })

    test(`let x, y = 23;`, {
        type: 'Program',
        body: [
            {
                type: 'VariableStatement',
                declarations: [
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        init: null
                    },
                    {
                        type: 'VariableDeclaration',
                        id: {
                            type: 'Identifier',
                            name: 'y'
                        },
                        init: {
                            type: 'NumericLiteral',
                            value: 23
                        }
                    }
                ]
            }
        ]
    })
}
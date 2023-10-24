module.exports = test => {
    test(
        `
      while (x > 10) {
        x -= 1;
      };
  
      `,
        {
            type: 'Program',
            body: [
                {
                    type: 'WhileStatement',
                    test: {
                        type: 'BinaryExpression',
                        operator: '>',
                        left: {
                            type: 'Identifier',
                            name: 'x',
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 10,
                        },
                    },
                    body: {
                        type: 'BlockStatement',
                        body: [
                            {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'AssignmentExpression',
                                    operator: '-=',
                                    left: {
                                        type: 'Identifier',
                                        name: 'x',
                                    },
                                    right: {
                                        type: 'NumericLiteral',
                                        value: 1,
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        },
    );

    test(
        `
        do {
            x -= 1;
        } while(x > 10);
  
      `,
        {
            type: 'Program',
            body: [
                {
                    type: 'DoWhileStatement',
                    body: {
                        type: 'BlockStatement',
                        body: [
                            {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'AssignmentExpression',
                                    operator: '-=',
                                    left: {
                                        type: 'Identifier',
                                        name: 'x',
                                    },
                                    right: {
                                        type: 'NumericLiteral',
                                        value: 1,
                                    },
                                },
                            },
                        ],
                    },
                    test: {
                        type: 'BinaryExpression',
                        operator: '>',
                        left: {
                            type: 'Identifier',
                            name: 'x',
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 10,
                        },
                    },
                },
            ],
        },
    );

    test(
        `
        for (let i = 0; i < 10; i += 1) {
          x += i;
        }
    
        `,
        {
            type: 'Program',
            body: [
                {
                    type: 'ForStatement',
                    init: {
                        type: 'VariableStatement',
                        declarations: [
                            {
                                type: 'VariableDeclaration',
                                id: {
                                    type: 'Identifier',
                                    name: 'i',
                                },
                                init: {
                                    type: 'NumericLiteral',
                                    value: 0,
                                },
                            },
                        ],
                    },
                    test: {
                        type: 'BinaryExpression',
                        operator: '<',
                        left: {
                            type: 'Identifier',
                            name: 'i',
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 10,
                        },
                    },
                    update: {
                        type: 'AssignmentExpression',
                        left: {
                            type: 'Identifier',
                            name: 'i',
                        },
                        operator: '+=',
                        right: {
                            type: 'NumericLiteral',
                            value: 1,
                        },
                    },
                    body: {
                        type: 'BlockStatement',
                        body: [
                            {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'AssignmentExpression',
                                    left: {
                                        type: 'Identifier',
                                        name: 'x',
                                    },
                                    operator: '+=',
                                    right: {
                                        type: 'Identifier',
                                        name: 'i',
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        },
    );

    test(
        `
        for (;;) {
    
        }
    
        `,
        {
            type: 'Program',
            body: [
                {
                    type: 'ForStatement',
                    init: null,
                    test: null,
                    update: null,
                    body: {
                        type: 'BlockStatement',
                        body: [],
                    },
                },
            ],
        },
    );
};
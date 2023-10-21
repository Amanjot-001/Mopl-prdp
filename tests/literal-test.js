module.exports = test => {
    test('23;', {
        type: "Program",
        body:[
            {
                type: 'ExpressionStatement',
                expression: {
                    type: "NumericLiteral",
                    value: 23
                }
            }
        ]   
    });

    test('"hello";', {
        type: "Program",
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }
        ]
    });

    test("'hello';", {
        type: "Program",
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }
        ]
    });
}
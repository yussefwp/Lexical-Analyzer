/*
  # Task 2.1: Implement a Lexer (15 points)
  A lexer turns the input string into a list of tokens. A token looks the following way in javascript:
{
"type": Symbol("Operator"), "value: "-"
}
```
For example, `lex` will turn the following expression:
```
mul 6 sub 4 sum 7 3 4
To the following array:
["mul", "6", "sub", "4", "sum", "7", "3", "4"]
Implement your Lexer based on the above description.
  ```
*/
const lex = str => str.split(' ').map(s => s.trim()).filter(s => s.length);

/*
  # Task 2.2: Implement a Parser (15 points)
A parser turns the list of tokens into an Abstract Syntax Tree (AST). Visually, the parsing is a process which turns the array:
const tokens = ["sub", "3", "sum", "2", "4”, "5"];
to the following tree: sub
/\
3 sum 
   /|\
  2 4 5
  Below is the grammar that is used to parse the input token
num := 0-9+
op := sum | sub | div | mul expr := num | op expr+
This translated to plain English, means:
- `num` can be any sequence of the numbers between 0 and 9.
- `op` can be any of `sum`, `sub`, `div`, `mul`.
- `expr` can be either a number (i.e. `num`) or an operation followed by one or more
 `expr`s. Notice: ‘expr` has a recursive declaration.
*/

const Op = Symbol('op');
const Num = Symbol('num');

const parse = tokens => {

  let c = 0;

  const peek = () => tokens[c];
  const consume = () => tokens[c++];

  const parseNum = () => ({ val: parseInt(consume()), type: Num });

  const parseOp = () => {
    const node = { val: consume(), type: Op, expr: [] };
    while (peek()) node.expr.push(parseExpr());
    return node;
  };

  const parseExpr = () => /\d/.test(peek()) ? parseNum() : parseOp();

  return parseExpr();
};

/*
  # Task 2.3: Implement a Evaluator (5 points)
The evaluator visit each node from the tree with pre-order traversal and perform either of the following:
-Return the corresponding value, if the node is number type.
-Perform the corresponding arithmetic operation, if it is an operation node.
*/
const evaluate = ast => {
  const opAcMap = {
    sum: args => args.reduce((a, b) => a + b, 0),
    sub: args => args.reduce((a, b) => a - b),
    div: args => args.reduce((a, b) => a / b),
    mul: args => args.reduce((a, b) => a * b, 1)
  };

  if (ast.type === Num) return ast.val;
  return opAcMap[ast.val](ast.expr.map(evaluate));
};

/*
  # Task 2.4 Implement a code generator (5 points)
A code generator can translate the input to another language.
*/
const compile = ast => {
  const opMap = { sum: '+', mul: '*', sub: '-', div: '/' };
  const compileNum = ast => ast.val;
  const compileOp = ast => `(${ast.expr.map(compile).join(' ' + opMap[ast.val] + ' ')})`;
  const compile = ast => ast.type === Num ? compileNum(ast) : compileOp(ast);
  return compile(ast);
};

var program = prompt("Please enter your input. Example : ", "mul 3 sub 2 sum 1 3 4");



//const program = 'mul 3 sub 2 sum 1 3 4';

/*
  # Task 2.5 Implement an interpreter (5 points)
An interpreter an interpreter is a computer program that directly executes,
 i.e. performs, instructions written in a programming or scripting language,
  without requiring them previously to have been compiled into a machine language program.
*/
function eval(){
    var s = evaluate(parse(lex(program)));
    return s;
}


/*
  # Task 2.6 Implement a compiler (5 points)
A compiler is a program that converts instructions into a machine-code or lower-level form so 
that they can be read and executed by a computer.
Implement the program using a html page as the UI. It contains one text box for input,
 and a “compile” button. Once the “compile” button is pressed, 
the result should be shown in the console.
*/
function comp(){
    var st = compile(parse(lex(program)));
    return st;
}

'use strict'
let store = [];
let newStore = [];
let result = [];


//add next element
const addNextElement = function (event) {
  const input = document.getElementById('inputBox');
  let presentElement = event.target.textContent;
  if (presentElement !== '+' && presentElement !== '-' && presentElement !== '*' && presentElement !== '/' && presentElement !== '%' && presentElement !== '(' && presentElement !== ')') {
    presentElement = parseInt(presentElement);
  }

  if (typeof store[store.length - 1] === 'number' && typeof presentElement === 'number') {
    store[store.length - 1] += presentElement.toString();
    store[store.length - 1] = parseInt(store[store.length - 1]);
  } else if (typeof store[store.length - 1] === 'number' && presentElement === '(' || store[store.length - 1] === ')' && presentElement === '(') {
    store.push('*');
    store.push(presentElement);
  } else if (typeof store[store.length - 1] === 'string' && typeof presentElement === 'string') {
    if ((store[store.length - 1] === '*' && presentElement === '-') || (store[store.length - 1] === '/' && presentElement === '-') || (store[store.length - 1] === ')' && presentElement === '-') || presentElement === '(' || presentElement === ')') {
      store.push(presentElement);
    } else if (typeof store[store.length - 2] === 'string') {
      store.pop();
      store.pop();
      store.push(presentElement);
    } else {
      store[store.length - 1] = presentElement;
    }
  } else {
    store.push(presentElement);
  }
  input.value = store.join(' ');
};

//check precedence via function
const checkPrecedence = function (operator) {
  if (operator === '*' || operator === '/' || operator === '%') {
    return 2;
  } else if (operator === '+' || operator === '-') {
    return 1;
  } else {
    return 0;
  }
};



const getAnswer = function () {
  const input = document.getElementById('inputBox');
  //remove extra operators 
  let start = 0;
  let end = store.length - 1;
  while (store[start] !== '-' && store[start] !== '(' && typeof store[start] === 'string') {
    start++;
  }
  while (typeof store[end] === 'string' && store[end] !== ')') {
    end--;
  }
  for (let index = start; index <= end; index++) {
    newStore[index] = store[index];
  }

  let postfix = [];
  let stack = [];
  //perform operation on numbers
  //1--> convert to postfix notation
  for (let index = 0; index < newStore.length; index++) {
    let element = newStore[index];
    if (typeof element === 'string') {
      if (element === '(') {
        stack.push(element);
      } else if (element === ')') {
        while (stack[stack.length - 1] !== '(') {
          postfix.push(stack.pop());
        }
        stack.pop();
      } else {
        while (checkPrecedence(stack[stack.length - 1]) >= checkPrecedence(element)) {
          let remove = stack.pop();
          postfix.push(remove);
        }
        stack.push(element);
      }
    } else {
      postfix.push(element);
    }
  }
  while (stack.length > 0) {
    postfix.push(stack.pop());
  }

  //2--> calculation
  let operand1, operand2;
  result = [];
  for (let index = 0; index < postfix.length; index++) {
    let current = postfix[index];
    switch (current) {
      case '+':
        operand2 = result.pop();
        operand1 = result.pop();
        result.push(operand1 + operand2);
        break;
      case '-':
        operand2 = result.pop();
        operand1 = result.pop();
        result.push(operand1 - operand2);
        break;
      case '*':
        operand2 = result.pop();
        operand1 = result.pop();
        result.push(operand1 * operand2);
        break;
      case '/':
        operand2 = result.pop();
        operand1 = result.pop();
        result.push(operand1 / operand2);
        break;
      case '%':
        operand2 = result.pop();
        operand1 = result.pop();
        result.push(operand1 % operand2);
        break;
      default:
        result.push(current);
    }
  }
  input.value = result.join(' ');
  store = result;
};

const clearContent = function () {
  const input = document.getElementById('inputBox');
  input.value = '';
  result = [];
  store = [];
  newStore = [];
};

const removeOneLast = function () {
  const input = document.getElementById('inputBox');
  store.pop();
  input.value = store.join(' ');
};

window.onload = function () {
  const keys = document.querySelectorAll('.key');
  const resultElement = document.getElementById('result');
  const clear = document.getElementById('clear');
  const backspace = document.getElementById('backspace');

  keys.forEach(function (key) {
    key.addEventListener('click', addNextElement);
  });

  resultElement.addEventListener('click', getAnswer);
  clear.addEventListener('click', clearContent);
  backspace.addEventListener('click', removeOneLast);
};

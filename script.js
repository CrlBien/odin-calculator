const secondText = document.querySelector("#mini-text");
const mainText = document.querySelector("#large-text");
const mainDisplay = document.querySelector("#large-screen");
const squareBtn = document.querySelector("#square");
const clearEntryBtn = document.querySelector("#clear-entry");
const clearAllBtn = document.querySelector("#clear-all");
const backspaceBtn = document.querySelector("#backspace");
const dotBtn = document.querySelector("#dot-btn");
const numberBtn = document.querySelectorAll(".number-btn");
const operatorBtn = document.querySelectorAll(".operator-btn");
const equalBtn = document.querySelector("#equal");
const opMap = {
    "+": "plus",
    "-": "minus",
    "*": "multiply",
    "/": "divide"
};

/* I use the currNum to temporary hold the number being inputted until there's an operator pressed */ 
let currNum = "",
 firstNum = "",
 secondNum = "", 
 currOperator = null, 
 result = "";

clearEntryBtn.addEventListener('click', clearCurrEntry);
clearAllBtn.addEventListener('click', clearEntireScreen);
backspaceBtn.addEventListener('click', backspace);
dotBtn.addEventListener('click', addDecimalPoint);
equalBtn.addEventListener("click", calculateResult);

numberBtn.forEach(btn => {
    btn.addEventListener('click', () => handleNumberInput(btn));
});

operatorBtn.forEach(btn => {
  if (btn.id === 'equal') return;
  btn.addEventListener('click', () => handleOperationInput(btn));
});

document.addEventListener("keydown", (e) => handleKeyboardInput(e));

//reset the display by making the content of the main display into 0 and reset also the currNum
function clearCurrEntry() {
    mainText.textContent = '0';
    currNum = "";
}

//run the clearCurrEntry() to reset the main display and then reset also all global variables
function clearEntireScreen() {
    clearCurrEntry();
    secondText.textContent = "";
    firstNum = "";
    secondNum = ""; 
    currOperator = null;
    result = "";
}

//adding decimal point by checking if there's already a dot in currNum, if none then add the dot
function addDecimalPoint() {
    if (!currNum.includes(".")) {
        currNum = currNum === "" ? "0." : currNum + ".";
        mainText.textContent = currNum;
    }
}

//slice the last character in the text, if length of text is 1, then make the text "0" 
function backspace() {
    if (mainText.textContent.length != 1) {
        mainText.textContent = mainText.textContent.slice(0, -1);
    } else {
        mainText.textContent = '0';
    }
    currNum = mainText.textContent;
}

/* add the number inputted to the display, if inputted value is zero
and the current text is also zero then do nothing, else append the number to the display */
function handleNumberInput(button) {
    const value = button.textContent;
    if (currNum === "0" && value === "0") {
        return;
    }

    if (currNum === "0" && value !== "0") {
        currNum = value;
    }  else {
        currNum += value;
    }
    mainText.textContent = currNum;
    mainDisplay.scrollLeft = mainDisplay.scrollWidth;
}

/* deals with operator clicks (+, -, ×, ÷, square) if it's square, calculate right 
away otherwise, save numbers or run the current operation by calling operate(),
then show results. It handles chain expression*/
function handleOperationInput(button) {
  const op = button.id;

  mainText.textContent = '0';

  if (firstNum === "" && currNum === "") return;

  if (op === 'square') {
    const target = currNum !== "" ? currNum : firstNum;
    if (target === "") return;

    const squared = operate(target, null, 'square');

    mainText.textContent = squared;
    secondText.textContent = `sqr(${target}) =`;
    currNum = "";
    firstNum = squared.toString();
    currOperator = null; 
    result = squared.toString();
    return;
  }

  if (firstNum !== "" && currOperator && currNum !== "") {
    secondNum = currNum;
    result = operate(firstNum, secondNum, currOperator);
    firstNum = result.toString();
    mainText.textContent = result;
    currNum = "";
  } else if (currNum !== "") {
    firstNum = currNum;
    currNum = "";
  }

  currOperator = op;
  secondText.textContent = firstNum + " " + getOperatorSymbol(currOperator);
}

//get the key pressed, map the keys to their responding function
function handleKeyboardInput(e){
  const key = e.key;

  if (key >= "0" && key <= "9") {
    handleNumberInput({ textContent: key });
    return;
  }

  if (key === ".") {
    addDecimalPoint();
    return;
  }

  if (opMap[key]) {
    handleOperationInput({ id: opMap[key] });
    return;
  }

  if (key === "=" || key === "Enter") {
    calculateResult();
    return;
  }
  
  if (key === "Backspace") {
    backspace();
  }
}

/* perform the calculation to the two numbers by calling operate(). it runs when "=" is pressed. 
Display the final expression in the second display. */
function calculateResult() {
    if (firstNum !== "" && currOperator && currNum !== "") {
        secondNum = currNum;
        result = operate(firstNum, secondNum, currOperator);

        mainText.textContent = result;

        secondText.textContent = `${firstNum} ${getOperatorSymbol(currOperator)} ${secondNum} =`;

        firstNum = result.toString();
        currNum = "";
        currOperator = null;
    }
}

//return the symbol to be display based on the operator button pressed.
function getOperatorSymbol(op) {
    switch(op) {
        case "plus": return "+";
        case "minus": return "-";
        case "multiply": return "×";
        case "divide": return "÷";
        default: return "";
    }
}

/* takes the two numbers and the current operator. Perform the calculation based on the current
operator and then return the answer. return "Invalid" when trying to divide by zero*/
function operate(a, b, operator) {
  const x = parseFloat(a);
  const y = (b !== null && b !== undefined) ? parseFloat(b) : null;

  switch (operator) {
    case "plus":     return x + y;
    case "minus":    return x - y;
    case "multiply": return x * y;
    case "divide":   return y === 0 ? "Invalid" : x / y;
    case "square":   return x * x;
    default:         return x;
  }
}



// screen elements
const lowerDisplayText = document.querySelector('#lower-numbers');
const upperDisplayText = document.querySelector('#upper-numbers');

// button elements
const allButtons = document.querySelectorAll('.btn');

// variables for calculations
let currentEquation = ''; // Stores full operation string (e.g., "5+3x2")
let currentResult = '';   // Final calculation result
let isNewCalculation = true;

// default values for display
lowerDisplayText.innerHTML = '0';
upperDisplayText.innerText = currentEquation;

function add (num1, num2){
    return num1 + num2;
}

function substract (num1, num2){
    return num1 - num2;
}

function multiply (num1, num2){
    return num1 * num2;
}

function divide (num1, num2){
    if (num2 === 0){
        return 'OOPS';
    }
    return num1 / num2;
}

allButtons.forEach(button => {
    button.addEventListener('click', () => {
      if(button.classList.contains('number')){
        handleNumber(button.textContent);
      } else if (button.classList.contains('operator')){
        handleOperator(button.textContent);
      } else if (button.id === 'equal-btn'){
        handleEquals();
      } else if (button.id === 'ac-btn'){
        clear();
      } else if (button.classList.contains('decimal')){
        handleDecimal();
      } else if (button.id === 'erase-btn'){
        handleErase();
      }
    });
  });


  function handleDecimal() {
    const numbers = currentEquation.split(/[\+\-\x\÷]/g);
    const currentNumber = numbers[numbers.length - 1];
  
    if (!currentNumber.includes('.')) {
      currentEquation += currentNumber === '' ? '0.' : '.';
      updateLowerDisplay();
    }
  }

  function handleNumber(num) {
    if (isNewCalculation) {
        currentEquation = '';
        isNewCalculation = false;
      }

    const parts = currentEquation.split(/[\+\-\x\÷]/g);
    const currentNumber = parts[parts.length - 1];
  
    // Prevent leading zeros
    if (currentNumber === '0' && num !== '.') {
      currentEquation = currentEquation.slice(0, -1) + num;
    } else {
      currentEquation += num;
    }
  
    updateLowerDisplay();
  }
  

  function handleOperator(op) {
    const lastChar = currentEquation.slice(-1);
  
    // Prevent invalid operator placement
    if (['+', '-', 'x', '÷'].includes(lastChar)) return;
    if (currentEquation === '') return;
  
    currentEquation += op;
    isNewCalculation = false;
    updateLowerDisplay();
  }


  function updateLowerDisplay() {
    const maxLength = 9; // Reduce from 10 to 9
    const baseSize = 48;
    const minSize = 24;
    
    // Add right padding compensation
    const containerWidth = document.getElementById('screen').offsetWidth - 30;
    
    lowerDisplayText.textContent = currentEquation || '0';
    
    // Calculate required size
    let newSize = baseSize;
    const length = currentEquation.length;
    
    if (length > maxLength) {
      // More aggressive scaling
      newSize = Math.max(minSize, baseSize - (length - maxLength) * 4);
    }
    
    // Ensure text fits within container
    lowerDisplayText.style.fontSize = `${newSize}px`;
    lowerDisplayText.style.transform = `translateX(${Math.min(0, containerWidth - lowerDisplayText.scrollWidth)}px)`;
  }
  

  function handleEquals() {
    try {
      const tokens = currentEquation.match(/(\d+\.?\d*)|[\+\-\x\÷]/g) || [];
      
      if (tokens.length < 3) return;
  
      let result = parseFloat(tokens[0]);
      
      // Process operations left-to-right
      for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNum = parseFloat(tokens[i+1]);
        
        result = operate(result, nextNum, operator);
        if (result === 'Error') break;
      }
  
      // Update displays
      upperDisplayText.textContent = `${currentEquation}=`;
      lowerDisplayText.textContent = result;
      
      // Reset state
      currentEquation = result.toString();
      isNewCalculation = true;
  
    } catch {
      handleError();
    }
  }
    

  function operate(a, b, op) {
    switch(op) {
      case '+': return a + b;
      case '-': return a - b;
      case 'x': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return 'Error';
    }
  }

  function clear() {
    currentEquation = '';
    upperDisplayText.textContent = '';
    lowerDisplayText.textContent = '0';
    isNewCalculation = true;
  }

  function handleErase(){
    currentEquation = currentEquation.slice(0, -1);
    
    // Reset to 0 if empty
    if (currentEquation === '') {
      currentEquation = '0';
      isNewCalculation = true;
    }
    
    // Remove leading zero after operator
    const lastOperatorIndex = Math.max(
      currentEquation.lastIndexOf('+'),
      currentEquation.lastIndexOf('-'),
      currentEquation.lastIndexOf('x'),
      currentEquation.lastIndexOf('÷')
    );
    
    if (lastOperatorIndex === currentEquation.length - 1) {
      currentEquation = currentEquation.slice(0, -1);
    }
    
    updateLowerDisplay();
  }

  
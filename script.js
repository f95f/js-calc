class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.previousOperation = undefined;
    }

    delete(){
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number){
        const currentNumber = this.currentOperand.toString();
        if(number === ','){
            if(currentNumber.includes('.')) return;
            number = '.';
        }
        if(number === '-'){
            if(currentNumber.includes('-')) return;
            number = '-';
        }
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    setNegativeValue(){
        if(this.previousOperand){
            if(this.currentOperand !== '' && this.currentOperand !== '-') return;
            if(this.previousOperation === undefined){
                this.currentOperand = '';
                this.previousOperation = this.operation;
                this.operation = '-';
            }
            else{
                this.currentOperand = '-';
                this.operation = this.previousOperation;
                this.previousOperation = undefined;
            }
            this.updateDisplay();
        }
        if(!this.currentOperand && !this.previousOperand){
            this.appendNumber('-');
            this.updateDisplay();
            return;
        }
    }

    chooseOperation(operation){
        operation === '-' ? this.setNegativeValue() : this.previousOperation = undefined;
        
        if(!this.currentOperand && !this.previousOperand || this.currentOperand === '-') return;
        if(this.previousOperand && this.currentOperand) this.compute();
        if(this.currentOperand) { this.previousOperand = this.currentOperand; }

        this.operation = operation;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute(){
        let result;
        const operand1 = parseFloat(this.previousOperand);
        const operand2 = parseFloat(this.currentOperand);

        if(isNaN(operand1) || isNaN(operand2)) return;
        switch (this.operation){
            case '+':
                result = operand1 + operand2;
                break;
            case '-':
                result = operand1 - operand2;
                break;
            case '×':
                result = operand1 * operand2;
                break;
            case '÷':
                result = operand1 / operand2;
                break;
            default: return;
        }
        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number){
        if(number === '-') return number.toString();
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if(isNaN(integerDigits)){
            integerDisplay = '';
        }
        else{
            integerDisplay = integerDigits.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
        }

        if(decimalDigits != null){
            return `${integerDisplay},${decimalDigits}`;
        }
        else{
            return integerDisplay;
        }
    }

    updateDisplay(){
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if(this.operation){
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        }
        else{
            this.previousOperandTextElement.innerText = '';
        }   
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);  

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
});
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    })
});
equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});
allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});
deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});
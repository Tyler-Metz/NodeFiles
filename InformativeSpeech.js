// Procedural

var four = 4;
var two = 2;
var result = four * two


console.log('Variable four:', four, 'Variable two:', two, 'Variable result:', result);
// Variable four: 4 Variable two: 2 Variable result: 8

// Object-Oriented

class number {

    constructor(number1, number2) {
        this.number1 = number1;
        this.number2 = number2;
    }

    getResult(){
        return this.number1 * this.number2
    }

}

var makeResult = new number(2, 4);

console.log(makeResult.getResult())
// 8 

// Functional

function multiplyTwoNumbers(numberOne, numberTwo) {
    return numberOne * numberTwo
}


console.log(multiplyTwoNumbers(2, 4));
// 8
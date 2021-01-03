// nasty bug, jump over a piece and if theres an enemy piece directly in front of you after jumping a piece, the piece you just jumped wont disappear. PLEASE FIX

document.addEventListener('readystatechange', () => console.log('DOM state', document.readyState));

// Global Flags
var checkerboardFlags = {
    colorFlag: null,
    colorAiFlag: null,
    html: '',
    cell: 0,
    cells: 31,
    row: 0,
    slots: [],
    tempArr: [],
    tempJumpArr: [],
    clickCounter: 0,
    firstClickDiv: null,
    firstClickTd: null,
    firstClickRow: null,
    playerTurn: null,
    aiTurn: false,
    misClick: true,
    childrenToRemove: [],
    predeterminedChildrenToRemove: [],
    childrenToKeep: [],
    playerChildrenToKeep: [],
    playerChainJump: null,
    playerPreviousChainJump: null,
    checkAllJumps: false,
    checkChainJumps: false,
    predeterminedChainJumps: false,
    keepJumps: [],
}

// Assign who goes first
function whoGoesFirst() {
    if (checkerboardFlags.colorFlag == 'black') {
        console.log('You control black so you go first!')
        checkerboardFlags.playerTurn = true;
        checkerboardFlags.colorAiFlag = 'red';
    }
    else {
        console.log('You control red so Ai goes first!')
        checkerboardFlags.playerTurn = false; 
        checkerboardFlags.colorAiFlag = 'black'
        setTimeout(checkAllJumps());
    }
}

// Decide what color player and AI start off as (true = player is black | false = player is red | black goes first)
function whatColor() {
    checkerboardFlags.colorFlag = Math.random() >= 0.5
    if (checkerboardFlags.colorFlag) checkerboardFlags.colorFlag = 'black'
    else checkerboardFlags.colorFlag = 'red'
    return checkerboardFlags.colorFlag
}

makeBoard();
// Makes a static board
function makeBoard() {
    var html = checkerboardFlags.html
    var cell = checkerboardFlags.cell
    var cells = checkerboardFlags.cells
    var row = checkerboardFlags.row
    var slots = checkerboardFlags.slots

    html += '<tr id="row' + row + '">'
    for (cell; cell <= cells; cell++) {
        
        slots.push(makeGameState(cell)); console.log('pushed ', cell, 'to ', slots[cell])

        if (count) { // odd rows
            if (row == 5 || row == 7) { 
                html += '<td id="cell' + cell + '" class="container"><div id="div' + cell + '" class="red"></div></td><td></td>' // red
            } else if (row == 1) {      
                html += '<td id="cell' + cell + '" class="container"><div id="div' + cell + '" class="black"></div></td><td></td>' // black
            } else if (row == 3) {
                html += '<td id="cell' + cell + '" class="container"></td><td></td>'
            }
            
        }

        if (!count) { // even rows
            if (row == 0 || row == 2) {
                html += '<td></td><td id="cell' + cell + '" class="container"><div id="div' + cell + '" class="black"></div>' // black
            } else if (row == 6) {
                html += '<td></td><td id="cell' + cell + '" class="container"><div id="div' + cell + '" class="red"></div></td>' // red
            } else if (row == 4) {
                html += '<td></td><td id="cell' + cell + '" class="container"></td>'
            }
            
        }

        if (cell == 31) {
            html += '</tr>'
        }
            
        if (cell != 31 && cell % 4 == 3) {
            console.log(count)
            var count = !count
            row += 1
            html += '</tr>'
            html += '<tr id="row' + row + '">'
        }

    }

    function makeGameState(slot) {
        if (slot <= 11) return 'black'
        else if (11 <= slot && slot <= 19) return false;
        else if (20 <= slot) return 'red'
        else return false;
    }

    console.info(html);
    document.getElementById("checkerBoard").innerHTML = html
    console.info('gamestate array made', slots);

} 
var allContainers = document.querySelectorAll('.container');
var allBlack = document.querySelectorAll('.black')
var allRed = document.querySelectorAll('.red')
console.log(allContainers)
var table = document.getElementById("checkerBoard-wrap");
appendAttributeDataValue();
logAttributeDataValue();

// Appends boolean value to divs at start of game
function appendAttributeDataValue() {
    for (num = 0; num <= 31; num++) {
        if (checkerboardFlags.slots[num]) {
            allContainers[num].setAttribute("data-boolean", "true")
            
        } else { allContainers[num].setAttribute("data-boolean", "false") }
    }
}

// Function for correlating array to DOM elements and logs to console
function logAttributeDataValue() {
    var slots = checkerboardFlags.slots
    for (var num = 0; num <= 31; num++) {
        console.log([num], 'domstatearray ', allContainers[num]);
        console.log([num], 'gamestatearray ', slots[num]); 
    }
}

// Function for updating gamestate array values + new king system (12/28/2020)
function updateGamestateValue(node, color) {
    var slicedNode = +node.id.slice(4)
    var redKingSpots = [0, 1, 2, 3]
    var blackKingSpots = [28, 29, 30, 31]

    if (color == 'red') {
        checkerboardFlags.slots[slicedNode] = 'red'
        console.log('Changed cell', slicedNode, ' to ', checkerboardFlags.slots[slicedNode]);
        if (redKingSpots.includes(slicedNode) && !node.firstChild.firstChild) {
            var kingDiv = document.createElement('Div');
            node.firstChild.appendChild(kingDiv);
            kingDiv.style.background = 'linear-gradient(45deg, rgb(235, 0, 0), rgb(90, 0, 0))';
            kingDiv.style.width = '8rem';
            kingDiv.style.height = '8rem';
            kingDiv.style.borderRadius = '50%';
            kingDiv.style.position = 'relative';
            kingDiv.style.border = '0.3rem solid silver';
            kingDiv.style.bottom = '0.9rem'
            kingDiv.style.right = '0.3rem';
            kingDiv.style.boxShadow = '0.6rem 0.6rem 0.6rem rgb(0, 0, 0)';
        }
    } else if (color == 'black') {
        checkerboardFlags.slots[slicedNode] = 'black'
        console.log('Changed cell', slicedNode, ' to ', checkerboardFlags.slots[slicedNode]);
        if (blackKingSpots.includes(slicedNode) && !node.firstChild.firstChild) {
            var kingDiv = document.createElement('Div');
            node.firstChild.appendChild(kingDiv);
            kingDiv.style.background = 'linear-gradient(45deg, rgb(20, 20, 20), rgb(90, 90, 90))';
            kingDiv.style.width = '8rem';
            kingDiv.style.height = '8rem';
            kingDiv.style.borderRadius = '50%';
            kingDiv.style.position = 'relative';
            kingDiv.style.border = '0.3rem solid silver';
            kingDiv.style.bottom = '0.9rem'
            kingDiv.style.right = '0.3rem';
            kingDiv.style.boxShadow = '0.6rem 0.6rem 0.6rem rgb(0, 0, 0)';
        }
    } else {
        checkerboardFlags.slots[slicedNode] = false;
        console.log('Changed cell', slicedNode, ' to ', checkerboardFlags.slots[slicedNode])
    }
}

// Child Check 
function childCheck(child, element) {
    if (child && checkerboardFlags.clickCounter == 0 || child && checkerboardFlags.clickCounter == 1) {
        if (child.getAttribute("class") == "red") {
            if (checkerboardFlags.colorFlag !== 'red') {
                console.log('You are not red silly! Click a black chip you want to move!')
                if (!checkerboardFlags.clickCounter === 1) checkerboardFlags.misClick = false;
            } else {
                checkerboardFlags.misClick = true; console.log('Correct! You are red!')
                checkerboardFlags.clickCounter = 0;
                if (checkerboardFlags.firstClickDiv) checkerboardFlags.firstClickDiv.style.boxShadow = '';
                checkBoolean(element)
                child.style.boxShadow = '0rem 0rem 3rem 1rem rgb(255, 255, 0)';
            }

        }
        if (child.getAttribute("class") == "black") {
            if (checkerboardFlags.colorFlag !== 'black') {
                console.log('You are not black silly! Click a red chip you want to move!')
                if (!checkerboardFlags.clickCounter === 1) checkerboardFlags.misClick = false;
            } else {
                checkerboardFlags.misClick = true; console.log('Correct! You are black!')
                checkerboardFlags.clickCounter = 0;
                if (checkerboardFlags.firstClickDiv) checkerboardFlags.firstClickDiv.style.boxShadow = '';
                checkBoolean(element)
                child.style.boxShadow = '0rem 0rem 3rem 1rem rgb(255, 255, 0)';
            }
        }
    } else if (checkerboardFlags.clickCounter == 2 && checkerboardFlags.tempJumpArr.includes(+element.id.slice(4))) {

        console.log('its a match... congratz')
        /* checkerboardFlags.misClick = true; */
        checkMovement(element)

    } else { console.log('No children present or already clicked a chip'); checkBoolean(element) }
} 

// Check if cell has data-boolean attribute
function checkBoolean(element) {
    var misClick = checkerboardFlags.misClick
    if (misClick && checkerboardFlags.clickCounter == 1) checkMovement(element)
    else if (misClick && checkerboardFlags.clickCounter == 0 && element.getAttribute("data-boolean") === "true") {
        console.log('Chip is valid')
        checkerboardFlags.clickCounter = 1;
        checkerboardFlags.firstClickDiv = element.firstChild
        checkerboardFlags.firstClickTd = element
        checkerboardFlags.firstClickRow = element.parentElement
    }
    else {
        console.log('Chip is not valid')

    }
}

// Limits movement control
function checkMovement(element, aitd1check, airow1check) {
    // Movement rules
    var evenNums = [-4, -3, 5, 4]
    var oddNums = [-5, -4, 4, 3]
    var sidesEvenAndOdd = [-4, 4]
    var oddCorner = [-4]
    var evenCorner = [4]
    var evenTop = [4, 5]
    var oddBottom = [-5, -4]
    var playerJumps = [9, 7, -9, -7]

    // ID Check for weird cells
    var sideCells = [4, 11, 12, 19, 20, 27]
    var cornerCells = [28, 3]
    var topAndBottomCells = [0, 1, 2, 29, 30, 31]

    // Flags
    var playerTurn = checkerboardFlags.playerTurn
    var tdCheck = ''
    var rowCheck = ''
    var secondClickRow = element.parentElement.id.slice(3) // second click (passed through checkMovement, Row)
    var secondClickTd = element.id.slice(4) // second click (passed through checkMovement, Td)
    secondClickTd = +secondClickTd

    // Player Commands
    if(playerTurn){
        var firstClickRow = checkerboardFlags.firstClickRow.id.slice(3) // first click (stored to global flag in checkBoolean, Row)
        var firstClickTd = checkerboardFlags.firstClickTd.id.slice(4) // first click (stored to global flag in checkBoolean, Td)
        firstClickTd = +firstClickTd

        var playerJumpVal = secondClickTd - firstClickTd
        playerJumpVal = +playerJumpVal

        // Sets chain jumping values to go off of global flag and second clicks, since you won't have to click your first chip again when chain jumping.
        if (checkerboardFlags.playerChainJump) playerJumpVal =  secondClickTd - checkerboardFlags.playerPreviousChainJump

        var checkPlayerJump = playerJumps.includes(playerJumpVal)

        /* console.log('Player Color: ', checkerboardFlags.firstClickTd.firstChild.className, 'Player First Click TD ID: ', firstClickTd, 'Player First Click Row: ', firstClickRow, 
        'checkPlayerJump: ', checkPlayerJump); */

    }

    // Ai Commands  
    if(!playerTurn){
        var aiTd1 = aitd1check.id.slice(4) // first click (not stored to global flag, carried through from aiMove)
        var aiRow1 = airow1check.id.slice(3) // first click (not stored to global flag, carried through from aiMove)
        var firstClickRow = aiRow1
        var firstClickTd = aiTd1
        aiTd1 = +aiTd1
        
        console.log('AI READING COMMANDS', ' AI TD 1 ', aiTd1,'AI ROW 1 ', aiRow1, 'AI ROW 2 ', secondClickRow,'AI TD 2 ', secondClickTd)
    }

    // Row Check
    if (firstClickRow % 2 == 0) rowCheck = 'even', console.log('row check confirmed for even ', rowCheck, firstClickRow)
    else if (firstClickRow % 2 == 1 ) rowCheck = 'odd', console.log('row check confirmed for odd ', rowCheck, firstClickRow)

    // Checks for Player Jumps during Movement after Row Check
    if (playerTurn && checkPlayerJump) {

        if (checkerboardFlags.colorFlag === 'black') {

            if (!checkerboardFlags.firstClickDiv.firstChild){
                playerJumps.splice(0, 2)
            }

            var playerJumpsInd = playerJumps.findIndex(function (ele) {
                return playerJumpVal === ele
            })

            if (rowCheck === 'even') {
                evenNums.splice(2)
                var aiTdVal = secondClickTd + evenNums[playerJumpsInd]
                console.log(evenNums, playerJumps)
            }

            if (rowCheck === 'odd') {
                oddNums.splice(2)
                var aiTdVal = secondClickTd + oddNums[playerJumpsInd]
                console.log(oddNums, playerJumps)
            }

            console.log('Player Jump Value: ', playerJumpVal)
            console.log('Player Jump Ind: ', playerJumpsInd)
            console.log('Ai to Remove: ', aiTdVal)

            var aiTdToRemove = document.getElementById('cell' + aiTdVal)

            if (aiTdToRemove) tdCheck = true;
            else tdCheck = false;
        }

        else if (checkerboardFlags.colorFlag === 'red') {

            if (!checkerboardFlags.firstClickDiv.firstChild){
                playerJumps.splice(0, 2)
                evenNums.splice(0, 2)
                oddNums.splice(0, 2)
            }

            var playerJumpsInd = playerJumps.findIndex(function (ele) {
                return playerJumpVal === ele
            })

            /* if (playerJumps.length === 4) {
                if (playerJumpsInd === 2){
                    playerJumpsInd = 0
                }
                else if (playerJumpsInd === 3){
                    playerJumpsInd = 1
                }
            } */

            if (rowCheck === 'even') {
                if (!checkerboardFlags.playerChainJump){
                    var aiTdVal = secondClickTd + evenNums[playerJumpsInd]
                    console.log(evenNums, playerJumps)
                } else {
                    var aiTdVal = secondClickTd + evenNums[playerJumpsInd]
                    console.log(evenNums, playerJumps)
                }
                
            }

            if (rowCheck === 'odd') {
                if (!checkerboardFlags.playerChainJump){
                    var aiTdVal = secondClickTd + oddNums[playerJumpsInd]
                    console.log(oddNums, playerJumps)
                } else {
                    var aiTdVal = secondClickTd + oddNums[playerJumpsInd]
                    console.log(oddNums, playerJumps)
                }
                
            }

            console.log('Player Jump Value: ', playerJumpVal)
            console.log('Player Jump Ind: ', playerJumpsInd)
            console.log('Ai to Remove: ', aiTdVal)

            var aiTdToRemove = document.getElementById('cell' + aiTdVal)

            if (aiTdToRemove) tdCheck = true;
            else tdCheck = false;
        }

        if (checkerboardFlags.slots[aiTdVal] === checkerboardFlags.colorAiFlag) {

            var divNum = aiTdToRemove.firstChild.id.slice(3)
            divNum = +divNum

            if (checkerboardFlags.colorAiFlag == 'black') {
                checkerboardFlags.childrenToKeep.push(divNum)
            }

            else if (checkerboardFlags.colorAiFlag == 'red') {
                /* var toMatchSelector = divNum - 20 */
                checkerboardFlags.childrenToKeep.push(divNum)
            }

            /* tdCheck = true; */
            var afterJumpCheck = true;

        } else tdCheck = false;
    
    // Checks for player chain jumping - returns value into tempJumpArr if player can jump some more, also corrects boolean and gamestate values
    if(afterJumpCheck) checkChainJump(undefined, secondClickTd, undefined, undefined)

    function numIsInArray(arr){
        return arr.some(function(val){
            return typeof val === 'number'
        })
    }

    if (checkerboardFlags.playerPreviousChainJump !== null && afterJumpCheck === true) {
        console.log('Changing Gamestate in checkmovement for player chaining: ', checkerboardFlags.playerPreviousChainJump)
        var previousChainJump = document.getElementById('cell' + checkerboardFlags.playerPreviousChainJump)
        previousChainJump.setAttribute('data-boolean', "false");
        updateGamestateValue(previousChainJump, false)
    }
    if (checkerboardFlags.tempJumpArr.length !== 0 && numIsInArray(checkerboardFlags.tempJumpArr)){
        checkerboardFlags.playerChainJump = true 
        checkerboardFlags.playerPreviousChainJump = secondClickTd;
    } 
    else checkerboardFlags.playerChainJump = false, checkerboardFlags.playerPreviousChainJump = null;

    // Restricts player movement depending on the color when checkPlayerJump is false    
    } else if (playerTurn && !checkPlayerJump) {
        if (!checkerboardFlags.firstClickDiv.firstChild) {
            if (checkerboardFlags.colorFlag === 'black') {
                evenNums.splice(0, 2)
                oddNums.splice(0, 2)
                sidesEvenAndOdd.shift()
                oddCorner.shift()
                oddBottom.splice(0)
            }
            else {
                evenNums.splice(2)
                oddNums.splice(2)
                sidesEvenAndOdd.pop()
                evenCorner.shift()
                evenTop.splice(0)
            }
        }
    }


    // All Special Cell Checks
    if (sideCells.includes(firstClickTd)) {
        console.log('sideCells is activated')
        sidesEvenAndOdd.forEach(function (num) {
            if (secondClickTd - firstClickTd == num) tdCheck = true, console.log('even and odd sidecells check confirmed ', tdCheck, num)
        })

    } else if (cornerCells.includes(firstClickTd)) {
        console.log('cornerCells is activated')

        if (rowCheck == 'odd') {
            oddCorner.forEach(function (num) {
                if (secondClickTd - firstClickTd == num) tdCheck = true, console.log('odd cornercells check confirmed ', tdCheck, num)
            })
        } else if (rowCheck == 'even') {
            evenCorner.forEach(function (num) {
                if (secondClickTd - firstClickTd == num) tdCheck = true, console.log('even cornercells check confirmed ', tdCheck, num)
            })
        }

    } else if (topAndBottomCells.includes(firstClickTd)) {
        console.log('topAndBottomCells is activated')

        if (rowCheck == 'even') {
            evenTop.forEach(function (num) {
                if (secondClickTd - firstClickTd == num) tdCheck = true, console.log('even topandbottomcells check confirmed ', tdCheck, num)
            })
        } else if (rowCheck == 'odd') {
            oddBottom.forEach(function (num) {
                if (secondClickTd - firstClickTd == num) tdCheck = true, console.log('odd topandbottomcells check confirmed ', tdCheck, num)
            })
        }

    // Regular Cell Checks
    } else if (rowCheck == 'odd') {
        oddNums.forEach(function (num) {
            if (secondClickTd - firstClickTd == num) tdCheck = true, console.log(rowCheck, 'odd td check confirmed ', tdCheck, num)
            else console.log('nothing equals', rowCheck, ' for num')
        })
    } else if (rowCheck == 'even') {
        evenNums.forEach(function (num) {
            if (secondClickTd - firstClickTd == num) tdCheck = true, console.log(rowCheck, 'even td check confirmed ', tdCheck, num)
            else console.log('nothing equals', rowCheck, ' for num')
        })
    } else { console.log('forEach not working properly') }


   if(playerTurn) placeChip(element, tdCheck, aiTdToRemove, afterJumpCheck)
   if(!playerTurn && tdCheck) {console.log('MOVEMENT CHECK CONFIRMED'), checkerboardFlags.aiTurn = true;}
   else return false;
}
// Function for appendingChildren
function placeChip(element, tdCheck, aiTdToRemove, afterJumpCheck) {
    console.log('aiTdToRemove: ', aiTdToRemove)

    if (afterJumpCheck) {
        updateGamestateValue(aiTdToRemove, false)
        aiTdToRemove.setAttribute("data-boolean", "false")
        console.log('Trying to remove AI CHIP: ', aiTdToRemove.firstElementChild)
        aiTdToRemove.removeChild(aiTdToRemove.firstElementChild) 
    }
 
    if (tdCheck && element.getAttribute("data-boolean") == "false") {
        console.log('Trying to move chip to this empty spot which returns a false boolean')
        checkerboardFlags.firstClickTd.setAttribute("data-boolean", "false")
        updateGamestateValue(checkerboardFlags.firstClickTd, false)
        element.appendChild(checkerboardFlags.firstClickDiv)
        element.setAttribute("data-boolean", "true")
        updateGamestateValue(element, checkerboardFlags.colorFlag);
        if (!checkerboardFlags.playerChainJump) {
            checkerboardFlags.clickCounter = 2;
            checkerboardFlags.playerTurn = false;
            checkerboardFlags.checkAllJumps = false;
            checkerboardFlags.firstClickDiv.style.boxShadow = '0.2rem 0.2rem 0.2rem #000'
            console.log('Ai turn is up!')
            checkAllJumps();
        }
        else if (checkerboardFlags.playerChainJump) {
            checkerboardFlags.clickCounter = 2;
            checkerboardFlags.checkAllJumps = false;
            /* checkerboardFlags.firstClickDiv.style.boxShadow = '0.2rem 0.2rem 0.2rem #000' */
            console.log('Player can still execute another jump!')
        }
        
        
    } else console.log(`Spot has a chip on it already! Select an empty spot. OR movement requirements aren't satisfied`)

}

// Function for checking all possible jumps
function checkAllJumps() {
    var tempArr = checkerboardFlags.tempArr
    var tempJumpArr = checkerboardFlags.tempJumpArr
    var keepJumps = checkerboardFlags.keepJumps
    var predeterChildren = checkerboardFlags.predeterminedChildrenToRemove
    var childrenToRemove = checkerboardFlags.childrenToRemove

    function numIsTrue(element) {
        return typeof element === 'number'
    }

    function twoNumIsTrue(array) {
        return array.every(function (element) {
            return typeof element === 'number'
        }) & array.length === 2
    }

    /* function getChildren(children) {
        return Object.getOwnPropertyNames(predeterChildren)[children].slice(4, 6)
    } */

    function getSelector(selector) { // cell4 A = 7  or cell12 = 6 or cell10 A = 8 or cell3 = 5
        var unslicedSelector = Object.keys(keepJumps)[selector]
        if (unslicedSelector.length === 5 || unslicedSelector.length === 6) var slicedSelector = unslicedSelector.slice(4)
        if (unslicedSelector.length === 7) var slicedSelector = unslicedSelector.slice(4, 5)
        if (unslicedSelector.length === 8) var slicedSelector = unslicedSelector.slice(4, 6)
        return slicedSelector
    }

    function getLongestArray(selectorOrChildren) {
        for (i = 0; i <= Object.keys(keepJumps).length - 1; i++) {
            var length = Object.keys(keepJumps).length 
            var getProps = Object.keys(keepJumps)[i]
            var getProps2 = Object.keys(predeterChildren)[i]
            var compareArrayLength = keepJumps[getProps].length
    
            if (getArray) {
                if (getArray.length < compareArrayLength) {
                    var getArray = keepJumps[getProps]
                    var getChildren = predeterChildren[getProps2]
                    var selector = i
                    
                } else { console.log ('getLongestArray: Original array is still longer')} // 3 times results in error PLEASE FIX
            }
            else { 
                var getArray = keepJumps[getProps]
                var getChildren = predeterChildren[getProps2]
                var selector = i
             }
    
        }
        if (selectorOrChildren === 'selector' && i <= length) return getSelector(selector);
        if (selectorOrChildren === 'children' && i <= length) return getChildren
        else if (i <= length) return getArray;
    }

    for (num = 0; num <= 12; num++) {
        /* debugger; */
        tempArr.length = 0;
        tempJumpArr.length = 0;
        childrenToRemove.length = 0;

        if (checkerboardFlags.checkAllJumps) break;
        if (checkerboardFlags.colorAiFlag === 'red') var matchRedSelector = num + 20

        console.log('Trying number: ', num, 'in checkAllJumps()')

        if (num == 12) {
            checkerboardFlags.checkAllJumps = true;

            if (Object.keys(keepJumps).length !== 0){
            var bestJumps = getLongestArray()
            var chipSelector = getLongestArray('selector')
            var childrenToRemove = getLongestArray('children')

            console.log('bestJumps: ', bestJumps);
            console.log('chipSelector: ', chipSelector);

            if (checkerboardFlags.colorAiFlag === 'red') aiMove(allRed[chipSelector], bestJumps, childrenToRemove) // chipSelector '2 A' FIX (FIXED)
            else aiMove(allBlack[chipSelector], bestJumps, childrenToRemove)
            } else {
                checkerboardFlags.predeterminedChildrenToRemove = []; 
                checkerboardFlags.keepJumps = [];
                aiPick();
            }
        } // do shit on this line after predetermining everything.

        else if (num !== 12 && !checkerboardFlags.childrenToKeep.includes(num) && !checkerboardFlags.childrenToKeep.includes(matchRedSelector) && aiPick(num)) {
            console.log('num: ', num, 'is true.')
            console.log('before', tempJumpArr)
            console.log(tempJumpArr.length)
            console.log(checkerboardFlags.childrenToRemove)

            checkerboardFlags.predeterminedChainJumps = true;

            if (twoNumIsTrue(tempJumpArr) && !keepJumps['chip' + num]) {

                tempJumpArr.forEach(function (element, ind) {

                    if (ind === 0) {var route = ' A'}
                    if (ind === 1) {var route = ' B'}

                    keepJumps['chip' + num + route] = [element]
                    predeterChildren['chip' + num + route] = [checkerboardFlags.childrenToRemove[ind]]
                    console.log('keepJumps forEach Split 1!', keepJumps['chip' + num + route][ind])
                    console.log('predeterChildren forEach Split 1! ', predeterChildren['chip' + num + route])

                })

                for (ind = 0; ind <= keepJumps['chip' + num + ' A'].length - 1; ind++) {

                    checkChainJump(undefined, keepJumps['chip' + num + ' A'][ind], num, ' A')
                    tempJumpArr.forEach(function (element, ind) {
                        if (numIsTrue(element)) {
                            keepJumps['chip' + num + ' A'].push(element)
                            console.log('keepJumps forEach Split 2!', keepJumps['chip' + num + ' A'][ind])
                            console.log('predeterChildren forEach Split 2! ', predeterChildren['chip' + num + ' A'])
                        } else { console.log('numIsNotTrue: ', element, ind) }
                    })
                }

                for (ind = 0; ind <= keepJumps['chip' + num + ' B'].length - 1; ind++) {

                    checkChainJump(undefined, keepJumps['chip' + num + ' B'][ind], num, ' B')
                    tempJumpArr.forEach(function (element, ind) {
                        if (numIsTrue(element)) {
                            keepJumps['chip' + num + ' B'].push(element)
                            console.log('keepJumps forEach Split 2!', keepJumps['chip' + num + ' B'][ind])
                            console.log('predeterChildren forEach Split 2! ', predeterChildren['chip' + num + ' B'])
                        } else { console.log('numIsNotTrue: ', element, ind) }
                    })
                }

            } else {

                tempJumpArr.forEach(function (element, ind) {
                    if (numIsTrue(element)) {
                        keepJumps['chip' + num] = [element]
                        predeterChildren['chip' + num] = [checkerboardFlags.childrenToRemove[0]]
                        console.log('keepJumps forEach Func 1!', keepJumps['chip' + num][ind])
                        console.log('predeterChildren forEach Func 1! ', predeterChildren['chip' + num])
                    }
                })

                for (ind = 0; ind <= keepJumps['chip' + num].length - 1; ind++) {
                    checkChainJump(undefined, keepJumps['chip' + num][ind], num)
                    if (twoNumIsTrue(tempJumpArr)) {
                        var firstLinearJump = keepJumps['chip' + num][0]
                        var secondLinearJump = keepJumps['chip' + num][1]
                        var firstJumpA = tempJumpArr.shift()
                        var secondJumpB = tempJumpArr.shift()
                        var secondChildB = predeterChildren['chip' + num].pop()
                        var firstChildA = predeterChildren['chip' + num].pop()

                        keepJumps['chip' + num + ' A'] = [firstLinearJump]
                        keepJumps['chip' + num + ' B'] = [firstLinearJump]
                        predeterChildren['chip' + num + ' A'] = [checkerboardFlags.childrenToRemove[0]]
                        predeterChildren['chip' + num + ' B'] = [checkerboardFlags.childrenToRemove[0]]

                        if (secondLinearJump) {
                            keepJumps['chip' + num + ' A'].push(secondLinearJump)
                            keepJumps['chip' + num + ' B'].push(secondLinearJump)
                            var secondLinearChild = predeterChildren['chip' + num].pop()
                            predeterChildren['chip' + num + ' A'].push(secondLinearChild)
                            predeterChildren['chip' + num + ' B'].push(secondLinearChild)
                            predeterChildren['chip' + num].push(secondLinearChild);
                        }

                        keepJumps['chip' + num + ' A'].push(firstJumpA)
                        keepJumps['chip' + num + ' B'].push(secondJumpB)
                        predeterChildren['chip' + num + ' A'].push(firstChildA)
                        predeterChildren['chip' + num + ' B'].push(secondChildB)
                        if (keepJumps['chip' + num].length < keepJumps['chip' + num + ' A'].length) {
                            checkChainJump(undefined, keepJumps['chip' + num + ' A'][ind + 1], num)
                            if (twoNumIsTrue(tempJumpArr)) {
                                tempJumpArr.forEach(function (ele, ind){
                                    if (ind === 0) {
                                        var newRoute = ' C'
                                    }
                                    else if (ind === 1) {
                                        var newRoute = ' D'
                                    }

                                    keepJumps['chip' + num + newRoute] = keepJumps['chip' + num + ' A'].concat([ele])
                                    predeterChildren['chip' + num + newRoute] = [checkerboardFlags.childrenToRemove[ind]]
                                })
                            } else if (numIsTrue(tempJumpArr)) {
                                // linear jump
                            }
                        }
                        if (keepJumps['chip' + num].length < keepJumps['chip' + num + ' B'].length) {
                            checkChainJump(undefined, keepJumps['chip' + num + ' B'][ind + 1], num)
                            if (twoNumIsTrue(tempJumpArr)) {
                                tempJumpArr.forEach(function (ele, ind){
                                    

                                    if (ind === 0) {
                                        var newRoute = ' E'
                                        var secondChild = predeterChildren['chip' + num].pop()
                                        var firstChild = predeterChildren['chip' + num].pop()
                                        predeterChildren['chip' + num].push(secondChild)

                                        predeterChildren['chip' + num + newRoute] = predeterChildren['chip' + num + ' B'].concat([firstChild])
                                        /* checkerboardFlags.predeterminedChildrenToRemove['chip' + num + newRoute].push(firstChild) */
                                    }
                                    else if (ind === 1) {
                                        var newRoute = ' F'
                                        var secondChild = predeterChildren['chip' + num].pop()
                                        predeterChildren['chip' + num + newRoute] = predeterChildren['chip' + num + ' B'].concat([secondChild])
                                        /* predeterChildren['chip' + num + newRoute].push(secondChild) */
                                    }

                                    keepJumps['chip' + num + newRoute] = keepJumps['chip' + num + ' B'].concat([ele])

                                })
                            } else if (numIsTrue(tempJumpArr)) {
                                // linear jump
                            }
                        }
                        /* delete keepJumps['chip' + num] */
                        break;
                    } else {
                        tempJumpArr.forEach(function (element, ind) {
                            if (numIsTrue(element)) {
                                keepJumps['chip' + num].push(element)
                                console.log('keepJumps forEach Func 2!', keepJumps['chip' + num][ind])
                                console.log('predeterChildren forEach Func 2! ', predeterChildren['chip' + num])
                            } else { console.log('numIsNotTrue: ', element, ind) }
                        })
                    }
                }
    
            }

            


            
            /* if (keepJumps['chip' + num + 'ind' + ind]) {
                checkChainJump(undefined, keepJumps['chip' + num][0])
                tempJumpArr.forEach(function (element, ind) {
                    if (numIsTrue(element)) {
                        keepJumps['chip' + num].push(element)
                        console.log('keepJumps forEach Func 2!', keepJumps['chip' + num])
                    }
                })
            } */

            checkerboardFlags.predeterminedChainJumps = false;
            console.log('keepJump results: ', checkerboardFlags.keepJumps)


        }
    }
    checkerboardFlags.aiTurn = false;
    checkerboardFlags.playerTurn = true;
    checkerboardFlags.tempArr.length = 0;
    checkerboardFlags.clickCounter = 0;
    checkerboardFlags.predeterminedChildrenToRemove = []; 
    checkerboardFlags.keepJumps = [];
}

// Function for chaining jumps together
function checkChainJump(chipselectorid, cellid, selector, route) {
    console.log('Checking for chain jumps!', 'num: ', chipselectorid, 'cellid: ', cellid, 'selector: ', selector)
    checkerboardFlags.checkChainJumps = true;
    checkerboardFlags.tempJumpArr.length = 0;
    aiPick(chipselectorid, cellid, selector, route)

    // player chain jumping rule revert

    if (checkerboardFlags.playerTurn) {

        checkerboardFlags.childrenToRemove.length = 0

        if (checkerboardFlags.playerTurn && checkerboardFlags.colorFlag === 'black') checkerboardFlags.colorFlag = 'red'
        else if (checkerboardFlags.playerTurn && checkerboardFlags.colorFlag === 'red') checkerboardFlags.colorFlag = 'black'

        if (checkerboardFlags.playerTurn && checkerboardFlags.colorAiFlag === 'black') checkerboardFlags.colorAiFlag = 'red'
        else if (checkerboardFlags.playerTurn && checkerboardFlags.colorAiFlag === 'red') checkerboardFlags.colorAiFlag = 'black'

    }
    checkerboardFlags.checkChainJumps = false;
}

// AI - For picking
function aiPick(num, cellid, selector, route) {
    var tempArr = checkerboardFlags.tempArr
    var tempJumpArr = checkerboardFlags.tempJumpArr
    var checkChainJumps = checkerboardFlags.checkChainJumps
    var checkAllJumps = checkerboardFlags.checkAllJumps
    var predeter = checkerboardFlags.predeterminedChainJumps
    var evenNums = [-4, -3, 4, 5] // movement controls
    var oddNums = [-5, -4, 3, 4]
    var sides = [-4, 4]
    var top = [4, 5]
    var bottom = [-5, -4]
    var oddRow = [1, 3, 5, 7] // row numbers 
    var evenRow = [0, 2, 4, 6]
    var evenTop = [0, 1, 2] // chip positions
    var oddBottom = [29, 30, 31]
    var sideCells = [4, 11, 12, 19, 20, 27]
    var cornerCells = [28, 3]
    var topAndBottomCells = [0, 1, 2, 29, 30, 31]
    console.log (checkAllJumps, checkChainJumps);
    
    // for console log (kek)
    if (checkerboardFlags.colorAiFlag === 'red') var matchRedSelector = num + 20


    // player chain jumping rule
    if (checkerboardFlags.playerTurn && checkerboardFlags.colorFlag === 'red') checkerboardFlags.colorFlag = 'black'
    else if (checkerboardFlags.playerTurn && checkerboardFlags.colorFlag === 'black') checkerboardFlags.colorFlag = 'red'

    if (checkerboardFlags.playerTurn && checkerboardFlags.colorAiFlag === 'red') checkerboardFlags.colorAiFlag = 'black'
    else if (checkerboardFlags.playerTurn && checkerboardFlags.colorAiFlag === 'black') checkerboardFlags.colorAiFlag = 'red'


    if (checkAllJumps && !checkChainJumps) {
        var numArr = []

        for (i = 0; i <= 11; i++) {
            numArr.push(i)
        }

        console.log('CHILDREN TO KEEP: ', checkerboardFlags.childrenToKeep)
        console.log('Before splicing: ', numArr)

        numArr = numArr.filter(function (ele, ind) {
            if (checkerboardFlags.colorAiFlag === 'red') return !checkerboardFlags.childrenToKeep.includes(ele + 20)
            else return !checkerboardFlags.childrenToKeep.includes(ele)
        })

        console.log('After splicing: ', numArr)

        var numInd = Math.floor(Math.random() * numArr.length)

        console.log('numInd: ', numInd)
        var num = numArr[numInd]

        console.log('NUMBER THAT IS GOING TO BE USED: ', num)
    }
    

    console.log('What color is AI? ', checkerboardFlags.colorAiFlag, 'What piece is AI trying to move? ', matchRedSelector)
    console.log ('(AI PICK) NUMBER PICKED = ', 'num: ', num, 'or', 'cellid: ', cellid)
    
    if (checkerboardFlags.colorAiFlag == 'red') {
        // king check (removes ability to go backwards if not kinged)
        if (checkerboardFlags.playerTurn){
            if (!checkerboardFlags.firstClickDiv.firstChild) {
                evenNums.splice(2)
                oddNums.splice(2)
                sides.pop()
                top.splice(0)
            }
        }
        else if (!checkerboardFlags.playerTurn) {
            if (num !== undefined) {
                if (!allRed[num].firstChild) {
                    evenNums.splice(2)
                    oddNums.splice(2)
                    sides.pop()
                    top.splice(0)
                }
            }
            if (selector !== undefined) {
                if (!allRed[selector].firstChild) {
                    evenNums.splice(2)
                    oddNums.splice(2)
                    sides.pop()
                    top.splice(0)
                }

            }
        }
        // row
        if (cellid == undefined) {
        var redParent = allRed[num].parentElement.parentElement
        var slicedRedParent = redParent.id.slice(3)
        // cell
        var slicedRedCell = allRed[num].parentElement.id.slice(4)
        } else {
        // cell ID manually for checking jumps
        var slicedRedCell = cellid
        var slicedRedParent = allContainers[cellid].parentElement.id.slice(3)
        }
        
        slicedRedCell = +slicedRedCell
        slicedRedParent = +slicedRedParent
        console.log('Arrays are now: ', evenNums, oddNums, sides, top)
    }

    if (checkerboardFlags.colorAiFlag == 'black') {
        // king check (removes ability to go backwards if not kinged)
        if (checkerboardFlags.playerTurn) {
            if (!checkerboardFlags.firstClickDiv.firstChild){
                evenNums.splice(0, 2)
                oddNums.splice(0, 2)
                sides.shift()
                bottom.splice(0)
            }
        }
        if (!checkerboardFlags.playerTurn) {
            if (num !== undefined) {
                if (!allBlack[num].firstChild) {
                    evenNums.splice(0, 2)
                    oddNums.splice(0, 2)
                    sides.shift()
                    bottom.splice(0)
                }
            }
            if (selector !== undefined) {
                if (!allBlack[selector].firstChild) {
                    evenNums.splice(0, 2)
                    oddNums.splice(0, 2)
                    sides.shift()
                    bottom.splice(0)
                }
            }
        }
        //// cell id
        // row
        if (cellid == undefined) {
        var blackParent = allBlack[num].parentElement.parentElement
        var slicedBlackParent = blackParent.id.slice(3)
        // cell
        var slicedBlackCell = allBlack[num].parentElement.id.slice(4)
        } else {
        // cell ID manually for checking jumps
        var slicedBlackCell = cellid
        var slicedBlackParent = allContainers[cellid].parentElement.id.slice(3)
        }
        
        slicedBlackParent = +slicedBlackParent
        slicedBlackCell = +slicedBlackCell
        console.log('Arrays are now: ', evenNums, oddNums, sides, bottom)
    }

    // Jump Module
    function jumpChip(val, tdChip) {
        var childrenToRemove = checkerboardFlags.childrenToRemove
        var predeterChildren = checkerboardFlags.predeterminedChildrenToRemove
        var jumpArr = [-9, -7, 7, 9]
        var findIndex = tdChip + val
        /* findIndex = +findIndex */
        var noJumpAllowed = sideCells.includes(findIndex) || topAndBottomCells.includes(findIndex) || cornerCells.includes(findIndex)

        console.log('JUMP ARRAY ACTIVATING ', 'tdchip:', tdChip, 'value:', val, 'moving to spot: ', findIndex, 'noJumpAllowed: ', noJumpAllowed)
        console.log('red cell: ', slicedRedParent, 'black cell: ', blackParent, 'nojumpallowed: ', noJumpAllowed, 'coloraiflag: ', checkerboardFlags.colorAiFlag)

        if (predeterChildren['chip' + selector + ' A']) var splitA = predeterChildren['chip' + selector + ' A']
        if (predeterChildren['chip' + selector + ' B']) var splitB = predeterChildren['chip' + selector + ' B']

        if (!noJumpAllowed && oddRow.includes(slicedBlackParent) && checkerboardFlags.colorAiFlag == 'black'
            || !noJumpAllowed && oddRow.includes(slicedRedParent) && checkerboardFlags.colorAiFlag == 'red') {
            console.log('jumpChip Module, you are inside Odd module.')
            if (val == -5 && !checkerboardFlags.slots[jumpArr[0] + tdChip]) {
                if (!predeter) childrenToRemove.push(findIndex) 
                else if (route === ' A') splitA.push(findIndex)
                else if (route === ' B') splitB.push(findIndex)
                else if (predeter) predeterChildren['chip' + selector].push(findIndex) 
                return jumpArr[0] + tdChip
            }
            if (val == -4 && !checkerboardFlags.slots[jumpArr[1] + tdChip]) {
                if (!predeter) { childrenToRemove.push(findIndex) }
                else if (route === ' A') splitA.push(findIndex)
                else if (route === ' B') splitB.push(findIndex)
                else if (predeter) { predeterChildren['chip' + selector].push(findIndex) }
                return jumpArr[1] + tdChip
            }
            if (val == 3 && !checkerboardFlags.slots[jumpArr[2] + tdChip]) {
                if (!predeter) { childrenToRemove.push(findIndex) }
                else if (route === ' A') splitA.push(findIndex)
                else if (route === ' B') splitB.push(findIndex)
                else if (predeter) { predeterChildren['chip' + selector].push(findIndex) }
                return jumpArr[2] + tdChip
            }
            if (val == 4 && !checkerboardFlags.slots[jumpArr[3] + tdChip]) {
                if (!predeter) { childrenToRemove.push(findIndex) }
                else if (route === ' A') splitA.push(findIndex)
                else if (route === ' B') splitB.push(findIndex)
                else if (predeter) { predeterChildren['chip' + selector].push(findIndex) }
                return jumpArr[3] + tdChip
            }
            else return 'space behind chip is true'
        }

        if (!noJumpAllowed && evenRow.includes(slicedBlackParent) && checkerboardFlags.colorAiFlag == 'black'
            || !noJumpAllowed && evenRow.includes(slicedRedParent) && checkerboardFlags.colorAiFlag == 'red') {
            console.log('jumpChip Module, you are inside Even module.')
            if (val == -4 && !checkerboardFlags.slots[jumpArr[0] + tdChip]) {
                if (!predeter) { childrenToRemove.push(findIndex) }
                else if (route === ' A') splitA.push(findIndex)
                else if (route === ' B') splitB.push(findIndex)
                else if (predeter) { predeterChildren['chip' + selector].push(findIndex) }
                return jumpArr[0] + tdChip
            }
            if (val == -3 && !checkerboardFlags.slots[jumpArr[1] + tdChip]) {
                if (!predeter) { childrenToRemove.push(findIndex) }
                else if (route === ' A') splitA.push(findIndex)
                else if (route === ' B') splitB.push(findIndex)
                else if (predeter) { predeterChildren['chip' + selector].push(findIndex) }
                return jumpArr[1] + tdChip
            }
            if (val == 4 && !checkerboardFlags.slots[jumpArr[2] + tdChip]) {
                if (!predeter) { childrenToRemove.push(findIndex) }
                else if (route === ' A') splitA.push(findIndex)
                else if (route === ' B') splitB.push(findIndex)
                else if (predeter) { predeterChildren['chip' + selector].push(findIndex) }
                return jumpArr[2] + tdChip
            }
            if (val == 5 && !checkerboardFlags.slots[jumpArr[3] + tdChip]) {
                if (!predeter) { childrenToRemove.push(findIndex) }
                else if (route === ' A') splitA.push(findIndex)
                else if (route === ' B') splitB.push(findIndex)
                else if (predeter) { predeterChildren['chip' + selector].push(findIndex) }
                return jumpArr[3] + tdChip
            }
            else return 'space behind chip is true'
        }

        else return 'false'
    }

    // ODD ROW FOR AI ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (oddRow.includes(slicedBlackParent) && checkerboardFlags.colorFlag == 'red' || oddRow.includes(slicedRedParent) && checkerboardFlags.colorFlag == 'black') {

        // BLACK|RED ODD CORNER  BOTTOM LEFT
        if (cornerCells.includes(slicedBlackCell, 0) && checkerboardFlags.colorFlag == 'red' || cornerCells.includes(slicedRedCell, 0) && checkerboardFlags.colorFlag == 'black') {
            console.log('ODD CORNER MODULE RUNNING...')
            if ( !predeter && checkerboardFlags.colorFlag == 'red' && !checkerboardFlags.slots[24]) { /* tempArr.push(24); */ return aiMove(allBlack[num], num) } // IF KINGED, this needs to change. - Just enable it.
            else if ( !predeter && checkerboardFlags.colorFlag == 'black' && !checkerboardFlags.slots[24]) { tempArr.push(24); return aiMove(allRed[num], num) }
            else if (!checkerboardFlags.keepJumps['chip' + selector] && checkerboardFlags.colorFlag == 'red' && checkerboardFlags.slots[24] == 'red') {/* tempJumpArr.push(jumpChip(-4, slicedBlackCell)) */ if (!predeter) return aiMove(allBlack[num], num) } // IF KINGED, this needs to change. - Just enable it.
            else if (!checkerboardFlags.keepJumps['chip' + selector] && checkerboardFlags.colorFlag == 'black' && checkerboardFlags.slots[24] == 'black') { tempJumpArr.push(jumpChip(-4, slicedRedCell)); if (!predeter) return aiMove(allRed[num], num) }
            else if (checkerboardFlags.checkAllJumps && !predeter) {console.log('Reseting AI, corner is full.'); aiPick();}
            else {console.log('Returning False, corner is full.'); return false;}
        }

        // RED AI
        else if (checkerboardFlags.colorFlag == 'black') {
            
            // RED SIDES
            if (sideCells.includes(slicedRedCell)) {
                sides.forEach(function (val, ind) {
                    var findIndex = slicedRedCell + val
                    console.log('Trying to move ', slicedRedCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'black') tempJumpArr.push(jumpChip(val, slicedRedCell))
                })
                if (!predeter) return (aiMove(allRed[num], num))
            }

            // RED BOTTOM
            else if (topAndBottomCells.includes(slicedRedCell)) {
                bottom.forEach(function (val, ind) {
                    var findIndex = slicedRedCell + val
                    console.log('Trying to move ', slicedRedCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'black') tempJumpArr.push(jumpChip(val, slicedRedCell))
                })
                if (!predeter) return (aiMove(allRed[num], num))
            }

            // REGULAR MOVES
            else {
                oddNums.forEach(function (val, ind) {
                    var findIndex = slicedRedCell + val
                    console.log('Trying to move ', slicedRedCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'black') tempJumpArr.push(jumpChip(val, slicedRedCell))
                })
                if (!predeter) return (aiMove(allRed[num], num))
            }
            
        } 
        // BLACK AI
        else if (checkerboardFlags.colorFlag == 'red') {
            
            // BLACK SIDES
            if (sideCells.includes(slicedBlackCell)) {
                sides.forEach(function (val, ind) {
                    var findIndex = slicedBlackCell + val
                    console.log('Trying to move ', slicedBlackCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'red') tempJumpArr.push(jumpChip(val, slicedBlackCell))
                })
                if (!predeter) return (aiMove(allBlack[num], num))
            }
            // BLACK BOTTOM
            else if (oddBottom.includes(slicedBlackCell)) {
                bottom.forEach(function (val, ind) {
                    var findIndex = slicedBlackCell + val
                    console.log('Trying to move ', slicedBlackCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'red') tempJumpArr.push(jumpChip(val, slicedBlackCell))
                })
                if (!predeter) return (aiMove(allBlack[num], num))
            }

            // BLACK REGULAR MOVES
            else {
                oddNums.forEach(function (val, ind) {
                    var findIndex = slicedBlackCell + val
                    console.log('Trying to move ', slicedBlackCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'red') tempJumpArr.push(jumpChip(val, slicedBlackCell))
                })
                if (!predeter) return (aiMove(allBlack[num], num))
            }
        } 
        // EVEN ROW FOR AI ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } if (evenRow.includes(slicedBlackParent) && checkerboardFlags.colorFlag == 'red' || evenRow.includes(slicedRedParent) && checkerboardFlags.colorFlag == 'black') {

        // BLACK|RED EVEN  TOP RIGHT
        if (cornerCells.includes(slicedBlackCell, 1) && checkerboardFlags.colorFlag == 'red' || cornerCells.includes(slicedRedCell, 1) && checkerboardFlags.colorFlag == 'black') {
            console.log('EVEN CORNER MODULE RUNNING...')
            if ( !predeter && checkerboardFlags.colorFlag == 'red' && !checkerboardFlags.slots[7]) { tempArr.push(7); return aiMove(allBlack[num], num) }
            else if ( !predeter && checkerboardFlags.colorFlag == 'black' && !checkerboardFlags.slots[7]) { /* tempArr.push(7); */ return aiMove(allRed[num], num) } // IF KINGED, this needs to change. - Just enable it.
            else if (!checkerboardFlags.keepJumps['chip' + selector] && checkerboardFlags.colorFlag == 'red' && checkerboardFlags.slots[7] == 'red') { tempJumpArr.push(jumpChip(4, slicedBlackCell)); if (!predeter) return aiMove(allBlack[num], num);}
            else if (!checkerboardFlags.keepJumps['chip' + selector] && checkerboardFlags.colorFlag == 'black' && checkerboardFlags.slots[7] == 'black') {/* tempJumpArr.push(jumpChip(4, slicedRedCell)) */; if (!predeter) return aiMove(allRed[num], num);} // IF KINGED, this needs to change. - Just enable it.
            else if (checkerboardFlags.checkAllJumps && !predeter) {console.log('Reseting AI, corner is full.'); aiPick();}
            else {console.log('Returning False, corner is full.'); return false;}

        }

        // RED AI
        else if (checkerboardFlags.colorFlag == 'black') {
            
            // RED SIDES
            if (sideCells.includes(slicedRedCell)) {
                sides.forEach(function (val, ind) {
                    var findIndex = slicedRedCell + val
                    console.log('Trying to move ', slicedRedCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'black') tempJumpArr.push(jumpChip(val, slicedRedCell))
                }) 
                if (!predeter) return (aiMove(allRed[num], num))
            } 
            // RED TOP
            else if (evenTop.includes(slicedRedCell)) {
                top.forEach(function (val, ind) {
                    var findIndex = slicedRedCell + val
                    console.log('Trying to move ', slicedRedCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'black') tempJumpArr.push(jumpChip(val, slicedRedCell))
                })
                if (!predeter) return (aiMove(allRed[num], num))
            }

            // RED REGULAR MOVES
            else {
                evenNums.forEach(function (val, ind) {
                    var findIndex = slicedRedCell + val
                    console.log('Trying to move ', slicedRedCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'black') tempJumpArr.push(jumpChip(val, slicedRedCell))
                })
                if (!predeter) return (aiMove(allRed[num], num))
            }
        } 
        // BLACK AI
        else if (checkerboardFlags.colorFlag == 'red') {
            
            // BLACK SIDES
            if (sideCells.includes(slicedBlackCell)) {
                sides.forEach(function (val, ind) {
                    var findIndex = slicedBlackCell + val
                    console.log('Trying to move ', slicedBlackCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'red') tempJumpArr.push(jumpChip(val, slicedBlackCell))
                })
                if (!predeter) return (aiMove(allBlack[num], num))
            } 
            // BLACK TOP
            else if (evenTop.includes(slicedBlackCell)) {
                top.forEach(function (val, ind) {
                    var findIndex = slicedBlackCell + val
                    console.log('Trying to move ', slicedBlackCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'red') tempJumpArr.push(jumpChip(val, slicedBlackCell))
                })
                if (!predeter) return (aiMove(allBlack[num], num))
            } 

            // BLACK REGULAR MOVES
            else {
                evenNums.forEach(function (val, ind) {
                    var findIndex = slicedBlackCell + val
                    console.log('Trying to move ', slicedBlackCell, 'to spot', findIndex, 'and the spot is ', checkerboardFlags.slots[findIndex]);
                    if (!checkerboardFlags.slots[findIndex]) tempArr.push(findIndex)
                    if (checkerboardFlags.slots[findIndex] == 'red') tempJumpArr.push(jumpChip(val, slicedBlackCell))
                })  
                if (!predeter) return (aiMove(allBlack[num], num))
            } 
        } 
    }
}

// AI - For moving
function aiMove(pick, bestJumps, childrenToRemove) {

    var tempArr = checkerboardFlags.tempArr
    var jumpArr = checkerboardFlags.tempJumpArr
    var checkChainJumps = checkerboardFlags.checkChainJumps
    var aiJumped = false

    function allJumps() {
        for (i=0; i < bestJumps.length; i++) {
            setTimeout(updateAi(pick, bestJumps[i]), 10000)
            setTimeout(removeChildren(childrenToRemove[i]), 10000)
        }
    }   

    // OLD LINEAR JUMP SYSTEM 

    /* function Jump() {  
        for (i = 0; i < jumpArr.length; i++) {
            if (typeof jumpArr[i] === 'number' && !aiJumped) {
                console.log('jumping activated: ', pick, jumpArr[i])
                updateAi(pick, jumpArr[i])
                aiJumped = true
                checkerboardFlags.checkAllJumps = true
                removeChild()
                checkChainJump(selector)
            } else console.log('Chain Jumping finished, no more chips to jump.')
        }   
    } */

    function numIsTrue(element) {
        return typeof element === 'number'
    }

    function stringIsTrue(element) {
        return typeof element === 'string'
    }

    console.log('AI MOVE ACTIVATING', 'dom element being passed', pick, 'temp array ', tempArr)
    console.log('The length of the temp array is ', tempArr.length);
    console.log('JumpArr: ', jumpArr)
    console.log('ChildrenToRemove: ', checkerboardFlags.childrenToRemove)
   
    if (bestJumps && childrenToRemove && checkerboardFlags.checkAllJumps) allJumps(); // Will jump when all predetermined parameters are in place
    else if (checkChainJumps && jumpArr.length !== 0) { tempArr.length = 0; } // AI will reset  while checking for chain jumps
    else if (checkChainJumps && jumpArr.length === 0) { console.log('Chain Jumping finished, no more chips to jump.') } // AI will end when done chain jumps
    else if (jumpArr.length == 0 && !checkerboardFlags.checkAllJumps) { tempArr.length = 0; } // AI will reset while checking for jumps
    else if (jumpArr.length !== 0 && jumpArr.some(numIsTrue) && !checkerboardFlags.checkAllJumps) { return true; } // returns true to checkAllJumps when a jump is available
    else if (jumpArr.length !== 0 && jumpArr.some(stringIsTrue) && !checkerboardFlags.checkAllJumps) { tempArr.length = 0; } // AI will reset if jumpArr doesn't contain a possible jump.
    else if (tempArr.length !== 0) {

        console.log('temp array gate has been granted access!')  
        
        // OLD LINEAR JUMP SYSTEM

        /* if (jumpArr.length !== 0 && jumpArr.some(numIsTrue)) {
            console.log('numIsTrue activated')
            Jump();
        }
        else if(tempArr.length == 0 && jumpArr.length !== 0 && jumpArr.some(stringIsTrue)) {
            console.log('stringIsTrue activated')
            jumpArr.length = 0;
            aiPick();
        } */

        if (!checkerboardFlags.aiTurn) {
            tempArr.some(function (val) {
                if (checkerboardFlags.aiTurn) return true;

                else {
                    console.log('Using ', val, ' for .some function.')
                    console.log(allContainers[val])
                    checkMovement(allContainers[val], pick.parentElement, pick.parentElement.parentElement)

                    if (checkerboardFlags.aiTurn) {
                        updateAi(pick, val);
                        checkerboardFlags.aiTurn = false;
                        checkerboardFlags.playerTurn = true;
                        checkerboardFlags.tempArr.length = 0;
                        checkerboardFlags.tempJumpArr.length = 0;
                        checkerboardFlags.clickCounter = 0;
                        checkerboardFlags.playerPreviousChainJump = null;
                        return true;

                    }
                }
            })
        }
    }
    else { checkerboardFlags.childrenToRemove.length = 0; aiPick(); }

    function updateAi(pick, ind) {

        console.log('updateAi is executing')
        updateGamestateValue(pick.parentElement, false)
        pick.parentElement.setAttribute("data-boolean", "false")
        allContainers[ind].appendChild(pick)
        updateGamestateValue(allContainers[ind], checkerboardFlags.colorAiFlag)
        allContainers[ind].setAttribute("data-boolean", "true")
        console.log('Player turn is up!')
        console.log('Clearing JUMP CHIP ARRAY ', checkerboardFlags.tempJumpArr)
    }
}

// Applies listener to the container class
var allContainersByClass = document.getElementsByClassName("container")
for (var i = 0; i < allContainersByClass.length; i++) {
    allContainersByClass[i].addEventListener("click", function() {
        childCheck(this.firstChild, this)
    })
}

function removeChildren(cellNum) {
    var td = document.getElementById('cell' + cellNum)
    td.setAttribute('data-boolean', "false")
    updateGamestateValue(td, false)

    
    var divNum = td.firstChild.id.slice(3)
    divNum = +divNum
    console.log('DIV NUMBER GETTING REMOVED: ', divNum)
    
    if (checkerboardFlags.colorAiFlag == 'black') {
        checkerboardFlags.playerChildrenToKeep.push(divNum)
    }
    
    else if (checkerboardFlags.colorAiFlag == 'red') {
        checkerboardFlags.playerChildrenToKeep.push(divNum)
    }

    td.removeChild(td.firstChild)
}

// localStorage save system
var saveButton = document.getElementById("storageSaveButton");
saveButton.addEventListener("click", function(){
    var strAiChildren = JSON.stringify(checkerboardFlags.childrenToKeep)
    var strPlayerChildren = JSON.stringify(checkerboardFlags.playerChildrenToKeep)
    var gameState = JSON.stringify(checkerboardFlags.slots)
    
    localStorage.setItem("playerColorFlag", checkerboardFlags.colorFlag)
    localStorage.setItem("gameState", gameState)
    localStorage.setItem("aiChips", strAiChildren);
    localStorage.setItem("playerChips", strPlayerChildren)
})

// localStorage load system
var loadButton = document.getElementById("storageLoadButton");
loadButton.addEventListener("click", function(){
    var strGameState = localStorage.getItem("gameState")
    var strAiChips = localStorage.getItem("aiChips")
    var strPlayerChips = localStorage.getItem("playerChips")
    var strColorFlag = localStorage.getItem("playerColorFlag")

    var parseGameState = JSON.parse(strGameState)
    var parseAiChips = JSON.parse(strAiChips)
    var parsePlayerChips = JSON.parse(strPlayerChips)

    console.log('Game State Loaded: ', parseGameState);
    console.log('Deleted Ai Chips Loaded: ', parseAiChips);
    console.log('Deleted Player Chips Loaded: ', parsePlayerChips);
    console.log('Player is color: ', strColorFlag)

    transformLoad(parseGameState, parseAiChips, parsePlayerChips, strColorFlag)
})

// Function for transforming board after loading a save
function transformLoad(gamestate, aichips, playerchips, colorflag) {
    var blackChips = [];
    var redChips = [];
    var tempStorage = {
        red: [],
        black: [],
    }

    for (i = 0; i <= 11; i++) {
        blackChips.push(i)
        redChips.push(i + 20)
    }

    blackChips = blackChips.filter(function (val, ind) {

        if (colorflag === 'black') {
            return !playerchips.includes(val);
        }
        else return !aichips.includes(val);

    })

    redChips = redChips.filter(function (val, ind) {

        if (colorflag === 'red') {
            return !playerchips.includes(val);
        }
        else return !aichips.includes(val);

    })

    // Match chips that are already there and remove them from array - Also removes dead divs that are on their own color loaded state to get placed by
    // the correct chips in the next step.
    for (i = 0; i <= gamestate.length - 1; i++) {
        console.log('STAGE 1 --- black chips that still need to go on the board: ', blackChips);
        console.log('STAGE 1 --- red chips that still need to go on the board: ', redChips);
        var slicedDiv = ''

        if (gamestate[i] === 'red') {

            if (allContainers[i].firstChild) {
                slicedDiv = allContainers[i].firstChild.id.slice(3)
                slicedDiv = +slicedDiv
            }

            if (redChips.includes(slicedDiv)) {

                var redChipsInd = redChips.findIndex(function (val, ind) {
                    return slicedDiv === val
                })

                redChips.splice(redChipsInd, 1)
            }

            if (colorflag === 'black') {
                if (aichips.includes(slicedDiv)) {
                    var aiChipsInd = aichips.findIndex(function (val, ind) {
                        return slicedDiv === val
                    })
                    /* aichips.splice(aiChipsInd, 1) */
                    allContainers[i].removeChild(allContainers[i].firstChild);
                }
            }
            
            if (colorflag === 'red') {
                if (playerchips.includes(slicedDiv)) {
                    var aiChipsInd = playerchips.findIndex(function (val, ind) {
                        return slicedDiv === val
                    })
                    /* playerchips.splice(aiChipsInd, 1) */
                    allContainers[i].removeChild(allContainers[i].firstChild);
                }
            }

        }

        else if (gamestate[i] === 'black') {

            if (allContainers[i].firstChild) {
                slicedDiv = allContainers[i].firstChild.id.slice(3)
                slicedDiv = +slicedDiv
            }
            
            if (blackChips.includes(slicedDiv)) {
                var blackChipsInd = blackChips.findIndex(function (val, ind) {
                    return slicedDiv === val
                })
                blackChips.splice(blackChipsInd, 1)
            }

            if (colorflag === 'black'){
                if (playerchips.includes(slicedDiv)) {
                    var playerChipsInd = playerchips.findIndex(function (val, ind) {
                        return slicedDiv === val
                    })
                    /* playerchips.splice(playerChipsInd, 1) */
                    allContainers[i].removeChild(allContainers[i].firstChild);
                }
            }

            if (colorflag === 'red'){
                if (aichips.includes(slicedDiv)) {
                    var playerChipsInd = aichips.findIndex(function (val, ind) {
                        return slicedDiv === val
                    })
                    /* aichips.splice(playerChipsInd, 1) */
                    allContainers[i].removeChild(allContainers[i].firstChild);
                }
            }
            

        }

    }

    // Black Chip placement for false and red spots according to live gamestate.
    for (i = 0; i <= gamestate.length - 1; i++) {
        console.log('STAGE 2 --- black chips that still need to go on the board: ', blackChips);
        console.log('STAGE 2 --- red chips that still need to go on the board: ', redChips);

        if (gamestate[i] === 'black' && !allContainers[i].firstChild) {
            var randomBlackChipVal = blackChips.shift()
            var randomBlackChipDOM = document.getElementById("div" + randomBlackChipVal)
            allContainers[i].appendChild(randomBlackChipDOM)
        }
        else if (gamestate[i] === 'black' && allContainers[i].firstChild.className === 'red') {
            var removeRedChipDOM = allContainers[i].removeChild(allContainers[i].firstChild)
            tempStorage.red.unshift(removeRedChipDOM)

            var randomBlackChipVal = blackChips.shift()
            var randomBlackChipDOM = document.getElementById("div" + randomBlackChipVal)
            allContainers[i].appendChild(randomBlackChipDOM)
        }

    }
    
    // Red Chip placement for false and black spots according to live gamestate.
    for (i = 0; i <= gamestate.length - 1; i++) {
        console.log('STAGE 3 --- black chips that still need to go on the board: ', blackChips);
        console.log('STAGE 3 --- red chips that still need to go on the board: ', redChips);
        var revivedRedChip = [];
        var randomRedChipVal = null;
        var randomRedChipDOM = null;

        if (gamestate[i] === 'red' && !allContainers[i].firstChild) {
            randomRedChipVal = redChips.shift()
            randomRedChipDOM = document.getElementById("div" + randomRedChipVal)

            if (!randomRedChipDOM) {

                for (n = 0; n <= tempStorage.red.length - 1; n++) {
                    var slicedRedChip = +tempStorage.red[n].id.slice(3)
                    if (randomRedChipVal === slicedRedChip) {
                        revivedRedChip = tempStorage.red[n]
                    }
                }

                allContainers[i].appendChild(revivedRedChip)

            }
            else if (randomRedChipDOM) {
                allContainers[i].appendChild(randomRedChipDOM)
            }

        }
        else if (gamestate[i] === 'red' && allContainers[i].firstChild.className === 'black') {
            var removeBlackChipDOM = allContainers[i].removeChild(allContainers[i].firstChild)
            tempStorage.black.unshift(removeBlackChipDOM)

            randomRedChipVal = redChips.shift()
            randomRedChipDOM = document.getElementById("div" + randomRedChipVal)
            if (!randomRedChipDOM) {

                for (i = 0; i <= tempStorage.red.length - 1; i++) {
                    var slicedRedChip = +tempStorage.red[i].id.slice(3)
                    if (randomRedChipVal === slicedRedChip) {
                        revivedRedChip = tempStorage.red[i]
                    }
                }

                allContainers[i].appendChild(revivedRedChip)
            }
            else if (randomRedChipDOM) {
                allContainers[i].appendChild(randomRedChipDOM)
            }

        }

    }
    // Removes extra Red and Black chips according to gamestate false values & sets boolean values for player clicking
    for (i = 0; i <= gamestate.length - 1; i++) {

        if (!gamestate[i]) {

            allContainers[i].setAttribute("data-boolean", "false")

            if (allContainers[i].firstChild) {
                allContainers[i].removeChild(allContainers[i].firstChild)
            }

        }

        if (gamestate[i]) allContainers[i].setAttribute("data-boolean", "true")

    }

    // Declare inital gamestate to loaded gamestate
    checkerboardFlags.slots = gamestate
    checkerboardFlags.colorFlag = colorflag
    checkerboardFlags.childrenToKeep = aichips
    checkerboardFlags.playerChildrenToKeep = playerchips
    
    if (colorflag === 'red') var colorAiFlag = 'black'
    else colorAiFlag = 'red'

    checkerboardFlags.colorAiFlag = colorAiFlag

    console.log('Load Succesful, you are', colorflag);
}

// Function for removing child objects (OLD LINEAR JUMP SYSTEM)
/* function removeChild() {
    console.log('Children to remove ', checkerboardFlags.childrenToRemove)
    var cellNum = checkerboardFlags.childrenToRemove[0]
    var td = document.getElementById('cell' + cellNum)
    td.setAttribute('data-boolean', false)
    updateGamestateValue(td, false)

    
    var divNum = td.firstChild.id.slice(3)
    divNum = +divNum
    console.log('DIV NUMBER GETTING REMOVED: ', divNum)
    if (checkerboardFlags.colorAiFlag == 'black') {
        var toMatchSelector = 20 + divNum
        checkerboardFlags.childrenToKeep.push(toMatchSelector)
    }
    
    else if (checkerboardFlags.colorAiFlag == 'red') {
        checkerboardFlags.childrenToKeep.push(divNum)
    }

    td.removeChild(td.firstChild)
    checkerboardFlags.childrenToRemove.length = 0;
} */

// Commands
whatColor();
whoGoesFirst();
console.log('script done reading')


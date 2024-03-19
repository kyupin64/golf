let scoreCards = [];
let id = 0;

// set variables for which options were picked, which players were added, which course was selected, and the current scorecard object
let optionsPicked = ["tee", "holes"];
let playerInputs = [];
let currentCourse = {};
let currentScoreCard = {};

// set varibales for scorecard name, name input field, rename button, and submit button
let currentName = document.querySelector("#scorecard h1");
let nameInput = document.getElementById("name-input");
let renameBtn = document.getElementById("name-btn");
let nameSubmitBtn = document.getElementById("name-submit-btn");

class ScoreCard {
    id = getNewId();
    players = [];
    name;
    teeBgColor;
    teeTextColor = "white";

    constructor(courseId, tee, holes) {
        this.courseId = courseId;
        this.tee = tee;
        this.holes = holes;
    }
}

class Player {
    outStrokes = { hole1: undefined, hole2: undefined, hole3: undefined, hole4: undefined, hole5: undefined, 
        hole6: undefined, hole7: undefined, hole8: undefined, hole9: undefined }

    inStrokes = { hole10: undefined, hole11: undefined, hole12: undefined, hole13: undefined, hole14: undefined, 
        hole15: undefined, hole16: undefined, hole17: undefined, hole18: undefined }

    outTotal;
    inTotal;
    allTotal;

    constructor(name) {
        this.name = name;
    }
}

function getNewId() {
    let newId = id;
    id++;
    return newId;
}

function getCourses() {
    // get golf courses API, return promise of JS (array with each course object)
    return fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json")
        .then(response => response.json())
}

function getCurrentCourse(golfCourseId) {
    // get API for golf course that was clicked, return promise with course object JS
    return fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`)
        .then(response => response.json())
}

function printCourses() {
    getCourses()
        // get array of each course object from previous promise, pass array to new function
        .then(courseList => {
            // show course selection HTML
            document.getElementById("course-select").classList.remove("hidden");

            let coursesHtml = "";
            courseList.forEach((course) => {
                // add button to string with the course title and ID (and styles) for each course
                coursesHtml += `<button id=${course.id} class="course-select-btn py-2 px-6 border-2 shadow-md w-full hover:bg-emerald-700 hover:text-white">${course.name}</button>`;
            });
            document.getElementById("course-list").innerHTML = coursesHtml;
        })

        // after all courses have been added to HTML, loop through each course button and add an event listener on click
        .then(() => {
            document.querySelectorAll(".course-select-btn").forEach((element) => {
                element.addEventListener("click", () => {
                    // hide course selection HTML
                    document.getElementById("course-select").classList.add("hidden");
                    // call printCourseOptions function to show current course options HTML
                    printCourseOptions(element.id);
                })
            })
        })
}

function printCourseOptions(golfCourseId) {
    getCurrentCourse(golfCourseId)
        // get current course object from previous promise, pass object to new function
        .then(course => {
            // show current course options HTML
            document.getElementById("course-options").classList.remove("hidden");

            // get the teeBoxes in the first hole and call function to print tees
            let courseTees = course.holes[0].teeBoxes;
            printTeeOptions(courseTees);
            return course;
        })

        // after all tees have been added to HTML, call function to add event listeners to select options
        .then((course) => selectTeeAndHoles(course));
}

function printTeeOptions(courseTees) {
    let courseTeesHtml = "";

    courseTees.forEach((tee) => {
        // check if teeType exists and that it's not just auto change location before doing anything with it
        if (tee.teeType && tee.teeType !== "auto change location") {
            // set variables for the colors, change colors of bg and text based on what the teeColorType is
            let teeColor = tee.teeColorType;
            let textColor = "white";
            if (teeColor === "yellow") {
                textColor = "black";
            }
            let teeBgColor = getTeeColors(teeColor);

            // add button to string with the type and color (and styles) for each tee
            courseTeesHtml += `<button id="${tee.teeColorType}" class="tee-select-btn py-2 px-6 border-2 shadow-md hover:bg-${teeBgColor} hover:text-${textColor}">${tee.teeType} / ${teeColor}</button>`;
        }
    })
    document.getElementById("tee-list").innerHTML = courseTeesHtml;
}

function getTeeColors(teeColor) {
    // check tee color to set bg color, return bg color
    let teeBgColor;
    if (teeColor === "black") {
        teeBgColor = teeColor;
    } else if (teeColor === "white") {
        teeBgColor = "emerald-700";
    } else if (teeColor === "yellow") {
        teeBgColor = "yellow-300";
    } else {
        teeBgColor = `${teeColor}-700`;
    }

    return teeBgColor;
}
    
function selectTeeAndHoles(course) {
    // set empty currentCourse object to whatever course was selected
    currentCourse = course;
    
    // make sure player input field starts blank
    document.querySelector("#add-player-input input").value = "";

    document.querySelectorAll(".tee-select-btn").forEach((element) => {
        element.addEventListener("click", teeSelectHandler);   
    });

    document.querySelectorAll(".hole-select-btn").forEach((element) => {
        element.addEventListener("click", holeSelectHandler);
    });

    document.querySelector("#add-player-input button").addEventListener("click", () => {
        let name = document.querySelector("#add-player-input input").value;
        // if the input field has text in it, add text to players array and html player list, set input value back to empty
        if (name) {
            playerInputs.push(name);
            document.getElementById("player-list").innerHTML += `<li>${name}</li>`;
            document.querySelector("#add-player-input input").value = "";
        }
    });

    // add event to continue button to check if all options have been selected
    document.getElementById("continue-btn").addEventListener("click", eventHandler);
}

function teeSelectHandler(e) {
    // remove all event listeners and call tee selection function for target button
    document.querySelectorAll(".tee-select-btn").forEach((elem) => {
        elem.removeEventListener("click", teeSelectHandler)
    });

    let element = e.currentTarget;
    teeSelect(element);
}

function teeSelect(element) {
    // remove solid color classes from any tee select buttons that have already been clicked
    document.querySelectorAll(".tee-select-btn").forEach((elem) => {
        elem.classList.remove(elem.classList[8]);
        elem.classList.remove(elem.classList[7]);
    });

    // add the id to the options array, get colors, then add solid color classes to current button
    optionsPicked[0] = element.id;

    let teeColor = element.id;
    let textColor = "white";
    if (teeColor === "yellow") {
        textColor = "black";
    }
    let teeBgColor = getTeeColors(teeColor);

    element.classList.add(`bg-${teeBgColor}`);
    element.classList.add(`text-${textColor}`);

    // set new event listeners for the buttons so the user can change to a different option
    document.querySelectorAll(".tee-select-btn").forEach((elem) => {
        elem.addEventListener("click", teeSelectHandler);
    });
}

function holeSelectHandler(e) {
    // remove all event listeners and call hole selection function for target button
    document.querySelectorAll(".hole-select-btn").forEach((elem) => {
        elem.removeEventListener("click", holeSelectHandler);
    });

    let element = e.currentTarget;
    holeSelect(element);
}

function holeSelect(element) {
    // remove solid color classes from any hole select buttons that have already been clicked
    document.querySelectorAll(".hole-select-btn").forEach((elem) => {
        elem.classList.remove("bg-emerald-700");
        elem.classList.remove("text-white");
    });

    // add the innerHTML to the options array then add solid color classes to current button
    optionsPicked[1] = element.innerHTML;
    
    element.classList.add("bg-emerald-700");
    element.classList.add("text-white");

    // set new event listeners for the buttons so the user can change to a different option
    document.querySelectorAll(".hole-select-btn").forEach((elem) => {
        elem.addEventListener("click", holeSelectHandler);
    });
}

function eventHandler() {
    checkSelect();
    this.removeEventListener("click", eventHandler);
}

function checkSelect() {
    // if both tee and holes have been selected and at least one player added, hide course options HTML; add info,
    // options, players, and tee colors to new scorecard object; load scorecard menu; and call print the scorecard
    if (optionsPicked[0] !== "tee" && optionsPicked[1] !== "holes" && playerInputs[0]) {
        document.getElementById("course-options").classList.add("hidden");
        
        let newScoreCard = new ScoreCard(currentCourse.id, optionsPicked[0], optionsPicked[1]);
        let playerList = "";
        playerInputs.forEach((player) => {
            let newPlayer = new Player(player);
            newScoreCard.players.push(newPlayer);

            playerList += player;
            if (player !== playerInputs[playerInputs.length - 1]) {
                playerList += ", ";
            }
        })
        newScoreCard.name = `${currentCourse.name}, unnamed (${optionsPicked[0]} tee, ${optionsPicked[1]} holes, players: ${playerList})`;
        if (optionsPicked[0] === "yellow") {
            newScoreCard.teeTextColor = "black";
        }
        newScoreCard.teeBgColor = getTeeColors(optionsPicked[0]);
        scoreCards.push(newScoreCard);

        currentScoreCard = newScoreCard;

        saveThings();
        loadScorecards();
        printScoreCard();
    }
}
            
function printScoreCard(currentCardName = undefined) {
    // set variables for scorecard container div and both front 9 and back 9 divs
    let scorecard = document.getElementById("scorecard");
    let front9 = document.getElementById("front-9");
    let back9 = document.getElementById("back-9");

    // show scorecard container
    scorecard.classList.remove("hidden");
    scorecard.classList.add("flex");

    // if front 9 was selected, only show front 9 table
    if (currentScoreCard.holes === "front 9") {
        front9.classList.remove("hidden");
        front9.classList.add("flex");
    } 
    // if back 9 was selected, only show back 9 table
    else if (currentScoreCard.holes === "back 9") {
        back9.classList.remove("hidden");
        back9.classList.add("flex");
    }
    // if all 18 were selected, show both front 9 and back 9 tables
    else {
        front9.classList.remove("hidden");
        front9.classList.add("flex");
        back9.classList.remove("hidden");
        back9.classList.add("flex");
    }

    makeTable(currentCardName);
}

function makeTable(currentCardName = undefined) {
    // check if card name has been set and if so put it in HTML, if not default to name in API object
    if (currentCardName !== undefined) {
        document.querySelector("#scorecard h1").innerHTML = currentCardName;
    } else {
        document.querySelector("#scorecard h1").innerHTML = currentCourse.name;
    }
    // add event to rename button
    document.getElementById("name-btn").addEventListener("click", renameEventHandler);

    let tee = currentScoreCard.tee;
    let holes = currentScoreCard.holes;
    let players = currentScoreCard.players;

    // get key of the correct tee
    let hole0Tees = currentCourse.holes[0].teeBoxes;
    let teeKey;
    Object.keys(hole0Tees).forEach((key) => {
        if (hole0Tees[key].teeColorType === tee) {
            teeKey = key;
        }
    });

    // call functions to print which holes were chosen
    if (holes === "front 9") { printFront9(tee, holes, players, teeKey); }
    else if (holes === "back 9") { printBack9(tee, holes, players, teeKey); }
    else if (holes === "all 18") {
        // make first column of back 9 hidden if printing all 18 and the screen is big enough
        document.getElementById("hole-title").classList.add("lg:hidden");

        // call both front9 and back9 functions, plus the function to add totals
        printFront9(tee, holes, players, teeKey);
        printBack9(tee, holes, players, teeKey);
        printTotals();
    }
}

function printFront9(tee, holes, players, teeKey) {
    // set variable to tell functions which indexes of holes to print
    let indexes = [0, 5, 9];
    // get table elements from html and call functions to set tee yardage, handicap, and par rows
    let first5TeeRow = document.querySelector("#front-9 table:first-child tbody tr:nth-child(2)");
    let last4TeeRow = document.querySelector("#front-9 table:last-child tbody tr:nth-child(2)");
    printTeeYardage(first5TeeRow, last4TeeRow, holes, tee, teeKey, indexes, "front 9");

    let first5HcpRow = document.querySelector("#front-9 table:first-child tbody tr:nth-child(3)");
    let last4HcpRow = document.querySelector("#front-9 table:last-child tbody tr:nth-child(3)");
    printHandicap(first5HcpRow, last4HcpRow, holes, teeKey, indexes, "front 9");

    let first5ParRow = document.querySelector("#front-9 table:first-child tbody tr:last-child");
    let last4ParRow = document.querySelector("#front-9 table:last-child tbody tr:last-child");
    printPar(first5ParRow, last4ParRow, holes, teeKey, indexes, "front 9");
    
    // print players in html and add events for each stroke input box, print existing strokes if there are any
    printPlayers(first5ParRow, last4ParRow, holes, players, indexes, "front 9");
    if (holes !== "all 18") {
        addStrokeEvent(players, holes);
        players.forEach((player) => {
            printExistingStrokes(player);
        });
    }
}

function printBack9(tee, holes, players, teeKey) {
    // set variable to tell functions which indexes of holes to print
    let indexes = [9, 14, 18];
    // get table elements from html and call functions to set tee yardage, handicap, and par rows
    let first5TeeRow = document.querySelector("#back-9 table:first-child tbody tr:nth-child(2)");
    let last4TeeRow = document.querySelector("#back-9 table:last-child tbody tr:nth-child(2)");
    printTeeYardage(first5TeeRow, last4TeeRow, holes, tee, teeKey, indexes, "back 9");

    let first5HcpRow = document.querySelector("#back-9 table:first-child tbody tr:nth-child(3)");
    let last4HcpRow = document.querySelector("#back-9 table:last-child tbody tr:nth-child(3)");
    printHandicap(first5HcpRow, last4HcpRow, holes, teeKey, indexes, "back 9");

    let first5ParRow = document.querySelector("#back-9 table:first-child tbody tr:last-child");
    let last4ParRow = document.querySelector("#back-9 table:last-child tbody tr:last-child");
    printPar(first5ParRow, last4ParRow, holes, teeKey, indexes, "back 9");

    // print players in html and add events for each stroke input box, print existing strokes if there are any
    printPlayers(first5ParRow, last4ParRow, holes, players, indexes, "back 9");
    addStrokeEvent(players, holes);
    players.forEach((player) => {
        printExistingStrokes(player);
    });
}

function printTeeYardage(first5TeeRow, last4TeeRow, hole, tee, teeKey, indexes, frontOrBack) {
    tee = tee.toUpperCase();
    first5TeeRow.innerHTML = `<td class="bg-${currentScoreCard.teeBgColor} text-${currentScoreCard.teeTextColor}">${tee}</td>`;
    // make first column of back 9 hidden if printing all 18 and the screen is big enough
    if (frontOrBack === "back 9" && hole === "all 18") {
        first5TeeRow.innerHTML = `<td class="bg-${currentScoreCard.teeBgColor} text-${currentScoreCard.teeTextColor} lg:hidden">${tee}</td>`;
    }
    last4TeeRow.innerHTML = `<td class="bg-${currentScoreCard.teeBgColor} text-${currentScoreCard.teeTextColor} sm:hidden">${tee}</td>`;

    let currentYards = 0;
    let totalYards = 0;

    // loop through first 5 columns, then loop through last 4 to add yardage for each hole in current tee
    for (i = indexes[0]; i < indexes[1]; i++) {
        currentYards = currentCourse.holes[i].teeBoxes[teeKey].yards;
        totalYards += currentYards;
        first5TeeRow.innerHTML += `<td class="bg-${currentScoreCard.teeBgColor} text-${currentScoreCard.teeTextColor}">${currentYards}</td>`;
    }
    for (i = indexes[1]; i < indexes[2]; i++) {
        currentYards = currentCourse.holes[i].teeBoxes[teeKey].yards;
        totalYards += currentYards;
        last4TeeRow.innerHTML += `<td class="bg-${currentScoreCard.teeBgColor} text-${currentScoreCard.teeTextColor}">${currentYards}</td>`;
        // add total yardage in last column
        if (i === 8) {
            last4TeeRow.innerHTML += `<td id="total-yards-out" class="bg-${currentScoreCard.teeBgColor} text-${currentScoreCard.teeTextColor}">${totalYards}</td>`;
        } else if (i === 17) {
            last4TeeRow.innerHTML += `<td id="total-yards-in" class="bg-${currentScoreCard.teeBgColor} text-${currentScoreCard.teeTextColor}">${totalYards}</td>`;
        }
    }
}

function printHandicap(first5HcpRow, last4HcpRow, hole, teeKey, indexes, frontOrBack) {
    first5HcpRow.innerHTML = `<td>HANDICAP</td>`;
    // make first column of back 9 hidden if printing all 18 and the screen is big enough
    if (frontOrBack === "back 9" && hole === "all 18") {
        first5HcpRow.innerHTML = `<td class="lg:hidden">HANDICAP</td>`;
    }
    last4HcpRow.innerHTML = `<td class="sm:hidden">HANDICAP</td>`;

    let hcp;

    // loop through first 5 columns, then loop through last 4 to add handicap for each hole in current tee
    for (i = indexes[0]; i < indexes[1]; i++) {
        hcp = currentCourse.holes[i].teeBoxes[teeKey].hcp;
        first5HcpRow.innerHTML += `<td>${hcp}</td>`;
    }
    for (i = indexes[1]; i < indexes[2]; i++) {
        hcp = currentCourse.holes[i].teeBoxes[teeKey].hcp;
        last4HcpRow.innerHTML += `<td>${hcp}</td>`;
        if (i === 8 || i === 17) {
            // add empty td element so border is consistent
            last4HcpRow.innerHTML += `<td></td>`;
        }
    }
}

function printPar(first5ParRow, last4ParRow, hole, teeKey, indexes, frontOrBack) {
    first5ParRow.innerHTML = `<td>PAR</td>`;
    // make first column of back 9 hidden if printing all 18 and the screen is big enough
    if (frontOrBack === "back 9" && hole === "all 18") {
        first5ParRow.innerHTML = `<td class="lg:hidden">PAR</td>`;
    }
    last4ParRow.innerHTML = `<td class="sm:hidden">PAR</td>`;

    let totalPar = 0;
    let currentPar = 0;

    // loop through first 5 columns, then loop through last 4 to add par for each hole in current tee
    for (i = indexes[0]; i < indexes[1]; i++) {
        currentPar = currentCourse.holes[i].teeBoxes[teeKey].par;
        totalPar += currentPar;
        first5ParRow.innerHTML += `<td>${currentPar}</td>`;
    }
    for (i = indexes[1]; i < indexes[2]; i++) {
        currentPar = currentCourse.holes[i].teeBoxes[teeKey].par;
        totalPar += currentPar;
        last4ParRow.innerHTML += `<td>${currentPar}</td>`;
        // add total par in last column
        if (i === 8) {
            last4ParRow.innerHTML += `<td id="total-par-out">${totalPar}</td>`;
        } else if (i === 17) {
            last4ParRow.innerHTML += `<td id="total-par-in">${totalPar}</td>`;
        }
    }
}

function printPlayers(first5ParRow, last4ParRow, hole, players, indexes, frontOrBack) {
    players.forEach((player) => {
        // add new row elements for each player and put them above the par row
        let first5PlayerRow = document.createElement("tr");
        let last4PlayerRow = document.createElement("tr");
        first5ParRow.before(first5PlayerRow);
        last4ParRow.before(last4PlayerRow);

        // make player rows slightly taller and give each one a class to make it easier to find later
        first5PlayerRow.classList.add("h-10");
        first5PlayerRow.classList.add(`${player.name}-row`);
        last4PlayerRow.classList.add("h-10");
        last4PlayerRow.classList.add(`${player.name}-row`);

        first5PlayerRow.innerHTML = `<td class="font-bold">${player.name}</td>`;
        // make first column of back 9 hidden if printing all 18 and the screen is big enough
        if (frontOrBack === "back 9" && hole === "all 18") {
            first5PlayerRow.innerHTML = `<td class="lg:hidden font-bold">${player.name}</td>`;
        }
        last4PlayerRow.innerHTML = `<td class="sm:hidden font-bold">${player.name}</td>`;

        // loop through first 5 columns, then loop through last 4 to add empty td elements for stroke inputs for each hole
        for (i = indexes[0]; i < indexes[1]; i++) {
            first5PlayerRow.innerHTML += `<td class="stroke-input hover:cursor-pointer hover:bg-emerald-100"></td>`;
        }
        for (i = indexes[1]; i < indexes[2]; i++) {
            last4PlayerRow.innerHTML += `<td class="stroke-input hover:cursor-pointer hover:bg-emerald-100"></td>`;
            // add space for total strokes in last column
            if (i === 8) {
                last4PlayerRow.innerHTML += `<td id="${player.name}-strokes-out"></td>`;
            } else if (i === 17) {
                last4PlayerRow.innerHTML += `<td id="${player.name}-strokes-in"></td>`;
            }
            if (i === 17 && hole === "all 18") {
                last4PlayerRow.innerHTML += `<td id="${player.name}-total-strokes"></td>`;
            }
        }
    })
}

function printExistingStrokes(player) {
    // loop through each stroke input box in HTML for each player and get the hole number to add stroke value if it's been inputted
    let strokeBoxes = document.querySelectorAll(`.${player.name}-row .stroke-input`);
    let holeNum;
    strokeBoxes.forEach((box) => {
        holeNum = checkCellIndex(box);
        let holeKey = `hole${holeNum}`

        // check if the index is in the out or in holes, then check if there is a saved value in player object and add to HTML accordingly
        if (holeNum > 0 && holeNum <= 9) {
            if (player.outStrokes[holeKey]) {
                box.innerHTML = player.outStrokes[holeKey];
            }
        } else if (holeNum >= 10 && holeNum <= 18) {
            if (player.inStrokes[holeKey]) {
                box.innerHTML = player.inStrokes[holeKey];
            }
        }
    });
    
    // if totals exist and are not 0, add them to html
    if (player.outTotal && player.outTotal !== 0) {
        document.getElementById(`${player.name}-strokes-out`).innerHTML = player.outTotal;
    }
    if (player.inTotal && player.inTotal !== 0) {
        document.getElementById(`${player.name}-strokes-in`).innerHTML = player.inTotal;
    }
    if (player.allTotal && player.allTotal !== 0) {
        document.getElementById(`${player.name}-total-strokes`).innerHTML = player.allTotal;
    }
}

function checkCellIndex(element) {
    // check which table the element is in and adjust the cellIndex accordingly to get the hole number
    let idx;
    let tableContainer = element.parentElement.parentElement.parentElement;
    if (tableContainer.id === "first-5-front-9") {
        idx = element.cellIndex;
    } else if (tableContainer.id === "last-4-front-9") {
        idx = element.cellIndex + 5;
    } else if (tableContainer.id === "first-5-back-9") {
        idx = element.cellIndex + 9;
    } else if (tableContainer.id === "last-4-back-9") {
        idx = element.cellIndex + 14;
    }
    return idx;
}

function addStrokeEvent(players, holes) {
    players.forEach((player => {
        let strokeInputs = document.querySelectorAll(`.${player.name}-row .stroke-input`);

        // loop through the inputs for each player's strokes on each hole and add events to each box
        strokeInputs.forEach((box) => {
            box.addEventListener("click", (e) => {
                let element = e.currentTarget;

                // get the container for the stroke input popup box and the p tag under it
                // then remove the "hidden" class to show the box
                let strokeInputContainer = document.getElementById("stroke-input-container");
                let strokeInputP = document.querySelector("#stroke-input-container p");
                strokeInputContainer.classList.remove("hidden");
                strokeInputContainer.classList.add("flex");
                
                // find the hole number/index
                let holeNum = checkCellIndex(element);

                // add player name and index to paragraph tag so the user knows exactly what they're inputting
                strokeInputP.innerHTML = `${player.name}'s strokes for hole ${holeNum}`;

                makeButtons(element, holeNum, strokeInputContainer, player, holes);
            })
        })
    }))
}

function makeButtons(element, holeNum, strokeInputContainer, player, holes) {
    // add buttons to go back or confirm stroke input
    let buttonsContainer = document.getElementById("buttons-container");
    let goBackBtnHtml = `<button id="go-back-btn" class="py-0.5 px-2 border-2 shadow-md bg-white hover:bg-red-700 hover:text-white hover:border-white">Go Back</button>`;
    let confirmBtnHtml = `<button id="confirm-btn" class="py-0.5 px-2 border-2 shadow-md bg-white hover:bg-sky-700 hover:text-white hover:border-white">Confirm</button>`;
    buttonsContainer.innerHTML = `${goBackBtnHtml}${confirmBtnHtml}`;

    // set variables for buttons and input field, clear input field
    let goBackBtn = document.querySelector("#buttons-container #go-back-btn");
    let confirmBtn = document.querySelector("#buttons-container #confirm-btn");
    let strokeInputField = document.querySelector("#stroke-input-container input");
    strokeInputField.value = "";

    // if go back button is clicked, clear buttons and hide input popup box
    goBackBtn.addEventListener("click", () => {
        buttonsContainer.innerHTML = "";
        strokeInputContainer.classList.remove("flex");
        strokeInputContainer.classList.add("hidden");
    });

    // if confirm button is clicked, clear buttons, hide input popup box, and add number to html
    confirmBtn.addEventListener("click", () => {
        let strokeInputNum = Number(strokeInputField.value);
        if (strokeInputNum > 0) {
            buttonsContainer.innerHTML = "";
            strokeInputContainer.classList.remove("flex");
            strokeInputContainer.classList.add("hidden");
            element.innerHTML = strokeInputNum;

            // add number to correct hole key in player object
            let currentHole = `hole${holeNum}`;
            if (holeNum <= 9) {
                player.outStrokes[currentHole] = strokeInputNum;
            } else if (holeNum >= 10) {
                player.inStrokes[currentHole] = strokeInputNum;
            }

            printStrokeTotals(player, holes);
            saveThings();
        }
    });
}

function printStrokeTotals(player, holes) {
    // call function to calculate and print the front 9 and back 9 totals
    if (holes === "front 9") {
        calcStrokeTotals(player, "out");
    } else if (holes === "back 9") {
        calcStrokeTotals(player, "in");
    } else {
        // call function to calculate and print both front 9 and back 9 totals
        calcStrokeTotals(player, "out");
        calcStrokeTotals(player, "in");
        
        // add sum of both totals to object and print grand total
        player.allTotal = player.outTotal + player.inTotal;
        if (player.allTotal && player.allTotal !== 0) {
            document.getElementById(`${player.name}-total-strokes`).innerHTML = player.allTotal;
        }
    }
}

function calcStrokeTotals(player, inOrOut) {
    // get array of all stroke values in player object in either front 9 or back 9, loop through each and add to total
    let strokesArr = Object.values(player[`${inOrOut}Strokes`]);
    let strokeTotals = 0;

    strokesArr.forEach((stroke) => {
        if (stroke) {
            strokeTotals += stroke;
        }
    });

    // add total to object and print if it exists and is not 0
    player[`${inOrOut}Total`] = strokeTotals;

    if (player[`${inOrOut}Total`] && player[`${inOrOut}Total`] !== 0) {
        document.getElementById(`${player.name}-strokes-${inOrOut}`).innerHTML = player[`${inOrOut}Total`];
    }
}

function printTotals() {
    // get totals header td element and remove hidden class
    let totalTitle = document.querySelector("#back-9 table:last-child tbody tr:first-child td:last-child");
    totalTitle.classList.remove("hidden");

    // get elements of rows containing totals column
    let teeTotal = document.querySelector("#back-9 table:last-child tbody tr:nth-child(2)");
    let hcpRow = document.querySelector("#back-9 table:last-child tbody tr:nth-child(3)");
    let parTotal = document.querySelector("#back-9 table:last-child tbody tr:last-child");
    
    // get elements with yardage and par totals and add ins and outs together to get overall totals
    let teeYardageOut = Number(document.getElementById("total-yards-out").innerHTML);
    let teeYardageIn = Number(document.getElementById("total-yards-in").innerHTML);
    let parOut = Number(document.getElementById("total-par-out").innerHTML);
    let parIn = Number(document.getElementById("total-par-in").innerHTML);

    let totalYards = teeYardageOut + teeYardageIn;
    let totalPar = parOut + parIn;

    // add those totals to the html, add empty td element to handicap row so border is consistent
    teeTotal.innerHTML += `<td class="bg-${currentScoreCard.teeBgColor} text-${currentScoreCard.teeTextColor}">${totalYards}</td>`;
    parTotal.innerHTML += `<td>${totalPar}</td>`;
    hcpRow.innerHTML += `<td></td>`
}

function openScorecardMenu(e) {
    // if scoreCards array is not empty, show/hide scorecard menu with list of saved scorecards and change icon
    if (scoreCards[0]) {
        let header = document.getElementById("header")
        let menu = document.getElementById("scorecard-menu");
        let icon = e.currentTarget.childNodes[0];
    
        header.classList.toggle("pb-4");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
        menu.classList.toggle("hidden");
        menu.classList.toggle("flex");
    }
}

function loadScorecards() {
    // add heading and buttons for each scorecard that's been added
    let scorecardMenu = document.getElementById("scorecard-menu");
    scorecardMenu.innerHTML = `<h3 class="py-2 text-3xl">Saved Scorecards</h3>`;

    scoreCards.forEach((card) => {
        cardHtml = `<button class="py-1.5 px-2 hover:py-2.5 w-full text-lg border-4 border-gray-500 hover:border-emerald-700 hover:bg-emerald-700 hover:text-white">${card.name}</button>`;
        scorecardMenu.innerHTML += cardHtml;
    });

    // add event listeners to load the clicked scorecard
    let scoreCardBtns = document.querySelectorAll("#scorecard-menu button");
    scoreCardBtns.forEach((button => {
        button.addEventListener("click", cardBtnClick);
    }));
}

function cardBtnClick(e) {
    let currentCardName = e.currentTarget.innerHTML;

    // loop through each scorecard and check if the name is the same as the clicked button, set currentScoreCard to correct object
    Object.values(scoreCards).forEach((obj) => {
        if (currentCardName === obj.name) {
            currentScoreCard = obj;
            // fetch course from API, reset the currentCourse value to be the new value, clear everything and print the scorecard
            getCurrentCourse(obj.courseId)
                .then((course) => currentCourse = course)
                .then(() => {
                    clearTable();
                    printScoreCard(currentCardName);
                });
        }
    });
}

function clearTable() {
    // hide scorecard, front 9 section, and back 9 section
    document.getElementById("scorecard").classList.add("hidden");
    document.getElementById("front-9").classList.add("hidden");
    document.getElementById("back-9").classList.add("hidden");

    // reset each table's HTML
    document.getElementById("first-5-front-9").innerHTML = `<tbody>
        <tr><td>HOLE</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>
        <tr></tr><tr></tr><tr></tr></tbody>`;
    document.getElementById("last-4-front-9").innerHTML = `<tbody>
        <tr><td class="sm:hidden">HOLE</td><td>6</td><td>7</td><td>8</td><td>9</td><td>OUT</td></tr>
        <tr></tr><tr></tr><tr></tr></tbody>`;
    document.getElementById("first-5-back-9").innerHTML = `<tbody>
        <tr><td id="hole-title">HOLE</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr>
        <tr></tr><tr></tr><tr></tr></tbody>`;
    document.getElementById("last-4-back-9").innerHTML = `<tbody>
        <tr><td class="sm:hidden">HOLE</td><td>15</td><td>16</td><td>17</td><td>18</td><td>IN</td><td class="hidden">TOT</td></tr>
        <tr></tr><tr></tr><tr></tr></tbody>`;

    // reset hole list and player list HTML
    document.getElementById("hole-list").innerHTML = `<button class="hole-select-btn py-2 px-6 border-2 shadow-md hover:bg-emerald-700 hover:text-white">front 9</button>
        <button class="hole-select-btn py-2 px-6 border-2 shadow-md hover:bg-emerald-700 hover:text-white">back 9</button>
        <button class="hole-select-btn py-2 px-6 border-2 shadow-md hover:bg-emerald-700 hover:text-white">all 18</button>`;
    document.getElementById("player-list").innerHTML = "";

    // hide course select and options select screens
    document.getElementById("course-select").classList.add("hidden");
    document.getElementById("course-options").classList.add("hidden");
}

function toggleName() {
    // hide/show h1 element and button to rename scorecard
    currentName.classList.toggle("hidden");
    renameBtn.classList.toggle("hidden");

    // show/hide name input field and submit new name button
    nameInput.classList.toggle("hidden");
    nameSubmitBtn.classList.toggle("hidden");
}

function renameEventHandler() {
    // remove the event listener on the rename scorecard button, call function to rename scorecard, and add new event listener
    this.removeEventListener("click", renameEventHandler);
    renameScoreCard();
    document.getElementById("name-btn").addEventListener("click", renameEventHandler);
}

function renameScoreCard() {
    // clear input value and use current name as placeholder, toggle elements, and add event listener on new name submit button
    nameInput.value = "";
    nameInput.placeholder = currentScoreCard.name;
    toggleName();
    nameSubmitBtn.addEventListener("click", submitEventHandler);
}

function submitEventHandler() {
    // remove event listener on new name submit button and call function to add new name to object and HTML
    this.removeEventListener("click", submitEventHandler);
    submitName();
}

function submitName() {
    // if the input field has text in it add that name to object and HTML, toggle elements, and load the new scorecards
    if (nameInput.value) {
        currentScoreCard.name = nameInput.value;
        currentName.innerHTML = nameInput.value;
        toggleName();
        loadScorecards();
    } else {
        // if not add a new event listener to submit button to restart chain
        nameSubmitBtn.addEventListener("click", submitEventHandler);
    }
}

// function to retrieve saved localStorage scoreCards object, currentScoreCard object, currentCourse object, and id, called on page load
function restoreSave() {
    scoreCards = JSON.parse(localStorage.getItem("scoreCards"));
    currentScoreCard = JSON.parse(localStorage.getItem("currentScoreCard"));
    currentCourse = JSON.parse(localStorage.getItem("currentCourse"));
    id = JSON.parse(localStorage.getItem("id"));

    // clear table, load all scorecards as buttons in dropdown, and reload current scorecard
    clearTable();
    loadScorecards();
    printScoreCard();
}

// function to save scoreCards object, currentScoreCard object, currentCourse object, and id, called each time a new scorecard or stroke is added
function saveThings() {
    localStorage.setItem("scoreCards", JSON.stringify(scoreCards));
    localStorage.setItem("currentScoreCard", JSON.stringify(currentScoreCard));
    localStorage.setItem("currentCourse", JSON.stringify(currentCourse));
    localStorage.setItem("id", JSON.stringify(id));
}

window.addEventListener("load", () => {
    // check if localStorage has been set yet, if it has then retrieve it, if not then start from beginning
    if (JSON.parse(localStorage.getItem("scoreCards"))) {
        restoreSave();
    } else {
        printCourses();
    }

    document.getElementById("nav-button").addEventListener("click", openScorecardMenu);

    // when title is clicked, reset options, clear tables, and go back to start page
    document.querySelector("#header h2").addEventListener("click", () => {
        optionsPicked = ["tee", "holes"];
        playerInputs = [];
        currentCourse = {};

        clearTable();
        printCourses();
    });
});
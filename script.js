function printCourses() {
    // get golf courses API, return promise of JS (array with each course object)
    fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json")
        .then(response => response.json())

        // get array of each course object from previous promise, pass array to new function
        .then(courseList => {
            // show course selection HTML
            document.getElementById("course-select").classList.add("flex");
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
                    document.getElementById("course-select").classList.remove("flex");
                    document.getElementById("course-select").classList.add("hidden");
                    // call printCourseOptions function to show current course options HTML
                    printCourseOptions(element.id);
                })
            })
        })
}

function printCourseOptions(golfCourseId) {
    // get API for golf course that was clicked, return promise with course object JS
    fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`)
        .then(response => response.json())

        // get current course object from previous promise, pass object to new function
        .then(currentCourse => {
            // show current course options HTML
            document.getElementById("course-options").classList.add("flex");
            document.getElementById("course-options").classList.remove("hidden");

            // get the teeBoxes in the first hole and make string for HTML of current course tees
            let courseTees = currentCourse.holes[0].teeBoxes;
            let courseTeesHtml = "";

            courseTees.forEach((tee) => {
                // check if teeType exists and that it's not just auto change location before doing anything with it
                if (tee.teeType && tee.teeType !== "auto change location") {
                    // set variables for the colors, change colors of bg and text based on what the teeColorType is
                    let teeColor = tee.teeColorType;
                    let teeBgColor;
                    let textColor = "white";
                    if (teeColor === "black") {
                        teeBgColor = teeColor;
                    } else if (teeColor === "white") {
                        teeBgColor = "emerald-700";
                    } else if (teeColor === "yellow") {
                        teeBgColor = "yellow-300";
                        textColor = "black";
                    } else {
                        teeBgColor = `${teeColor}-700`;
                    }

                    // add button to string with the type and color (and styles) for each tee
                    courseTeesHtml += `<button id="${tee.teeType}" class="tee-select-btn py-2 px-6 border-2 shadow-md hover:bg-${teeBgColor} hover:text-${textColor}">${tee.teeType} / ${teeColor}</button>`;
                }
            })
            document.getElementById("tee-list").innerHTML = courseTeesHtml;
        })

        // after all tees have been added to HTML, call function to add event listeners to select options
        .then(() => selectTeeAndHoles(golfCourseId));
}
    
function selectTeeAndHoles(golfCourseId) {
    // set variables for if the tee and holes have been picked and an array for which options were picked
    let teePicked = false;
    let holesPicked = false;
    let optionsPicked = ["tee", "holes"];

    document.querySelectorAll(".tee-select-btn").forEach((element) => {
        element.addEventListener("click", () => {
            // check if the tee has already been picked and if not, set teePicked to true and add the id to the options array
            if (optionsPicked[0] === "tee") {
                teePicked = true;
                optionsPicked[0] = element.id;

                // make variables for hover color classes so when clicked, the colors stay solid instead of on hover
                let bgColor = element.classList[5];
                let textColor = element.classList[6];

                // split the strings on ":" to get rid of hover modifier and add the solid colors to the classLists
                let newBgColor = bgColor.split(":")[1];
                let newTextColor = textColor.split(":")[1];
                element.classList.add(newBgColor);
                element.classList.add(newTextColor);
            }
            
            // check if both options have been selected
            checkSelect(teePicked, holesPicked, optionsPicked, golfCourseId);
        })
    })

    document.querySelectorAll(".hole-select-btn").forEach((element) => {
        element.addEventListener("click", () => {
            // check if the holes have already been picked and if not, set holesPicked to true and add the innerHTML to the options array
            if (optionsPicked[1] === "holes") {
                holesPicked = true;
                optionsPicked[1] = element.innerHTML;
                
                // add solid color styles to hole select button after being clicked
                element.classList.add("bg-emerald-700");
                element.classList.add("text-white");
            }
            
            // check if both options have been selected
            checkSelect(teePicked, holesPicked, optionsPicked, golfCourseId);
        })
    })
}

function checkSelect(teePicked, holesPicked, optionsPicked, golfCourseId) {
    // if both tee and holes have been selected, hide course options HTML and call printScoreCard function
    if (teePicked === true && holesPicked === true) {
        document.getElementById("course-options").classList.remove("flex");
        document.getElementById("course-options").classList.add("hidden");
        
        printScoreCard(optionsPicked, golfCourseId);
    }
}
            
function printScoreCard(options, golfCourseId) {
    // set variables for scorecard container div and both front 9 and back 9 divs
    let scorecard = document.getElementById("scorecard")
    let front9 = document.getElementById("front-9");
    let back9 = document.getElementById("back-9");

    // show scorecard container
    scorecard.classList.remove("hidden");
    scorecard.classList.add("flex");

    // if front 9 was selected, only show front 9 table
    if (options[1] === "front 9") {
        front9.classList.remove("hidden");
        front9.classList.add("flex");
    } 
    // if back 9 was selected, only show back 9 table
    else if (options[1] === "back 9") {
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

    //console log selected options array and id of selected golf course to make sure it's working properly
    console.log(options, golfCourseId)
}

// call printCourses function to start chain of promises
printCourses();
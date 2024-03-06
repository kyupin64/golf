function printCourses() {
    // get golf courses API, return promise of JS (array with each course object)
    fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json")
        .then(response => response.json())

        // get array of each course object from previous promise, pass array to new function
        .then(courseList => {
            // make string for HTML of courses, loop through each object in courses array
            let coursesHtml = "";
            courseList.forEach((course) => {
                // add button to string with the course title and ID (and styles) for each course
                coursesHtml += `<button id=${course.id} class="course-select-btn py-2 px-6 border-2 shadow-md w-full hover:bg-emerald-700 hover:text-white">${course.name}</button>`;
            });
            // add string of HTML to course list HTML
            document.getElementById("course-list").innerHTML = coursesHtml;
        })

        // after all courses have been added to HTML, loop through each course button and add an event listener on click
        .then(() => {
            document.querySelectorAll(".course-select-btn").forEach((element) => {
                element.addEventListener("click", () => {
                    // call printCourseOptions function to change HTML from course selection to current course options screen
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
        .then(course => {
            // log the id of the current course to make sure the functions work
            console.log(course.id);
        })
}

// call printCourses function to start chain of promises
printCourses();
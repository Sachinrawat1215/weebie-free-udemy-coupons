fetch("https://udemy-backend-api.herokuapp.com/").then(response => response.json()).then((res) => {
    let data = res;
    // console.log(res);
    let title = data[0];
    let courseArray = data[1];
    let newArray = [];
    
    for (let i in title) {
        let stringArray = title[i];
        let stringLength = stringArray.text.length;
        let finalString = stringArray.text.slice(0, stringLength - 15);
        let courseLink = courseArray[i];
        newArray.push([finalString, courseLink]);
    }
    // console.log(newArray);
    let html = "";
    newArray.forEach(function (element, index) {
        html += `<div key=${index} class="single-course">
        <p>${element[0]}</p>
        <button><a href="${element[1].url}">Enroll Now</a></button>
    </div>`;
    });
    let courses = document.getElementById("courses");
    courses.innerHTML = html;
}).catch((e) => {
    console.log(e);
});
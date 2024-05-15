let darkMode = false;
const toggleButton = document.getElementById('toggle');
const body = document.body;
let wData; 
let cData; 

//Function to enable dark mode
toggleButton.addEventListener('click', function () {
    if (darkMode) {
        body.classList.remove('dark-mode');
        darkMode = false;
    } else {
        body.classList.add('dark-mode');
        darkMode = true;
    }
});
// trying to make the logo function as a home button
document.addEventListener("DOMContentLoaded", function() {
    const logo = document.getElementById("logo");

    logo.addEventListener("click", function() {
        history.back();
    });
});



let city = document.querySelector('.search-bar');
let categoryArr = [];


// Function to fetch data from a given URL
function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation', error);
        });
}

// Function to append city data based on user input 
function appendCity(event) {
    event.preventDefault();

    const city = document.querySelector('.search-bar').value;
    const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=c3023f6bd0f4493002d6feb29e0f0be6`;

    fetchData(geoApiUrl)
        .then(data => {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const weatherApiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c3023f6bd0f4493002d6feb29e0f0be6`;
            return fetchData(weatherApiUrl);
        })
        .then(weatherdata => {
            console.log('Weather Data received:', weatherdata);
            wData = weatherdata.list[0].weather[0].main;
            linkWeatherFood(wData);
            return wData; 

        });
}

const categoryList = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';

// Function to append food data
// function appendCategoryList() {
//     fetchData(categoryList)
//         .then(data => {
//             categoryArr = data.meals.map(item => Object.values(item));
//             return categoryArr;
//         })
//         .then(() =>{
//             console.log(categoryArr)
//         })
// }


// Function to append category data 
function appendCategory(selectedCategory) {
    //let selectedCategory;
    console.log("selected category: " + selectedCategory);
    let categoryUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;

    

    fetchData(categoryUrl)
        .then(data => {
            console.log('Category Data received:', data);

            //choose random value in category
            let random = Math.floor(Math.random() * data.meals.length);
            let name = data.meals[random].strMeal;

            let recipe = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
            console.log("NAME OF THE RECIPE: ", name);
            
            //Selects random recipe from category
            fetchData(recipe)
            .then(data => { ``
                
                recipeParts(data, name);
                return data})

        })
}

function appendButton(){
    let button = document.getElementById('taste-switch');
    button.addEventListener('click', appendCategory);
}



const typeWeather = ["Thunderstorm", "Drizzle", "Rain", "Snow", "Clear", "Clouds"];
const categories = ["Lamb", 'Pasta', 'Pork', 'Seafood', 'Side', 'Side', 'Vegetarian'];

function linkWeatherFood(wData){


    for (let i = 0; i < typeWeather.length; i++){
        if(typeWeather[i] == wData){
            cData = categories[i];
            console.log(cData);

            //Chooses corresponding categories and selects random recipe within that category
            console.log("this is returned" + appendCategory(cData));
            
    } 
    }
}


function recipeParts(rdata, name){
    console.log("Data for recipe:" , rdata);
    let recipe = rdata.meals[0];

    let category = recipe.strCategory;
    let instructions = recipe.strInstructions;
    let imageUrl = recipe.strMealThumb;
    
    let ingredientsList = [];  
    //I need help converting string to variable
    let i = 1;
    let strIn = "strIngredient" + i;
    console.log(recipe.strIn);
    // while(recipe.strIn != null){
    //    ingredientsList.push(recipe.strIndredients(i));
    //    i++;
    // }

   console.log("Name: ", name);
   console.log("Category", category);
   console.log("Instructions", instructions);
   console.log("url", imageUrl);

   //document.getElementById(recipe-name).innerHTML = name;

   //apend these variables to html elements
   
   document.getElementById("recipe-name").innerHTML = name;
   document.getElementById("recipe-instructions").innerHTML = instructions;

    
   document.getElementById.css("src", "imageUrl");

    

}


appendButton();
document.getElementById('submit').addEventListener('click', appendCity);

// link about us page to about us button on front page
document.addEventListener("DOMContentLoaded", function() {
    const aboutUsButton = document.getElementById("about-us");
  
    aboutUsButton.addEventListener("click", function() {
      window.location.href = "about.html";
    });
  });


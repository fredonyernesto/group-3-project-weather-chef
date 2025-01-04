let darkMode = false;
const toggleButton = document.getElementById('toggle');
const body = document.body;

toggleButton.addEventListener('click', function () {
    darkMode = !darkMode; // Toggles dark mode on/off
    if (darkMode) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const logo = document.getElementById("logo");

    logo.addEventListener("click", function () {
        history.back(); // Navigates back when logo is clicked
    });
});

let wData;
let cData;

function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function appendCity(event) {
    event.preventDefault();

    const city = document.querySelector('.search-bar').value;
    const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=c3023f6bd0f4493002d6feb29e0f0be6`;

    fetchData(geoApiUrl)
        .then(data => {
            const { lat, lon } = data[0];
            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c3023f6bd0f4493002d6feb29e0f0be6`;
            return fetchData(weatherApiUrl);
        })
        .then(weatherdata => {
            const wIcon = weatherdata.list[0].weather[0].icon;
            const weatherIconUrl = `https://openweathermap.org/img/wn/${wIcon}@2x.png`;
            document.getElementById('weather-png').src = weatherIconUrl;

            const weatherDescriptionElement = document.getElementById('weather-info');
            const description = weatherdata.list[0].weather[0].description.toUpperCase();
            weatherDescriptionElement.textContent = description;

            wData = weatherdata.list[0].weather[0].main;
            linkWeatherFood(wData);
        });
}

function appendCategory(selectedCategory) {
    const categoryUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;

    fetchData(categoryUrl)
        .then(data => {
            const random = Math.floor(Math.random() * data.meals.length);
            const randomMeal = data.meals[random];
            const name = randomMeal.strMeal;
            const recipeUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;

            fetchData(recipeUrl)
                .then(data => {
                    recipeParts(data, name);
                });
        });
}

const typeWeather = ["Thunderstorm", "Drizzle", "Rain", "Snow", "Clouds", "Clear"];
const categories = ["Chicken", 'Pasta', 'Beef', 'Seafood', 'Dessert', 'Side', 'Vegetarian'];

function linkWeatherFood(wData) {
    for (let i = 0; i < typeWeather.length; i++) {
        if (typeWeather[i] === wData) {
            cData = categories[i];
            appendCategory(cData);
            break; // No need to continue looping once a match is found
        }
    }
}

function recipeParts(rdata, name) {
    const recipe = rdata.meals[0];
    const category = recipe.strCategory;
    const instructions = recipe.strInstructions;
    const recipePNG = recipe.strMealThumb;

    const recipeObj = {
        Category: category,
        Instructions: instructions,
        Recipe: recipePNG
    };

    const ingredientsList = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredientsList.push(ingredient);
        } else {
            break; // No need to continue if there are no more ingredients
        }
    }

    document.getElementById("recipe-name").innerHTML = name;
    document.getElementById("recipe-instructions").innerHTML = instructions;
    document.getElementById('recipe-image').src = recipePNG;

    const htmlRecipe = document.getElementById("recipe-ingredientlist");
    htmlRecipe.innerHTML = ''; // Clear previous ingredients
    ingredientsList.forEach(ingredient => {
        const listItem = document.createElement('li');
        listItem.innerHTML = ingredient;
        htmlRecipe.appendChild(listItem);
    });

    localStorage.setItem('currentRecipe', JSON.stringify(recipeObj));
}

function cookbooktemp() {
    const recipeObj = JSON.parse(localStorage.getItem('currentRecipe'));
    if (recipeObj) {
        const cookbook = JSON.parse(localStorage.getItem('cookbook') || '[]');
        cookbook.push(recipeObj);
        localStorage.setItem('cookbook', JSON.stringify(cookbook));
        console.log(cookbook);
    }
}

document.getElementById('save-to-cookbook').addEventListener('click', cookbooktemp);
document.getElementById('submit').addEventListener('click', appendCity);

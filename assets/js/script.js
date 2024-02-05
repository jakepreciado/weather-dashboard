var weatherApi = "2686992686c499b3bb85a5b7f6343bd1";
var searchBtn = document.getElementById("searchBtn");
var input = document.getElementById("input");

// Tested. API Keys is working correctly //
function requestApi(weatherApi) {
    fetch(weatherApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
}
///////////////////////////////////////////

// Retrieve existing array or initialize an empty array
var cities = JSON.parse(localStorage.getItem("searchedCities")) || [];

// Display cities from local storage on page load
displayCities();

// Search Button Event
searchBtn.addEventListener("click", function(event) {
    event.preventDefault();

    function capitalizeFirstLetter(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    var inputCity = capitalizeFirstLetter(input.value.trim());

    if (inputCity !== "") {
        if (!cities.includes(inputCity)) {
            cities.push(inputCity);

            // Save the updated array back to localStorage
            localStorage.setItem("searchedCities", JSON.stringify(cities));

            displayCities();
        }
        getCity(inputCity);
    }
});

// Function to display the list of recently searched cities
function displayCities() {
    // Clear existing list
    citiesList.innerHTML = "";

    cities.forEach(function(city) {
        var button = document.createElement("button");
        button.textContent = city;
        button.classList.add("btn", "btn-secondary", "city-btn"); 
        button.addEventListener("click", function() {
            getCity(city);
        });
        citiesList.appendChild(button);
    });
}


function getCity(input) {
    var requestApi = queryUrlCity = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + weatherApi + "&units=imperial";
    var cityName = document.getElementById("searchedCity");
    var temp = document.getElementById("temperature");
    var wind = document.getElementById("wind");
    var humidity = document.getElementById("humidity");

    fetch(requestApi)
        .then(function(response){
            return response.json();
        })            
        .then(function(data) {
            console.log(data);

            var lat = data.coord.lat;
            var lon = data.coord.lon;
            console.log(lat,lon)

            var icon = ' <img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="Weather Icon"></img>'

            cityName.innerHTML = data.name + icon;
            temp.textContent = "Temperature: " + data.main.temp + "°F";
            wind.textContent = "Wind: " + data.wind.speed + ' mph';
            humidity.textContent = "Humidity: " + data.main.humidity + "%";
                   
            getWeather(lat, lon);
        })
}

function getWeather(lat, lon) {
    var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherApi + "&units=imperial";

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            // Initialize an object to store forecast data by day
            var forecastByDay = {};

            // Loop through the forecast data
            data.list.forEach(function (forecast) {
                // Extract the date without the time
                var date = new Date(forecast.dt * 1000).toISOString().split('T')[0];

                // If the date is not already in the forecastByDay object, add it
                if (!forecastByDay[date]) {
                    forecastByDay[date] = {
                        temperature: forecast.main.temp,
                        weather: forecast.weather[0].description,
                        icon: forecast.weather[0].icon,
                        wind: forecast.wind.speed,
                        humidity: forecast.main.humidity
                    };
                }
            });

            // Clear existing forecast cards
            var forecastCardsContainer = document.getElementById("forecastCards");
            forecastCardsContainer.innerHTML = "";
            var cardCount = 0;
            for (var day in forecastByDay) {
                if (cardCount < 5) {
                    var cardHtml = `
                        <div class="card mx-3 mb-3" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${day}</h5>
                                <img src="http://openweathermap.org/img/w/${forecastByDay[day].icon}.png" alt="Weather Icon">
                                <h6 class="card-text mb-2">Temperature: ${forecastByDay[day].temperature}°F</h6>
                                <h6 class="card-text">Wind: ${forecastByDay[day].wind} mph</h6>
                                <h6 class="card-text">Humidity: ${forecastByDay[day].humidity}%</h6>
                            </div>
                        </div>
                    `;

                    forecastCardsContainer.innerHTML += cardHtml;
                    cardCount++;
                }
            }
        })
        .catch(function (error) {
            console.error("Error fetching forecast data:", error);
        });
}




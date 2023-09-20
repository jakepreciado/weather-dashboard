var weatherApi = "2686992686c499b3bb85a5b7f6343bd1";
var searchBtn = document.getElementById("searchBtn");
var input = document.getElementById("input");
var cities = document.getElementById("listCity");

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

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    var input = document.getElementById("input").value;
    console.log(input);

    getCity(input);
  
})


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

            cityName.textContent = data.name;
            temp.textContent = "Temperature: " + data.main.temp + "°F";
            wind.textContent = "Wind: " + data.wind.speed + ' mph';
            humidity.textContent = "Humidity: " + data.main.humidity + "%";
                   
            getWeather(lat, lon);
        })
}

function getWeather(lat, lon){
    var requestURl = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid="+weatherApi+"&units=imperial";

    fetch(requestURl)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        for (var i = 1; i < 6; i++) {
            var date = ((data.list[i].dt) * 1000);
            var newDay = date + 84600;
            console.log(new Date(newDay));
        }
    })
}



const API_Key_OpenWeatherMap = "bda75bc7b1ffd81c271304eac312b65c";


// Constants for Open Weather Map API - get latitude and longitude by City Name
const baseUrl_get_latlong_by_cityName = "http://api.openweathermap.org/data/2.5/weather";

// Constants for Open Weather Map API - get City Weather by Latitude and Longitude
const baseUrl_get_CityWeather_by_latlong = "https://api.openweathermap.org/data/2.5/forecast";


// Constants for Open Weather Map API - Image Icon Urls 
const firstPartImageIconUrl = "https://openweathermap.org/img/wn/";
const lastPartImageIconUrl = "@2x.png";


// Constant for key for local storage
const localStorageKey_WeatherDashboard= "weather-dashboard";


// Constant for degrees symbol
const degreesSymbol = '\u00B0'


let cityName; 


// Cities Array
let citiesArray = [];



$(document).ready(function() {
    // Read from Local Storage and load buttons for Cities
    readFromLocalStorage();
});



$("#search").on("click", function (event) {

    // Read search string from form
    searchText = $("#search-text").val();

    if (searchText==="") {
    }    
    else
    {
        // Get latitude and longitude via openweathermap api and then update weather on screen
        cityName = searchText;
        getCityLatitudeLongitude(cityName);
    
    }
})


// Function used to get latitude and longitude via openweathermap api and then update weather on screen
function getCityLatitudeLongitude(cityName) {
    
    // Build url string to get latitude and longitude for a given city 

    // Using Query Parameters
    const params = new URLSearchParams();
    params.append('q', cityName);
    params.append('appid', API_Key_OpenWeatherMap);
    
    // Join base URL with query parameters
    const url = `${baseUrl_get_latlong_by_cityName}?${params.toString()}`;
    

    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        // Read latitude from data object for a given city
        latitude = data.coord.lat;

        // Read longitude from data object for a given city
        longitude = data.coord.lon;      

        Perform_Updates_Now_With_LatLong(latitude, longitude) 
    })
    .catch(function (error) {
        // Initialise search text field to blank
        $("#search-text").val("");

        // Hide current Weather Header
        $("#current-weather-header").addClass("hide");
        alert(`'${cityName}' is not a valid city`);      
    });        
}


// Function used to get weather details via openweathermap api and then update weather on screen
function getCityWeather(cityName, latitude, longitude) {

    // Build url string to get weather for a given city based on it's latitude and longitude

    // Using Query Parameters
    const params = new URLSearchParams();
    params.append('lat', latitude);
    params.append('lon', longitude);
    params.append('units', 'metric');
    params.append('appid', API_Key_OpenWeatherMap);
    
    // Join base URL with query parameters
    const url = `${baseUrl_get_CityWeather_by_latlong}?${params.toString()}`;


    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        updateWeatherOnScreen(cityName, data);
    })
    .catch(function (error) {
        alert(error); 
        return false;     
    });        
     
    return true;
}


// Reusable function to extract weather details from a data object
function getWeatherDetails(data) {
    return {
        description: data.weather[0].description,
        weatherDate: getDateInFormat_ddmmyyyy(data.dt_txt),
        temperatureCelsius: data.main.temp,
        // Convert Windspeed to KPH
        windSpeedKPH: data.wind.speed * 3.6, 
        humidityPercent: data.main.humidity,
        icon: data.weather[0].icon
    };
}


// Filter data object and return an array containing forecasted 5 days data for a city
function filterForecastNextFiveDays(data) {

    // Identify last date and time available in last entry
    let lastDate = data.list[data.list.length - 1].dt_txt;
    timeAvailableInLastDate = getTimeFromDateString(lastDate);


    // Now filter data2 to get just forecast data for that time each day
    let filter = data.list.filter(item => {
        const date = new Date(item.dt * 1000);
        return date.getHours() === timeAvailableInLastDate;
    })

    // Build up forecastArray
    let forecastArray = [];
    
    filter.forEach(function (element) {
        let forecast = getWeatherDetails(element);
        forecastArray.push(forecast);
    });

    return forecastArray;

}

// Using day.js library to return a given date in format : DD/MM/YYYY
function getDateInFormat_ddmmyyyy(dt) {
    const dayjsInstance = dayjs(dt);
    return dayjsInstance.format("DD/MM/YYYY");
}


// Extract time from date string
function getTimeFromDateString(dateIncludingTime) {
    const dayjsInstance = dayjs(dateIncludingTime);
    return dayjsInstance.hour();
}   


// Create dynamic button for City
// It will store latitude and longitude within attributes : data-latitude and data-longitude
// so that it can be used later when user clicks on city button, then we can read these
// values and then display weather details by a single API call.

function createButton(cityName, latitude, longitude) {
    var $button = $("<button>", {
        text: cityName, 
        class: "btn cityButtons btn-primary-hover-shadow large-button mb-3 w-100", 
        click: function() { 
            var latitude = $(this).attr("data-latitude");
            var longitude = $(this).attr("data-longitude");

            getCityWeather(cityName, latitude, longitude);
        }
    });

    $button.attr({
        'type': 'button',
        'data-latitude': latitude,
        'data-longitude': longitude
    });

    var $buttonWrapper = $("<div>");
    $buttonWrapper.append($button);
    $("#buttons-view").append($buttonWrapper);
}



// Add City name, latitude and longitude to 'citiesArray'.
// We are storing the latitude and longitude, so when
// user clicks on city button, then we can read these
// values and then display weather details by a single API call.
function addCityToArray(name, latitude, longitude) {
    let cityObject = {
        name: name,
        latitude: latitude,
        longitude: longitude
    };   
    citiesArray.push(cityObject);
}



// Dynamically update HTML using variable cityName and data object passed to this function as parameter
function updateWeatherOnScreen(cityName, data) {

    // Validation on data.list.length
    if (data.list.length <40) {
        return false;
    }

    // Populate Weather Data for today from data object
    let forecastToday = getWeatherDetails(data.list[0]);

    // Validate on forecastToday that it is populated
    if (!forecastToday) {
        return false;
    }

    // Populate Weather Data for Forecast Days 1 to 5  from data object
    let forecastFiveDaysArray = filterForecastNextFiveDays(data);

    // Validate on forecastFiveDaysArray.length
    if (forecastFiveDaysArray.length !==5) {
        return false;
    }

    // Dynamically populate City name and date for today in header in HTML
    $(".city-header-current").text(`${cityName} (${forecastToday.weatherDate})`);
        

    // Dynamically add weather icon image for today in header in HTML
    var imageUrl = `${firstPartImageIconUrl}${forecastToday.icon}@2x.png`;


    $(".city-header-current").append($("<img>", { src: imageUrl, alt: forecastToday.description }));      

    // Dynamically populate temperature for today in header in HTML
     $(".temp").text(`Temp: ${forecastToday.temperatureCelsius} ${degreesSymbol}C`);

    // Dynamically populate wind speed for today in header in HTML
    $(".wind").text(`Wind: ${forecastToday.windSpeedKPH.toFixed(2)} KPH`);


    // Dynamically populate humidity for today in header in HTML
    $(".humidity").text(`Humidity: ${forecastToday.humidityPercent}%`);


    // Remove class: hide so current weather header is displayed
    $("#current-weather-header").removeClass("hide");


    // Initialise search text field to blank
    $("#search-text").val("");

    // Clear out all appended images
    for (var i = 0; i <= 4; i++) {
        $(`#card${i+1}-image`).empty("");
    }


    // Dynamically add dates for the Forecast Days 1 to 5
    for (var i = 0; i <= 4; i++) {
        $(`#card${i+1}-date`).text(forecastFiveDaysArray[i].weatherDate);
    }
   
    // Dynamically add weather icon images for the Forecast Days 1 to 5
    for (var i = 0; i <= 4; i++) {
        let imageUrl = buildImageIconUrl (forecastFiveDaysArray[i].icon)
        $(`#card${i+1}-image`).append($("<img>", { src: imageUrl, alt: forecastFiveDaysArray[i].description }));      
    }

    // Dynamically update HTML for temperature for the Forecast Days 1 to 5
    for (var i = 0; i <= 4; i++) {
        $(`#card${i+1}-temp`).text(`Temp: ${forecastFiveDaysArray[i].temperatureCelsius} ${degreesSymbol}C`);
    }

    // Dynamically update HTML for wind speed for the Forecast Days 1 to 5
    for (var i = 0; i <= 4; i++) {
        $(`#card${i+1}-wind`).text(`Wind: ${forecastFiveDaysArray[i].windSpeedKPH.toFixed(2)} KPH`);
    }

    // Dynamically update HTML for humidity for the Forecast Days 1 to 5
    for (var i = 0; i <= 4; i++) {
        $(`#card${i+1}-humidity`).text(`Humidity: ${forecastFiveDaysArray[i].humidityPercent}%`);
    }
}


// Writes to local storage based on key defined in variable: 'localStorageKey_WeatherDashboard'
function writeToLocalStorage() {

    // Converts the calendarData array to the JSON notation that the value represents
    var jsonCitiesData = JSON.stringify(citiesArray);
  
    // Write to localstorage on key
    localStorage.setItem(localStorageKey_WeatherDashboard, jsonCitiesData);
}


// Read from local storage based on key defined in variable: 'localStorageKey_WeatherDashboard'
function readFromLocalStorage() {

    var storedData = localStorage.getItem(localStorageKey_WeatherDashboard);

    if (storedData) {
        citiesArray = JSON.parse(storedData);
        
        for (var i = 0; i < citiesArray.length; i++) {
            createButton(citiesArray[i].name, citiesArray[i].latitude, citiesArray[i].longitude);
        }
    }
}


// function to get city weather now that we know latitude and longitude
function Perform_Updates_Now_With_LatLong(latitude, longitude) {
 
    if (getCityWeather(cityName, latitude, longitude)) {
        createButton(cityName, latitude, longitude);
        addCityToArray(cityName, latitude, longitude)
        writeToLocalStorage();   
    }
}


// function to build weather image icon url
function buildImageIconUrl(icon) {
    return `${firstPartImageIconUrl}${icon}${lastPartImageIconUrl}`;
}
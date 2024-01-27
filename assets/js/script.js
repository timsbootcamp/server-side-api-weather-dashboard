
const API_Key_OpenWeatherMap = "bda75bc7b1ffd81c271304eac312b65c";
const degreesSymbol = '\u00B0'

//let city = "London";
let city;

let latitude;
let longitude;


let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key_OpenWeatherMap}`;



$("#search").on("click", function (event) {
    event.preventDefault();

    // Read search string from form
    searchText = $("#search-text").val();
    city = searchText;
    
    // // var $temperature = $(".temp");
    // $(".temp").text("Temp: <Not Available>");

    // // var $wind = $(".wind");
    // $(".wind").text("Wind: <Not Available>");

    // // var $wind = $(".humidity");
    // $(".humidity").text("Humidity: <Not Available>");


    getCityLatitudeLongitude(city);
    
    console.log();   
})



function getCityLatitudeLongitude(city) {
    
    let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key_OpenWeatherMap}`;
    
    fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        latitude = data.coord.lat;
        longitude = data.coord.lon;      

        getCityWeather(latitude, longitude);
    })
    .catch(function (error) {
        // Initialise search text field to blank
        $("#search-text").val("");

        // Hide current Weather Header
        $("#current-weather-header").addClass("hide");
        alert(city + " is not a valid city");      
    });        
}


function getCityWeather(latitude, longitude) {

    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_Key_OpenWeatherMap}`;
    
    fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
         let forecastToday = getWeatherDetails(data.list[0]);
         let forecastFiveDaysArray = filterForecastNextFiveDays(data);
         createButton(latitude, longitude);
         $(".city-header-current").text(city + " (" + (forecastToday.weatherDate) + ")");
       
         var imageUrl = "https://openweathermap.org/img/wn/" + forecastToday.icon + "@2x.png";
         $(".city-header-current").append($("<img>", { src: imageUrl, alt: forecastToday.description }));      

         $(".temp").text("Temp: " + forecastToday.temperatureCelsius + degreesSymbol + "C");
         $(".wind").text("Wind: " + forecastToday.windSpeedKPH.toFixed(2) + " KPH");
         $(".humidity").text("Humidity: " + forecastToday.humidityPercent + "%");
         $("#current-weather-header").removeClass("hide");
    
         // Initialise search text field to blank
         $("#search-text").val("");
    });     
}


function getWeatherDetails(data) {

    console.log("");

    return {
        description: data.weather[0].description,
        weatherDate: getDateInFormat_ddmmyyyy(data.dt_txt),
        temperatureCelsius: data.main.temp,
        windSpeedKPH: data.wind.speed * 3.6,
        humidityPercent: data.main.humidity,
        icon: data.weather[0].icon
    };
}


function filterForecastNextFiveDays(data) {

    // Identify last date and time available in last entry
    let lastDate = data.list[data.list.length - 1].dt_txt;
    timeAvailableInLastDate = getTimeFromDateString(lastDate);


    // Now filter data2 to get just forecast data for that time each day
    let filter = data.list.filter(item => {
        const date = new Date(item.dt * 1000);
        return date.getHours() === timeAvailableInLastDate;
    })

    let forecastArray = [];

    filter.forEach(function (element) {
        let forecast = getWeatherDetails(element);
        forecastArray.push(forecast);
    });

    return forecastArray;

}


function getDateInFormat_ddmmyyyy(dt) {
    const dayjsInstance = dayjs(dt);
    return dayjsInstance.format("DD/MM/YYYY");
}


function getTimeFromDateString(dateIncludingTime) {
    const dayjsInstance = dayjs(dateIncludingTime);
    return dayjsInstance.hour();
}   




function createButton(latitude, longitude) {
    var $button = $("<button>", {
        text: city, 
        class: "btn light-blue-btn large-button mb-3 w-100", 
        click: function() { 
            var latitude = $(this).attr("data-latitude");
            var longitude = $(this).attr("data-longitude");

            console.log("");
        }
    });

    $button.attr({
        'data-latitude': latitude,
        'data-longitude': longitude
    });

    var $buttonWrapper = $("<div>");
    $buttonWrapper.append($button);
    $("#buttons-view").append($buttonWrapper);
    console.log("");
}
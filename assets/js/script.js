
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
         
         // Clear out all appended images
         $("#card1-image").empty("")
         $("#card2-image").empty("")
         $("#card3-image").empty("")
         $("#card4-image").empty("")
         $("#card5-image").empty("")


        //
        //card2-date
        
        // !!! VALIDATION TODO !!!
        $("#card1-date").text(forecastFiveDaysArray[0].weatherDate);
        $("#card2-date").text(forecastFiveDaysArray[1].weatherDate);
        $("#card3-date").text(forecastFiveDaysArray[2].weatherDate);
        $("#card4-date").text(forecastFiveDaysArray[3].weatherDate);
        $("#card5-date").text(forecastFiveDaysArray[4].weatherDate);


        //
        var imageUrl = "https://openweathermap.org/img/wn/" + forecastFiveDaysArray[0].icon + "@2x.png";
        $("#card1-image").append($("<img>", { src: imageUrl, alt: forecastFiveDaysArray[0].description }));      

        imageUrl = "https://openweathermap.org/img/wn/" + forecastFiveDaysArray[1].icon + "@2x.png";
        $("#card2-image").append($("<img>", { src: imageUrl, alt: forecastFiveDaysArray[1].description }));      

        imageUrl = "https://openweathermap.org/img/wn/" + forecastFiveDaysArray[2].icon + "@2x.png";
        $("#card3-image").append($("<img>", { src: imageUrl, alt: forecastFiveDaysArray[2].description }));      

        imageUrl = "https://openweathermap.org/img/wn/" + forecastFiveDaysArray[3].icon + "@2x.png";
        $("#card4-image").append($("<img>", { src: imageUrl, alt: forecastFiveDaysArray[3].description }));      

        imageUrl = "https://openweathermap.org/img/wn/" + forecastFiveDaysArray[4].icon + "@2x.png";
        $("#card5-image").append($("<img>", { src: imageUrl, alt: forecastFiveDaysArray[4].description }));      

        //


        $("#card1-temp").text("Temp: " + forecastFiveDaysArray[0].temperatureCelsius + " " + degreesSymbol + "C");
        $("#card2-temp").text("Temp: " + forecastFiveDaysArray[1].temperatureCelsius + " " + degreesSymbol + "C");
        $("#card3-temp").text("Temp: " + forecastFiveDaysArray[2].temperatureCelsius + " " + degreesSymbol + "C");
        $("#card4-temp").text("Temp: " + forecastFiveDaysArray[3].temperatureCelsius + " " + degreesSymbol + "C");
        $("#card5-temp").text("Temp: " + forecastFiveDaysArray[4].temperatureCelsius + " " + degreesSymbol + "C");

        $("#card1-wind").text("Wind: " + forecastFiveDaysArray[0].windSpeedKPH.toFixed(2) + " KPH");
        $("#card2-wind").text("Wind: " + forecastFiveDaysArray[1].windSpeedKPH.toFixed(2) + " KPH");
        $("#card3-wind").text("Wind: " + forecastFiveDaysArray[2].windSpeedKPH.toFixed(2) + " KPH");
        $("#card4-wind").text("Wind: " + forecastFiveDaysArray[3].windSpeedKPH.toFixed(2) + " KPH");
        $("#card5-wind").text("Wind: " + forecastFiveDaysArray[4].windSpeedKPH.toFixed(2) + " KPH");

        $("#card1-humidity").text("Humidity: " + forecastFiveDaysArray[0].humidityPercent + "%");
        $("#card2-humidity").text("Humidity: " + forecastFiveDaysArray[1].humidityPercent + "%");
        $("#card3-humidity").text("Humidity: " + forecastFiveDaysArray[2].humidityPercent + "%");
        $("#card4-humidity").text("Humidity: " + forecastFiveDaysArray[3].humidityPercent + "%");
        $("#card5-humidity").text("Humidity: " + forecastFiveDaysArray[4].humidityPercent + "%");

        //


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
        'type': 'button',
        'data-latitude': latitude,
        'data-longitude': longitude
    });

    // $button.attr("type", "button");

    var $buttonWrapper = $("<div>");
    $buttonWrapper.append($button);
    $("#buttons-view").append($buttonWrapper);
    console.log("");
}

const API_Key_OpenWeatherMap = "bda75bc7b1ffd81c271304eac312b65c";

let city = "London";

let latitude;
let longitude;


let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key_OpenWeatherMap}`;



$("#search").on("click", function (event) {
    event.preventDefault();

    // Read search string from form
    searchText = $("#search-text").val();
    
    var $temperature = $(".temp");
    $(".temp").text("Temp: <Not Available>");

    var $wind = $(".wind");
    $(".wind").text("Wind: <Not Available>");

    var $wind = $(".humidity");
    $(".humidity").text("Humidity: <Not Available>");

    console.log();   
})





fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        latitude = data.coord.lat;
        longitude = data.coord.lon;

        let query2URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_Key_OpenWeatherMap}`;
        return fetch(query2URL);
    })
    .then(response => response.json())
    .then(data2 => {
        let forecastToday = getWeatherDetails(data2.list[0]);
        let forecastFiveDaysArray = filterForecastNextFiveDays(data2);
    });



    function getWeatherDetails(data) {

    return {
        weatherDate: getDateInFormat_ddmmyyyy(data.dt_txt),
        temperatureCelsius: data.main.temp,
        windSpeedKPH: data.wind.speed * 3.6,
        humidityPercent: data.main.humidity
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


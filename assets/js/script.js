
const API_Key_OpenWeatherMap = "bda75bc7b1ffd81c271304eac312b65c";

let city = "London";

let latitude;
let longitude;


let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key_OpenWeatherMap}`;



fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {

        latitude = data.coord.lat;
        longitude = data.coord.lon;                                      
    });

    

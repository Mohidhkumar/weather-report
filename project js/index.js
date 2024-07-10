const Cityinput = document.querySelector(".City-input");
const searchbutton = document.querySelector(".search-button");
const locationbutton=document.querySelector(".location-button")
const currentweatherdiv=document.querySelector(".current-weather");
const weathercarddiv=document.querySelector(".weather-card");
const API_KEY = "e62e06770f5a502e47e53ac3562850a5";
 const createWeatherCard=( cityname,weatherItem,index) =>{
    if(index === 0){
        return` <div class="details">
                    <h2>${cityname}(${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature:${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind:${weatherItem.wind.speed}M/s</h4>
                <h4>Humidity:${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h4>${weatherItem.weather[0].description}</h4>
                </div>
            </div>`;
    }else{
        return` <li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h4>Temp:${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind:${weatherItem.wind.speed}M/s</h4>
                <h4>Humidity:${weatherItem.main.humidity}%</h4>
            </li>`;
    }
}
const weatherdetails = (cityname, lat, lon) => {
    const weatherapi1 = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(weatherapi1).then(res => res.json()).then(data => {
        const uniqueforecastdays = [];
        const fivedaysforecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueforecastdays.includes(forecastDate)) {
                return uniqueforecastdays.push(forecastDate);  }
        });
        Cityinput.value = "";
        currentweatherdiv.innerHTML="";
        weathercarddiv.innerHTML = "";
        fivedaysforecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentweatherdiv.insertAdjacentHTML("beforeend", createWeatherCard( cityname,weatherItem,index));
            }else{
                weathercarddiv.insertAdjacentHTML("beforeend", createWeatherCard( cityname,weatherItem,index));
            }
           
        });
    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    });
}
const getcity = () => {
    const cityname = Cityinput.value.trim();
    if (!cityname) return;
    console.log(cityname);
    const weatherapi = `http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${API_KEY}`;
    fetch(weatherapi).then(res => res.json()).then(data => {
        console.log(data);
        if (!data.length) return alert(`No coordinates found for ${cityname}`);
        const { name, lat, lon } = data[0];
        weatherdetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!")
    });
}
usercurrentlocation=() =>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const { latitude, longitude}= position.coords;
            const REVERSE_GEOCODING_URL=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name} = data[0];
                weatherdetails(name, latitude,longitude);
               
            }).catch(() => {
                alert("An error occured while fetching the city!")
            });
        },
        error=()=>{
           if(error.code === error.PERMISSION_DENIED){
            alert("Geolocation request denied. please reset location permission to grant access again.");
           }

        }
    );
}
locationbutton.addEventListener("click",usercurrentlocation);
searchbutton.addEventListener("click", getcity);
Cityinput.addEventListener("keyup", e => e.key === "Enter" && getcity());
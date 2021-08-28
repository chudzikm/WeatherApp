// https://www.weatherbit.io/ API
const apiKey = 'b948d1aa01ff420cb865cf6e23f212c6';
const apiUrl = 'https://api.weatherbit.io/v2.0/';

const input = document.querySelector('.form__input');
const btn = document.querySelector('.form__btn');
const messageBox = document.querySelector('.form__message')
const section = document.querySelector('.section--weather');
const cta = document.querySelector('.cta');
const geoLocationBtn = document.querySelector('.form__geolocation');
let clickSrc;

// The first capital letter for the name of the city
const firstCapitalLetter = (word) => {
    return word[0].toUpperCase() + word.slice(1);
}
// A message with error under the search box
const errorMsg = (message) => {
    messageBox.classList.remove('form__message--hidden');
    messageBox.innerText = message;
}

//scroll to the section
const scrollToSection = () =>{
    const targets = document.querySelectorAll('[data-target]');
    const names = document.querySelectorAll('[data-name]');

    targets.forEach(target => {
        names.forEach(name => {
            if (name.hasAttribute(name) === target.hasAttribute(target)) {
                name.scrollIntoView()
            }
        });
    });
}

cta.addEventListener('click', () =>{
    document.documentElement.scrollTop = 0;
})

//remove the boxes with the forecast
const removeForecastBoxes = () =>{
    const boxes = document.querySelectorAll('.forecast');
    boxes.forEach(box => {
        box.remove();
    });
}

// Get the name of the city
const getCityName = () => {
   return new Promise((resolve) =>{
        cityName = input.value;
        resolve(cityName);
   })
}

// Current weather
const getCurrentWeather = (location) =>{
    return(
        fetch(apiUrl + 'current?&' + (clickSrc=='searchBtn' ? ('city=' + location) : ('&lat=' + location.coords.latitude + '&lon=' + location.coords.longitude)
        ) + '&key=' + apiKey + '&lang=pl')
        .then (response => {
            return  (response.status == 200 ? response.json() : errorMsg('Niestety tej miejscowości nie znaleziono, wpisz inną i wyszukaj ponownie.'))
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error(error);
        })
    )
 }

const showCurrentWeather = (data) =>{
        const place = document.querySelector('.city__name');
        console.log(data)
        const {
            app_temp:feelsLikeTemp,
            city_name:cityName,
            lat, lon,
            rh: humidity, 
            sunrise, 
            sunset, 
            slp:pressure,
            vis:visibility, 
            temp, 
            weather, 
            wind_spd:windSpeed
            } = data.data[0];

        if (clickSrc=='searchBtn') {
            place.innerHTML = cityName;
            
        } else {
            place.innerHTML = `
            Szerokość geograficzna: ${lat.toFixed(2)}<sup>o</sup><br> 
            Długość geograficzna: ${lon.toFixed(2)}<sup>o</sup>`
        }

        document.querySelector('.sun__sunrise').textContent = `${Number(sunrise.slice(0,2))+2}:${sunrise.slice(-2)}`
        document.querySelector('.sun__sunset').textContent = `${Number(sunset.slice(0,2))+2}:${sunset.slice(-2)}`;
        document.querySelector('.current-weather__icon').src = `dist/images/icons/${weather.icon}.svg`;
        document.querySelector('.current-weather__name').textContent = weather.description;
        document.querySelector('.current-weather__temp').innerHTML = `${temp} <sup>o</sup>C`;
        document.querySelector('.current-weather__feels-like').textContent = feelsLikeTemp;
        document.querySelector('.current-weather__pressure').textContent = pressure;
        document.querySelector('.current-weather__humidity').textContent = humidity;
        document.querySelector('.current-weather__visibility').textContent = visibility;
        document.querySelector('.current-weather__wind-speed').textContent = (windSpeed * 3.6).toFixed(2);
}

// Forecast
    const getForecast = (location) => {
    return(
        fetch(apiUrl + 'forecast/daily?&' + (clickSrc=='searchBtn' ? ('city=' + location) : ('&lat=' + location.coords.latitude + '&lon=' + location.coords.longitude)
        ) + '&key=' + apiKey + '&lang=pl')
       .then(response => response.json())
       .then(data => {
          return data;
       })
       .catch(error => {
        console.error(error)
        })
    )
}

const showForecast = (data) => {
    const dailyForecast = data.data
    console.log(dailyForecast)
    removeForecastBoxes();

    dailyForecast.forEach(item => {
        const forecastBox = document.createElement('div');
        const date = document.createElement('span');
        const name = document.createElement('span');
        const temp = document.createElement('span');
        const icon = document.createElement('img');
        section.insertBefore(forecastBox, cta).classList.add('forecast');
        forecastBox.appendChild(date).classList.add('forecast__date');
        forecastBox.appendChild(icon).classList.add('forecast__icon');
        forecastBox.appendChild(name).classList.add('forecast__name');
        forecastBox.appendChild(temp).classList.add('forecast__temp');
        forecastBox.querySelector('.forecast__date').innerText = item.valid_date.substr(5).split('-').reverse().join('.');
        forecastBox.querySelector('.forecast__icon').src = `dist/images/icons/${item.weather.icon}.svg`;
        forecastBox.querySelector('.forecast__name').innerText = firstCapitalLetter(item.weather.description);
        forecastBox.querySelector('.forecast__temp').innerHTML = `${item.temp.toFixed(0)} <sup>o</sup>C`;
    });
    
}

//geolocation
const getGeoLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(resolve,reject);

        }
    })
}

// show latitude and longitude
const showPosition = (position) => {
    document.querySelector('.city__name').innerHTML = `
    Szerokość geograficzna: ${position.coords.latitude.toFixed(2)}<sup>o</sup><br> 
    Długość geograficzna: ${position.coords.longitude.toFixed(2)}<sup>o</sup>
    `
}


/////////////start Application/////////////////
const startApp = async() => {
    const data = clickSrc == 'searchBtn' ? await getCityName() : await getGeoLocation();
    const currentWeather = await getCurrentWeather(data);
    showCurrentWeather(currentWeather);
    const forecast = await getForecast(data);
    showForecast(forecast);
    section.classList.remove('section--hidden');
    scrollToSection();
}


btn.addEventListener('click', function(e){
    e.preventDefault();
    clickSrc = 'searchBtn';
    input.value!=='' ? startApp() : errorMsg('Wpisz nazwę miejscowości, żeby sprawdzić pogodę.')
})

input.addEventListener('keydown', function(e){
    if (e.keydown=='enter') {
        e.preventDefault();
        clickSrc = 'searchBtn';
        startAppCityName()
    }
})

geoLocationBtn.addEventListener('click', ()=>{
    clickSrc = 'geoBtn';
    startApp();
})
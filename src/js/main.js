const input = document.querySelector('.form__input');
const btn = document.querySelector('.form__btn');
const messageBox = document.querySelector('.form__message')
const apiKey = 'a1f620d2d5c3c1f46482f999286156ca';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';
const section = document.querySelector('.section--weather');
const cta = document.querySelector('.cta');
let cityName;

const firstCapitalLetter = (word) =>{
    return word[0].toUpperCase() + word.slice(1);
}

const getCityName = () => {
    if (input.value == '') {
       messageBox.classList.remove('form__message--hidden');
       messageBox.innerText = 'Podaj nazwę miejscowości.';
    } else {
        cityName = input.value;
        document.querySelector('.city__name').textContent = firstCapitalLetter(cityName);
        return cityName;
    }
}

const unixTimestampConverter = (timestamp) =>{
    let time = new Date(timestamp*1000);
    return `${time.getHours()}:${time.getMinutes()>9 ? time.getMinutes() : ('0' + time.getMinutes())}`;
}

const unixDayConverter = (timestamp) =>{
    let time = new Date(timestamp*1000);
    return `${time.getDate()}.${time.getMonth()< 9 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)}`;
}

const removeForecastBoxes = () =>{
    const boxes = document.querySelectorAll('.forecast');
    boxes.forEach(box => {
        box.remove();
    });
}

const getWeather = (callback) =>{
    if (input.value) {
        fetch(`${apiUrl}/weather?q=${cityName}&appid=${apiKey}&lang=pl&units=metric`)  
        .then(function(response) { return response.json() })
        .then(function(data) {
            const {coord, main, sys, weather, wind, visibility} = data;
                                  
            document.querySelector('.sun__sunrise').textContent = unixTimestampConverter(sys.sunrise);
            document.querySelector('.sun__sunset').textContent = unixTimestampConverter(sys.sunset);
            document.querySelector('.current-weather__icon').src = `dist/images/icons/${weather[0].icon}.svg`;
            document.querySelector('.current-weather__name').textContent = weather[0].description;
            document.querySelector('.current-weather__temp').innerHTML = `${main.temp.toFixed(1)} <sup>o</sup>C`;
            document.querySelector('.current-weather__feels-like').textContent = main.feels_like.toFixed(1);
            document.querySelector('.current-weather__pressure').textContent = main.pressure;
            document.querySelector('.current-weather__humidity').textContent = main.humidity;
            document.querySelector('.current-weather__visibility').textContent = visibility / 1000;
            document.querySelector('.current-weather__wind-speed').textContent = (wind.speed * 3.6).toFixed(2);

            return fetch(`${apiUrl}/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=current,minutely,hourly&appid=${apiKey}&lang=pl&units=metric`);
        })

        .then(function(response) { return response.json() })
        .then(function(data) {
            const dailyForecast = data.daily;
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

                forecastBox.querySelector('.forecast__date').innerText = unixDayConverter(item.dt);
                forecastBox.querySelector('.forecast__icon').src = `dist/images/icons/${item.weather[0].icon}.svg`;
                forecastBox.querySelector('.forecast__name').innerText = firstCapitalLetter(item.weather[0].description);
                forecastBox.querySelector('.forecast__temp').innerHTML = `${item.temp.day.toFixed(1)} <sup>o</sup>C`;
            });

            section.classList.remove('section--hidden');
            callback();
            })
        
        .catch(function() {
            messageBox.classList.remove('form__message--hidden');
            messageBox.innerText = 'Podałeś złą nazwę lub nie ma pogody dla Twojej miejscowości. Spróbuj ponownie.';
        });

    }
}

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

const startApp = (e) =>{
    e.preventDefault();
    getCityName();
    getWeather(scrollToSection);
}

btn.addEventListener('click', startApp)


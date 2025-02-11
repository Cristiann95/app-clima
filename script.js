import API_KEY from "./apiKey.js";
const urlBase = `https://www.meteosource.com/api/v1/free`;


const container = document.querySelector('.container');
const sectionToday = document.querySelector('.today');
const title = document.querySelector('.title');
const time = document.querySelector('.time');
const divToday = document.querySelector('.today-weather');
const sectionDaily = document.querySelector('.daily');
const titleDaily = document.querySelector('.title-daily');
const sectionHourly = document.querySelector('.hourly');
const titleHourly = document.querySelector('.title-hourly');
const swiffySlider = document.querySelector('.swiffy-slider');
const sliderContainer = document.querySelector('.slider-container'); { }
divToday.style.display = 'none';
swiffySlider.style.display = 'none';
sectionDaily.style.display = 'none';
titleDaily.style.display = 'none'


document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.split(' ');
    const fomattedCity = city.join('-');
    if (fomattedCity) {
        fetchWeather(fomattedCity);
    } else {
        alert('Ingrese una ciudad válida');
    }
});

function fetchWeather(city) {
    fetch(`${urlBase}/point?place_id=${city}&sections=all&timezone=auto&language=en&units=ca&key=${API_KEY}`)
        .then(data => data.json())
        .then(data => {
            console.log(data)
            showWeatherData(data)
        })
}


function showWeatherData(data) {
    const currentParagraph = document.querySelector('.text');
    const currentIcon = document.querySelector('.current_icon');
    const currentTemp = document.querySelector('.temp');
    const currentWind = document.querySelector('.wind');
    const date = new Date()
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Today
    divToday.style.display = 'flex';
    let cityName = document.getElementById('cityInput').value;
    let currentDay = days[date.getDay()]
    let hours = `${date.getHours()}:${date.getMinutes().toLocaleString('es-ES')}`
    title.textContent = `Ahora en ${cityName.toLowerCase().replace(/\b\w/g, match => match.toUpperCase())}`
    time.textContent = `${hours} | ${currentDay}`;
    currentParagraph.textContent = data.current.summary;
    currentIcon.src = `./assets/img/big/${data.current.icon_num}.png`;
    currentTemp.textContent = `${data.current.temperature}°`;
    currentWind.innerHTML = `<p><img src='./assets/img/icons8-viento-48.png' /> ${data.current.wind.speed}Km/h</p>`;

    // Hourly
    swiffySlider.style.display = 'block';
    for (const hour of data.hourly.data) {
        console.log(hour)
        const divHour = document.createElement('div');
        divHour.classList = 'detail-hour';
        divHour.innerHTML = `
            <p>${hour.date.slice(11)}</p>
            <img class='icon-hour' src='./assets/img/small/${hour.icon}.png' alt='icono de clima' />
            <p>${hour.temperature}</p>
            <div><img src='./assets/img/icons8-viento-30.png' /><p>${hour.wind.speed}Km/h<p/></div>`

        sliderContainer.append(divHour);
    }

    // Daily
    sectionDaily.style.display = 'block';
    titleDaily.style.display = 'block';
    for (const day of data.daily.data) {
        const divDay = document.createElement('div');
        divHour.classList = 'detail-day';
        divDay.innerHTML = `
            <p>${day.day}</p>
                <img class='icon-hour' src='./assets/img/small/${day.icon}.png' alt='icono de clima' />
                <p>${Math.round(day.all_day.temperature_min)}°/${Math.round(day.all_day.temperature_max)}°</p>
                <div><img src='./assets/img/icons8-viento-30.png' /><p>${day.wind.speed}Km/h<p/></div>`

        sectionDaily.append(divDay);
    }
}

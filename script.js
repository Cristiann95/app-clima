import API_KEY from "./apiKey.js";
const urlBase = `https://www.meteosource.com/api/v1/free`;


const sectionToday = document.querySelector('.today');
const title = document.querySelector('.title');
const time = document.querySelector('.time');
const divToday = document.querySelector('.today-weather');
const sectionDaily = document.querySelector('.daily');
const titleDaily = document.querySelector('.title-daily');
const swiffySlider = document.querySelector('.swiffy-slider');
const sliderContainer = document.querySelector('.slider-container');
sectionToday.style.display = 'none';
divToday.style.display = 'none';
swiffySlider.style.display = 'none';
sectionDaily.style.display = 'none';
titleDaily.style.display = 'none'


document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.split(' ');
    const fomattedCity = city.join('-');
    if (fomattedCity) {
        fetchWeather(fomattedCity);
    }
});

function fetchWeather(city) {
    fetch(`${urlBase}/point?place_id=${city}&sections=all&timezone=auto&language=en&units=ca&key=${API_KEY}`)
        .then(data => {
            if (data.status === 200) {
                return data.json()
            }
        }).then(data => {
            showWeatherData(data);
        })
        .catch(error => {
            sectionToday.style.display = 'none';
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Debe ingresar una ciudad",
                showConfirmButton: false,
                timer: 1500
            });
            console.error(error)
        });
}

function showWeatherData(data) {
    const currentParagraph = document.querySelector('.text');
    const currentIcon = document.querySelector('.current_icon');
    const currentTemp = document.querySelector('.temp');
    const currentWind = document.querySelector('.wind');
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Today
    sectionToday.style.display = 'block';
    divToday.style.display = 'flex';
    let cityName = document.getElementById('cityInput').value;
    let numberDay = '';
    let currentDay = '';
    let hours = '';

    let zone = data.timezone.split('/');
    fetch(`https://timeapi.io/api/time/current/zone?timeZone=${zone.join('%2F')}`)
        .then(data => data.json())
        .then(data => {
            numberDay = new Date(data.date).getDay();
            currentDay = days[numberDay];
            hours = data.time;
            time.textContent = `${hours} | ${currentDay}`;
        })
        .catch(error => console.error(error));

    title.textContent = `Ahora en ${cityName.toLowerCase().replace(/\b\w/g, match => match.toUpperCase())}`
    currentParagraph.textContent = data.current.summary;
    currentIcon.src = `./assets/img/big/${data.current.icon_num}.png`;
    currentTemp.textContent = `${data.current.temperature}°`;
    currentWind.innerHTML = `<img src='./assets/img/icons8-viento-48.png' /><p>${data.current.wind.speed}Km/h</p>`;

    // Hourly
    swiffySlider.style.display = 'block';
    for (const hour of data.hourly.data) {
        const divHour = document.createElement('div');
        divHour.classList = 'detail-hour';
        divHour.innerHTML = `
            <p>${hour.date.slice(11)}</p>
            <img class='icon-hour' src='./assets/img/small/${hour.icon}.png' alt='icono de clima' />
            <p>${hour.temperature}°</p>
            <div><img src='./assets/img/icons8-viento-30.png' /><p>${hour.wind.speed}Km/h<p/></div>`

        sliderContainer.append(divHour);
    }

    // Daily
    sectionDaily.style.display = 'block';
    titleDaily.style.display = 'block';
    for (const day of data.daily.data) {
        function getDate(date) {
            const dateSplit = date.split('-');
            const dayIndex = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2]).getDay();
            const monthIndex = dateSplit[1] - 1;

            return `${days[dayIndex]}, ${dateSplit[2]} de ${months[monthIndex]}`
        }
        const divDay = document.createElement('div');
        divDay.classList = 'detail-day';
        divDay.innerHTML = `
            <p>${((data.daily.data).indexOf(day) === 0) ? 'Hoy' : getDate(day.day)}</p>
                <img class='icon-day' src='./assets/img/small/${day.icon}.png' alt='icono de clima' />
                <p>${Math.round(day.all_day.temperature_min)}°/${Math.round(day.all_day.temperature_max)}°</p>
                <div><img src='./assets/img/icons8-viento-30.png' /><p>${day.all_day.wind.speed}Km/h<p/></div>`

        sectionDaily.append(divDay);
    }
}
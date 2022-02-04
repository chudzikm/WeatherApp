const apiKey = "ce3bd9b235b547529a22161ec85fd1ef",
  apiUrl = "https://api.weatherbit.io/v2.0/",
  input = document.querySelector(".form__input"),
  btn = document.querySelector(".form__btn"),
  messageBox = document.querySelector(".form__message"),
  section = document.querySelector(".section--weather"),
  cta = document.querySelector(".cta"),
  geoLocationBtn = document.querySelector(".form__geolocation");
let clickSrc;
const firstCapitalLetter = (e) => e[0].toUpperCase() + e.slice(1),
  errorMsg = (e) => {
    messageBox.classList.remove("form__message--hidden"),
      (messageBox.innerText = e);
  },
  scrollToSection = () => {
    const e = document.querySelectorAll("[data-target]"),
      t = document.querySelectorAll("[data-name]");
    e.forEach((e) => {
      t.forEach((t) => {
        t.hasAttribute(t) === e.hasAttribute(e) && t.scrollIntoView();
      });
    });
  };
cta.addEventListener("click", () => {
  document.documentElement.scrollTop = 0;
});
const removeForecastBoxes = () => {
    document.querySelectorAll(".forecast").forEach((e) => {
      e.remove();
    });
  },
  getCityName = () =>
    new Promise((e) => {
      (cityName = input.value), e(cityName);
    }),
  getCurrentWeather = (e) =>
    fetch(
      apiUrl +
        "current?&" +
        ("searchBtn" == clickSrc
          ? "city=" + e
          : "&lat=" + e.coords.latitude + "&lon=" + e.coords.longitude) +
        "&key=" +
        apiKey +
        "&lang=pl"
    )
      .then((e) =>
        200 == e.status
          ? e.json()
          : errorMsg(
              "Niestety tej miejscowości nie znaleziono, wpisz inną i wyszukaj ponownie."
            )
      )
      .then((e) => e)
      .catch((e) => {
        console.error(e);
      }),
  showCurrentWeather = (e) => {
    const t = document.querySelector(".city__name");
    console.log(e);
    const {
      app_temp: o,
      city_name: r,
      lat: c,
      lon: n,
      rh: a,
      sunrise: s,
      sunset: i,
      slp: l,
      vis: u,
      temp: d,
      weather: m,
      wind_spd: p,
    } = e.data[0];
    (t.innerHTML =
      "searchBtn" == clickSrc
        ? r
        : `\n            Szerokość geograficzna: ${c.toFixed(
            2
          )}<sup>o</sup><br> \n            Długość geograficzna: ${n.toFixed(
            2
          )}<sup>o</sup>`),
      (document.querySelector(".sun__sunrise").textContent = `${
        Number(s.slice(0, 2)) + 2
      }:${s.slice(-2)}`),
      (document.querySelector(".sun__sunset").textContent = `${
        Number(i.slice(0, 2)) + 2
      }:${i.slice(-2)}`),
      (document.querySelector(
        ".current-weather__icon"
      ).src = `dist/images/icons/${m.icon}.svg`),
      (document.querySelector(".current-weather__name").textContent =
        m.description),
      (document.querySelector(
        ".current-weather__temp"
      ).innerHTML = `${d} <sup>o</sup>C`),
      (document.querySelector(".current-weather__feels-like").textContent = o),
      (document.querySelector(".current-weather__pressure").textContent = l),
      (document.querySelector(".current-weather__humidity").textContent = a),
      (document.querySelector(".current-weather__visibility").textContent = u),
      (document.querySelector(".current-weather__wind-speed").textContent = (
        3.6 * p
      ).toFixed(2));
  },
  getForecast = (e) =>
    fetch(
      apiUrl +
        "forecast/daily?&" +
        ("searchBtn" == clickSrc
          ? "city=" + e
          : "&lat=" + e.coords.latitude + "&lon=" + e.coords.longitude) +
        "&key=" +
        apiKey +
        "&lang=pl"
    )
      .then((e) => e.json())
      .then((e) => e)
      .catch((e) => {
        console.error(e);
      }),
  showForecast = (e) => {
    const t = e.data;
    console.log(t),
      document.querySelectorAll(".forecast").forEach((e) => {
        e.remove();
      }),
      t.forEach((e) => {
        const t = document.createElement("div"),
          o = document.createElement("span"),
          r = document.createElement("span"),
          c = document.createElement("span"),
          n = document.createElement("img");
        section.insertBefore(t, cta).classList.add("forecast"),
          t.appendChild(o).classList.add("forecast__date"),
          t.appendChild(n).classList.add("forecast__icon"),
          t.appendChild(r).classList.add("forecast__name"),
          t.appendChild(c).classList.add("forecast__temp"),
          (t.querySelector(".forecast__date").innerText = e.valid_date
            .substr(5)
            .split("-")
            .reverse()
            .join(".")),
          (t.querySelector(
            ".forecast__icon"
          ).src = `dist/images/icons/${e.weather.icon}.svg`),
          (t.querySelector(".forecast__name").innerText = firstCapitalLetter(
            e.weather.description
          )),
          (t.querySelector(".forecast__temp").innerHTML = `${e.temp.toFixed(
            0
          )} <sup>o</sup>C`);
      });
  },
  getGeoLocation = () =>
    new Promise((e, t) => {
      navigator.geolocation && navigator.geolocation.getCurrentPosition(e, t);
    }),
  showPosition = (e) => {
    document.querySelector(
      ".city__name"
    ).innerHTML = `\n    Szerokość geograficzna: ${e.coords.latitude.toFixed(
      2
    )}<sup>o</sup><br> \n    Długość geograficzna: ${e.coords.longitude.toFixed(
      2
    )}<sup>o</sup>\n    `;
  },
  startApp = async () => {
    const e =
        "searchBtn" == clickSrc ? await getCityName() : await getGeoLocation(),
      t = await getCurrentWeather(e);
    showCurrentWeather(t);
    const o = await getForecast(e);
    showForecast(o),
      section.classList.remove("section--hidden"),
      scrollToSection();
  };
btn.addEventListener("click", function (e) {
  e.preventDefault(),
    (clickSrc = "searchBtn"),
    "" !== input.value
      ? startApp()
      : errorMsg("Wpisz nazwę miejscowości, żeby sprawdzić pogodę.");
}),
  input.addEventListener("keydown", function (e) {
    "enter" == e.keydown &&
      (e.preventDefault(), (clickSrc = "searchBtn"), startAppCityName());
  }),
  geoLocationBtn.addEventListener("click", () => {
    (clickSrc = "geoBtn"), startApp();
  });

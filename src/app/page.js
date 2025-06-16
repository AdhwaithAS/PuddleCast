"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [weatherData, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState("");
  const [coords, setCoords] = useState({ lat: 70.714, lon: -74.005 });
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(" ");

  const iconMap = {
    0: "/icon/default.png",
    1: "/icon/default.png",
    2: "/icon/default.png",
    3: "/icon/default.png",
    11: "/icon/showers.png",
    80: "/icon/rain.png",
    4: "/icon/rain.png",
    12: "/icon/rain.png",
    81: "/icon/rain.png",
    32: "/icon/sunny.png",
    28: "/icon/cloudy.png",
    45: "/icon/cloudy.png",
    48: "/icon/cloudy.png",
  };

  const openiconMap = {
    0: "/icon/sunny.png",
    1: "/icon/sunny.png",
    2: "/icon/default.png",
    3: "/icon/cloudy.png",
    45: "/icon/cloudy.png",
    48: "/icon/cloudy.png",
    51: "/icon/rain.png",
    53: "/icon/rain.png",
    55: "/icon/rain.png",
    56: "/icon/rain.png",
    57: "/icon/rain.png",
    61: "/icon/rain.png",
    63: "/icon/rain.png",
    65: "/icon/rain.png",
    66: "/icon/rain.png",
    67: "/icon/rain.png",
    71: "/icon/snow.png",
    73: "/icon/snow.png",
    75: "/icon/snow.png",
    85: "/icon/snow.png",
    86: "/icon/snow.png",
    80: "/icon/showers.png",
    81: "/icon/showers.png",
    82: "/icon/showers.png",
    95: "/icon/storm.png",
    96: "/icon/storm.png",
    99: "/icon/storm.png",
  };

  const imageMap = {
    80: "/rain.jpg",
    81: "/rain.jpg",
    82: "/rain.jpg",
    51: "/drizzle.jpg",
    53: "/drizzle.jpg",
    55: "/drizzle.jpg",
    61: "/rain.jpg",
    63: "/rain.jpg",
    65: "/rain.jpg",
    56: "/rain.jpg",
    67: "/rain.jpg",
    66: "/rain.jpg",
    0: "/clearsky.jpg",
    1: "/clearsky.jpg",
    2: "/clearsky.jpg",
    3: "/clearsky.jpg",
    45: "/foggy.jpg",
    48: "/foggy.jpg",
    48: "/foggy.jpg",
    71: "/snow.jpg",
    73: "/snow.jpg",
    75: "/snow.jpg",
    77: "/snow.jpg",
    85: "/snow.jpg",
    86: "/snow.jpg",
    95: "/thunder.jpg",
    96: "/thunder.jpg",
    99: "/thunder.jpg",
  };
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const currentDay = days[today.getDay()];
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError("Location access denied.");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation not supported.");
    }
  }, []);

  useEffect(() => {
    if (coords.lat && coords.lon) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          const locationName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state;
          setLocation(locationName);
        })
        .catch(console.error);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${
        coords.lat
      }&longitude=${
        coords.lon
      }&hourly=temperature_2m,weather_code&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      }`;
      fetch(url)
        .then((res) => res.json())
        .then(setWeather)
        .catch(console.error);

      const fetchWeather = async () => {
        const rapidApiUrl = `https://weather-api180.p.rapidapi.com/weather/weather/${coords.lat}/${coords.lon}/forecast/3`;
        const options = {
          method: "GET",
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.NEXT_PUBLIC_API_HOST,
          },
        };

        try {
          const response = await fetch(rapidApiUrl, options);
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Failed to fetch weather data:", error);
        }
      };

      fetchWeather();

      const updateClock = () => {
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const ampm = now.getHours() >= 12 ? "PM" : "AM";
        setTime(`${hours}:${minutes} ${ampm}`);
      };

      updateClock();

      const interval = setInterval(updateClock, 1000);
      return () => clearInterval(interval);
    }
  }, [coords]);

  if (!weather)
    return (
      <div className="weather-loader-overlay">
        <div className="weather-loader">
          <div className="cloud"></div>
          <div className="rain">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );

  const { current_weather, daily } = weather;
  const now = new Date();
  const currentHourIndex = weather?.hourly?.time.findIndex((t) => {
    const tDate = new Date(t);
    return (
      tDate.getHours() === now.getHours() && tDate.getDate() === now.getDate()
    );
  });

  const forecastRestOfDay = weather?.hourly?.time
    .map((time, index) => {
      const date = new Date(time);
      const hour = date.getHours();
      return {
        hour: hour % 12 || 12,
        ampm: hour >= 12 ? "PM" : "AM",
        temp: weather.hourly.temperature_2m[index],
        icon: weather.hourly.weather_code?.[index] ?? null,
        isToday: date.getDate() === now.getDate(),
        index,
      };
    })
    .filter((entry) => entry.index > currentHourIndex && entry.isToday)
    .slice(0, 6);
  function handleFullScreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        console.error(`Error trying to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${
          imageMap[weather.current_weather.weathercode] || "/clearsky.jpg"
        })`,
      }}
    >
      <button className="fullscreen">
        <Image
          src={"/fullscreen.png"}
          width={20}
          onClick={() => {
            handleFullScreen();
          }}
          height={20}
          alt="Full Screen"
        />
      </button>
      <div className="container ">
        {weatherData ? (
          <></>
        ) : (
          <div className="weather-loader-overlay">
            <div className="weather-loader">
              <div className="cloud"></div>
              <div className="rain">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-lg-4 col-sm-12 degree">
            <div className="degree_container">
              <h1 className="degree_text">{current_weather.temperature} °C</h1>
              <h2 className="location">{location}</h2>
              <h3 className="subinfo">
                {time} | H:
                {daily.temperature_2m_max[0]}°C | L:
                {daily.temperature_2m_min[0]}°C
              </h3>
            </div>
          </div>
          <div className="col-lg-8 col-sm-12">
            <div className="row details_container padding">
              <div className="col-lg-12 currentWeather">
                <div className="row">
                  <div
                    className="col-lg-12"
                    style={{ paddingLeft: "30px", paddingRight: "30px" }}
                  >
                    <h5>{weatherData?.data?.narrative[0] || `Weather Data`}</h5>
                    <hr />
                  </div>
                  {forecastRestOfDay.map((entry, i) => {
                    return (
                      <div className="center col-lg-2" key={i}>
                        <p>
                          {entry.hour}
                          {entry.ampm}
                        </p>
                        <Image
                          alt={entry.iconCode}
                          src={openiconMap[entry.icon] || "/icon/default.png"}
                          width={45}
                          height={45}
                        />
                        <p className="cloud_text">{entry.temp}°C</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-lg-12 forecast">
                <div className="col-lg-12">
                  <h6>4-Day Forecast</h6>
                  <hr />
                  {weatherData?.data?.dayOfWeek?.map((day, index) => {
                    const iconCode =
                      weatherData.data.daypart[0].iconCode[index * 2];
                    const iconUrl = iconMap[iconCode] || "/icon/default.png";
                    return (
                      <div className="row align-center" key={index}>
                        <div className="col-lg-2">
                          <p className="day-text">
                            {currentDay === day ? "Today" : day}
                          </p>
                        </div>
                        <div className="col-lg-2">
                          <Image
                            alt={index}
                            src={iconUrl}
                            width={45}
                            height={45}
                          />
                        </div>
                        <div className="col-lg-2">
                          <p className="temp">
                            {weatherData.data.calendarDayTemperatureMin[index]}
                            °C
                          </p>
                        </div>
                        <div className="col-lg-4">
                          <div className="progress">
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width:
                                  (weatherData.data.calendarDayTemperatureMax[
                                    index
                                  ] +
                                    weatherData.data.calendarDayTemperatureMin[
                                      index
                                    ]) /
                                    2 +
                                  "%",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <p className="temp">
                            {weatherData.data.calendarDayTemperatureMax[index]}
                            °C
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

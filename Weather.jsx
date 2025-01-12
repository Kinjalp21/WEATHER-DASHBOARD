import React, {useEffect,useRef,useState} from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import humidity from '../assets/humidity.png'
import wind from '../assets/wind.png'
import pressure from '../assets/barometer.png'
import sunrise from '../assets/sunrise.png'
import sunset from '../assets/sunset.png'
import {FaLocationDot} from "react-icons/fa6";

const Weather = () => {

  const inputRef = useRef()
  const [weatherData,setWeatherData] = useState(false);

  const dateBuilder = (d) =>{
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12; 
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes; 
  
    return `${hours}:${minutes} ${ampm}`; 
  }

  const allIcons = {
    "01d": "https://openweathermap.org/img/wn/01d@2x.png",
    "01n": "https://openweathermap.org/img/wn/01n@2x.png",
    "02d": "https://openweathermap.org/img/wn/02d@2x.png",
    "02n": "https://openweathermap.org/img/wn/02n@2x.png",
    "03d": "https://openweathermap.org/img/wn/03d@2x.png",
    "03n": "https://openweathermap.org/img/wn/03n@2x.png",
    "04d": "https://openweathermap.org/img/wn/04d@2x.png",
    "04n": "https://openweathermap.org/img/wn/04n@2x.png",
    "09d": "https://openweathermap.org/img/wn/09d@2x.png",
    "09n": "https://openweathermap.org/img/wn/09n@2x.png",
    "10d": "https://openweathermap.org/img/wn/10d@2x.png",
    "10n": "https://openweathermap.org/img/wn/10n@2x.png",
    "11d": "https://openweathermap.org/img/wn/11d@2x.png",
    "11n": "https://openweathermap.org/img/wn/11n@2x.png",
    "13d": "https://openweathermap.org/img/wn/13d@2x.png",
    "13n": "https://openweathermap.org/img/wn/13n@2x.png",
    "50d": "https://openweathermap.org/img/wn/50d@2x.png",
    "50n": "https://openweathermap.org/img/wn/50n@2x.png"
  }

  const search = async (city)=>{
    if(city == ""){
      alert("Please enter the city name");
      return;
    }
    try{
      const url= `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      if(!response.ok){
        alert(data.message);
        return;
      }
      
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || cloud;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        description: data.weather[0].main,
        sunrise: formatTime(data.sys.sunrise),
        sunset: formatTime(data.sys.sunset)
      })
    }catch(error) {
      setWeatherData(false);
      console.error("Sorry! Error in fetching weather data");
    }
  }

  useEffect(()=>{
    search("Tokyo");
  },[])

  return (
    <div className='weather'>
      <div className="searchbar">
        <input ref={inputRef} type="text" placeholder='search location'/>
        <img src={search_icon} alt="" 
        onClick={()=>search(inputRef.current.value)} 
        />
      </div>
      {weatherData?
      <>
      <div className="weather-container">
        <div className="left-section">
          <div className="location-date">
              <p className='location'>
                <FaLocationDot className='location-icon' />
                {weatherData.location}</p>
              <p className='date'>{dateBuilder(new Date())}</p>
            </div>
          <div className="weather-details">
            <div className="icon-temp">
              <img src={weatherData.icon} alt="weather-icon" />
              <p className='description'>{weatherData.description}</p>
            </div>
            <div className="divider"></div>
            <div className="temperature-container">
              <p className='temperature'>{weatherData.temperature} °C</p>
            </div>
          </div>              
        </div>
        <div className="right-section">
        <div className="weather-stat sunrise-sunset">
            <img src={sunrise} alt="sunrise-icon" />
            <div>
              <span>Sunrise at </span>
              <p>{weatherData.sunrise}</p>
            </div>
          </div>
          <div className="weather-stat sunrise-sunset">
            <img src={sunset} alt="sunset-icon" />
            <div>
              <span>Sunset at </span>
              <p>{weatherData.sunset}</p>
            </div>
          </div>
          <div className="weather-stat">
            <img src={humidity} alt="humidity-icon" />
            <div>
              <p>{weatherData.humidity} %</p>
              <span>Humidity</span>
            </div>
          </div>
          <div className="weather-stat">
            <img src={wind} alt="wind-icon" />
            <div>
              <p>{weatherData.windSpeed} km/h</p>
              <span>Wind</span>
            </div>
          </div>
          <div className="weather-stat">
            <img src={pressure} alt="pressure-icon" />
            <div>
              <p>{weatherData.pressure} PS</p>
              <span>Air Pressure</span>
            </div>
          </div>
        </div>
      </div>
      </>:<></>
      }
      
    </div>
  )
}

export default Weather

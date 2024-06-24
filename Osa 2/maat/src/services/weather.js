import axios from 'axios'

const api_key = import.meta.env.VITE_WEATHER_KEY

const getCurrentWeather = (city) => {
    const url = `https://api.weatherapi.com/v1/current.json?q=${city}&key=${api_key}`
    const request =  axios.get(url)
    return request.then(response => response.data)
}


export default { getCurrentWeather }
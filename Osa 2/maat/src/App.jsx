import { useState, useEffect } from 'react'
import CountriesAPI from './services/countries'
import WeatherAPI from './services/weather'

const Filter = ({text, value, handleChange}) => (
  <div>{text} <input value={value} onChange={handleChange} /></div>
)

const Countries = ({countries, handleShow}) => {
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  if (countries.length > 1) {
    return <ManyCountries countries={countries} handleShow={handleShow} />
  }
  if (countries.length === 1) {
    return <OneCountry country={countries[0]} />
  }
}

const ManyCountries = ({countries, handleShow}) => {
  return (
    countries.map(country => {
      return (
        <div key={country.name.common}>
          {country.name.common} <button onClick={() => handleShow(country)}>show</button>
        </div>
      )
    })
  )
}

const OneCountry = ({country}) => {
  const lang = Object.values(country.languages)
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>
      <h3>Languages</h3>
      <ul>
        {lang.map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" width="150" height="100" />
      <Weather capital={country.capital} />
    </div>
  )
}

const Weather = ({capital}) => {
  const [temp, setTemp] = useState('')
  const [condition, setCondition] = useState('')
  const [wind, setWind] = useState('')

  WeatherAPI
    .getCurrentWeather(capital)
    .then(weather => {
        setTemp(weather.current.temp_c)
        setCondition("https:" + weather.current.condition.icon)
        setWind(weather.current.wind_kph)
    })

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <div>Temperature: {temp} Celsius</div>
      <div><img src={condition}/></div>
      <div>Wind: {(wind/3.6).toFixed(2)} m/s</div>
    </div>
  )
}

const App = () => {

  const [newFilter, setFilter] = useState('')
  const [newCountries, setCountries] = useState([])

  useEffect(() => {       
    CountriesAPI
      .getAll()        
      .then(countries => setCountries(countries))  
  }, []) 


  const handleFilterChange = (event) => setFilter(event.target.value)
  const countriesToShow = () => newCountries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
  const specifyCountry = (country) => setFilter(country.name.common)

  return (
    <>
      <Filter text="find countries" value={newFilter} handleChange={handleFilterChange} />
      <Countries countries={countriesToShow()} handleShow={specifyCountry} />
    </>
  )
}

export default App

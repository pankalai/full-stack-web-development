import { useState, useEffect } from 'react';
import axios from 'axios';

import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import { getDiaryEntries, addDiaryEntry } from './diaryService';

const App = () => {

  const defaultDiaryEntry: NewDiaryEntry = { 
    date: new Date().toISOString().slice(0, 10), 
    weather: Weather.Sunny, 
    visibility: Visibility.Great, 
    comment: '' 
  };

  const [newDiaryEntry, setNewDiaryEntry] = useState<NewDiaryEntry>(defaultDiaryEntry);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDiaryEntries().then(data => {
      setDiaryEntries(data)
    })
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error])

  const createDiaryEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    addDiaryEntry(newDiaryEntry)
      .then(data => {
        setDiaryEntries(diaryEntries.concat(data));
      })
      .catch(error => {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data || 'Unrecognized axios error');
          setError(error.response?.data || 'Unrecognized axios error');
        }
      });
    setNewDiaryEntry(defaultDiaryEntry);
  }

  const handleVisibilityChange = (visibility: Visibility) => {
    setNewDiaryEntry({ ...newDiaryEntry, visibility });
  }

const handleWeatherChange = (weather: Weather) => {
  setNewDiaryEntry({ ...newDiaryEntry, weather });
};


  return (
    <div>
      <h1>Add new entry</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={createDiaryEntry}>
        date
        <input
          type="date"
          value={newDiaryEntry.date}
          onChange={(e) => setNewDiaryEntry({ ...newDiaryEntry, date: e.target.value })}
        />
        <br></br>
        visibility
        {Object.values(Visibility).map(visibilityOption => (
          <label key={visibilityOption}>
            <input
              type="radio"
              value={visibilityOption}
              checked={newDiaryEntry.visibility === visibilityOption}
              onChange={() => handleVisibilityChange(visibilityOption)}
            />
            {visibilityOption}
          </label>
        ))}
        <br></br>
        weather
        {Object.values(Weather).map(weatherOption => (
          <label key={weatherOption}>
            <input
              type="radio"
              value={weatherOption}
              checked={newDiaryEntry.weather === weatherOption}
              onChange={() => handleWeatherChange(weatherOption)}
            />
            {weatherOption}
          </label>
        ))}
        <br></br>
        comment
        <input
          value={newDiaryEntry.comment}
          onChange={(e) => setNewDiaryEntry({ ...newDiaryEntry, comment: e.target.value })}
        /><br></br>
        <button type="submit">add</button>
      </form>
      <h1>Diary entries</h1>
        {diaryEntries.map(entry =>
          <div key={entry.id}>
            <h3>{entry.date}</h3>
            <p>
              visibility: {entry.visibility}<br></br>
              weather: {entry.weather}
            </p>
          </div>
        )}
    </div>
  )
}
export default App

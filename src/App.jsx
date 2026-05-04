import { useState, useEffect } from 'react'
import './App.css'
import { fetchMeals } from './services/api'

function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadMeals = async () => {
      const result = await fetchMeals();

      setMeals(result.data);

      if (result.error) {
        setError(true);
      }

      setLoading(false);
    };

    loadMeals();
  }, []);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">Something went wrong...</div>;
  }

  return (
    <div className="container">
      <h1 className='title'>Meals Listing</h1>
    </div>
  );
}

export default App;
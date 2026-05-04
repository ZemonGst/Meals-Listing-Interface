import { useState, useEffect } from 'react'
import './App.css'
import { fetchMeals } from './services/api'

// Simple SVG Icons
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    const loadMeals = async () => {
      setLoading(true);
      const result = await fetchMeals();
      
      if (result.error) {
        setError(true);
      } else {
        // FreeAPI usually returns the list in result.data or result.data.data
        // We set it as result.data in services/api.js
        setMeals(Array.isArray(result.data) ? result.data : []);
      }
      setLoading(false);
    };

    loadMeals();
  }, []);

  const filteredMeals = meals.filter(meal => 
    (meal.strMeal || meal.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Preparing delicious recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <h2 style={{ color: 'var(--primary)' }}>Oops! Something went wrong.</h2>
        <p>We couldn't fetch the meals. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '1rem', 
            padding: '0.8rem 2rem', 
            borderRadius: '50px', 
            background: 'var(--primary)', 
            color: '#fff', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {/* Hero Section */}
      <section className="hero">
        <h1>Gourmet Discovery</h1>
        <p>Explore a world of exquisite flavors and masterfully crafted recipes from every corner of the globe.</p>
        
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for a recipe..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon"><SearchIcon /></span>
        </div>
      </section>

      {/* Meal Grid */}
      {filteredMeals.length > 0 ? (
        <div className="meal-grid">
          {filteredMeals.map((meal) => (
            <div 
              key={meal.idMeal || meal.id} 
              className="meal-card"
              onClick={() => setSelectedMeal(meal)}
            >
              <div className="meal-image-container">
                <img 
                  src={meal.strMealThumb || meal.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt={meal.strMeal || meal.name} 
                  className="meal-image"
                />
                {(meal.strCategory || meal.category) && (
                  <span className="meal-category">{meal.strCategory || meal.category}</span>
                )}
              </div>
              <div className="meal-content">
                <h2 className="meal-title">{meal.strMeal || meal.name}</h2>
                {(meal.strArea || meal.area) && (
                  <div className="meal-area">
                    <span>🌍</span> {meal.strArea || meal.area} Cuisine
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No recipes found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMeal(null)}>
              <CloseIcon />
            </button>
            <div className="modal-body">
              <img 
                src={selectedMeal.strMealThumb || selectedMeal.image} 
                alt={selectedMeal.strMeal || selectedMeal.name} 
                className="modal-image"
              />
              <div className="modal-info">
                <h2>{selectedMeal.strMeal || selectedMeal.name}</h2>
                <div className="modal-tags">
                  <span className="tag">{selectedMeal.strCategory || selectedMeal.category}</span>
                  <span className="tag">{selectedMeal.strArea || selectedMeal.area}</span>
                </div>
                <div className="modal-description">
                  <h3>Instructions</h3>
                  <p style={{ marginTop: '1rem' }}>
                    {selectedMeal.strInstructions || selectedMeal.description || 'No instructions available for this recipe.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
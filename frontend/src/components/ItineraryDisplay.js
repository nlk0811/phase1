import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faSave, faHome, faUser, faSignOutAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ExplorePlacesModal from './ExplorePlacesModal';
import ItineraryWithPlaces from './ItineraryWithPlaces';
import { getWeather, getDestinationWeather, saveItinerary } from '../api';
import axios from 'axios';

const ItineraryDisplay = ({ itinerary }) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [resultsModalShow, setResultsModalShow] = useState(false);
  const [sourceWeather, setSourceWeather] = useState(null);
  const [destinationWeather, setDestinationWeather] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (itinerary) {
      const mainLocation = itinerary.places ? itinerary.places.split(', ')[0] : null;
      const { source, destination } = itinerary;
      fetchWeather(source, destination || mainLocation);
    }
  }, [itinerary]);

  const fetchWeather = async (source, destination) => {
    try {
      if (source) {
        const sourceWeatherData = await getWeather(source);
        setSourceWeather(sourceWeatherData);
      }
  
      if (destination) {
        const destinationWeatherData = await getDestinationWeather(destination);
        setDestinationWeather(destinationWeatherData);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const handleExplorePlaces = (day) => {
    setSelectedDay(day);
    setModalShow(true);
  };

  const handleExplore = async (locationName, type) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8081/get-places`, {
        params: {
          location_name: locationName,
          type: type
        }
      });
      console.log('Places found:', response.data.results);
      setPlaceDetails(response.data.results);
      setResultsModalShow(true);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleSaveItinerary = async () => {
    setSaving(true);
    try {
      const user_email = localStorage.getItem('email');
      const dataToSave = { user_email, itinerary_data: itinerary };
  
      await saveItinerary(dataToSave);
      alert('Itinerary saved successfully!');
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Failed to save itinerary. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    alert('Logout successful!');
    navigate('/login');
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8081/download-itinerary-pdf', { itinerary }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'travel_itinerary.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (!itinerary) {
    return <p>No itinerary available</p>;
  }

  const { budget, itinerary: itineraryDetails, places, notes } = itinerary;

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff' }}>
        <button 
          onClick={() => navigate('/home')} 
          style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
        >
          <FontAwesomeIcon icon={faHome} style={{ marginRight: '10px' }} />
          Home
        </button>
        <button 
          onClick={() => navigate('/profile')} 
          style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
        >
          <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
          Profile
        </button>
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
          Logout
        </button>
      </nav>

      <div style={{ textAlign: 'left', marginTop: '20px', padding: '20px', borderRadius: '8px' }}>
        <h2>Your Travel Itinerary</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          {sourceWeather && (
            <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', flex: 1, marginRight: '10px' }}>
              <h4>Weather in {sourceWeather.name}, {sourceWeather.sys.country}</h4>
              <p>{sourceWeather.weather[0].description}</p>
              <p>Temperature: {Math.round(sourceWeather.main.temp - 273.15)}°C</p>
              <p>Humidity: {sourceWeather.main.humidity}%</p>
              <img src={`http://openweathermap.org/img/w/${sourceWeather.weather[0].icon}.png`} alt="Weather icon" />
            </div>
          )}

          {destinationWeather && (
            <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', flex: 1, marginLeft: '10px' }}>
              <h4>Weather in {destinationWeather.name}, {destinationWeather.sys.country}</h4>
              <p>{destinationWeather.weather[0].description}</p>
              <p>Temperature: {Math.round(destinationWeather.main.temp - 273.15)}°C</p>
              <p>Humidity: {destinationWeather.main.humidity}%</p>
              <img src={`http://openweathermap.org/img/w/${destinationWeather.weather[0].icon}.png`} alt="Weather icon" />
            </div>
          )}
        </div>

        {budget && budget.breakdown && (
          <>
            <h3>Budget Breakdown</h3>
            <ul>
              {Object.entries(budget.breakdown).map(([item, cost]) => (
                <li key={item}>
                  <strong>{item.charAt(0).toUpperCase() + item.slice(1)}:</strong> {cost}
                </li>
              ))}
              <li><strong>Total:</strong> {budget.total}</li>
            </ul>
          </>
        )}

        {places && (
          <div>
            <h3>Places Covered</h3>
            <p>{places}</p>
          </div>
        )}

        {itineraryDetails && itineraryDetails.days && (
          <>
            <h3>Daily Itinerary</h3>
            <div style={{ position: 'relative', paddingLeft: '20px', marginTop: '20px' }}>
              {itineraryDetails.days.map((day, index) => (
                <div key={day.day} style={{ display: 'flex', marginBottom: '40px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', marginRight: '20px' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      {`Day ${day.day}`}
                    </div>
                    {index !== itineraryDetails.days.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '75px',
                          left: '50%',
                          width: '2px',
                          height: '280px',
                          backgroundColor: '#007bff',
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      padding: '20px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                    }}
                  >
                    <h4>{day.heading}</h4>
                    <p>{day.description}</p>
                    <ul>
                      {day.activities.map((activity, index) => (
                        <li key={index}>
                          <strong>{activity.name}</strong> - {activity.type} ({activity.cost})
                        </li>
                      ))}
                    </ul>
                    
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      size="lg"
                      style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: '#007bff' }}
                      onClick={() => handleExplorePlaces(day.day)}
                      title={`Explore famous places for Day ${day.day}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <ExplorePlacesModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          places={places ? places.split(', ') : []}
          onExplore={handleExplore}
        />

        {placeDetails && (
          <ItineraryWithPlaces
            show={resultsModalShow}
            onHide={() => setResultsModalShow(false)}
            placeDetails={placeDetails}
          />
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={handleSaveItinerary} 
            style={{ 
              padding: '10px 20px', 
              fontSize: '18px', 
              color: '#fff', 
              backgroundColor: '#28a745', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)',
              transition: 'background-color 0.3s',
            }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Itinerary'}
            <FontAwesomeIcon icon={faSave} style={{ marginLeft: '10px' }} />
          </button>
          <button 
            onClick={handleDownloadPDF} 
            style={{ 
              padding: '10px 20px', 
              fontSize: '18px', 
              color: '#fff', 
              backgroundColor: '#007bff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              boxShadow: '0 5px 15px rgba(0, 123, 255, 0.3)',
              transition: 'background-color 0.3s',
              marginLeft: '10px'
            }}
          >
            Download PDF
            <FontAwesomeIcon icon={faDownload} style={{ marginLeft: '10px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;


import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { generateItinerary, generateItineraryWithDestination, generateItineraryWithDestinationAndRequests, generateItineraryWithRequests } from '../api';
import ItineraryDisplay from './ItineraryDisplay';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';  // Import the Navbar component

function ItineraryFormPage() {
  const [budget, setBudget] = useState('');
  const [interests, setInterests] = useState('');
  const [duration, setDuration] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [requests, setRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);


  // function to handle generate itineray button click
  const handleGenerateItinerary = async () => {
    if (!budget || !interests || !duration || !source) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    let itineraryData;
    try {
      

      if (destination, requests) {
        itineraryData = await generateItineraryWithDestinationAndRequests(budget, interests, duration, source, destination, requests);
      }
      else if(destination) {
        itineraryData = await generateItineraryWithDestination(budget, interests, duration, source, destination);
      }
      else if(requests) {
        itineraryData = await generateItineraryWithRequests(budget, interests, duration, source, requests);
      } 
      else {
        itineraryData = await generateItinerary(budget, interests, duration, source);
      }

      setItinerary(itineraryData);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.log(itineraryData);
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      marginTop: '120px',
      padding: '40px',
      backgroundImage: 'url(https://i.pinimg.com/originals/d7/ae/01/d7ae0170d3d5ffcbaa7f02fdda387a3b.gif)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    },
    formContainer: {
      flex: 1,
      padding: '20px',
      borderRight: '1px solid #ddd',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '15px 0 0 15px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
    },
    header: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
    },
    input: {
      margin: '10px',
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px',
    },
    button: {
      margin: '20px',
      padding: '15px 30px',
      fontSize: '18px',
      color: '#fff',
      backgroundColor: '#28a745',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)',
      transition: 'background-color 0.3s',
    },
    displayContainer: {
      flex: 2,
      padding: '20px',
      maxHeight: '80vh',
      overflowY: 'auto',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '0 15px 15px 0',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
    },
  };

  return (
    <div style={styles.container}>
        <Navbar /> {/* Include the Navbar component here */}
      {/* Left Panel - Form */}
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Create Your Travel Itinerary</h2>
        <div>
          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Interests (comma separated)"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Duration (days)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Destination (optional)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={styles.input}
          />
          {/* promt box (additional code) */}
          <input
            type="text"
            placeholder="Additional Requests (optional)"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleGenerateItinerary} style={styles.button} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Itinerary'}
          </button>
        </div>
        <ToastContainer />
      </div>

      {/* Right Panel - Itinerary Display */}
      <div style={styles.displayContainer}>
        {itinerary ? (
          <ItineraryDisplay itinerary={itinerary} />
        ) : (
          <p>Please fill out the form and generate an itinerary.</p>
        )}
      </div>
    </div>
  );
}

export default ItineraryFormPage;

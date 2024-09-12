"use client";

import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

export default function Home() {
  const [imageSrc, setImageSrc] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const webcamRef = useRef(null);

  const classLabels = [
    'Eczema',
    'Melanoma',
    'Basal Cell Carcinoma',
    'Melanocytic Nevi',
    'Benign Keratosis-like Lesions',
    'Psoriasis pictures Lichen Planus and related diseases',
    'Seborrheic Keratoses and other Benign Tumors',
    'Tinea Ringworm Candidiasis and other Fungal Infections',
    'Warts Molluscum and other Viral Infections'
  ];

  const capture = () => {
    if (webcamRef.current) {
      const image = webcamRef.current.getScreenshot();
      setImageSrc(image);
    } else {
      alert('Webcam is not ready yet.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setImageSrc(null);
    setPredictions(null);
  };

  const analyzePhoto = async () => {
    if (!imageSrc) {
      alert('Please upload or capture a photo first!');
      return;
    }
  
    const blob = await fetch(imageSrc).then(res => res.blob());

    const formData = new FormData();
    formData.append('file', blob, 'image.jpg');
  
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Predictions from Flask server:', data);
  
      const topPredictions = data
        .map((prediction) => ({
          class: prediction.class || `Class ${prediction.class}`,
          score: prediction.score
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); 
  
      setPredictions(topPredictions);
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Skin Pro</h1>
      {!imageSrc ? (
        <>
          <Webcam 
            audio={false} 
            ref={webcamRef} 
            screenshotFormat="image/jpeg" 
            style={styles.webcam}
          />
          <button onClick={capture} style={styles.button}>Capture Photo</button>
          <input type="file" accept="image/*" onChange={handleFileUpload} style={styles.fileInput} />
        </>
      ) : (
        <>
          <img src={imageSrc} alt="Captured face" style={styles.image} />
          <button onClick={retakePhoto} style={styles.button}>Retake Photo</button>
        </>
      )}
      <button onClick={analyzePhoto} style={styles.analyzeButton}>Analyze Photo</button>
      {predictions && (
        <div>
          <h3 style={styles.predictionsTitle}>Top Predictions:</h3>
          {predictions
            .map((prediction, i) => (
              <div key={i} style={styles.prediction}>
                Class: {prediction.class}, Score: {prediction.score.toFixed(4)}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  webcam: {
    width: '320px',
    height: '240px',
    marginBottom: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '320px',
    height: '240px',
    marginBottom: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    transition: 'background-color 0.3s ease',
  },
  fileInput: {
    margin: '10px',
  },
  analyzeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    transition: 'background-color 0.3s ease',
  },
  predictionsTitle: {
    fontSize: '1.5rem',
    marginTop: '20px',
    color: '#2c3e50',
  },
  prediction: {
    fontSize: '1rem',
    color: '#34495e',
    margin: '5px 0',
  },
};

import React, { useState } from 'react';
import Form from './components/Form';
import './App.css';
import './url.css';
import Results from './components/Results';

function App() {
  const [url, setUrl]= useState<string>('');
  const [urlId, setUrlId]= useState<string>('');

  const scanHandler = async (newUrl: string) => {
    if (newUrl && newUrl !== url) {
        const data = await sendUrlToServer(newUrl);
        console.log("data: " + data);
        if (data) {
          setUrlId(data._id);
          setUrl(newUrl);
        }
    }
  }

  const sendUrlToServer = async (url: string): Promise<{ _id: string } | null> => {
    try {
      const response = await fetch('http://localhost:3001/url-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }), 
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); 
      console.log('Server response:', data);
      return data;

    } catch (error) {
      console.error('Error sending URL to server:', error);
      return null; 
    }
  };


  return (
    <div className="App">
      <div className='main'>
          <div className='main-container results-container'>
            <Results urlId={urlId}/>
          </div>
          <div className='main-container actions-container'>
            <Form onSend={scanHandler} />
          </div>
        </div>
      </div>
  );
}

export default App;
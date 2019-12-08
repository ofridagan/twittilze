import React, { useState, useEffect } from 'react';
import './TweetsPerSecond.css';

function Toplist() {
  const [freq, setFreq] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('tweets');
      const result = await response.json();
      setFreq(result);
    }

    fetchData();
  }, []);

  return (
    <div className="Tweets-freq">
      <h2>Tweets Per Second: {Math.round(freq * 100) / 100}</h2>
    </div>
  );
}

export default Toplist;

import React, { useState, useEffect } from 'react';
import './Toplist.css';

function Toplist({name}) {
  const [list, setList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(name);
      const result = await response.json();
      setList(result);
    }

    fetchData();
  }, []);

  return (
    <div className="Toplist">
      <h1>top {name}</h1>
      {list.map( (item) =>
        <div className="row">
          <div className="value">{item.value}</div><div className="count">{item.count}</div>
        </div>
      )}
    </div>
  );
}

export default Toplist;

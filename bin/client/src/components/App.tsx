// src/components/App.tsx
import * as React from 'react';
import { useState, useEffect } from 'react';

// Components.
import Header from './Header';
import Overview from './Overview';
import Queries from './Queries';
import Mutations from './Mutations';
import Resolvers from './Resolvers';

// Style.
import "./App.css";
const processedData = {
      'overview': {
        'summary': {
          'numTotalRequests': 0
        },
        'requests': {
          'times':[],
          'rpm': []
        },
        'response': {
          'times': [],
          '90': []
        },
        'resolvers': {
          'times': [],
          'aveSpeed': []
        }
      },
      'resolvers': {
        'invocationCounts': {},
        'executionTimes': {},
        'averageTime' : 0.0
      }
    }
// TODO: Make this responsive to changes.

// Renders App.
const App = () => {
  // An array of Modes.
  const [ data, updateData ] = useState(processedData);
  
  // This establishes socket connection.  Invokes once.
  useEffect(() => {
    fetch('/data/getItem')
    .then((res)=>res.json())
    .then((resolverData)=> {
      console.log(typeof resolverData);
      console.log(JSON.parse(resolverData.Payload));
      updateData(JSON.parse(resolverData.Payload));
      // updateData(resolverData.Payload);
    })
    .catch((e)=>console.log(e));
  }, [])

  // Hook to update the current mode.
  const [currentMode, updateMode] = useState('overview');

  // useEffect hook to change the css styling of the active mode.
  useEffect(() => {
    // Remove 'active' from class names.
    Array.from(document.getElementsByClassName("header-navigation-item"))
         .forEach(el => el.classList.remove('active'));
    // Add 'active' to the current Mode css.
    document.getElementById("header-navigation-item-" + currentMode)!
            .classList.toggle('active');
  });

  // Initialize the current view.
  let currentView = <Overview overviewData={data.overview} resolversData={data.resolvers}/>;

  // Conditionally render the following based on current mode.
  switch (currentMode) {
    case 'overview':
      currentView = <Overview overviewData={data.overview} resolversData={data.resolvers} />;
      break;
    case 'queries':
      currentView = <Queries data={data} />;
      break;
    case 'mutations':
      currentView = <Mutations data={data} />;
      break;
    case 'resolvers':
      currentView = <Resolvers resolversData={data.resolvers} />;
      break;
  }

  // Render App with the following DOM.
  const modes = ['Overview','Resolvers'];

  // Render the following:
  return (
    <div>
      <Header modes={modes} updateMode={updateMode} />
      <div id="modeWrapper">
        {currentView}
      </div>
    </div>
  )
}

export default App

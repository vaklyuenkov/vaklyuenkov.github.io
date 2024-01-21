import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const WeightChartData = () => {
  const [weightSheetData, setWeightSheetData] = useState([]);
  //const [sheetData, setSheetData] = useState([]);
  const [WeightData, setWeightData] = useState({
    labels: [],
    datasets: [],
  });
  const _weightSheet = 'weight';
  //const _habitSheet = 'habits';
  const _spreadsheetId = '1-dL-edvDj0dXj3jAJob6ShrwlMbOIa9VbhoMz3iSNF8';
  const _apiKey = 'AIzaSyDVvZYBsSzXWz4QNH_5TzaF9GY-YyXPrOQ';

  useEffect(() => {
    loadGoogleApi().then(() => {
      fetchWeightSheetData();
    });
  }, []);

  useEffect(() => {
    fetchWeightData(weightSheetData);
    }, [weightSheetData]);

  const loadGoogleApi = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        gapi.load('client', () => {
          gapi.client.init({
            apiKey: _apiKey,
          }).then(() => {
            return gapi.client.load('sheets', 'v4');
          }).then(() => {
            resolve();
          }).catch((error) => {
            reject(error);
          });
        });
      };
      document.body.appendChild(script);
    });
  };

  const fetchWeightSheetData = () => {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: _spreadsheetId,
      range: _weightSheet,
    }).then((response) => {
      const values = response.result.values;
      setWeightSheetData(values);
    }).catch((error) => {
      console.error('Error fetching sheet data:', error);
    });
  };

  const fetchWeightData = (data) => {
    const labels = weightSheetData.map(row => row[0]);
    const weightData =weightSheetData.map(row => row[1]);

    const newWeightData = {
        labels: labels,
        datasets: [
          {
            label: 'Weight',
            data: weightData,
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          },
        ],
      };

    setWeightData(newWeightData);
  };

  return WeightData };

export default WeightChartData;
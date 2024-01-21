import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const StatsChartData = () => {
  const [sheetData, setSheetData] = useState([]);
  const [ChartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const _sheet = 'stats';
  const _spreadsheetId = '1-dL-edvDj0dXj3jAJob6ShrwlMbOIa9VbhoMz3iSNF8';
  const _apiKey = 'AIzaSyDVvZYBsSzXWz4QNH_5TzaF9GY-YyXPrOQ';

  useEffect(() => {
    loadGoogleApi().then(() => {
      fetchSheetData();
    });
  }, []);

  useEffect(() => {
    fetchChartData(sheetData);
    }, [sheetData]);

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

  const fetchSheetData = () => {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: _spreadsheetId,
      range: _sheet,
    }).then((response) => {
      const values = response.result.values;
      setSheetData(values);
    }).catch((error) => {
      console.error('Error fetching sheet data:', error);
    });
  };

  const fetchChartData = (data) => {
    const labels = sheetData.map(row => row[0]);
    const sportData =sheetData.map(row => row[1]);
    const projectData =sheetData.map(row => row[2]);
    const badHabitData =sheetData.map(row => row[3]);

  const newData = {
        labels: labels,
        datasets: [
          {
            label: 'Sport',
            data: sportData,
            fill: false,
            borderColor: "rgba(75,192,192,1)"
          },
          {
            label: 'Projects',
            data: projectData,
            fill: false,
            borderColor: "#742774"
          },
          {
            label: 'Bad habit',
            data: badHabitData,
            fill: false,
            borderColor: "#147734"
          },
        ],
      };

    setChartData(newData);
  };

  return ChartData };

export default StatsChartData;
import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const ServiceChartData = () => {
  const [sheetData, setSheetData] = useState([]);
  const [ChartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const _sheet = 'service';
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
    const customersData =sheetData.map(row => row[1]);

  const newData = {
        labels: labels,
        datasets: [
          {
            label: 'Customers',
            data: customersData,
            fill: true,
            borderColor: "rgba(75,192,192,1)"
          },
        ],
      };

    setChartData(newData);
  };

  return ChartData };

export default ServiceChartData;
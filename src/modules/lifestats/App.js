// GoogleSheetsReader.js

const express = require('express');
const { google } = require('googleapis');
const ChartClass = require('./ChartClass');

class GoogleSheetsReader {
  constructor(sheetId, apiKey) {
    this.sheetId = sheetId;
    this.apiKey = apiKey;

    this.sheets = google.sheets({
      version: 'v4',
      auth: apiKey,
    });
  }

  async render(req, res) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'data',
        key: this.apiKey,
      });

      const values = response.data.values;

      res.send(`
        <html>
          <head>
            <title>Google Sheets Data</title>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          </head>
          <body>
            <h1>Google Sheets Data</h1>
            <p>Data will be displayed below:</p>
            <div id="sheet-data"></div>
            <script>
              fetch('/get-sheet-data')
                .then(response => response.json())
                .then(data => {
                  const sheetDataElement = document.getElementById('sheet-data');
                  data.forEach(row => {
                    const listItem = document.createElement('p');
                    listItem.textContent = row.join(', ');
                    sheetDataElement.appendChild(listItem);
                  });

                  // Load chart data after page load
                  fetch('/plot-chart')
                    .then(() => {
                      // Plot chart using chart.js
                      const ctx = document.getElementById('line-chart').getContext('2d');
                      new Chart(ctx, {
                        type: 'line',
                        data: {
                          labels: data.map(row => row[0]),
                          datasets: [
                            {
                              label: 'Weight',
                              data: data.map(row => row[1]),
                              borderColor: 'rgba(75, 192, 192, 1)',
                              borderWidth: 1,
                              fill: false,
                            },
                            {
                              label: 'Work',
                              data: data.map(row => row[2]),
                              borderColor: 'rgba(255, 99, 132, 1)',
                              borderWidth: 1,
                              fill: false,
                            },
                          ],
                        },
                        options: {
                          scales: {
                            x: {
                              type: 'linear',
                              position: 'bottom',
                            },
                          },
                        },
                      });
                    })
                    .catch(error => console.error('Error plotting chart:', error));
                })
                .catch(error => console.error('Error fetching sheet data:', error));
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error rendering home page:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async getSheetData(req, res) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'data',
        key: this.apiKey,
      });

      const values = response.data.values;
      res.json(values);
    } catch (error) {
      console.error('Error getting sheet data:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async plotChart(req, res) {
    res.send(`
      <html>
        <head>
          <title>Chart Page</title>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          <h1>Line Chart</h1>
          <canvas id="line-chart" width="800" height="400"></canvas>
        </body>
      </html>
    `);
  }

}

module.exports = GoogleSheetsReader;

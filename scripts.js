const express = require('express');
const path = require('path');
const stocks = require('./app');

const app = express();
app.use(express.static(path.join(__dirname, 'static')));

const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

function drawLine(start, end, style) {
  ctx.beginPath();
  ctx.strokeStyle = style || 'black';
  ctx.moveTo(...start);
  ctx.lineTo(...end);
  ctx.stroke();
}

function drawTriangle(apex1, apex2, apex3) {
  ctx.beginPath();
  ctx.moveTo(...apex1);
  ctx.lineTo(...apex2);
  ctx.lineTo(...apex3);
  ctx.fill();
}

function drawStocks(stocks) {
  stocks.forEach(stock => {
    const x = stock.x;
    const y = stock.y;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
  });
}

fetch('http://127.0.0.1:3000/stocks')
  .then(response => response.json())
  .then(data => {
    const stocks = data.stockSymbols.map(symbol =>
      fetch(`http://127.0.0.1:3000/stocks/${symbol}`)
        .then(response => response.json())
        .catch(error => {
          console.error(`Error fetching data for ${symbol}:`, error);
          return null;
        })
    );

    Promise.all(stocks)
      .then(stockData => {
        const validStockData = stockData.filter(stock => stock !== null);
        drawStocks(validStockData);

        console.log('Stock Data:');
        console.table(validStockData); // Logging stock data in a structured table format

        drawLine([50, 50], [50, 550]);
        drawTriangle([35, 50], [65, 50], [50, 35]);

        drawLine([50, 550], [950, 550]);
        drawTriangle([950, 535], [950, 565], [965, 550]);
      })
      .catch(error => console.error('Error fetching stock data:', error));
  })
  .catch(error => console.error('Error fetching available stocks:', error));

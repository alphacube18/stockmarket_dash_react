// src/components/Portfolio.js
import { useState, useEffect } from "react";
import "../styles/portfolio.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

const API_KEY = "YOUR_API_KEY"; // Replace with your actual Alpha Vantage API key

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]); // ✅ Ensure portfolio is initialized as an empty array

  const fetchStockPrice = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
        return parseFloat(data["Global Quote"]["05. price"]);
      } else {
        console.error(`Invalid price data for ${symbol}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching stock price:", error);
      return null;
    }
  };

  const addStock = async () => {
    const symbol = prompt("Enter stock symbol (e.g., AAPL, TSLA):").toUpperCase();
    const quantity = parseInt(prompt("Enter quantity:"), 10);

    if (!symbol || isNaN(quantity) || quantity <= 0) return;

    const initialPrice = await fetchStockPrice(symbol);
    if (!initialPrice) {
      alert("Could not fetch stock price. Try again.");
      return;
    }

    setPortfolio((prev) => {
      if (!prev) return []; // ✅ Ensure prev is always an array

      const existingStock = prev.find((stock) => stock.symbol === symbol);
      if (existingStock) {
        return prev.map((stock) =>
          stock.symbol === symbol
            ? { ...stock, quantity: stock.quantity + quantity }
            : stock
        );
      } else {
        return [...prev, { symbol, quantity, priceHistory: [initialPrice] }];
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!portfolio || portfolio.length === 0) return; // ✅ Prevent error when portfolio is empty

      setPortfolio((prevPortfolio) =>
        Promise.all(
          prevPortfolio.map(async (stock) => {
            const newPrice = await fetchStockPrice(stock.symbol);
            return newPrice
              ? {
                  ...stock,
                  priceHistory: [...stock.priceHistory.slice(-9), newPrice],
                }
              : stock;
          })
        ).then((updatedPortfolio) => setPortfolio(updatedPortfolio))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [portfolio]); // ✅ Depend on portfolio to prevent unnecessary re-renders

  return (
    <div className="portfolio">
      <h2>📂 Your Portfolio</h2>
      <button onClick={addStock}>➕ Add Stock</button>
      <ul>
        {portfolio.length > 0 ? (
          portfolio.map((stock, index) => (
            <li key={index}>
              <strong>{stock.symbol}</strong> - {stock.quantity} shares
              <div className="chart-container">
                <Line
                  key={stock.symbol}
                  data={{
                    labels: stock.priceHistory.map((_, i) => `${i + 1}m`),
                    datasets: [
                      {
                        label: `${stock.symbol} Price ($)`,
                        data: stock.priceHistory,
                        borderColor: "#4caf50",
                        backgroundColor: "rgba(76, 175, 80, 0.2)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: { min: Math.min(...stock.priceHistory) - 5, max: Math.max(...stock.priceHistory) + 5 },
                    },
                  }}
                />
              </div>
            </li>
          ))
        ) : (
          <p>No stocks added yet. Click "Add Stock" to start.</p> // ✅ Show message when portfolio is empty
        )}
      </ul>
    </div>
  );
};

export default Portfolio;

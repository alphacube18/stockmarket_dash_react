import { useEffect, useState } from "react";
import { subscribeToStock } from "../api/socketService";
import "../styles/stocklist.css";

const StockList = () => {
  const [stocks, setStocks] = useState([
    { symbol: "GOOGL", price: 0 },
    { symbol: "MSFT", price: 0 },
    { symbol: "TSLA", price: 0 }
  ]);

  useEffect(() => {
    const unsubscribers = stocks.map((stock, index) => {
      return subscribeToStock(stock.symbol, (data) => {
        setStocks((prevStocks) => {
          const updatedStocks = [...prevStocks];
          updatedStocks[index] = { ...updatedStocks[index], price: data.p };
          return updatedStocks;
        });
      });
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe && unsubscribe());
    };
  }, []);

  return (
    <div className="stock-list">
      <h2>📊 Live Stock Prices</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.symbol}>
            {stock.symbol}: <span className="price">${stock.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockList;

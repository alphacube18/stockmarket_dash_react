import StockList from "../components/StockList";
import Portfolio from "../components/portfolio";
import "../styles/global.css";

const Dashboard = () => {
  return (
    <div className="container">
      <StockList />
      <Portfolio />
    </div>
  );
};

export default Dashboard;

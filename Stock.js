import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const StockMarketTracker = () => {
  const [search, setSearch] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStockData = async (symbol) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=YOUR_API_KEY`
      );

      const timeSeries = response.data["Time Series (Daily)"];
      if (!timeSeries) {
        throw new Error("Invalid symbol or no data available.");
      }

      const labels = Object.keys(timeSeries).slice(0, 10).reverse();
      const prices = labels.map((date) => parseFloat(timeSeries[date]["4. close"]));

      setStockData({
        labels,
        datasets: [
          {
            label: `${symbol} Stock Prices`,
            data: prices,
            borderColor: "#4F46E5",
            backgroundColor: "rgba(79, 70, 229, 0.2)",
          },
        ],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchStockData(search.trim().toUpperCase());
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Stock Market Tracker</h1>

      <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </Button>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {stockData && (
        <Card className="shadow-lg p-4">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Stock Data for {search}</h2>
            <Line data={stockData} options={{ maintainAspectRatio: true }} />
          </CardContent>
        </Card>
      )}

      {!stockData && !loading && !error && (
        <p className="text-center text-gray-500">Enter a stock symbol to get started.</p>
      )}
    </div>
  );
};

export default StockMarketTracker;

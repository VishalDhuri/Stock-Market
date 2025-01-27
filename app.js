const apiKey = "YOUR_API_KEY"; // Replace with your Alpha Vantage API key
const form = document.getElementById("search-form");
const stockInput = document.getElementById("stock-input");
const errorMessage = document.getElementById("error-message");
const chartContainer = document.getElementById("chart-container");
const stockTitle = document.getElementById("stock-title");
const chartElement = document.getElementById("stock-chart");
let stockChart;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const symbol = stockInput.value.trim().toUpperCase();
  if (!symbol) return;

  // Reset state
  errorMessage.textContent = "";
  chartContainer.classList.add("hidden");

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = response.data;

    if (!data["Time Series (Daily)"]) {
      throw new Error("Invalid stock symbol or no data available.");
    }

    const timeSeries = data["Time Series (Daily)"];
    const labels = Object.keys(timeSeries).slice(0, 10).reverse();
    const prices = labels.map((date) =>
      parseFloat(timeSeries[date]["4. close"])
    );

    renderChart(symbol, labels, prices);
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

function renderChart(symbol, labels, prices) {
  stockTitle.textContent = `Stock Data for ${symbol}`;
  chartContainer.classList.remove("hidden");

  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(chartElement, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `${symbol} Stock Prices`,
          data: prices,
          borderColor: "#4F46E5",
          backgroundColor: "rgba(79, 70, 229, 0.2)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
  });
}

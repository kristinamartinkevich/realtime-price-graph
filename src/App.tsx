import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  animation: {
    duration: 0
  },
  hover: {
    animationDuration: 0
  },
  responsiveAnimationDuration: 0,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Real-time Price Fluctuations',
    },
  },
  scales: {
    y: {
      beginAtZero: false,
    },
  },
};

function App() {
  const [price, setPrice] = useState<number>(100);
  const [priceHistory, setPriceHistory] = useState<number[]>([100]);
  const [timeLabels, setTimeLabels] = useState<string[]>([new Date().toLocaleTimeString()]);

  const generateNewPrice = () => {
    const change = (Math.random() - 0.5) * 2;
    const newPrice = price + change;
    return Number(newPrice.toFixed(2));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = generateNewPrice();
      setPrice(newPrice);

      setPriceHistory(prev => {
        if (prev.length > 20) {
          return [...prev.slice(1), newPrice];
        }
        return [...prev, newPrice];
      });

      setTimeLabels(prev => {
        const newTime = new Date().toLocaleTimeString();
        if (prev.length > 20) {
          return [...prev.slice(1), newTime];
        }
        return [...prev, newTime];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [price]);

  const data = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Price',
        data: priceHistory,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const isPriceUp = () => {
    return priceHistory[priceHistory.length - 1] > priceHistory[0]
  }

  const getChange = () => {
    return ((priceHistory[priceHistory.length - 1] - priceHistory[0]) / priceHistory[0] * 100).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Real-time Price Monitor</h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-3xl font-bold text-gray-900">${price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">24h Change</p>
                <p className={`text-lg font-semibold ${isPriceUp()
                  ? 'text-green-600'
                  : 'text-red-600'
                  }`}>
                  {getChange()}%
                </p>
              </div>
            </div>
          </div>

          <div className="h-[400px]">
            <Line options={options} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
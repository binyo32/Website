import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  CartesianGrid,
} from "recharts";
import FileSaver from "file-saver";

export default function LiveChartWithValue() {
  const [data, setData] = useState([]);
  const [currentDownload, setCurrentDownload] = useState(0);
  const [currentUpload, setCurrentUpload] = useState(0);
  const [running, setRunning] = useState(true);

  // generate initial data (100 points)
  useEffect(() => {
    const initialData = Array.from({ length: 100 }, (_, i) => ({
      time: i,
      download: parseFloat((Math.random() * 100).toFixed(2)),
      upload: parseFloat((Math.random() * 50).toFixed(2)),
    }));
    setData(initialData);
    setCurrentDownload(initialData[initialData.length - 1].download);
    setCurrentUpload(initialData[initialData.length - 1].upload);
  }, []);

  // update data every 0.5 seconds
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setData((prev) => {
        const nextTime = prev[prev.length - 1].time + 1;
        const nextDownload = parseFloat((Math.random() * 100).toFixed(2));
        const nextUpload = parseFloat((Math.random() * 50).toFixed(2));
        const updated = [
          ...prev.slice(1),
          { time: nextTime, download: nextDownload, upload: nextUpload },
        ];
        setCurrentDownload(nextDownload);
        setCurrentUpload(nextUpload);
        return updated;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [running]);

  const latestPoint = data.length > 0 ? data[data.length - 1] : null;

  const calcStats = (key) => {
    if (data.length === 0) return { min: 0, max: 0, avg: 0 };
    const values = data.map((d) => d[key]);
    const min = Math.min(...values).toFixed(2);
    const max = Math.max(...values).toFixed(2);
    const avg = (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(2);
    return { min, max, avg };
  };

  const downloadStats = calcStats("download");
  const uploadStats = calcStats("upload");

  const exportCSV = () => {
    const csv = ["time,download (Mbps),upload (Mbps)", ...data.map((d) => `${d.time},${d.download},${d.upload}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, "internet-speed-data.csv");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <div className="text-center mb-4">
        <div className="text-gray-500 dark:text-gray-300 text-sm">Download / Upload Speed</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {currentDownload} Mbps <span className="text-sm font-normal text-gray-400">↓</span>
        </div>
        <div className="text-2xl font-bold text-pink-500 dark:text-pink-400">
          {currentUpload} Mbps <span className="text-sm font-normal text-gray-400">↑</span>
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <div>Download - Avg: {downloadStats.avg} | Max: {downloadStats.max} | Min: {downloadStats.min}</div>
          <div>Upload - Avg: {uploadStats.avg} | Max: {uploadStats.max} | Min: {uploadStats.min}</div>
        </div>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => setRunning(!running)}
            className="px-4 py-2 rounded-xl text-white bg-blue-500 hover:bg-blue-600 transition"
          >
            {running ? "Pause" : "Resume"}
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl text-white bg-green-500 hover:bg-green-600 transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid />
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem', color: 'white' }}
            formatter={(value, name) => [`${value} Mbps`, name.charAt(0).toUpperCase() + name.slice(1)]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="download"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.1}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="download"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="upload"
            stroke="#ec4899"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          {latestPoint && (
            <>
              <ReferenceDot
                x={latestPoint.time}
                y={latestPoint.download}
                r={6}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={2}
                ifOverflow="visible"
              />
              <ReferenceDot
                x={latestPoint.time}
                y={latestPoint.upload}
                r={6}
                fill="#ec4899"
                stroke="white"
                strokeWidth={2}
                ifOverflow="visible"
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

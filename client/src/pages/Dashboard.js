import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaChartBar, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend
);

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [chartData, setChartData] = useState(null);
    const [chartType, setChartType] = useState('bar');
    const chartRef = useRef(null);

    useEffect(() => {
        if (jsonData && jsonData.length > 0) {
            const firstItemKeys = Object.keys(jsonData[0]);
            setHeaders(firstItemKeys);
            if (firstItemKeys.length > 1) {
              setXAxis(firstItemKeys[0]);
              setYAxis(firstItemKeys[1]);
            }
        }
    }, [jsonData]);

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
        toast.success(`File selected: ${acceptedFiles[0].name}`);
        setJsonData(null);
        setChartData(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/vnd.ms-excel': ['.xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }
    });
    
    const handleFileUpload = async () => {
        if (!file) { return toast.warn("Please select a file first!"); }
        const formData = new FormData();
        formData.append('excelFile', file);
        try {
            const API_URL = 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/file/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success(response.data.message);
            setJsonData(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during file upload.");
        }
    };

    const handleGenerateChart = () => {
        if (!jsonData || !xAxis || !yAxis) { return toast.warn("Please make sure data is loaded and axes are selected."); }
        const labels = jsonData.map(item => item[xAxis]);
        const data = jsonData.map(item => parseFloat(item[yAxis]));

        const colors = [
          'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'
        ];

        setChartData({
            labels: labels,
            datasets: [{
                label: yAxis,
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.6', '1')),
                borderWidth: 1,
            }]
        });
        toast.success("Chart generated successfully!");
    };

    const handleDownloadChart = () => {
        const chart = chartRef.current;
        if (!chart) { return toast.error("Please generate a chart first."); }
        const imageUrl = chart.toBase64Image();
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${chartType}-chart.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Chart downloaded!");
    };

    const dropzoneClassName = `p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300 text-center ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-slate-50 hover:bg-slate-100'}`;

    const renderChart = () => {
        if (!chartData) return <p>Your chart will appear here.</p>;
        const options = {
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `${yAxis} by ${xAxis}` }
            }
        };
        switch (chartType) {
            case 'bar': return <Bar ref={chartRef} data={chartData} options={options} />;
            case 'line': return <Line ref={chartRef} data={chartData} options={options} />;
            case 'pie': return <Pie ref={chartRef} data={chartData} options={options} />;
            default: return <Bar ref={chartRef} data={chartData} options={options} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-8 font-sans">
            <div className="container mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">Excel Analytics Platform</h1>
                    <p className="text-slate-500 mt-2">Transform your spreadsheets into powerful insights.</p>
                </header>
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Step 1: Upload Data */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-indigo-100"><FaFileUpload className="text-indigo-600 text-2xl" /></div>
                            <h2 className="text-xl font-bold ml-4">Step 1: Upload Data</h2>
                        </div>
                        <div {...getRootProps({ className: dropzoneClassName })}>
                            <input {...getInputProps()} />
                            <p className="text-slate-500">{isDragActive ? "Drop file" : "Drag & drop or click"}</p>
                        </div>
                        {file && <p className="mt-4 text-green-600 text-center font-medium">File: {file.name}</p>}
                        <button onClick={handleFileUpload} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Analyze</button>
                    </div>

                    {/* Step 2: Configure Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-indigo-100"><FaChartBar className="text-indigo-600 text-2xl" /></div>
                            <h2 className="text-xl font-bold ml-4">Step 2: Configure Chart</h2>
                        </div>
                        <div className="text-slate-600 space-y-4">
                            <div>
                                <label htmlFor="xAxis" className="block text-sm font-medium">Select X-Axis</label>
                                <select id="xAxis" value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" disabled={!jsonData}>{headers.map(header => <option key={header} value={header}>{header}</option>)}</select>
                            </div>
                            <div>
                                <label htmlFor="yAxis" className="block text-sm font-medium">Select Y-Axis</label>
                                <select id="yAxis" value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md" disabled={!jsonData}>{headers.map(header => <option key={header} value={header}>{header}</option>)}</select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Chart Type</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setChartType('bar')} className={`py-2 px-4 rounded-md text-sm ${chartType === 'bar' ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>Bar</button>
                                    <button onClick={() => setChartType('line')} className={`py-2 px-4 rounded-md text-sm ${chartType === 'line' ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>Line</button>
                                    <button onClick={() => setChartType('pie')} className={`py-2 px-4 rounded-md text-sm ${chartType === 'pie' ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>Pie</button>
                                </div>
                            </div>
                            <button onClick={handleGenerateChart} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={!jsonData}>Generate Chart</button>
                        </div>
                    </div>

                    {/* Step 3: Download */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-indigo-100"><FaDownload className="text-indigo-600 text-2xl" /></div>
                            <h2 className="text-xl font-bold ml-4">Step 3: Download</h2>
                        </div>
                        <div className="text-slate-600">
                            <p className="mb-4 text-sm">Download your chart as a high-quality PNG.</p>
                            <button onClick={handleDownloadChart} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50" disabled={!chartData}>Download</button>
                        </div>
                    </div>
                </main>
                
                {/* Visualization Section */}
                <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-slate-200">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">Your Visualization</h2>
                    <div className="h-[500px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg p-4">
                        {renderChart()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

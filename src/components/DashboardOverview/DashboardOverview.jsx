import { useEffect, useRef } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from 'chart.js';
import StatCard from '../StatCard/StatCard';
import AppointmentsAccordion from '../AppointmentsAccordion/AppointmentsAccordion';
import './DashboardOverview.scss';

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
        const { ctx, width, height, canvas } = chart;
        const meta = chart.options.plugins.centerText;
        if (!meta) return;

        const computedStyle = getComputedStyle(canvas);
        const textColor = computedStyle.getPropertyValue('--text-primary').trim() || meta.fallbackColor || '#ffffff';
        const subColor = computedStyle.getPropertyValue('--text-secondary').trim() || meta.fallbackSubColor || '#919eab';

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const centerX = width / 2;
        const centerY = (height / 2) + (meta.offsetY || 0);

        ctx.font = `700 ${meta.fontSize || 20}px Inter, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(meta.mainText || '', centerX, centerY - 6);

        if (meta.subText) {
            ctx.font = `600 ${meta.subFontSize || 9}px Inter, sans-serif`;
            ctx.fillStyle = subColor;
            ctx.fillText(meta.subText, centerX, centerY + 14);
        }
        ctx.restore();
    },
};

ChartJS.register(centerTextPlugin);

const diagnosticsData = {
    labels: ['Malaria', 'Cold', 'Typhoid', 'Others'],
    values: [35, 20, 25, 20],
    colors: ['#ff4842', '#ffab00', '#0052cc', '#00a76f'],
    total: '187.2k',
};

const patientsData = {
    labels: ['Men', 'Women', 'Children'],
    values: [50, 32, 18],
    colors: ['#0052cc', '#ff4842', '#ffab00'],
    total: '11M',
    barWidths: [70, 50, 30],
};

const healthIndexData = {
    value: 75,
    months: ['June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
};

const DiagnosticsChart = () => {
    const chartData = {
        labels: diagnosticsData.labels,
        datasets: [{
            data: diagnosticsData.values,
            backgroundColor: diagnosticsData.colors,
            borderWidth: 0,
            hoverOffset: 4,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
                },
            },
            centerText: {
                mainText: diagnosticsData.total,
                subText: 'PATIENTS',
                fontSize: 18,
                subFontSize: 9,
                fallbackColor: '#ffffff',
                fallbackSubColor: '#919eab',
            },
        },
    };

    return (
        <div className="diagnostics-chart">
            <div className="diagnostics-chart__visual">
                <div className="diagnostics-chart__tags">
                    <span className="diagnostics-chart__tag diagnostics-chart__tag--malaria">Malaria</span>
                </div>
                <div className="diagnostics-chart__donut">
                    <Doughnut data={chartData} options={chartOptions} />
                </div>
                <div className="diagnostics-chart__tags diagnostics-chart__tags--right">
                    <span className="diagnostics-chart__tag diagnostics-chart__tag--others">Others</span>
                </div>
            </div>
            <ul className="diagnostics-chart__legend">
                {diagnosticsData.labels.map((label, i) => (
                    <li className="diagnostics-chart__legend-item" key={label}>
                        <span
                            className="diagnostics-chart__legend-dot"
                            style={{ backgroundColor: diagnosticsData.colors[i] }}
                        />
                        {label}
                        <span className="diagnostics-chart__legend-value">{diagnosticsData.values[i]}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const PatientsChart = () => {
    const chartData = {
        labels: patientsData.labels,
        datasets: [{
            data: patientsData.values,
            backgroundColor: patientsData.colors,
            borderWidth: 0,
            hoverOffset: 4,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '60%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
                },
            },
            centerText: {
                mainText: patientsData.total,
                subText: 'PATIENTS',
                fontSize: 18,
                subFontSize: 9,
                fallbackColor: '#ffffff',
                fallbackSubColor: '#919eab',
            },
        },
    };

    return (
        <div className="patients-chart">
            <div className="patients-chart__visual">
                <div className="patients-chart__tags">
                    <span className="patients-chart__tag patients-chart__tag--men">Men</span>
                </div>
                <div className="patients-chart__donut">
                    <Doughnut data={chartData} options={chartOptions} />
                </div>
                <div className="patients-chart__tags patients-chart__tags--right">
                    <span className="patients-chart__tag patients-chart__tag--women">Women</span>
                </div>
            </div>
            <ul className="patients-chart__legend">
                {patientsData.labels.map((label, i) => (
                    <li className="patients-chart__legend-item" key={label}>
                        <span
                            className="patients-chart__legend-dot"
                            style={{ backgroundColor: patientsData.colors[i] }}
                        />
                        {label}
                        <div className="patients-chart__bar">
                            <div
                                className="patients-chart__bar-fill"
                                style={{
                                    width: `${patientsData.barWidths[i]}%`,
                                    backgroundColor: patientsData.colors[i],
                                }}
                            />
                        </div>
                        <span className="patients-chart__legend-value">{patientsData.values[i]}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const HealthIndexChart = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const el = containerRef.current;

        const trackColor = el
            ? getComputedStyle(el).getPropertyValue('--chart-track').trim() || '#293347'
            : '#293347';
        const accentColor = '#ff4842';
        const textColor = el
            ? getComputedStyle(el).getPropertyValue('--text-primary').trim() || '#ffffff'
            : '#ffffff';

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);

        const cx = w / 2;
        const cy = h * 0.78;
        const radius = Math.min(cx, cy) * 0.75;
        const lineWidth = 14;
        const startAngle = Math.PI;
        const endAngle = 2 * Math.PI;
        const valueAngle = startAngle + (endAngle - startAngle) * (healthIndexData.value / 100);

        ctx.clearRect(0, 0, w, h);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, endAngle, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = trackColor;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAngle, valueAngle, false);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = accentColor;
        ctx.lineCap = 'round';
        ctx.stroke();

        const dotX = cx + radius * Math.cos(valueAngle);
        const dotY = cy + radius * Math.sin(valueAngle);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = textColor;
        ctx.fill();
    }, []);

    return (
        <div className="health-index" ref={containerRef}>
            <div className="health-index__gauge">
                <div className="health-index__value">
                    <span className="health-index__number">{healthIndexData.value}%</span>
                    <span className="health-index__arrow">&uarr;</span>
                </div>
                <span className="health-index__label">Positive Health Index</span>
                <canvas ref={canvasRef} className="health-index__canvas" />
            </div>
            <div className="health-index__months">
                {healthIndexData.months.map((month) => (
                    <span key={month} className="health-index__month">{month}</span>
                ))}
            </div>
        </div>
    );
};

const SurgeryChart = () => {
    const chartData = {
        labels: ['Done', 'Remaining'],
        datasets: [{
            data: [80, 20],
            backgroundColor: ['#ff4842', '#ffe4e6'],
            borderWidth: 0,
            borderRadius: 20,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '80%',
        rotation: 270,
        circumference: 180,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            centerText: {
                mainText: '80%',
                subText: 'DONE',
                fontSize: 24,
                subFontSize: 10,
                offsetY: 45,
            },
        },
    };

    return (
        <div className="surgery-chart">
            <div className="surgery-chart__donut">
                <Doughnut data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

const ResultsChart = () => {
    const chartData = {
        labels: ['APRL', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT'],
        datasets: [{
            data: [60, 80, 50, 70, 85, 40],
            backgroundColor: '#002060',
            borderRadius: 10,
            borderSkipped: false,
            barPercentage: 0.4,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 8, weight: 'bold' }, color: '#ff4842' },
                border: { display: false },
            },
            y: {
                display: false,
                max: 100,
            },
        },
    };

    return (
        <div className="results-chart">
            <div className="results-chart__canvas-container">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

const HeartbeatChart = () => {
    const dataPoints = [0, 0, 0, 5, -5, 20, -25, 10, 0, 0, 0, 3, -3, 0, 0, 0, 6, -6, 25, -20, 8, 0, 0, 0, 0, 4, -4, 15, -10, 5, 0, 0, 0, 0];
    const chartData = {
        labels: dataPoints.map((_, i) => i),
        datasets: [{
            data: dataPoints,
            borderColor: '#ff4842',
            borderWidth: 2,
            tension: 0,
            pointRadius: 0,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
        scales: {
            x: { display: false, border: { display: false }, grid: { display: true, color: 'rgba(0,0,0,0.03)' } },
            y: { display: false, min: -35, max: 35, border: { display: false }, grid: { display: true, color: 'rgba(0,0,0,0.03)' } },
        },
    };

    return (
        <div className="heartbeat-chart">
            <div className="heartbeat-chart__canvas-container">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

const DashboardOverview = () => {
    return (
        <div className="dashboard-overview" id="overview-section">
            <div className="dashboard-overview__grid">
                <div className="dashboard-overview__cards">
                    <StatCard title="Diagnostics">
                        <DiagnosticsChart />
                    </StatCard>
                    <StatCard title="Patients">
                        <PatientsChart />
                    </StatCard>
                    <StatCard title="Health Index">
                        <HealthIndexChart />
                    </StatCard>
                    <StatCard title="Surgery">
                        <SurgeryChart />
                    </StatCard>
                    <StatCard title="Results">
                        <ResultsChart />
                    </StatCard>
                    <StatCard title="Heartbeat">
                        <HeartbeatChart />
                    </StatCard>
                </div>
                <aside className="dashboard-overview__sidebar">
                    <AppointmentsAccordion />
                </aside>
            </div>
        </div>
    );
};

export default DashboardOverview;

import { useEffect, useState, useRef } from "react";
import API from "../api/axiosInstance";
import "./Dashboard.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardStats = ({ totalEmployees, totalSalary, totalDepts }) => (
  <div className="stats-container">
    <div className="stat-card">
      <div className="stat-info">
        <h4>Total Employees</h4>
        <p className="stat-number">{totalEmployees}</p>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-info">
        <h4>Monthly Payroll</h4>
        <p className="stat-number">₹{totalSalary?.toLocaleString()}</p>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-info">
        <h4>Active Depts</h4>
        <p className="stat-number">{totalDepts}</p>
      </div>
    </div>
  </div>
);

function Dashboard() {
  const scrollRef = useRef(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalMonthlySalary: 0,
    totalDepartments: 0,
    roleCounts: {},
    deptCounts: {},
    taskStats: { completed: 0, total: 0, rate: 0 }
  });
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      // 1. Fetch Summary from Stored Procedure
      const summaryRes = await API.get("/dashboard/summary");
      const summary = summaryRes.data;

      // 2. Fetch Staff List for Chart Calculations
      const staffRes = await API.get("/staff");
      const staffs = staffRes.data;

      const roleCounts = staffs.reduce((acc, s) => {
        const role = s.role || "Others";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      const deptCounts = staffs.reduce((acc, s) => {
        const dept = s.department || "Others";
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalEmployees: summary.totalStaff || summary.TotalStaff || 0,
        totalMonthlySalary: summary.totalPayroll || summary.TotalPayroll || 0,
        totalDepartments: summary.activeDepartments || summary.ActiveDepartments || 0,
        roleCounts,
        deptCounts,
        taskStats: {
          completed: summary.completedTasks || 0,
          total: (summary.pendingTasks || 0) + (summary.completedTasks || 0),
          rate: (summary.pendingTasks + summary.completedTasks) > 0
            ? Math.round((summary.completedTasks / (summary.pendingTasks + summary.completedTasks)) * 100)
            : 0
        }
      });
      setLoading(false);
    } catch (err) {
      console.error("Dashboard error", err);
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, []);

  const chartColors = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  const doughnutData = {
    labels: Object.keys(stats.roleCounts),
    datasets: [{
      data: Object.values(stats.roleCounts),
      backgroundColor: chartColors,
      hoverOffset: 10,
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: Object.keys(stats.deptCounts),
    datasets: [{
      label: 'Staff Count',
      data: Object.values(stats.deptCounts),
      backgroundColor: '#2563eb',
      borderRadius: 10,
      barThickness: 30,
    }],
  };

  if (loading) return <div className="loading-container">Loading Analytics...</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard & Analytics</h2>

      <DashboardStats
        totalEmployees={stats.totalEmployees}
        totalSalary={stats.totalMonthlySalary}
        totalDepts={stats.totalDepartments}
      />

      <div className="analytics-grid">
        <div className="chart-card role-card">
          <h4 className="card-title">Staff by Role</h4>
          <div className="card-content">
            <div className="chart-box">
              <Doughnut
                data={doughnutData}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '75%' }}
              />
              <div className="chart-center-text">
                <h1>{stats.totalEmployees}</h1>
                <span>Total Staff</span>
              </div>
            </div>

            <div className="scroll-list custom-scroll" ref={scrollRef}>
              {Object.entries(stats.roleCounts).map(([role, count], i) => (
                <div key={role} className="list-item" style={{ borderLeft: `5px solid ${chartColors[i % chartColors.length]}` }}>
                  <span className="role-name">{role}</span>
                  <div className="role-stats">
                    <span className="role-count">{count}</span>
                    <span className="role-percent">{Math.round((count / (stats.totalEmployees || 1)) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card dept-card">
          <h4 className="card-title">Department-wise Staffing</h4>
          <div className="chart-wrapper">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1, color: '#94a3b8' }, grid: { borderDash: [5, 5] } },
                  x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card task-card">
          <h4 className="card-title">Task Completion Analysis</h4>
          <div className="task-content">
            <div className="task-main-stat">
              <h1>{stats.taskStats.rate}%</h1>
              <span>SUCCESS RATE</span>
            </div>
            <div className="task-progress-box">
              <div className="progress-info">
                <span className="label">Project Progress</span>
                <span className="count">{stats.taskStats.completed} Tasks Done</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${stats.taskStats.rate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;



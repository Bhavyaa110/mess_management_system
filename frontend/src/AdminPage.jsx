import React, { useState, useEffect } from "react";
import { Home, User, Bell, Settings, Search } from "lucide-react";
import "./adminpage.css";
import Logo from "./assets/Logo.png";
import {
  fetchAdminData,
  fetchTodayAttendance,
  fetchAttendanceByRollNo,
} from "./api/api";

const AdminPage = () => {
  const SidebarIcon = ({ icon }) => (
    <div className="icon-button">{icon}</div>
  );

  const [dashboardData, setDashboardData] = useState({});
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [searchRollNo, setSearchRollNo] = useState("");
  const [searchedAttendance, setSearchedAttendance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchAdminData();
        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
    };

    const loadTodayAttendance = async () => {
      try {
        const data = await fetchTodayAttendance();
        setTodayAttendance(data);
      } catch (err) {
        setError("Failed to load today's attendance.");
      }
    };

    loadDashboardData();
    loadTodayAttendance();
  }, []);

  const handleSearch = async () => {
    if (!searchRollNo) {
      setError("Please enter a roll number.");
      return;
    }
    try {
      const data = await fetchAttendanceByRollNo(searchRollNo);
      setSearchedAttendance(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch attendance for the given roll number.");
      setSearchedAttendance(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="leftpart">
        <div className="sidebar">
          <div className="logo"></div>
          <div className="icons">
            <img className="IMG" alt="Logo" src={Logo} />
            <SidebarIcon icon={<Home />} />
            <SidebarIcon icon={<User />} />
            <SidebarIcon icon={<Bell />} />
            <SidebarIcon icon={<Settings />} />
          </div>
        </div>
      </div>

      <div className="rightpart">
        <div className="toppart">
          <div className="navbar">
            <div className="navbar-left">Admin Dashboard</div>
            <div className="navbar-right">
              <Bell className="nav-icon" />
              <User className="nav-icon" />
            </div>
          </div>
        </div>

        <div className="bottompart">
          <div className="dashboard">
            <h2>Dashboard Overview</h2>
            {error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="dashboard-data">
                <p>Total Students: {dashboardData.total_students}</p>
                <p>Total Staff: {dashboardData.total_staff}</p>
                <p>Total Meals: {dashboardData.total_meals}</p>
              </div>
            )}
         </div>

                        <div className="today-attendance">
                <h2>Today's Attendance</h2>
                <ul>
                    {todayAttendance.length > 0 ? (
                    todayAttendance.map((meal) => (
                        <li key={meal.meal_type}>
                        {meal.meal_type}: {meal.attendance} attended
                        </li>
                    ))
                    ) : (
                    <li>No attendance records for today.</li>
                    )}
                </ul>
                </div>


                <div className="search-attendance">
                <h2>Search Attendance by Roll Number</h2>
                <div className="search-bar">
                    <input
                    type="text"
                    placeholder="Enter Roll Number"
                    value={searchRollNo}
                    onChange={(e) => setSearchRollNo(e.target.value)}
                    />
                    <button onClick={handleSearch}>
                    <Search className="search-icon" /> Search
                    </button>
                </div>
                {searchedAttendance && (
                    <div className="searched-attendance">
                    <p>Roll Number: {searchedAttendance.roll_no}</p>
                    <ul>
                        {searchedAttendance.details.map((detail, index) => (
                        <li key={index}>
                            {detail.meal_date} - {detail.meal_type}: {detail.status}
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
                </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPage;

import React from "react";
import { useEffect,useState, useRef } from "react";
import dayjs from 'dayjs';
import "./landingpage.css";
import { Home, User, Bell, Settings } from "lucide-react";
import Logo from "./assets/Logo.png";
import Wallet from "./assets/Wallet.png"
import Meals from "./assets/Meals.svg"
import Ticket from "./assets/Ticket.png"
import Calendar from "./Calendar";



const LandingPage = () => {
  const SidebarIcon = ({ icon }) => <div className="icon-button">{icon}</div>;
  
  const [menuData, setMenuData] = useState([]);
  const today = dayjs();
  const daysInMonth = today.daysInMonth();
  const scrollRef = useRef(null);
  const todayRef = useRef(null);

  const dates = Array.from({ length: daysInMonth }, (_, i) => today.date(i + 1));

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }
  }, []);
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const day = new Date().toLocaleString("en-US", { weekday: "long" });
        const response = await fetch(`http://localhost:5001/api/meals?day=${day}`);
        const data = await response.json();
        const formattedData = [
          { meal_type: "Breakfast", menu: data.Breakfast || "Not available" },
          { meal_type: "Lunch", menu: data.Lunch || "Not available" },
          { meal_type: "Dinner", menu: data.Dinner || "Not available" },
        ];
        setMenuData(formattedData);
        console.log("Menu data:", formattedData); // Debugging output
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };
  
    fetchMenuData();
  }, []);
   
  const [walletData, setWalletData] = useState(null);
  const [walletError, setWalletError] = useState("");
const handleWalletClick = async () => {
    try {
      // Retrieve user ID dynamically from localStorage (or any other storage mechanism)
      const user = JSON.parse(localStorage.getItem("user")); // Assumes 'user' object contains 'user_id'
      const userId = user?.user_id;
  
      if (!userId) {
        alert("User ID not found. Please log in.");
        return;
      }
  
      const response = await fetch("http://localhost:5001/api/user_wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
  
      const data = await response.json();
      console.log("Wallet API Response:", data); // Debugging
      setWalletData(data); // Update the wallet state
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      setWalletError("Failed to fetch wallet data.");
    }
  };
  
  const [currentMeal, setCurrentMeal] = useState(null);


  const fetchCurrentMeal = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/meal_timings");
      const mealTimings = await response.json();
  
      if (!Array.isArray(mealTimings)) {
        throw new Error("Invalid response: mealTimings is not an array");
      }
  
      // Get current time
      const now = new Date();
      const currentTime = now.toTimeString().split(" ")[0]; // Format: HH:MM:SS
  
      // Find the active meal based on current time
      const meal = mealTimings.find(meal => {
        return currentTime >= meal.start_time && currentTime <= meal.end_time;
      });
  
      return meal; // Return the current meal object or null if none found
    } catch (error) {
      console.error("Failed to fetch current meal:", error);
      return null;
    }
  };
   // Runs once on component mount
  

  const markAttendance = async () => {
    try {
      // Retrieve user ID from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.user_id;
  
      if (!userId) {
        alert("User ID not found. Please log in.");
        return;
      }
  
      // Fetch the current meal based on time
      const currentMeal = await fetchCurrentMeal();
      if (!currentMeal) {
        alert("No active meal found at this time.");
        return;
      }
  
      // Map the current meal to its meal_id (you might need another API to fetch meal_id if not part of meal timings)
      const mealId = currentMeal.meal_id || 1; // Replace `1` with actual logic to fetch meal_id dynamically
      const status = "attended"; // You can also make this dynamic
  
      // Send API request to mark attendance
      const response = await fetch("http://localhost:5001/api/mark_attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          meal_id: mealId,
          status: status,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message); // Show success message
      } else {
        alert(`Error: ${data.error}`); // Show error message
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      alert("An error occurred while marking attendance.");
    }
  };

  const handleCancelMeal = async (mealType) => {
    try {
      const user = JSON.parse(localStorage.getItem("user")); // Retrieve logged-in user's details
      const userId = user?.user_id;
  
      if (!userId) {
        alert("User ID not found. Please log in.");
        return;
      }
  
      const response = await fetch("http://localhost:5001/api/cancel_meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, meal_type: mealType }), // Pass mealType to backend
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message); // Notify the user of success
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to cancel meal:", error);
      alert("An error occurred while cancelling the meal.");
    }
  };
  
  
  
  
  
  
  
  
  return (
    <div className="page">
      <div className="leftpart">
        <div className="sidebar">
          <div className="logo"></div>
          <div className="icons">
            <img className="IMG" alt="Img" src={Logo} />
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
            <div className="navbar-left">Welcome to MEXX student</div>
            <div className="navbar-right">
              <Bell className="nav-icon" />
              <User className="nav-icon" />
            </div>
          </div>
        </div>
        <div className="bottompart">
          <div className="part1">
            <div className="part1up">


            <div className="meal-container">
            <div className="breakfast">
                Breakfast
                <div className="buttons">
                <button onClick={() => handleCancelMeal("Breakfast")}>Cancel</button> </div>
              </div>
              <div className="breakfast">
                Lunch
                <div className="buttons">
                <button onClick={() => handleCancelMeal("Lunch")}>Cancel</button></div>
              </div>
              <div className="breakfast">
                Dinner
                <div className="buttons">
                <button onClick={() => handleCancelMeal("Dinner")}>Cancel</button></div>
              </div>
            </div>




            </div>
            <div className="calendar">
              <Calendar />
            </div>
          </div>


          <div className="part2">
            <div className="part2up">
            <div className="box1" onClick={handleWalletClick}>
                <div className="boximg">
                  <img className="Img1" alt="Img" src={Wallet} />
                </div>
                Wallet
                {walletData && (
                  <div className="wallet-details">
                    <p>Balance: ₹{walletData.balance}</p>
                    <p>Penalty Points: {walletData.penalty_points}</p>
                  </div>
                )}
                {walletError && <p className="error-message">{walletError}</p>}

              </div>
              <div className="box2">
                <div className="boximg">
                  <img className="Img1" alt="Img" src={Meals} />
                </div>
                Meals
              </div>

              <div className="box3" onClick={markAttendance}>
              <div className="boximg">
                <img className="Img1" alt="Img" src={Ticket} />
              </div>
              <p>Mark attendance</p>
              <div className="current-meal">
                 
                <p>Current Meal: {currentMeal ? currentMeal.meal_type : "None"}</p>
              </div>
              
              </div>
            </div>


            <div className="part2down">
              <div className="menu">
                <p>Menu for the week</p>
                <h2 className="calendar-month">{today.format("MMMM YYYY")}</h2>
                <div className="calendar-scroll" ref={scrollRef}>
                  <div className="calendar-row">
                    {dates.map((date) => {
                      const isToday = date.isSame(today, "date");
                      return (
                        <div
                          className={`calendar-day ${isToday ? "today" : ""}`}
                          key={date.format("YYYY-MM-DD")}
                          ref={isToday ? todayRef : null}
                        >
                          <div className="day-name">{date.format("ddd")}</div>
                          <div className="day-number">{date.format("D")}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>


                <div className="menulist">
  {menuData && menuData.length > 0 ? (
    <table className="menu-table">
      <thead>
        <tr>
          <th>Meal</th>
          <th>Menu</th>
        </tr>
      </thead>
      <tbody>
        {menuData.map((meal, index) => (
          <tr key={index}>
            <td>{meal.meal_type}</td>
            <td>{meal.menu}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No menu available for today.</p>
  )}
</div>




              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

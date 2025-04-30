import React, { useState } from "react";
import "./Calendar.css";

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const isInRange = (day) => {
    if (!fromDate || !toDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date >= fromDate && date <= toDate;
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    if (!fromDate || (fromDate && toDate)) {
      setFromDate(clickedDate);
      setToDate(null);
    } else {
      if (clickedDate >= fromDate) {
        setToDate(clickedDate);
      } else {
        setFromDate(clickedDate);
      }
    }
  };

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleManualDateChange = (value, type) => {
    const date = new Date(value);
    if (type === "from") setFromDate(date);
    else setToDate(date);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  return (
    <div className="calendar-container">
      <div className="tabs">
        Select Dates for future cancellation
      </div>

      <div className="calendar">
        <div className="header">
          <button onClick={() => changeMonth(-1)}>&lt;</button>
          <span>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button onClick={() => changeMonth(1)}>&gt;</button>
        </div>

        <div className="weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="days">
          {Array.from({ length: firstDay }, (_, i) => (
            <div className="empty" key={"e" + i}></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isSelected =
              (fromDate &&
                fromDate.getDate() === day &&
                fromDate.getMonth() === currentMonth &&
                fromDate.getFullYear() === currentYear) ||
              (toDate &&
                toDate.getDate() === day &&
                toDate.getMonth() === currentMonth &&
                toDate.getFullYear() === currentYear);

            return (
              <div
                key={day}
                className={`day ${isInRange(day) ? "highlight" : ""} ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="date-inputs">
        <label>
          From:
          <input
            type="date"
            value={fromDate ? fromDate.toISOString().split("T")[0] : ""}
            onChange={(e) => handleManualDateChange(e.target.value, "from")}
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={toDate ? toDate.toISOString().split("T")[0] : ""}
            onChange={(e) => handleManualDateChange(e.target.value, "to")}
          />
        </label>
      </div>

      <button className="confirm">Confirm</button>
    </div>
  );
};

export default Calendar;

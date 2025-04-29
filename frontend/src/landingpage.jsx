import React from "react";
import { useEffect, useRef } from "react";
import dayjs from 'dayjs';
import "./landingpage.css";
import { Home, User, Bell, Settings } from "lucide-react";
import Logo from "./assets/Logo.png";
import Wallet from "./assets/Wallet.png"
import Meals from "./assets/Meals.svg"
import Ticket from "./assets/Ticket.png"

const LandingPage = () => {
  const SidebarIcon = ({ icon }) => <div className="icon-button">{icon}</div>;

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
            <div className="navbar-left">Welcome to MEXX</div>
            <div className="navbar-right">
              <Bell className="nav-icon" />
              <User className="nav-icon" />
            </div>
          </div>
        </div>
        <div className="bottompart">
          <div className="part1"></div>
          <div className="part2">
            <div className="part2up">
              <div className="box1">
                <div className="boximg">
                  <img className="Img1" alt="Img" src={Wallet} />
                </div>
                Wallet
              </div>
              <div className="box2">
                <div className="boximg">
                  <img className="Img1" alt="Img" src={Meals} />
                </div>
                Meals
              </div>
              <div className="box3">
                <div className="boximg">
                  <img className="Img1" alt="Img" src={Ticket} />
                </div>
                Tickets
              </div>
            </div>
            <div className="part2down">
              <div className="menu">
                <p>Menu for the week</p>
                <h2 className="calendar-month">{today.format('MMMM YYYY')}</h2>
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
                <div className="breakfast"><p>Breakfast</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

CREATE DATABASE MessManagementSystem
    DEFAULT CHARACTER SET = 'utf8mb4';
-- Use the newly created database
USE MessManagementSystem;
-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    roll_no INT UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Staff', 'Admin') DEFAULT 'Student',
    hostel ENUM('A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'PG', 'Q', 'FRF', 'FRG'),
    branch ENUM('COPC', 'COE', 'COBS', 'COSE', 'ENC', 'ECE', 'EEC', 'EIC', 'EVD', 'RAI', 'ELE', 'CIE', 'CCA', 'MEE', 'MEC', 'CHE', 'BT', 'BME'),
    year ENUM('1','2','3','4'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Meals Table
CREATE TABLE Meals (
    meal_id INT AUTO_INCREMENT PRIMARY KEY,
    meal_type ENUM('Breakfast', 'Lunch', 'Dinner') NOT NULL,
    meal_date DATE NOT NULL,
    menu TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Attendance Table
CREATE TABLE Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    meal_id INT,
    scan_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (meal_id) REFERENCES Meals(meal_id)
);
-- Tickets Table
CREATE TABLE Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    meal_id INT,
    status ENUM('Cancelled', 'Reserved', 'Pending') DEFAULT 'Pending',
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (meal_id) REFERENCES Meals(meal_id)
);


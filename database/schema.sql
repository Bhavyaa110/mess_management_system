CREATE DATABASE mess_management_system
    DEFAULT CHARACTER SET = 'utf8mb4';

use mess_management_system;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    roll_no INT UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Staff', 'Admin') DEFAULT 'Student',
    hostel ENUM('A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'PG', 'Q', 'FRF', 'FRG'),
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

ALTER TABLE Attendance
MODIFY scan_time TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE Attendance
ADD COLUMN status ENUM('present', 'absent') DEFAULT 'absent';

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

CREATE TABLE Meal_Timings (
    meal_type VARCHAR(20) PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

INSERT INTO Meal_Timings (meal_type, start_time, end_time) VALUES
('Breakfast', '07:00:00', '09:00:00'),
('Lunch',     '12:00:00', '14:00:00'),
('Dinner',    '19:00:00', '21:00:00');


INSERT INTO Users
  (full_name, roll_no, email, phone_number, password_hash, role, hostel, branch, year)
VALUES
  ('Devansh Mehra',     221001, 'devansh.mehra@nitk.edu.in',    '9998881001', MD5('Hello@123'), 'Student', 'M'),
  ('Tanya Aggarwal',    221002, 'tanya.aggarwal@nitk.edu.in',   '9998881002', MD5('Tanya#456'), 'Student', 'N'),
  ('Yash Thakur',       221003, 'yash.thakur@nitk.edu.in',      '9998881003', MD5('Yash789!'),  'Student', 'L'),
  ('Meera Iyer',        221004, 'meera.iyer@nitk.edu.in',       '9998881004', MD5('Meera@321'), 'Student', 'PG'),
  ('Arjun Bhatt',       221005, 'arjun.bhatt@nitk.edu.in',      '9998881005', MD5('Arjun$999'), 'Student', 'FRF'),
  ('Simran Kaur',       221006, 'simran.kaur@nitk.edu.in',      '9998881006', MD5('Simran2025'),'Student', 'FRG'),
  ('Aniket Das',        221007, 'aniket.das@nitk.edu.in',       '9998881007', MD5('Das@pass1'), 'Student', 'Q'),
  ('Nidhi Bansal',      221008, 'nidhi.bansal@nitk.edu.in',     '9998881008', MD5('Bansal@456'),'Student', 'H'),
  ('Saurav Chauhan',    521001, 'saurav.chauhan@nitk.edu.in',   '9998881009', MD5('Staff@2025'),'Staff',   'G'),
  ('Priya Sehgal',      921001, 'priya.sehgal@nitk.edu.in',     '9998881010', MD5('Admin#2025'),'Admin',   'K');

-- Insert 10 users into Users table
INSERT INTO Users
  (full_name, roll_no, email, phone_number, password_hash, role, hostel, branch, year)
VALUES
  ('Aarav Sharma',    201001, 'aarav.sharma20@nitk.edu.in',   '9876500123', MD5('Pass@123'), 'Student', 'A', 'COSE', '2'),
  ('Ishita Patel',    201002, 'ishita.patel20@nitk.edu.in',   '9876500456', MD5('Qwerty!1'), 'Student', 'B', 'ECE',  '2'),
  ('Rahul Verma',     201003, 'rahul.verma20@nitk.edu.in',    '9876500789', MD5('Welcome#2'), 'Student', 'C', 'MEC', '3'),
  ('Sneha Nair',      201004, 'sneha.nair20@nitk.edu.in',     '9876500111', MD5('Sunshine3'), 'Student', 'D', 'CHE',  '1'),
  ('Vikram Singh',    201005, 'vikram.singh20@nitk.edu.in',   '9876500222', MD5('Autumn$4'), 'Student', 'E', 'BT',   '4'),
  ('Pooja Rao',       201006, 'pooja.rao20@nitk.edu.in',      '9876500333', MD5('Winter%5'), 'Student', 'G', 'EEC',  '3'),
  ('Manish Kulkarni', 201007, 'manish.kulkarni20@nitk.edu.in','9876500444', MD5('Spring^6'), 'Student', 'H', 'MEE',  '1'),
  ('Kavya Menon',     201008, 'kavya.menon20@nitk.edu.in',    '9876500555', MD5('Galaxy*7'), 'Student', 'I', 'MEC',  '2'),
  -- one Staff member
  ('Ramesh Khanna',   500101, 'ramesh.khanna@nitk.edu.in',   '9876500666', MD5('Staff!2025'),'Staff',   'J', 'CCA',  NULL),
  -- one Admin account
  ('Neha Desai',      900901, 'neha.desai@nitk.edu.in',      '9876500777', MD5('Admin#2025'),'Admin',   'K', 'CCA',  NULL);

-- Insert Data into Meals Table
INSERT INTO Meals (meal_type, meal_date, menu)
VALUES
('Breakfast', '2025-03-27', 'Idli, Sambhar, Chutney'),
('Lunch', '2025-03-27', 'Paneer Butter Masala, Naan, Rice'),
('Dinner', '2025-03-27', 'Rajma, Rice, Roti'),
('Breakfast', '2025-03-28', 'Aloo Paratha, Curd, Pickle'),
('Lunch', '2025-03-28', 'Chole Bhature, Salad'),
('Dinner', '2025-03-28', 'Kadhi Pakora, Rice, Chapati'),
('Breakfast', '2025-03-29', 'Poha, Jalebi, Tea'),
('Lunch', '2025-03-29', 'Veg Pulao, Raita, Papad'),
('Dinner', '2025-03-29', 'Dal Makhani, Rice, Naan'),
('Breakfast', '2025-03-30', 'Upma, Coconut Chutney');


-- Insert sample data into Tickets
INSERT INTO Tickets (user_id, meal_id, status, purchase_date)
VALUES
  (1,  1, 'Reserved',  '2025-03-27 07:50:00'),
  (2,  1, 'Cancelled', '2025-03-27 08:10:00'),
  (3,  2, 'Reserved',  '2025-03-27 12:30:00'),
  (4,  2, 'Pending',   '2025-03-27 12:45:00'),
  (5,  3, 'Reserved',  '2025-03-27 19:00:00'),
  (6,  4, 'Cancelled', '2025-03-28 07:55:00'),
  (7,  5, 'Reserved',  '2025-03-28 12:15:00'),
  (8,  6, 'Pending',   '2025-03-28 12:40:00'),
  (9,  7, 'Reserved',  '2025-03-29 08:05:00'),
  (10, 8, 'Reserved',  '2025-03-29 12:20:00');



-- Insert Data into Attendance Table
INSERT INTO Attendance (user_id, meal_id, scan_time)
VALUES
(1, 1, '2025-03-27 08:30:00'),
(2, 1, NULL),
(3, 2, '2025-03-27 13:00:00'),
(4, 2, NULL),
(5, 3, '2025-03-27 19:30:00'),
(6, 4, NULL),
(7, 5, '2025-03-28 08:15:00'),
(8, 6, NULL),
(9, 7, '2025-03-29 09:00:00'),
(10, 8, '2025-03-29 13:20:00');

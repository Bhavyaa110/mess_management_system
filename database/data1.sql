-- Insert Data into Users Table
INSERT INTO Users (full_name, roll_no, email, phone_number, password_hash, role, hostel, branch, year)
VALUES
('Amit Sharma', 210101, 'amit.sharma@example.com', '9876543210', 'pass123', 'Student', 'M', 'COE', '2'),
('Pooja Verma', 210102, 'pooja.verma@example.com', '9876543211', 'pass124', 'Student', 'B', 'ENC', '1'),
('Rahul Mehta', 210103, 'rahul.mehta@example.com', '9876543212', 'pass125', 'Student', 'C', 'COBS', '3'),
('Sneha Kapoor', 210104, 'sneha.kapoor@example.com', '9876543213', 'pass126', 'Staff', 'D', 'EEC', '4'),
('Karan Singh', 210105, 'karan.singh@example.com', '9876543214', 'pass127', 'Student', 'E', 'EVD', '2'),
('Nisha Jain', 210106, 'nisha.jain@example.com', '9876543215', 'pass128', 'Admin', 'F', 'EIC', '4'),
('Vikas Thakur', 210107, 'vikas.thakur@example.com', '9876543216', 'pass129', 'Student', 'G', 'COE', '1'),
('Anjali Gupta', 210108, 'anjali.gupta@example.com', '9876543217', 'pass130', 'Student', 'H', 'MEC', '3'),
('Ravi Kumar', 210109, 'ravi.kumar@example.com', '9876543218', 'pass131', 'Staff', 'I', 'CHE', '4'),
('Divya Sharma', 210110, 'divya.sharma@example.com', '9876543219', 'pass132', 'Student', 'J', 'BT', '2');

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

-- Insert Data into Tickets Table
INSERT INTO Tickets (user_id, meal_id, status)
VALUES
(1, 1, 'Reserved'),
(2, 1, 'Cancelled'),
(3, 2, 'Reserved'),
(4, 2, 'Pending'),
(5, 3, 'Reserved'),
(6, 4, 'Cancelled'),
(7, 5, 'Reserved'),
(8, 6, 'Pending'),
(9, 7, 'Reserved'),
(10, 8, 'Reserved');

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

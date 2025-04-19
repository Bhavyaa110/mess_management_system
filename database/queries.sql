
select * from users, meals, tickets, attendance;

-- View today's meals
SELECT * FROM Meals WHERE meal_date = CURDATE();

-- Get all reserved tickets for today:
SELECT u.full_name, m.meal_type, t.status, t.purchase_date
FROM Tickets t
JOIN Users u ON t.user_id = u.user_id
JOIN Meals m ON t.meal_id = m.meal_id
WHERE m.meal_date = CURDATE() AND t.status = 'Reserved';

-- Generate attendance report:
SELECT u.full_name, m.meal_type, a.scan_time
FROM Attendance a
JOIN Users u ON a.user_id = u.user_id
JOIN Meals m ON a.meal_id = m.meal_id
WHERE m.meal_date = CURDATE();

-- return number of students attending 
SELECT COUNT(DISTINCT t.user_id) AS total_attending_students
FROM Tickets t
JOIN Users u ON t.user_id = u.user_id
JOIN Meals m ON t.meal_id = m.meal_id
WHERE t.status != 'Cancelled'
  AND m.meal_date = CURDATE()
  AND u.role = 'Student';


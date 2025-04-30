
select * from users, meals, tickets, attendance;

-- View today's meals
SELECT *
FROM Meals
WHERE day_of_week = DAYNAME(CURDATE());

-- Get all reserved tickets for today:
SELECT * FROM Tickets
WHERE status = 'Reserved'
  AND DATE(purchase_date) = CURDATE();


-- Generate todays' attendance report:
SELECT 
    u.full_name,
    u.roll_no,
    m.meal_type,
    a.scan_time,
    a.status
FROM Attendance a
JOIN Users u ON a.user_id = u.user_id
JOIN Meals m ON a.meal_id = m.meal_id
WHERE DATE(a.scan_time) = CURDATE()
ORDER BY a.scan_time;


-- return number of students attending 
SELECT m.meal_type, COUNT(a.attendance_id) AS students_present
FROM Attendance a
JOIN Meals m ON a.meal_id = m.meal_id
WHERE DATE(a.scan_time) = CURDATE()
  AND a.status = 'present'
GROUP BY m.meal_type;

SELECT user_id, email, password_hash FROM Users WHERE email = 'hello@hello';

SELECT * FROM Users WHERE email = 'hello@hello';




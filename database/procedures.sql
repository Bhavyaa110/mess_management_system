USE mess_management_system;

DELIMITER //

CREATE PROCEDURE CancelMeals(IN p_user_id INT, IN p_meal_id INT)
BEGIN
  DECLARE meal_time TIME;
  SELECT mt.start_time INTO meal_time
  FROM Meal_Timings mt
  JOIN Meals m ON m.meal_type = mt.meal_type
  WHERE m.meal_id = p_meal_id;

  IF TIMESTAMPDIFF(MINUTE, NOW(), CONCAT(CURDATE(), ' ', meal_time)) < 120 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot cancel within 2 hours of meal time.';
  ELSE
    UPDATE Tickets SET status = 'Cancelled'
    WHERE user_id = p_user_id AND meal_id = p_meal_id;
  END IF;
END;
//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE AutoReserveMeals()
BEGIN
  INSERT INTO Tickets (user_id, meal_id, status)
  SELECT u.user_id, m.meal_id, 'Reserved'
  FROM Users u
  CROSS JOIN Meals m
  WHERE m.meal_date = CURDATE()
    AND NOT EXISTS (
      SELECT 1 FROM Tickets t
      WHERE t.user_id = u.user_id AND t.meal_id = m.meal_id
    );
END;
//

DELIMITER ;


DELIMITER //

CREATE PROCEDURE UpdatePointsForMealAttendance(
    IN p_user_id INT,
    IN p_meal_id INT
)
BEGIN
    DECLARE attendance_status BOOLEAN;
    DECLARE ticket_status VARCHAR(20);
    DECLARE current_points INT;
    DECLARE penalty_points INT DEFAULT 0;

    -- Retrieve the user's current points balance
    SELECT total_points INTO current_points
    FROM Users
    WHERE user_id = p_user_id;

    -- Retrieve the attendance status for the specific meal
    SELECT attendance INTO attendance_status
    FROM Tickets
    WHERE user_id = p_user_id AND meal_id = p_meal_id;

    -- Retrieve the ticket status (whether it was canceled)
    SELECT status INTO ticket_status
    FROM Tickets
    WHERE user_id = p_user_id AND meal_id = p_meal_id;

    -- If attendance is true (present), subtract 50 points
    IF attendance_status = TRUE THEN
        SET penalty_points = penalty_points +50;
    END IF;

    -- If the user didn't attend and the ticket is not canceled, subtract 20 points
    IF attendance_status = FALSE AND ticket_status != 'Cancelled' THEN
        SET penalty_points = penalty_points + 20;
    END IF;

    -- Update the user's points by deducting the penalty
    UPDATE Users
    SET total_points = current_points - penalty_points
    WHERE user_id = p_user_id;

END //

DELIMITER ;

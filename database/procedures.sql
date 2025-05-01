USE mess_management_system;

DELIMITER //

DELIMITER $$

DELIMITER $$


DELIMITER $$

CREATE PROCEDURE CancelMealProcedure (
    IN user_id INT,
    IN meal_type VARCHAR(20)
)
BEGIN

    DECLARE meal_id INT;
    DECLARE start_time TIME;
    DECLARE now_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

    -- Get the current day name
    DECLARE today VARCHAR(10);
    SET today = DAYNAME(now_time);

    -- Fetch the meal_id for the current day and meal type
    SELECT meal_id INTO meal_id
    FROM Meals
    WHERE meal_type = meal_type AND day_of_week = today
    LIMIT 1;

    -- Check if meal_id exists
    IF meal_id IS NOT NULL THEN
        -- Fetch the start_time for the meal type
        SELECT start_time INTO start_time
        FROM Meal_Timings
        WHERE meal_type = meal_type
        LIMIT 1;

        -- Check if start_time exists
        IF start_time IS NOT NULL THEN
            -- Check if cancellation is allowed (2+ hours before start_time)
            IF TIME_TO_SEC(TIMEDIFF(start_time, TIME(now_time))) > 7200 THEN
                -- Update ticket status to 'Cancelled'
                UPDATE Tickets
                SET status = 'Cancelled', purchase_date = CURRENT_TIMESTAMP
                WHERE user_id = user_id AND meal_id = meal_id;

                -- Return success message
                SELECT CONCAT(meal_type, ' meal cancelled successfully!') AS message;
            ELSE
                -- Return error for timing constraint
                SELECT 'Cannot cancel meal less than 2 hours before the start time.' AS error_message;
            END IF;
        ELSE
            -- Return error for missing meal timing
            SELECT 'Meal timing not found.' AS error_message;
        END IF;
    ELSE
        -- Return error for missing meal
        SELECT 'Meal not found for the current day.' AS error_message;
    END IF;
END ;

call `CancelMealProcedure`( 3,'breakfast');
=======
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

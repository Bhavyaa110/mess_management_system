use mess_management_system

DELIMITER //

CREATE PROCEDURE CancelMeal(IN p_user_id INT, IN p_meal_id INT)
BEGIN
  DECLARE meal_time TIME;

  SELECT start_time INTO meal_time
  FROM MealTimings mt
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


-- Prevent duplicate reservations:
CREATE TRIGGER prevent_duplicate_reservations
BEFORE INSERT ON Tickets
FOR EACH ROW
BEGIN
  IF EXISTS (
    SELECT 1 FROM Tickets 
    WHERE user_id = NEW.user_id AND meal_id = NEW.meal_id
  ) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'User has already reserved for this meal';
  END IF;
END;

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


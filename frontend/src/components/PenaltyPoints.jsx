import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserStatus = ({ user_id }) => {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get(`/get_user_status?user_id=${user_id}`);
        setUserStatus(response.data);
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchUserStatus();
  }, [user_id]);

  if (!userStatus) return <div>Loading...</div>;

  return (
    <div>
      <h3>User Status</h3>
      <p>Total Maximum Points: {userStatus.max_semester_points}</p>
      <p>Total Penalty Points: {userStatus.total_penalty_points}</p>
      <p>Total Earned Points: {userStatus.total_earned_points}</p>
      <p>Remaining Points: {userStatus.max_semester_points - userStatus.total_earned_points}</p>
    </div>
  );
};

export default UserStatus;

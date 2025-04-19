import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PenaltyStatus = ({ user_id }) => {
  const [totalPenalty, setTotalPenalty] = useState(0);

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const response = await axios.get(`/get_user_penalties?user_id=${user_id}`);
        setTotalPenalty(response.data.total_penalty_points);
      } catch (error) {
        console.error("Error fetching penalty points:", error);
      }
    };

    fetchPenalties();
  }, [user_id]);

  return (
    <div>
      <h3>Your Total Penalty Points: {totalPenalty}</h3>
    </div>
  );
};

export default PenaltyStatus;

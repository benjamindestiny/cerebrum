import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const TestLeaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const test = async () => {
      try {
        // Test 1: Check if we can read quiz_results
        const { data: quizData, error: quizError } = await supabase
          .from('quiz_results')
          .select('*')
          .limit(5);

        console.log('Quiz Results:', quizData, quizError);

        // Test 2: Check if we can read users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*')
          .limit(5);

        console.log('Users:', usersData, usersError);

        setData({ quizData, usersData });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    test();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4  text-white border-[#2A2A4A]">
      <h1 className="text-white text-xl  text-white border-[#2A2A4A]">Test Results</h1>
      <pre className="text-gray-300 text-xs mt-4  text-white border-[#2A2A4A]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default TestLeaderboard;

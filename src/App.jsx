// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { format } from 'date-fns';
import { useLocalStorage } from './useLocalStorage';

import Dashboard from './pages/Dashboard';
import ReportsPage from './pages/ReportsPage';

// Mock data for the very first time a user visits
const initialHabits = [];

function App() {
  // THE STATE AND LOGIC NOW LIVE HERE, IN THE PARENT!
  const [habits, setHabits] = useLocalStorage('habits', initialHabits);
  const [showAddForm, setShowAddForm] = useState(false);
  const todayString = format(new Date(), 'yyyy-MM-dd');

  const addHabit = (name) => {
    const newHabit = {
      id: Date.now(),
      name: name,
      completed: {},
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
    setShowAddForm(false);
  };

  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    setHabits(updatedHabits);
  };

  const toggleComplete = (habitId, dateString) => {
    const habitToUpdate = habits.find(habit => habit.id === habitId);
    const updatedCompleted = { ...habitToUpdate.completed };

    if (updatedCompleted[dateString]) {
      delete updatedCompleted[dateString];
    } else {
      updatedCompleted[dateString] = true;
    }

    const updatedHabits = habits.map(habit =>
      habit.id === habitId
        ? { ...habit, completed: updatedCompleted }
        : habit
    );
    setHabits(updatedHabits);

    console.log("Just updated state in App.jsx. New habits:", updatedHabits);
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Dashboard 
            habits={habits}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            todayString={todayString}
            addHabit={addHabit}
            deleteHabit={deleteHabit}
            toggleComplete={toggleComplete}
          />
        } 
      />
      <Route 
        path="/report/:habitId" 
        element={<ReportsPage habits={habits} />} 
      />
    </Routes>
  );
}

export default App;
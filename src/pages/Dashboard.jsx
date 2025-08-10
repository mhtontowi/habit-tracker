// src/pages/Dashboard.jsx
import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

import HabitCard from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';

// It now receives all its data and functions as props from App.jsx
const Dashboard = ({
  habits,
  showAddForm,
  setShowAddForm,
  todayString,
  addHabit,
  deleteHabit,
  toggleComplete,
}) => {
  return (
    <AppContainer>
      <Header>
        <DateDisplay>{format(new Date(), 'MMM d, yyyy')}</DateDisplay>
        <AddButton onClick={() => setShowAddForm(!showAddForm)}>+</AddButton>
      </Header>
      
      {showAddForm && <AddHabitForm onAdd={addHabit} onCancel={() => setShowAddForm(false)} />}
      
      {habits.length > 0 ? (
        <HabitsList>
          {habits.map(habit => (
            <HabitCard 
              key={habit.id} 
              habit={habit}
              onToggleComplete={toggleComplete}
              onDelete={deleteHabit}
              todayString={todayString}
            />
          ))}
        </HabitsList>
      ) : (
        !showAddForm && (
          <EmptyState>
            Build a better YOU, one brick at a time
          </EmptyState>
        )
      )}
    </AppContainer>
  );
};

// --- All the styles at the bottom stay exactly the same ---
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const DateDisplay = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;
const AddButton = styled.button`
  font-size: 2rem;
  line-height: 1;
  font-weight: 300;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 4px;
  &:hover {
    background-color: #f0f0f0;
  }
`;
const HabitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const EmptyState = styled.p`
  text-align: center;
  font-size: 1.2rem;
  margin-top: 5rem;
  color: ${({ theme }) => theme.colors.lightText};
`;

export default Dashboard;
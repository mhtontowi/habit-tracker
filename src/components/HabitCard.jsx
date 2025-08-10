// src/components/HabitCard.jsx
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';
import { format, subDays, isSameDay } from 'date-fns';

const today = new Date();

const HabitCard = ({ habit, onToggleComplete, onDelete, todayString }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(today, i)).reverse();

  const isCompletedToday = !!habit.completed[todayString];

  if (isConfirmingDelete) {
    return (
      <ConfirmCard>
        <p>Are you sure you want to delete this progress?</p>
        <Button onClick={() => onDelete(habit.id)}>Delete</Button>
        <Button onClick={() => setIsConfirmingDelete(false)} secondary>Cancel</Button>
      </ConfirmCard>
    );
  }

  return (
    <Card>
      <CardHeader>
        <HabitName>{habit.name}</HabitName>
        <DeleteButton onClick={() => setIsConfirmingDelete(true)}>
          <FaTrash />
        </DeleteButton>
      </CardHeader>
      
      <StreakView>
        {last7Days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const isCompleted = !!habit.completed[dateKey];
          return (
            <Day key={day.toString()}>
              <DayLabel>{format(day, 'eee')}</DayLabel>
              <DayCircle isToday={isSameDay(day, today)} isCompleted={isCompleted}>
                {format(day, 'd')}
              </DayCircle>
            </Day>
          );
        })}
      </StreakView>

      <CardFooter>
        <DoneLabel>
            <HiddenCheckbox 
            type="checkbox"
            checked={isCompletedToday}
            onChange={() => onToggleComplete(habit.id, todayString)}
            />
            <StyledCheckbox checked={isCompletedToday}>
            <Icon viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
            </Icon>
            </StyledCheckbox>
            Done
        </DoneLabel>
        <ReportsButton as={Link} to={`/report/${habit.id}`}>Reports</ReportsButton>
      </CardFooter>
    </Card>
  );
};

// --- STYLES for the HabitCard ---

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HabitName = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const StreakView = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const DayLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.accent};
`;

// This is the single, correct version of DayCircle
const DayCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme, isToday }) => isToday ? theme.colors.white : 'transparent'};
  font-weight: bold;
  background-color: ${({ theme, isCompleted }) => isCompleted ? theme.colors.border : 'transparent'};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const DoneLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

// This is the SVG checkmark icon
const Icon = styled.svg`
  fill: none;
  stroke: ${({ theme }) => theme.colors.primary}; // The dark-green checkmark
  stroke-width: 3px;
`;

// This is our visible, styled checkbox
const StyledCheckbox = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: ${({ checked }) => (checked ? '#F0E68C' : '#FEFDF8')}; // Khaki yellow when checked, off-white when not
  border: 2px solid ${({ theme }) => theme.colors.accent};
  border-radius: 5px;
  transition: all 150ms;

  ${Icon} {
    visibility: ${({ checked }) => (checked ? 'visible' : 'hidden')};
  }
`;

const ReportsButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accent};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.white};
  }
`;

// Styles for the confirmation dialog
const ConfirmCard = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
`;

const Button = styled.button`
  background: ${({ secondary, theme }) => secondary ? 'transparent' : theme.colors.white};
  color: ${({ secondary, theme }) => secondary ? theme.colors.accent : theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin: 0.5rem;

  &:hover {
    opacity: 0.8;
  }
`;

export default HabitCard;
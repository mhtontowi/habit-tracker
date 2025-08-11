// src/pages/ReportsPage.jsx
import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
// NO useLocalStorage import here. This is critical.
import { eachDayOfInterval, startOfMonth, endOfMonth, format, isSameDay, getDay, startOfDay, endOfDay } from 'date-fns';
import { FaCheck, FaTimes } from 'react-icons/fa';

// This is a small helper component for the circular progress chart
const DonutChart = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <ChartContainer>
      <svg width="150" height="150" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#E6E6E6" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <PercentageText>{Math.round(percentage)}%</PercentageText>
    </ChartContainer>
  );
};

// 1. We receive { habits } as a prop from App.jsx
const ReportsPage = ({ habits }) => {
  console.log("ReportsPage received these habits:", habits);
  const { habitId } = useParams();
  
  // 2. We DO NOT call useLocalStorage. We use the habits prop directly.
  const habit = habits.find(h => h.id === Number(habitId));

  if (!habit) {
    return (
      <PageContainer>
        <Header>
          <BackLink to="/">← Back</BackLink>
        </Header>
        <h1>Habit not found</h1>
      </PageContainer>
    );
  }
  
  const today = new Date();
  const startDate = habit.createdAt 
    ? startOfDay(new Date(habit.createdAt)) 
    : startOfDay(startOfMonth(today));
  const endOfToday = endOfDay(today);
  const daysInMonth = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });
  const firstDayOfMonth = getDay(startOfMonth(today));
  const relevantDaysSoFar = daysInMonth.filter(day => day >= startDate && day <= endOfToday);
  const completedCount = relevantDaysSoFar.filter(day => !!habit.completed[format(day, 'yyyy-MM-dd')]).length;
  const missedCount = relevantDaysSoFar.length - completedCount;
  const percentage = relevantDaysSoFar.length > 0 ? (completedCount / relevantDaysSoFar.length) * 100 : 0;
  
  return (
    <PageContainer>
        <Header>
            <BackLink to="/">←</BackLink>
            <Title>{habit.name}</Title>
        </Header>

        <ProgressSection>
            <ProgressTitle>Total Progress</ProgressTitle>
            <StatsContainer>
            <StatItem>
                <FaCheck color="#4A775E" /> {completedCount}
            </StatItem>
            <DonutChart percentage={percentage} />
            <StatItem>
                <FaTimes color="#D9534F" /> {missedCount}
            </StatItem>
            </StatsContainer>
        </ProgressSection>
        
        <CalendarHeader>{format(today, 'MMMM yyyy')}</CalendarHeader>
        <CalendarGrid>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <DayLabel key={day}>{day}</DayLabel>)}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => <div key={`empty-${index}`} />)}

            {daysInMonth.map(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            const isCompleted = !!habit.completed[dateString];
            return (
                <DayCell key={dateString} isCompleted={isCompleted} isToday={isSameDay(day, today)}>
                {format(day, 'd')}
                </DayCell>
            );
            })}
        </CalendarGrid>
    </PageContainer>
  );
};

// --- STYLES ---
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
`;
const BackLink = styled(Link)`
  position: absolute;
  left: 0;
  font-size: 2rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
`;
const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;
const ProgressSection = styled.div`
  text-align: center;
`;
const ProgressTitle = styled.h2`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.lightText};
  margin-bottom: 1rem;
`;
const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 600px) {
    justify-content: space-between;
    gap: 0.5rem;
  }
`;
const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;
const ChartContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  color: ${({ theme }) => theme.colors.primary};
`;
const PercentageText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bold;
`;
const CalendarHeader = styled.h2`
  text-align: center;
  font-weight: 500;
  margin-top: 2rem;
`;
const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: 600px) {
    gap: 4px; /* A smaller gap */
    padding: 0.5rem; /* Less padding */
    font-size: 0.9rem; /* Smaller base font for the numbers */
  }
`;
const DayLabel = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.accent};

  @media (max-width: 360px) {
    &:nth-child(1) { &::after { content: 'S' } }
    &:nth-child(2) { &::after { content: 'M' } }
    &:nth-child(3) { &::after { content: 'T' } }
    &:nth-child(4) { &::after { content: 'W' } }
    &:nth-child(5) { &::after { content: 'T' } }
    &:nth-child(6) { &::after { content: 'F' } }
    &:nth-child(7) { &::after { content: 'S' } }

    /* Hide the original text content */
    font-size: 0;
  }

`;
const DayCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 0 auto;
  border: 2px solid ${({ isToday, theme }) => isToday ? theme.colors.white : 'transparent'};
  background-color: ${({ isCompleted, theme }) => isCompleted ? theme.colors.accent : 'transparent'};

  @media (max-width: 600px) {
    width: 30px;
    height: 30px;
  }
`;

export default ReportsPage;
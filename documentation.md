## **The Ultimate Developer's Log: Building the Habit Tracker (with Complete Code)**

### **Foreword: The Philosophy of Our App**

Before we write a single line of code, we establish our principles. Our app must be:
1.  **Simple:** The user should never feel overwhelmed. Every action should be obvious.
2.  **Rewarding:** The act of completing a habit should provide a small, satisfying piece of feedback.
3.  **Motivating:** The design should encourage consistency by visualizing progress and streaks.
4.  **Modern:** We will use a modern, efficient toolchain (Vite + React) that is standard in the industry.

---

### **Part 0: Forging the Developer's Workshop (Environment Setup)**

*A developer's computer is like a craftsperson's workshop. Before we can build, we must install and arrange our tools. This is a one-time process on your Mac.*

1.  **Install Homebrew:** Open the `Terminal` app and run this command:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
2.  **Install Node.js:** Use Homebrew to install Node.js and its package manager, npm.
    ```bash
    brew install node
    ```
3.  **Install VS Code:** Download and install [Visual Studio Code](https://code.visualstudio.com/).
4.  **Enable the `code` Command:** Open VS Code, press `Cmd + Shift + P`, type `Shell Command`, and click **`Install 'code' command in PATH`**.

---

### **Part 1: The Blueprint (Project Scaffolding)**

*We will now lay the foundation and erect the initial scaffolding for our application.*

1.  **Create Project Folder:** In `Terminal`, create and enter a dedicated project folder.
    ```bash
    mkdir ~/Desktop/Projects
    cd ~/Desktop/Projects
    ```
2.  **Generate the React App:** Use Vite to create our starter project.
    ```bash
    npm create vite@latest
    ```
    *   **Project name:** `habit-tracker`
    *   **Framework:** `React`
    *   **Variant:** `JavaScript`
3.  **Install Dependencies & Open:** Navigate into the new folder, install packages, open in VS Code, and start the development server.
    ```bash
    cd habit-tracker
    npm install
    code .
    npm run dev
    ```

---

### **Part 2: The Visual Identity (Styling and Theming)**

*We will establish our app's visual language. Stop the dev server (`Ctrl+C`) before installing new packages, then restart it (`npm run dev`).*

1.  **Install Styled-Components:**
    ```bash
    npm install styled-components
    ```
2.  **Delete Unused Files:** In VS Code, delete `src/App.css`, `src/index.css`, and the `src/assets` folder.
3.  **Create `src/theme.js`:**
    ```javascript
    // src/theme.js
    export const theme = {
      colors: {
        background: '#FEFDF8',
        primary: '#4A775E',
        text: '#4A775E',
        lightText: '#6A8A79',
        border: '#6A8A79',
        accent: '#9BB2A3',
        white: '#FFFFFF',
        customCheckbox: '#F0E68C', // Khaki Yellow
      },
      fonts: {
        body: 'sans-serif',
      },
    };
    ```
4.  **Create `src/GlobalStyle.js`:**
    ```javascript
    // src/GlobalStyle.js
    import { createGlobalStyle } from 'styled-components';

    export const GlobalStyle = createGlobalStyle`
      body {
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.text};
        font-family: ${({ theme }) => theme.fonts.body};
        margin: 0;
        padding: 2rem;
        display: flex;
        justify-content: center;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      #root {
        width: 100%;
        max-width: 400px;
      }
    `;
    ```
5.  **Create `src/useLocalStorage.js`:**
    ```javascript
    // src/useLocalStorage.js
    import { useState, useEffect } from 'react';

    function getStorageValue(key, defaultValue) {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(key);
        const initial = saved !== null ? JSON.parse(saved) : defaultValue;
        return initial;
      }
    }

    export const useLocalStorage = (key, defaultValue) => {
      const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
      });

      useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
      }, [key, value]);

      return [value, setValue];
    };
    ```

---

### **Part 3: Building the Components**

*We will construct the reusable visual "bricks" of our app.*

1.  **Install Helper Libraries:**
    ```bash
    npm install date-fns
    npm install react-icons
    ```
2.  **Create `src/components/AddHabitForm.jsx`:**
    ```jsx
    // src/components/AddHabitForm.jsx
    import React, { useState } from 'react';
    import styled from 'styled-components';

    const AddHabitForm = ({ onAdd, onCancel }) => {
      const [name, setName] = useState('');

      const handleSubmit = (event) => {
        event.preventDefault(); 
        if (!name.trim()) return; 
        onAdd(name);
        setName(''); 
      };

      return (
        <FormContainer onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Type in your new habit"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Button type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" primary>Save</Button>
        </FormContainer>
      );
    };

    const FormContainer = styled.form`
      background-color: ${({ theme }) => theme.colors.primary};
      padding: 1rem;
      border-radius: 12px;
      display: flex;
      gap: 0.5rem;
      align-items: center;

      @media (max-width: 600px) {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
    `;

    const Input = styled.input`
      flex-grow: 1;
      border: 1px solid ${({ theme }) => theme.colors.border};
      background-color: ${({ theme }) => theme.colors.white};
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 1rem;
      color: ${({ theme }) => theme.colors.text};

      &::placeholder {
        color: ${({ theme }) => theme.colors.accent};
      }
    `;

    const Button = styled.button`
      background: ${({ primary, theme }) => primary ? theme.colors.white : 'transparent'};
      color: ${({ primary, theme }) => primary ? theme.colors.primary : theme.colors.accent};
      border: 1px solid ${({ theme }) => theme.colors.accent};
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;

      &:hover {
        opacity: 0.8;
      }
    `;

    export default AddHabitForm;
    ```
3.  **Create `src/components/HabitCard.jsx`:**
    ```jsx
    // src/components/HabitCard.jsx
    import React, { useState } from 'react';
    import styled from 'styled-components';
    import { Link } from 'react-router-dom';
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
    const ReportsButton = styled.button`
      background: none;
      border: 1px solid ${({ theme }) => theme.colors.accent};
      color: ${({ theme }) => theme.colors.accent};
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      &:hover {
        background-color: ${({ theme }) => theme.colors.border};
        color: ${({ theme }) => theme.colors.white};
      }
    `;
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
    const Icon = styled.svg`
      fill: none;
      stroke: ${({ theme }) => theme.colors.primary};
      stroke-width: 3px;
    `;
    const StyledCheckbox = styled.div`
      display: inline-block;
      width: 20px;
      height: 20px;
      background: ${({ checked, theme }) => (checked ? theme.colors.customCheckbox : theme.colors.white)};
      border: 2px solid ${({ theme }) => theme.colors.accent};
      border-radius: 5px;
      transition: all 150ms;
      ${Icon} {
        visibility: ${({ checked }) => (checked ? 'visible' : 'hidden')};
      }
    `;

    export default HabitCard;
    ```

---

### **Part 4: Assembling the Pages**

*We will create the distinct "pages" of our app and the logic that drives them.*

1.  **Install React Router:**
    ```bash
    npm install react-router-dom
    ```
2.  **Create `src/pages/Dashboard.jsx`:**
    ```jsx
    // src/pages/Dashboard.jsx
    import React from 'react';
    import styled from 'styled-components';
    import { format } from 'date-fns';
    import HabitCard from '../components/HabitCard';
    import AddHabitForm from '../components/AddHabitForm';

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
    ```
3.  **Create `src/pages/ReportsPage.jsx`:**
    ```jsx
    // src/pages/ReportsPage.jsx
    import React from 'react';
    import styled from 'styled-components';
    import { Link, useParams } from 'react-router-dom';
    import { eachDayOfInterval, startOfMonth, endOfMonth, format, isSameDay, getDay, startOfDay, endOfDay } from 'date-fns';
    import { FaCheck, FaTimes } from 'react-icons/fa';

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

    const ReportsPage = ({ habits }) => {
      const { habitId } = useParams();
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
      const startDate = habit.createdAt ? startOfDay(new Date(habit.createdAt)) : startOfDay(startOfMonth(today));
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
      gap: 1rem;
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
        gap: 4px;
        padding: 0.5rem;
        font-size: 0.9rem;
      }
    `;
    const DayLabel = styled.div`
      font-weight: bold;
      color: ${({ theme }) => theme.colors.accent};
      padding-bottom: 0.5rem;
      font-size: 0.9rem;
      @media (max-width: 600px) {
        font-size: 0.7rem;
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
    ```

---

### **Part 5: The Grand Assembly (Final Wiring)**

*We connect all our pages and components into a cohesive whole.*

1.  **Create `src/App.jsx` - The Brain and Router:** This file will now manage all data and routing logic.
    ```jsx
    // src/App.jsx
    import React, { useState } from 'react';
    import { Routes, Route } from 'react-router-dom';
    import { format } from 'date-fns';
    import { useLocalStorage } from './useLocalStorage';

    import Dashboard from './pages/Dashboard';
    import ReportsPage from './pages/ReportsPage';

    const initialHabits = [];

    function App() {
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
    ```
2.  **Create `src/main.jsx` - The App's Entry Point:** This file loads the theme, global styles, and router, then renders the main `App` component.
    ```jsx
    // src/main.jsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.jsx';
    import { ThemeProvider } from 'styled-components';
    import { BrowserRouter } from 'react-router-dom';
    import { theme } from './theme.js';
    import { GlobalStyle } from './GlobalStyle.js';

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    ```

---

### **Part 6: Deployment and PWA Configuration**

*We prepare our app to be installed on a phone and go live on the internet.*

1.  **Install PWA Plugin:**
    ```bash
    npm install vite-plugin-pwa -D
    ```
2.  **Configure `vite.config.js`:** This file lives in the root of your project.
    ```javascript
    // vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import { VitePWA } from 'vite-plugin-pwa';

    export default defineConfig({
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
          manifest: {
            name: 'Habit Tracker',
            short_name: 'Habits',
            description: 'A simple app to track daily habits.',
            theme_color: '#4A775E',
            background_color: '#FEFDF8',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable',
              },
            ],
          },
        }),
      ],
    });
    ```
3.  **Add Icons:** Create two icons, `pwa-192x192.png` and `pwa-512x512.png`, and place them in the `public` folder in your project's root.
4.  **Update `index.html`:** This file also lives in the root of your project. Add the `theme-color` meta tag.
    ```html
    <!-- index.html -->
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Habit Tracker</title>
        <meta name="theme-color" content="#4A775E" />
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
    </html>
    ```
5.  **Deploy:**
    *   Create a free [GitHub](https://github.com/) account and use the [GitHub Desktop](https://desktop.github.com/) app to publish your project.
    *   Create a free [Netlify](https://netlify.com/) account and create a "new site from Git," selecting your new repository.
    *   Use these build settings:
        *   **Build command:** `npm run build`
        *   **Publish directory:** `dist`
    *   Deploy the site. You can now access your app via its Netlify URL and install it on your phone.
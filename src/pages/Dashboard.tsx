import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, List, Target, Calendar as CalendarIcon, Moon, Sun, Plus, Trash2, User, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar } from "@/components/ui/calendar";
import { getTodos, saveTodos, getHabits, saveHabits, getRandomQuote, Todo, Habit } from "@/lib/utils";

const DARK_KEY = 'sevenk_dark_mode';
const USER_KEY = 'sevenk_user_name';

const Dashboard = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [quote, setQuote] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    setTodos(getTodos());
    setHabits(getHabits());
    setQuote(getRandomQuote());
    setDarkMode(localStorage.getItem(DARK_KEY) === 'true');
    const storedName = localStorage.getItem(USER_KEY) || '';
    setUserName(storedName);
    setNameInput(storedName);
  }, []);

  // Save todos/habits to localStorage on change
  useEffect(() => { saveTodos(todos); }, [todos]);
  useEffect(() => { saveHabits(habits); }, [habits]);
  useEffect(() => { localStorage.setItem(DARK_KEY, darkMode ? 'true' : 'false'); }, [darkMode]);
  useEffect(() => { localStorage.setItem(USER_KEY, userName); }, [userName]);

  // Dark mode class on html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Todo Handlers
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newId = Math.max(0, ...todos.map(t => t.id)) + 1;
      setTodos([{ id: newId, text: newTodo.trim(), completed: false }, ...todos]);
      setNewTodo('');
      toast({ title: "Todo Added", description: "Your new todo has been added." });
    }
  };
  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Habit Handlers
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      const newId = Math.max(0, ...habits.map(h => h.id)) + 1;
      setHabits([{ id: newId, name: newHabit.trim(), completed: false, streak: 0 }, ...habits]);
      setNewHabit('');
      toast({ title: "Habit Added", description: "Your new habit has been added." });
    }
  };
  const handleToggleHabit = (id: number) => {
    setHabits(habits.map(habit =>
      habit.id === id
        ? { ...habit, completed: !habit.completed, streak: !habit.completed ? habit.streak + 1 : habit.streak }
        : habit
    ));
  };
  const handleDeleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  // Stats
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const todoProgress = totalTodos ? Math.round((completedTodos / totalTodos) * 100) : 0;
  const habitProgress = totalHabits ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Quote
  const handleNewQuote = () => setQuote(getRandomQuote());

  // Name editing
  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(nameInput.trim());
    setEditingName(false);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`flex min-h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300`}>
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-transparent">
            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors duration-300">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">7K Life</span>
                  <span className="text-xs text-slate-400 font-semibold ml-2">Productivity Suite</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle dark mode"
                    onClick={() => setDarkMode(d => !d)}
                    className="rounded-full"
                  >
                    {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
                  </Button>
                  {userName ? (
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      <User className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                      <span className="text-slate-800 dark:text-white font-medium text-sm">{userName}</span>
                      <Button variant="ghost" size="icon" className="ml-1" onClick={() => setEditingName(true)}><Edit2 className="h-4 w-4 text-slate-400" /></Button>
                    </div>
                  ) : editingName ? (
                    <form onSubmit={handleNameSave} className="flex items-center gap-2">
                      <Input
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        placeholder="Enter your name"
                        className="h-8 text-sm dark:bg-slate-800 dark:text-white"
                        autoFocus
                      />
                      <Button type="submit" size="sm">Save</Button>
                    </form>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditingName(true)}>
                      <User className="h-4 w-4 mr-1" /> Set your name
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-8">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Todos Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <List className="h-5 w-5 text-blue-600" /> Todos
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-300">{completedTodos}/{totalTodos} done</span>
                  </div>
                  <div className="mb-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${todoProgress}%` }} />
                  </div>
                  <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add a new todo..."
                      value={newTodo}
                      onChange={e => setNewTodo(e.target.value)}
                      className="flex-1 h-10 dark:bg-slate-900 dark:text-white"
                    />
                    <Button type="submit" className="h-10">Add</Button>
                  </form>
                  <div className="flex-1 overflow-y-auto max-h-56 divide-y divide-slate-100 dark:divide-slate-700">
                    {todos.length === 0 && <div className="text-slate-400 dark:text-slate-500 text-sm py-4 text-center">No todos yet.</div>}
                    {todos.map(todo => (
                      <div key={todo.id} className="flex items-center gap-3 py-2 group">
                        <button
                          onClick={() => handleToggleTodo(todo.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}
                          aria-label="Toggle complete"
                        >
                          {todo.completed && <CheckCircle className="h-4 w-4 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}>{todo.text}</span>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-slate-300 dark:text-slate-600 hover:text-red-500"
                          aria-label="Delete todo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Link to="/todos" className="mt-4 text-blue-600 hover:underline text-sm self-end">View all</Link>
                </div>

                {/* Habits Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" /> Habits
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-300">{completedHabits}/{totalHabits} today</span>
                  </div>
                  <div className="mb-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${habitProgress}%` }} />
                  </div>
                  <form onSubmit={handleAddHabit} className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add a new habit..."
                      value={newHabit}
                      onChange={e => setNewHabit(e.target.value)}
                      className="flex-1 h-10 dark:bg-slate-900 dark:text-white"
                    />
                    <Button type="submit" className="h-10">Add</Button>
                  </form>
                  <div className="flex-1 overflow-y-auto max-h-56 divide-y divide-slate-100 dark:divide-slate-700">
                    {habits.length === 0 && <div className="text-slate-400 dark:text-slate-500 text-sm py-4 text-center">No habits yet.</div>}
                    {habits.map(habit => (
                      <div key={habit.id} className="flex items-center gap-3 py-2 group">
                        <button
                          onClick={() => handleToggleHabit(habit.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${habit.completed ? 'bg-green-600 border-green-600' : 'border-slate-300 dark:border-slate-600 hover:border-green-400'}`}
                          aria-label="Toggle complete"
                        >
                          {habit.completed && <CheckCircle className="h-4 w-4 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${habit.completed ? 'text-green-700 dark:text-green-400' : 'text-slate-800 dark:text-white'}`}>{habit.name}</span>
                        <Badge variant="secondary">🔥 {habit.streak}d</Badge>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="text-slate-300 dark:text-slate-600 hover:text-red-500"
                          aria-label="Delete habit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Link to="/habits" className="mt-4 text-green-600 hover:underline text-sm self-end">View all</Link>
                </div>

                {/* Widgets Card */}
                <div className="flex flex-col gap-6">
                  {/* Calendar Preview */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-2 transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-slate-800 dark:text-white text-base">Calendar</span>
                    </div>
                    <Calendar mode="single" selected={new Date()} className="border-0" />
                  </div>
                  {/* Motivational Quote */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-2 transition-colors duration-300">
                    <span className="font-semibold text-slate-800 dark:text-white text-base mb-1">Motivational Quote</span>
                    <span className="text-slate-600 dark:text-slate-300 text-sm italic">"{quote}"</span>
                    <Button variant="outline" size="sm" className="self-end mt-2" onClick={handleNewQuote}>New Quote</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;

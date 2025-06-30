import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowLeft, Trash2, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { getHabits, saveHabits, Habit } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      const newId = Math.max(0, ...habits.map(h => h.id)) + 1;
      setHabits([{ id: newId, name: newHabit.trim(), completed: false, streak: 0 }, ...habits]);
      setNewHabit('');
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-green-600" /> Habit Tracker
          </h1>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-colors duration-300">
          <form onSubmit={handleAddHabit} className="flex gap-2 mb-4">
            <Input
              placeholder="Add a new habit..."
              value={newHabit}
              onChange={e => setNewHabit(e.target.value)}
              className="flex-1 h-10 dark:bg-slate-900 dark:text-white"
            />
            <Button type="submit" className="h-10">Add</Button>
          </form>
          <div className="flex-1 overflow-y-auto max-h-96 divide-y divide-slate-100 dark:divide-slate-700">
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
        </div>
      </div>
    </div>
  );
};

export default Habits;

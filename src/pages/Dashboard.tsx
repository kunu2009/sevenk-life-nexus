
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, List, Target, Calendar, ArrowRight, Clock, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Dashboard = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, text: "Complete project proposal", completed: false },
    { id: 2, text: "Review quarterly reports", completed: true },
    { id: 3, text: "Schedule team meeting", completed: false },
  ]);
  const [habits, setHabits] = useState([
    { id: 1, name: "Morning Exercise", completed: false, streak: 5 },
    { id: 2, name: "Read 30 minutes", completed: true, streak: 12 },
    { id: 3, name: "Drink 8 glasses of water", completed: false, streak: 3 },
    { id: 4, name: "Meditate 10 minutes", completed: false, streak: 8 },
  ]);
  
  const { toast } = useToast();

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newId = Math.max(...todos.map(t => t.id), 0) + 1;
      setTodos([...todos, { id: newId, text: newTodo.trim(), completed: false }]);
      setNewTodo('');
      toast({
        title: "Todo Added",
        description: "Your new todo has been added successfully!",
      });
    }
  };

  const toggleHabit = (habitId: number) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak : habit.streak + 1 }
        : habit
    ));
    const habit = habits.find(h => h.id === habitId);
    toast({
      title: habit?.completed ? "Habit Unmarked" : "Habit Completed",
      description: habit?.completed ? "Keep up the consistency!" : "Great job maintaining your streak!",
    });
  };

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-950">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-slate-950 text-white">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-6 pt-8 pb-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="text-slate-400 hover:text-white transition-colors">
                      <Menu className="h-5 w-5" />
                    </SidebarTrigger>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        Good morning, Alex
                      </h1>
                      <p className="text-slate-400">Let's make today productive</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <div className="text-2xl font-bold text-white">{completedTodos}</div>
                    <div className="text-slate-400 text-sm">Tasks Done</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <div className="text-2xl font-bold text-green-400">{completedHabits}</div>
                    <div className="text-slate-400 text-sm">Habits Today</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <div className="text-2xl font-bold text-blue-400">85%</div>
                    <div className="text-slate-400 text-sm">Completion</div>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                    <div className="text-2xl font-bold text-purple-400">12</div>
                    <div className="text-slate-400 text-sm">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8">
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link to="/todos" className="group">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <List className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Todo Lists</h3>
                          <p className="text-slate-400 text-sm">{totalTodos} tasks</p>
                        </div>
                      </div>
                      <div className="flex items-center text-blue-400 text-sm group-hover:text-blue-300">
                        <span>Manage tasks</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>

                  <Link to="/habits" className="group">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <Target className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Habits</h3>
                          <p className="text-slate-400 text-sm">{totalHabits} habits</p>
                        </div>
                      </div>
                      <div className="flex items-center text-green-400 text-sm group-hover:text-green-300">
                        <span>Track goals</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>

                  <Link to="/calendar" className="group">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Calendar</h3>
                          <p className="text-slate-400 text-sm">Schedule events</p>
                        </div>
                      </div>
                      <div className="flex items-center text-purple-400 text-sm group-hover:text-purple-300">
                        <span>View schedule</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Add Todo */}
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Plus className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Quick Add</h3>
                        <p className="text-slate-400 text-sm">Add a new task</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleAddTodo} className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          placeholder="What needs to be done?"
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                          className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 rounded-xl focus:border-blue-500"
                        />
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">
                          Add
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 font-medium">Recent Tasks</span>
                        <Link to="/todos" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                          View all <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                      {todos.slice(0, 3).map((todo) => (
                        <div key={todo.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            todo.completed ? 'bg-green-500 border-green-500' : 'border-slate-500'
                          }`}>
                            {todo.completed && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <span className={`text-sm flex-1 ${
                            todo.completed ? 'line-through text-slate-500' : 'text-slate-300'
                          }`}>
                            {todo.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Today's Habits */}
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Target className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Today's Habits</h3>
                        <p className="text-slate-400 text-sm">Build consistency</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {habits.map((habit) => (
                        <div
                          key={habit.id}
                          className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant={habit.completed ? "default" : "outline"}
                              onClick={() => toggleHabit(habit.id)}
                              className={`w-8 h-8 rounded-full p-0 ${
                                habit.completed 
                                  ? "bg-green-600 hover:bg-green-700 text-white" 
                                  : "bg-transparent border-slate-500 text-slate-400 hover:border-green-500 hover:text-green-400"
                              }`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <div>
                              <span className={`text-sm font-medium ${
                                habit.completed ? 'text-green-400' : 'text-slate-300'
                              }`}>
                                {habit.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs bg-slate-600/50 text-slate-300 border-0">
                                  {habit.streak} days
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Link to="/habits" className="block mt-4">
                      <Button variant="outline" className="w-full rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                        View All Habits <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
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

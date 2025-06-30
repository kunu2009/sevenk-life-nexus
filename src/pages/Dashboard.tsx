
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, List, Target, Calendar, ArrowRight, Clock, Sparkles, Zap, Heart } from "lucide-react";
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
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-transparent">
            {/* Decorative Doodles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-20 w-4 h-4 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-32 right-40 w-6 h-6 bg-pink-300 rounded-full opacity-40"></div>
              <div className="absolute bottom-40 left-10 w-3 h-3 bg-blue-300 rounded-full opacity-50"></div>
              <div className="absolute top-1/2 right-20 w-5 h-5 bg-green-300 rounded-full opacity-30"></div>
              
              {/* Squiggly lines */}
              <svg className="absolute top-20 right-60 w-20 h-20 text-purple-200 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              
              <svg className="absolute bottom-20 left-40 w-16 h-16 text-orange-200 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>

            {/* Header Section */}
            <div className="relative px-8 pt-8 pb-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Good morning, Alex! ✨
                      </h1>
                      <p className="text-slate-600 text-lg">Let's make today absolutely amazing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      A
                    </div>
                  </div>
                </div>

                {/* Fun Stats with Doodle Style */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-yellow-400"><Sparkles className="h-4 w-4" /></div>
                    <div className="text-3xl font-bold text-slate-800 mb-1">{completedTodos}</div>
                    <div className="text-slate-500 text-sm font-medium">Tasks Crushed</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-green-400"><Zap className="h-4 w-4" /></div>
                    <div className="text-3xl font-bold text-green-600 mb-1">{completedHabits}</div>
                    <div className="text-slate-500 text-sm font-medium">Habits Nailed</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-blue-400"><Heart className="h-4 w-4" /></div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">85%</div>
                    <div className="text-slate-500 text-sm font-medium">Awesome Rate</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-purple-400"><Clock className="h-4 w-4" /></div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">12</div>
                    <div className="text-slate-500 text-sm font-medium">Day Streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-8 pb-8">
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Navigation Cards with Playful Style */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link to="/todos" className="group">
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:rotate-1 relative overflow-hidden">
                      <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <List className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Todo Magic ✨</h3>
                        <p className="text-slate-600">{totalTodos} tasks waiting for you</p>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                        <span>Let's get stuff done!</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>

                  <Link to="/habits" className="group">
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 relative overflow-hidden">
                      <div className="absolute top-4 right-4 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Target className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Habit Garden 🌱</h3>
                        <p className="text-slate-600">{totalHabits} habits growing strong</p>
                      </div>
                      <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                        <span>Build your future!</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>

                  <Link to="/calendar" className="group">
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:rotate-1 relative overflow-hidden">
                      <div className="absolute top-4 right-4 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Time Planner 📅</h3>
                        <p className="text-slate-600">Your schedule awaits</p>
                      </div>
                      <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                        <span>Plan your day!</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Quick Actions with Notion Style */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Quick Add Todo */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Quick Add ⚡</h3>
                        <p className="text-slate-600">Capture that brilliant idea</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleAddTodo} className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          placeholder="What's on your mind? 🤔"
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                          className="flex-1 bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-2xl h-12 focus:border-blue-400 focus:ring-blue-400/20"
                        />
                        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl px-8 h-12 shadow-lg">
                          Add
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-semibold">Recent Wins 🎉</span>
                        <Link to="/todos" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                          See all <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                      {todos.slice(0, 3).map((todo) => (
                        <div key={todo.id} className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            todo.completed 
                              ? 'bg-green-500 border-green-500 shadow-lg' 
                              : 'border-slate-300 hover:border-green-400'
                          }`}>
                            {todo.completed && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                          <span className={`text-sm flex-1 font-medium ${
                            todo.completed ? 'line-through text-slate-500' : 'text-slate-700'
                          }`}>
                            {todo.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Today's Habits */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Daily Rituals 🌟</h3>
                        <p className="text-slate-600">Small steps, big impact</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {habits.map((habit) => (
                        <div
                          key={habit.id}
                          className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-slate-100 hover:bg-slate-100/80 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <Button
                              size="sm"
                              variant={habit.completed ? "default" : "outline"}
                              onClick={() => toggleHabit(habit.id)}
                              className={`w-10 h-10 rounded-full p-0 transition-all ${
                                habit.completed 
                                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg" 
                                  : "bg-white border-slate-200 text-slate-400 hover:border-green-400 hover:text-green-500"
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                            <div>
                              <span className={`font-medium ${
                                habit.completed ? 'text-green-600' : 'text-slate-700'
                              }`}>
                                {habit.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs bg-slate-200 text-slate-600 border-0 rounded-full">
                                  🔥 {habit.streak} days
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Link to="/habits" className="block mt-6">
                      <Button variant="outline" className="w-full rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-12">
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

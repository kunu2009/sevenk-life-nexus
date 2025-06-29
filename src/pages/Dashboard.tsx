
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle, List, Target, Calendar, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Your productivity command center</p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/todos" className="group">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/70 backdrop-blur-sm border-0 shadow-md hover:bg-white/90">
              <CardContent className="p-6 text-center">
                <List className="h-8 w-8 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-800">Todo Lists</h3>
                <p className="text-sm text-gray-600">Manage tasks</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/habits" className="group">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/70 backdrop-blur-sm border-0 shadow-md hover:bg-white/90">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-800">Habits</h3>
                <p className="text-sm text-gray-600">Track goals</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/calendar" className="group">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/70 backdrop-blur-sm border-0 shadow-md hover:bg-white/90">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-800">Calendar</h3>
                <p className="text-sm text-gray-600">Schedule events</p>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">Today's Progress</h3>
              <p className="text-sm opacity-90">{completedTodos + completedHabits} completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Add Todo */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Plus className="h-5 w-5" />
                Quick Add Todo
              </CardTitle>
              <CardDescription>Add a new task to your todo list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddTodo} className="flex gap-2">
                <Input
                  placeholder="Enter a new todo..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="flex-1 border-blue-200 focus:border-blue-400"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Recent Todos</span>
                  <Link to="/todos" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                {todos.slice(0, 3).map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className={`h-4 w-4 ${todo.completed ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {todo.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Habit Tracker */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Target className="h-5 w-5" />
                Today's Habits
              </CardTitle>
              <CardDescription>Mark your daily habits as complete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant={habit.completed ? "default" : "outline"}
                        onClick={() => toggleHabit(habit.id)}
                        className={habit.completed ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <div>
                        <span className={`text-sm font-medium ${habit.completed ? 'text-green-800' : 'text-gray-800'}`}>
                          {habit.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {habit.streak} day streak
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/habits" className="block">
                <Button variant="outline" className="w-full mt-4">
                  View All Habits <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{completedTodos}/{totalTodos}</div>
              <div className="text-blue-100">Todos Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{completedHabits}/{totalHabits}</div>
              <div className="text-green-100">Habits Today</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold">{Math.round(((completedTodos + completedHabits) / (totalTodos + totalHabits)) * 100)}%</div>
              <div className="text-purple-100">Completion Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

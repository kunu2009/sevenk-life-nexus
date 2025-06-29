import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, CheckSquare, BookOpen, FileText, GraduationCap, 
  Settings, Bot, Menu, X, Plus, Edit3, Trash2, Star, 
  Target, TrendingUp, Clock, Award, Download, Upload,
  Mic, Send, Search, Filter, BarChart3, PieChart,
  Sun, Moon, Bell, Save, Play, Pause, RotateCcw,
  Heart, Zap, Coffee, Book, Dumbbell, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  // State Management
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Data States
  const [todos, setTodos] = useState([]);
  const [habits, setHabits] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [notepadContent, setNotepadContent] = useState('');
  const [aiMessages, setAiMessages] = useState([]);
  const [studyProgress, setStudyProgress] = useState({});
  const [quizHistory, setQuizHistory] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25 minutes default

  // Form States
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'medium', tags: '' });
  const [habitForm, setHabitForm] = useState({ title: '', frequency: 'daily', reminderTime: '', streak: 0 });
  const [journalForm, setJournalForm] = useState({ title: '', content: '', mood: 'neutral', tags: '' });
  const [aiInput, setAiInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Settings State
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true,
    apiKey: '',
    fontSize: 'medium',
    timezone: 'UTC'
  });

  // Sample Study Questions
  const studyQuestions = {
    clat: {
      english: [
        {
          id: 1,
          question: "Which of the following is the correct passive voice of 'The teacher teaches the students'?",
          options: [
            "The students are taught by the teacher",
            "The students were taught by the teacher", 
            "The students have been taught by the teacher",
            "The students will be taught by the teacher"
          ],
          correctAnswer: 0,
          explanation: "Present tense passive voice uses 'are/is + past participle'",
          difficulty: "medium"
        },
        {
          id: 2,
          question: "What is the synonym of 'Ubiquitous'?",
          options: ["Rare", "Omnipresent", "Hidden", "Specific"],
          correctAnswer: 1,
          explanation: "Ubiquitous means present everywhere at the same time",
          difficulty: "hard"
        }
      ],
      reasoning: [
        {
          id: 3,
          question: "If all roses are flowers and some flowers are red, which conclusion is valid?",
          options: [
            "All roses are red",
            "Some roses may be red",
            "No roses are red", 
            "All red things are roses"
          ],
          correctAnswer: 1,
          explanation: "We can only conclude that some roses may be red, not that all are",
          difficulty: "medium"
        }
      ]
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTodos = localStorage.getItem('7k_todos');
        const savedHabits = localStorage.getItem('7k_habits');
        const savedJournal = localStorage.getItem('7k_journal');
        const savedNotepad = localStorage.getItem('7k_notepad');
        const savedSettings = localStorage.getItem('7k_settings');
        const savedQuizHistory = localStorage.getItem('7k_quiz_history');

        if (savedTodos) setTodos(JSON.parse(savedTodos));
        if (savedHabits) setHabits(JSON.parse(savedHabits));
        if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
        if (savedNotepad) setNotepadContent(savedNotepad);
        if (savedSettings) setSettings(JSON.parse(savedSettings));
        if (savedQuizHistory) setQuizHistory(JSON.parse(savedQuizHistory));
      } catch (error) {
        console.error('Error loading data:', error);
        toast({ title: "Error", description: "Failed to load saved data", variant: "destructive" });
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('7k_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('7k_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('7k_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('7k_notepad', notepadContent);
  }, [notepadContent]);

  useEffect(() => {
    localStorage.setItem('7k_settings', JSON.stringify(settings));
  }, [settings]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      toast({ title: "Timer Complete!", description: "Great work! Time for a break." });
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Auto-save notepad
  useEffect(() => {
    if (settings.autoSave) {
      const timer = setTimeout(() => {
        localStorage.setItem('7k_notepad', notepadContent);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notepadContent, settings.autoSave]);

  // Utility Functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateId = () => Date.now() + Math.random();

  const exportData = () => {
    const data = {
      todos,
      habits,
      journalEntries,
      notepadContent,
      settings,
      quizHistory,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `7k-life-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Data Exported", description: "Your data has been downloaded successfully" });
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const data = JSON.parse(result);
            setTodos(data.todos || []);
            setHabits(data.habits || []);
            setJournalEntries(data.journalEntries || []);
            setNotepadContent(data.notepadContent || '');
            setSettings(data.settings || settings);
            setQuizHistory(data.quizHistory || []);
            toast({ title: "Data Imported", description: "Your data has been restored successfully" });
          }
        } catch (error) {
          toast({ title: "Import Error", description: "Invalid file format", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    }
  };

  // Todo Functions
  const addTodo = () => {
    if (!taskForm.title.trim()) {
      toast({ title: "Error", description: "Task title is required", variant: "destructive" });
      return;
    }
    
    const newTodo = {
      id: generateId(),
      ...taskForm,
      completed: false,
      createdAt: new Date().toISOString(),
      tags: taskForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    
    setTodos([...todos, newTodo]);
    setTaskForm({ title: '', description: '', dueDate: '', priority: 'medium', tags: '' });
    toast({ title: "Task Added", description: "New task created successfully" });
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({ title: "Task Deleted", description: "Task removed successfully" });
  };

  // Habit Functions
  const addHabit = () => {
    if (!habitForm.title.trim()) {
      toast({ title: "Error", description: "Habit title is required", variant: "destructive" });
      return;
    }
    
    const newHabit = {
      id: generateId(),
      ...habitForm,
      createdAt: new Date().toISOString(),
      lastCompleted: null,
      streak: 0,
      history: []
    };
    
    setHabits([...habits, newHabit]);
    setHabitForm({ title: '', frequency: 'daily', reminderTime: '', streak: 0 });
    toast({ title: "Habit Added", description: "New habit created successfully" });
  };

  const completeHabit = (id) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
        const isToday = lastCompleted === today;
        
        if (!isToday) {
          return {
            ...habit,
            lastCompleted: new Date().toISOString(),
            streak: habit.streak + 1,
            history: [...(habit.history || []), { date: today, completed: true }]
          };
        }
      }
      return habit;
    }));
    toast({ title: "Habit Completed", description: "Great job keeping up your habit!" });
  };

  // Journal Functions
  const addJournalEntry = () => {
    if (!journalForm.title.trim() || !journalForm.content.trim()) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }
    
    const newEntry = {
      id: generateId(),
      ...journalForm,
      createdAt: new Date().toISOString(),
      tags: journalForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      wordCount: journalForm.content.split(' ').length
    };
    
    setJournalEntries([newEntry, ...journalEntries]);
    setJournalForm({ title: '', content: '', mood: 'neutral', tags: '' });
    toast({ title: "Journal Entry Added", description: "Your thoughts have been saved" });
  };

  // AI Functions
  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    
    const userMessage = { sender: 'user', text: aiInput, timestamp: new Date().toISOString() };
    setAiMessages([...aiMessages, userMessage]);
    setAiInput('');
    setIsLoading(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that! Can you provide more details?",
        "That's an interesting question. Based on your study progress, I recommend focusing on your weaker areas.",
        "Great question! For CLAT preparation, consistency is key. Try to solve at least 10 questions daily.",
        "I can help you create a study schedule. What subjects do you want to focus on this week?",
        "Remember to take breaks! The Pomodoro technique works great - 25 minutes study, 5 minutes break.",
      ];
      
      const aiResponse = {
        sender: 'ai',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString()
      };
      
      setAiMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  // Quiz Functions
  const startQuiz = (subject, difficulty = 'all') => {
    const questions = studyQuestions.clat[subject] || [];
    const filteredQuestions = difficulty === 'all' ? questions : questions.filter(q => q.difficulty === difficulty);
    
    if (filteredQuestions.length === 0) {
      toast({ title: "No Questions", description: "No questions available for this selection", variant: "destructive" });
      return;
    }
    
    setCurrentQuiz({
      questions: filteredQuestions,
      currentIndex: 0,
      userAnswers: [],
      startTime: new Date(),
      subject,
      difficulty
    });
    setCurrentSection('quiz-active');
  };

  const answerQuizQuestion = (answerIndex) => {
    if (!currentQuiz) return;
    
    const updatedQuiz = {
      ...currentQuiz,
      userAnswers: [...currentQuiz.userAnswers, answerIndex]
    };
    
    if (updatedQuiz.currentIndex < updatedQuiz.questions.length - 1) {
      updatedQuiz.currentIndex++;
      setCurrentQuiz(updatedQuiz);
    } else {
      // Quiz completed
      const score = updatedQuiz.userAnswers.reduce((acc, answer, index) => {
        return acc + (answer === updatedQuiz.questions[index].correctAnswer ? 1 : 0);
      }, 0);
      
      const quizResult = {
        id: generateId(),
        subject: updatedQuiz.subject,
        difficulty: updatedQuiz.difficulty,
        score,
        totalQuestions: updatedQuiz.questions.length,
        percentage: Math.round((score / updatedQuiz.questions.length) * 100),
        completedAt: new Date().toISOString(),
        timeSpent: Math.round((new Date().getTime() - updatedQuiz.startTime.getTime()) / 1000 / 60) // minutes
      };
      
      setQuizHistory([quizResult, ...quizHistory]);
      setCurrentQuiz({ ...updatedQuiz, completed: true, result: quizResult });
      toast({ 
        title: "Quiz Completed!", 
        description: `You scored ${score}/${updatedQuiz.questions.length} (${quizResult.percentage}%)` 
      });
    }
  };

  // Dashboard Statistics
  const getStats = () => {
    const pendingTasks = todos.filter(todo => !todo.completed).length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const activeHabits = habits.length;
    const todayHabits = habits.filter(habit => {
      const today = new Date().toDateString();
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
      return lastCompleted === today;
    }).length;
    const journalCount = journalEntries.length;
    const averageQuizScore = quizHistory.length > 0 ? 
      Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizHistory.length) : 0;

    return {
      pendingTasks,
      completedTasks,
      activeHabits,
      todayHabits,
      journalCount,
      averageQuizScore
    };
  };

  const stats = getStats();

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'todos', label: 'To-Do List', icon: CheckSquare },
    { id: 'habits', label: 'Habit Tracker', icon: Target },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'notepad', label: 'Notepad', icon: FileText },
    { id: 'study', label: 'Study Hub', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Filter functions
  const getFilteredTodos = () => {
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredJournalEntries = () => {
    return journalEntries.filter(entry =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/60 z-50 shadow-sm">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden hover:bg-slate-100/50 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setCurrentSection('dashboard')}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">7K</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  7K Life
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="hover:bg-slate-100/50 transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAiChatOpen(true)}
                className="hover:bg-slate-100/50 transition-colors"
              >
                <Bot className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <aside className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-md border-r border-slate-200/60 transition-transform duration-300 z-40 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
          <nav className="p-6">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Button
                      variant={currentSection === item.id ? "default" : "ghost"}
                      className={`w-full justify-start transition-all duration-200 ${
                        currentSection === item.id 
                          ? "bg-slate-900 text-white shadow-lg hover:bg-slate-800" 
                          : "hover:bg-slate-100/70 text-slate-700"
                      }`}
                      onClick={() => {
                        setCurrentSection(item.id);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:ml-64 pt-16 min-h-screen">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Dashboard Section */}
            {currentSection === 'dashboard' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h2>
                    <p className="text-slate-600">Welcome back! Here's your progress overview.</p>
                  </div>
                  <div className="text-sm text-slate-500 bg-white/50 px-4 py-2 rounded-lg border border-slate-200/50">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-slate-600">Pending Tasks</CardTitle>
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-600 mb-1">{stats.pendingTasks}</div>
                      <p className="text-xs text-slate-500">
                        {stats.completedTasks} completed today
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-slate-600">Today's Habits</CardTitle>
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {stats.todayHabits}/{stats.activeHabits}
                      </div>
                      <p className="text-xs text-slate-500">
                        {Math.round((stats.todayHabits / (stats.activeHabits || 1)) * 100)}% completion rate
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-slate-600">Journal Entries</CardTitle>
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-1">{stats.journalCount}</div>
                      <p className="text-xs text-slate-500">
                        Total entries written
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-slate-600">Quiz Average</CardTitle>
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600 mb-1">{stats.averageQuizScore}%</div>
                      <p className="text-xs text-slate-500">
                        {quizHistory.length} quizzes taken
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pomodoro Timer */}
                <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-slate-800">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-slate-600" />
                      </div>
                      Pomodoro Timer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-6">
                      <div className="text-5xl font-mono font-bold text-slate-800">
                        {formatTime(timerSeconds)}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setTimerRunning(!timerRunning)}
                          className={`shadow-lg ${timerRunning ? "bg-red-500 hover:bg-red-600" : "bg-slate-900 hover:bg-slate-800"}`}
                        >
                          {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={() => {
                            setTimerRunning(false);
                            setTimerSeconds(1500);
                          }}
                          variant="outline"
                          className="shadow-lg border-slate-200 hover:bg-slate-50"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3 justify-center">
                      <Button size="sm" onClick={() => setTimerSeconds(1500)} variant="outline" className="shadow-sm">
                        25m
                      </Button>
                      <Button size="sm" onClick={() => setTimerSeconds(300)} variant="outline" className="shadow-sm">
                        5m
                      </Button>
                      <Button size="sm" onClick={() => setTimerSeconds(900)} variant="outline" className="shadow-sm">
                        15m
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-slate-800">Recent Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {todos.slice(0, 5).map((todo) => (
                          <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50/50 transition-colors">
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={() => toggleTodo(todo.id)}
                              className="rounded w-4 h-4"
                            />
                            <span className={`flex-1 ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                              {todo.title}
                            </span>
                            <Badge variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                              {todo.priority}
                            </Badge>
                          </div>
                        ))}
                        {todos.length === 0 && (
                          <p className="text-slate-400 text-center py-8">No tasks yet. Create your first task!</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-slate-800">Habit Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {habits.slice(0, 5).map((habit) => (
                          <div key={habit.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-700">{habit.title}</span>
                              <Badge variant="outline" className="text-xs border-slate-200">{habit.streak} days</Badge>
                            </div>
                            <Progress value={Math.min(habit.streak * 10, 100)} className="h-2 bg-slate-100" />
                          </div>
                        ))}
                        {habits.length === 0 && (
                          <p className="text-slate-400 text-center py-8">No habits tracked yet. Start building good habits!</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* To-Do Section */}
            {currentSection === 'todos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">To-Do List</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Task title"
                          value={taskForm.title}
                          onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                        />
                        <Textarea
                          placeholder="Task description"
                          value={taskForm.description}
                          onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                        />
                        <Input
                          type="date"
                          value={taskForm.dueDate}
                          onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                        />
                        <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({...taskForm, priority: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Tags (comma separated)"
                          value={taskForm.tags}
                          onChange={(e) => setTaskForm({...taskForm, tags: e.target.value})}
                        />
                        <Button onClick={addTodo} className="w-full">Add Task</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex gap-4">
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <div className="space-y-4">
                  {getFilteredTodos().map((todo) => (
                    <Card key={todo.id} className={`${todo.completed ? 'opacity-60' : ''} hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className="mt-1 rounded"
                          />
                          <div className="flex-1">
                            <h3 className={`font-semibold ${todo.completed ? 'line-through' : ''}`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className="text-muted-foreground mt-1">{todo.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}>
                                {todo.priority}
                              </Badge>
                              {todo.dueDate && (
                                <Badge variant="outline">
                                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                                </Badge>
                              )}
                              {todo.tags?.map((tag) => (
                                <Badge key={tag} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTodo(todo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {getFilteredTodos().length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No tasks found. Add your first task to get started!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Habits Section */}
            {currentSection === 'habits' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Habit Tracker</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Habit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Habit</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Habit title"
                          value={habitForm.title}
                          onChange={(e) => setHabitForm({...habitForm, title: e.target.value})}
                        />
                        <Select value={habitForm.frequency} onValueChange={(value) => setHabitForm({...habitForm, frequency: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="time"
                          value={habitForm.reminderTime}
                          onChange={(e) => setHabitForm({...habitForm, reminderTime: e.target.value})}
                        />
                        <Button onClick={addHabit} className="w-full">Add Habit</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {habits.map((habit) => (
                    <Card key={habit.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            {habit.title}
                          </CardTitle>
                          <Badge variant="outline">
                            {habit.streak} day streak
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Frequency: {habit.frequency}</span>
                            {habit.reminderTime && (
                              <span className="text-sm text-muted-foreground">
                                Reminder: {habit.reminderTime}
                              </span>
                            )}
                          </div>
                          <Button
                            onClick={() => completeHabit(habit.id)}
                            disabled={habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString()}
                            className="w-full"
                          >
                            {habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === new Date().toDateString() 
                              ? 'Completed Today!' 
                              : 'Mark Complete'
                            }
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {habits.length === 0 && (
                    <Card className="lg:col-span-2">
                      <CardContent className="p-8 text-center">
                        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No habits tracked yet. Start building positive habits today!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Journal Section */}
            {currentSection === 'journal' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Journal</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>New Journal Entry</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Entry title"
                          value={journalForm.title}
                          onChange={(e) => setJournalForm({...journalForm, title: e.target.value})}
                        />
                        <Textarea
                          placeholder="Write your thoughts..."
                          value={journalForm.content}
                          onChange={(e) => setJournalForm({...journalForm, content: e.target.value})}
                          rows={8}
                        />
                        <div className="flex gap-4">
                          <Select value={journalForm.mood} onValueChange={(value) => setJournalForm({...journalForm, mood: value})}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Mood" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="happy">😊 Happy</SelectItem>
                              <SelectItem value="sad">😢 Sad</SelectItem>
                              <SelectItem value="excited">🤩 Excited</SelectItem>
                              <SelectItem value="neutral">😐 Neutral</SelectItem>
                              <SelectItem value="anxious">😰 Anxious</SelectItem>
                              <SelectItem value="grateful">🙏 Grateful</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Tags (comma separated)"
                            value={journalForm.tags}
                            onChange={(e) => setJournalForm({...journalForm, tags: e.target.value})}
                            className="flex-1"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Word count: {journalForm.content.split(' ').filter(Boolean).length}
                        </div>
                        <Button onClick={addJournalEntry} className="w-full">Save Entry</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Input
                  placeholder="Search journal entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />

                <div className="space-y-4">
                  {getFilteredJournalEntries().map((entry) => (
                    <Card key={entry.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{entry.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {entry.mood === 'happy' && '😊'}
                              {entry.mood === 'sad' && '😢'}
                              {entry.mood === 'excited' && '🤩'}
                              {entry.mood === 'neutral' && '😐'}
                              {entry.mood === 'anxious' && '😰'}
                              {entry.mood === 'grateful' && '🙏'}
                              {entry.mood}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {entry.content.substring(0, 200)}
                          {entry.content.length > 200 && '...'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{entry.wordCount} words</Badge>
                          {entry.tags?.map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {getFilteredJournalEntries().length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No journal entries found. Start writing your first entry!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Notepad Section */}
            {currentSection === 'notepad' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Notepad</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                      />
                      <Label>Auto-save</Label>
                    </div>
                    <Button onClick={() => setNotepadContent('')} variant="outline">
                      Clear All
                    </Button>
                    <Button onClick={() => {
                      const blob = new Blob([notepadContent], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `notepad-${new Date().toISOString().split('T')[0]}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <Textarea
                      placeholder="Start writing your notes..."
                      value={notepadContent}
                      onChange={(e) => setNotepadContent(e.target.value)}
                      className="min-h-[400px] resize-none border-none focus:ring-0 text-base"
                    />
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Word count: {notepadContent.split(' ').filter(Boolean).length} | 
                        Characters: {notepadContent.length}
                      </div>
                      {settings.autoSave && (
                        <div className="text-sm text-green-600">Auto-save enabled</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Study Hub Section */}
            {currentSection === 'study' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Study Hub</h2>
                
                <Tabs defaultValue="clat" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="clat">CLAT Material</TabsTrigger>
                    <TabsTrigger value="mhcet">MHCET Material</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="clat" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>English Comprehension</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">
                            Master reading comprehension, vocabulary, and grammar fundamentals.
                          </p>
                          <div className="flex gap-2">
                            <Button onClick={() => startQuiz('english', 'easy')} size="sm">
                              Easy Quiz
                            </Button>
                            <Button onClick={() => startQuiz('english', 'medium')} size="sm" variant="outline">
                              Medium Quiz
                            </Button>
                            <Button onClick={() => startQuiz('english', 'hard')} size="sm" variant="outline">
                              Hard Quiz
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Logical Reasoning</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">
                            Develop critical thinking and logical analysis skills.
                          </p>
                          <div className="flex gap-2">
                            <Button onClick={() => startQuiz('reasoning', 'easy')} size="sm">
                              Easy Quiz
                            </Button>
                            <Button onClick={() => startQuiz('reasoning', 'medium')} size="sm" variant="outline">
                              Medium Quiz
                            </Button>
                            <Button onClick={() => startQuiz('reasoning', 'hard')} size="sm" variant="outline">
                              Hard Quiz
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>General Knowledge</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">
                            Stay updated with current affairs and general knowledge.
                          </p>
                          <Button size="sm" disabled>Coming Soon</Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Legal Aptitude</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground">
                            Understand legal principles and constitutional knowledge.
                          </p>
                          <Button size="sm" disabled>Coming Soon</Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quiz History */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Quiz Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {quizHistory.length > 0 ? (
                          <div className="space-y-2">
                            {quizHistory.slice(0, 10).map((quiz) => (
                              <div key={quiz.id} className="flex items-center justify-between p-3 rounded border">
                                <div>
                                  <span className="font-medium capitalize">{quiz.subject}</span>
                                  <span className="text-muted-foreground ml-2">
                                    ({quiz.difficulty})
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge variant={quiz.percentage >= 70 ? 'default' : quiz.percentage >= 50 ? 'secondary' : 'destructive'}>
                                    {quiz.score}/{quiz.totalQuestions} ({quiz.percentage}%)
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {quiz.timeSpent}min
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(quiz.completedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            No quiz history yet. Take your first quiz to see your progress!
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="mhcet">
                    <Card>
                      <CardContent className="p-8 text-center">
                        <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">MHCET materials coming soon!</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Active Quiz Section */}
            {currentSection === 'quiz-active' && currentQuiz && !currentQuiz.completed && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {currentQuiz.subject.charAt(0).toUpperCase() + currentQuiz.subject.slice(1)} Quiz
                  </h2>
                  <Button variant="outline" onClick={() => setCurrentSection('study')}>
                    Exit Quiz
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Question {currentQuiz.currentIndex + 1} of {currentQuiz.questions.length}
                      </span>
                      <Badge variant="outline" className="capitalize">
                        {currentQuiz.difficulty}
                      </Badge>
                    </div>
                    <Progress 
                      value={((currentQuiz.currentIndex + 1) / currentQuiz.questions.length) * 100} 
                      className="w-full"
                    />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-lg">
                      {currentQuiz.questions[currentQuiz.currentIndex].question}
                    </div>
                    
                    <div className="space-y-3">
                      {currentQuiz.questions[currentQuiz.currentIndex].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start p-4 h-auto"
                          onClick={() => answerQuizQuestion(index)}
                        >
                          <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quiz Results Section */}
            {currentSection === 'quiz-active' && currentQuiz && currentQuiz.completed && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Quiz Results</h2>
                  <Button onClick={() => setCurrentSection('study')}>
                    Back to Study Hub
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">
                      Your Score: {currentQuiz.result.score}/{currentQuiz.result.totalQuestions}
                    </CardTitle>
                    <div className="text-center">
                      <Badge 
                        variant={currentQuiz.result.percentage >= 70 ? 'default' : currentQuiz.result.percentage >= 50 ? 'secondary' : 'destructive'}
                        className="text-lg p-2"
                      >
                        {currentQuiz.result.percentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <p className="text-muted-foreground">
                        Time spent: {currentQuiz.result.timeSpent} minutes
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Review Questions:</h3>
                      {currentQuiz.questions.map((question, index) => {
                        const userAnswer = currentQuiz.userAnswers[index];
                        const isCorrect = userAnswer === question.correctAnswer;
                        
                        return (
                          <Card key={index} className={isCorrect ? 'border-green-200' : 'border-red-200'}>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <Badge variant={isCorrect ? 'default' : 'destructive'}>
                                    Q{index + 1}
                                  </Badge>
                                  <div className="flex-1">
                                    <p className="font-medium">{question.question}</p>
                                  </div>
                                </div>
                                
                                <div className="pl-8 space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Your answer:</span> {question.options[userAnswer]}
                                  </p>
                                  {!isCorrect && (
                                    <>
                                      <p className="text-sm text-green-600">
                                        <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        <span className="font-medium">Explanation:</span> {question.explanation}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <div className="flex gap-4 mt-6">
                      <Button 
                        onClick={() => startQuiz(currentQuiz.subject, currentQuiz.difficulty)}
                        className="flex-1"
                      >
                        Retry Quiz
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentSection('study')}
                        className="flex-1"
                      >
                        Back to Study Hub
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Section */}
            {currentSection === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Settings</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Dark Mode</Label>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Select value={settings.fontSize} onValueChange={(value) => setSettings({...settings, fontSize: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Enable Notifications</Label>
                        <Switch
                          checked={settings.notifications}
                          onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Auto-save</Label>
                        <Switch
                          checked={settings.autoSave}
                          onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Assistant</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>API Key</Label>
                        <Input
                          type="password"
                          placeholder="Enter your OpenAI API key"
                          value={settings.apiKey}
                          onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                        />
                        <p className="text-sm text-muted-foreground">
                          Required for AI assistant functionality
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button onClick={exportData} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export All Data
                      </Button>
                      <div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importData}
                          className="hidden"
                          id="import-data"
                        />
                        <Button asChild variant="outline" className="w-full">
                          <label htmlFor="import-data" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Import Data
                          </label>
                        </Button>
                      </div>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => {
                          if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                            localStorage.clear();
                            window.location.reload();
                          }
                        }}
                      >
                        Clear All Data
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* AI Chat Panel */}
        {aiChatOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="flex-1 bg-black/20 backdrop-blur-sm" 
              onClick={() => setAiChatOpen(false)}
            />
            <div className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl flex flex-col border-l border-slate-200/50">
              <div className="flex items-center justify-between p-4 border-b border-slate-200/50 bg-white/50">
                <h3 className="font-semibold text-slate-800">AI Assistant</h3>
                <Button variant="ghost" size="sm" onClick={() => setAiChatOpen(false)} className="hover:bg-slate-100/50">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiMessages.length === 0 && (
                  <div className="text-center text-slate-500 py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="h-8 w-8 text-slate-600" />
                    </div>
                    <p className="text-sm leading-relaxed">Hi! I'm your AI assistant. Ask me anything about your studies, productivity, or general questions!</p>
                  </div>
                )}
                
                {aiMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                      message.sender === 'user' 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white border border-slate-200'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-200/50 bg-white/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
                    className="border-slate-200"
                  />
                  <Button onClick={sendAiMessage} disabled={!aiInput.trim() || isLoading} className="shadow-sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

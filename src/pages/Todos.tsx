import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowLeft, Trash2, List } from "lucide-react";
import { Link } from "react-router-dom";
import { getTodos, saveTodos, Todo } from "@/lib/utils";

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const newId = Math.max(0, ...todos.map(t => t.id)) + 1;
      setTodos([{ id: newId, text: newTodo.trim(), completed: false }, ...todos]);
      setNewTodo('');
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
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
            <List className="h-6 w-6 text-blue-600" /> Todo Lists
          </h1>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-colors duration-300">
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
            <Input
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              className="flex-1 h-10 dark:bg-slate-900 dark:text-white"
            />
            <Button type="submit" className="h-10">Add</Button>
          </form>
          <div className="flex-1 overflow-y-auto max-h-96 divide-y divide-slate-100 dark:divide-slate-700">
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
        </div>
      </div>
    </div>
  );
};

export default Todos;

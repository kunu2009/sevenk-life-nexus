import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- LocalStorage Mock API ---

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type Habit = {
  id: number;
  name: string;
  completed: boolean;
  streak: number;
};

const TODOS_KEY = 'sevenk_todos';
const HABITS_KEY = 'sevenk_habits';

export function getTodos(): Todo[] {
  const data = localStorage.getItem(TODOS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTodos(todos: Todo[]) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

export function getHabits(): Habit[] {
  const data = localStorage.getItem(HABITS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

// --- Motivational Quotes ---

const QUOTES = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "The future depends on what you do today. – Mahatma Gandhi",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Start where you are. Use what you have. Do what you can. – Arthur Ashe",
  "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
  "It always seems impossible until it's done. – Nelson Mandela",
  "Dream big and dare to fail. – Norman Vaughan",
  "Act as if what you do makes a difference. It does. – William James"
];

export function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// --- Calendar Events ---
export type CalendarEvent = {
  id: number;
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  description?: string;
};

const EVENTS_KEY = 'sevenk_events';

export function getEvents(): CalendarEvent[] {
  const data = localStorage.getItem(EVENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveEvents(events: CalendarEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function addEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
  const events = getEvents();
  const newId = Math.max(0, ...events.map(e => e.id)) + 1;
  const newEvent = { ...event, id: newId };
  const updated = [newEvent, ...events];
  saveEvents(updated);
  return newEvent;
}

export function deleteEvent(id: number) {
  const events = getEvents().filter(e => e.id !== id);
  saveEvents(events);
}

export function updateEvent(updatedEvent: CalendarEvent) {
  const events = getEvents().map(e => e.id === updatedEvent.id ? updatedEvent : e);
  saveEvents(events);
}

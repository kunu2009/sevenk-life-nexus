import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar as CalendarIcon, Trash2, Edit2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { getEvents, saveEvents, addEvent, deleteEvent, updateEvent, CalendarEvent } from "@/lib/utils";

const CalendarPage = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const selectedDateStr = selected ? selected.toISOString().slice(0, 10) : '';
  const dayEvents = events.filter(e => e.date === selectedDateStr);

  const handleAddOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editId !== null) {
      setEvents(events.map(ev => ev.id === editId ? { ...ev, title: form.title, description: form.description } : ev));
      setEditId(null);
    } else {
      const newEvent = addEvent({ title: form.title, description: form.description, date: selectedDateStr });
      setEvents([newEvent, ...events]);
    }
    setForm({ title: '', description: '' });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const handleEdit = (event: CalendarEvent) => {
    setForm({ title: event.title, description: event.description || '' });
    setEditId(event.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-purple-600" /> Calendar
          </h1>
        </div>
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <Calendar mode="single" selected={selected} onSelect={setSelected} className="border-0" />
                <Button className="mt-4 w-full" onClick={() => { setShowForm(true); setEditId(null); }}> <Plus className="h-4 w-4 mr-2" /> Add Event</Button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">Events for {selectedDateStr}</h2>
                {dayEvents.length === 0 && <div className="text-slate-400 dark:text-slate-500 text-sm py-4 text-center">No events for this day.</div>}
                <ul className="space-y-2">
                  {dayEvents.map(ev => (
                    <li key={ev.id} className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{ev.title}</div>
                        {ev.description && <div className="text-xs text-slate-600 dark:text-slate-300">{ev.description}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(ev)}><Edit2 className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(ev.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
                {showForm && (
                  <form onSubmit={handleAddOrEdit} className="mt-4 space-y-2 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                    <input
                      className="w-full p-2 rounded mb-2 border dark:bg-slate-800 dark:text-white"
                      placeholder="Event title"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                    <textarea
                      className="w-full p-2 rounded border dark:bg-slate-800 dark:text-white"
                      placeholder="Description (optional)"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button type="submit">{editId !== null ? 'Update' : 'Add'} Event</Button>
                      <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm({ title: '', description: '' }); setEditId(null); }}>Cancel</Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;

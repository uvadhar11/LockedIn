import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  X,
  Edit2,
  Check,
  Calendar,
  Target,
  Trash2,
  GripVertical,
} from 'lucide-react';
import type { Task, Goal } from '../types';

// ... (keep existing interfaces)
interface CalendarTabProps {
  tasks: Task[];
  goals: Goal[];
  onRemoveTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updatedTask: Task) => void;
  scheduledTasks: ScheduledTask[];
  setScheduledTasks: (tasks: ScheduledTask[]) => void;
}

interface ScheduledTask extends Task {
  day: number;
  hour: number;
}

interface EditingTask {
  id: string;
  title: string;
}

export function CalendarTab({
  tasks,
  goals,
  onRemoveTask,
  onUpdateTask,
  scheduledTasks,
  setScheduledTasks,
}: CalendarTabProps) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 48 }, (_, i) => i / 2); // 30-minute intervals
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');

  const [editingSidebarTask, setEditingSidebarTask] = useState<string | null>(
    null
  );
  const [editedTaskTitle, setEditedTaskTitle] = useState('');

  const [selectedTask, setSelectedTask] = useState<TaskDetails | null>(null);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState({
    day: 0,
    hour: 0,
  });

  // ... (keep existing state)
  /*
  const handleTaskDragStart = (
    taskId: string,
    day: number,
    hour: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    setDraggingTask(taskId);
    setDragStartY(e.clientY);
    setDragStartPosition({ day, hour });
  };

  const handleTaskDragMove = (e: MouseEvent) => {
    if (!draggingTask) return;

    const deltaY = e.clientY - dragStartY;
    const hourDelta = Math.round((deltaY / 32) * 0.25) * 0.25; // 15-minute increments

    setScheduledTasks((prev) =>
      prev.map((task) => {
        if (task.id === draggingTask) {
          const newHour = Math.max(
            0,
            Math.min(23.75, dragStartPosition.hour + hourDelta)
          );
          return { ...task, hour: newHour };
        }
        return task;
      })
    );
  };

  const handleTaskDragEnd = () => {
    setDraggingTask(null);
  };

  useEffect(() => {
    if (draggingTask) {
      window.addEventListener('mousemove', handleTaskDragMove);
      window.addEventListener('mouseup', handleTaskDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleTaskDragMove);
        window.removeEventListener('mouseup', handleTaskDragEnd);
      };
    }
  }, [draggingTask, dragStartY, dragStartPosition]);
  */

  // const [editingTask, setEditingTask] = useState<EditingTask | null>(null);
  // const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');
  // const [editingSidebarTask, setEditingSidebarTask] = useState<string | null>(
  //   null
  // );
  // const [editedTaskTitle, setEditedTaskTitle] = useState('');

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = [...tasks, ...goals.flatMap((goal) => goal.tasks)].find(
      (t) => t.id === taskId
    );

    if (task) {
      setScheduledTasks((prev) => [
        ...prev.filter((t) => t.id !== taskId),
        { ...task, day, hour },
      ]);
    }
  };

  const handleEditTask = (task: ScheduledTask) => {
    setEditingTask({ id: task.id, title: task.title });
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;

    setScheduledTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? { ...task, title: editingTask.title }
          : task
      )
    );
    setEditingTask(null);
  };

  const handleRemoveScheduledTask = (taskId: string) => {
    setScheduledTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const startEditingSidebarTask = (task: Task) => {
    setEditingSidebarTask(task.id);
    setEditedTaskTitle(task.title);
  };

  const saveSidebarTaskEdit = (task: Task) => {
    if (activeTab === 'tasks') {
      const updatedTask = { ...task, title: editedTaskTitle };
      onUpdateTask(task.id, updatedTask);

      // Update the task in scheduledTasks if it exists there
      setScheduledTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, title: editedTaskTitle } : t
        )
      );
    }
    setEditingSidebarTask(null);
    setEditedTaskTitle('');
  };

  // ... (keep existing calendar grid rendering with updated intervals)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Existing sidebar */}
      <div className="w-80 border-r bg-white p-4 overflow-y-auto">
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-2 ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            <Calendar className="h-4 w-4" />
            Tasks
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-2 ${
              activeTab === 'goals'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setActiveTab('goals')}
          >
            <Target className="h-4 w-4" />
            Goals
          </button>
        </div>

        <div className="space-y-2">
          {activeTab === 'tasks'
            ? tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    {editingSidebarTask === task.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editedTaskTitle}
                          onChange={(e) => setEditedTaskTitle(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border rounded"
                          autoFocus
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              saveSidebarTaskEdit(task);
                            }
                          }}
                        />
                        <button
                          onClick={() => saveSidebarTaskEdit(task)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingSidebarTask(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1">{task.title}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={() => startEditingSidebarTask(task)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onRemoveTask(task.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  {task.dueDate && (
                    <div className="mt-1 text-xs text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))
            : goals
                .flatMap((goal) => goal.tasks)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="flex-1">{task.title}</span>
                    </div>
                    {task.dueDate && (
                      <div className="mt-1 text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        {/* Time indicator */}
        <div
          className="absolute left-0 right-0 border-t-2 border-red-500 z-10 pointer-events-none"
          style={{
            top: `${
              ((currentTime.getHours() * 60 + currentTime.getMinutes()) / 30) *
              32
            }px`,
          }}
        >
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-red-500" />
        </div>

        {/* Calendar grid with 30-minute intervals */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 border-r bg-white sticky top-0"></div>
          {days.map((day) => (
            <div
              key={day}
              className="p-4 text-center border-r font-medium bg-white sticky top-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b">
              <div className="p-2 border-r text-sm text-gray-500 bg-white sticky left-0">
                {Math.floor(hour).toString().padStart(2, '0')}:
                {hour % 1 === 0 ? '00' : '30'}
              </div>
              {/* ... rest of the hour cells */}
            </div>
          ))}
        </div>
      </div>

      {/* Task Details Sidebar */}
      {selectedTask && (
        <div className="w-80 border-l bg-white p-4 overflow-y-auto">
          {/* ... existing task details sidebar */}
        </div>
      )}
    </div>
  );
}

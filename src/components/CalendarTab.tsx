import React, { useState, useEffect } from "react";
import { Clock, X, Edit2, Check, Calendar, Target, Trash2 } from "lucide-react";
import type { Task, Goal } from "../types";

interface CalendarTabProps {
  tasks: Task[];
  goals: Goal[];
  onRemoveTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updatedTask: Task) => void;
  scheduledTasks: ScheduledTask[];
  setScheduledTasks: React.Dispatch<React.SetStateAction<ScheduledTask[]>>;
}

interface ScheduledTask extends Task {
  day: number;
  hour: number;
  duration: number; // duration in hours
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
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 96 }, (_, i) => i / 4); // 15-minute intervals
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"tasks" | "goals">("tasks");
  const [editingSidebarTask, setEditingSidebarTask] = useState<string | null>(
    null
  );
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState({
    day: 0,
    hour: 0,
  });
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
    setDraggingTask(task.id);
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = [...tasks, ...goals.flatMap((goal) => goal.tasks)].find(
      (t) => t.id === taskId
    );

    if (task) {
      setScheduledTasks((prev: ScheduledTask[]) => {
        const updatedTasks = [
          ...prev.filter((t: ScheduledTask) => t.id !== taskId),
          { ...task, day, hour, duration: 0.25 },
        ];
        return updatedTasks;
      });
    }
    setDraggingTask(null);
  };

  // Handle task click to open sidebar with task details
  const handleTaskClick = (task: ScheduledTask) => {
    setSelectedTask(task);
  };

  // Handle task duration change
  const handleTaskDurationChange = (taskId: string, newDuration: number) => {
    setScheduledTasks((prev: ScheduledTask[]) =>
      prev.map((task: ScheduledTask) =>
        task.id === taskId ? { ...task, duration: newDuration } : task
      )
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, duration: newDuration });
    }
  };

  // Handle task move
  const handleTaskMove = (taskId: string, newDay: number, newHour: number) => {
    setScheduledTasks((prev: ScheduledTask[]) =>
      prev.map((task: ScheduledTask) =>
        task.id === taskId ? { ...task, day: newDay, hour: newHour } : task
      )
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, day: newDay, hour: newHour });
    }
  };

  // Handle task delete
  const handleTaskDelete = (taskId: string) => {
    setScheduledTasks((prev: ScheduledTask[]) =>
      prev.filter((task: ScheduledTask) => task.id !== taskId)
    );
    setSelectedTask(null);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!editingTask) return;

    setScheduledTasks((prev: ScheduledTask[]) =>
      prev.map((task: ScheduledTask) =>
        task.id === editingTask.id
          ? { ...task, title: editingTask.title }
          : task
      )
    );
    setEditingTask(null);
  };

  // Handle sidebar task edit
  const startEditingSidebarTask = (task: Task) => {
    setEditingSidebarTask(task.id);
    setEditedTaskTitle(task.title);
  };

  // Save sidebar task edit
  const saveSidebarTaskEdit = (task: Task) => {
    if (activeTab === "tasks") {
      const updatedTask = { ...task, title: editedTaskTitle };
      onUpdateTask(task.id, updatedTask);

      // Update the task in scheduledTasks if it exists there
      setScheduledTasks((prev: ScheduledTask[]) =>
        prev.map((t: ScheduledTask) =>
          t.id === task.id ? { ...t, title: editedTaskTitle } : t
        )
      );
    }
    setEditingSidebarTask(null);
    setEditedTaskTitle("");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white p-4 overflow-y-auto">
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-2 ${
              activeTab === "tasks"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            <Calendar className="h-4 w-4" />
            Tasks
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-2 ${
              activeTab === "goals"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("goals")}
          >
            <Target className="h-4 w-4" />
            Goals
          </button>
        </div>

        <div className="space-y-2">
          {activeTab === "tasks"
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
                            if (e.key === "Enter") {
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
                        <span className="flex-1 truncate">{task.title}</span>
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
                      <span className="flex-1 truncate">{task.title}</span>
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

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto relative">
        {/* Time indicator */}
        <div
          className="absolute left-0 right-0 border-t-2 border-red-500 z-10 pointer-events-none"
          style={{
            top: `${
              ((currentTime.getHours() * 60 + currentTime.getMinutes()) / 15) *
              16
            }px`,
          }}
        >
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-red-500" />
        </div>

        {/* Calendar grid with 15-minute intervals */}
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
                {Math.floor(hour).toString().padStart(2, "0")}:
                {hour % 1 === 0
                  ? "00"
                  : hour % 1 === 0.25
                  ? "15"
                  : hour % 1 === 0.5
                  ? "30"
                  : "45"}
              </div>
              {days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border-r border-b h-16 relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dayIndex, hour)}
                >
                  {scheduledTasks
                    .filter(
                      (task) => task.day === dayIndex && task.hour === hour
                    )
                    .map((task) => (
                      <div
                        key={task.id}
                        className="absolute top-0 left-0 right-0 p-2 bg-indigo-100 rounded-lg cursor-move truncate"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onClick={() => handleTaskClick(task)}
                        style={{
                          height: `${task.duration * 64}px`, // Adjust height based on duration
                          zIndex: 10,
                        }}
                      >
                        {task.title}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Task Details Sidebar */}
      {selectedTask && (
        <div className="w-80 border-l bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">{selectedTask.title}</h2>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, title: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (hours)
              </label>
              <input
                type="number"
                step="0.25"
                value={selectedTask.duration}
                onChange={(e) =>
                  handleTaskDurationChange(
                    selectedTask.id,
                    parseFloat(e.target.value)
                  )
                }
                className="mt-1 block w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Day
              </label>
              <select
                value={selectedTask.day}
                onChange={(e) =>
                  handleTaskMove(
                    selectedTask.id,
                    parseInt(e.target.value, 10),
                    selectedTask.hour
                  )
                }
                className="mt-1 block w-full px-3 py-2 border rounded"
              >
                {days.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hour
              </label>
              <select
                value={selectedTask.hour}
                onChange={(e) =>
                  handleTaskMove(
                    selectedTask.id,
                    selectedTask.day,
                    parseFloat(e.target.value)
                  )
                }
                className="mt-1 block w-full px-3 py-2 border rounded"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {Math.floor(hour).toString().padStart(2, "0")}:
                    {hour % 1 === 0
                      ? "00"
                      : hour % 1 === 0.25
                      ? "15"
                      : hour % 1 === 0.5
                      ? "30"
                      : "45"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleTaskDelete(selectedTask.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef } from "react";
import {
  Trash2,
  Archive,
  CheckSquare,
  Square,
  Plus,
  X,
  Calendar,
  Paperclip,
  Check,
} from "lucide-react";

interface InboxTabProps {
  onAddTask: (text: string) => void;
}

interface InboxItem {
  id: string;
  text: string;
  type: "task" | "project" | "reference";
  notes?: string;
  files?: File[];
  dueDate?: string;
  subTasks?: { id: string; text: string; completed: boolean }[];
  smartGoal?: {
    specific: string;
    measurable: string;
    attainable: string;
    relevant: string;
    timeBound: string;
  };
}

export function InboxTab({ onAddTask }: InboxTabProps) {
  const [thoughts, setThoughts] = useState<string>("");
  const [items, setItems] = useState<InboxItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);
  const [newSubTask, setNewSubTask] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addThought = () => {
    if (!thoughts.trim()) return;

    const newItem: InboxItem = {
      id: Date.now().toString(),
      text: thoughts,
      type: "task",
      notes: "",
      files: [],
      subTasks: [],
    };

    setItems([...items, newItem]);
    setSelectedItem(newItem);
    setThoughts("");
  };

  const updateItemType = (
    id: string,
    type: "task" | "project" | "reference"
  ) => {
    setItems(items.map((item) => (item.id === id ? { ...item, type } : item)));
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, type });
    }
  };

  const addSubTask = (itemId: string) => {
    if (!newSubTask.trim()) return;

    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            subTasks: [
              ...(item.subTasks || []),
              { id: Date.now().toString(), text: newSubTask, completed: false },
            ],
          };
        }
        return item;
      })
    );

    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem({
        ...selectedItem,
        subTasks: [
          ...(selectedItem.subTasks || []),
          { id: Date.now().toString(), text: newSubTask, completed: false },
        ],
      });
    }

    setNewSubTask("");
  };

  const handleFileUpload = (itemId: string, files: FileList) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            files: [...(item.files || []), ...Array.from(files)],
          };
        }
        return item;
      })
    );

    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem({
        ...selectedItem,
        files: [...(selectedItem.files || []), ...Array.from(files)],
      });
    }
  };

  const sendToCalendar = (item: InboxItem) => {
    onAddTask(item.text);
    setItems(items.filter((i) => i.id !== item.id));
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Capture Thoughts Section */}
      <div className="p-6 bg-white shadow-sm mb-6">
        <h2 className="text-2xl font-bold mb-4">Capture Thoughts</h2>
        <div className="flex gap-4">
          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            className="flex-1 p-3 border rounded-lg resize-none h-32"
            placeholder="Write down your thoughts..."
          />
          <button
            onClick={addThought}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 h-fit"
          >
            Add
          </button>
        </div>
      </div>

      {/* Items List and Details */}
      <div className="flex-1 flex">
        {/* Items List */}
        <div
          className={`${selectedItem ? "w-1/2" : "w-full"} overflow-auto p-6`}
        >
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-4 bg-white rounded-lg shadow-sm cursor-pointer transition-colors ${
                  selectedItem?.id === item.id ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <p className="font-medium">{item.text}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span>{item.type}</span>
                  {item.dueDate && (
                    <span>
                      · Due {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Item Details Sidebar */}
        {selectedItem && (
          <div className="w-1/2 bg-white border-l p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">{selectedItem.text}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItemType(selectedItem.id, "task")}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedItem.type === "task"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Task
                  </button>
                  <button
                    onClick={() => updateItemType(selectedItem.id, "project")}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedItem.type === "project"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Project
                  </button>
                  <button
                    onClick={() => updateItemType(selectedItem.id, "reference")}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedItem.type === "reference"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Reference
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Calendar button */}
                {selectedItem.type !== "reference" && (
                  <button
                    onClick={() => sendToCalendar(selectedItem)}
                    className="p-2 text-gray-500 hover:text-indigo-600"
                  >
                    <Calendar className="h-5 w-5" />
                  </button>
                )}
                {/* Trash button */}
                <button
                  onClick={() => {
                    setItems(items.filter((i) => i.id !== selectedItem.id));
                    setSelectedItem(null);
                  }}
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                {/* Close tab button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content based on type */}
            {/* Description */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg">
                <h4 className="font-medium mb-2">Description</h4>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="Add a description..."
                  value={selectedItem.notes || ""}
                  onChange={(e) =>
                    setItems(
                      items.map((item) =>
                        item.id === selectedItem.id
                          ? { ...item, notes: e.target.value }
                          : item
                      )
                    )
                  }
                />
              </div>

              {/* Files */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Files</h4>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(selectedItem.id, e.target.files);
                      }
                    }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                  >
                    <Paperclip className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Drop files here or click to upload
                    </p>
                  </div>
                  {selectedItem.files && selectedItem.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedItem.files.map((file, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Due Date */}
                {selectedItem.type !== "reference" && (
                  <div>
                    <h4 className="font-medium mb-2">Due Date</h4>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-lg"
                      value={selectedItem.dueDate || ""}
                      onChange={(e) =>
                        setItems(
                          items.map((item) =>
                            item.id === selectedItem.id
                              ? { ...item, dueDate: e.target.value }
                              : item
                          )
                        )
                      }
                    />
                  </div>
                )}
              </div>

              {/* Subtasks */}
              {selectedItem.type !== "reference" && (
                <div>
                  <h4 className="font-medium mb-2">Subtasks</h4>
                  <div className="space-y-2">
                    {selectedItem.subTasks?.map((subTask) => (
                      <div key={subTask.id} className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setItems(
                              items.map((item) =>
                                item.id === selectedItem.id
                                  ? {
                                      ...item,
                                      subTasks: item.subTasks?.map((st) =>
                                        st.id === subTask.id
                                          ? { ...st, completed: !st.completed }
                                          : st
                                      ),
                                    }
                                  : item
                              )
                            );
                          }}
                        >
                          {subTask.completed ? (
                            <CheckSquare className="h-5 w-5 text-green-500" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <span
                          className={
                            subTask.completed
                              ? "line-through text-gray-400"
                              : ""
                          }
                        >
                          {subTask.text}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Add a subtask..."
                        value={newSubTask}
                        onChange={(e) => setNewSubTask(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addSubTask(selectedItem.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => addSubTask(selectedItem.id)}
                        className="p-2 text-gray-500 hover:text-indigo-600"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

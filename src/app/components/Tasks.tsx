import { useState } from "react";
import { Plus, Clock, Calendar, Flag, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Tasks() {
  const { tasks, addTask, deleteTask, viewMode } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const activeTasks = tasks.filter((task) => task.status === "todo");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const containerClass = viewMode === "desktop" ? "max-w-6xl mx-auto" : "";
  const gridClass = viewMode === "desktop" ? "lg:grid-cols-2 gap-6" : "";

  return (
    <div className={`min-h-full px-5 pt-8 pb-8 ${containerClass}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Tasks</h1>
          <p className="text-gray-500">
            {activeTasks.length} active · {completedTasks.length} completed
          </p>
        </div>
        
        {/* Add Button - Mobile (next to title) */}
        {viewMode === "mobile" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Tasks</span>
          </button>
        )}
      </div>

      <div className={`grid ${gridClass}`}>
        {/* Active Tasks */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Active
          </h2>
          {activeTasks.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-gray-500">No active tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <TaskListCard key={task.id} task={task} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Completed
            </h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <TaskListCard key={task.id} task={task} onDelete={deleteTask} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Button - Desktop only */}
      {viewMode === "desktop" && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={(task) => {
            addTask(task);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function TaskListCard({ task, onDelete }: { task: any; onDelete: (id: string) => void }) {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  const priorityColors = {
    Low: "text-gray-500",
    Medium: "text-yellow-600",
    High: "text-red-600",
  };

  const statusStyle = task.status === "completed" ? "opacity-60" : "";

  const deadlineDate = new Date(task.deadline);
  const today = new Date();
  const isOverdue = deadlineDate < today && task.status === "todo";
  const daysUntil = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${statusStyle}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3
            className={`font-semibold text-gray-900 mb-2 leading-snug ${
              task.status === "completed" ? "line-through" : ""
            }`}
          >
            {task.title}
          </h3>
          <div className="text-sm text-gray-600 mb-2">{task.course}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                difficultyColors[task.difficulty]
              }`}
            >
              {task.difficulty}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {task.estimatedTime}m
            </span>
            <span
              className={`text-xs flex items-center gap-1 ${
                isOverdue ? "text-red-600" : "text-gray-500"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {isOverdue
                ? "Overdue"
                : daysUntil === 0
                ? "Today"
                : daysUntil === 1
                ? "Tomorrow"
                : `${daysUntil}d`}
            </span>
            <span className={`text-xs flex items-center gap-1 ${priorityColors[task.priority]}`}>
              <Flag className="w-3.5 h-3.5" />
              {task.priority}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {task.status === "completed" && (
        <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-flex items-center gap-1">
          ✓ Completed
        </div>
      )}
    </div>
  );
}

function AddTaskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (task: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    estimatedTime: 30,
    deadline: new Date().toISOString().split("T")[0],
    priority: "Medium" as "Low" | "Medium" | "High",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.course) return;
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 px-4">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              placeholder="Enter course name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Easy", "Medium", "Hard"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: level })}
                  className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                    formData.difficulty === level
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (min)
              </label>
              <input
                type="number"
                value={formData.estimatedTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedTime: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                min="5"
                step="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["Low", "Medium", "High"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: level })}
                  className={`py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                    formData.priority === level
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors mt-6"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
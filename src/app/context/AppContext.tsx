import { createContext, useContext, useState, ReactNode } from "react";

export interface Task {
  id: string;
  title: string;
  course: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: number; // in minutes
  deadline: string;
  priority: "Low" | "Medium" | "High";
  status: "todo" | "completed";
  completedAt?: string;
}

export type EnergyLevel = "low" | "medium" | "high" | null;
export type ViewMode = "mobile" | "desktop";

interface AppContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "status">) => void;
  toggleTaskComplete: (id: string) => void;
  energyLevel: EnergyLevel;
  setEnergyLevel: (level: EnergyLevel) => void;
  deleteTask: (id: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review lecture notes on React Hooks",
    course: "Web Development",
    difficulty: "Medium",
    estimatedTime: 30,
    deadline: "2026-03-10",
    priority: "High",
    status: "todo",
  },
  {
    id: "2",
    title: "Complete calculus problem set",
    course: "Mathematics",
    difficulty: "Hard",
    estimatedTime: 60,
    deadline: "2026-03-11",
    priority: "High",
    status: "todo",
  },
  {
    id: "3",
    title: "Read Chapter 5 of psychology textbook",
    course: "Psychology",
    difficulty: "Easy",
    estimatedTime: 45,
    deadline: "2026-03-12",
    priority: "Medium",
    status: "todo",
  },
  {
    id: "4",
    title: "Practice Spanish vocabulary",
    course: "Language",
    difficulty: "Easy",
    estimatedTime: 20,
    deadline: "2026-03-10",
    priority: "Low",
    status: "todo",
  },
  {
    id: "5",
    title: "Write essay outline",
    course: "English Literature",
    difficulty: "Medium",
    estimatedTime: 40,
    deadline: "2026-03-13",
    priority: "High",
    status: "todo",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);

  const addTask = (task: Omit<Task, "id" | "status">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      status: "todo",
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "todo" ? "completed" : "todo",
              completedAt: task.status === "todo" ? new Date().toISOString() : undefined,
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUser(email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setEnergyLevel(null);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        addTask,
        toggleTaskComplete,
        energyLevel,
        setEnergyLevel,
        deleteTask,
        viewMode,
        setViewMode,
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
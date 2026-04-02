import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
}

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
  userProfile: UserProfile | null;
  focusSeconds: number;
  studyStreak: number;
  login: (email: string) => void;
  register: (profile: UserProfile, password: string) => void;
  updateUserProfile: (profile: UserProfile) => void;
  changePassword: (currentPassword: string, nextPassword: string) => { success: boolean; message: string };
  addFocusSeconds: (seconds: number) => void;
  recordStudySession: () => void;
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

const defaultProfile: UserProfile = {
  fullName: "John Anderson",
  email: "john.anderson@example.com",
  phone: "0912345678",
  birthDate: "2000-01-01",
  gender: "other",
};

interface StudyProgress {
  streak: number;
  lastStudyDate: string | null;
}

const storageKeys = {
  focusSeconds: "study-planner-focus-seconds",
  studyProgress: "study-planner-study-progress",
};

function readStoredNumber(key: string, fallback: number) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);
  if (storedValue === null) {
    return fallback;
  }

  const parsedValue = Number(storedValue);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function readStoredStudyProgress(): StudyProgress {
  if (typeof window === "undefined") {
    return { streak: 0, lastStudyDate: null };
  }

  const storedValue = window.localStorage.getItem(storageKeys.studyProgress);
  if (!storedValue) {
    return { streak: 0, lastStudyDate: null };
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<StudyProgress>;
    return {
      streak: Number(parsedValue.streak) || 0,
      lastStudyDate: typeof parsedValue.lastStudyDate === "string" ? parsedValue.lastStudyDate : null,
    };
  } catch {
    return { streak: 0, lastStudyDate: null };
  }
}

function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPreviousDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return formatDateKey(date);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [focusSeconds, setFocusSeconds] = useState<number>(() => readStoredNumber(storageKeys.focusSeconds, 0));
  const [studyProgress, setStudyProgress] = useState<StudyProgress>(() => readStoredStudyProgress());
  const [password, setPassword] = useState<string>("12345678");

  const studyStreak = studyProgress.streak;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKeys.focusSeconds, String(focusSeconds));
  }, [focusSeconds]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKeys.studyProgress, JSON.stringify(studyProgress));
  }, [studyProgress]);

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
    setUserProfile((previousProfile) => {
      if (previousProfile) {
        return { ...previousProfile, email };
      }
      return { ...defaultProfile, email };
    });
  };

  const register = (profile: UserProfile, nextPassword: string) => {
    setIsAuthenticated(true);
    setUser(profile.email);
    setUserProfile(profile);
    setPassword(nextPassword);
    setFocusSeconds(0);
    setStudyProgress({ streak: 0, lastStudyDate: null });
    setEnergyLevel(null);
  };

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setUser(profile.email);
  };

  const changePassword = (currentPassword: string, nextPassword: string) => {
    if (currentPassword !== password) {
      return { success: false, message: "Current password is incorrect" };
    }
    if (nextPassword.length < 8) {
      return { success: false, message: "New password must be at least 8 characters" };
    }
    setPassword(nextPassword);
    return { success: true, message: "Password updated successfully" };
  };

  const addFocusSeconds = (seconds: number) => {
    if (seconds <= 0) {
      return;
    }
    setFocusSeconds((previous) => previous + seconds);
  };

  const recordStudySession = () => {
    setStudyProgress((previousProgress) => {
      const today = formatDateKey();

      if (previousProgress.lastStudyDate === today) {
        return previousProgress;
      }

      if (previousProgress.lastStudyDate === getPreviousDateKey(today)) {
        return {
          streak: previousProgress.streak + 1,
          lastStudyDate: today,
        };
      }

      return {
        streak: 1,
        lastStudyDate: today,
      };
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserProfile(null);
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
        userProfile,
        focusSeconds,
        studyStreak,
        login,
        register,
        updateUserProfile,
        changePassword,
        addFocusSeconds,
        recordStudySession,
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
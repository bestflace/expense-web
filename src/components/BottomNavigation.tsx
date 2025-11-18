import React from "react";
import { Home, PieChart, FolderOpen, Settings, LogOut } from "lucide-react";
import type { Screen } from "../App";
import { motion } from "motion/react";

interface SidebarNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function BottomNavigation({
  currentScreen,
  onNavigate,
  onLogout,
}: SidebarNavigationProps) {
  const navItems = [
    { id: "home", label: "Trang chủ", icon: Home },
    { id: "categories", label: "Danh mục", icon: FolderOpen },
    { id: "statistics", label: "Báo cáo", icon: PieChart },
    { id: "profile", label: "Cài đặt", icon: Settings },
  ] as const;

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl"
    >
      {/* Logo/Brand */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-2xl">
              <img src="/BudgetF.png" alt="logo" className="rounded-xl" />
            </span>
          </motion.div>
          <div>
            <h1 className="text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BudgetF
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý chi tiêu thông minh
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon }, index) => (
          <motion.button
            key={id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.03, x: 4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate(id as Screen)}
            className={`
        relative w-full flex items-center space-x-3 py-3 px-4 rounded-xl 
        text-left overflow-hidden transition-all
        ${
          currentScreen === id
            ? "text-primary-foreground"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }
      `}
          >
            {currentScreen === id && (
              <motion.span
                layoutId="activeNavBg"
                className="absolute inset-0 rounded-xl 
                     bg-gradient-to-br from-primary to-primary/80 
                     shadow-lg"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}

            <Icon className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <motion.button
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all text-left text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

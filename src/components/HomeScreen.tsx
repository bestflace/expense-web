import React, { useState } from "react";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import type { User, Transaction, Category, Budget } from "../App";
import { motion, AnimatePresence } from "motion/react";

interface HomeScreenProps {
  user: User;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: Transaction[];
  categories: Category[];
  budget: Budget;
  onAddTransaction: () => void;
  onEditTransaction: (transaction: Transaction) => void;
  onNavigateToCategories?: () => void;
}

export function HomeScreen({
  user,
  balance,
  totalIncome,
  totalExpenses,
  transactions,
  categories,
  budget,
  onAddTransaction,
  onEditTransaction,
  onNavigateToCategories,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate monthly expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return (
        t.type === "expense" &&
        tDate.getMonth() === currentMonth &&
        tDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetPercentage = (monthlyExpenses / budget.monthlyLimit) * 100;
  const isOverBudget = monthlyExpenses > budget.monthlyLimit;

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.icon || "💰";
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || "#6B7280";
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "₫";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
                Xin chào{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {user.fullName || "bạn"}
                </span>
                <span className="ml-1">👋</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Tổng quan tài chính của bạn
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onAddTransaction}
                className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-8 mb-8 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm giao dịch
              </Button>
            </motion.div>
          </div>

          {/* Budget Warning */}
          <AnimatePresence>
            {budget.notificationsEnabled && isOverBudget && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-md"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-red-900 dark:text-red-100">
                      Cảnh báo ngân sách!
                    </h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                      Bạn đã vượt quá hạn mức chi tiêu tháng này:{" "}
                      {monthlyExpenses.toLocaleString("vi-VN")}₫ /{" "}
                      {budget.monthlyLimit.toLocaleString("vi-VN")}₫ (
                      {budgetPercentage.toFixed(0)}%)
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Balance */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card
                className="bg-gradient-to-br from-primary to-primary/80 
                 border-0 text-primary-foreground 
                 rounded-xl shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <p className="text-primary-foreground">Tổng số dư</p>
                    <p className="text-4xl">{formatAmount(balance)}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Income */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                      <ArrowDownLeft className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-green-600 dark:text-green-400">
                        Thu nhập tháng này
                      </p>
                      <p className="text-2xl text-gray-900 dark:text-white">
                        {formatAmount(totalIncome)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Expenses */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-red-600 dark:text-red-400">
                        Chi tiêu tháng này
                      </p>
                      <p className="text-2xl text-gray-900 dark:text-white">
                        {formatAmount(totalExpenses)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm giao dịch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white dark:bg-gray-800 border-0 shadow-md"
              />
            </div>

            <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-gray-900 dark:text-white">
                    Giao dịch gần đây
                  </h2>
                  <span className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {filteredTransactions.length} giao dịch
                  </span>
                </div>

                {filteredTransactions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">
                      {searchQuery
                        ? "Không tìm thấy giao dịch"
                        : "Chưa có giao dịch nào"}
                    </p>
                    {!searchQuery && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={onAddTransaction}
                          variant="ghost"
                          className="text-blue-600 dark:text-blue-400"
                        >
                          Thêm giao dịch đầu tiên
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="overflow-y-auto max-h-[600px] space-y-3 pr-2">
                    <AnimatePresence mode="popLayout">
                      {filteredTransactions.map((transaction, index) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700 dark:to-gray-800 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md"
                          onClick={() => onEditTransaction(transaction)}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md"
                            style={{
                              backgroundColor: getCategoryColor(
                                transaction.category
                              ),
                            }}
                          >
                            <span className="text-lg">
                              {getCategoryIcon(transaction.category)}
                            </span>
                          </motion.div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-gray-900 dark:text-white truncate">
                                  {transaction.description}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                  {transaction.category} •{" "}
                                  {formatDate(transaction.date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-lg ${
                                    transaction.type === "income"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {transaction.type === "income" ? "+" : "-"}
                                  {formatAmount(transaction.amount)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions & Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl text-gray-900 dark:text-white mb-4">
                  Thao tác nhanh
                </h3>
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onAddTransaction}
                      className="w-full justify-start h-12 
             bg-gradient-to-br from-primary to-primary/80 
             text-primary-foreground 
             rounded-xl shadow-lg 
             hover:opacity-90 transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-3" />
                      Thêm giao dịch
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 border-10"
                      onClick={onNavigateToCategories}
                    >
                      <FolderOpen className="w-5 h-5 mr-3" />
                      Quản lý danh mục
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Categories */}
            <Card className="border-0 bg-white dark:bg-gray-800 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl text-gray-900 dark:text-white mb-4">
                  Danh mục hàng đầu
                </h3>
                <div className="space-y-3">
                  {categories.slice(0, 4).map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white">
                          {category.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">
                          {category.type}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Transaction, Category } from "../App";
import { toast } from "sonner";

interface StatisticsScreenProps {
  transactions: Transaction[];
  categories: Category[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function StatisticsScreen({
  transactions,
  categories,
  totalIncome,
  totalExpenses,
  balance,
}: StatisticsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "₫";
  };

  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set(
      transactions.map((t) => new Date(t.date).getFullYear())
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  const months = [
    { value: "0", label: "Tất cả tháng" },
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];

  // Filter transactions based on search and filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        typeFilter === "all" || transaction.type === typeFilter;

      const transactionDate = new Date(transaction.date);
      const matchesYear =
        transactionDate.getFullYear() === parseInt(selectedYear);
      const matchesMonth =
        selectedMonth === "0" ||
        transactionDate.getMonth() + 1 === parseInt(selectedMonth);

      return matchesSearch && matchesType && matchesYear && matchesMonth;
    });
  }, [transactions, searchQuery, typeFilter, selectedYear, selectedMonth]);

  // Calculate filtered totals
  const filteredIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const filteredExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const incomeCount = filteredTransactions.filter(
    (t) => t.type === "income"
  ).length;
  const expenseCount = filteredTransactions.filter(
    (t) => t.type === "expense"
  ).length;

  // Group by category for pie chart
  // const categoryData = categories
  //   .map((category) => {
  //     const categoryTransactions = filteredTransactions.filter(
  //       (t) => t.category === category.name
  //     );
  //     const total = categoryTransactions.reduce(
  //       (sum, t) => sum + Number(t.amount || 0),
  //       0
  //     );

  //     return {
  //       name: category.name,
  //       value: total,
  //       color: category.color,
  //       icon: category.icon,
  //       type: category.type,
  //     };
  //   })
  //   .filter((item) => item.value > 0);

  // const expenseCategoryData = categoryData.filter(
  //   (item) => item.type === "expense"
  // );
  // const incomeCategoryData = categoryData.filter(
  //   (item) => item.type === "income"
  // );
  // // Tổng chi / thu theo nhóm danh mục (chỉ tính những danh mục có value > 0)
  // const totalExpenseValue = expenseCategoryData.reduce(
  //   (sum, item) => sum + item.value,
  //   0
  // );

  // const totalIncomeValue = incomeCategoryData.reduce(
  //   (sum, item) => sum + item.value,
  //   0
  // );
  // 1) TÓM TẮT THEO TỪNG DANH MỤC (leaf) – dùng cho "Tóm tắt giao dịch theo danh mục"
  const leafCategoryData = useMemo(() => {
    return categories
      .map((category) => {
        const categoryTransactions = filteredTransactions.filter(
          (t) => t.category === category.name
        );
        const total = categoryTransactions.reduce(
          (sum, t) => sum + Number(t.amount || 0),
          0
        );

        return {
          name: category.name,
          value: total,
          color: category.color,
          icon: category.icon,
          type: category.type,
        };
      })
      .filter((item) => item.value > 0);
  }, [categories, filteredTransactions]);

  const leafExpenseData = leafCategoryData.filter(
    (item) => item.type === "expense"
  );
  const leafIncomeData = leafCategoryData.filter(
    (item) => item.type === "income"
  );

  const totalExpenseSummary = leafExpenseData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalIncomeSummary = leafIncomeData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // 2) PHÂN BỔ PIE THEO NHÓM DANH MỤC CHA
  const { pieExpenseData, pieIncomeData } = useMemo(() => {
    // map id -> category, name -> category
    const byId = new Map<string, Category>();
    const byName = new Map<string, Category>();
    categories.forEach((c) => {
      byId.set(c.id, c);
      byName.set(c.name, c);
    });

    type PieItem = {
      name: string;
      value: number;
      color: string;
      icon: string;
      type: "income" | "expense";
    };

    const groupMap = new Map<string, PieItem>();

    filteredTransactions.forEach((t) => {
      const cat = byName.get(t.category);

      // tìm category dùng để gom: nếu có parent => gom theo parent, nếu không => bản thân
      let groupCat: Category | undefined;
      if (cat) {
        if (cat.parentCategoryId) {
          const parent = byId.get(cat.parentCategoryId);
          groupCat = parent || cat;
        } else {
          groupCat = cat;
        }
      }

      const groupName = groupCat?.name || t.category;
      const type = (groupCat?.type as "income" | "expense") || t.type;
      const key = `${groupName}|${type}`;

      const existing =
        groupMap.get(key) ||
        ({
          name: groupName,
          value: 0,
          color: groupCat?.color || "#6B7280",
          icon: groupCat?.icon || "💰",
          type,
        } as PieItem);

      existing.value += Number(t.amount || 0);
      groupMap.set(key, existing);
    });

    const all = Array.from(groupMap.values()).filter((i) => i.value > 0);

    return {
      pieExpenseData: all.filter((i) => i.type === "expense"),
      pieIncomeData: all.filter((i) => i.type === "income"),
    };
  }, [categories, filteredTransactions]);

  // Monthly comparison data for the selected year
  const monthlyComparisonData = useMemo(() => {
    const yearTransactions = transactions.filter(
      (t) => new Date(t.date).getFullYear() === parseInt(selectedYear)
    );

    const monthNames = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    const data = Array.from({ length: 12 }, (_, i) => {
      const monthTransactions = yearTransactions.filter(
        (t) => new Date(t.date).getMonth() === i
      );

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      return {
        month: monthNames[i],
        income,
        expenses,
        net: income - expenses,
      };
    });

    return data;
  }, [transactions, selectedYear]);

  // Export to Excel (CSV format)
  const exportToExcel = () => {
    const periodText =
      selectedMonth === "0"
        ? `Năm ${selectedYear}`
        : `${months[parseInt(selectedMonth)].label} ${selectedYear}`;

    // Create CSV content
    let csvContent = `Báo cáo thu chi - ${periodText}\n\n`;

    // Summary
    csvContent += "Tổng quan\n";
    csvContent += `Tổng thu nhập,${filteredIncome.toFixed(2)}\n`;
    csvContent += `Tổng chi tiêu,${filteredExpenses.toFixed(2)}\n`;
    csvContent += `Chênh lệch,${(filteredIncome - filteredExpenses).toFixed(
      2
    )}\n\n`;

    // Monthly breakdown
    csvContent += "Biểu đồ thu chi theo tháng\n";
    csvContent += "Tháng,Thu nhập,Chi tiêu,Chênh lệch\n";
    monthlyComparisonData.forEach((row) => {
      csvContent += `${row.month},${row.income.toFixed(
        2
      )},${row.expenses.toFixed(2)},${row.net.toFixed(2)}\n`;
    });

    // Transactions detail
    csvContent += "\nChi tiết giao dịch\n";
    csvContent += "Ngày,Loại,Danh mục,Mô tả,Số tiền\n";
    filteredTransactions.forEach((t) => {
      csvContent += `${t.date},${
        t.type === "income" ? "Thu nhập" : "Chi tiêu"
      },${t.category},${t.description},${t.amount.toFixed(2)}\n`;
    });

    // Create download link
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Bao_cao_thu_chi_${selectedYear}_${
        selectedMonth !== "0" ? selectedMonth : "full"
      }.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Đã xuất file Excel thành công!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 dark:text-white">Báo cáo</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Phân tích mẫu hình tài chính của bạn
            </p>
          </div>
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white h-12 px-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Xuất Excel
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative lg:col-span-2">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm giao dịch..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>

                {/* Type Filter */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="income">Thu nhập</SelectItem>
                    <SelectItem value="expense">Chi tiêu</SelectItem>
                  </SelectContent>
                </Select>

                {/* Year Filter */}
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        Năm {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Month Filter */}
              <div className="max-w-xs">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-green-100 text-sm">Thu nhập</p>
                    <h3 className="text-white text-2xl">
                      {formatAmount(filteredIncome)}
                    </h3>
                  </div>
                </div>
                <p className="text-green-100 text-sm">
                  {incomeCount} giao dịch
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-red-100 text-sm">Chi tiêu</p>
                    <h3 className="text-white text-2xl">
                      {formatAmount(filteredExpenses)}
                    </h3>
                  </div>
                </div>
                <p className="text-red-100 text-sm">{expenseCount} giao dịch</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Chênh lệch</p>
                    <h3 className="text-white text-2xl">
                      {formatAmount(filteredIncome - filteredExpenses)}
                    </h3>
                  </div>
                </div>
                <p className="text-blue-100 text-sm">
                  {filteredIncome > filteredExpenses ? "Dương" : "Âm"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Categories Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bổ chi tiêu</CardTitle>
              </CardHeader>
              <CardContent>
                {pieExpenseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieExpenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieExpenseData.map((entry, index) => (
                          <Cell key={`cell-exp-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatAmount(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Không có dữ liệu chi tiêu
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Income Categories Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bổ thu nhập</CardTitle>
              </CardHeader>
              <CardContent>
                {pieIncomeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieIncomeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#82ca9d"
                        dataKey="value"
                      >
                        {pieIncomeData.map((entry, index) => (
                          <Cell key={`cell-inc-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatAmount(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Không có dữ liệu thu nhập
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monthly Comparison Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>
                So sánh thu chi theo tháng - Năm {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyComparisonData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatAmount(value)} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Thu nhập" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Chi tiêu" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transaction Summary Table */}
          {/* Transaction Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt giao dịch theo danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Expense Categories */}
                {leafExpenseData.length > 0 && (
                  <div>
                    <h3 className="text-lg text-red-600 dark:text-red-400 mb-4">
                      📊 Chi tiêu
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">
                              Danh mục
                            </th>
                            <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                              Số giao dịch
                            </th>
                            <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                              Tổng số tiền
                            </th>
                            <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                              % Chi tiêu
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {leafExpenseData
                            .sort((a, b) => b.value - a.value)
                            .map((cat) => {
                              const percentage =
                                totalExpenseSummary > 0
                                  ? (cat.value / totalExpenseSummary) * 100
                                  : 0;
                              const count = filteredTransactions.filter(
                                (t) =>
                                  t.category === cat.name &&
                                  t.type === "expense"
                              ).length;

                              return (
                                <tr
                                  key={cat.name}
                                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                  <td className="py-3 px-4">
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                        style={{ backgroundColor: cat.color }}
                                      >
                                        <span className="text-sm">
                                          {cat.icon}
                                        </span>
                                      </div>
                                      <span className="text-gray-900 dark:text-white">
                                        {cat.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                                    {count}
                                  </td>
                                  <td className="text-right py-3 px-4 text-red-600 dark:text-red-400">
                                    {formatAmount(cat.value)}
                                  </td>
                                  <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                                    {percentage.toFixed(1)}%
                                  </td>
                                </tr>
                              );
                            })}
                          <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">
                              Tổng chi tiêu
                            </td>
                            <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                              {expenseCount}
                            </td>
                            <td className="text-right py-3 px-4 text-red-600 dark:text-red-400">
                              {formatAmount(totalExpenseSummary)}
                            </td>
                            <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                              100%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Income Categories */}
                {leafIncomeData.length > 0 && (
                  <div>
                    <h3 className="text-lg text-green-600 dark:text-green-400 mb-4">
                      💰 Thu nhập
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400">
                              Danh mục
                            </th>
                            <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                              Số giao dịch
                            </th>
                            <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                              Tổng số tiền
                            </th>
                            <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                              % Thu nhập
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {leafIncomeData
                            .sort((a, b) => b.value - a.value)
                            .map((cat) => {
                              const percentage =
                                totalIncomeSummary > 0
                                  ? (cat.value / totalIncomeSummary) * 100
                                  : 0;
                              const count = filteredTransactions.filter(
                                (t) =>
                                  t.category === cat.name && t.type === "income"
                              ).length;

                              return (
                                <tr
                                  key={cat.name}
                                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                  <td className="py-3 px-4">
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                                        style={{ backgroundColor: cat.color }}
                                      >
                                        <span className="text-sm">
                                          {cat.icon}
                                        </span>
                                      </div>
                                      <span className="text-gray-900 dark:text-white">
                                        {cat.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                                    {count}
                                  </td>
                                  <td className="text-right py-3 px-4 text-green-600 dark:text-green-400">
                                    {formatAmount(cat.value)}
                                  </td>
                                  <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                                    {percentage.toFixed(1)}%
                                  </td>
                                </tr>
                              );
                            })}
                          <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">
                              Tổng thu nhập
                            </td>
                            <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                              {incomeCount}
                            </td>
                            <td className="text-right py-3 px-4 text-green-600 dark:text-green-400">
                              {formatAmount(totalIncomeSummary)}
                            </td>
                            <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                              100%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* No data message */}
                {leafExpenseData.length === 0 &&
                  leafIncomeData.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Không có dữ liệu giao dịch
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

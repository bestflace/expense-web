import React, { useState } from "react";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { AuthScreen } from "./components/AuthScreen";
import { HomeScreen } from "./components/HomeScreen";
import { AddTransactionScreen } from "./components/AddTransactionScreen";
import { CategoriesScreen } from "./components/CategoriesScreen";
import { StatisticsScreen } from "./components/StatisticsScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { EditProfileScreen } from "./components/EditProfileScreen";
import { PrivacyPolicyScreen } from "./components/PrivacyPolicyScreen";
import { WalletsScreen } from "./components/WalletsScreen";
import { BottomNavigation } from "./components/BottomNavigation";
import { EditTransactionDialog } from "./components/EditTransactionDialog";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { BudgetSetupDialog } from "./components/BudgetSetupDialog";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export type Screen =
  | "onboarding"
  | "auth"
  | "home"
  | "add-transaction"
  | "categories"
  | "statistics"
  | "profile"
  | "edit-profile"
  | "privacy-policy"
  | "wallets";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
  description: string;
  walletId?: string;
};

export type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  parentCategoryId?: string;
};

export type Wallet = {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
  description?: string;
};

export type Budget = {
  id: string;
  monthlyLimit: number;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  warningThreshold: 70 | 80 | 90 | 100;
};

export type User = {
  fullName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  profilePicture?: string;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Ăn uống", type: "expense", icon: "🍽️", color: "#FF6B6B" },
    {
      id: "1-1",
      name: "Nhà hàng",
      type: "expense",
      icon: "🍴",
      color: "#FF8787",
      parentCategoryId: "1",
    },
    {
      id: "1-2",
      name: "Siêu thị",
      type: "expense",
      icon: "🛒",
      color: "#FFA07A",
      parentCategoryId: "1",
    },
    {
      id: "2",
      name: "Di chuyển",
      type: "expense",
      icon: "🚗",
      color: "#4ECDC4",
    },
    {
      id: "2-1",
      name: "Xăng xe",
      type: "expense",
      icon: "⛽",
      color: "#5FD3C9",
      parentCategoryId: "2",
    },
    {
      id: "2-2",
      name: "Giao thông công cộng",
      type: "expense",
      icon: "🚌",
      color: "#7FDAD5",
      parentCategoryId: "2",
    },
    { id: "3", name: "Mua sắm", type: "expense", icon: "🛍️", color: "#45B7D1" },
    { id: "4", name: "Lương", type: "income", icon: "💰", color: "#96CEB4" },
    {
      id: "4-1",
      name: "Lương chính",
      type: "income",
      icon: "💼",
      color: "#A7D8BF",
      parentCategoryId: "4",
    },
    {
      id: "4-2",
      name: "Thưởng",
      type: "income",
      icon: "🎁",
      color: "#B8E3CA",
      parentCategoryId: "4",
    },
    {
      id: "5",
      name: "Freelance",
      type: "income",
      icon: "💻",
      color: "#FFEAA7",
    },
  ]);

  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: "1",
      name: "Ví chính",
      balance: 5000000,
      icon: "💳",
      color: "#4ECDC4",
      description: "Tài khoản chi tiêu chính",
    },
    {
      id: "2",
      name: "Tiết kiệm",
      balance: 10000000,
      icon: "💰",
      color: "#96CEB4",
      description: "Quỹ dự phòng và tiết kiệm",
    },
    {
      id: "3",
      name: "Quỹ dự án",
      balance: 2500000,
      icon: "🏦",
      color: "#FFEAA7",
      description: "Quỹ cho dự án đặc biệt",
    },
  ]);

  const [budget, setBudget] = useState<Budget>({
    id: "1",
    monthlyLimit: 5000000,
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    warningThreshold: 80,
  });

  const [user, setUser] = useState<User>({
    fullName: "Người dùng",
    email: "user@example.com",
    phoneNumber: "+84 123 456 789",
    bio: "Quản lý tài chính cá nhân",
  });

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    if (transaction.walletId && transaction.type === "expense") {
      const wallet = wallets.find((w) => w.id === transaction.walletId);
      if (wallet && wallet.balance - transaction.amount < 0) {
        toast.error("Số dư ví không đủ", {
          description: `Giao dịch này sẽ làm số dư ví của bạn âm. Số dư hiện tại: ${wallet.balance.toLocaleString(
            "vi-VN"
          )}₫`,
        });
        return;
      }
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);

    if (transaction.walletId) {
      setWallets(
        wallets.map((w) => {
          if (w.id === transaction.walletId) {
            const newBalance =
              transaction.type === "income"
                ? w.balance + transaction.amount
                : w.balance - transaction.amount;
            return { ...w, balance: newBalance };
          }
          return w;
        })
      );
    }

    if (transaction.type === "expense" && budget.notificationsEnabled) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyExpenses =
        transactions
          .filter((t) => {
            const tDate = new Date(t.date);
            return (
              t.type === "expense" &&
              tDate.getMonth() === currentMonth &&
              tDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, t) => sum + t.amount, 0) + transaction.amount;

      const thresholdAmount =
        (budget.monthlyLimit * budget.warningThreshold) / 100;
      const budgetPercentage = (monthlyExpenses / budget.monthlyLimit) * 100;

      if (monthlyExpenses >= thresholdAmount) {
        const isOverBudget = monthlyExpenses > budget.monthlyLimit;
        const monthNameVi = [
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
        ][currentMonth];
        toast.error(
          isOverBudget
            ? "⚠️ Cảnh báo: Đã vượt ngân sách!"
            : "⚠️ Cảnh báo ngân sách!",
          {
            description: `${monthNameVi}: ${monthlyExpenses.toLocaleString(
              "vi-VN"
            )}₫ / ${budget.monthlyLimit.toLocaleString(
              "vi-VN"
            )}₫ (${budgetPercentage.toFixed(0)}%)`,
          }
        );
      }
    }

    toast.success("Thêm giao dịch thành công!");
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const oldTransaction = transactions.find((t) => t.id === id);
    if (!oldTransaction) return;

    const updatedTransaction = { ...oldTransaction, ...updates };

    if (updatedTransaction.walletId && updatedTransaction.type === "expense") {
      const wallet = wallets.find((w) => w.id === updatedTransaction.walletId);
      if (wallet) {
        let tempBalance = wallet.balance;

        if (oldTransaction.walletId === updatedTransaction.walletId) {
          tempBalance =
            oldTransaction.type === "income"
              ? tempBalance - oldTransaction.amount
              : tempBalance + oldTransaction.amount;
        }

        const finalBalance = tempBalance - updatedTransaction.amount;

        if (finalBalance < 0) {
          toast.error("Số dư ví không đủ", {
            description: `Cập nhật này sẽ làm số dư ví của bạn âm. Có sẵn: ${tempBalance.toLocaleString(
              "vi-VN"
            )}₫`,
          });
          return;
        }
      }
    }

    if (oldTransaction.walletId) {
      setWallets(
        wallets.map((w) => {
          if (w.id === oldTransaction.walletId) {
            const revertedBalance =
              oldTransaction.type === "income"
                ? w.balance - oldTransaction.amount
                : w.balance + oldTransaction.amount;
            return { ...w, balance: revertedBalance };
          }
          return w;
        })
      );
    }

    setTransactions(
      transactions.map((t) => (t.id === id ? updatedTransaction : t))
    );

    if (updatedTransaction.walletId) {
      setWallets(
        wallets.map((w) => {
          if (w.id === updatedTransaction.walletId) {
            const newBalance =
              updatedTransaction.type === "income"
                ? w.balance + updatedTransaction.amount
                : w.balance - updatedTransaction.amount;
            return { ...w, balance: newBalance };
          }
          return w;
        })
      );
    }

    toast.success("Cập nhật giao dịch thành công!");
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    if (transaction.walletId) {
      setWallets(
        wallets.map((w) => {
          if (w.id === transaction.walletId) {
            const revertedBalance =
              transaction.type === "income"
                ? w.balance - transaction.amount
                : w.balance + transaction.amount;
            return { ...w, balance: revertedBalance };
          }
          return w;
        })
      );
    }

    setTransactions(transactions.filter((t) => t.id !== id));
    toast.success("Xóa giao dịch thành công!");
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const isDuplicate = categories.some(
      (c) =>
        c.name.toLowerCase().trim() === category.name.toLowerCase().trim() &&
        c.type === category.type &&
        c.parentCategoryId === category.parentCategoryId
    );

    if (isDuplicate) {
      const categoryType =
        category.type === "expense" ? "chi tiêu" : "thu nhập";
      const categoryLevel = category.parentCategoryId
        ? "Danh mục con"
        : "Danh mục";
      toast.error("Không thể thêm danh mục", {
        description: `${categoryLevel} ${categoryType} với tên "${category.name}" đã tồn tại.`,
      });
      return;
    }

    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
    toast.success("Thêm danh mục thành công!");
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const currentCategory = categories.find((c) => c.id === id);
    if (!currentCategory) return;

    if (updates.name) {
      const updatedCategory = { ...currentCategory, ...updates };
      const isDuplicate = categories.some(
        (c) =>
          c.id !== id &&
          c.name.toLowerCase().trim() === updates.name!.toLowerCase().trim() &&
          c.type === updatedCategory.type &&
          c.parentCategoryId === updatedCategory.parentCategoryId
      );

      if (isDuplicate) {
        const categoryType =
          updatedCategory.type === "expense" ? "chi tiêu" : "thu nhập";
        const categoryLevel = updatedCategory.parentCategoryId
          ? "Danh mục con"
          : "Danh mục";
        toast.error("Không thể cập nhật danh mục", {
          description: `${categoryLevel} ${categoryType} với tên "${updates.name}" đã tồn tại.`,
        });
        return;
      }
    }

    setCategories(
      categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    toast.success("Cập nhật danh mục thành công!");
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find((c) => c.id === id);
    if (!categoryToDelete) return;

    const subcategoryIds = categories
      .filter((c) => c.parentCategoryId === id)
      .map((c) => c.id);

    const hasTransactions = transactions.some((t) => {
      if (!t.subcategory) {
        return t.category === categoryToDelete.name;
      }
      const subcategory = categories.find((c) => c.name === t.subcategory);
      return (
        subcategory &&
        (subcategory.id === id || subcategoryIds.includes(subcategory.id))
      );
    });

    if (hasTransactions) {
      toast.error("Không thể xóa danh mục", {
        description:
          "Danh mục này có giao dịch. Vui lòng xóa các giao dịch liên quan trước.",
      });
      return;
    }

    setCategories(
      categories.filter((c) => c.id !== id && c.parentCategoryId !== id)
    );
    toast.success("Xóa danh mục thành công!");
  };

  const addWallet = (wallet: Omit<Wallet, "id">) => {
    const isDuplicate = wallets.some(
      (w) => w.name.toLowerCase().trim() === wallet.name.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error("Không thể thêm ví", {
        description: `Ví với tên "${wallet.name}" đã tồn tại.`,
      });
      return;
    }

    if (wallet.balance < 0) {
      toast.error("Số dư ví không hợp lệ", {
        description: "Số dư ví không thể là số âm.",
      });
      return;
    }

    const newWallet: Wallet = {
      ...wallet,
      id: Date.now().toString(),
    };
    setWallets([...wallets, newWallet]);
    toast.success("Thêm ví thành công!");
  };

  const updateWallet = (id: string, updates: Partial<Wallet>) => {
    if (updates.name) {
      const isDuplicate = wallets.some(
        (w) =>
          w.id !== id &&
          w.name.toLowerCase().trim() === updates.name!.toLowerCase().trim()
      );

      if (isDuplicate) {
        toast.error("Không thể cập nhật ví", {
          description: `Ví với tên "${updates.name}" đã tồn tại.`,
        });
        return;
      }
    }

    if (updates.balance !== undefined && updates.balance < 0) {
      toast.error("Số dư ví không hợp lệ", {
        description: "Số dư ví không thể là số âm.",
      });
      return;
    }

    setWallets(wallets.map((w) => (w.id === id ? { ...w, ...updates } : w)));
    toast.success("Cập nhật ví thành công!");
  };

  const deleteWallet = (id: string) => {
    const walletToDelete = wallets.find((w) => w.id === id);
    if (!walletToDelete) return;

    const hasTransactions = transactions.some((t) => t.walletId === id);

    if (hasTransactions) {
      toast.error("Không thể xóa ví", {
        description:
          "Ví này có giao dịch. Vui lòng xóa các giao dịch liên quan trước.",
      });
      return;
    }

    setWallets(wallets.filter((w) => w.id !== id));
    toast.success("Xóa ví thành công!");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const renderScreen = () => {
    switch (currentScreen) {
      case "onboarding":
        return (
          <OnboardingScreen
            onComplete={() => {
              setHasSeenOnboarding(true);
              navigate("auth");
            }}
            language={language}
          />
        );
      case "auth":
        return (
          <AuthScreen
            mode={authMode}
            onModeChange={setAuthMode}
            onSuccess={() => navigate("home")}
          />
        );
      case "home":
        return (
          <HomeScreen
            balance={balance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            transactions={transactions}
            categories={categories}
            budget={budget}
            onAddTransaction={() => navigate("add-transaction")}
            onEditTransaction={(transaction) =>
              setEditingTransaction(transaction)
            }
            onNavigateToCategories={() => navigate("categories")}
          />
        );
      case "add-transaction":
        return (
          <AddTransactionScreen
            categories={categories}
            wallets={wallets}
            onAddTransaction={addTransaction}
            onBack={() => navigate("home")}
          />
        );
      case "categories":
        return (
          <CategoriesScreen
            categories={categories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
        );
      case "statistics":
        return (
          <StatisticsScreen
            transactions={transactions}
            categories={categories}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            balance={balance}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            user={user}
            isDarkMode={isDarkMode}
            language={language}
            budget={budget}
            onToggleDarkMode={setIsDarkMode}
            onToggleLanguage={setLanguage}
            onEditProfile={() => navigate("edit-profile")}
            onLogout={() => setShowLogoutConfirm(true)}
            onNavigateToPrivacy={() => navigate("privacy-policy")}
            onNavigateToWallets={() => navigate("wallets")}
            onUpdateBudget={setBudget}
          />
        );
      case "wallets":
        return (
          <WalletsScreen
            wallets={wallets}
            onAddWallet={addWallet}
            onUpdateWallet={updateWallet}
            onDeleteWallet={deleteWallet}
            onBack={() => navigate("profile")}
          />
        );
      case "edit-profile":
        return (
          <EditProfileScreen
            user={user}
            onUpdateUser={setUser}
            onBack={() => navigate("profile")}
          />
        );
      case "privacy-policy":
        return <PrivacyPolicyScreen onBack={() => navigate("profile")} />;
      default:
        return (
          <OnboardingScreen
            onComplete={() => {
              setHasSeenOnboarding(true);
              navigate("home");
            }}
            language={language}
          />
        );
    }
  };

  const showSidebar = ![
    "onboarding",
    "auth",
    "add-transaction",
    "edit-profile",
    "privacy-policy",
    "wallets",
  ].includes(currentScreen);

  const handleLogout = () => {
    navigate("onboarding");
    setShowLogoutConfirm(false);
    toast.success("Đã đăng xuất thành công!");
  };

  const handleBudgetSetupComplete = (
    monthlyLimit: number,
    warningThreshold: 70 | 80 | 90 | 100
  ) => {
    setBudget({
      ...budget,
      monthlyLimit,
      warningThreshold,
    });
    setShowBudgetSetup(false);
    navigate("home");
    toast.success("Chào mừng đến với ExpenseTracker!", {
      description: "Thiết lập ngân sách hoàn tất",
    });
  };

  return (
    <div className="h-screen bg-background flex">
      {showSidebar && (
        <BottomNavigation
          currentScreen={currentScreen}
          onNavigate={navigate}
          onLogout={() => setShowLogoutConfirm(true)}
        />
      )}
      <div className="flex-1 overflow-auto">{renderScreen()}</div>

      {/* Edit Transaction Dialog */}
      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          categories={categories}
          wallets={wallets}
          onUpdate={(updates) => {
            updateTransaction(editingTransaction.id, updates);
            setEditingTransaction(null);
          }}
          onDelete={() => {
            deleteTransaction(editingTransaction.id);
            setEditingTransaction(null);
          }}
          onClose={() => setEditingTransaction(null)}
        />
      )}

      {/* Logout Confirmation */}
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Xác nhận đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Đăng xuất"
      />

      {/* Budget Setup Dialog */}
      {showBudgetSetup && (
        <BudgetSetupDialog onComplete={handleBudgetSetupComplete} />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

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
import type { BackendUser } from "./utils/api";
import { CompleteProfileScreen } from "./components/CompleteProfileScreen";
import ChatbotWidget from "./components/ChatbotWidget";
// Import API
import { API_BASE_URL, STORAGE_KEYS } from "./config";
import {
  getWalletsApi,
  createWalletApi,
  updateWalletApi as updateWalletApiRequest,
  deleteWalletApi,
  getTransactionsApi,
  createTransactionApi,
  updateTransactionApi,
  deleteTransactionApi,
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  getSettingsApi,
  updateSettingsApi,
  getCurrentBudgetApi,
  updateCurrentBudgetApi,
  meApi,
} from "./utils/api";

export type Screen =
  | "onboarding"
  | "auth"
  | "complete-profile"
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
  categoryId?: string;
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
  id?: string;
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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loadingWallets, setLoadingWallets] = useState(false);

  const [budget, setBudget] = useState<Budget>({
    id: "1",
    monthlyLimit: 5000000,
    notificationsEnabled: true,
    emailNotificationsEnabled: true,
    warningThreshold: 80,
  });

  const [user, setUser] = useState<User>({
    id: undefined,
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
  });

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    // 1. Check âm ví như cũ
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

    // 2. Xác định category_id để gửi cho backend
    let cat = transaction.subcategory
      ? categories.find(
          (c) =>
            c.name === transaction.subcategory && c.parentCategoryId != null
        )
      : undefined;

    if (!cat) {
      // nếu không có subcategory, dùng danh mục chính
      cat = categories.find(
        (c) => c.name === transaction.category && !c.parentCategoryId
      );
    }

    if (!cat) {
      toast.error("Không tìm thấy danh mục phù hợp");
      return;
    }

    try {
      // 3. Gửi lên backend – KHÔNG gửi field 'type'
      const created = await createTransactionApi({
        category_id: cat.id,
        wallet_id: transaction.walletId!,
        amount: transaction.amount,
        description: transaction.description,
        tx_date: transaction.date,
      });

      // 4. Tạo object Transaction cho FE (dùng id từ backend)
      const newTransaction: Transaction = {
        id: String(created.transaction_id),
        type: transaction.type, // FE vẫn lưu type để dùng cho UI
        category: transaction.category,
        subcategory: transaction.subcategory,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        walletId: transaction.walletId,
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      // 5. Cập nhật ví local như cũ
      if (transaction.walletId) {
        setWallets((prev) =>
          prev.map((w) => {
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

      // 6. Cảnh báo ngân sách – chỉ hiện khi vừa vượt ngưỡng / vượt hạn mức
      if (transaction.type === "expense" && budget.notificationsEnabled) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyExpensesBefore = transactions
          .filter((t) => {
            const tDate = new Date(t.date);
            return (
              t.type === "expense" &&
              tDate.getMonth() === currentMonth &&
              tDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        const monthlyExpensesAfter =
          monthlyExpensesBefore + Number(transaction.amount || 0);

        const thresholdAmount =
          (budget.monthlyLimit * budget.warningThreshold) / 100;

        // chỉ khi từ dưới ngưỡng -> vượt ngưỡng
        const crossedThreshold =
          monthlyExpensesBefore < thresholdAmount &&
          monthlyExpensesAfter >= thresholdAmount;

        // chỉ khi từ chưa vượt limit -> vượt limit
        const crossedLimit =
          monthlyExpensesBefore <= budget.monthlyLimit &&
          monthlyExpensesAfter > budget.monthlyLimit;

        if (crossedThreshold || crossedLimit) {
          const isOverBudget = monthlyExpensesAfter > budget.monthlyLimit;
          const budgetPercentage =
            (monthlyExpensesAfter / budget.monthlyLimit) * 100;

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
              description: `${monthNameVi}: ${monthlyExpensesAfter.toLocaleString(
                "vi-VN"
              )}₫ / ${budget.monthlyLimit.toLocaleString(
                "vi-VN"
              )}₫ (${budgetPercentage.toFixed(0)}%)`,
            }
          );
        }
      }

      toast.success("Thêm giao dịch thành công!");
    } catch (err) {
      console.error("createTransactionApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể thêm giao dịch. Vui lòng thử lại."
      );
    }
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ) => {
    const oldTransaction = transactions.find((t) => t.id === id);
    if (!oldTransaction) return;

    const merged: Transaction = { ...oldTransaction, ...updates };

    // Check âm ví nếu là expense
    if (merged.walletId && merged.type === "expense") {
      const wallet = wallets.find((w) => w.id === merged.walletId);
      if (wallet) {
        let tempBalance = wallet.balance;

        // undo transaction cũ trên ví hiện tại
        if (oldTransaction.walletId === merged.walletId) {
          tempBalance =
            oldTransaction.type === "income"
              ? tempBalance - oldTransaction.amount
              : tempBalance + oldTransaction.amount;
        }

        const finalBalance = tempBalance - merged.amount;

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

    // tìm category id tương ứng tên (nếu user đổi category)
    const cat = categories.find((c) => c.name === merged.category);

    try {
      // Gửi đúng field backend
      await updateTransactionApi(id, {
        category_id: cat?.id, // nếu undefined thì COALESCE giữ nguyên category_id cũ
        wallet_id: merged.walletId,
        amount: merged.amount,
        description: merged.description,
        tx_date: merged.date,
      });

      // revert ví cũ nếu có
      if (oldTransaction.walletId) {
        setWallets((prev) =>
          prev.map((w) => {
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

      // cập nhật state giao dịch
      const finalTransaction: Transaction = {
        ...merged,
        type: cat?.type ?? merged.type,
        category: cat?.name ?? merged.category,
      };

      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? finalTransaction : t))
      );

      // apply transaction mới vào ví
      if (finalTransaction.walletId) {
        setWallets((prev) =>
          prev.map((w) => {
            if (w.id === finalTransaction.walletId) {
              const newBalance =
                finalTransaction.type === "income"
                  ? w.balance + finalTransaction.amount
                  : w.balance - finalTransaction.amount;
              return { ...w, balance: newBalance };
            }
            return w;
          })
        );
      }

      toast.success("Cập nhật giao dịch thành công!");
    } catch (err) {
      console.error("updateTransactionApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể cập nhật giao dịch. Vui lòng thử lại."
      );
    }
  };

  const deleteTransaction = async (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    try {
      await deleteTransactionApi(id);

      // revert balance ví nếu có
      if (transaction.walletId) {
        setWallets((prev) =>
          prev.map((w) => {
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

      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Xóa giao dịch thành công!");
    } catch (err) {
      console.error("deleteTransactionApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể xóa giao dịch. Vui lòng thử lại."
      );
    }
  };

  const addCategory = async (category: Omit<Category, "id">) => {
    // check trùng tên như cũ
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

    try {
      const created = await createCategoryApi({
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
        parentCategoryId: category.parentCategoryId,
      });

      setCategories((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.name,
          type: created.type,
          icon: created.icon,
          color: created.color,
          parentCategoryId: created.parentCategoryId,
        },
      ]);

      toast.success("Thêm danh mục thành công!");
    } catch (err) {
      console.error("createCategoryApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể thêm danh mục. Vui lòng thử lại."
      );
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
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

    try {
      const payload = {
        name: updates.name ?? currentCategory.name,
        type: updates.type ?? currentCategory.type,
        icon: updates.icon ?? currentCategory.icon,
        color: updates.color ?? currentCategory.color,
        parentCategoryId:
          updates.parentCategoryId ?? currentCategory.parentCategoryId,
      };

      const updated = await updateCategoryApi(id, payload);

      setCategories((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                name: updated.name,
                type: updated.type,
                icon: updated.icon,
                color: updated.color,
                parentCategoryId: updated.parentCategoryId,
              }
            : c
        )
      );

      toast.success("Cập nhật danh mục thành công!");
    } catch (err) {
      console.error("updateCategoryApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể cập nhật danh mục. Vui lòng thử lại."
      );
    }
  };

  const deleteCategory = async (id: string) => {
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

    try {
      await deleteCategoryApi(id);

      setCategories((prev) =>
        prev.filter((c) => c.id !== id && c.parentCategoryId !== id)
      );
      toast.success("Xóa danh mục thành công!");
    } catch (err) {
      console.error("deleteCategoryApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể xóa danh mục. Vui lòng thử lại."
      );
    }
  };

  const addWallet = async (wallet: Omit<Wallet, "id">) => {
    // Validate FE trước khi gọi API
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

    try {
      const created = await createWalletApi({
        name: wallet.name,
        balance: wallet.balance,
        icon: wallet.icon,
        color: wallet.color,
        description: wallet.description,
      });

      setWallets((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.name,
          balance: created.balance,
          icon: created.icon,
          color: created.color,
          description: created.description,
        },
      ]);

      toast.success("Thêm ví thành công!");
    } catch (err) {
      console.error("createWalletApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể thêm ví. Vui lòng thử lại."
      );
    }
  };

  const updateWallet = async (id: string, updates: Partial<Wallet>) => {
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

    try {
      const old = wallets.find((w) => w.id === id);
      if (!old) return;

      const payload = {
        name: updates.name ?? old.name,
        balance: updates.balance ?? old.balance,
        icon: updates.icon ?? old.icon,
        color: updates.color ?? old.color,
        description: updates.description ?? old.description,
      };

      const updated = await updateWalletApiRequest(id, payload);

      setWallets((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                name: updated.name,
                balance: updated.balance,
                icon: updated.icon,
                color: updated.color,
                description: updated.description,
              }
            : w
        )
      );

      toast.success("Cập nhật ví thành công!");
    } catch (err) {
      console.error("updateWalletApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể cập nhật ví. Vui lòng thử lại."
      );
    }
  };

  const deleteWallet = async (id: string) => {
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

    try {
      await deleteWalletApi(id);

      setWallets((prev) => prev.filter((w) => w.id !== id));
      toast.success("Xóa ví thành công!");
    } catch (err) {
      console.error("deleteWalletApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể xóa ví. Vui lòng thử lại."
      );
    }
  };

  // 🔹 Chỉ lấy giao dịch của THÁNG HIỆN TẠI
  const now = new Date();
  const currentMonth = now.getMonth(); // 0..11
  const currentYear = now.getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    if (Number.isNaN(d.getTime())) return false;

    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Thu nhập / chi tiêu THÁNG NÀY
  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // "Tổng số dư" = chênh lệch THU – CHI của THÁNG NÀY
  const balance = totalIncome - totalExpenses;

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);
  // Thêm
  //Auth
  // Auth – load user nếu có token
  React.useEffect(() => {
    // Ưu tiên sessionStorage, nếu không có thì dùng localStorage
    const savedToken =
      sessionStorage.getItem(STORAGE_KEYS.token) ||
      localStorage.getItem(STORAGE_KEYS.token);

    if (!savedToken) return;

    setAuthToken(savedToken);

    meApi()
      .then((res) => {
        const u = res.user;

        setUser((prev) => ({
          ...prev,
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          phoneNumber: u.phoneNumber || prev.phoneNumber,
          bio: u.bio || prev.bio,
          profilePicture: u.avatarUrl || prev.profilePicture,
        }));

        setHasSeenOnboarding(true);
        setCurrentScreen("home");
      })
      .catch((err) => {
        console.error("/auth/me error:", err);
        sessionStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.token);
        setAuthToken(null);
      });
  }, []);
  //Settings
  // 🟡 LOAD SETTINGS (darkMode, locale, timezone) KHI ĐÃ CÓ TOKEN
  React.useEffect(() => {
    if (!authToken) return;

    getSettingsApi()
      .then((settings) => {
        // dark mode
        if (settings.darkMode !== null && settings.darkMode !== undefined) {
          setIsDarkMode(settings.darkMode);
        }

        // locale -> language của FE
        if (settings.locale === "vi-VN") {
          setLanguage("vi");
        } else if (settings.locale === "en-US") {
          setLanguage("en");
        }
        // timezone nếu muốn dùng sau thì lưu thêm state khác
      })
      .catch((err) => {
        console.error("getSettingsApi error:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Không thể tải cài đặt người dùng"
        );
      });
  }, [authToken]);

  //wallet
  React.useEffect(() => {
    if (!authToken) {
      setWallets([]);
      return;
    }

    setLoadingWallets(true);
    getWalletsApi()
      .then((data) => {
        // data là WalletApi[], map qua type Wallet của FE (nếu giống nhau thì khỏi)
        setWallets(
          data.map((w) => ({
            id: w.id,
            name: w.name,
            balance: w.balance,
            icon: w.icon,
            color: w.color,
            description: w.description,
          }))
        );
      })
      .catch((err) => {
        console.error("getWalletsApi error:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách ví từ server"
        );
      })
      .finally(() => {
        setLoadingWallets(false);
      });
  }, [authToken]);
  // Transaction
  function toDateInputValue(raw?: string | null): string {
    if (!raw) return "";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  React.useEffect(() => {
    if (!authToken) {
      setTransactions([]);
      return;
    }

    getTransactionsApi()
      .then((data) => {
        setTransactions(
          data.map((t) => ({
            id: String(t.transaction_id),
            type: (t.category_type as "income" | "expense") ?? "expense",
            category: t.category_name ?? "",
            subcategory: undefined,
            amount: Number(t.amount),
            date: toDateInputValue(t.tx_date),
            description: t.description ?? "",
            walletId: t.wallet_id,
          }))
        );
      })

      .catch((err) => {
        console.error("getTransactionsApi error:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách giao dịch từ server"
        );
      });
  }, [authToken]);

  // Categories
  React.useEffect(() => {
    if (!authToken) {
      setCategories([]);
      return;
    }

    getCategoriesApi()
      .then((data) => {
        setCategories(
          data.map((c) => ({
            id: c.id,
            name: c.name,
            type: c.type,
            icon: c.icon,
            color: c.color,
            parentCategoryId: c.parentCategoryId,
          }))
        );
      })
      .catch((err) => {
        console.error("getCategoriesApi error:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách danh mục từ server"
        );
      });
  }, [authToken]);

  // Load budget khi có token
  React.useEffect(() => {
    if (!authToken) {
      // nếu logout có thể reset lại budget default hoặc giữ nguyên, tuỳ bạn
      return;
    }

    getCurrentBudgetApi()
      .then((data) => {
        if (!data) return; // chưa set ngân sách trên server, giữ default hiện tại

        setBudget((prev) => ({
          ...prev,
          id: data.id.toString(),
          monthlyLimit: data.limitAmount,
          warningThreshold: data.alertThreshold as 70 | 80 | 90 | 100,
          notificationsEnabled: data.notifyInApp,
          emailNotificationsEnabled: data.notifyEmail,
        }));
      })
      .catch((err) => {
        console.error("getCurrentBudgetApi error:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Không thể tải thông tin ngân sách tháng từ server"
        );
      });
  }, [authToken]);

  //Thêm
  const handleAuthSuccess = (params: {
    user: Partial<BackendUser>;
    token?: string;
    rememberMe: boolean;
    mode: "signin" | "signup";
  }) => {
    const { user, token, rememberMe, mode } = params;

    // 1. Lưu token trước (để meApi() dùng được)
    if (token) {
      setAuthToken(token);

      if (rememberMe) {
        // ghi nhớ lâu dài
        localStorage.setItem(STORAGE_KEYS.token, token);
        sessionStorage.removeItem(STORAGE_KEYS.token);
      } else {
        // chỉ nhớ trong 1 phiên browser
        sessionStorage.setItem(STORAGE_KEYS.token, token);
        localStorage.removeItem(STORAGE_KEYS.token);
      }
    }

    setHasSeenOnboarding(true);

    // 2. Gọi /auth/me để lấy full profile (kể cả phone, bio, avatar)
    meApi()
      .then((res) => {
        const u = res.user;

        setUser({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          phoneNumber: u.phoneNumber || "",
          bio: u.bio || "",
          profilePicture: u.avatarUrl || undefined,
        });
      })
      .catch((err) => {
        console.error("meApi after login error:", err);

        // fallback: ít nhất giữ lại thông tin cơ bản từ login
        setUser((prev) => ({
          ...prev,
          id: user.id ?? prev.id,
          fullName: user.fullName ?? prev.fullName,
          email: user.email ?? prev.email,
        }));
      });

    // 3. Điều hướng
    if (mode === "signup") {
      setCurrentScreen("complete-profile");
    } else {
      setCurrentScreen("home");
    }
  };

  //Dark mode & Language

  const handleChangeDarkMode = (value: boolean) => {
    setIsDarkMode(value);

    // update lên backend (không cần await)
    updateSettingsApi({ darkMode: value }).catch((err) => {
      console.error("updateSettingsApi darkMode error:", err);
    });
  };

  const handleChangeLanguage = (lang: "vi" | "en") => {
    setLanguage(lang);

    const locale = lang === "en" ? "en-US" : "vi-VN";

    updateSettingsApi({ locale }).catch((err) => {
      console.error("updateSettingsApi locale error:", err);
    });
  };

  //Hết thêm
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
            // 🆕 nhận user + token từ backend
            onAuthSuccess={handleAuthSuccess}
          />
        );

      case "complete-profile":
        return (
          <CompleteProfileScreen
            user={user}
            onComplete={(updated) => {
              setUser(updated);
              setShowBudgetSetup(true); // mở dialog thiết lập ngân sách tháng
              setCurrentScreen("home");
            }}
            onSkip={() => {
              setShowBudgetSetup(true);
              setCurrentScreen("home");
            }}
          />
        );

      case "home":
        return (
          <HomeScreen
            user={user} // 👈 truyền user vào để "Xin chào, {user.fullName}"
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
            // ⚠️ NÊN dùng handler có gọi API:
            onToggleDarkMode={handleChangeDarkMode}
            onToggleLanguage={handleChangeLanguage}
            onEditProfile={() => navigate("edit-profile")}
            onLogout={() => setShowLogoutConfirm(true)}
            onNavigateToPrivacy={() => navigate("privacy-policy")}
            onNavigateToWallets={() => navigate("wallets")}
            onUpdateBudget={async (newBudget) => {
              try {
                const updated = await updateCurrentBudgetApi({
                  limitAmount: newBudget.monthlyLimit,
                  alertThreshold: newBudget.warningThreshold,
                  notifyInApp: newBudget.notificationsEnabled,
                  notifyEmail: newBudget.emailNotificationsEnabled,
                });

                setBudget({
                  id: updated.id.toString(),
                  monthlyLimit: updated.limitAmount,
                  warningThreshold: updated.alertThreshold as
                    | 70
                    | 80
                    | 90
                    | 100,
                  notificationsEnabled: updated.notifyInApp,
                  emailNotificationsEnabled: updated.notifyEmail,
                });

                toast.success("Cập nhật ngân sách thành công!");
              } catch (err) {
                console.error("updateCurrentBudgetApi (profile) error:", err);
                toast.error(
                  err instanceof Error
                    ? err.message
                    : "Không thể cập nhật ngân sách. Vui lòng thử lại."
                );
              }
            }}
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
              navigate("auth");
            }}
            language={language}
          />
        );
    }
  };

  const showSidebar = ![
    "onboarding",
    "auth",
    "complete-profile",
    "add-transaction",
    "edit-profile",
    "privacy-policy",
    "wallets",
  ].includes(currentScreen);

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    sessionStorage.removeItem(STORAGE_KEYS.token);

    setUser({
      id: undefined,
      fullName: "",
      email: "",
      phoneNumber: "",
      bio: "",
      profilePicture: undefined,
    });

    navigate("onboarding");
    setShowLogoutConfirm(false);
    toast.success("Đã đăng xuất thành công!");
  };

  const handleBudgetSetupComplete = async (
    monthlyLimit: number,
    warningThreshold: 70 | 80 | 90 | 100
  ) => {
    try {
      const updated = await updateCurrentBudgetApi({
        limitAmount: monthlyLimit,
        alertThreshold: warningThreshold,
        notifyInApp: true,
        notifyEmail: true,
      });

      setBudget((prev) => ({
        ...prev,
        id: updated.id.toString(),
        monthlyLimit: updated.limitAmount,
        warningThreshold: updated.alertThreshold as 70 | 80 | 90 | 100,
        notificationsEnabled: updated.notifyInApp,
        emailNotificationsEnabled: updated.notifyEmail,
      }));

      setShowBudgetSetup(false);
      navigate("home");
      toast.success("Chào mừng đến với ExpenseTracker!", {
        description: "Thiết lập ngân sách hoàn tất",
      });
    } catch (err) {
      console.error("updateCurrentBudgetApi (setup) error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể lưu ngân sách tháng. Vui lòng thử lại."
      );
    }
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
      <ChatbotWidget />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  FolderOpen,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import type { User, Transaction, Category, Budget } from "../App";
import { motion, AnimatePresence } from "motion/react";
import {
  getDeletedTransactionsApi,
  restoreTransactionApi,
  forceDeleteTransactionApi,
} from "../utils/api";

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
  onRefreshData?: () => void;
}
type TrashTransaction = {
  transaction_id: string;
  category_id: string;
  wallet_id: string;
  amount: number;
  description: string | null;
  tx_date: string;
  deleted_at: string;
  category_name: string;
  category_type: "income" | "expense";
  wallet_name: string;
};

interface TrashModalProps {
  open: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

const TrashModal: React.FC<TrashModalProps> = ({
  open,
  onClose,
  onRefreshData,
}) => {
  const [items, setItems] = useState<TrashTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [pendingAction, setPendingAction] = useState<null | {
    type: "restore" | "delete";
    txs: TrashTransaction[];
  }>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const formatTrashAmount = (amount: number) =>
    Number(amount).toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  // Load giỏ rác mỗi lần mở modal
  useEffect(() => {
    if (!open) return;

    setSelectedIds([]);
    setPendingAction(null);
    setLoading(true);

    getDeletedTransactionsApi()
      .then((data) => setItems(data))
      .catch((err) => console.error("Lỗi load giỏ rác:", err))
      .finally(() => setLoading(false));
  }, [open]);

  // ====== chọn nhiều ======
  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.length === items.length ? [] : items.map((t) => t.transaction_id)
    );
  };

  const hasSelection = selectedIds.length > 0;
  const allSelected = items.length > 0 && selectedIds.length === items.length;

  // ====== mở modal xác nhận ======
  const askRestore = (tx: TrashTransaction) =>
    setPendingAction({ type: "restore", txs: [tx] });

  const askDelete = (tx: TrashTransaction) =>
    setPendingAction({ type: "delete", txs: [tx] });

  const askRestoreSelected = () => {
    const txs = items.filter((t) => selectedIds.includes(t.transaction_id));
    if (!txs.length) return;
    setPendingAction({ type: "restore", txs });
  };

  const askDeleteSelected = () => {
    const txs = items.filter((t) => selectedIds.includes(t.transaction_id));
    if (!txs.length) return;
    setPendingAction({ type: "delete", txs });
  };

  // ====== xử lý confirm / cancel ======
  const handleCancelAction = () => {
    if (actionLoading) return;
    setPendingAction(null);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    setActionLoading(true);

    const { type, txs } = pendingAction;
    const ids = txs.map((tx) => tx.transaction_id);

    const api =
      type === "restore" ? restoreTransactionApi : forceDeleteTransactionApi;

    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            await api(id);
            return { id, ok: true as const };
          } catch (error: any) {
            return { id, ok: false as const, error };
          }
        })
      );

      const successIds = results.filter((r) => r.ok).map((r) => r.id);
      const failed = results.filter((r) => !r.ok);

      if (successIds.length) {
        // xoá khỏi list + bỏ chọn
        setItems((prev) =>
          prev.filter((t) => !successIds.includes(t.transaction_id))
        );
        setSelectedIds((prev) => prev.filter((id) => !successIds.includes(id)));

        onRefreshData?.();

        toast.success(
          type === "restore"
            ? `Khôi phục ${successIds.length} giao dịch thành công`
            : `Xóa ${successIds.length} giao dịch thành công`
        );
      }

      if (failed.length) {
        const firstError: any = (failed[0] as any).error;
        const message =
          firstError?.response?.data?.message ||
          "Một số giao dịch không xử lý được. Vui lòng kiểm tra lại số dư ví hoặc thử lại sau.";
        toast.error(message);
      }

      setPendingAction(null);
    } finally {
      setActionLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* 🗑 MODAL CHÍNH */}
      <Dialog
        open={open}
        onOpenChange={(isOpen: boolean) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent
          className="
            sm:max-w-6xl w-[96vw] max-h-[90vh]
            mx-auto flex flex-col
            bg-card text-foreground
            border border-slate-800
            shadow-2xl
          "
        >
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 text-base shadow-sm">
                ♻️
              </span>
              <span>Giỏ rác giao dịch</span>
            </DialogTitle>
            <DialogDescription>
              Khôi phục hoặc xoá vĩnh viễn các giao dịch đã xoá mềm.
            </DialogDescription>
          </DialogHeader>

          {hasSelection && (
            <div className="mb-3 flex items-center justify-between text-xs sm:text-sm text-slate-300">
              <span>Đã chọn {selectedIds.length} giao dịch</span>
              <div className="space-x-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full border-emerald-500/60 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={askRestoreSelected}
                  disabled={loading}
                >
                  Khôi phục tất cả ({selectedIds.length})
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full border-rose-500/60 text-rose-400 hover:bg-rose-500/10"
                  onClick={askDeleteSelected}
                  disabled={loading}
                >
                  Xóa tất cả({selectedIds.length})
                </Button>
              </div>
            </div>
          )}

          <div className="mt-2 overflow-y-auto bf-chat-scroll pr-1">
            {loading && (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            )}

            {!loading && items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Không có giao dịch nào trong giỏ rác.
              </p>
            )}

            {!loading && items.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-slate-700/70">
                <table
                  className="w-full text-[13px] bg-background"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead className="sticky top-0 z-[1] bg-slate-900/95 backdrop-blur">
                    <tr className="border-b border-slate-700">
                      {/* checkbox chọn tất cả */}
                      <th className="py-3 px-3 text-center bg-slate-900">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-emerald-500"
                          checked={allSelected}
                          onChange={toggleAll}
                        />
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-slate-300 bg-slate-900">
                        Ngày
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-slate-300 bg-slate-900">
                        Mô tả
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-slate-300 bg-slate-900">
                        Danh mục
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-slate-300 bg-slate-900">
                        Ví
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-slate-300 bg-slate-900">
                        Số tiền
                      </th>
                      <th className="py-3 px-4 text-left font-medium text-slate-300 bg-slate-900">
                        Đã xoá lúc
                      </th>
                      <th className="py-3 px-4 text-center font-medium text-slate-300 bg-slate-900">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((tx, idx) => (
                      <tr
                        key={tx.transaction_id}
                        className={`
                          border-t border-slate-800/90
                          ${idx % 2 === 1 ? "bg-slate-900/40" : "bg-background"}
                          hover:bg-slate-800/70 transition-colors
                        `}
                      >
                        {/* checkbox từng dòng */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-emerald-500"
                            checked={selectedIds.includes(tx.transaction_id)}
                            onChange={() => toggleOne(tx.transaction_id)}
                          />
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap text-slate-100">
                          {new Date(tx.tx_date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-3 px-4 max-w-[260px] truncate text-slate-100">
                          {tx.description || "(Không có mô tả)"}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-100">
                          {tx.category_name}{" "}
                          <span className="text-xs text-slate-400">
                            ({tx.category_type})
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-100">
                          {tx.wallet_name}
                        </td>
                        <td
                          className={`py-3 px-4 text-right whitespace-nowrap ${
                            tx.category_type === "income"
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {tx.category_type === "income" ? "+" : "-"}
                          {formatTrashAmount(Math.abs(tx.amount))}₫
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-400">
                          {new Date(tx.deleted_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => askRestore(tx)}
                            style={{
                              backgroundColor: "#16a34a",
                              color: "#ffffff",
                              borderRadius: 9999,
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 500,
                              border: "1px solid #16a34a",
                              marginRight: 8,
                            }}
                            className="inline-flex items-center justify-center shadow-sm hover:brightness-110 active:scale-95 transition"
                          >
                            Khôi phục
                          </button>
                          <button
                            type="button"
                            onClick={() => askDelete(tx)}
                            style={{
                              backgroundColor: "#fef2f2",
                              color: "#b91c1c",
                              borderRadius: 9999,
                              padding: "6px 14px",
                              fontSize: "12px",
                              fontWeight: 500,
                              border: "1px solid #fecaca",
                            }}
                            className="inline-flex items-center justify-center hover:brightness-105 active:scale-95 transition"
                          >
                            Xóa vĩnh viễn
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ MODAL XÁC NHẬN */}
      <Dialog
        open={!!pendingAction}
        onOpenChange={(isOpen: boolean) => {
          if (!isOpen && !actionLoading) setPendingAction(null);
        }}
      >
        <DialogContent
          className="
            sm:max-w-md w-[90vw] max-h-[90vh]
            mx-auto flex flex-col
            bg-card text-foreground
            border border-slate-800
            shadow-2xl
          "
        >
          {pendingAction && (
            <>
              <DialogHeader className="shrink-0 text-center space-y-1">
                <DialogTitle className="text-lg font-semibold">
                  {pendingAction.type === "delete"
                    ? pendingAction.txs.length > 1
                      ? "Xóa vĩnh viễn các giao dịch"
                      : "Xóa vĩnh viễn giao dịch"
                    : pendingAction.txs.length > 1
                    ? "Khôi phục các giao dịch"
                    : "Khôi phục giao dịch"}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {pendingAction.type === "delete"
                    ? "Giao dịch sẽ bị xóa vĩnh viễn và không thể khôi phục."
                    : "Giao dịch sẽ được khôi phục lại vào danh sách giao dịch của bạn."}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 overflow-y-auto bf-chat-scroll pr-1 text-center">
                {pendingAction.txs.length === 1 ? (
                  (() => {
                    const tx = pendingAction.txs[0];
                    return (
                      <>
                        <p className="font-medium text-foreground text-sm">
                          {tx.description || "(Không có mô tả)"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(tx.category_type === "income" ? "+" : "-") +
                            formatTrashAmount(Math.abs(tx.amount))}
                          ₫{" • "}
                          {new Date(tx.tx_date).toLocaleDateString("vi-VN")}
                        </p>
                      </>
                    );
                  })()
                ) : (
                  <>
                    <p className="font-medium text-foreground text-sm">
                      {pendingAction.txs.length} giao dịch được chọn
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ví dụ:{" "}
                      <span className="font-medium">
                        {pendingAction.txs[0].description || "(Không có mô tả)"}
                      </span>{" "}
                      và các giao dịch khác.
                    </p>
                  </>
                )}
              </div>

              <div className="flex space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelAction}
                  disabled={actionLoading}
                  className="flex-1 rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmAction}
                  className="flex-1 
                    bg-gradient-to-br from-primary to-primary/80 
                    text-primary-foreground 
                    rounded-xl shadow-lg 
                    hover:opacity-90 transition-colors"
                >
                  {actionLoading ? "Đang xử lý..." : "Xác nhận"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

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
  onRefreshData,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTrashOpen, setIsTrashOpen] = useState(false);
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
  // pct + status (đặt ở đầu component, trước return)
  const usedPctRaw =
    budget.monthlyLimit > 0 ? (monthlyExpenses / budget.monthlyLimit) * 100 : 0;

  const usedPct = Math.min(100, Math.max(0, usedPctRaw)); // để vẽ thanh
  const thresholdPct = Math.min(100, Math.max(0, budget.warningThreshold)); // để vẽ mốc

  const status =
    budget.monthlyLimit <= 0
      ? "ok"
      : usedPctRaw >= 100
      ? "danger"
      : usedPctRaw >= budget.warningThreshold && budget.warningThreshold < 100
      ? "warn"
      : "ok";

  const statusText =
    status === "danger" ? "Vượt" : status === "warn" ? "Sắp chạm" : "Ổn";
  return (
    <div className="h-full bg-background text-foreground">
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
                <span
                  className="text-3xl font-semibold"
                  style={{ color: "#29c09fff" }}
                >
                  {user.fullName || "bạn"}
                </span>
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
        {/* Budget Progress Card - đặt ngay trên thanh tìm kiếm */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-4"
        >
          {/* Budget progress card (Card-based) */}
          <Card className="bf-budget-card mb-4 border-0">
            <CardHeader className="p-0">
              <div className="bf-budget-top">
                <div>
                  <div className="bf-budget-kicker">
                    Tiến trình ngân sách tháng
                  </div>

                  <div className="bf-budget-title">
                    {budget.monthlyLimit > 0
                      ? `Đã dùng ${usedPct.toFixed(0)}%`
                      : "Chưa đặt ngân sách"}
                  </div>

                  {budget.monthlyLimit > 0 && (
                    <div className="bf-budget-sub">
                      Cảnh báo khi đạt {budget.warningThreshold}%
                    </div>
                  )}
                </div>

                {budget.monthlyLimit > 0 && (
                  <div className={`bf-budget-badge ${status}`}>
                    {statusText}
                  </div>
                )}
              </div>
            </CardHeader>

            {budget.monthlyLimit > 0 && (
              <CardContent className="p-0">
                <div className="bf-budget-bar relative">
                  {/* thanh đã dùng */}
                  <span className={status} style={{ width: `${usedPct}%` }} />

                  {/* mốc cảnh báo */}
                  <div
                    className="bf-budget-mark"
                    style={{ left: `${thresholdPct}%` }}
                  >
                    <span className="bf-budget-mark-line" />
                    <span
                      className="bf-budget-mark-dot"
                      title={`Mốc ${thresholdPct}%`}
                    />
                  </div>
                </div>

                <div className="bf-budget-metrics">
                  <div>
                    <div className="label">Đã chi</div>
                    <div className="value">
                      {monthlyExpenses.toLocaleString("vi-VN")}₫
                    </div>
                  </div>

                  <div className="right">
                    <div className="label">Còn lại</div>
                    <div className="value">
                      {Math.max(
                        0,
                        budget.monthlyLimit - monthlyExpenses
                      ).toLocaleString("vi-VN")}
                      ₫
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
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
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {filteredTransactions.length} giao dịch
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setIsTrashOpen(true)}
                    >
                      <Trash2 className="w-4 h-4" />
                      {/* <span>Giỏ rác</span> */}
                    </Button>
                  </div>
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
                          className="text-green-600 dark:text-green-400"
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
                          className="
  tx-item
  flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all
  shadow-sm hover:shadow-md
  border border-gray-200/70 dark:border-gray-700/50
"
                          onClick={() => onEditTransaction(transaction)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.06, y: -1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 18,
                            }}
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
      <TrashModal
        open={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        onRefreshData={onRefreshData}
      />
    </div>
  );
}

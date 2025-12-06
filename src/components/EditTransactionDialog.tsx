import React, { useState, useEffect, useMemo } from "react";
import { X, Trash2, Save } from "lucide-react";
import { Transaction, Category } from "../App";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Chuẩn hóa mọi kiểu string ngày (ISO, v.v.) thành "YYYY-MM-DD" cho <input type="date">
function toDateInputValue(raw?: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type EditTransactionDialogProps = {
  transaction: Transaction;
  categories: Category[];
  wallets: { id: string; name: string }[];
  onUpdate: (updates: Partial<Transaction>) => void;
  onDelete: () => void;
  onClose: () => void;
};

export function EditTransactionDialog({
  transaction,
  categories,
  wallets,
  onUpdate,
  onDelete,
  onClose,
}: EditTransactionDialogProps) {
  const [type, setType] = useState<"income" | "expense">(transaction.type);
  const [category, setCategory] = useState<string>(transaction.category || "");
  const [subcategory, setSubcategory] = useState<string>(
    transaction.subcategory || ""
  );
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [description, setDescription] = useState<string>(
    transaction.description || ""
  );
  const [walletId, setWalletId] = useState<string>(transaction.walletId || "");
  const [date, setDate] = useState<string>(() =>
    toDateInputValue(transaction.date)
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  // 🔁 Mỗi khi transaction/cates thay đổi → sync lại state
  useEffect(() => {
    if (!transaction) return;

    let catName = transaction.category || "";
    let subName = transaction.subcategory || "";

    // Nếu dữ liệu cũ chỉ lưu tên "danh mục con" ở transaction.category
    // thì đổi thành: category = parent, subcategory = child
    const catObj = categories.find((c) => c.name === catName);
    if (catObj && catObj.parentCategoryId && !subName) {
      const parent = categories.find((c) => c.id === catObj.parentCategoryId);
      if (parent) {
        catName = parent.name;
        subName = catObj.name;
      }
    }

    setType(transaction.type);
    setCategory(catName);
    setSubcategory(subName);
    setAmount(transaction.amount.toString());
    setDescription(transaction.description || "");
    setWalletId(transaction.walletId || "");
    setDate(toDateInputValue(transaction.date));
  }, [transaction, categories]);

  // Danh mục cha theo loại hiện tại
  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === type && !c.parentCategoryId),
    [categories, type]
  );

  // Danh mục cha đang chọn
  const selectedCategoryObj = useMemo(
    () => filteredCategories.find((c) => c.name === category),
    [filteredCategories, category]
  );

  // Danh mục con của danh mục cha đang chọn
  const subcategories = useMemo(
    () =>
      selectedCategoryObj
        ? categories.filter(
            (c) => c.parentCategoryId === selectedCategoryObj.id
          )
        : [],
    [categories, selectedCategoryObj]
  );

  const handleUpdate = () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0 || Number.isNaN(parsedAmount)) {
      return;
    }
    setShowUpdateConfirm(true);
  };

  const confirmUpdate = () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0 || Number.isNaN(parsedAmount)) {
      return;
    }

    // 🧠 Tìm categoryId chính xác để gửi lên backend
    const parentCat = categories.find(
      (c) => c.type === type && !c.parentCategoryId && c.name === category
    );

    let chosenCat = parentCat;

    if (subcategory && parentCat) {
      const subCat = categories.find(
        (c) => c.name === subcategory && c.parentCategoryId === parentCat.id
      );
      if (subCat) {
        chosenCat = subCat;
      }
    }

    onUpdate({
      type,
      category: category || "",
      subcategory: subcategory || undefined,
      categoryId: chosenCat?.id, // 👈 gửi thêm id để App.updateTransaction dùng
      amount: parsedAmount,
      date,
      description,
      walletId: walletId || undefined,
    });

    setShowUpdateConfirm(false);
    onClose();
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-foreground">Chỉnh sửa giao dịch</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-foreground mb-2 font-medium">
                Loại giao dịch
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setType("income");
                    setCategory("");
                    setSubcategory("");
                  }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    type === "income"
                      ? "border-primary bg-primary/10 dark:bg-primary/20"
                      : "border-white border-opacity-30 dark:border-white dark:border-opacity-30 bg-background/30 hover:bg-background/50"
                  }`}
                >
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-foreground">Thu nhập</div>
                </button>
                <button
                  onClick={() => {
                    setType("expense");
                    setCategory("");
                    setSubcategory("");
                  }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    type === "expense"
                      ? "border-primary bg-primary/10 dark:bg-primary/20"
                      : "border-white border-opacity-30 dark:border-white dark:border-opacity-30 bg-background/30 hover:bg-background/50"
                  }`}
                >
                  <div className="text-2xl mb-2">💸</div>
                  <div className="text-foreground">Chi tiêu</div>
                </button>
              </div>
            </div>

            {/* Category Selection */}
            {/* Category Selection */}
            <div>
              <label className="block text-foreground mb-2 font-medium">
                Danh mục
              </label>

              <Select
                value={category || "none"}
                onValueChange={(val) => {
                  setCategory(val === "none" ? "" : val);
                  setSubcategory("");
                }}
              >
                <SelectTrigger className="w-full h-12 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary/60">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>

                <SelectContent className="bg-card border border-slate-700/60 text-foreground">
                  <SelectItem value="none">Chọn danh mục</SelectItem>

                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Selection */}
            {subcategories.length > 0 && (
              <div>
                <label className="block text-foreground mb-2 font-medium">
                  Danh mục con
                </label>

                <Select
                  value={subcategory || "none"}
                  onValueChange={(val) =>
                    setSubcategory(val === "none" ? "" : val)
                  }
                >
                  <SelectTrigger className="w-full h-12 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary/60">
                    <SelectValue placeholder="Không có danh mục con" />
                  </SelectTrigger>

                  <SelectContent className="bg-card border border-slate-700/60 text-foreground">
                    <SelectItem value="none">Không có danh mục con</SelectItem>

                    {subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.name}>
                        {sub.icon} {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Wallet Selection */}
            {wallets.length > 0 && (
              <div>
                <label className="block text-foreground mb-2 font-medium">
                  Ví
                </label>

                <Select
                  value={walletId || "none"}
                  onValueChange={(val) =>
                    setWalletId(val === "none" ? "" : val)
                  }
                >
                  <SelectTrigger className="w-full h-12 rounded-lg bg-background border border-border text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary/60">
                    <SelectValue placeholder="Chọn ví" />
                  </SelectTrigger>

                  <SelectContent className="bg-card border border-slate-700/60 text-foreground">
                    <SelectItem value="none">Chọn ví</SelectItem>

                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        {wallet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-foreground mb-2 font-medium">
                Số tiền (₫)
              </label>
              <input
                type="number"
                step="1000"
                min="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full h-12 rounded-lg border border-input bg-input-background px-3 py-2 text-sm text-foreground 
           dark:bg-input/30 dark:hover:bg-input/50 
           focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 
           outline-none transition"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-foreground mb-2 font-medium">
                Ngày
              </label>
              <input
                type="date"
                value={date || ""}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-12 rounded-lg border border-input bg-input-background px-3 py-2 text-sm text-foreground 
           dark:bg-input/30 dark:hover:bg-input/50 
           focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 
           outline-none transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-foreground mb-2 font-medium">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả..."
                rows={3}
                className="w-full min-h-[96px] rounded-lg border border-input bg-input-background px-3 py-2 text-sm text-foreground resize-none
           dark:bg-input/30 dark:hover:bg-input/50
           focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
           outline-none transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Lưu thay đổi
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-6 p-3 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showUpdateConfirm}
        title="Xác nhận cập nhật"
        description="Bạn có chắc chắn muốn cập nhật giao dịch này?"
        onConfirm={confirmUpdate}
        onCancel={() => setShowUpdateConfirm(false)}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Xóa"
        variant="destructive"
      />
    </>
  );
}

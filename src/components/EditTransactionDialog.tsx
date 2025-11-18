import React, { useState } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { Transaction, Category } from '../App';
import { ConfirmDialog } from './ConfirmDialog';

type EditTransactionDialogProps = {
  transaction: Transaction;
  categories: Category[];
  wallets: { id: string; name: string; }[];
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
  onClose
}: EditTransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const [subcategory, setSubcategory] = useState(transaction.subcategory || '');
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [date, setDate] = useState(transaction.date);
  const [description, setDescription] = useState(transaction.description);
  const [walletId, setWalletId] = useState(transaction.walletId || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  const filteredCategories = categories.filter(c => c.type === type && !c.parentCategoryId);
  
  const selectedCategoryObj = categories.find(c => c.name === category);
  const subcategories = selectedCategoryObj 
    ? categories.filter(c => c.parentCategoryId === selectedCategoryObj.id)
    : [];

  const handleUpdate = () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0 || isNaN(parsedAmount)) {
      return;
    }
    setShowUpdateConfirm(true);
  };

  const confirmUpdate = () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount <= 0) {
      return;
    }

    onUpdate({
      type,
      category,
      subcategory: subcategory || undefined,
      amount: parsedAmount,
      date,
      description,
      walletId: walletId || undefined
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
        <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-foreground">Chỉnh sửa giao dịch</h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-muted-foreground mb-2">Loại giao dịch</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setType('income');
                    setCategory('');
                    setSubcategory('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    type === 'income'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-border hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-foreground">Thu nhập</div>
                </button>
                <button
                  onClick={() => {
                    setType('expense');
                    setCategory('');
                    setSubcategory('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    type === 'expense'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-border hover:border-red-300'
                  }`}
                >
                  <div className="text-2xl mb-2">💸</div>
                  <div className="text-foreground">Chi tiêu</div>
                </button>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-muted-foreground mb-2">Danh mục</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory('');
                }}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">Chọn danh mục</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selection */}
            {subcategories.length > 0 && (
              <div>
                <label className="block text-muted-foreground mb-2">Danh mục con</label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Không có danh mục con</option>
                  {subcategories.map(sub => (
                    <option key={sub.id} value={sub.name}>
                      {sub.icon} {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Wallet Selection */}
            {wallets.length > 0 && (
              <div>
                <label className="block text-muted-foreground mb-2">Ví</label>
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Chọn ví</option>
                  {wallets.map(wallet => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-muted-foreground mb-2">Số tiền (₫)</label>
              <input
                type="number"
                step="1000"
                min="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-muted-foreground mb-2">Ngày</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-muted-foreground mb-2">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả..."
                rows={3}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none"
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

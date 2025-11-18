import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Wallet, ArrowLeft, Search } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { Input } from './ui/input';

export type Wallet = {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
  description?: string;
};

type WalletsScreenProps = {
  wallets: Wallet[];
  onAddWallet: (wallet: Omit<Wallet, 'id'>) => void;
  onUpdateWallet: (id: string, updates: Partial<Wallet>) => void;
  onDeleteWallet: (id: string) => void;
  onBack: () => void;
};

export function WalletsScreen({
  wallets,
  onAddWallet,
  onUpdateWallet,
  onDeleteWallet,
  onBack
}: WalletsScreenProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState<{
    type: 'add' | 'update' | 'delete';
    walletId?: string;
    data?: any;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    balance: '0',
    icon: '💳',
    color: '#4ECDC4',
    description: ''
  });

  const availableIcons = ['💳', '💰', '🏦', '💵', '💴', '💶', '💷', '🪙', '💸', '🏧'];
  const availableColors = ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const walletData = {
      name: formData.name,
      balance: parseFloat(formData.balance),
      icon: formData.icon,
      color: formData.color,
      description: formData.description
    };

    if (editingWallet) {
      setConfirmAction({ type: 'update', walletId: editingWallet.id, data: walletData });
    } else {
      setConfirmAction({ type: 'add', data: walletData });
    }
  };

  const handleConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'add') {
      onAddWallet(confirmAction.data);
      resetForm();
    } else if (confirmAction.type === 'update' && confirmAction.walletId) {
      onUpdateWallet(confirmAction.walletId, confirmAction.data);
      resetForm();
    } else if (confirmAction.type === 'delete' && confirmAction.walletId) {
      onDeleteWallet(confirmAction.walletId);
    }

    setConfirmAction(null);
  };

  const resetForm = () => {
    setFormData({ name: '', balance: '0', icon: '💳', color: '#4ECDC4', description: '' });
    setShowAddDialog(false);
    setEditingWallet(null);
  };

  const startEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      balance: wallet.balance.toString(),
      icon: wallet.icon,
      color: wallet.color,
      description: wallet.description || ''
    });
    setShowAddDialog(true);
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  // Filter wallets based on search query
  const filteredWallets = wallets.filter(wallet =>
    wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (wallet.description && wallet.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-foreground mb-2">Quản lý ví</h1>
              <p className="text-muted-foreground">Quản lý các ví và nguồn tiền của bạn</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm ví
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-6 h-6" />
            <p className="opacity-90">Tổng số dư</p>
          </div>
          <h2 className="text-white">{totalBalance.toLocaleString('vi-VN')}₫</h2>
          <p className="opacity-80 mt-2">Trên {wallets.length} ví</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm ví theo tên hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWallets.map(wallet => (
            <div
              key={wallet.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              style={{ borderTopColor: wallet.color, borderTopWidth: '4px' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: wallet.color + '20' }}
                  >
                    {wallet.icon}
                  </div>
                  <div>
                    <h3 className="text-foreground">{wallet.name}</h3>
                    <p className="text-muted-foreground text-sm">{wallet.description || 'Ví'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(wallet)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmAction({ type: 'delete', walletId: wallet.id })}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground mb-1">Số dư</p>
                <p className="text-foreground" style={{ color: wallet.color }}>
                  {wallet.balance.toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredWallets.length === 0 && wallets.length > 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Không tìm thấy ví nào</p>
            <p className="text-muted-foreground text-sm">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}

        {wallets.length === 0 && (
          <div className="text-center py-16">
            <Wallet className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có ví nào</p>
            <p className="text-muted-foreground">Thêm ví đầu tiên để bắt đầu quản lý tài chính</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-foreground">
                {editingWallet ? 'Chỉnh sửa ví' : 'Thêm ví mới'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-muted-foreground mb-2">Tên ví</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví tiết kiệm, Ví Mary..."
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-2">Số dư ban đầu</label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0"
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-2">Mô tả</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ví (tùy chọn)..."
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-2">Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {availableIcons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-3 text-2xl border-2 rounded-lg transition-colors ${
                        formData.icon === icon
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-muted-foreground mb-2">Màu sắc</label>
                <div className="grid grid-cols-5 gap-2">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.color === color
                          ? 'border-foreground scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-accent"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90"
                >
                  {editingWallet ? 'Cập nhật' : 'Thêm ví'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={confirmAction?.type === 'add'}
        title="Xác nhận thêm ví"
        description={`Bạn có chắc chắn muốn thêm ví "${formData.name}"?`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction?.type === 'update'}
        title="Xác nhận cập nhật"
        description={`Bạn có chắc chắn muốn cập nhật ví này?`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction?.type === 'delete'}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa ví này? Hành động này không thể hoàn tác."
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
        confirmText="Xóa"
        variant="destructive"
      />
    </div>
  );
}
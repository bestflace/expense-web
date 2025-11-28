import React, { useState } from "react";
import {
  Edit,
  Moon,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Wallet,
  Key,
  DollarSign,
  Mail,
  Languages,
} from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ConfirmDialog } from "./ConfirmDialog";
import type { User, Budget } from "../App";
import { toast } from "sonner";
import { changePasswordApi } from "../utils/api";

interface ProfileScreenProps {
  user: User;
  isDarkMode: boolean;
  language: "vi" | "en";
  budget: Budget;
  onToggleDarkMode: (enabled: boolean) => void;
  onToggleLanguage: (lang: "vi" | "en") => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToWallets?: () => void;
  onUpdateBudget: (budget: Budget) => void;
}

export function ProfileScreen({
  user,
  isDarkMode,
  language,
  budget,
  onToggleDarkMode,
  onToggleLanguage,
  onEditProfile,
  onLogout,
  onNavigateToPrivacy,
  onNavigateToWallets,
  onUpdateBudget,
}: ProfileScreenProps) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [budgetLimit, setBudgetLimit] = useState(
    budget.monthlyLimit.toString()
  );
  const [warningThreshold, setWarningThreshold] = useState<70 | 80 | 90 | 100>(
    budget.warningThreshold
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    budget.notificationsEnabled
  );
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(
    budget.emailNotificationsEnabled
  );
  const [confirmBudgetUpdate, setConfirmBudgetUpdate] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  const validatePassword = (
    password: string
  ): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
      return { isValid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
    }
    if (!/\d/.test(password)) {
      return { isValid: false, message: "Mật khẩu phải chứa ít nhất 1 số" };
    }
    return { isValid: true };
  };

  const handlePasswordChange = async () => {
    // Validate current password
    if (!currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error("Mật khẩu mới không hợp lệ", {
        description: passwordValidation.message,
      });
      return;
    }

    // Check password match
    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu không khớp", {
        description: "Vui lòng kiểm tra lại mật khẩu xác nhận",
      });
      return;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return;
    }

    try {
      await changePasswordApi(currentPassword, newPassword);

      toast.success("Mật khẩu đã được thay đổi thành công!", {
        description: "Bạn có thể đăng nhập với mật khẩu mới",
      });

      // Reset states
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error("changePasswordApi error:", err);
      toast.error(
        err instanceof Error ? err.message : "Không thể đổi mật khẩu",
        {
          description:
            err instanceof Error ? undefined : "Vui lòng thử lại sau ít phút",
        }
      );
    }
  };

  const handleBudgetUpdate = () => {
    setConfirmBudgetUpdate(true);
  };

  const confirmBudgetUpdateAction = () => {
    const limit = parseFloat(budgetLimit);
    if (limit <= 0 || isNaN(limit)) {
      toast.error("Hạn mức ngân sách không hợp lệ", {
        description: "Hạn mức ngân sách phải là số dương.",
      });
      setConfirmBudgetUpdate(false);
      return;
    }

    onUpdateBudget({
      ...budget,
      monthlyLimit: limit,
      warningThreshold,
      notificationsEnabled,
      emailNotificationsEnabled,
    });
    setShowBudgetDialog(false);
    setConfirmBudgetUpdate(false);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl text-gray-900 dark:text-white">
                Cài đặt
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Quản lý tài khoản và tùy chỉnh ứng dụng
              </p>
            </div>
            <Button
              onClick={onEditProfile}
              className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-8 mb-8 shadow-lg"
            >
              <Edit className="w-5 h-5 mr-2" />
              Chỉnh sửa hồ sơ
            </Button>
          </div>

          {/* User Info Card */}
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-8 mb-8 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <Avatar className="w-20 h-20 border-4 border-primary/40">
                  <AvatarImage src={user.profilePicture} alt={user.fullName} />
                  <AvatarFallback className="bg-primary/30 text-primary-foreground text-xl">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>

                {/* Thông tin người dùng */}
                <div className="flex-1">
                  <h2 className="text-2xl text-primary-foreground mb-2">
                    {user.fullName}
                  </h2>
                  <p className="text-primary-foreground opacity-80">
                    {user.email}
                  </p>
                  <p className="text-primary-foreground opacity-80">
                    {user.phoneNumber}
                  </p>

                  {/* Bio nếu có */}
                  {user.bio && (
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                      <p className="text-primary-foreground opacity-80">
                        {user.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Settings Section */}
          <div>
            <h3 className="text-xl text-gray-900 dark:text-white mb-4">
              Cài đặt Tài khoản
            </h3>
            <div className="space-y-4">
              {/* Dark Mode */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                        <Moon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          Chế độ tối
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Bật/tắt giao diện tối
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={onToggleDarkMode}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Language */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                        <Languages className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          Ngôn ngữ
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Chọn ngôn ngữ hiển thị
                        </p>
                      </div>
                    </div>
                    <Select value={language} onValueChange={onToggleLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Budget */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <button
                    onClick={() => setShowBudgetDialog(true)}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          Ngân sách tháng
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Hiện tại:{" "}
                          {budget.monthlyLimit.toLocaleString("vi-VN")}₫ (Cảnh
                          báo ở {budget.warningThreshold}%)
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </CardContent>
              </Card>

              {/* Manage Wallets */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <button
                    onClick={onNavigateToWallets}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          Quản lý ví
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Xem và quản lý các ví của bạn
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <button
                    onClick={() => setShowPasswordDialog(true)}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
                        <Key className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          Đổi mật khẩu
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Cập nhật mật khẩu của bạn
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </CardContent>
              </Card>

              {/* Edit Profile */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <button
                    onClick={onEditProfile}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                        <Edit className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          Chỉnh sửa hồ sơ
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Cập nhật thông tin cá nhân
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </CardContent>
              </Card>

              {/* Privacy & Policy */}
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <button
                    onClick={onNavigateToPrivacy}
                    className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">
                          Chính sách & Bảo mật
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Xem chính sách bảo mật
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </CardContent>
              </Card>

              {/* Log Out */}
              <Card className="border-red-200 dark:border-red-800">
                <CardContent className="p-6">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-between text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                        <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-red-600 dark:text-red-400">
                          Đăng xuất
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Thoát khỏi tài khoản
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-400" />
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* App Info */}
          <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">BudgetF v1.0.0</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              © 2025 BudgetF. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-foreground">Đổi mật khẩu</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-muted-foreground text-sm">
                Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi mật khẩu của
                bạn.
              </p>

              {/* Password Requirements */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                  Yêu cầu mật khẩu mới:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        newPassword.length >= 6
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      {newPassword.length >= 6 ? "✓" : "○"}
                    </span>
                    Ít nhất 6 ký tự
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        /\d/.test(newPassword)
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      {/\d/.test(newPassword) ? "✓" : "○"}
                    </span>
                    Chứa ít nhất 1 số
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className={
                        newPassword === confirmNewPassword &&
                        newPassword.length > 0
                          ? "text-green-600"
                          : "text-gray-400"
                      }
                    >
                      {newPassword === confirmNewPassword &&
                      newPassword.length > 0
                        ? "✓"
                        : "○"}
                    </span>
                    Mật khẩu khớp nhau
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-muted-foreground mb-2">
                  Mật khẩu hiện tại
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-2">
                  Mật khẩu mới
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <Input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-12"
                />
                {confirmNewPassword && newPassword !== confirmNewPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    Mật khẩu không khớp
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }}
                  className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-accent"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Dialog */}
      {showBudgetDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-border">
              <h2 className="text-foreground">Quản lý ngân sách tháng</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-muted-foreground mb-2">
                  Hạn mức chi tiêu tháng (₫)
                </label>
                <Input
                  type="number"
                  step="1000"
                  min="1000"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  placeholder="2000000"
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-2">
                  Ngưỡng cảnh báo
                </label>
                <Select
                  value={warningThreshold.toString()}
                  onValueChange={(val: string) =>
                    setWarningThreshold(parseInt(val) as 70 | 80 | 90 | 100)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="70">70% - Cảnh báo sớm</SelectItem>
                    <SelectItem value="80">
                      80% - Cảnh báo trung bình
                    </SelectItem>
                    <SelectItem value="90">90% - Cảnh báo muộn</SelectItem>
                    <SelectItem value="100">100% - Chỉ khi vượt</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs mt-1">
                  Nhận cảnh báo khi chi tiêu đạt {warningThreshold}% ngân sách
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Cảnh báo trong ứng dụng</p>
                    <p className="text-muted-foreground text-sm">
                      Hiển thị cảnh báo khi vượt ngân sách
                    </p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">Cảnh báo qua email</p>
                    <p className="text-muted-foreground text-sm">
                      Gửi email khi vượt ngân sách
                    </p>
                  </div>
                  <Switch
                    checked={emailNotificationsEnabled}
                    onCheckedChange={setEmailNotificationsEnabled}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBudgetDialog(false)}
                  className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-accent"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBudgetUpdate}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={confirmBudgetUpdate}
        title="Xác nhận cập nhật ngân sách"
        description="Bạn có chắc chắn muốn cập nhật hạn mức ngân sách tháng?"
        onConfirm={confirmBudgetUpdateAction}
        onCancel={() => setConfirmBudgetUpdate(false)}
      />
    </div>
  );
}

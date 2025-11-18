import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface AuthScreenProps {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;

  onSignInSuccess: (user: {
    email: string;

    fullName?: string;

    phoneNumber?: string;

    bio?: string;

    profilePicture?: string;
  }) => void;

  onSignUpSuccess: (user: {
    email: string;

    fullName: string;

    phoneNumber?: string;

    bio?: string;

    profilePicture?: string;
  }) => void;
}

export function AuthScreen({
  mode,

  onModeChange,

  onSignInSuccess,

  onSignUpSuccess,
}: AuthScreenProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin", {
        description: "Email và mật khẩu là bắt buộc",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ", {
        description: "Vui lòng nhập địa chỉ email hợp lệ",
      });
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast.error("Mật khẩu quá ngắn", {
        description: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    if (mode === "signup") {
      if (!formData.fullName) {
        toast.error("Vui lòng nhập họ tên", {
          description: "Họ tên là bắt buộc khi đăng ký",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Mật khẩu không khớp", {
          description: "Vui lòng nhập lại mật khẩu xác nhận",
        });
        return;
      }
    }

    // TODO: Call API để xử lý đăng nhập/đăng ký
    // Hiện tại chỉ show success và chuyển màn hình
    // TODO: sau này gọi API backend ở đây

    if (mode === "signin") {
      toast.success("Đăng nhập thành công!");

      // Gửi dữ liệu user cho App (để App setUser và chuyển sang Home)

      onSignInSuccess({
        email: formData.email,
      });
    } else {
      toast.success("Đăng ký thành công!");

      // Gửi dữ liệu user cho App (để App lưu và chuyển sang màn Complete Profile)

      onSignUpSuccess({
        fullName: formData.fullName,

        email: formData.email,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50"
          layout
        >
          {/* Logo & Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-4xl">💰</span>
            </motion.div>
            <h1 className="text-3xl mb-2">
              {mode === "signin" ? "Đăng nhập" : "Đăng ký"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {mode === "signin"
                ? "Chào mừng trở lại!"
                : "Tạo tài khoản mới để bắt đầu"}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="fullname"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm mb-2">Họ và tên</label>
                  <Input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 transition-colors bg-white dark:bg-gray-700"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm mb-2">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 transition-colors bg-white dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Mật khẩu</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 transition-colors bg-white dark:bg-gray-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="confirmpassword"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-500 transition-colors bg-white dark:bg-gray-700 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg transition-all duration-300"
              >
                {mode === "signin" ? "Đăng nhập" : "Đăng ký"}
              </Button>
            </motion.div>
          </form>

          {/* Switch Mode */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-400">
              {mode === "signin" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <button
                type="button"
                onClick={() =>
                  onModeChange(mode === "signin" ? "signup" : "signin")
                }
                className="text-purple-600 dark:text-purple-400 hover:underline transition-all"
              >
                {mode === "signin" ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  loginApi,
  registerApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "../utils/api";

type AuthMode = "signin" | "signup";
type AuthView = "auth" | "forgot-email" | "reset-password";

interface BaseUserPayload {
  email: string;
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  profilePicture?: string;
}

// interface AuthScreenProps {
//   mode: AuthMode;
//   onModeChange: (mode: AuthMode) => void;

//   onSignInSuccess: (user: BaseUserPayload) => void;
//   onSignUpSuccess: (
//     user: Required<Pick<BaseUserPayload, "email" | "fullName">> &
//       Omit<BaseUserPayload, "email" | "fullName">
//   ) => void;
// }
interface AuthScreenProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;

  // Cũ, cho optional để không bắt buộc truyền từ App
  onSignInSuccess?: (user: BaseUserPayload) => void;
  onSignUpSuccess?: (
    user: Required<Pick<BaseUserPayload, "email" | "fullName">> &
      Omit<BaseUserPayload, "email" | "fullName">
  ) => void;

  // Mới: App.tsx đang truyền prop này
  onAuthSuccess?: (params: {
    user: { id?: string; fullName: string; email: string };
    token?: string; // tạm thời cho optional, sau này gắn token backend vào
    rememberMe: boolean;
    mode: AuthMode;
  }) => void;
}

/* ------------------------------ RESET PASSWORD SCREEN ------------------------------ */

interface ResetPasswordScreenProps {
  email: string;
  onBack: () => void;
  onDone: () => void;
  onGoToSignup: () => void;
}

function ResetPasswordScreen({
  email,
  onBack,
  onDone,
  onGoToSignup,
}: ResetPasswordScreenProps) {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Vui lòng nhập mã xác nhận");
      return;
    }

    if (!/^\d{6}$/.test(code.trim())) {
      toast.error("Mã xác nhận không hợp lệ", {
        description: "Mã phải gồm đúng 6 chữ số",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới quá ngắn", {
        description: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu không khớp", {
        description: "Vui lòng kiểm tra lại mật khẩu xác nhận",
      });
      return;
    }

    try {
      await resetPasswordApi(code.trim(), newPassword);

      toast.success("Đổi mật khẩu thành công!", {
        description: "Bạn có thể đăng nhập với mật khẩu mới",
      });

      // reset state local
      setCode("");
      setNewPassword("");
      setConfirmNewPassword("");

      onDone(); // quay về màn Auth
    } catch (err) {
      console.error("resetPassword error:", err);
      toast.error(
        err instanceof Error ? err.message : "Không thể đặt lại mật khẩu",
        {
          description:
            err instanceof Error ? undefined : "Vui lòng thử lại sau ít phút",
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-4xl">
              💳
            </div>
            <h1 className="text-2xl font-semibold mb-1">Nhập mã xác nhận</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chúng tôi đã gửi mã xác nhận đến{" "}
              <span className="font-semibold uppercase">{email}</span>. Nhập mã
              và mật khẩu mới để hoàn tất.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Mã xác nhận</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã gồm 6 ký tự"
                className="h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Mật khẩu mới</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <Input
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                onClick={onBack}
              >
                Quay lại
              </Button>
              <Button
                type="submit"
                className="flex-1 justify-center h-11 
                           bg-gradient-to-br from-primary to-primary/80 
                           text-primary-foreground 
                           rounded-xl shadow-lg 
                           hover:opacity-90 transition-colors"
              >
                Đổi mật khẩu
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={onGoToSignup}
              className="text-purple-600 font-medium hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* --------------------------------------- MAIN AUTH SCREEN -------------------------------------- */

export function AuthScreen({
  mode,
  onModeChange,
  onSignInSuccess,
  onSignUpSuccess,
  onAuthSuccess,
}: AuthScreenProps) {
  const [view, setView] = useState<AuthView>("auth");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // 👈 Ghi nhớ tôi

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ------------------------- SUBMIT FORM ĐĂNG NHẬP / ĐĂNG KÝ ------------------------- */

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Validate như cũ
    if (!formData.email || !formData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin", {
        description: "Email và mật khẩu là bắt buộc",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ", {
        description: "Vui lòng nhập địa chỉ email hợp lệ",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu quá ngắn", {
        description: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    if (mode === "signup") {
      if (!formData.fullName.trim()) {
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

    try {
      // Gọi API thông qua utils/api.ts
      const response =
        mode === "signin"
          ? await loginApi(formData.email, formData.password)
          : await registerApi(
              formData.fullName,
              formData.email,
              formData.password
            );

      const backendUser = response.user;
      const token = response.token;

      toast.success(
        mode === "signin" ? "Đăng nhập thành công!" : "Đăng ký thành công!"
      );

      // ƯU TIÊN onAuthSuccess (App đang dùng)
      if (onAuthSuccess) {
        onAuthSuccess({
          user: {
            id: backendUser.id,
            fullName: backendUser.fullName,
            email: backendUser.email,
          },
          token,
          rememberMe,
          mode, // 👈 truyền kèm mode (signin / signup)
        });
      } else if (mode === "signin" && onSignInSuccess) {
        onSignInSuccess({
          email: backendUser.email,
          fullName: backendUser.fullName,
        });
      } else if (mode === "signup" && onSignUpSuccess) {
        onSignUpSuccess({
          email: backendUser.email,
          fullName: backendUser.fullName,
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(
        error instanceof Error ? error.message : "Không thể kết nối server",
        {
          description:
            error instanceof Error ? undefined : "Vui lòng thử lại sau",
        }
      );
    }
  };

  /* --------------------------- VIEW 2: QUÊN MẬT KHẨU (NHẬP EMAIL) --------------------------- */

  if (view === "forgot-email") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <motion.div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-4xl">
                🔐
              </div>
              <h1 className="text-2xl font-semibold mb-1">Quên mật khẩu</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nhập địa chỉ email của bạn, chúng tôi sẽ gửi mã xác nhận để đặt
                lại mật khẩu.
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!forgotEmail.trim()) {
                  toast.error("Vui lòng nhập email");
                  return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(forgotEmail)) {
                  toast.error("Email không hợp lệ", {
                    description: "Vui lòng nhập địa chỉ email hợp lệ",
                  });
                  return;
                }

                try {
                  await forgotPasswordApi(forgotEmail);

                  toast.success("Đã gửi mã xác nhận", {
                    description: `Vui lòng kiểm tra hộp thư đến tại ${forgotEmail}`,
                  });

                  setView("reset-password");
                } catch (err) {
                  console.error("forgotPassword error:", err);
                  toast.error(
                    err instanceof Error
                      ? err.message
                      : "Không thể gửi mã xác nhận",
                    {
                      description:
                        err instanceof Error
                          ? undefined
                          : "Vui lòng thử lại sau ít phút",
                    }
                  );
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-2">Địa chỉ email</label>
                <Input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="h-11 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                  onClick={() => setView("auth")}
                >
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl 
                             bg-gradient-to-br from-primary to-primary/80 
                             text-primary-foreground 
                             shadow-lg hover:opacity-90 transition-colors"
                >
                  Gửi mã
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  /* --------------------------- VIEW 3: NHẬP MÃ + MẬT KHẨU MỚI --------------------------- */

  if (view === "reset-password") {
    return (
      <ResetPasswordScreen
        email={forgotEmail || "email của bạn"}
        onBack={() => setView("forgot-email")}
        onDone={() => {
          setView("auth");
        }}
        onGoToSignup={() => {
          setView("auth"); // quay về màn auth
          onModeChange("signup"); // chuyển sang tab Đăng ký
        }}
      />
    );
  }

  /* --------------------------- VIEW 1: ĐĂNG NHẬP / ĐĂNG KÝ --------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
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
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-4xl">🌏</span>
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
          <form onSubmit={handleAuthSubmit} className="space-y-4">
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

              {/* Ghi nhớ tôi + Quên mật khẩu chỉ hiển thị ở chế độ Đăng nhập */}
              {mode === "signin" && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span>Ghi nhớ tôi</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(formData.email);
                      setView("forgot-email");
                    }}
                    className="text-primary dark:text-green-400 hover:underline transition-all"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="confirm-password"
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
                className="w-full py-6 
                           bg-gradient-to-br from-primary to-primary/80 
                           text-primary-foreground 
                           rounded-xl shadow-lg 
                           hover:opacity-90 transition-colors"
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
                className="text-primary dark:text-green-400 hover:underline transition-all"
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

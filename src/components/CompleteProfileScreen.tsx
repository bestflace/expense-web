import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "../App";
import { toast } from "sonner";
import { updateProfileApi } from "../utils/api";

interface CompleteProfileScreenProps {
  user: User;
  onComplete: (updatedUser: User) => void;
  onSkip: () => void;
}

export function CompleteProfileScreen({
  user,
  onComplete,
  onSkip,
}: CompleteProfileScreenProps) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    user.profilePicture
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "BF";
    return name
      .split(" ")
      .filter(Boolean)
      .map((p) => p.charAt(0))
      .join("")
      .toUpperCase();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File không hợp lệ", {
        description: "Vui lòng chọn một file hình ảnh.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    try {
      setIsSaving(true);

      const res = await updateProfileApi({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        bio: bio.trim() || undefined,
        avatarUrl: avatarPreview,
      });

      const backendUser = res.user;

      const updatedUser: User = {
        ...user,
        id: backendUser.id,
        fullName: backendUser.fullName,
        email: backendUser.email,
        phoneNumber: backendUser.phoneNumber ?? "",
        bio: backendUser.bio ?? "",
        profilePicture: backendUser.avatarUrl ?? avatarPreview,
      };

      toast.success("Cập nhật hồ sơ thành công!");
      onComplete(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật hồ sơ. Vui lòng thử lại sau."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // nền ngoài: chỉ dùng gradient theo theme (không hardcode xanh/tím)
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/80 to-background flex items-start justify-center px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        {/* HEADER TRÊN CÙNG */}
        <div className="flex items-center justify-between border-b border-gray-200/70 pb-4 pt-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              Thiết lập hồ sơ
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Chỉ mất dưới 1 phút – giúp BudgetF hiểu bạn hơn.
            </p>
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Bỏ qua
          </button>
        </div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="
            mt-4 rounded-3xl border border-border bg-card
            shadow-xl p-6 md:p-8 space-y-6
          "
        >
          {/* TITLE */}
          <div className="text-center space-y-1">
            <h1
              className="
                text-2xl font-bold
                bg-gradient-to-r from-primary to-primary/80
                bg-clip-text text-transparent
              "
            >
              Làm quen trước nhé <span>👋</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Thêm vài thông tin cơ bản để BudgetF đồng hành cùng bạn tốt hơn.
            </p>
          </div>

          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3">
            <motion.button
              type="button"
              onClick={handleAvatarClick}
              className="
                relative inline-flex rounded-full
                focus:outline-none focus:ring-2 focus:ring-primary
                focus:ring-offset-2 focus:ring-offset-background
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Avatar className="h-20 w-20 border-4 border-primary bg-primary shadow-sm">
                  <AvatarImage src={avatarPreview} alt={fullName} />
                  <AvatarFallback
                    className="
                      bg-gradient-to-br from-primary to-primary/70
                      text-primary-foreground text-2xl font-semibold
                    "
                  >
                    {getInitials(fullName || user.fullName)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* ICON CAMERA */}
              <div
                className="
                  absolute -bottom-1 -right-1 flex h-8 w-8
                  items-center justify-center rounded-full
                  border border-background bg-card shadow-md
                "
              >
                <Camera className="h-4 w-4 text-primary" />
              </div>
            </motion.button>

            <p className="text-xs text-muted-foreground">
              Tải lên ảnh đại diện <span className="italic">(tùy chọn)</span>
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ và tên */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-foreground"
                >
                  Họ và tên
                </label>
                <span className="text-xs text-primary">Bắt buộc</span>
              </div>

              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="
                  h-10 rounded-xl border-border bg-background text-sm
                  focus-visible:ring-primary
                "
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                value={user.email}
                readOnly
                className="
                  h-10 rounded-xl border-border bg-muted text-sm
                  text-muted-foreground cursor-not-allowed
                "
              />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Số điện thoại
              </label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
                className="
                  h-10 rounded-xl border-border bg-background text-sm
                  focus-visible:ring-primary
                "
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label
                htmlFor="bio"
                className="text-sm font-medium text-foreground"
              >
                Giới thiệu về bạn
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Một đoạn giới thiệu ngắn về bản thân và mục tiêu tài chính của bạn..."
                className="
                  w-full resize-none rounded-2xl border border-border
                  bg-muted/40 px-3 py-2 text-sm text-foreground
                  placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                className="flex-1 h-11 rounded-3xl"
              >
                Để sau
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="
                  flex-1 h-11 rounded-3xl
                  bg-gradient-to-br from-primary to-primary/80
                  text-primary-foreground shadow-lg
                  hover:opacity-90 transition
                "
              >
                {isSaving ? "Đang lưu..." : "Xác nhận"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

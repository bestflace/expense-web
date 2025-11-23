import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { Camera } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User } from "../App";
import { toast } from "sonner";

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
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    const updatedUser: User = {
      ...user,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      bio: bio.trim(),
      profilePicture: avatarPreview,
    };

    onComplete(updatedUser);
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        {/* HEADER TRÊN CÙNG */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.18em]">
              Thiết lập hồ sơ
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Chỉ mất dưới 1 phút – giúp BudgetF hiểu bạn hơn.
            </p>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Bỏ qua
          </button>
        </div>

        {/* CARD NỘI DUNG + ANIMATION VÀO MÀN HÌNH */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mt-4 rounded-3xl border border-gray-200 bg-white shadow-lg p-6 space-y-6"
        >
          {/* TIÊU ĐỀ CHÍNH */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-gray-900">
              Làm quen trước nhé <span>👋</span>
            </h1>
            <p className="text-sm text-gray-600">
              Thêm vài thông tin cơ bản để cá nhân hoá trải nghiệm tài chính của
              bạn.
            </p>
          </div>

          {/* AVATAR + UPLOAD (CÓ FLOAT ANIMATION) */}
          <div className="flex flex-col items-center gap-3">
            <motion.button
              type="button"
              onClick={handleAvatarClick}
              className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
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
                <Avatar className="h-20 w-20 border-4 border-blue-100 bg-blue-500">
                  <AvatarImage src={avatarPreview} alt={fullName} />
                  <AvatarFallback className="bg-blue-500 text-white text-2xl font-semibold">
                    {getInitials(fullName || user.fullName)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* ICON CAMERA Ở GIỮA BÊN DƯỚI */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md">
                <Camera className="h-4 w-4 text-blue-600" />
              </div>
            </motion.button>

            <p className="text-xs text-gray-600">
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
                  className="text-sm font-medium text-gray-900"
                >
                  Họ và tên
                </label>
                <span className="text-xs text-blue-700">Bắt buộc</span>
              </div>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="h-10 rounded-xl border-gray-200 bg-white text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <Input
                id="email"
                value={user.email}
                readOnly
                className="h-10 rounded-xl border-gray-200 bg-gray-100 text-sm text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-900"
              >
                Số điện thoại
              </label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại của bạn"
                className="h-10 rounded-xl border-gray-200 bg-white text-sm"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label
                htmlFor="bio"
                className="text-sm font-medium text-gray-900"
              >
                Giới thiệu về bạn
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Một đoạn giới thiệu ngắn về bản thân và mục tiêu tài chính của bạn..."
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                className="flex-1 h-11 rounded-2xl"
              >
                Để sau
              </Button>
              <Button
                type="submit"
                variant="default"
                className="flex-1 h-11 rounded-2xl"
              >
                Xác nhận
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

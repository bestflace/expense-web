import React, { useState } from "react";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import type { User } from "../App";
import { updateProfileApi } from "../utils/api";
interface EditProfileScreenProps {
  user: User;
  onUpdateUser: React.Dispatch<React.SetStateAction<User>>;
  onBack: () => void;
}

export function EditProfileScreen({
  user,
  onUpdateUser,
  onBack,
}: EditProfileScreenProps) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    bio: user.bio,
    profilePicture: user.profilePicture || "",
  });

  const [previewUrl, setPreviewUrl] = useState(user.profilePicture || "");
  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    fullName: "",
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");

    // Phone number should have 10-15 digits
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return false;
    }

    // Basic phone format validation (allows international formats)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { email: "", phoneNumber: "", fullName: "" };

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên đầy đủ";
      hasErrors = true;
    }

    // Validate email (dù backend chưa cho sửa email, vẫn check cho đẹp form)
    if (!validateEmail(formData.email)) {
      newErrors.email =
        "Vui lòng nhập địa chỉ email hợp lệ (ví dụ: user@example.com)";
      hasErrors = true;
    }

    // Validate phone number
    if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Vui lòng nhập số điện thoại hợp lệ (10-15 chữ số)";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      toast.error("Thông tin không hợp lệ", {
        description: "Vui lòng kiểm tra lại biểu mẫu và thử lại.",
      });
      return;
    }

    try {
      // gọi backend cập nhật hồ sơ
      const res = await updateProfileApi({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        avatarUrl: formData.profilePicture || undefined,
      });

      const backendUser = res.user;

      // cập nhật lại state User ở App.tsx
      onUpdateUser((prev) => ({
        ...prev,
        id: backendUser.id ?? prev.id,
        fullName: backendUser.fullName ?? prev.fullName,
        email: backendUser.email ?? prev.email,
        phoneNumber: backendUser.phoneNumber || "",
        bio: backendUser.bio ?? "",
        profilePicture: backendUser.avatarUrl ?? prev.profilePicture,
      }));

      toast.success("Cập nhật hồ sơ thành công!");
      onBack();
    } catch (err) {
      console.error("updateProfileApi error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Không thể cập nhật hồ sơ. Vui lòng thử lại."
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
        handleInputChange("profilePicture", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-gray-900 dark:text-white">
            Chỉnh sửa hồ sơ
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 border-4 border-gray-200 dark:border-gray-700">
                  <AvatarImage src={previewUrl} alt={formData.fullName} />
                  <AvatarFallback className="text-xl">
                    {getInitials(formData.fullName)}
                  </AvatarFallback>
                </Avatar>

                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors ring-2 ring-background">
                  <Camera className="w-4 h-4 text-primary-foreground" />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">
                Nhấn vào biểu tượng máy ảnh để thay đổi ảnh
              </p>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Nhập họ và tên của bạn"
                  className={
                    errors.fullName
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  required
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Nhập email của bạn"
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Nhập số điện thoại của bạn"
                  className={
                    errors.phoneNumber
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Tiểu sử</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Kể cho chúng tôi một chút về bạn..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-foreground dark:text-primary-100">
                Xem trước
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 border-2 border-blue-200 dark:border-blue-700">
                  <AvatarImage src={previewUrl} alt={formData.fullName} />
                  <AvatarFallback className="bg-primary/20 dark:bg-primary/50 text-primary dark:text-primary-300 text-lg">
                    {getInitials(formData.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-gray-900 dark:text-white text-lg">
                    {formData.fullName || "Tên của bạn"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {formData.email || "email.cua.ban@example.com"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {formData.phoneNumber || "+84 123 456 789"}
                  </p>
                </div>
              </div>

              {formData.bio && (
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {formData.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 rounded-xl"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 
             bg-gradient-to-br from-primary to-primary/80 
             text-primary-foreground 
             rounded-xl shadow-lg 
             hover:opacity-90 transition-colors"
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

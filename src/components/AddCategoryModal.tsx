import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import type { Category } from "../App";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, "id">) => void;
  editingCategory?: Category | null;
  defaultType: "income" | "expense";
  categories: Category[];
  parentCategoryId?: string;
}

const PRESET_ICONS = [
  "🍽️",
  "🚗",
  "🛍️",
  "🏠",
  "⚡",
  "💊",
  "🎮",
  "📚",
  "✈️",
  "🎬",
  "💰",
  "💼",
  "📈",
  "🏆",
  "🎁",
  "💻",
  "🔧",
  "🎨",
  "🏃",
  "☕",
  "🍴",
  "🛒",
  "⛽",
  "🚌",
  "🚕",
  "🏥",
  "⚽",
  "🎵",
  "📱",
  "🌮",
];

const PRESET_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#AED6F1",
  "#D7BDE2",
];

export function AddCategoryModal({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  defaultType,
  categories,
  parentCategoryId,
}: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: defaultType as "income" | "expense",
    icon: "💰",
    color: "#4ECDC4",
    parentCategoryId: parentCategoryId || "",
  });

  // Get parent categories (those without parentCategoryId)
  const parentCategories = categories.filter(
    (c) => !c.parentCategoryId && c.type === formData.type
  );

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        type: editingCategory.type,
        icon: editingCategory.icon,
        color: editingCategory.color,
        parentCategoryId: editingCategory.parentCategoryId || "",
      });
    } else {
      setFormData({
        name: "",
        type: defaultType,
        icon: "💰",
        color: "#4ECDC4",
        parentCategoryId: parentCategoryId || "",
      });
    }
  }, [editingCategory, defaultType, isOpen, parentCategoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const categoryData: Omit<Category, "id"> = {
      name: formData.name.trim(),
      type: formData.type,
      icon: formData.icon,
      color: formData.color,
    };

    if (formData.parentCategoryId) {
      categoryData.parentCategoryId = formData.parentCategoryId;
    }

    onSave(categoryData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isSubcategory = !!formData.parentCategoryId || !!parentCategoryId;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="
      max-w-lg      /* ~512px, khá bự trên desktop */
      w-full        /* chiếm hết phần cho phép */
      max-h-[90vh]  /* cao tối đa 90% màn hình, không tràn */
      mx-auto
      flex flex-col
    "
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {editingCategory
              ? editingCategory.parentCategoryId
                ? "Sửa danh mục con"
                : "Sửa danh mục"
              : parentCategoryId
              ? "Thêm danh mục con"
              : "Thêm danh mục mới"}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? "Chỉnh sửa thông tin danh mục của bạn"
              : "Tạo danh mục mới để phân loại giao dịch"}
          </DialogDescription>
        </DialogHeader>

        {/* ✨ BỌC FORM BẰNG DIV CÓ SCROLL */}
        <div className="mt-2 overflow-y-auto bf-chat-scroll pr-1">
          <form onSubmit={handleSubmit} className="space-y-4 pb-2">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="categoryName">Tên danh mục</Label>
              <Input
                id="categoryName"
                placeholder="Nhập tên danh mục"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            {/* Category Type */}
            {!parentCategoryId && (
              <div className="space-y-2">
                <Label htmlFor="categoryType">Loại danh mục</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: string) =>
                    handleInputChange("type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">
                      <span className="text-red-600">Chi tiêu</span>
                    </SelectItem>
                    <SelectItem value="income">
                      <span className="text-green-600">Thu nhập</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Parent Category Selection */}
            {!editingCategory &&
              !parentCategoryId &&
              parentCategories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="parentCategory">
                    Danh mục cha (tùy chọn)
                  </Label>
                  <Select
                    value={formData.parentCategoryId || "none"}
                    onValueChange={(value: string) =>
                      handleInputChange(
                        "parentCategoryId",
                        value === "none" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Không có" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không có</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

            {/* Icon Selection */}
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                {PRESET_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange("icon", icon)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                      formData.icon === icon
                        ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange("color", color)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      formData.color === color
                        ? "border-2 border-gray-900 dark:border-white scale-110"
                        : "border border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <Label className="text-blue-900 dark:text-blue-100 mb-2 block">
                  Xem trước
                </Label>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: formData.color }}
                  >
                    <span className="text-lg">{formData.icon}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {formData.name || "Tên danh mục"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {formData.type === "income" ? "Thu nhập" : "Chi tiêu"}
                      {isSubcategory && " • Danh mục con"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
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
                {editingCategory ? "Lưu thay đổi" : "Thêm danh mục"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { ArrowLeft, Calendar, DollarSign } from "lucide-react";
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
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type { Category, Transaction, Wallet } from "../App";

interface AddTransactionScreenProps {
  categories: Category[];
  wallets: Wallet[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onBack: () => void;
}

export function AddTransactionScreen({
  categories,
  wallets,
  onAddTransaction,
  onBack,
}: AddTransactionScreenProps) {
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    category: "",
    subcategory: "",
    walletId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.description) {
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      return;
    }

    onAddTransaction({
      type: formData.type,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      walletId: formData.walletId || undefined,
      amount: amount,
      date: formData.date,
      description: formData.description,
    });

    onBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      // Reset subcategory when category changes
      if (field === "category") {
        return { ...prev, [field]: value, subcategory: "" };
      }
      // Reset category and subcategory when type changes
      if (field === "type") {
        return {
          ...prev,
          [field]: value as "income" | "expense",
          category: "",
          subcategory: "",
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === formData.type && !cat.parentCategoryId
  );

  const selectedCategoryObj = categories.find(
    (c) => c.name === formData.category
  );
  const subcategories = selectedCategoryObj
    ? categories.filter((c) => c.parentCategoryId === selectedCategoryObj.id)
    : [];

  const selectedCategory = categories.find(
    (cat) => cat.name === formData.category
  );

  const formatPreviewAmount = (amount: string) => {
    if (!amount) return "0₫";
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return "0₫";
    return numericAmount.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl text-gray-900 dark:text-white">
              Thêm giao dịch
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Thêm giao dịch thu nhập hoặc chi tiêu mới
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Loại giao dịch</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={formData.type}
                    onValueChange={(value: string) =>
                      handleInputChange("type", value)
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2 h-12">
                      <TabsTrigger
                        value="expense"
                        className="text-red-600 data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                      >
                        💸 Chi tiêu
                      </TabsTrigger>
                      <TabsTrigger
                        value="income"
                        className="text-green-600 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
                      >
                        💰 Thu nhập
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <Card>
                  <CardHeader>
                    <CardTitle>Danh mục</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={formData.category}
                      onValueChange={(value: string) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            <div className="flex items-center space-x-2">
                              <span>{category.icon}</span>
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Subcategory */}
                {subcategories.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Danh mục con</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={formData.subcategory || "none"}
                        onValueChange={(value: string) =>
                          handleInputChange(
                            "subcategory",
                            value === "none" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Chọn danh mục con (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {subcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory.id}
                              value={subcategory.name}
                            >
                              <div className="flex items-center space-x-2">
                                <span>{subcategory.icon}</span>
                                <span>{subcategory.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Amount and Wallet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount */}
                <Card>
                  <CardHeader>
                    <CardTitle>Số tiền</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <DollarSign className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) =>
                          handleInputChange("amount", e.target.value)
                        }
                        className="pl-12 h-12 text-lg"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet */}
                {wallets.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Ví</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={formData.walletId || "none"}
                        onValueChange={(value: string) =>
                          handleInputChange(
                            "walletId",
                            value === "none" ? "" : value
                          )
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Chọn ví (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {wallets.map((wallet) => (
                            <SelectItem
                              key={wallet.id}
                              value={wallet.id}
                              className="opacity-100"
                            >
                              <div className="flex items-center space-x-2">
                                <span>{wallet.icon}</span>
                                <span>{wallet.name}</span>
                                <span
                                  className={`text-xs ${
                                    wallet.balance < 0
                                      ? "text-red-500"
                                      : "text-gray-500"
                                  }`}
                                >
                                  ({wallet.balance.toLocaleString("vi-VN")}₫)
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Date */}
              <Card>
                <CardHeader>
                  <CardTitle>Ngày</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative max-w-xs">
                    <Calendar className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="pl-12 h-12"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Nhập mô tả giao dịch..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="min-h-[100px]"
                    required
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 h-12 rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 
             bg-gradient-to-br from-primary to-primary/80 
             text-primary-foreground 
             rounded-xl shadow-lg 
             hover:opacity-90 transition-colors"
                >
                  Thêm giao dịch
                </Button>
              </div>
            </form>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 sticky top-6">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">
                  Xem trước
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCategory ? (
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: selectedCategory.color }}
                      >
                        <span className="text-lg">{selectedCategory.icon}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gray-900 dark:text-white">
                              {formData.description || "Mô tả giao dịch"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              {formData.category || "Danh mục"} •{" "}
                              {new Date(formData.date).toLocaleDateString(
                                "vi-VN",
                                { month: "short", day: "numeric" }
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg ${
                                formData.type === "income"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {formData.type === "income" ? "+" : "-"}
                              {formatPreviewAmount(formData.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-gray-400 text-lg">💰</span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Điền vào form để xem trước
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Mẹo nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">💡</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sử dụng tên mô tả để dễ dàng tìm giao dịch sau này
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">📅</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Đặt ngày chính xác để báo cáo chính xác
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">🏷️</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chọn đúng danh mục để có thông tin chi tiết hơn
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AddCategoryModal } from "./AddCategoryModal";
import { ConfirmDialog } from "./ConfirmDialog";
import type { Category } from "../App";

interface CategoriesScreenProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, "id">) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoriesScreen({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoriesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"expense" | "income">(
    "expense"
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(
    null
  );
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Get subcategories for a parent
  const getSubcategories = (parentId: string) => {
    return categories.filter(
      (cat) =>
        cat.parentCategoryId === parentId &&
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get parent categories - show if parent name matches OR any subcategory matches
  const parentCategories = categories.filter((cat) => {
    if (cat.parentCategoryId || cat.type !== selectedTab) return false;

    // If no search query, show all parents
    if (!searchQuery) return true;

    // Show if parent name matches
    if (cat.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;

    // Show if any subcategory matches
    const matchingSubcategories = getSubcategories(cat.id);
    return matchingSubcategories.length > 0;
  });

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsAddModalOpen(true);
  };

  const handleAddSubcategory = (parentId: string) => {
    setAddingSubcategoryTo(parentId);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingCategory(null);
    setAddingSubcategoryTo(null);
  };

  const handleSaveCategory = (categoryData: Omit<Category, "id">) => {
    if (editingCategory) {
      setConfirmUpdateData({ id: editingCategory.id, data: categoryData });
    } else {
      setConfirmAddData(categoryData);
    }
  };

  const [confirmAddData, setConfirmAddData] = useState<Omit<
    Category,
    "id"
  > | null>(null);
  const [confirmUpdateData, setConfirmUpdateData] = useState<{
    id: string;
    data: Partial<Category>;
  } | null>(null);

  const handleConfirmAdd = () => {
    if (confirmAddData) {
      onAddCategory(confirmAddData);
      setConfirmAddData(null);
      handleModalClose();
    }
  };

  const handleConfirmUpdate = () => {
    if (confirmUpdateData) {
      onUpdateCategory(confirmUpdateData.id, confirmUpdateData.data);
      setConfirmUpdateData(null);
      handleModalClose();
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      onDeleteCategory(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  const expenseCategories = categories.filter(
    (cat) => cat.type === "expense" && !cat.parentCategoryId
  );
  const incomeCategories = categories.filter(
    (cat) => cat.type === "income" && !cat.parentCategoryId
  );

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 dark:text-white">
              Quản lý danh mục
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Quản lý danh mục và danh mục con của bạn
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-br from-primary to-primary/80 
             text-primary-foreground 
             h-12 px-6 rounded-xl shadow-lg 
             hover:opacity-90 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm danh mục
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Category Tabs */}
          <Tabs
            value={selectedTab}
            onValueChange={(value: "expense" | "income") =>
              setSelectedTab(value)
            }
          >
            <TabsList
              className="
    grid w-full max-w-md grid-cols-2 h-12
    rounded-full p-1
    bg-gray-100
    dark:bg-gray-800
  "
            >
              <TabsTrigger
                value="expense"
                className="
      rounded-full
      text-red-600 dark:text-red-300
      data-[state=active]:bg-red-50
      data-[state=active]:text-red-700
      dark:data-[state=active]:bg-red-500/20
      dark:data-[state=active]:text-red-100
      transition-colors
    "
              >
                💸 Chi tiêu ({expenseCategories.length})
              </TabsTrigger>

              <TabsTrigger
                value="income"
                className="
      rounded-full
      text-green-600 dark:text-emerald-300
      data-[state=active]:bg-green-50
      data-[state=active]:text-green-700
      dark:data-[state=active]:bg-emerald-500/20
      dark:data-[state=active]:text-emerald-100
      transition-colors
    "
              >
                💰 Thu nhập ({incomeCategories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              {parentCategories.length === 0 ? (
                <Card className="border-gray-200 dark:border-gray-700 max-w-2xl">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchQuery
                        ? "Không tìm thấy danh mục"
                        : "Chưa có danh mục nào"}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => setIsAddModalOpen(true)}
                        variant="outline"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        Thêm danh mục đầu tiên
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parentCategories.map((category) => {
                    const subcategories = getSubcategories(category.id);
                    const hasSubcategories = subcategories.length > 0;

                    // Auto-expand if searching and has matching subcategories but parent name doesn't match
                    const shouldAutoExpand =
                      searchQuery &&
                      hasSubcategories &&
                      !category.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());
                    const isExpanded =
                      shouldAutoExpand || expandedCategories.has(category.id);

                    return (
                      <Card
                        key={category.id}
                        className="border-gray-200 dark:border-gray-700"
                      >
                        <CardContent className="p-0">
                          {/* Parent Category */}
                          <div className="p-4 flex items-center space-x-4">
                            {/* Expand/Collapse Button */}
                            {hasSubcategories && (
                              <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            )}
                            {!hasSubcategories && <div className="w-6" />}

                            {/* Category Icon & Name */}
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                              style={{ backgroundColor: category.color }}
                            >
                              <span className="text-lg">{category.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 dark:text-white truncate">
                                {category.name}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {hasSubcategories
                                  ? `${subcategories.length} danh mục con`
                                  : "Danh mục chính"}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() =>
                                  handleAddSubcategory(category.id)
                                }
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Thêm danh mục con"
                              >
                                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </button>
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmDelete({
                                    id: category.id,
                                    name: category.name,
                                  })
                                }
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>

                          {/* Subcategories */}
                          {hasSubcategories && isExpanded && (
                            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                              {subcategories.map((subcategory) => (
                                <div
                                  key={subcategory.id}
                                  className="p-4 pl-16 flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                                >
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                    style={{
                                      backgroundColor: subcategory.color,
                                    }}
                                  >
                                    <span className="text-sm">
                                      {subcategory.icon}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 dark:text-white text-sm truncate">
                                      {subcategory.name}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={() =>
                                        handleEditCategory(subcategory)
                                      }
                                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                      <Edit className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setConfirmDelete({
                                          id: subcategory.id,
                                          name: subcategory.name,
                                        })
                                      }
                                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        defaultType={selectedTab}
        categories={categories}
        parentCategoryId={addingSubcategoryTo || undefined}
      />

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={!!confirmAddData}
        title="Xác nhận thêm danh mục"
        description={`Bạn có chắc chắn muốn thêm danh mục "${confirmAddData?.name}"?`}
        onConfirm={handleConfirmAdd}
        onCancel={() => setConfirmAddData(null)}
      />

      <ConfirmDialog
        open={!!confirmUpdateData}
        title="Xác nhận cập nhật"
        description="Bạn có chắc chắn muốn cập nhật danh mục này?"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setConfirmUpdateData(null)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa danh mục "${
          confirmDelete?.name
        }"? ${
          categories.some((c) => c.parentCategoryId === confirmDelete?.id)
            ? "Tất cả danh mục con cũng sẽ bị xóa."
            : ""
        }`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Xóa"
        variant="destructive"
      />
    </div>
  );
}

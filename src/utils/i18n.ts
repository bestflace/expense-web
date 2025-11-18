export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    // Common
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Sửa',
    add: 'Thêm',
    skip: 'Bỏ qua',
    close: 'Đóng',
    search: 'Tìm kiếm',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    
    // Auth
    signIn: 'Đăng nhập',
    signUp: 'Đăng ký',
    logout: 'Đăng xuất',
    email: 'Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    fullName: 'Họ và tên',
    forgotPassword: 'Quên mật khẩu?',
    dontHaveAccount: 'Chưa có tài khoản?',
    alreadyHaveAccount: 'Đã có tài khoản?',
    createAccount: 'Tạo tài khoản',
    welcomeBack: 'Chào mừng trở lại',
    
    // Navigation
    home: 'Trang chủ',
    categories: 'Danh mục',
    statistics: 'Thống kê',
    profile: 'Hồ sơ',
    wallets: 'Ví',
    
    // Transactions
    transaction: 'Giao dịch',
    transactions: 'Giao dịch',
    addTransaction: 'Thêm giao dịch',
    income: 'Thu nhập',
    expense: 'Chi tiêu',
    amount: 'Số tiền',
    date: 'Ngày',
    description: 'Mô tả',
    category: 'Danh mục',
    subcategory: 'Danh mục con',
    wallet: 'Ví',
    balance: 'Số dư',
    totalIncome: 'Tổng thu nhập',
    totalExpenses: 'Tổng chi tiêu',
    
    // Budget
    monthlyBudget: 'Ngân sách tháng',
    budgetLimit: 'Hạn mức',
    budgetWarning: 'Cảnh báo ngân sách',
    budgetExceeded: 'Đã vượt ngân sách',
    warningThreshold: 'Ngưỡng cảnh báo',
    
    // Settings
    settings: 'Cài đặt',
    darkMode: 'Chế độ tối',
    language: 'Ngôn ngữ',
    notifications: 'Thông báo',
    privacy: 'Quyền riêng tư',
    
    // Profile
    editProfile: 'Sửa hồ sơ',
    phoneNumber: 'Số điện thoại',
    bio: 'Giới thiệu',
    avatar: 'Ảnh đại diện',
    changePassword: 'Đổi mật khẩu',
    
    // Onboarding
    getStarted: 'Bắt đầu',
    next: 'Tiếp theo',
    previous: 'Quay lại',
    finish: 'Hoàn thành',
    
    // Messages
    loginSuccess: 'Đăng nhập thành công!',
    logoutSuccess: 'Đã đăng xuất thành công!',
    transactionAdded: 'Giao dịch đã được thêm!',
    transactionUpdated: 'Giao dịch đã được cập nhật!',
    transactionDeleted: 'Giao dịch đã được xóa!',
  },
  en: {
    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    skip: 'Skip',
    close: 'Close',
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Log Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    createAccount: 'Create Account',
    welcomeBack: 'Welcome Back',
    
    // Navigation
    home: 'Home',
    categories: 'Categories',
    statistics: 'Statistics',
    profile: 'Profile',
    wallets: 'Wallets',
    
    // Transactions
    transaction: 'Transaction',
    transactions: 'Transactions',
    addTransaction: 'Add Transaction',
    income: 'Income',
    expense: 'Expense',
    amount: 'Amount',
    date: 'Date',
    description: 'Description',
    category: 'Category',
    subcategory: 'Subcategory',
    wallet: 'Wallet',
    balance: 'Balance',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    
    // Budget
    monthlyBudget: 'Monthly Budget',
    budgetLimit: 'Budget Limit',
    budgetWarning: 'Budget Warning',
    budgetExceeded: 'Budget Exceeded',
    warningThreshold: 'Warning Threshold',
    
    // Settings
    settings: 'Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy',
    
    // Profile
    editProfile: 'Edit Profile',
    phoneNumber: 'Phone Number',
    bio: 'Bio',
    avatar: 'Avatar',
    changePassword: 'Change Password',
    
    // Onboarding
    getStarted: 'Get Started',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    
    // Messages
    loginSuccess: 'Login successful!',
    logoutSuccess: 'Logged out successfully!',
    transactionAdded: 'Transaction added!',
    transactionUpdated: 'Transaction updated!',
    transactionDeleted: 'Transaction deleted!',
  }
};

export const useTranslation = (lang: Language) => {
  return (key: keyof typeof translations.vi) => {
    return translations[lang][key] || key;
  };
};

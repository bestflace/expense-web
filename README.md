# BudgetF – Expense & Budget Management Web App

BudgetF là web app quản lý thu chi cá nhân, giúp bạn theo dõi thu/chi, quản lý danh mục, ví và ngân sách hàng tháng với giao diện trực quan.

## ✨ Tính năng chính

### 1. Onboarding

- 4 màn giới thiệu BudgetF:
  - Giới thiệu giải pháp quản lý tài chính
  - Quản lý thu chi theo danh mục & ví
  - Biểu đồ, thống kê, xuất Excel
  - Cảnh báo vượt ngân sách tháng

### 2. Xác thực (Auth)

- Đăng ký tài khoản bằng Họ tên, Email, Mật khẩu
- Đăng nhập bằng Email + Mật khẩu
- Ghi nhớ đăng nhập
- (Kế hoạch) Quên mật khẩu, đặt lại mật khẩu qua email
- Đổi mật khẩu trong phần Cài đặt

### 3. Hoàn tất hồ sơ & Ngân sách ban đầu

- Sau khi đăng ký:
  - Màn hình **Thêm thông tin** (avatar, số điện thoại, giới thiệu bản thân)
  - **Thiết lập ngân sách tháng**:
    - Hạn mức chi tiêu tháng (VNĐ)
    - Ngưỡng cảnh báo: 70% / 80% / 90% / 100%
    - Cảnh báo trong app (toast), sau này có thể nối backend để gửi email

### 4. Trang chủ (Dashboard)

- Chào user: “Xin chào, [Họ và tên]”
- Hiển thị:
  - Tổng số dư
  - Tổng thu nhập tháng
  - Tổng chi tiêu tháng
- Tìm kiếm giao dịch
- Danh sách giao dịch gần đây
- Nút **Thêm giao dịch** (mở form thêm mới)

### 5. Giao dịch

- Thêm giao dịch:
  - Loại: Thu nhập / Chi tiêu
  - Danh mục cha & con
  - Số tiền
  - Ví
  - Ngày
  - Mô tả
- Sửa / Xóa giao dịch
- Tự động cập nhật số dư ví
- Kiểm tra số dư ví không được âm
- Cảnh báo vượt ngưỡng ngân sách tháng bằng toast

### 6. Danh mục

- Danh mục Thu nhập / Chi tiêu
- Danh mục cha – con
- Thêm / sửa / xóa danh mục
- Không cho trùng tên trong cùng loại & cùng cấp
- Không cho xóa danh mục nếu đang có giao dịch liên quan

### 7. Ví (Wallets)

- Danh sách ví: tên ví, số dư, mô tả, icon, màu
- Thêm ví mới (kiểm tra trùng tên, số dư không âm)
- Sửa / xóa ví
- Không cho xóa ví đang có giao dịch

### 8. Thống kê / Báo cáo

- Biểu đồ thu/chi theo danh mục
- So sánh thu – chi
- Tổng hợp theo tháng/năm
- **Xuất Excel (CSV)**:
  - Tổng quan thu/chi
  - Phân tích theo tháng
  - Chi tiết giao dịch

### 9. Cài đặt (Settings)

- Thông tin người dùng: avatar, tên, email, số điện thoại, bio
- Chỉnh sửa hồ sơ
- Ngân sách tháng:
  - Hạn mức chi tiêu
  - Ngưỡng cảnh báo
  - Bật/tắt cảnh báo trong app / qua email
- Quản lý ví
- Chế độ tối/sáng (Dark mode)
- Ngôn ngữ: Tiếng Việt / English
- Đổi mật khẩu
- Quyền riêng tư (Privacy policy)
- Đăng xuất (kèm dialog xác nhận)

---

## 🛠️ Công nghệ sử dụng

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- Tailwind CSS / shadcn UI (Button, Card, Input, Dialog…)
- `lucide-react` – icon
- `sonner` – toast thông báo

---

## 📁 Cấu trúc thư mục chính

```text
src/
  components/
    AddTransactionScreen.tsx
    AuthScreen.tsx
    BottomNavigation.tsx
    BudgetSetupDialog.tsx
    CategoriesScreen.tsx
    ConfirmDialog.tsx
    EditProfileScreen.tsx
    EditTransactionDialog.tsx
    HomeScreen.tsx
    OnboardingScreen.tsx
    PrivacyPolicyScreen.tsx
    ProfileScreen.tsx
    StatisticsScreen.tsx
    WalletsScreen.tsx
    ... (các UI component khác)
  utils/
    ...
  App.tsx
  main.tsx

## Running the code
Run `npm i` to install the dependencies.
Run `npm run dev` to start the development server.
```

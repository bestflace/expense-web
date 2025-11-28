import { API_BASE_URL, STORAGE_KEYS } from "../config";

type ApiResponse<T> = {
  status: "success" | "error";
  message?: string;
  data?: T;
};

export type BackendUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    sessionStorage.getItem(STORAGE_KEYS.token) ||
    localStorage.getItem(STORAGE_KEYS.token);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any).Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";

  // 🔍 Nếu không phải JSON thì log thẳng ra cho dễ thấy
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("❌ Non-JSON response from:", url);
    console.error("Status:", res.status, res.statusText);
    console.error("Raw body:", text);
    throw new Error(
      `API ${url} trả về không phải JSON (status ${
        res.status
      }). Nội dung: ${text.slice(0, 120)}...`
    );
  }

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || json.status === "error") {
    throw new Error(json.message || `Có lỗi xảy ra khi gọi API ${url}`);
  }

  // @ts-expect-error – backend luôn trả data trong json.data
  return json.data;
}

/* ---------- AUTH ---------- */

export async function loginApi(email: string, password: string) {
  return request<{
    user: BackendUser;
    token: string;
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  fullName: string,
  email: string,
  password: string
) {
  return request<{
    user: BackendUser;
    token: string;
  }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password }),
  });
}

export async function meApi() {
  return request<{
    user: BackendUser;
  }>("/api/auth/me", {
    method: "GET",
  });
}
export async function forgotPasswordApi(email: string) {
  return request<null>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordApi(token: string, newPassword: string) {
  return request<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
export async function changePasswordApi(
  currentPassword: string,
  newPassword: string
) {
  return request<{ message: string }>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/*Settings */
// ================== SETTINGS ==================

export type SettingsApi = {
  darkMode: boolean;
  locale: "vi-VN" | "en-US";
  timezone: string | null;
};

export async function getSettingsApi() {
  return request<SettingsApi>("/api/settings", {
    method: "GET",
  });
}

export async function updateSettingsApi(updates: Partial<SettingsApi>) {
  return request<SettingsApi>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/* ---------- PROFILE / SETTINGS ---------- */

export type UpdateProfilePayload = {
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
};

export async function updateProfileApi(payload: UpdateProfilePayload) {
  return request<{
    user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber?: string | null;
      bio?: string | null;
      avatarUrl?: string | null;
    };
  }>("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ================== WALLET ==================

// Định nghĩa shape ví giống backend trả về
export type WalletApi = {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
  description?: string;
};

export async function getWalletsApi() {
  return request<WalletApi[]>("/api/wallets", {
    method: "GET",
  });
}

export async function createWalletApi(wallet: Omit<WalletApi, "id">) {
  return request<WalletApi>("/api/wallets", {
    method: "POST",
    body: JSON.stringify(wallet),
  });
}

export async function updateWalletApi(
  id: string,
  updates: Partial<Omit<WalletApi, "id">>
) {
  return request<WalletApi>(`/api/wallets/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteWalletApi(id: string) {
  // nếu backend trả { status: "success" } là đủ
  return request<null>(`/api/wallets/${id}`, {
    method: "DELETE",
  });
}

/* ---------- TRANSACTIONS ---------- */

// ================== TRANSACTIONS ==================

export type TransactionApi = {
  transaction_id: string; // từ transactionController
  category_id: string;
  wallet_id: string;
  amount: number;
  description: string | null;
  tx_date: string; // ngày giao dịch
  category_name?: string; // SELECT thêm ở listTransactions
  category_type?: "income" | "expense";
  wallet_name?: string;
};

export type CreateTransactionPayload = {
  category_id: string;
  wallet_id: string;
  amount: number;
  description?: string;
  tx_date?: string;
};

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

// GET – danh sách giao dịch
export async function getTransactionsApi() {
  return request<TransactionApi[]>("/api/transactions", {
    method: "GET",
  });
}

// POST – tạo giao dịch mới
export async function createTransactionApi(payload: CreateTransactionPayload) {
  return request<TransactionApi>("/api/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// PUT – cập nhật giao dịch
export async function updateTransactionApi(
  id: string,
  payload: UpdateTransactionPayload
) {
  return request<TransactionApi>(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE – xoá giao dịch
export async function deleteTransactionApi(id: string) {
  return request<null>(`/api/transactions/${id}`, {
    method: "DELETE",
  });
}

/* ---------- CATEGORIES ---------- */

export type CategoryApi = {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  parentCategoryId?: string;
};

// GET – lấy danh sách danh mục
export async function getCategoriesApi() {
  return request<CategoryApi[]>("/api/categories", {
    method: "GET",
  });
}

// POST – tạo danh mục mới
export async function createCategoryApi(category: Omit<CategoryApi, "id">) {
  return request<CategoryApi>("/api/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });
}

// PUT – cập nhật danh mục
export async function updateCategoryApi(
  id: string,
  updates: Partial<Omit<CategoryApi, "id">>
) {
  return request<CategoryApi>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// DELETE – xóa danh mục
export async function deleteCategoryApi(id: string) {
  return request<null>(`/api/categories/${id}`, {
    method: "DELETE",
  });
}
// ================== BUDGET ==================

export type BudgetApi = {
  id: number;
  month: string; // ISO date string (YYYY-MM-01)
  limitAmount: number;
  alertThreshold: 70 | 80 | 90 | 100;
  notifyInApp: boolean;
  notifyEmail: boolean;
  spentThisMonth?: number;
  percentage?: number;
  isOverThreshold?: boolean;
  isOverLimit?: boolean;
};

// GET /api/budgets/current
export async function getCurrentBudgetApi() {
  return request<BudgetApi | null>("/api/budgets/current", {
    method: "GET",
  });
}

// PUT /api/budgets/current
export async function updateCurrentBudgetApi(payload: {
  limitAmount: number;
  alertThreshold: 70 | 80 | 90 | 100;
  notifyInApp: boolean;
  notifyEmail: boolean;
}) {
  return request<BudgetApi>("/api/budgets/current", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
/* 🔻 THÊM 2 HÀM NÀY CHO LỊCH SỬ + TRUNG TÂM CẢNH BÁO */

// (option) GET /api/budgets/history?months=6
export type BudgetHistoryItemApi = BudgetApi;

export async function getBudgetHistoryApi(months = 6) {
  const params = new URLSearchParams({ months: String(months) });
  return request<BudgetHistoryItemApi[]>(
    `/api/budgets/history?${params.toString()}`,
    { method: "GET" }
  );
}

// GET /api/budgets/alerts?month=&year=
export type BudgetAlertApi = {
  id: number; // id của dòng log (budget_alert_logs.id)
  budgetId: number;
  threshold: number; // 70,80,90,101 (101 = vượt 100%)
  sentOn: string; // 'YYYY-MM-DD'
  channel: "in_app" | "email";
  createdAt: string;
  percentage?: number | null; // nếu bạn join thêm
  spentAmount?: number | null;
  limitAmount?: number | null;
};

export async function getBudgetAlertsApi(params?: {
  month?: number;
  year?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  return request<BudgetAlertApi[]>(`/api/budgets/alerts${suffix}`, {
    method: "GET",
  });
}
// ================== CHATBOT ==================

export type ChatAskResponse = {
  sessionId: string;
  reply: string;
};

// Gửi câu hỏi cho chatbot
export async function chatAskApi(payload: {
  sessionId?: string | null;
  message: string;
}) {
  return request<ChatAskResponse>("/api/chat/ask", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// (tuỳ chọn) Lấy danh sách phiên chat – nếu sau này bạn muốn hiển thị list
export type ChatSessionApi = {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
};

export async function chatListSessionsApi() {
  return request<ChatSessionApi[]>("/api/chat/sessions", {
    method: "GET",
  });
}

// (tuỳ chọn) Lấy chi tiết 1 phiên chat
export type ChatMessageApi = {
  id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export async function chatGetSessionApi(sessionId: string) {
  return request<{
    session: ChatSessionApi;
    messages: ChatMessageApi[];
  }>(`/api/chat/sessions/${sessionId}`, {
    method: "GET",
  });
}

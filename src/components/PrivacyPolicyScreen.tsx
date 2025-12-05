import React from "react";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  FileText,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
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
              Quyền riêng tư
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Cách chúng tôi bảo vệ và xử lý dữ liệu của bạn
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl text-gray-900 dark:text-white mb-4">
                    Quyền riêng tư của bạn là ưu tiên hàng đầu của chúng tôi
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Tại BudgetF, chúng tôi cam kết bảo vệ quyền riêng tư và bảo
                    đảm an toàn cho thông tin cá nhân cũng như tài chính của
                    bạn. Chính sách này giải thích cách chúng tôi thu thập, sử
                    dụng và bảo vệ dữ liệu khi bạn dùng nền tảng theo dõi chi
                    tiêu của chúng tôi.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                    <strong>Cập nhật lần cuối:</strong> 25 tháng 12, 2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Thông tin chúng tôi thu thập</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">
                  Thông tin cá nhân
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Tên và địa chỉ email khi bạn đăng ký tài khoản</li>
                  <li>• Số điện thoại (tùy chọn) để xác minh tài khoản</li>
                  <li>• Thông tin hồ sơ bạn chọn cung cấp</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">
                  Dữ liệu tài chính
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Bản ghi giao dịch bạn nhập thủ công</li>
                  <li>• Các danh mục và ngân sách bạn tạo</li>
                  <li>• Mẫu thu nhập và chi tiêu để phân tích</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">
                  Thông tin sử dụng
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Cách bạn tương tác với nền tảng của chúng tôi</li>
                  <li>• Thông tin thiết bị và loại trình duyệt</li>
                  <li>• Tệp nhật ký và dữ liệu phân tích</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>Cách chúng tôi sử dụng thông tin của bạn</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-gray-900 dark:text-white">
                    Cung cấp dịch vụ
                  </h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Cung cấp các tính năng theo dõi chi tiêu</li>
                    <li>• Tạo báo cáo và phân tích tài chính</li>
                    <li>• Đồng bộ dữ liệu trên các thiết bị của bạn</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-gray-900 dark:text-white">Giao tiếp</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Gửi thông báo tài khoản</li>
                    <li>• Cung cấp hỗ trợ khách hàng</li>
                    <li>• Chia sẻ cập nhật sản phẩm (tùy chọn)</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-gray-900 dark:text-white">
                    Bảo mật & Tuân thủ
                  </h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Ngăn chặn gian lận và lạm dụng</li>
                    <li>• Tuân thủ các yêu cầu pháp lý</li>
                    <li>• Bảo vệ an toàn người dùng</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-gray-900 dark:text-white">Cải tiến</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Phân tích các mẫu sử dụng</li>
                    <li>• Cải thiện dịch vụ của chúng tôi</li>
                    <li>• Phát triển các tính năng mới</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span>Bảo mật dữ liệu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Chúng tôi triển khai các biện pháp bảo mật theo tiêu chuẩn ngành
                để bảo vệ thông tin của bạn:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white mb-2">Mã hóa</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Tất cả dữ liệu được mã hóa khi truyền và lưu trữ sử dụng mã
                    hóa AES-256.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white mb-2">
                    Kiểm soát truy cập
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Các cơ chế kiểm soát truy cập nghiêm ngặt và xác thực bảo vệ
                    dữ liệu của bạn.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white mb-2">
                    Giám sát
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Giám sát liên tục và kiểm tra bảo mật đảm bảo tính toàn vẹn
                    của hệ thống.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Chia sẻ dữ liệu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-blue-900 dark:text-blue-100 mb-2">
                  Chúng tôi không bán dữ liệu cá nhân của bạn
                </h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Thông tin tài chính của bạn không bao giờ được bán cho bên thứ
                  ba cho mục đích tiếp thị hoặc thương mại.
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                Chúng tôi chỉ có thể chia sẻ thông tin hạn chế trong các trường
                hợp sau:
              </p>

              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  • <strong>Nhà cung cấp dịch vụ:</strong> Các đối tác tin cậy
                  giúp chúng tôi vận hành nền tảng
                </li>
                <li>
                  • <strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi pháp
                  luật hoặc để bảo vệ quyền lợi của chúng tôi
                </li>
                <li>
                  • <strong>Chuyển giao doanh nghiệp:</strong> Trong trường hợp
                  sáp nhập, mua lại hoặc bán tài sản
                </li>
                <li>
                  • <strong>Với sự đồng ý của bạn:</strong> Khi bạn rõ ràng ủy
                  quyền chia sẻ dữ liệu
                </li>
              </ul>
            </CardContent>
          </Card>
          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span>Quyền của bạn</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-gray-900 dark:text-white">
                    Truy cập & Di động
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Yêu cầu một bản sao dữ liệu của bạn hoặc xuất nó sang dịch
                    vụ khác.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-gray-900 dark:text-white">Sửa chữa</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Cập nhật hoặc sửa chữa bất kỳ thông tin cá nhân không chính
                    xác nào.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-gray-900 dark:text-white">Xóa bỏ</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Yêu cầu xóa tài khoản và dữ liệu cá nhân của bạn.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-gray-900 dark:text-white">Từ chối</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Hủy đăng ký nhận thông tin tiếp thị bất cứ lúc nào.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <h3 className="text-xl text-gray-900 dark:text-white mb-4">
                Câu hỏi về quyền riêng tư?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Nếu bạn có câu hỏi về chính sách quyền riêng tư này hoặc cách
                chúng tôi xử lý dữ liệu của bạn, vui lòng liên hệ với chúng tôi:
              </p>

              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Email:</strong> 23521774@gm.uit.edu.vn
                </p>
                <p>
                  <strong>Địa chỉ:</strong> Trường Đại học Công nghệ Thông tin,
                </p>
                <p>
                  <strong>Phone:</strong> +84 987 012 617
                </p>
              </div>

              <div className="mt-6">
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-indigo-700"
                >
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

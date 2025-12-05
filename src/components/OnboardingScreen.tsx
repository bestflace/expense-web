import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface OnboardingScreenProps {
  onComplete: () => void;
  language: "vi" | "en";
}

export function OnboardingScreen({
  onComplete,
  language,
}: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides =
    language === "vi"
      ? [
          {
            title: "Chào mừng đến với BudgetF",
            description:
              "Giải pháp quản lý tài chính cá nhân toàn diện, giúp bạn kiểm soát chi tiêu và đạt mục tiêu tài chính.",
            icon: "💰",
            gradient: "from-blue-500 to-indigo-600",
          },
          {
            title: "Theo dõi chi tiêu thông minh",
            description:
              "Ghi chú mọi khoản thu chi, phân loại theo danh mục và ví riêng biệt. Dễ dàng quản lý từng đồng tiền.",
            icon: "📊",
            gradient: "from-purple-500 to-pink-600",
          },
          {
            title: "Thống kê trực quan",
            description:
              "Biểu đồ chi tiết, báo cáo tháng/năm và xuất Excel. Hiểu rõ thói quen chi tiêu của bạn.",
            icon: "📈",
            gradient: "from-green-500 to-emerald-600",
          },
          {
            title: "Cảnh báo ngân sách",
            description:
              "Đặt hạn mức chi tiêu hàng tháng và nhận thông báo khi vượt ngưỡng. Kiểm soát tài chính hiệu quả.",
            icon: "🔔",
            gradient: "from-orange-500 to-red-600",
          },
        ]
      : [
          {
            title: "Welcome to BudgetF",
            description:
              "Comprehensive personal finance solution to help you control spending and achieve financial goals.",
            icon: "💰",
            gradient: "from-blue-500 to-indigo-600",
          },
          {
            title: "Smart Expense Tracking",
            description:
              "Record all transactions, categorize by type and wallet. Easily manage every penny.",
            icon: "📊",
            gradient: "from-purple-500 to-pink-600",
          },
          {
            title: "Visual Statistics",
            description:
              "Detailed charts, monthly/yearly reports and Excel export. Understand your spending habits.",
            icon: "📈",
            gradient: "from-green-500 to-emerald-600",
          },
          {
            title: "Budget Alerts",
            description:
              "Set monthly spending limits and receive notifications when exceeding threshold. Control finances effectively.",
            icon: "🔔",
            gradient: "from-orange-500 to-red-600",
          },
        ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              className={`bg-gradient-to-br ${currentSlideData.gradient} p-12 text-white relative overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />

              <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{
                    scale: { duration: 0.5 },
                    rotate: { duration: 2, repeat: Infinity, repeatDelay: 1 },
                  }}
                  className="text-8xl mb-6"
                >
                  {currentSlideData.icon}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl mb-4"
                >
                  {currentSlideData.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl text-white/90"
                >
                  {currentSlideData.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 p-8">
            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-8 bg-gradient-to-r from-blue-500 to-indigo-600"
                      : "w-2 bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  disabled={currentSlide === 0}
                  className="w-full h-14 text-lg border-2"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  {language === "vi" ? "Quay lại" : "Previous"}
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  onClick={handleNext}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 shadow-lg"
                >
                  {isLastSlide
                    ? language === "vi"
                      ? "Bắt đầu"
                      : "Get Started"
                    : language === "vi"
                    ? "Tiếp theo"
                    : "Next"}
                  {!isLastSlide && <ChevronRight className="w-5 h-5 ml-2" />}
                </Button>
              </motion.div>
            </div>

            {/* Skip Button */}
            <AnimatePresence>
              {!isLastSlide && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onComplete}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {language === "vi" ? "Bỏ qua" : "Skip"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-gray-600 dark:text-gray-400"
        >
          <p className="text-sm">BudgetF v1.0.0</p>
          <p className="text-xs mt-1">
            {language === "vi"
              ? "Quản lý tài chính thông minh hơn mỗi ngày"
              : "Smarter financial management every day"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

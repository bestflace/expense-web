import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface OnboardingScreenProps {
  onComplete: () => void;
  language: "vi" | "en";
}

type Slide = {
  title: string;
  description: string;
  icon?: string;
};

export function OnboardingScreen({
  onComplete,
  language,
}: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] =
    language === "vi"
      ? [
          {
            title: "Chào mừng đến với BudgetF",
            description:
              "Giải pháp quản lý tài chính cá nhân toàn diện, giúp bạn kiểm soát chi tiêu và đạt mục tiêu tài chính.",
            // icon: "🌠",
          },
          {
            title: "Theo dõi thu chi thông minh",
            description:
              "Ghi chú mọi khoản thu chi, phân loại theo danh mục và ví riêng biệt. Dễ dàng quản lý từng đồng tiền.",
            // icon: "🧾💸",
          },
          {
            title: "Thống kê trực quan",
            description:
              "Biểu đồ chi tiết, báo cáo tháng/năm và xuất Excel. Hiểu rõ thói quen chi tiêu của bạn.",
            // icon: "📊✨",
          },
          {
            title: "Cảnh báo ngân sách",
            description:
              "Đặt hạn mức chi tiêu hàng tháng và nhận thông báo khi vượt ngưỡng. Kiểm soát tài chính hiệu quả.",
            // icon: "⚠️🔔",
          },
        ]
      : [
          {
            title: "Welcome to BudgetF",
            description:
              "Comprehensive personal finance solution to help you control spending and achieve financial goals.",
            icon: "🌠",
          },
          {
            title: "Smart Expense Tracking",
            description:
              "Record all transactions, categorize by type and wallet. Easily manage every penny.",
            icon: "🧾💸",
          },
          {
            title: "Visual Statistics",
            description:
              "Detailed charts, monthly/yearly reports and Excel export. Understand your spending habits.",
            icon: "📊✨",
          },
          {
            title: "Budget Alerts",
            description:
              "Set monthly spending limits and receive notifications when exceeding threshold. Control finances effectively.",
            icon: "⚠️🔔",
          },
        ];

  // ✅ gradient cho từng slide (header)
  const headerBg: string[] = [
    "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #6d28d9 100%)",
    "linear-gradient(135deg, #d946ef 0%, #ec4899 50%, #f43f5e 100%)",
    "linear-gradient(135deg, #10b981 0%, #0d9488 50%, #15803d 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #ea580c 55%, #e11d48 100%)",
  ];

  // ✅ LẤY ĐÚNG GRADIENT THEO SLIDE HIỆN TẠI
  const currentGradient = headerBg[currentSlide];

  // (tuỳ chọn) gradient mềm cho dots
  const currentGradientSoft = headerBg[currentSlide].replace("135deg", "90deg");

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide((s) => s + 1);
    else onComplete();
  };

  const handlePrevious = () => {
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  };

  const current = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 sm:p-6 md:p-8 pb-10">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="bg-white/90 dark:bg-gray-900/85 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60 dark:border-white/10"
        >
          {/* HEADER */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -120 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="relative px-6 sm:px-10 md:px-14 py-12 md:py-16 text-white"
              style={{
                minHeight: "46vh",
                background: currentGradient,
              }}
            >
              {/* overlay */}
              <div className="absolute inset-0 bg-black/10" />

              {/* pattern sao */}
              <motion.div
                className="absolute inset-0 opacity-15"
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />

              <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                {/* icon badge */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className="mx-auto w-fit"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="rounded-3xl bg-white/15 backdrop-blur-md px-7 py-6 md:px-9 md:py-7 shadow-[0_12px_50px_rgba(0,0,0,0.25)]"
                  >
                    <div className="text-6xl md:text-7xl lg:text-8xl">
                      {current.icon}
                    </div>
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight drop-shadow-sm"
                >
                  {current.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-sm"
                >
                  {current.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* CONTROLS */}
          <div className="bg-white dark:bg-gray-900 px-5 sm:px-8 md:px-10 py-6 md:py-8">
            {/* dots đổi màu theo slide */}
            <div className="flex justify-center gap-2.5 mb-6">
              {slides.map((_, index) => {
                const active = index === currentSlide;
                return (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-2.5 rounded-full transition-all ${
                      active ? "w-9 shadow-md" : "w-2.5 bg-muted"
                    }`}
                    style={
                      active ? { background: currentGradientSoft } : undefined
                    }
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Previous */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  disabled={currentSlide === 0}
                  className="w-full h-12 md:h-14 text-base md:text-lg border-2 rounded-xl
                             border-input bg-background text-foreground
                             hover:bg-accent hover:text-accent-foreground"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  {language === "vi" ? "Quay lại" : "Previous"}
                </Button>
              </motion.div>

              {/* Next / Get started đổi màu theo slide */}
              <motion.div
                whileHover={{ scale: 1.01, filter: "brightness(0.96)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleNext}
                  className="w-full h-12 md:h-14 text-base md:text-lg rounded-xl text-white shadow-lg"
                  style={{ background: currentGradient }}
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

            {!isLastSlide && (
              <div className="text-center mt-4">
                <button
                  onClick={onComplete}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {language === "vi" ? "Bỏ qua" : "Skip"}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-center mt-8 md:mt-10 text-gray-600 dark:text-gray-400"
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

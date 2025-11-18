import React, { useState } from "react";
import { DollarSign, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import type { Budget } from "../App";

type AlertThreshold = 70 | 80 | 90 | 100;
interface BudgetSetupDialogProps {
  onComplete: (monthlyLimit: number, warningThreshold: AlertThreshold) => void;
}

export function BudgetSetupDialog({ onComplete }: BudgetSetupDialogProps) {
  const [monthlyLimit, setMonthlyLimit] = useState("2000000");
  const [warningThreshold, setWarningThreshold] = useState<AlertThreshold>(80);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(monthlyLimit);
    if (limit <= 0 || isNaN(limit)) {
      return;
    }
    onComplete(limit, warningThreshold);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-foreground">Thiết lập ngân sách</h2>
              <p className="text-muted-foreground text-sm">
                Hoàn tất thiết lập tài khoản
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Thiết lập ngân sách hàng tháng để theo dõi chi tiêu của bạn. Bạn
                sẽ nhận được cảnh báo khi chi tiêu vượt quá ngưỡng bạn đã chọn.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyLimit">Ngân sách hàng tháng (₫)</Label>
            <div className="relative">
              <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="monthlyLimit"
                type="number"
                step="1000"
                min="1000"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                placeholder="2000000"
                className="pl-10 h-12"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Đây là số tiền tối đa bạn muốn chi tiêu mỗi tháng
            </p>
          </div>

          <div className="space-y-3">
            <Label>Ngưỡng cảnh báo vượt hạn mức</Label>
            <RadioGroup
              value={String(warningThreshold)}
              onValueChange={(val: string) =>
                setWarningThreshold(Number(val) as AlertThreshold)
              }
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="70" id="threshold-70" />
                  <Label
                    htmlFor="threshold-70"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span>70%</span>
                      <span className="text-xs text-muted-foreground">
                        Cảnh báo sớm
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="80" id="threshold-80" />
                  <Label
                    htmlFor="threshold-80"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span>80%</span>
                      <span className="text-xs text-muted-foreground">
                        Khuyên dùng
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="90" id="threshold-90" />
                  <Label
                    htmlFor="threshold-90"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span>90%</span>
                      <span className="text-xs text-muted-foreground">
                        Cảnh báo muộn
                      </span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="100" id="threshold-100" />
                  <Label
                    htmlFor="threshold-100"
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span>100%</span>
                      <span className="text-xs text-muted-foreground">
                        Chỉ khi vượt quá
                      </span>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Bạn sẽ nhận được thông báo khi chi tiêu đạt {warningThreshold}%
              ngân sách
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            Hoàn tất thiết lập
          </Button>
        </form>
      </div>
    </div>
  );
}

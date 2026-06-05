export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

export function validateBloodPressure(
  systolic: string,
  diastolic: string,
  pulse: string,
  memo: string
): ValidationResult {
  const errors: Record<string, string> = {};

  const sys = parseInt(systolic, 10);
  if (!systolic.trim()) {
    errors.systolic = "上の血圧を入力してください";
  } else if (isNaN(sys) || sys <= 0) {
    errors.systolic = "上の血圧は正の整数で入力してください";
  }

  const dia = parseInt(diastolic, 10);
  if (!diastolic.trim()) {
    errors.diastolic = "下の血圧を入力してください";
  } else if (isNaN(dia) || dia <= 0) {
    errors.diastolic = "下の血圧は正の整数で入力してください";
  }

  if (pulse.trim()) {
    const pul = parseInt(pulse, 10);
    if (isNaN(pul) || pul <= 0) {
      errors.pulse = "脈拍は正の整数で入力してください";
    }
  }

  if (memo.length > 200) {
    errors.memo = "メモは200文字以内で入力してください";
  }

  if (!errors.systolic && !errors.diastolic && sys <= dia) {
    errors.systolic = "上の血圧は下の血圧より大きい値を入力してください";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

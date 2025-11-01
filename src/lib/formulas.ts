export type Unit = "lb" | "kg";
export type Sex = "male" | "female";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "athlete";

export const LB_PER_KG = 2.2046226218;
export const KG_PER_LB = 0.45359237;

export const toLb = (v: number, unit: Unit) => (unit === "kg" ? v * LB_PER_KG : v);
export const toKg = (v: number, unit: Unit) => (unit === "lb" ? v * KG_PER_LB : v);

export const display = (lbValue: number, unit: Unit, dp = 1) =>
  unit === "kg" ? (lbValue * KG_PER_LB).toFixed(dp) : lbValue.toFixed(dp);

// BMI uses kg/m^2 ; height in inches -> meters
export const inToCm = (inch: number) => inch * 2.54;
export const lbToKg = (lb: number) => lb * KG_PER_LB;

export function bmiFromLbIn(weightLb: number, heightIn: number) {
  const kg = lbToKg(weightLb);
  const m = inToCm(heightIn) / 100;
  if (!kg || !m) return 0;
  return kg / (m * m);
}

// Deurenberg: BF% = 1.20*BMI + 0.23*age - 10.8*sex - 5.4  (sex: male=1, female=0)
export function bodyFatFromBMI(bmi: number, age: number, sex: Sex) {
  if (!bmi || !age) return 0;
  const s = sex === "male" ? 1 : 0;
  return 1.20 * bmi + 0.23 * age - 10.8 * s - 5.4;
}

// Mifflin-St Jeor (input lbs/in)
export function bmr(weightLb: number, heightIn: number, age: number, sex: Sex) {
  const w = lbToKg(weightLb), h = inToCm(heightIn);
  const s = sex === "male" ? 5 : -161;
  return Math.round(10*w + 6.25*h - 5*age + s);
}
export function tdee(bmr: number, activity: Activity = "moderate") {
  const map: Record<Activity, number> = {
    sedentary:1.2, light:1.375, moderate:1.55, active:1.725, athlete:1.9
  };
  return Math.round(bmr * map[activity]);
}

// Calories required to lose/gain weight over days
// 1 lb ≈ 3500 kcal ; 1 kg ≈ 7700 kcal
export const KCAL_PER_LB = 3500;
export const KCAL_PER_KG = 7700;
export function deficitPerDay(fromLb: number, days: number) {
  if (days <= 0) return 0;
  return Math.max(0, (fromLb * KCAL_PER_LB) / days);
}

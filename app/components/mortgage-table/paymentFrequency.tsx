export enum PaymentFrequency {
  Monthly = "Monthly",
  // divide monthly payment in 2 and pay 26 times a year. 2 extra payments per year or 1 extra monthly payment.
  AcceleratedBiWeekly = "Accelerated Bi-weekly",
  // monthly mortgage payment * 12 / 26
  BiWeekly = "Bi-weekly",
  // divide monthly payment in 4 and pay 52 times a year. 4 extra payments per year or 1 extra weekly payment.
  AcceleratedWeekly = "Accelerated weekly",
  // monthly mortgage payment * 12 / 52
  Weekly = "Weekly",
}

export function numberOfPaymentsPerYear(
  paymentFrequency: PaymentFrequency,
): number {
  switch (paymentFrequency) {
    case PaymentFrequency.Monthly:
      return 12;
    case PaymentFrequency.AcceleratedBiWeekly:
    case PaymentFrequency.BiWeekly:
      return 26;
    case PaymentFrequency.AcceleratedWeekly:
    case PaymentFrequency.Weekly:
      return 52;
  }
}

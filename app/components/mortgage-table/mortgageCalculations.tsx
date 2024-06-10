import Decimal from "decimal.js";
import { PaymentFrequency } from "./paymentFrequency";
/**
 * Converts mortgage quote rate to annual rate. The annual rate compounds semi-annually.
 *
 * @export
 * @param {Decimal} quotedRate - The quoted mortgage rate
 * @returns {Decimal} Annual interest rate
 */
export function convertQuotedRateToAnnual(quotedRate: Decimal): Decimal {
  // mortgages compound semi-annually
  // (1 + interestRate / 2) ** 2 - 1;
  return quotedRate.div(2).plus(1).pow(2).minus(1);
}

/**
 * Converts annual interst rate to a monthly interest rate
 *
 * @export
 * @param {Decimal} annualInterestRate
 * @returns {Decimal}
 */
export function convertAnnaulInterestToMonthly(
  annualInterestRate: Decimal,
): Decimal {
  // (1 + interestRate) ** (1/12) - 1;
  return annualInterestRate
    .plus(1)
    .pow(1 / 12)
    .minus(1);
}

function convertMonthlyPaymentToPaymentFrequency(
  monthlyPayment: Decimal,
  paymentFrequency: PaymentFrequency,
): Decimal {
  switch (paymentFrequency) {
    case PaymentFrequency.Monthly:
      return monthlyPayment;
    case PaymentFrequency.AcceleratedBiWeekly:
      return monthlyPayment.div(2);
    case PaymentFrequency.BiWeekly:
      return monthlyPayment.times(12).div(26);
    case PaymentFrequency.AcceleratedWeekly:
      return monthlyPayment.div(4);
    case PaymentFrequency.Weekly:
      return monthlyPayment.times(12).div(52);
  }
}

function convertMonthlyInterestToPaymentFrequencyInterest(
  monthlyInterestRate: Decimal,
  paymentFrequency: PaymentFrequency,
): Decimal {
  switch (paymentFrequency) {
    case PaymentFrequency.Monthly:
      return monthlyInterestRate;
    case PaymentFrequency.AcceleratedBiWeekly:
    case PaymentFrequency.BiWeekly:
      return monthlyInterestRate
        .add(1)
        .pow(12 / 26)
        .minus(1);
    case PaymentFrequency.AcceleratedWeekly:
    case PaymentFrequency.Weekly:
      return monthlyInterestRate
        .add(1)
        .pow(12 / 52)
        .minus(1);
  }
}

export interface AmortizationScheduleParameters {
  principal: Decimal;
  quotedInterestRate: Decimal;
  amortizationPeriod: number;
  paymentFrequency: PaymentFrequency;
}
export interface AmortizationScheduleEntry {
  paymentNumber: number;
  periodicPayment: Decimal;
  interestPayment: Decimal;
  principalPayment: Decimal;
  remainingPrincipal: Decimal;
}

export function calculateAmortizationSchedule({
  principal,
  quotedInterestRate,
  amortizationPeriod,
  paymentFrequency,
}: AmortizationScheduleParameters): AmortizationScheduleEntry[] {
  const annualInterestRate = convertQuotedRateToAnnual(quotedInterestRate);
  const monthlyInterestRate =
    convertAnnaulInterestToMonthly(annualInterestRate);
  const monthsToAmortization = 12 * amortizationPeriod;
  const monthlyPeriodicPayment = principal
    .times(monthlyInterestRate)
    .div(
      new Decimal(1).minus(
        monthlyInterestRate.add(1).pow(-monthsToAmortization),
      ),
    );
  const periodicPayment = convertMonthlyPaymentToPaymentFrequency(
    monthlyPeriodicPayment,
    paymentFrequency,
  ).toNearest(0.01, Decimal.ROUND_HALF_UP);
  const paymentFrequencyInterestRate =
    convertMonthlyInterestToPaymentFrequencyInterest(
      monthlyInterestRate,
      paymentFrequency,
    );
  console.log("monthlyPeriodicPayment", monthlyPeriodicPayment.toString());
  console.log("periodicPayment", periodicPayment.toString());
  console.log(
    "paymentFrequencyInterestRate",
    paymentFrequencyInterestRate.toString(),
  );
  const amortizationSchedule: AmortizationScheduleEntry[] = [];
  let remainingPrincipal = principal;
  let i = 1;
  while (remainingPrincipal.greaterThan(0)) {
    const interestPayment = remainingPrincipal
      .times(paymentFrequencyInterestRate)
      .toNearest(0.01, Decimal.ROUND_HALF_UP);
    let principalPayment;
    if (remainingPrincipal.lessThan(periodicPayment)) {
      principalPayment = remainingPrincipal;
    } else {
      principalPayment = periodicPayment.minus(interestPayment);
    }
    remainingPrincipal = remainingPrincipal.minus(principalPayment);
    amortizationSchedule.push({
      paymentNumber: i++,
      periodicPayment: principalPayment.add(interestPayment),
      interestPayment,
      principalPayment,
      remainingPrincipal,
    });
  }
  return amortizationSchedule;
}

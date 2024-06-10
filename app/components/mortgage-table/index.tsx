import Table from "@mui/joy/Table";
import Decimal from "decimal.js";
import { memo } from "react";
import {
  AmortizationScheduleParameters,
  calculateAmortizationSchedule,
} from "./mortgageCalculations";
const formatter = new Intl.NumberFormat("default", {
  style: "currency",
  currency: "USD",
});

// interface MortgageTableProps {
//   principal: Decimal;
//   quotedInterestRate: Decimal;
//   amortizationPeriod: number;
//   paymentFrequency: PaymentFrequency;
// }
export default memo(function MortgageTable(
  amortizationScheduleParameters: AmortizationScheduleParameters,
) {
  const {
    principal,
    quotedInterestRate,
    amortizationPeriod,
    paymentFrequency,
  } = amortizationScheduleParameters;
  const amortizationSchedule = calculateAmortizationSchedule({
    principal,
    quotedInterestRate,
    amortizationPeriod,
    paymentFrequency,
  });
  const totalPeriodicPayments = amortizationSchedule.reduce(
    (total, entry) => total.plus(entry.periodicPayment),
    new Decimal(0),
  );
  const totalInterestPayment = amortizationSchedule.reduce(
    (total, entry) => total.plus(entry.interestPayment),
    new Decimal(0),
  );
  const totalPrincipalPayments = amortizationSchedule.reduce(
    (total, entry) => total.plus(entry.principalPayment),
    new Decimal(0),
  );
  console.log("computing table...");
  return (
    <Table
      borderAxis="xBetween"
      stickyHeader
      sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}
    >
      <caption>Amortization Schedule.</caption>
      <thead>
        <tr>
          {/* <th style={{ width: "40%" }}>Menu</th> */}
          <th>Payment Number</th>
          <th>{paymentFrequency} Payment</th>
          <th>Interest Payment</th>
          <th>Principal Payment</th>
          <th>Remaining Principal</th>
        </tr>
      </thead>
      <tbody>
        {amortizationSchedule.map((amortizationScheduleEntry) => (
          <tr key={amortizationScheduleEntry.paymentNumber}>
            <td>{amortizationScheduleEntry.paymentNumber}</td>
            <td>
              {formatter.format(
                amortizationScheduleEntry.periodicPayment.toNumber(),
              )}
            </td>
            <td>
              {formatter.format(
                amortizationScheduleEntry.interestPayment.toNumber(),
              )}
            </td>
            <td>
              {formatter.format(
                amortizationScheduleEntry.principalPayment.toNumber(),
              )}
            </td>
            <td>
              {formatter.format(
                amortizationScheduleEntry.remainingPrincipal.toNumber(),
              )}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Totals</th>
          <td>{formatter.format(totalPeriodicPayments.toNumber())}</td>
          <td>{formatter.format(totalInterestPayment.toNumber())}</td>
          <td>{formatter.format(totalPrincipalPayments.toNumber())}</td>
          <td></td>
        </tr>
      </tfoot>
    </Table>
  );
});

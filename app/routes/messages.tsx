/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Button, Container, Typography } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select, { selectClasses } from "@mui/joy/Select";
import Decimal from "decimal.js";
import { useState } from "react";
import MortgageTable from "../components/mortgage-table";
import { AmortizationScheduleParameters } from "../components/mortgage-table/mortgageCalculations";
import { PaymentFrequency } from "../components/mortgage-table/paymentFrequency";
import { usePageEffect } from "../core/page";
import { useLocalStorage } from "../utils/useLocalStorage";

const INCOME = "income";
const HOUSE_VALUE = "houseValue";
const PRINCIPAL = "principal";
const INTEREST_RATE = "interestRate";
const AMORTIZATION_PERIOD = "amortizationPeriod";
const PAYMENT_FREQUENCY = "paymentFrequency";

export const Component = function Messages(): JSX.Element {
  usePageEffect({ title: "Messages" });

  const [income, setIncome] = useLocalStorage(INCOME, "");
  const [houseValue, setHouseValue] = useLocalStorage(HOUSE_VALUE, "");
  const [principal, setPrincipal] = useLocalStorage(PRINCIPAL, "");
  const [interestRate, setInterestRate] = useLocalStorage(INTEREST_RATE, "");
  const [amortizationPeriod, setAmortizationPeriod] = useLocalStorage(
    AMORTIZATION_PERIOD,
    "25",
  );
  const [paymentFrequency, setPaymentFrequency] = useLocalStorage(
    PAYMENT_FREQUENCY,
    PaymentFrequency.Monthly,
  );
  const [amortizationScheduleParameters, setAmortizationScheduleParameters] =
    useState({
      principal: new Decimal(0),
      quotedInterestRate: new Decimal(0),
      amortizationPeriod: 0,
      paymentFrequency: PaymentFrequency.Monthly,
    } as AmortizationScheduleParameters);

  return (
    <Container sx={{ py: 2 }}>
      <Typography level="h2" gutterBottom>
        Messages
      </Typography>
      <FormControl>
        <FormLabel>Income</FormLabel>
        <Input
          variant="outlined"
          type="number"
          slotProps={{
            input: {
              min: 0,
              step: 5000,
              value: income,
            },
          }}
          startDecorator="$"
          onChange={(e) => setIncome(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>House Value</FormLabel>
        <Input
          variant="outlined"
          type="number"
          slotProps={{
            input: {
              min: 0,
              step: 5000,
              value: houseValue,
            },
          }}
          startDecorator="$"
          onChange={(e) => setHouseValue(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Mortgage Principal</FormLabel>
        <Input
          variant="outlined"
          type="number"
          slotProps={{
            input: {
              min: 1,
              step: 5000,
              value: principal,
            },
          }}
          startDecorator="$"
          onChange={(e) => setPrincipal(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Mortgage Interest Rate</FormLabel>
        <Input
          variant="outlined"
          type="number"
          slotProps={{
            input: {
              min: 0.01,
              max: 100,
              step: 0.01,
              value: interestRate,
            },
          }}
          endDecorator="%"
          onChange={(e) => setInterestRate(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Mortgage Payment Frequency</FormLabel>
        <Select
          placeholder="Select a payment frequency…"
          indicator={<KeyboardArrowDown />}
          sx={{
            // width: 240,
            [`& .${selectClasses.indicator}`]: {
              transition: "0.2s",
              [`&.${selectClasses.expanded}`]: {
                transform: "rotate(-180deg)",
              },
            },
          }}
          value={paymentFrequency}
          onChange={(
            event: React.SyntheticEvent | null,
            newValue: string | null,
          ) => setPaymentFrequency(newValue as PaymentFrequency)}
        >
          <Option value={PaymentFrequency.Monthly}>Monthly</Option>
          <Option value={PaymentFrequency.AcceleratedBiWeekly}>
            Accelerated Bi-weekly
          </Option>
          <Option value={PaymentFrequency.BiWeekly}>Bi-weekly</Option>
          <Option value={PaymentFrequency.AcceleratedWeekly}>
            Accelerated weekly
          </Option>
          <Option value={PaymentFrequency.Weekly}>Weekly</Option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Amoritzation Period</FormLabel>
        <Input
          variant="outlined"
          type="number"
          slotProps={{
            input: {
              min: 1,
              max: 30,
              step: 1,
              value: Number(amortizationPeriod),
            },
          }}
          endDecorator="years"
          onChange={(e) => setAmortizationPeriod(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <Button
          onClick={() =>
            setAmortizationScheduleParameters({
              principal: new Decimal(principal),
              quotedInterestRate: new Decimal(interestRate).div(100),
              amortizationPeriod: amortizationPeriod,
              paymentFrequency: paymentFrequency,
            })
          }
        >
          Calculate Amortization Schedule
        </Button>
      </FormControl>
      {amortizationScheduleParameters !== null && (
        <MortgageTable
          principal={amortizationScheduleParameters.principal}
          quotedInterestRate={amortizationScheduleParameters.quotedInterestRate}
          amortizationPeriod={amortizationScheduleParameters.amortizationPeriod}
          paymentFrequency={amortizationScheduleParameters.paymentFrequency}
        />
      )}
    </Container>
  );
};

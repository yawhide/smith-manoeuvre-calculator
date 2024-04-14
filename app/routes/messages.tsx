/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Container, Typography } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select, { selectClasses } from "@mui/joy/Select";
import Decimal from "decimal.js";
import { useState } from "react";
import MortgageTable from "../components/mortgage-table";
import { PaymentFrequency } from "../components/mortgage-table/paymentFrequency";
import { usePageEffect } from "../core/page";

export const Component = function Messages(): JSX.Element {
  usePageEffect({ title: "Messages" });
  // const inputRef = useRef<HTMLInputElement | null>(null);
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [amortizationPeriod, setAmortizationPeriod] = useState(25);
  const [paymentFrequency, setPaymentFrequency] = useState(
    PaymentFrequency.Monthly,
  );

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
            },
          }}
          startDecorator="$"
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
            },
          }}
          startDecorator="$"
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
          onChange={(e) => {
            setPrincipal(e.target.value);
          }}
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
              value: amortizationPeriod,
            },
          }}
          endDecorator="years"
          onChange={(e) => setAmortizationPeriod(Number(e.target.value))}
        />
      </FormControl>
      {!!principal &&
        !!interestRate &&
        !!amortizationPeriod &&
        paymentFrequency !== null && (
          <MortgageTable
            principal={new Decimal(principal)}
            interestRate={new Decimal(interestRate).div(100)}
            amortizationPeriod={amortizationPeriod}
            paymentFrequency={paymentFrequency}
          />
        )}
    </Container>
  );
};

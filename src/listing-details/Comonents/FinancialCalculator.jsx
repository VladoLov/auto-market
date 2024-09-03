import InputField from "@/add-listening/components/InputField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function FinancialCalculator({ carDetail }) {
  const [carPrice, setCarPrice] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState();

  function calculateMonthlyPayment() {
    console.log(carPrice, interestRate, loanTerm, downPayment);
    const Principal = carPrice - downPayment;
    const MonthlyInterestRate = interestRate / 1200; //convert to decimal

    const MonthlyPayment =
      (Principal *
        MonthlyInterestRate *
        Math.pow(1 + MonthlyInterestRate, loanTerm)) /
      (Math.pow(1 + MonthlyInterestRate, loanTerm) - 1);

    console.log(MonthlyPayment.toFixed(2));
    setMonthlyPayment(MonthlyPayment.toFixed(2));
  }
  return (
    <div className="p-10 border shadow-md rounded-xl mt-7">
      <h2 className="font-medium text-2xl">Financial Calculator</h2>
      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <label htmlFor="">Price $</label>
          <Input type="number" onChange={(e) => setCarPrice(e.target.value)} />
        </div>
        <div className="w-full">
          <label htmlFor="">Interest Rate</label>
          <Input
            type="number"
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-5 mt-5">
        <div className="w-full">
          <label htmlFor="">Loan Term (Months)</label>
          <Input type="number" onChange={(e) => setLoanTerm(e.target.value)} />
        </div>
        <div className="w-full">
          <label htmlFor="">Down Payment</label>
          <Input
            type="number"
            onChange={(e) => setDownPayment(e.target.value)}
          />
        </div>
      </div>
      {monthlyPayment != 0 && (
        <h2 className="font-medium text-2xl mt-5">
          Your Monthly Payment Is:
          <span className="text-2xl font-bold"> ${monthlyPayment}</span>
        </h2>
      )}
      <Button className="w-full size-lg mt-5" onClick={calculateMonthlyPayment}>
        Calculate
      </Button>
    </div>
  );
}

export default FinancialCalculator;

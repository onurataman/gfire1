
'use client';

import type { ChangeEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, Percent, Users, RotateCcw } from 'lucide-react';

const DEFAULT_TIP_PERCENTAGE = 15;
const DEFAULT_NUMBER_OF_PEOPLE = 1;

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(DEFAULT_TIP_PERCENTAGE);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(DEFAULT_NUMBER_OF_PEOPLE);
  const [customTipActive, setCustomTipActive] = useState<boolean>(false);

  const [tipAmount, setTipAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [amountPerPerson, setAmountPerPerson] = useState<number>(0);

  const calculateValues = useCallback(() => {
    const bill = parseFloat(billAmount);
    const tipPercent = parseFloat(tipPercentage.toString()); // Ensure tipPercentage is treated as float
    const people = parseInt(numberOfPeople.toString(), 10);

    if (isNaN(bill) || bill <= 0) {
      setTipAmount(0);
      setTotalAmount(0);
      setAmountPerPerson(0);
      return;
    }

    const calculatedTip = bill * (tipPercent / 100);
    const calculatedTotal = bill + calculatedTip;
    
    setTipAmount(calculatedTip);
    setTotalAmount(calculatedTotal);

    if (people > 0) {
      setAmountPerPerson(calculatedTotal / people);
    } else {
      setAmountPerPerson(0);
    }
  }, [billAmount, tipPercentage, numberOfPeople]);

  useEffect(() => {
    calculateValues();
  }, [calculateValues]);

  const handleBillAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBillAmount(e.target.value);
  };

  const handleTipSelection = (percentage: number) => {
    setTipPercentage(percentage);
    setCustomTipActive(false);
  };

  const handleCustomTipChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTipPercentage(isNaN(value) || value < 0 ? 0 : value);
    setCustomTipActive(true);
  };
  
  const handleNumberOfPeopleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setNumberOfPeople(isNaN(value) || value < 1 ? 1 : value);
  };

  const handleReset = useCallback(() => {
    setBillAmount('');
    setTipPercentage(DEFAULT_TIP_PERCENTAGE);
    setNumberOfPeople(DEFAULT_NUMBER_OF_PEOPLE);
    setCustomTipActive(false);
    // Calculated values will be reset by useEffect
  }, []);

  const tipPercentages = [10, 15, 18, 20, 25];

  return (
    <Card className="w-full max-w-lg shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">TipEase</CardTitle>
        <CardDescription className="text-center">
          Calculate tips and split bills with ease.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="billAmount" className="font-medium">Bill Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="billAmount"
              type="number"
              placeholder="0.00"
              value={billAmount}
              onChange={handleBillAmountChange}
              className="pl-10 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipPercentage" className="font-medium">Select Tip %</Label>
          <div className="grid grid-cols-3 gap-2">
            {tipPercentages.map((p) => (
              <Button
                key={p}
                type="button"
                variant={tipPercentage === p && !customTipActive ? 'default' : 'outline'}
                onClick={() => handleTipSelection(p)}
                className="text-md"
              >
                {p}%
              </Button>
            ))}
             <div className="relative">
              <Input
                id="customTip"
                type="number"
                placeholder="Custom"
                value={customTipActive ? (tipPercentage === 0 && billAmount !== '' ? '' : tipPercentage) : ''}
                onChange={handleCustomTipChange}
                onFocus={() => setCustomTipActive(true)}
                className="text-md h-full text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
               <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfPeople" className="font-medium">Number of People</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="numberOfPeople"
              type="number"
              value={numberOfPeople}
              onChange={handleNumberOfPeopleChange}
              className="pl-10 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="1"
              step="1"
            />
          </div>
        </div>

        <div className="mt-8 space-y-4 rounded-lg bg-secondary p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium text-secondary-foreground">Tip Amount</p>
              {numberOfPeople > 1 && <p className="text-xs text-muted-foreground">Total tip for the bill</p>}
            </div>
            <p className="text-2xl font-bold text-primary">${tipAmount.toFixed(2)}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-secondary-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</p>
          </div>

          {numberOfPeople >= 1 && ( // Always show, even for 1 person for consistency
            <div className="flex items-center justify-between border-t border-primary/20 pt-4 mt-4">
              <div>
                <p className="text-lg font-medium text-secondary-foreground">Amount per Person</p>
              </div>
              <p className="text-2xl font-bold text-primary">${amountPerPerson.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={handleReset} className="w-full text-lg py-6">
          <RotateCcw className="mr-2 h-5 w-5" /> Reset
        </Button>
      </CardFooter>
    </Card>
  );
}

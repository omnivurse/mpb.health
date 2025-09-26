"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorSchema, CalculatorForm } from "@/lib/schema";
import { loadRateTables } from "@/lib/rateConfig";
import { resolvePrice, attachComparison } from "@/lib/rateEngine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { US_STATES } from "@/lib/ageBands";
import PayNowChips from "./PayNowChips2";

const PRODUCTS = ["Essentials","Direct","Care Plus","Secure HSA","Premium Care","Premium HSA"] as const;

export default function RateCalculator() {
  const [result, setResult] = useState<null | ReturnType<typeof attachComparison>>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState } = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: { product: "Essentials", state: "FL", age: 40, tobacco: "No" }
  });

  const onSubmit = async (data: CalculatorForm) => {
    setIsLoading(true);
    try {
      const tables = await loadRateTables();
      const r0 = resolvePrice(tables, { 
        product: data.product, 
        state: data.state, 
        age: data.age, 
        tobacco: data.tobacco 
      });
      const r = attachComparison(r0, data.currentMonthly as any);
      setResult(r);
    } catch (error) {
      console.error('Rate calculation error:', error);
      // Could set error state here
    } finally {
      setIsLoading(false);
    }
  };

  const stateOptions = Object.entries(US_STATES).map(([code, name]) => ({ code, name }));

  return (
    <Card aria-live="polite">
      <CardHeader>
        <CardTitle>Calculate Your Rate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product */}
          <div>
            <label className="block text-sm font-medium mb-1">Plan</label>
            <Select defaultValue={watch("product")} onValueChange={(v)=>setValue("product", v as any, { shouldValidate: true })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRODUCTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            {formState.errors.product && (
              <p className="text-sm text-red-500 mt-1">{formState.errors.product.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <Select defaultValue={watch("state")} onValueChange={(v)=>setValue("state", v, { shouldValidate: true })}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {stateOptions.map(({ code, name }) => (
                  <SelectItem key={code} value={code}>{name} ({code})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState.errors.state && (
              <p className="text-sm text-red-500 mt-1">{formState.errors.state.message}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <Input type="number" min={0} max={120} {...register("age", { valueAsNumber: true })} />
            {formState.errors.age && (
              <p className="text-sm text-red-500 mt-1">{formState.errors.age.message}</p>
            )}
          </div>

          {/* Tobacco */}
          <div>
            <label className="block text-sm font-medium mb-1">Tobacco use</label>
            <Select defaultValue={watch("tobacco")} onValueChange={(v)=>setValue("tobacco", v as any, { shouldValidate: true })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
            {formState.errors.tobacco && (
              <p className="text-sm text-red-500 mt-1">{formState.errors.tobacco.message}</p>
            )}
          </div>

          {/* Current Monthly */}
          <div>
            <label className="block text-sm font-medium mb-1">What you're paying now (per month) — optional</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 select-none">$</span>
              <Input inputMode="decimal" placeholder="e.g., 800" className="pl-7 text-right" {...register("currentMonthly")} />
            </div>
            {formState.errors.currentMonthly && (
              <p className="text-sm text-red-500 mt-1">{formState.errors.currentMonthly.message}</p>
            )}
            
            <PayNowChips
              current={Number(String(watch("currentMonthly") ?? "").replace(/[^0-9.]/g,"")) || undefined}
              onPick={(amt)=>{
                setValue("currentMonthly", String(amt), { shouldValidate: true, shouldDirty: true });
              }}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Calculating...' : 'Get Estimate'}
          </Button>
        </form>

        {result && (
          <div className="rounded-xl border p-4 mt-4 space-y-2">
            <div className="text-xl font-semibold">
              Estimated Monthly: {result.monthly.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-muted-foreground">
              Path: {result.path.product} • {result.path.stateKey} • {result.path.ageBand} • {result.path.tobaccoKey}
            </div>
            {result.fallbacks.length > 0 && (
              <div className="text-xs text-muted-foreground">Fallbacks: {result.fallbacks.join(" | ")}</div>
            )}

            {/* Comparison section */}
            {result?.comparison && (
              <div className="mt-2 rounded-lg bg-muted p-3 text-sm">
                {result.comparison.direction === "savings" && (
                  <>
                    <div className="font-medium">Estimated Savings with MPB</div>
                    <div>Monthly: {(result.comparison.deltaMonthly!).toLocaleString(undefined,{style:"currency",currency:"USD",maximumFractionDigits:0})}</div>
                    <div>Annual: {(result.comparison.deltaAnnual!).toLocaleString(undefined,{style:"currency",currency:"USD",maximumFractionDigits:0})}</div>
                  </>
                )}
                {result.comparison.direction === "increase" && (
                  <>
                    <div className="font-medium">Estimated Increase vs. Current</div>
                    <div>Monthly: {Math.abs(result.comparison.deltaMonthly!).toLocaleString(undefined,{style:"currency",currency:"USD",maximumFractionDigits:0})}</div>
                    <div>Annual: {Math.abs(result.comparison.deltaAnnual!).toLocaleString(undefined,{style:"currency",currency:"USD",maximumFractionDigits:0})}</div>
                  </>
                )}
                {result.comparison.direction === "same" && <div>Your estimate matches your current monthly cost.</div>}
              </div>
            )}

            <p className="text-xs mt-2">Estimates are informational and not insurance. Final sharing levels and eligibility are determined during enrollment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

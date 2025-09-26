"use client";
import { Button } from "@/components/ui/button";
import { COMMON_AMOUNTS } from "@/lib/comparatorConfig";

export default function PayNowChips({ onPick, current }:{
  onPick: (v:number)=>void; current?: number;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Try common amounts">
      {COMMON_AMOUNTS.map(amt => {
        const selected = current != null && Math.round(current) === amt;
        return (
          <Button key={amt} type="button" variant={selected ? "default":"secondary"} className="h-8 rounded-full px-3 text-sm"
            aria-pressed={selected} onClick={()=>onPick(amt)}
            onKeyDown={(e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); onPick(amt);} }}>
            {amt.toLocaleString(undefined,{style:"currency",currency:"USD",maximumFractionDigits:0})}
          </Button>
        );
      })}
    </div>
  );
}

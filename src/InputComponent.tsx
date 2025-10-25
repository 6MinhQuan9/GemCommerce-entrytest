import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function UnitValueSelector() {
  const [unit, setUnit] = useState<"%" | "px">("%");
  const [value, setValue] = useState<number | string>(0);
const lastValidValue = useRef<number>(0);

  const handleDecrease = () => {
    setValue((prev) => {
      const num = parseFloat(prev as string) || 0;
      const next = parseFloat((num - 0.1).toFixed(1));
      const clamped = Math.max(0, next);
      lastValidValue.current = clamped;
      return clamped;
    });
  };

  const handleIncrease = () => {
    setValue((prev) => {
      const num = parseFloat(prev as string) || 0;
      const next = parseFloat((num + 0.1).toFixed(1));
      if (next <= 100) {
        lastValidValue.current = next;
        return next;
      }
      return lastValidValue.current; // don’t exceed 100
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Replace comma with dot for parsing
    const inputValue = e.target.value.replace(",", ".");
    setValue(inputValue);
  };

  function keepNumericValue(str: string) {
    // Replace commas with dots, remove everything except digits and dots
    return str
      .replace(",", ".") // normalize decimal separator
      .replace(/[^0-9.]/g, "") // remove non-numeric chars
      .replace(/^([^.]*\.[0-9]*).*$/, "$1"); // keep only first dot
  }

  const handleBlur = () => {
    const numericValue = parseFloat(value as string);

    if (isNaN(numericValue)) {
      setValue(keepNumericValue(value as string));
    } else if (numericValue > 100) {
        setValue(lastValidValue.current);
    } else {
      setValue(value);
      lastValidValue.current = numericValue;
    }
  };

  useEffect(() => {
    if (unit === "%" && parseFloat(value as string) > 100) {
      setValue(100);
      lastValidValue.current = 100;
    }
  }, [unit, value]);

  return (
    <div className="bg-[#111] text-gray-100 p-4 rounded-lg w-64 space-y-4 font-sans">
      {/* Unit selector */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-400 mb-1">Unit</label>
        <span className="flex bg-[#222] rounded-md overflow-hidden w-32">
          <button
            onClick={() => setUnit("%")}
            className={`flex-1 py-1 text-center text-sm ${
              unit === "%" ? "bg-[#333] text-white" : "text-gray-400"
            }`}
          >
            %
          </button>
          <button
            onClick={() => setUnit("px")}
            className={`flex-1 py-1 text-center text-sm ${
              unit === "px" ? "bg-[#333] text-white" : "text-gray-400"
            }`}
          >
            px
          </button>
        </span>
      </div>

      {/* Value control */}
      <div className="flex justify-between items-center">
        <label className="text-sm text-gray-400 mb-1">Value</label>
        <span className="group flex items-center bg-[#222] rounded-md overflow-hidden w-32 transition-colors">
          {/* − Button */}
          <button
            onClick={handleDecrease}
            className="w-8 text-center text-lg text-gray-400 
               hover:text-white hover:bg-[#333]
               group-hover/input:bg-[#333]
               transition-colors select-none"
          >
            −
          </button>

          {/* Input */}
          <input
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className="peer/input w-full text-center text-white text-sm bg-transparent outline-none appearance-none 
               hover:bg-[#2a2a2a]
               group-hover/input:bg-[#2a2a2a]
               transition-colors"
          />

          {/* + Button */}
          <button
            onClick={handleIncrease}
            className="w-8 text-center text-lg text-gray-400 
               hover:text-white hover:bg-[#333]
               group-hover/input:bg-[#333]
               transition-colors select-none"
          >
            +
          </button>
        </span>
      </div>
    </div>
  );
}

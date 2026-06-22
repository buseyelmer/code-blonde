"use client";

export type CheckoutStep = "contact" | "address" | "checkout";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "contact", label: "1. İletişim" },
  { id: "address", label: "2. Adres" },
  { id: "checkout", label: "3. Önizleme ve ödeme" },
];

type CheckoutStepperProps = {
  currentStep: CheckoutStep;
};

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <nav
      aria-label="Ödeme adımları"
      className="flex flex-wrap gap-2 border-b border-[#D9C5B0]/40 px-6 py-4 sm:px-8 sm:py-5"
    >
      {STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isDone = index < currentIndex;

        return (
          <span
            key={step.id}
            aria-current={isActive ? "step" : undefined}
            className={`rounded-full px-3.5 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
              isActive
                ? "bg-[#5C4638] text-[#F8F1E9] shadow-sm"
                : isDone
                  ? "bg-[#EDE0D1] text-[#5C4638]"
                  : "bg-[#F5EDE4] text-[#8B6B57]"
            }`}
          >
            {step.label}
          </span>
        );
      })}
    </nav>
  );
}

// src/components/CheckoutBreadcrumb.tsx
type Step = 'cart' | 'checkout' | 'order';

interface CheckoutBreadcrumbProps {
  currentStep: Step;
}

const CheckoutBreadcrumb = ({ currentStep }: CheckoutBreadcrumbProps) => {
  const steps: { key: Step; label: string }[] = [
    { key: 'cart', label: 'Cart' },
    { key: 'checkout', label: 'Checkout' },
    { key: 'order', label: 'Order' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isPast = steps.findIndex(s => s.key === currentStep) > index;
          
          return (
            <div key={step.key} className="flex items-center">
              {index > 0 && <div className="text-gray-300 mx-2">›</div>}
              <div className="flex items-center">
                <div
                  className={`rounded-full w-8 h-8 flex items-center justify-center text-white ${
                    isActive || isPast ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <span 
                  className={`ml-2 ${
                    isActive || isPast ? 'font-medium' : 'opacity-50'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutBreadcrumb;
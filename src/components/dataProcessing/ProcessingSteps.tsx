import { Check } from 'lucide-react';

interface ProcessingStepsProps {
  activeStep: number;
}

const ProcessingSteps = ({ activeStep }: ProcessingStepsProps) => {
  const steps = [
    { id: 1, name: '上传' },
    { id: 2, name: '处理' },
    { id: 3, name: '验证' },
    { id: 4, name: '保存' },
  ];

  return (
    <nav aria-label="Progress" className="mx-auto max-w-sm">
      <ol className="flex justify-between">
        {steps.map((step) => (
          <li key={step.name} className="flex flex-col items-center">
            <span
              className={`mb-2 text-xs ${
                step.id <= activeStep ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              {step.name}
            </span>
            
            {step.id < activeStep ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600">
                <Check className="h-2.5 w-2.5 text-white" />
              </span>
            ) : step.id === activeStep ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-primary-600 bg-white">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
              </span>
            ) : (
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-white">
                <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProcessingSteps;
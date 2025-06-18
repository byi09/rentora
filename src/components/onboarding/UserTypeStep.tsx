import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { StepProps } from '@/src/types/onboarding';
import { cn } from '@/utils/styles';
import { Label } from '@/src/components/ui/label';
import { AlertCircle } from 'lucide-react';

const OPTIONS: Array<{ value: 'renter' | 'landlord' | 'both'; title: string; desc: string; gradient: string }> = [
  { 
    value: 'renter', 
    title: 'Renter', 
    desc: 'Looking for the perfect place to call home', 
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    value: 'landlord', 
    title: 'Landlord', 
    desc: 'Have properties to lease and manage', 
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    value: 'both', 
    title: 'Both', 
    desc: 'Renting and leasing properties', 
    gradient: 'from-purple-500 to-pink-500'
  },
];

const GENDERS = ['', 'Male', 'Female', 'Other', 'Prefer not to say'];

const UserTypeStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious, validationErrors = {} }) => {
  const [type, setType] = useState<'renter' | 'landlord' | 'both' | undefined>(
    (data.userType as 'renter' | 'landlord') === 'renter' ? 'renter' :
    (data.userType as 'renter' | 'landlord') === 'landlord' ? 'landlord' :
    undefined
  );
  const [gender, setGender] = useState<string>(data.gender || '');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Combine validation errors from parent and local errors
  const allErrors = { ...validationErrors, ...localErrors };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (!type) { 
      newErrors.userType = 'Please select an option';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors);
      return;
    }
    
    setLocalErrors({});
    
    // Map "both" to "renter" as primary role (backend creates both roles anyway)
    const userType: 'renter' | 'landlord' = type === 'both' ? 'renter' : type!;
    onUpdate({ userType, gender });
    onNext?.();
  };

  const handleTypeSelect = (selectedType: 'renter' | 'landlord' | 'both') => {
    setType(selectedType);
    // Clear any type-related errors
    if (allErrors.userType) {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.userType;
        return newErrors;
      });
    }
  };

  const renderFieldError = (fieldName: string) => {
    const error = allErrors[fieldName];
    if (!error) return null;
    
    return (
      <div className="flex items-center justify-center mt-3 text-red-600">
        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="text-center mb-5 lg:mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 lg:mb-3">What brings you here?</h3>
        <p className="text-sm lg:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
          Help us customize your experience and show you what matters most
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-3 lg:space-y-4">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleTypeSelect(opt.value)}
            className={cn(
              "w-full p-4 lg:p-5 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-[1.02] active:scale-[0.98]",
              type === opt.value
                ? "border-blue-500 bg-blue-50/80 shadow-lg ring-2 ring-blue-200"
                : "border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-md",
              allErrors.userType && "border-red-300 hover:border-red-400"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className={cn(
                    "w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-md",
                    opt.gradient
                  )}>
                    {opt.title[0]}
                  </div>
                  <div>
                    <h4 className="text-base lg:text-lg font-semibold text-gray-900 mb-1">
                      {opt.title}
                    </h4>
                    <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              </div>
              <div className={cn(
                "w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                type === opt.value
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 group-hover:border-gray-400"
              )}>
                {type === opt.value && (
                  <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-white"></div>
                )}
              </div>
            </div>
          </button>
        ))}
        
        {/* Error message for user type selection */}
        {renderFieldError("userType")}
      </div>

      {/* Gender selection */}
      <div className="max-w-lg mx-auto">
        <Label className="text-sm lg:text-base font-medium text-gray-700 mb-2 block">
          Gender (Optional)
        </Label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white appearance-none cursor-pointer"
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g || 'Select gender'}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center pt-4 lg:pt-5 max-w-lg mx-auto">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="h-9 md:h-10 lg:h-11 px-4 lg:px-6 text-sm lg:text-base font-medium rounded-lg border-2 hover:bg-gray-50 transition-all duration-200"
        >
          <span className="mr-2">←</span>
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="h-9 md:h-10 lg:h-11 px-6 lg:px-8 text-sm lg:text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Continue
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  );
};

export default UserTypeStep;
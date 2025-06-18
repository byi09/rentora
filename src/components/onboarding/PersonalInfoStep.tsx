import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/utils/styles";
import { StepProps } from "@/src/types/onboarding";
import Spinner from "@/src/components/ui/Spinner";

const PersonalInfoStep: React.FC<StepProps> = ({ data, onUpdate, onNext, validationErrors = {} }) => {
  const [formData, setFormData] = useState({
    username: data.username ?? "",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    dateOfBirth: data.dateOfBirth
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    data.dateOfBirth ? new Date(data.dateOfBirth) : null
  );
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Combine validation errors from parent and local errors
  const allErrors = { ...validationErrors, ...localErrors };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!selectedDate) newErrors.dateOfBirth = "Date of birth is required";

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Age validation (must be at least 18)
    if (selectedDate) {
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
        // Birthday hasn't occurred this year
      }
      
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    // Check username uniqueness
    setCheckingUsername(true);
    try {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(formData.username)}`
      );
      if (res.ok) {
        const users = await res.json();
        if (users && users.length > 0) {
          setLocalErrors((prev) => ({
            ...prev,
            username: "Username already taken"
          }));
          setCheckingUsername(false);
          return;
        }
      }
    } catch (err) {
      console.error("Username check failed", err);
      // proceed anyway if API failed
    }

    setCheckingUsername(false);
    setLocalErrors({});

    onUpdate({
      ...formData,
      dateOfBirth: selectedDate ? selectedDate.toISOString().split("T")[0] : ""
    });
    onNext?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors for the field being updated
    if (allErrors[field]) {
      setLocalErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (allErrors.dateOfBirth) {
      setLocalErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dateOfBirth;
        return newErrors;
      });
    }
  };

  const renderFieldError = (fieldName: string) => {
    const error = allErrors[fieldName];
    if (!error) return null;
    
    return (
      <div className="flex items-center mt-1 text-red-600">
        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
        <span className="text-sm">{error}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4 lg:space-y-5 max-w-lg mx-auto">
      <div className="text-center mb-4 lg:mb-5">
        <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-2">Tell us about yourself</h3>
        <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
          We need some basic information to set up your profile
        </p>
      </div>

      <div className="space-y-4 lg:space-y-5">
        {/* Username */}
        <div>
          <Label htmlFor="username" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
            Username *
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="Choose a unique username"
            className={cn(
              "h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 transition-all duration-200",
              allErrors.username 
                ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                : "border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-blue-100"
            )}
          />
          {renderFieldError("username")}
        </div>

        {/* First Name */}
        <div>
          <Label htmlFor="firstName" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Your first name"
            className={cn(
              "h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 transition-all duration-200",
              allErrors.firstName 
                ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                : "border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-blue-100"
            )}
          />
          {renderFieldError("firstName")}
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="lastName" className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Your last name"
            className={cn(
              "h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 transition-all duration-200",
              allErrors.lastName 
                ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                : "border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-blue-100"
            )}
          />
          {renderFieldError("lastName")}
        </div>

        {/* Date of Birth */}
        <div>
          <Label className="text-sm lg:text-base font-medium text-gray-700 mb-1.5 block">
            Date of Birth *
          </Label>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select your birth date"
              showYearDropdown
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              maxDate={new Date()}
              className={cn(
                "w-full h-9 md:h-10 lg:h-11 text-sm lg:text-base px-3 lg:px-4 rounded-lg border-2 transition-all duration-200",
                allErrors.dateOfBirth 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300 focus:ring-blue-100"
              )}
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {renderFieldError("dateOfBirth")}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4 lg:pt-5">
        <Button 
          onClick={handleNext}
          disabled={checkingUsername}
          className="h-9 md:h-10 lg:h-11 px-6 lg:px-8 text-sm lg:text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {checkingUsername ? (
            <>
              <Spinner size={16} className="mr-2" />
              Checking...
            </>
          ) : (
            <>
              Continue
              <span className="ml-2">→</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;

import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/utils/styles";
import { StepProps } from "@/src/types/onboarding";
import Spinner from "@/src/components/ui/Spinner";

const PersonalInfoStep: React.FC<StepProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    username: data.username ?? "",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    dateOfBirth: data.dateOfBirth
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    data.dateOfBirth ? new Date(data.dateOfBirth) : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkingUsername, setCheckingUsername] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!selectedDate) newErrors.dateOfBirth = "Date of birth is required";

    setErrors(newErrors);
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
          setErrors((prev) => ({
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

    onUpdate({
      ...formData,
      dateOfBirth: selectedDate ? selectedDate.toISOString().split("T")[0] : ""
    });
    onNext?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="text-center mb-3 md:mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Tell us about yourself</h3>
        <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
          We need some basic information to create your personalized profile
        </p>
      </div>

      <div className="space-y-3 md:space-y-4 max-w-xl mx-auto">
        <div className="relative">
          <Label htmlFor="username" className="text-sm md:text-base font-medium text-gray-700 mb-1.5 block">
            Username *
          </Label>
          <div className="relative">
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Choose a unique username"
              className={cn(
                "h-9 md:h-10 lg:h-11 text-sm md:text-base px-3 md:px-4 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-100",
                errors.username 
                  ? "border-red-400 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              )}
            />
            {checkingUsername && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Spinner size={16} />
              </div>
            )}
          </div>
          {errors.username && (
            <p className="text-xs md:text-sm text-red-500 mt-1.5 flex items-center">
              <span className="mr-1">!</span>
              {errors.username}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <Label htmlFor="firstName" className="text-sm md:text-base font-medium text-gray-700 mb-1.5 block">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className={cn(
                "h-9 md:h-10 lg:h-11 text-sm md:text-base px-3 md:px-4 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-100",
                errors.firstName 
                  ? "border-red-400 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              )}
            />
            {errors.firstName && (
              <p className="text-xs md:text-sm text-red-500 mt-1.5 flex items-center">
                <span className="mr-1">!</span>
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm md:text-base font-medium text-gray-700 mb-1.5 block">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className={cn(
                "h-9 md:h-10 lg:h-11 text-sm md:text-base px-3 md:px-4 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-100",
                errors.lastName 
                  ? "border-red-400 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              )}
            />
            {errors.lastName && (
              <p className="text-xs md:text-sm text-red-500 mt-1.5 flex items-center">
                <span className="mr-1">!</span>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm md:text-base font-medium text-gray-700 mb-1.5 block">
            Date of Birth *
          </Label>
          <div className="relative w-full">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                setSelectedDate(date);
                if (errors.dateOfBirth)
                  setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
              }}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select your date of birth"
              maxDate={new Date()}
              minDate={new Date("1900-01-01")}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              wrapperClassName="w-full"
              className={cn(
                "w-full h-9 md:h-10 lg:h-11 text-sm md:text-base px-3 md:px-4 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-100",
                errors.dateOfBirth 
                  ? "border-red-400 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              )}
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.dateOfBirth && (
            <p className="text-xs md:text-sm text-red-500 mt-1.5 flex items-center">
              <span className="mr-1">!</span>
              {errors.dateOfBirth}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-4 md:pt-5">
        <Button 
          onClick={handleNext} 
          className="h-9 md:h-10 lg:h-11 px-6 md:px-8 text-sm md:text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          disabled={checkingUsername}
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

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
    <div className="space-y-8 lg:space-y-10">
      <div className="text-center mb-8 lg:mb-12">
        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 lg:mb-4">Tell us about yourself</h3>
        <p className="text-base lg:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
          We need some basic information to create your personalized profile
        </p>
      </div>

      <div className="space-y-6 lg:space-y-8 max-w-2xl mx-auto">
        <div className="relative">
          <Label htmlFor="username" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
            Username *
          </Label>
          <div className="relative">
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Choose a unique username"
              className={cn(
                "h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100",
                errors.username 
                  ? "border-red-400 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              )}
            />
            {checkingUsername && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Spinner size={20} />
              </div>
            )}
          </div>
          {errors.username && (
            <p className="text-sm lg:text-base text-red-500 mt-2 flex items-center">
              <span className="mr-1">!</span>
              {errors.username}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <Label htmlFor="firstName" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
              First Name *
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className={cn(
                "h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100",
                errors.firstName 
                  ? "border-red-400 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              )}
            />
            {errors.firstName && (
              <p className="text-sm lg:text-base text-red-500 mt-2 flex items-center">
                <span className="mr-1">!</span>
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className={cn(
                "h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100",
                errors.lastName 
                  ? "border-red-400 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              )}
            />
            {errors.lastName && (
              <p className="text-sm lg:text-base text-red-500 mt-2 flex items-center">
                <span className="mr-1">!</span>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-base lg:text-lg font-medium text-gray-700 mb-2 block">
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
                "w-full h-12 lg:h-14 text-base lg:text-lg px-4 lg:px-5 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-blue-100",
                errors.dateOfBirth 
                  ? "border-red-400 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
              )}
            />
            <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 lg:h-6 lg:w-6 text-gray-400 pointer-events-none" />
          </div>
          {errors.dateOfBirth && (
            <p className="text-sm lg:text-base text-red-500 mt-2 flex items-center">
              <span className="mr-1">!</span>
              {errors.dateOfBirth}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-8 lg:pt-12">
        <Button 
          onClick={handleNext} 
          className="h-12 lg:h-14 px-8 lg:px-12 text-base lg:text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          disabled={checkingUsername}
        >
          {checkingUsername ? (
            <>
              <Spinner size={20} className="mr-2" />
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

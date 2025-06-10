import React, { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Calendar } from '@/src/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { StepProps } from '@/src/types/onboarding';
import Spinner from '@/src/components/ui/Spinner';

const PersonalInfoStep: React.FC<StepProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    username: data.username ?? '',
    firstName: data.firstName ?? '',
    lastName: data.lastName ?? '',
    dateOfBirth: data.dateOfBirth
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.dateOfBirth ? new Date(data.dateOfBirth) : undefined
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkingUsername, setCheckingUsername] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!selectedDate) newErrors.dateOfBirth = 'Date of birth is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    // Check username uniqueness
    setCheckingUsername(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(formData.username)}`);
      if (res.ok) {
        const users = await res.json();
        if (users && users.length > 0) {
          setErrors(prev => ({ ...prev, username: 'Username already taken' }));
          setCheckingUsername(false);
          return;
        }
      }
    } catch (err) {
      console.error('Username check failed', err);
      // proceed anyway if API failed
    }

    setCheckingUsername(false);

    onUpdate({
      ...formData,
      dateOfBirth: selectedDate ? selectedDate.toISOString().split('T')[0] : ''
    });
    onNext?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Tell us about yourself</h3>
        <p className="text-sm text-gray-600">We need some basic information to get started</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Label htmlFor="username">Username *</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Choose a unique username"
            className={errors.username ? 'border-red-500' : ''}
          />
          {checkingUsername && (
            <div className="absolute right-2 top-9"><Spinner size="sm" /></div>
          )}
          {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="First name"
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Last name"
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <Label>Date of Birth *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                  errors.dateOfBirth && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Select your birth date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white shadow-md rounded-md" align="start">
              <Calendar
                mode="single"
                numberOfMonths={1}
                defaultMonth={new Date(2000, 0, 1)}
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (errors.dateOfBirth) {
                    setErrors(prev => ({ ...prev, dateOfBirth: '' }));
                  }
                }}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} className="px-8">
          Next
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;

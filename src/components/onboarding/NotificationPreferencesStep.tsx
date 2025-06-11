import React, { useState } from 'react';
import { StepProps } from '@/src/types/onboarding';
import { Button } from '@/src/components/ui/button';
import Switch  from '@/src/components/ui/switch';
import { Label } from '@/src/components/ui/label';

interface ToggleRowProps {
  label: string;
  email: boolean;
  push: boolean;
  disablePush: boolean;
  onChange: (field: 'email' | 'push', value: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, email, push, disablePush, onChange }) => (
  <div className="flex items-center justify-between py-4 border-b last:border-b-0">
    <div>
      <p className="font-medium text-gray-900">{label}</p>
      <div className="mt-2 space-y-3 text-sm text-gray-700">
        <div className="flex items-center justify-between w-56">
          <span>Email</span>
          <Switch checked={email} onCheckedChange={(v) => onChange('email', v)} />
        </div>
        <div className="flex items-center justify-between w-56">
          <span>Phone</span>
          <Switch checked={push} disabled={disablePush} onCheckedChange={(v) => onChange('push', v)} />
        </div>
      </div>
    </div>
  </div>
);

const NotificationPreferencesStep: React.FC<StepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const phoneAvailable = Boolean(data.phoneNumber && data.phoneNumber.trim());
  const [prefs, setPrefs] = useState({
    updatesSavedPropertiesEmail: data.updatesSavedPropertiesEmail ?? true,
    updatesSavedPropertiesPush: phoneAvailable ? (data.updatesSavedPropertiesPush ?? true) : false,
    newPropertiesEmail: data.newPropertiesEmail ?? true,
    newPropertiesPush: phoneAvailable ? (data.newPropertiesPush ?? true) : false,
    newsEmail: data.newsEmail ?? true,
    newsPush: phoneAvailable ? (data.newsPush ?? true) : false,
  });

  const handleToggle = (keyBase: string, field: 'email' | 'push', value: boolean) => {
    setPrefs((prev) => ({ ...prev, [`${keyBase}${field === 'email' ? 'Email' : 'Push'}`]: value } as any));
  };

  const handleNext = () => {
    onUpdate(prefs);
    onNext?.();
  };

  return (
    <div>
      <p className="text-center text-gray-600 mb-6">Choose how you'd like to receive notifications.</p>
      <div>
        <ToggleRow
          label="Updates to saved properties"
          email={prefs.updatesSavedPropertiesEmail}
          push={prefs.updatesSavedPropertiesPush}
          disablePush={!phoneAvailable}
          onChange={(field, val) => handleToggle('updatesSavedProperties', field, val)}
        />
        <ToggleRow
          label="New properties that match your preferences"
          email={prefs.newPropertiesEmail}
          push={prefs.newPropertiesPush}
          disablePush={!phoneAvailable}
          onChange={(field, val) => handleToggle('newProperties', field, val)}
        />
        <ToggleRow
          label="News from Rentora"
          email={prefs.newsEmail}
          push={prefs.newsPush}
          disablePush={!phoneAvailable}
          onChange={(field, val) => handleToggle('news', field, val)}
        />
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>Back</Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};

export default NotificationPreferencesStep; 
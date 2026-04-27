import { useState } from 'react';
import { FormInput, FormSelect } from '../common';
import { GENDER_OPTIONS } from '../../utils/constants';
import { ChevronDown, ChevronUp, User, Phone, Calendar, Droplet, AlertCircle } from 'lucide-react';

const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const CompactPatientForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  disabled = false,
  isExistingPatient = false,
  loading = false,
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header with badge */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <User className="w-4 h-4" />
          Patient Details
        </h3>
        {isExistingPatient && (
          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
            Existing Patient
          </span>
        )}
      </div>

      {/* Essential Fields - Always Visible */}
      <div className="grid grid-cols-2 gap-2">
        {/* Phone - Primary trigger field */}
        <div className="col-span-2">
          <FormInput
            label="Phone"
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            touched={touched.phone}
            required
            disabled={disabled || isExistingPatient}
            className="h-9 text-sm"
          />
          {loading && (
            <p className="text-xs text-blue-600 mt-1">Searching...</p>
          )}
        </div>

        {/* Name */}
        <div className="col-span-2">
          <FormInput
            label="Name"
            type="text"
            name="name"
            placeholder="Patient name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            touched={touched.name}
            required
            disabled={disabled || isExistingPatient}
            className="h-9 text-sm"
          />
        </div>

        {/* Age + Gender in same row */}
        <FormInput
          label="Age"
          type="number"
          name="age"
          min="0"
          placeholder="Years"
          value={values.age}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.age}
          touched={touched.age}
          required
          disabled={disabled || isExistingPatient}
          className="h-9 text-sm"
        />
        <FormSelect
          label="Gender"
          name="gender"
          options={GENDER_OPTIONS}
          value={values.gender}
          onChange={handleChange}
          error={errors.gender}
          touched={touched.gender}
          required
          disabled={disabled || isExistingPatient}
          className="h-9 text-sm"
        />
      </div>

      {/* Collapsible More Details */}
      <button
        type="button"
        onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        {showMore ? (
          <>
            <ChevronUp className="w-3 h-3" />
            Less Details
          </>
        ) : (
          <>
            <ChevronDown className="w-3 h-3" />
            More Details
          </>
        )}
      </button>

      {showMore && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          <FormSelect
            label="Blood Group"
            name="bloodGroup"
            options={BLOOD_GROUP_OPTIONS}
            value={values.bloodGroup}
            onChange={handleChange}
            disabled={disabled || isExistingPatient}
            className="h-9 text-sm"
          />
          <FormInput
            label="Emergency Contact"
            type="tel"
            name="emergencyContact"
            placeholder="Alternate number"
            value={values.emergencyContact}
            onChange={handleChange}
            disabled={disabled || isExistingPatient}
            className="h-9 text-sm"
          />
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Allergies
            </label>
            <input
              type="text"
              name="allergies"
              placeholder="Known allergies (optional)"
              value={values.allergies || ''}
              onChange={handleChange}
              disabled={disabled || isExistingPatient}
              className="input-field h-9 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactPatientForm;
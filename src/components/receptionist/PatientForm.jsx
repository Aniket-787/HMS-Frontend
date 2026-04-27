import { FormInput, FormSelect, FormTextarea } from '../common';
import { GENDER_OPTIONS } from '../../utils/constants';

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

export const PatientForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  disabled = false,
  showAddress = true,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter patient full name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          required
          disabled={disabled}
        />
        <FormInput
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="Enter patient phone number"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          touched={touched.phone}
          required
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Age"
          type="number"
          name="age"
          min="0"
          placeholder="Enter age"
          value={values.age}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.age}
          touched={touched.age}
          required
          disabled={disabled}
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
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Blood Group"
          name="bloodGroup"
          options={BLOOD_GROUP_OPTIONS}
          value={values.bloodGroup}
          onChange={handleChange}
          error={errors.bloodGroup}
          touched={touched.bloodGroup}
          disabled={disabled}
        />
        <FormInput
          label="Emergency Contact"
          type="tel"
          name="emergencyContact"
          placeholder="Emergency contact number"
          value={values.emergencyContact}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.emergencyContact}
          touched={touched.emergencyContact}
          disabled={disabled}
        />
      </div>

      <FormTextarea
        label="Allergies"
        name="allergies"
        placeholder="List any known allergies (medications, food, etc.)"
        value={values.allergies}
        onChange={handleChange}
        error={errors.allergies}
        touched={touched.allergies}
        disabled={disabled}
      />

      {showAddress && (
        <FormTextarea
          label="Address"
          name="address"
          placeholder="Enter patient address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address}
          touched={touched.address}
          required
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default PatientForm;
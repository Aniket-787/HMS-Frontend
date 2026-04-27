import { FormInput, FormSelect } from '../common';
import { Stethoscope, DollarSign } from 'lucide-react';

export const CompactOPDForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleDoctorChange,
  doctors,
  selectedDoctor,
  feeAmount,
  loadingDoctors = false,
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          Visit Details
        </h3>
      </div>

      {/* Doctor Selection */}
      <div>
        {loadingDoctors ? (
          <div className="flex items-center gap-2 py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-xs text-gray-500">Loading doctors...</span>
          </div>
        ) : (
          <FormSelect
            label="Select Doctor"
            name="doctorId"
            options={doctors.map((doc) => ({
              value: doc._id,
              label: `Dr. ${doc.name}`,
            }))}
            value={values.doctorId}
            onChange={handleDoctorChange}
            error={errors.doctorId}
            touched={touched.doctorId}
            required
            className="h-9 text-sm"
          />
        )}
      </div>

      {/* Fee Display */}
      {selectedDoctor && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700">
            Fee: <span className="font-semibold">₹{feeAmount}</span>
          </span>
          {feeAmount === 0 && (
            <span className="ml-auto text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
              Follow-up
            </span>
          )}
        </div>
      )}

      {/* Symptoms */}
      <FormInput
        label="Symptoms"
        type="text"
        name="symptoms"
        placeholder="e.g., Fever, Cough, Headache"
        value={values.symptoms}
        onChange={handleChange}
        error={errors.symptoms}
        touched={touched.symptoms}
        required
        className="h-9 text-sm"
      />

      {/* Payment Status */}
      <FormSelect
        label="Payment"
        name="paymentStatus"
        options={[
          { value: 'PAID', label: 'Paid' },
          { value: 'UNPAID', label: 'Unpaid' },
        ]}
        value={values.paymentStatus}
        onChange={handleChange}
        className="h-9 text-sm"
      />
    </div>
  );
};

export default CompactOPDForm;
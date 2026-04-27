import { FormInput, FormSelect } from '../common';
import { Stethoscope, DollarSign } from 'lucide-react';

export const OPDForm = ({
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
    <div className="space-y-6">
      {/* Doctor Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-blue-600" />
          Doctor Assignment
        </h3>
        
        {loadingDoctors ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-500">Loading doctors...</span>
          </div>
        ) : (
          <FormSelect
            label="Select Doctor"
            name="doctorId"
            options={doctors.map((doc) => ({
              value: doc._id,
              label: `Dr. ${doc.name} (${doc.profile?.specialization || 'General'})`,
            }))}
            value={values.doctorId}
            onChange={handleDoctorChange}
            error={errors.doctorId}
            touched={touched.doctorId}
            required
          />
        )}

        {/* Consultation Fee Display */}
        {selectedDoctor && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Consultation Fee</p>
              <p className="text-lg font-bold text-blue-900">₹{feeAmount}</p>
            </div>
            {feeAmount === 0 && (
              <span className="ml-auto text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                Follow-up available
              </span>
            )}
          </div>
        )}
      </div>

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
      />

      {/* Payment Status */}
      <FormSelect
        label="Payment Status"
        name="paymentStatus"
        options={[
          { value: 'PAID', label: 'Paid' },
          { value: 'UNPAID', label: 'Unpaid' },
        ]}
        value={values.paymentStatus}
        onChange={handleChange}
        error={errors.paymentStatus}
        touched={touched.paymentStatus}
      />
    </div>
  );
};

export default OPDForm;
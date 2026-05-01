import React, { useState } from 'react';
import { FormInput, FormSelect, Button } from '../components/common';

export const ConsentFormFiller = ({ onSubmit, isSubmitting, ipd, patient, initialData = null }) => {
  const initializeFormState = () => ({
    relativeOrGuardianName: initialData?.relativeOrGuardianName || '',
    relation: initialData?.relation || '',
    address: initialData?.address || patient?.address || '',
    taluka: initialData?.taluka || patient?.taluka || '',
    district: initialData?.district || patient?.district || '',
    phone: initialData?.phone || patient?.phone || '',
    admissionDate:
      initialData?.admissionDate
        ? new Date(initialData.admissionDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    admissionTime: initialData?.admissionTime || '10:00',
    admissionAMPM: initialData?.admissionAMPM || 'AM',
    diagnosis: initialData?.diagnosis || ipd?.diagnosis || '',
    section1Consent: initialData?.section1Consent || '', // होय/नाही
    section1YaAgree: initialData?.section1YaAgree || '', // होय/नाही for treatment plan
    section2Consent: initialData?.section2Consent || '', // होय/नाही
    section2OutOfPocket: initialData?.section2OutOfPocket || '', // होय/नाही for out of pocket
    signatureHolderName: initialData?.signatureHolderName || '',
    relationshipToPatient: initialData?.relationshipToPatient || '',
  });

  const [formData, setFormData] = useState(initializeFormState());


  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    setFormData(initializeFormState());
  }, [initialData, patient, ipd]);

  const RELATIONS = [
    { value: 'FATHER', label: 'Father' },
    { value: 'MOTHER', label: 'Mother' },
    { value: 'SPOUSE', label: 'Spouse' },
    { value: 'SON', label: 'Son' },
    { value: 'DAUGHTER', label: 'Daughter' },
    { value: 'BROTHER', label: 'Brother' },
    { value: 'SISTER', label: 'Sister' },
    { value: 'SELF', label: 'Self' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.relativeOrGuardianName.trim()) {
      newErrors.relativeOrGuardianName = 'Relative/Guardian name is required';
    }
    if (!formData.relation) {
      newErrors.relation = 'Relation is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.taluka.trim()) {
      newErrors.taluka = 'Taluka is required';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnosis is required';
    }
    if (!formData.section1Consent) {
      newErrors.section1Consent = 'Please select consent for Section 1';
    }
    if (!formData.section1YaAgree) {
      newErrors.section1YaAgree = 'Please select if you agree to scheme benefits';
    }
    if (!formData.section2Consent) {
      newErrors.section2Consent = 'Please select consent for Section 2';
    }
    if (!formData.section2OutOfPocket) {
      newErrors.section2OutOfPocket = 'Please confirm out-of-pocket treatment';
    }
    if (!formData.signatureHolderName.trim()) {
      newErrors.signatureHolderName = 'Signature holder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Patient Info Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Patient Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Patient Name</p>
            <p className="text-base font-semibold text-gray-900">{patient?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">UHID</p>
            <p className="text-base font-semibold text-gray-900">{patient?.uhid || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">IPD Number</p>
            <p className="text-base font-semibold text-gray-900">{ipd?.ipdNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Diagnosis</p>
            <p className="text-base font-semibold text-gray-900">{ipd?.diagnosis || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Relative/Guardian Information */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-lg font-semibold text-green-900 mb-4">
          रुग्णाचे / नातेवाईकाचे माहिती (Relative/Guardian Information)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              रुग्णाचे / नातेवाईकाचे नाव *
            </label>
            <input
              type="text"
              name="relativeOrGuardianName"
              value={formData.relativeOrGuardianName}
              onChange={handleChange}
              placeholder="Enter relative/guardian name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.relativeOrGuardianName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.relativeOrGuardianName && (
              <p className="text-sm text-red-600 mt-1">{errors.relativeOrGuardianName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              रुग्णाशी नाते (Relation) *
            </label>
            <select
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.relation ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select relation</option>
              {RELATIONS.map(rel => (
                <option key={rel.value} value={rel.value}>
                  {rel.label}
                </option>
              ))}
            </select>
            {errors.relation && (
              <p className="text-sm text-red-600 mt-1">{errors.relation}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              पत्ता (Address) *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              तालुका (Taluka) *
            </label>
            <input
              type="text"
              name="taluka"
              value={formData.taluka}
              onChange={handleChange}
              placeholder="Enter taluka"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.taluka ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.taluka && (
              <p className="text-sm text-red-600 mt-1">{errors.taluka}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              जिल्हा (District) *
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="Enter district"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.district ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.district && (
              <p className="text-sm text-red-600 mt-1">{errors.district}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              दूरध्वनी क्रमांक (Phone) *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Admission Details */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h2 className="text-lg font-semibold text-purple-900 mb-4">Admission Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Date *
            </label>
            <input
              type="date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Time
            </label>
            <input
              type="time"
              name="admissionTime"
              value={formData.admissionTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AM / PM
            </label>
            <select
              name="admissionAMPM"
              value={formData.admissionAMPM}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis (रोग/आजार) *
            </label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.diagnosis ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.diagnosis && (
              <p className="text-sm text-red-600 mt-1">{errors.diagnosis}</p>
            )}
          </div>
        </div>
      </div>

      {/* Consent Sections */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-lg font-semibold text-yellow-900 mb-4">Consent Options</h2>

        <div className="space-y-6">
          {/* Section 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Section 1: Do you agree to the Mahatma Jyotiba Phule Scheme details? *
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="section1Consent"
                  value="yes"
                  checked={formData.section1Consent === 'yes'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>होय (Yes)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="section1Consent"
                  value="no"
                  checked={formData.section1Consent === 'no'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>नाही (No)</span>
              </label>
            </div>
            {errors.section1Consent && (
              <p className="text-sm text-red-600 mt-1">{errors.section1Consent}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Do you agree to accept these scheme benefits? *
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="section1YaAgree"
                  value="yes"
                  checked={formData.section1YaAgree === 'yes'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>होय (Yes)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="section1YaAgree"
                  value="no"
                  checked={formData.section1YaAgree === 'no'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>नाही (No)</span>
              </label>
            </div>
            {errors.section1YaAgree && (
              <p className="text-sm text-red-600 mt-1">{errors.section1YaAgree}</p>
            )}
          </div>

          {/* Section 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Section 2: Is treatment not covered in scheme? *
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="section2Consent"
                  value="yes"
                  checked={formData.section2Consent === 'yes'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>होय (Yes)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="section2Consent"
                  value="no"
                  checked={formData.section2Consent === 'no'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>नाही (No)</span>
              </label>
            </div>
            {errors.section2Consent && (
              <p className="text-sm text-red-600 mt-1">{errors.section2Consent}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Do you agree to pay for out-of-pocket treatment? *
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="section2OutOfPocket"
                  value="yes"
                  checked={formData.section2OutOfPocket === 'yes'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>होय (Yes)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="section2OutOfPocket"
                  value="no"
                  checked={formData.section2OutOfPocket === 'no'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>नाही (No)</span>
              </label>
            </div>
            {errors.section2OutOfPocket && (
              <p className="text-sm text-red-600 mt-1">{errors.section2OutOfPocket}</p>
            )}
          </div>
        </div>
      </div>

      {/* Signature Information */}
      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
        <h2 className="text-lg font-semibold text-orange-900 mb-4">
          Signature Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Person Signing (नाव) *
            </label>
            <input
              type="text"
              name="signatureHolderName"
              value={formData.signatureHolderName}
              onChange={handleChange}
              placeholder="Enter name of person signing"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.signatureHolderName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.signatureHolderName && (
              <p className="text-sm text-red-600 mt-1">{errors.signatureHolderName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship to Patient
            </label>
            <select
              name="relationshipToPatient"
              value={formData.relationshipToPatient}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select relationship</option>
              {RELATIONS.map(rel => (
                <option key={rel.value} value={rel.value}>
                  {rel.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Loading...' : 'Continue to Preview & Print'}
        </Button>
      </div>
    </form>
  );
};

export default ConsentFormFiller;

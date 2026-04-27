import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { receptionistService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { Button, Card, Loading } from '../../components/common';
import { CompactPatientForm, CompactOPDForm, SearchDropdown } from '../../components/receptionist';
import { toast } from 'react-toastify';
import { UserPlus, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';

export const CreateVisitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if patient was passed from navigation state
  const prefillPatient = location.state?.patient || null;

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(prefillPatient);
  const [existingPatient, setExistingPatient] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [createdVisit, setCreatedVisit] = useState(null);

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Set prefill patient if passed
  useEffect(() => {
    if (prefillPatient) {
      setSelectedPatient(prefillPatient);
      setExistingPatient(prefillPatient);
    }
  }, [prefillPatient]);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const doctorsRes = await receptionistService.getDoctors();
      setDoctors(doctorsRes.data.doctors || []);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Patient form validation
  const validatePatient = (formValues) => {
    const newErrors = {};

    if (!formValues.name?.trim()) newErrors.name = 'Required';
    if (!formValues.phone?.trim()) {
      newErrors.phone = 'Required';
    } else if (!/^[0-9]{10,15}$/.test(formValues.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid';
    }
    if (!formValues.age) {
      newErrors.age = 'Required';
    } else if (Number(formValues.age) <= 0) {
      newErrors.age = 'Invalid';
    }
    if (!formValues.gender) newErrors.gender = 'Required';

    return newErrors;
  };

  // OPD form validation
  const validateOPD = (formValues) => {
    const newErrors = {};

    if (!formValues.doctorId) newErrors.doctorId = 'Required';
    if (!formValues.symptoms?.trim()) newErrors.symptoms = 'Required';

    return newErrors;
  };

  // Patient form state
  const {
    values: patientValues,
    errors: patientErrors,
    touched: patientTouched,
    handleChange: handlePatientChange,
    handleBlur: handlePatientBlur,
    setValues: setPatientValues,
    setErrors: setPatientErrors,
  } = useForm(
    {
      name: prefillPatient?.name || '',
      phone: prefillPatient?.phone || '',
      age: prefillPatient?.age || '',
      gender: prefillPatient?.gender || '',
      bloodGroup: prefillPatient?.bloodGroup || '',
      allergies: prefillPatient?.allergies || '',
      emergencyContact: prefillPatient?.emergencyContact || '',
      address: prefillPatient?.address || '',
    },
    () => {} // No auto-submit
  );

  // OPD form state
  const {
    values: opdValues,
    errors: opdErrors,
    touched: opdTouched,
    isSubmitting,
    handleChange: handleOPDChange,
    handleSubmit: handleOPDSubmit,
    resetForm: resetOPDForm,
  } = useForm(
    {
      doctorId: '',
      symptoms: '',
      paymentStatus: 'UNPAID',
    },
    async (formValues) => {
      // Validate both forms
      const patientValidationErrors = validatePatient(patientValues);
      const opdValidationErrors = validateOPD(formValues);

      setPatientErrors(patientValidationErrors);
      
      if (Object.keys(patientValidationErrors).length > 0 || Object.keys(opdValidationErrors).length > 0) {
        return;
      }

      try {
        // Prepare the combined payload
        const payload = {
          patientData: {
            name: patientValues.name,
            phone: patientValues.phone,
            age: parseInt(patientValues.age, 10),
            gender: patientValues.gender,
            bloodGroup: patientValues.bloodGroup || undefined,
            allergies: patientValues.allergies || undefined,
            emergencyContact: patientValues.emergencyContact || undefined,
            address: patientValues.address || undefined,
          },
          opdData: {
            doctorId: formValues.doctorId,
            symptoms: formValues.symptoms,
            paymentStatus: formValues.paymentStatus,
          },
        };

        const response = await receptionistService.createVisit(payload);
        
        setCreatedVisit({
          ...response.data.OPD,
          patient: response.data.patient,
          doctor: doctors.find(d => d._id === formValues.doctorId),
        });

        toast.success('Visit created successfully!');
        
        // Reset forms after successful creation
        resetOPDForm();
        setPatientValues({
          name: '',
          phone: '',
          age: '',
          gender: '',
          bloodGroup: '',
          allergies: '',
          emergencyContact: '',
          address: '',
        });
        setSelectedPatient(null);
        setExistingPatient(null);

      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to create visit';
        toast.error(errorMsg);
      }
    }
  );

  // Handle patient search selection
  const handlePatientSelect = async (patient) => {
    if (patient) {
      setSelectedPatient(patient);
      setExistingPatient(patient);
      
      // Prefill patient form
      setPatientValues({
        name: patient.name,
        phone: patient.phone,
        age: patient.age?.toString() || '',
        gender: patient.gender || '',
        bloodGroup: patient.bloodGroup || '',
        allergies: patient.allergies || '',
        emergencyContact: patient.emergencyContact || '',
        address: patient.address || '',
      });
    } else {
      setSelectedPatient(null);
      setExistingPatient(null);
    }
  };

  // Handle phone number change - check if patient exists
  const handlePhoneChange = async (e) => {
    const phone = e.target.value;
    handlePatientChange(e);

    // Only search if phone is valid length
    if (phone.replace(/\D/g, '').length >= 10) {
      setSearchLoading(true);
      try {
        const response = await receptionistService.searchPatient(phone);
        if (response.data.patient) {
          const patient = response.data.patient;
          setExistingPatient(patient);
          setSelectedPatient(patient);
          
          // Auto-fill patient data
          setPatientValues({
            name: patient.name,
            phone: patient.phone,
            age: patient.age?.toString() || '',
            gender: patient.gender || '',
            bloodGroup: patient.bloodGroup || '',
            allergies: patient.allergies || '',
            emergencyContact: patient.emergencyContact || '',
            address: patient.address || '',
          });
          
          toast.info(`Found: ${patient.name} (${patient.uhid})`);
        } else {
          setExistingPatient(null);
          setSelectedPatient(null);
        }
      } catch (error) {
        // Patient not found - allow new registration
        setExistingPatient(null);
        setSelectedPatient(null);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setExistingPatient(null);
      setSelectedPatient(null);
    }
  };

  // Handle doctor selection
  const handleDoctorChange = (e) => {
    handleOPDChange(e);
    
    const doctor = doctors.find((d) => d._id === e.target.value);
    // Fee calculation is handled in OPDForm component
  };

  const selectedDoctor = doctors.find(d => d._id === opdValues.doctorId);
  const feeAmount = selectedDoctor?.profile?.consultationFee || 0;

  // If visit was created successfully, show success state
  if (createdVisit) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Visit Created!</h2>
          <p className="text-gray-600 mb-4">
            Token: <span className="font-semibold text-blue-600">#{createdVisit.tokenNumber}</span>
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left text-sm">
            <p className="text-gray-600">Patient: <span className="font-medium">{createdVisit.patient?.name}</span></p>
            <p className="text-gray-600">Doctor: <span className="font-medium">Dr. {createdVisit.doctor?.name}</span></p>
            <p className="text-gray-600">Amount: <span className="font-medium">₹{createdVisit.amount}</span></p>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCreatedVisit(null);
                setSelectedPatient(null);
                setExistingPatient(null);
              }}
            >
              New Visit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/receptionist/opd-list')}
            >
              View OPD
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900">Create Visit</h1>
        <p className="text-xs text-gray-500">Register patient & create OPD in one flow</p>
      </div>

      {/* 2-Column Grid Layout - Compact */}
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Left Column - Patient */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 overflow-auto">
          {/* Patient Search */}
          <div className="mb-3">
            <SearchDropdown
              onPatientSelect={handlePatientSelect}
              placeholder="Search by phone/UHID..."
            />
            {searchLoading && (
              <p className="text-xs text-blue-600 mt-1">Searching...</p>
            )}
          </div>

          {/* Compact Patient Form */}
          <div className={selectedPatient ? 'opacity-60 pointer-events-none' : ''}>
            <CompactPatientForm
              values={patientValues}
              errors={patientErrors}
              touched={patientTouched}
              handleChange={handlePhoneChange}
              handleBlur={handlePatientBlur}
              disabled={!!selectedPatient}
              isExistingPatient={!!existingPatient}
              loading={searchLoading}
            />
          </div>

          {selectedPatient && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              Patient locked. Clear search to register new.
            </div>
          )}
        </div>

        {/* Right Column - OPD */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col">
          <div className="flex-1">
            <CompactOPDForm
              values={opdValues}
              errors={opdErrors}
              touched={opdTouched}
              handleChange={handleOPDChange}
              handleDoctorChange={handleDoctorChange}
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              feeAmount={feeAmount}
              loadingDoctors={loadingDoctors}
            />
          </div>

          {/* Submit Button - Always Visible */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="primary"
              className="w-full h-10 text-sm font-medium"
              loading={isSubmitting}
              onClick={() => {
                // Validate both forms before submission
                const patientValidationErrors = validatePatient(patientValues);
                const opdValidationErrors = validateOPD(opdValues);

                setPatientErrors(patientValidationErrors);

                if (Object.keys(patientValidationErrors).length > 0) {
                  toast.error('Fill required patient fields');
                  return;
                }

                if (Object.keys(opdValidationErrors).length > 0) {
                  toast.error('Fill required OPD fields');
                  return;
                }

                handleOPDSubmit({ preventDefault: () => {} });
              }}
            >
              Create Visit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVisitPage;
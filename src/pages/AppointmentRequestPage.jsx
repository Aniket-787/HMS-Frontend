import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { appointmentRequestService, receptionistService } from "../services";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  Button,
} from "../components/common";
import { GENDER_OPTIONS } from "../utils/constants";
import { toast } from "react-toastify";

export const AppointmentRequestPage = () => {
  const { hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    appointmentDate: "",
    age: "",
    gender: "",
    doctorId: "",
    symptoms: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hospital details
        const hospitalResponse =
          await appointmentRequestService.getHospitalQRCode(hospitalId);
        setHospital(hospitalResponse.data.hospital);

        // Fetch doctors for the dropdown
        const doctorsResponse =
          await appointmentRequestService.getDoctors(hospitalId);
        setDoctors(doctorsResponse.data.doctors || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Invalid hospital or hospital not found");
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId) {
      fetchData();
    }
  }, [hospitalId]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (Number(formData.age) <= 0 || Number(formData.age) > 150) {
      newErrors.age = "Enter a valid age";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await appointmentRequestService.createRequest({
        ...formData,
        hospitalId,
        age: parseInt(formData.age, 10),
        doctorId: formData.doctorId || null,
      });

      setSubmitted(true);
      toast.success("Request submitted successfully! Wait for approval.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Hospital Not Found
          </h2>
          <p className="text-gray-600">
            The QR code appears to be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Request Submitted!
          </h2>
          <p className="text-gray-600 mb-4">
            Your appointment request has been submitted to{" "}
            <strong>{hospital.name}</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please wait for approval. You will receive a token number once your
            request is approved.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Keep your phone number handy for
              verification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Hospital Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            {hospital.logo ? (
              <img
                src={hospital.logo}
                alt={hospital.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {hospital.name?.charAt(0) || "H"}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {hospital.name}
              </h1>
              <p className="text-sm text-gray-500">Book an Appointment</p>
            </div>
          </div>
        </div>

        {/* Appointment Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Patient Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => {}}
              error={errors.name}
              placeholder="Enter your full name"
              required
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => {}}
              error={errors.phone}
              placeholder="Enter phone number"
              required
            />

            <FormInput
              label="Email (Optional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                onBlur={() => {}}
                error={errors.age}
                placeholder="Age"
                required
              />

              <FormSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={GENDER_OPTIONS}
                error={errors.gender}
                required
              />
            </div>

            <FormSelect
              label="Select Doctor (Optional)"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              options={[
                { value: "", label: "No specific doctor" },
                ...doctors.map((doc) => ({
                  value: doc._id,
                  label: `Dr. ${doc.name}`,
                })),
              ]}
            />

            <FormInput
              label="Appointment Date"
              name="appointmentDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />

            <FormTextarea
              label="Symptoms / Reason for Visit"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe your symptoms or reason for visit"
              rows={3}
            />

            <Button type="submit" disabled={submitting} className="w-full mt-6">
              {submitting ? "Submitting..." : "Submit Appointment Request"}
            </Button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your request will be reviewed by the hospital staff. You'll receive
            a token number once approved.
          </p>
        </div>
      </div>
    </div>
  );
};

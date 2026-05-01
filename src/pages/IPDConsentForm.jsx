import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/apiServices';
import { Button, Loading } from '../components/common';
import { ConsentPrintable } from '../components/ConsentPrintable';
import { ConsentFormFiller } from '../components/ConsentFormFiller';
import { toast } from 'react-toastify';

export const IPDConsentForm = () => {
  const { ipdId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('fill'); // 'fill' or 'preview'
  const [filledData, setFilledData] = useState(null);
  const [savedConsent, setSavedConsent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchConsentFormData();
  }, [ipdId]);

  const fetchConsentFormData = async () => {
    try {
      setLoading(true);
      setError('');

      if (!ipdId) {
        setError('IPD ID not found in URL');
        setLoading(false);
        return;
      }

      const response = await doctorService.getConsentFormData(ipdId);

      if (response.data && response.data.data) {
        setFormData(response.data.data);
        const consent = response.data.data.consentForm || null;
        setSavedConsent(consent);
        if (consent) {
          setFilledData(consent);
          setStage('preview');
        } else {
          setStage('fill');
        }
      } else {
        setError('Failed to load consent form data');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch consent form data';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching consent form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formValues) => {
    try {
      setIsSubmitting(true);
      await doctorService.saveConsentFormData(ipdId, formValues);
      setFilledData(formValues);
      setSavedConsent(formValues);
      setStage('preview');
      toast.success('Form saved successfully! Ready to preview and print.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save consent form');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToEdit = () => {
    setStage('fill');
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={handleClose} variant="secondary">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Data</h3>
            <p className="text-yellow-700 mb-4">Consent form data not available</p>
            <Button onClick={handleClose} variant="secondary">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // STAGE 1: FILL FORM
  if (stage === 'fill') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <div className="sticky top-0 bg-white shadow-md z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">IPD Admission Consent Form</h1>
              <p className="text-sm text-gray-600">Step 1 of 2: Fill in the required information</p>
            </div>

            <Button
              onClick={handleClose}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </Button>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <ConsentFormFiller
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              ipd={formData?.ipd}
              patient={formData?.patient}
              initialData={savedConsent}
            />
          </div>
        </div>
      </div>
    );
  }

  // STAGE 2: PREVIEW & PRINT
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #consent-form-container,
          #consent-form-container * {
            visibility: visible;
          }
          #consent-form-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header with Buttons - Hidden in print */}
      <div className="no-print sticky top-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">IPD Admission Consent Form</h1>
            <p className="text-sm text-gray-600">Step 2 of 2: Preview & Print</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleBackToEdit}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Edit
            </Button>

            <Button
              onClick={handlePrint}
              variant="primary"
              className="flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4a2 2 0 100-4 2 2 0 000 4zm0-6H9m4 0h.01M9 11h.01"
                />
              </svg>
              Print
            </Button>

            <Button
              onClick={handleClose}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-6">
        <div
          id="consent-form-container"
          className="mx-auto bg-white shadow-lg"
        >
          <ConsentPrintable
            hospital={formData?.hospital}
            patient={formData?.patient}
            ipd={formData?.ipd}
            filledData={filledData || savedConsent || {}}
          />
        </div>
      </div>

      {/* Footer with buttons - Hidden in print */}
      <div className="no-print bg-white shadow-md border-t border-gray-200 py-4 sticky bottom-0">
        <div className="max-w-6xl mx-auto px-6 flex justify-between gap-4">
          <div className="flex gap-3">
            <Button onClick={handleBackToEdit} variant="secondary">
              Back to Edit
            </Button>
            <Button onClick={handleClose} variant="secondary">
              Close Form
            </Button>
          </div>
          <Button onClick={handlePrint} variant="primary">
            Print Consent Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IPDConsentForm;


import { useState } from 'react';
import { receptionistService } from '../../services/apiServices';
import { FormInput, Button, Card, ErrorAlert,  EmptyState } from '../../components/common';
import { formatDate } from '../../utils/helpers';

export const SearchPatientPage = () => {
  const [phone, setPhone] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await receptionistService.searchPatient(phone);
      
      setPatient(response.data.patient);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Patient not found');
      setPatient(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Patient</h1>
        <p className="text-gray-600 mt-2">Find a patient by phone number</p>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <FormInput
            type="tel"
            placeholder="Enter patient phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary" loading={loading}>
            Search
          </Button>
        </form>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {searched && !patient && !loading && (
        <EmptyState message="No patient found with this phone number" />
      )}

      {patient && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-lg font-semibold text-gray-900">{patient.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-lg font-semibold text-gray-900">{patient.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="text-lg font-semibold text-gray-900">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Blood Group</p>
              <p className="text-lg font-semibold text-gray-900">{patient.bloodGroup || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registered</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(patient.createdAt)}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

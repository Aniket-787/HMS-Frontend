import { useState } from 'react';
import { receptionistService } from '../../services/apiServices';
import { FormInput, Button, Card, ErrorAlert, EmptyState } from '../../components/common';
import { formatDate } from '../../utils/helpers';

export const SearchPatientPage = () => {
  const [phone, setPhone] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const isValidPhone = (num) => /^[6-9]\d{9}$/.test(num);

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmed = phone.trim();

    // ✅ validation
    if (!trimmed) {
      setError('Please enter a phone number');
      return;
    }

    if (!isValidPhone(trimmed)) {
      setError('Enter a valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setPatient(null);

      const res = await receptionistService.searchPatient(trimmed);

      if (!res.data.patient) {
        setPatient(null);
      } else {
        setPatient(res.data.patient);
      }

      setSearched(true);

    } catch (err) {
      // ✅ better error distinction
      if (err.response?.status === 404) {
        setPatient(null);
      } else {
        setError('Something went wrong. Try again.');
      }
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setPhone(value);
    setError('');
    setSearched(false);
  };

  const resetSearch = () => {
    setPhone('');
    setPatient(null);
    setError('');
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold">Search Patient</h1>
          <p className="text-gray-600">Search by phone number</p>
        </div>

        {/* SEARCH */}
        <Card className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">

            <FormInput
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={loading}
            />

            <div className="flex gap-2 items-end">
              <Button type="submit" loading={loading}>
                Search
              </Button>

              <Button type="button" onClick={resetSearch} disabled={loading}>
                Reset
              </Button>
            </div>

          </form>
        </Card>

        {/* ERROR */}
        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {/* NO RESULT */}
        {searched && !patient && !loading && !error && (
          <EmptyState message="No patient found" />
        )}

        {/* RESULT */}
        {patient && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Patient Details</h2>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-gray-500">Name</p>
                <p>{patient.name}</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p>{patient.phone}</p>
              </div>

              <div>
                <p className="text-gray-500">Age</p>
                <p>{patient.age}</p>
              </div>

              <div>
                <p className="text-gray-500">Gender</p>
                <p>{patient.gender}</p>
              </div>

              <div>
                <p className="text-gray-500">Blood Group</p>
                <p>{patient.bloodGroup || 'N/A'}</p>
              </div>

              <div>
                <p className="text-gray-500">Registered</p>
                <p>{formatDate(patient.createdAt)}</p>
              </div>

              <div className="col-span-2">
                <p className="text-gray-500">Address</p>
                <p>{patient.address || 'N/A'}</p>
              </div>

            </div>
          </Card>
        )}

      </div>
    </div>
  );
};
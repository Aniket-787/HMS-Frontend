import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { receptionistService } from '../../services/apiServices';
import { Button, Card, ErrorAlert, EmptyState } from '../../components/common';
import { formatDate } from '../../utils/helpers';

export const SearchPatientPage = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const isValidPhone = (num) => /^[6-9]\d{9}$/.test(num);

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmed = phone.trim();

    if (!trimmed) return setError('Enter phone or UHID');

    try {
      setLoading(true);
      setError('');
      setPatient(null);

      const res = await receptionistService.searchPatient(trimmed);

      setPatient(res.data.patient || null);
      setSearched(true);

    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Something went wrong');
      }
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOPD = () => {
    navigate('/receptionist/create-visit', { state: { patient } });
  };

  const handleAddToIPD = () => {
    navigate('/receptionist/ipd', { state: { patient } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">

      <div className="w-full max-w-4xl space-y-6">

        {/* 🔥 HEADER */}
        <div>
          <h1 className="text-xl font-semibold">Search Patient</h1>
          <p className="text-sm text-gray-500">
            Search using phone number or UHID
          </p>
        </div>

        {/* 🔥 SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 bg-white border rounded p-2 shadow-sm"
        >
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError('');
              setSearched(false);
            }}
            placeholder="Enter phone or UHID"
            className="flex-1 outline-none px-2 text-sm"
          />

          <Button type="submit" loading={loading}>
            Search
          </Button>
        </form>

        {/* ERROR */}
        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {/* NO RESULT */}
        {searched && !patient && !loading && (
          <EmptyState message="No patient found" />
        )}

        {/* 🔥 RESULT */}
        {patient && (
          <div className="grid md:grid-cols-2 gap-4">

            {/* LEFT: DETAILS */}
            <div className="bg-white border rounded p-4 space-y-3">

              <h2 className="font-semibold text-sm text-gray-600">
                Patient Info
              </h2>

              <div className="grid grid-cols-2 gap-3 text-sm">

                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>

                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>

                <div>
                  <p className="text-gray-400">Age</p>
                  <p className="font-medium">{patient.age}</p>
                </div>

                <div>
                  <p className="text-gray-400">Gender</p>
                  <p className="font-medium">{patient.gender}</p>
                </div>

                <div>
                  <p className="text-gray-400">Blood</p>
                  <p className="font-medium">{patient.bloodGroup || '-'}</p>
                </div>

                <div>
                  <p className="text-gray-400">UHID</p>
                  <p className="font-medium">{patient.uhid}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-gray-400">Registered</p>
                  <p className="font-medium">{formatDate(patient.createdAt)}</p>
                </div>

              </div>

            </div>

            {/* RIGHT: ACTIONS */}
            <div className="bg-white border rounded p-4 flex flex-col justify-between">

              <div>
                <h2 className="font-semibold text-sm text-gray-600 mb-2">
                  Actions
                </h2>

                <p className="text-xs text-gray-500">
                  Choose what you want to do with this patient
                </p>
              </div>

              <div className="space-y-2 mt-4">

                <button
                  onClick={handleAddToOPD}
                  className="w-full h-10 bg-blue-500 text-white rounded text-sm font-medium"
                >
                  Add to OPD
                </button>

                <button
                  onClick={handleAddToIPD}
                  className="w-full h-10 bg-green-600 text-white rounded text-sm font-medium"
                >
                  Add to IPD
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
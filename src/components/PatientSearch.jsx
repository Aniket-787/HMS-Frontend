import { useState, useEffect, useRef } from 'react';
import { receptionistService } from '../services/apiServices';
import { FormInput } from './common';

export const PatientSearch = ({ onPatientSelect, placeholder = "Search by phone or UHID..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const searchRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 3) {
        searchPatients(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPatients = async (query) => {
    try {
      setLoading(true);
      setSuggestions([]);
      
      // Try searching by phone first
      try {
        const response = await receptionistService.searchPatient(query);
        if (response.data.patient) {
          setSuggestions([response.data.patient]);
          setShowSuggestions(true);
          setLoading(false);
          return;
        }
      } catch (phoneSearchError) {
        // If phone search fails, continue to UHID search
        console.log('Phone search did not find patient, trying UHID search');
      }

      // If not found by phone, try searching in patient list by UHID and name
      try {
        const allPatientsResponse = await receptionistService.getPatientList();
        const patients = allPatientsResponse.data.patientlist || [];
        const filteredPatients = patients.filter(patient =>
          patient.uhid.toLowerCase().includes(query.toLowerCase()) ||
          patient.name.toLowerCase().includes(query.toLowerCase()) ||
          patient.phone.includes(query)
        );
        setSuggestions(filteredPatients.slice(0, 5)); // Limit to 5 suggestions
        setShowSuggestions(true);
      } catch (listSearchError) {
        console.error('Error fetching patient list:', listSearchError);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(`${patient.name} (${patient.phone}) - ${patient.uhid}`);
    setShowSuggestions(false);
    onPatientSelect(patient);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear selection if user is typing
    if (selectedPatient && value !== `${selectedPatient.name} (${selectedPatient.phone}) - ${selectedPatient.uhid}`) {
      setSelectedPatient(null);
      onPatientSelect(null);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <FormInput
        label="Patient"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => searchTerm && setShowSuggestions(true)}
        required
      />

      {loading && (
        <div className="absolute right-3 top-9 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
          {suggestions.map((patient) => (
            <div
              key={patient._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelectPatient(patient)}
            >
              <div className="font-medium text-gray-900">{patient.name}</div>
              <div className="text-sm text-gray-600">
                Phone: {patient.phone} | UHID: {patient.uhid}
              </div>
              <div className="text-xs text-gray-500">
                Age: {patient.age} | Gender: {patient.gender}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !loading && searchTerm.length >= 3 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
          <div className="px-4 py-2 text-gray-500 text-sm">
            No patients found
          </div>
        </div>
      )}
    </div>
  );
};
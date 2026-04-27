import { useState, useEffect, useRef } from 'react';
import { Search, X, User, Phone, Hash } from 'lucide-react';
import { receptionistService } from '../../services/apiServices';

export const SearchDropdown = ({
  onPatientSelect,
  placeholder = "Search by phone or UHID...",
  debounceMs = 300,
  maxResults = 5,
}) => {
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
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

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
        // If phone search fails, continue to patient list search
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
        setSuggestions(filteredPatients.slice(0, maxResults));
        setShowSuggestions(true);
      } catch (listSearchError) {
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
    setSearchTerm(`${patient.name} (${patient.phone})`);
    setShowSuggestions(false);
    onPatientSelect(patient);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setSelectedPatient(null);
    setShowSuggestions(false);
    onPatientSelect(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear selection if user is typing
    if (selectedPatient && value !== `${selectedPatient.name} (${selectedPatient.phone})`) {
      setSelectedPatient(null);
      onPatientSelect(null);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm && setShowSuggestions(true)}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-y-auto mt-1">
          {suggestions.map((patient) => (
            <div
              key={patient._id}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handleSelectPatient(patient)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{patient.name}</div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {patient.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {patient.uhid}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {patient.age} yrs
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !loading && searchTerm.length >= 3 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
          <div className="px-4 py-3 text-gray-500 text-sm text-center">
            No patients found
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
import { User, Phone, Calendar, Hash, UserPlus, Bed } from 'lucide-react';
import { Button } from '../common';

export const PatientCard = ({ patient, onAddToOPD, onAddToIPD, loading = false }) => {
  if (!patient) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <User className="w-5 h-5" />
          Patient Details
        </h3>
      </div>

      {/* Patient Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 truncate">
              {patient.name}
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                <Hash className="w-3.5 h-3.5" />
                {patient.uhid}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="w-3.5 h-3.5" />
                {patient.age} yrs / {patient.gender}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{patient.phone}</span>
          </div>
          {patient.bloodGroup && (
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                {patient.bloodGroup}
              </span>
            </div>
          )}
        </div>

        {patient.allergies && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-medium text-amber-700">Allergies</p>
            <p className="text-sm text-amber-800">{patient.allergies}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToOPD(patient)}
            disabled={loading}
            className="flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add to OPD
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAddToIPD(patient)}
            disabled={loading}
            className="flex items-center justify-center gap-2"
          >
            <Bed className="w-4 h-4" />
            Add to IPD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
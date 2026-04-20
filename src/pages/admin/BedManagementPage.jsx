import { useState, useEffect } from 'react';
import { adminService } from '../../services/apiServices';
import { useForm } from '../../hooks';
import { FormInput, FormSelect, Button, Loading} from '../../components/common';
import { Table } from '../../components/Table';
import { toast } from 'react-toastify';

const BED_TYPES = [
  { value: 'GENERAL', label: 'General' },
  { value: 'PRIVATE', label: 'Private' },
  { value: 'ICU', label: 'ICU' }
];

export const BedManagementPage = () => {
  const [beds, setBeds] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      setLoadingData(true);
      const response = await adminService.getBeds();
      setBeds(response.data.beds || []);
    } catch (error) {
      toast.error('Failed to load beds');
    } finally {
      setLoadingData(false);
    }
  };

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit, resetForm } = useForm(
    {
      bedNumber: '',
      type: '',
      chargePerDay: '',
    },
    async (formValues) => {
      try {
        

        const newErrors = {};
        if (!formValues.bedNumber) newErrors.bedNumber = 'Bed number is required';
        if (!formValues.type) newErrors.type = 'Bed type is required';
        if (!formValues.chargePerDay) newErrors.chargePerDay = 'Charge per day is required';

        if (Object.keys(newErrors).length > 0) {
          return;
        }

        await adminService.createBed({
          ...formValues,
          chargePerDay: parseFloat(formValues.chargePerDay),
        });

        toast.success('Bed created successfully!');
        resetForm();
        fetchBeds(); // Refresh the list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create bed');
      }
    }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'VACANT': return 'text-green-600 bg-green-100';
      case 'OCCUPIED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ICU': return 'text-red-600 bg-red-100';
      case 'PRIVATE': return 'text-blue-600 bg-blue-100';
      case 'GENERAL': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const bedColumns = [
    { key: 'bedNumber', header: 'Bed Number', render: (bed) => bed.bedNumber },
    { key: 'type', header: 'Type', render: (bed) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(bed.type)}`}>
        {bed.type}
      </span>
    )},
    { key: 'chargePerDay', header: 'Charge/Day', render: (bed) => `₹${bed.chargePerDay}` },
    { key: 'status', header: 'Status', render: (bed) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bed.status)}`}>
        {bed.status}
      </span>
    )},
    { key: 'patient', header: 'Patient', render: (bed) => bed.patientId ? 'Occupied' : 'Vacant' },
  ];

  if (loadingData) {
    return <Loading />;
  }

  // Group beds by type for summary
  const bedSummary = beds.reduce((acc, bed) => {
    if (!acc[bed.type]) {
      acc[bed.type] = { total: 0, vacant: 0, occupied: 0 };
    }
    acc[bed.type].total++;
    if (bed.status === 'VACANT') acc[bed.type].vacant++;
    else acc[bed.type].occupied++;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bed Management</h1>
        <p className="text-gray-600 mt-2">Manage hospital beds and their availability</p>
      </div>

      

      {/* Bed Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(bedSummary).map(([type, stats]) => (
          <div key={type} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{type} Ward</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Vacant:</span>
                <span className="font-medium text-green-600">{stats.vacant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Occupied:</span>
                <span className="font-medium text-red-600">{stats.occupied}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Bed Form */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Bed</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Bed Number"
            type="text"
            name="bedNumber"
            placeholder="e.g., 101"
            value={values.bedNumber}
            onChange={handleChange}
            error={errors.bedNumber}
            touched={touched.bedNumber}
            required
          />

          <FormSelect
            label="Bed Type"
            name="type"
            options={BED_TYPES}
            value={values.type}
            onChange={handleChange}
            error={errors.type}
            touched={touched.type}
            required
          />

          <FormInput
            label="Charge Per Day"
            type="number"
            name="chargePerDay"
            placeholder="Enter daily charge"
            value={values.chargePerDay}
            onChange={handleChange}
            error={errors.chargePerDay}
            touched={touched.chargePerDay}
            required
          />

          <div className="md:col-span-3 flex justify-end">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Add Bed
            </Button>
          </div>
        </form>
      </div>

      {/* Beds List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Beds</h2>
        <Table
          columns={bedColumns}
          data={beds}
          emptyMessage="No beds found"
        />
      </div>
    </div>
  );
};
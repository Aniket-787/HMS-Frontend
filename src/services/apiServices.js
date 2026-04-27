import axios from 'axios';
import axiosInstance from './axiosInstance';

export const authService = {
  login: (email, password) => {
    return axiosInstance.post('/auth/login', { email, password });
  },
};

export const superAdminService = {
  // Hospital Management
  createHospital: (data) => {
    return axiosInstance.post('/superAdmin/hospital', data);
  },

  createAdmin: (data) => {
    return axiosInstance.post('/superAdmin/hospital/admin', data);
  },

  getAllHospitals: () => {
    return axiosInstance.get('/superAdmin/hospitalList');
  },

   getAllAdmins: () => {
    return axiosInstance.get('/superAdmin/admins');
  },

   getAllStaff: () => {
    return axiosInstance.get('/superAdmin/allstaff');
  },

   getAllpatients: () => {
    return axiosInstance.get('/superAdmin/allpatients');
  },

  getHospitalById: (id) => {
    return axiosInstance.get(`/superAdmin/hospital/${id}`);
  },

  uploadHospitalLogo: (formData) => {
    return axiosInstance.put('/superAdmin/hospital/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const adminService = {
  // Doctor Management
  createDoctor: (data) => {
    return axiosInstance.post('/admin/doctor', data);
  },

  getDoctors: () => {
    return axiosInstance.get('/admin/doctorslist');
  },

  getDoctorById: (id) => {
    return axiosInstance.get(`/admin/doctor/${id}`);
  },

  // Receptionist Management
  createReceptionist: (data) => {
    return axiosInstance.post('/admin/receptionist', data);
  },

  getReceptionists: () => {
    return axiosInstance.get('/admin/receptionistlist');
  },

  getReceptionistById: (id) => {
    return axiosInstance.get(`/admin/receptionist/${id}`);
  },

  // Staff Management
  getAllStaff: () => {
    return axiosInstance.get('/admin/staff');
  },

   getpatients: () => {
    return axiosInstance.get('/admin/patients');
  },

  getAppointments: ()=>{
    return axiosInstance.get('/admin/appointments')
  },

  // Bed Management
  createBed: (data) => {
    return axiosInstance.post('/admin/createbed', data);
  },

  getBeds: () => {
    return axiosInstance.get('/admin/beds');
  },

  // Hospital Management
  getHospital: () => {
    return axiosInstance.get('/admin/hospital');
  },

  getHospitalStats: () => {
    return axiosInstance.get('/admin/hospital/stats');
  },

  getHospitalQR: (id) => {
    return axiosInstance.get(`/hospital/${id}/qrcode`);
  } 
};

export const receptionistService = {
  // Patient Management
  registerPatient: (data) => {
    return axiosInstance.post('/receptionist/patient', data);
  },

  searchPatient: (phone) => {
    return axiosInstance.get('/receptionist/search/patient', {
      params: { phone },
    });
  },

  getPatientList: () => {
    return axiosInstance.get('/receptionist/patientlist');
  },

  // OPD Management
  createOPD: (data) => {
    return axiosInstance.post('/receptionist/opd', data);
  },

  getOPDList: () => {
    return axiosInstance.get('/receptionist/opdlist');
  },

  // Combined Visit (Patient + OPD)
  createVisit: (data) => {
    return axiosInstance.post('/receptionist/createVisit', data);
  },

  getOPDById: (id) => {
    return axiosInstance.get(`/receptionist/opd/${id}`);
  },

   getDoctors: () => {
    return axiosInstance.get('/receptionist/doctorslist');
  },

  getPendingAppointments : ()=>{
    return axiosInstance.get('/receptionist/pending')
  },

  markAsPaid: (id) => {
    return axiosInstance.patch(`/receptionist/opd/${id}/payment`);
  },

  // Appointment Requests
  getAppointmentRequests: (hospitalId, status) => {
  const params = {};

  if (hospitalId) params.hospitalId = hospitalId;
  if (status) params.status = status;

  return axiosInstance.get('/receptionist/appointment-requests', { params });
},

  approveAppointmentRequest: (id) => {
    return axiosInstance.patch(`/receptionist/appointment-requests/${id}/approve`);
  },

  rejectAppointmentRequest: (id) => {
    return axiosInstance.patch(`/receptionist/appointment-requests/${id}/reject`);
  },

  

};

export const doctorService = {
  // Queue Management
  getQueue: () => {
    return axiosInstance.get('/doctor/queue');
  },

  // OPD Update
  updateOPD: (id, data) => {
    return axiosInstance.put(`/doctor/opd/${id}`, data);
  },

  // Patient History
  getPatientHistory: (patientId) => {
    return axiosInstance.get(`/doctor/patient/${patientId}/history`);
  },

  getTodayPatients : ()=>{
    return axiosInstance.get('/doctor/today/patients');
  },

  getCompletedPatients : ()=>{
    return axiosInstance.get('/doctor/completed/patients')
  },

  getTotalpatients : ()=>{
    return axiosInstance.get('/doctor/total/patients')
  },

  // IPD Management
  admitPatient: (data) => {
    return axiosInstance.post('/doctor/admit/ipd', data);
  },

  getAdmittedPatients: () => {
    return axiosInstance.get('/doctor/ipd/admitted');
  },

  getDischargedPatients: () => {
    return axiosInstance.get('/doctor/ipd/discharged');
  },

  addDailyNotes: (ipdId, data) => {
    return axiosInstance.post(`/doctor/ipd/${ipdId}/notes`, data);
  },

  addCharges: (ipdId, data) => {
    return axiosInstance.post(`/doctor/ipd/${ipdId}/charges`, data);
  },

  dischargePatient: (ipdId) => {
    return axiosInstance.put(`/doctor/ipd/discharge/${ipdId}`);
  },

  // Discharge Summary
  createDischargeSummary: (data) => {
    return axiosInstance.post('/discharge/discharge-summary', data);
  },

  getDischargeSummary: (ipdId) => {
    return axiosInstance.get(`/discharge/discharge-summary/${ipdId}`);
  },

  getAllDischargeSummaries: () => {
    return axiosInstance.get('/discharge/discharge-summary');
  },
};

export const analyticsService = {
  getTodayRevenue: () => {
    return axiosInstance.get('/analytics/revenue/today');
  },

  getLast30DaysRevenue: () => {
    return axiosInstance.get('/analytics/revenue/last-30-days');
  },

  getDailyRevenue: () => {
    return axiosInstance.get('/analytics/revenue/daily');
  },
};

// Public API for appointment requests (no auth required)
export const appointmentRequestService = {
  // Submit a new appointment request
  createRequest: (data) => {
    return axios.post(`${axiosInstance.defaults.baseURL}/appointment-request/`, data);
  },

  // Get hospital QR code
  getHospitalQRCode: (hospitalId) => {
    return axios.get(`${axiosInstance.defaults.baseURL}/hospital/${hospitalId}/qrcode`);
  },

   getDoctors: (hospitalId) => {
    return axiosInstance.get(`/appointment-request/public/doctors/${hospitalId}`);
  },
};

// Reports Service
export const reportsService = {
  // Export data (returns blob for download)
  exportData: (type, format, fromDate, toDate) => {
    const config = {
      responseType: 'blob',
      params: { fromDate, toDate }
    };
    return axiosInstance.get(`/reports/${type}/${format}`, config);
  },

  // Get preview data
  getPreview: (type, fromDate, toDate) => {
    return axiosInstance.get(`/reports/${type}/preview`, {
      params: { fromDate, toDate }
    });
  },
};

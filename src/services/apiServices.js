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

  getOPDById: (id) => {
    return axiosInstance.get(`/receptionist/opd/${id}`);
  },

   getDoctors: () => {
    return axiosInstance.get('/receptionist/doctorslist');
  },

  getPendingAppointments : ()=>{
    return axiosInstance.get('/receptionist/pending')
  }

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
  }
};

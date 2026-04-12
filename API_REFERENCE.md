# API Reference & Role Permissions

## Authentication Endpoints

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ token, user }`
- **Who Can Access**: Anyone

```jsx
import { authService } from '../services/apiServices';

const result = await authService.login('user@example.com', 'password');
console.log(result.data.token);
```

---

## Super Admin API

### Hospital Management

#### Create Hospital
- **Endpoint**: `POST /api/superAdmin/hospital`
- **Required Roles**: SUPER_ADMIN
- **Body**:
  ```json
  {
    "name": "City Hospital",
    "address": "123 Main St",
    "phone": "9876543210",
    "email": "hospital@example.com",
    "subscriptionPlan": "PREMIUM",
    "status": "ACTIVE"
  }
  ```

```jsx
await superAdminService.createHospital(data);
```

#### Get All Hospitals
- **Endpoint**: `GET /api/superAdmin/hospitalList`
- **Required Roles**: SUPER_ADMIN

```jsx
const response = await superAdminService.getAllHospitals();
```

#### Create Admin for Hospital
- **Endpoint**: `POST /api/superAdmin/hospital/admin`
- **Required Roles**: SUPER_ADMIN
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "admin@hospital.com",
    "password": "securePassword",
    "phone": "9876543210",
    "hospitalId": "hospital_id_here"
  }
  ```

```jsx
await superAdminService.createAdmin(data);
```

---

## Admin API

### Doctor Management

#### Create Doctor
- **Endpoint**: `POST /api/admin/doctor`
- **Required Roles**: ADMIN
- **Body**:
  ```json
  {
    "name": "Dr. Smith",
    "email": "doctor@hospital.com",
    "password": "securePassword",
    "phone": "9876543210",
    "specialization": "Cardiology",
    "experience": 5
  }
  ```

```jsx
await adminService.createDoctor(data);
```

#### Get All Doctors
- **Endpoint**: `GET /api/admin/doctorslist`
- **Required Roles**: ADMIN

```jsx
const response = await adminService.getDoctors();
```

### Receptionist Management

#### Create Receptionist
- **Endpoint**: `POST /api/admin/receptionist`
- **Required Roles**: ADMIN
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "receptionist@hospital.com",
    "password": "securePassword",
    "phone": "9876543210"
  }
  ```

```jsx
await adminService.createReceptionist(data);
```

#### Get All Receptionists
- **Endpoint**: `GET /api/admin/receptionistlist`
- **Required Roles**: ADMIN

```jsx
const response = await adminService.getReceptionists();
```

#### Get All Staff
- **Endpoint**: `GET /api/admin/staff`
- **Required Roles**: ADMIN
- **Returns**: All doctors and receptionists

```jsx
const response = await adminService.getAllStaff();
```

---

## Receptionist API

### Patient Management

#### Register Patient
- **Endpoint**: `POST /api/receptionist/patient`
- **Required Roles**: RECEPTIONIST
- **Body**:
  ```json
  {
    "name": "John Patient",
    "phone": "9876543210",
    "age": 35,
    "gender": "MALE",
    "address": "123 Patient St",
    "bloodGroup": "O+",
    "allergies": "Penicillin",
    "emergencyContact": "9876543211"
  }
  ```

```jsx
await receptionistService.registerPatient(data);
```

#### Search Patient by Phone
- **Endpoint**: `GET /api/receptionist/search/patient?phone=9876543210`
- **Required Roles**: RECEPTIONIST
- **Params**: `phone` (string)

```jsx
const response = await receptionistService.searchPatient('9876543210');
```

#### Get All Patients
- **Endpoint**: `GET /api/receptionist/patientlist`
- **Required Roles**: RECEPTIONIST

```jsx
const response = await receptionistService.getPatientList();
```

### OPD Management

#### Create OPD Appointment
- **Endpoint**: `POST /api/receptionist/opd`
- **Required Roles**: RECEPTIONIST
- **Body**:
  ```json
  {
    "patientId": "patient_id",
    "doctorId": "doctor_id",
    "symptoms": "Chest pain, shortness of breath"
  }
  ```

```jsx
await receptionistService.createOPD(data);
```

#### Get Today's OPD List
- **Endpoint**: `GET /api/receptionist/opdlist`
- **Required Roles**: RECEPTIONIST

```jsx
const response = await receptionistService.getOPDList();
```

---

## Doctor API

### Queue Management

#### Get Today's Queue
- **Endpoint**: `GET /api/doctor/queue`
- **Required Roles**: DOCTOR
- **Returns**: All OPD appointments for today sorted by token

```jsx
const response = await doctorService.getQueue();
```

#### Update OPD Record
- **Endpoint**: `PUT /api/doctor/opd/:id`
- **Required Roles**: DOCTOR
- **Body**:
  ```json
  {
    "diagnosis": "Hypertension",
    "medicines": [
      {
        "name": "Aspirin",
        "dosage": "500mg",
        "duration": "10 days"
      }
    ],
    "notes": "Take medication after meals",
    "status": "COMPLETED"
  }
  ```

```jsx
await doctorService.updateOPD(opdId, data);
```

### Patient History

#### Get Patient Medical History
- **Endpoint**: `GET /api/doctor/patient/:patientId/history`
- **Required Roles**: DOCTOR
- **Returns**: All past OPD records for the patient

```jsx
const response = await doctorService.getPatientHistory(patientId);
```

---

## Role Permissions Matrix

| Feature | Super Admin | Admin | Doctor | Receptionist |
|---------|:-----------:|:-----:|:------:|:------------:|
| Create Hospital | ✅ | ❌ | ❌ | ❌ |
| Create Admin | ✅ | ❌ | ❌ | ❌ |
| View Hospitals | ✅ | ❌ | ❌ | ❌ |
| Create Doctor | ❌ | ✅ | ❌ | ❌ |
| Create Receptionist | ❌ | ✅ | ❌ | ❌ |
| View Staff | ❌ | ✅ | ❌ | ❌ |
| Register Patient | ❌ | ❌ | ❌ | ✅ |
| Search Patient | ❌ | ❌ | ❌ | ✅ |
| Create OPD | ❌ | ❌ | ❌ | ✅ |
| View OPD List | ❌ | ❌ | ❌ | ✅ |
| View Queue | ❌ | ❌ | ✅ | ❌ |
| Update OPD | ❌ | ❌ | ✅ | ❌ |
| View Patient History | ❌ | ❌ | ✅ | ❌ |

---

## Error Handling

All API responses follow this pattern:

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error

### Error Handling in Code
```jsx
try {
  const response = await doctorService.getQueue();
  console.log(response.data);
} catch (error) {
  // Access error message
  const errorMsg = error.response?.data?.message || 'An error occurred';
  console.error(errorMsg);
}
```

---

## Pagination & Filtering

Currently, endpoints return all data. For future pagination support:

```jsx
// Planned
const response = await receptionistService.getPatientList({
  page: 1,
  limit: 10,
  search: 'john'
});
```

---

## Rate Limiting

No rate limiting currently implemented. Implement on backend for production.

---

## Token Management

Tokens are automatically managed:
- **Storage**: `localStorage.token`
- **Expiration**: Handled by backend
- **Refresh**: Implement token refresh endpoint if needed

### Manual Token Management
```jsx
import { getToken, setToken, removeToken } from '../utils/helpers';

// Get current token
const token = getToken();

// Set token
setToken('new_token_here');

// Remove token
removeToken();
```

---

## API Service Usage Examples

### In React Components
```jsx
import { useEffect, useState } from 'react';
import { doctorService } from '../services/apiServices';

export const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await doctorService.getQueue();
        setData(response.data.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render data */}</div>;
};
```

---

For more details, check individual service files in `src/services/apiServices.js`.

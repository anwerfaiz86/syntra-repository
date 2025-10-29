import React, { useState } from 'react';
import EmployeeView from './components/EmployeeView';
import AdminView from './components/AdminView';

export default function App(){
  const [role, setRole] = useState('employee');
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Safety Defects App</h3>
        <div>
          <label className="me-2">Role:</label>
          <select className="form-select d-inline-block w-auto" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      { role === 'employee' ? <EmployeeView /> : <AdminView /> }
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import EmployeeTable from './EmployeeTable';
import EmployeeModal from './EmployeeModal';
import EmployeeViewModal from './EmployeeViewModal';
import AttendanceModal from './AttendanceModal';
import employeeService from '../../services/employeeService';
import { departments } from '../../data/mockData';
import { Plus, Search, Download, Users, UserCheck, Clock, Building2, Calendar } from 'lucide-react';
import Button from '../common/Button';
import '../../styles/EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [error, setError] = useState('');

  // Generate Employee ID
  const generateEmployeeId = () => {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Generate sample attendance for a month
  const generateMonthlyAttendance = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const records = {};
    
    for (let i = 1; i <= Math.min(daysInMonth, today.getDate()); i++) {
      const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const rand = Math.random();
      records[dateKey] = {
        status: rand > 0.2 ? 'full' : rand > 0.1 ? 'half' : 'absent',
        hours: rand > 0.2 ? 8 : rand > 0.1 ? 4 : 0
      };
    }
    return records;
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAll();
      
      // Add employeeId and workingType if not exists
      const updatedEmployees = response.data.map(emp => ({
        ...emp,
        employeeId: emp.employeeId || generateEmployeeId(),
        workingType: emp.workingType || 'Office'
      }));
      
      setEmployees(updatedEmployees);
      
      // Initialize attendance for all employees
      const attendanceData = {};
      updatedEmployees.forEach(emp => {
        attendanceData[emp._id] = generateMonthlyAttendance();
      });
      setAttendance(attendanceData);
      
      setError('');
    } catch (error) {
      setError(error.message || 'Failed to fetch employees');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All Departments' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleView = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    if (employee) {
      setViewingEmployee(employee);
      setShowViewModal(true);
    }
  };

  const handleAttendanceView = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    if (employee) {
      setViewingEmployee(employee);
      setShowAttendanceModal(true);
    }
  };

  const handleEdit = (employeeId) => {
    const employee = employees.find(emp => emp._id === employeeId);
    if (employee) {
      setEditingEmployee(employee);
      setShowModal(true);
    }
  };

  const handleEditFromView = (employee) => {
    setShowViewModal(false);
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(employeeId);
        
        // Remove from attendance
        const newAttendance = { ...attendance };
        delete newAttendance[employeeId];
        setAttendance(newAttendance);
        
        fetchEmployees();
      } catch (error) {
        alert(error.message || 'Failed to delete employee');
      }
    }
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      const dataToSave = {
        ...employeeData,
        employeeId: employeeData.employeeId || generateEmployeeId(),
        workingType: employeeData.workingType || 'Office'
      };
      
      if (editingEmployee) {
        await employeeService.update(editingEmployee._id, dataToSave);
      } else {
        const response = await employeeService.create(dataToSave);
        // Initialize attendance for new employee
        setAttendance({
          ...attendance,
          [response.data._id]: generateMonthlyAttendance()
        });
      }
      setShowModal(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      alert(error.message || 'Failed to save employee');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Employee ID', 'Name', 'Email', 'Designation', 'Department', 'Phone', 'Working Type', 'Status', 'Join Date'],
      ...employees.map(emp => [
        emp.employeeId,
        emp.name,
        emp.email,
        emp.designation,
        emp.department,
        emp.phone,
        emp.workingType,
        emp.status,
        new Date(emp.joinDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="employee-page">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="employee-page">
      <div className="employee-header">
        <div>
          <h1 className="employee-title">Employee Management</h1>
          <p className="employee-subtitle">Manage your team members and their information</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={handleAddNew}>
          Add New Employee
        </Button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="employee-stats-container">
        <div className="employee-stat-card">
          <div className="stat-icon-wrapper blue">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Employees</p>
            <p className="stat-value">{employees.length}</p>
          </div>
        </div>
        <div className="employee-stat-card">
          <div className="stat-icon-wrapper green">
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active</p>
            <p className="stat-value">{employees.filter(e => e.status === 'Active').length}</p>
          </div>
        </div>
        <div className="employee-stat-card">
          <div className="stat-icon-wrapper orange">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">On Leave</p>
            <p className="stat-value">{employees.filter(e => e.status === 'On Leave').length}</p>
          </div>
        </div>
        <div className="employee-stat-card">
          <div className="stat-icon-wrapper purple">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Departments</p>
            <p className="stat-value">{departments.length - 1}</p>
          </div>
        </div>
      </div>

      <div className="employee-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAttendance={handleAttendanceView}
      />

      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSaveEmployee}
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {showViewModal && (
        <EmployeeViewModal
          employee={viewingEmployee}
          attendance={attendance[viewingEmployee?._id]}
          onClose={() => {
            setShowViewModal(false);
            setViewingEmployee(null);
          }}
          onEdit={handleEditFromView}
        />
      )}

      {showAttendanceModal && (
        <AttendanceModal
          employee={viewingEmployee}
          attendance={attendance[viewingEmployee?._id]}
          onClose={() => {
            setShowAttendanceModal(false);
            setViewingEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
import React, { useState, useEffect, useCallback } from 'react';

interface Trainer {
  id: number;
  name: string;
  contact: string;
  email?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
}

interface CustomerFormData {
  userId: string;
  name: string;
  age: string;
  email: string;
  date: string;
  bookingTime: string;
  address: string;
  area: string;
  city: string;
  pinCode: string;
  mobileNumber: string;
  chosenPlan: string;
  payment: string;
  chosenPackage: string;
  trialSession: string;
  timeSlot: string;
  assignedTrainer: string;
  trainerContact: string;
  trainerId?: number;
  landmark: string;
  trainingFor: string;
  trainingNeededFor: string;
  trainerType: string;
  bookingName: string;
}

import { get, post } from '../services/apiService';

const CustomerManagementForm: React.FC = () => {
  const [formData, setFormData] = useState<CustomerFormData>({
    userId: '',
    name: '',
    age: '',
    email: '',
    date: '',
    bookingTime: '',
    address: '',
    area: '',
    city: '',
    pinCode: '',
    mobileNumber: '',
    chosenPlan: '',
    payment: '',
    chosenPackage: '',
    trialSession: '',
    timeSlot: '',
    assignedTrainer: '',
    trainerContact: '',
    landmark: '',
    trainingFor: 'self',
    trainingNeededFor: 'self',
    trainerType: 'basic',
    bookingName: ''
  });

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch trainers from API
  useEffect(() => {
    const fetchTrainers = async (): Promise<void> => {
      setIsLoading(true);
      setError('');
      try {
        const response = await get('/trainer-list', { limit: 10000, offset: 0 });
        
        console.log('Trainers API response:', response);
        
        if (response && response.response && response.response.rows) {
          const trainersData = response.response.rows.map((trainer: any) => ({
            id: trainer.id,
            name: trainer.name || `${trainer.first_name || ''} ${trainer.last_name || ''}`.trim(),
            contact: trainer.phone || trainer.mobile || trainer.contact || 'N/A',
            email: trainer.email
          }));
          setTrainers(trainersData);
        } else {
          console.warn('Unexpected trainers response structure:', response);
          setError('Failed to load trainers: Unexpected response structure');
        }
      } catch (err: any) {
        console.error('Error fetching trainers:', err);
        setError(`Failed to load trainers: ${err.message || 'Network error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Fetch users from API
  const fetchUsers = useCallback(async (search: string = ''): Promise<void> => {
    setIsLoadingUsers(true);
    setError('');
    try {
      console.log('Fetching users with search:', search);
      
      const response = await get('/user-list', { 
        search: search,
        limit: 20, 
        offset: 0 
      });
      
      console.log('Users API Response:', response);
      
      let usersData: any[] = [];
      
      if (response && response.response && response.response.rows) {
        usersData = response.response.rows;
      } else if (response && response.rows) {
        usersData = response.rows;
      } else if (Array.isArray(response)) {
        usersData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        usersData = response.data;
      }
      
      console.log('Extracted users data:', usersData);
      
      if (usersData.length > 0) {
        const formattedUsers = usersData.map((user: any) => {
          let phone = user.mobile || user.phone;
          
          if (!phone && user.payments && user.payments[0]) {
            phone = user.payments[0].phone || user.payments[0].mobile;
          }
          
          if (!phone && user.service_booking) {
            phone = user.service_booking.phone || user.service_booking.mobile;
          }
          
          return {
            id: user.id,
            name: user.name || 
                  `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
                  'Unnamed User',
            email: user.email || 'N/A',
            phone: phone || 'N/A',
            age: user.age
          };
        });
        
        console.log('Formatted users:', formattedUsers);
        setUsers(formattedUsers);
      } else {
        console.log('No users found in response');
        setUsers([]);
      }
      
    } catch (err: any) {
      console.error('Error fetching users:', err);
      
      if (err.response) {
        console.error('Error response status:', err.response.status);
        console.error('Error response data:', err.response.data);
      }
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view users.');
      } else if (err.message?.includes('Network Error')) {
        setError('Network error. Please check your connection.');
      } else {
        setError(`Failed to load users: ${err.message || 'Unknown error'}`);
      }
      
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSelect = (user: User): void => {
    setFormData(prev => ({
      ...prev,
      userId: user.id.toString(),
      name: user.name || '',
      email: user.email || '',
      mobileNumber: user.phone || '',
      age: user.age ? user.age.toString() : ''
    }));
  };

  const handleAssignTrainer = (trainer: Trainer): void => {
    setFormData(prev => ({
      ...prev,
      assignedTrainer: trainer.name,
      trainerContact: trainer.contact,
      trainerId: trainer.id
    }));
  };

  const handleSearchUsers = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const timeoutId = setTimeout(() => {
      fetchUsers(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.userId) {
      setError('Please select a user first');
      return;
    }
    
    if (!formData.chosenPlan) {
      setError('Please select a service type');
      return;
    }
    
    if (!formData.date) {
      setError('Please select a date');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare data for API - ONLY include fields that are accepted by the API
      // Based on your Postman structure, these are the accepted fields:
      const submitData = {
        user_id: formData.userId,
        trainer_id: formData.trainerId?.toString() || "",
        service_booking_step: 1,
        service_type: formData.chosenPlan.toLowerCase(),
        preferred_time_to_be_served: formData.bookingTime,
        training_for: formData.trainingFor,
        trial_date: formData.date,
        trial_time: formData.timeSlot,
        trainer_type: formData.trainerType,
        training_needed_for: formData.trainingNeededFor,
        booking_name: formData.bookingName || `${formData.chosenPlan} ${formData.chosenPackage} Session`,
        address: formData.address,
        landmark: formData.landmark || "", // Send empty string if not provided
        area: formData.area,
        pincode: formData.pinCode
        // REMOVED: payment_status, city, mobile_number, age, trial_session
        // These fields are not accepted by the /connect-trainer endpoint
      };

      console.log('Submitting data:', JSON.stringify(submitData, null, 2));

      // Submit to API
      const response = await post('/connect-trainer', submitData);

      console.log('Submit response:', response);

      if (response && response.success) {
        alert('Customer booking created successfully!');
        handleReset();
      } else {
        throw new Error(response?.message || 'Failed to create booking');
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      
      // Check for specific API errors
      if (err.response?.data?.message) {
        setError(`API Error: ${err.response.data.message}`);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create booking. Please check the console for details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      userId: '',
      name: '',
      age: '',
      email: '',
      date: '',
      bookingTime: '',
      address: '',
      area: '',
      city: '',
      pinCode: '',
      mobileNumber: '',
      chosenPlan: '',
      payment: '',
      chosenPackage: '',
      trialSession: '',
      timeSlot: '',
      assignedTrainer: '',
      trainerContact: '',
      landmark: '',
      trainingFor: 'self',
      trainingNeededFor: 'self',
      trainerType: 'basic',
      bookingName: ''
    });
    setError('');
    setSearchTerm('');
    fetchUsers();
  };

  const plans: string[] = ['Fitness', 'Yoga', 'Diet'];
  const packages: string[] = ['Monthly', 'Quarterly', 'Yearly', 'Lifetime'];
  const timeSlots: string[] = ['6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'];
  const trainingForOptions: string[] = ['male', 'female', 'couple', 'group'];
  const trainingNeededForOptions: string[] = ['self', 'other'];
  const trainerTypeOptions: string[] = ['basic', 'premium', 'pro'];
  const paymentOptions: string[] = ['Paid', 'Pending', 'Failed', 'Refunded'];
  const trialSessionOptions: string[] = ['Yes', 'No', 'Completed'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 px-4 py-4 md:px-6 md:py-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">Customer Management</h1>
          <p className="text-orange-100 text-sm md:text-base">Manage customer details and assignments</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* User Selection Section */}
          <div className="mb-8 p-4 md:p-6 bg-blue-50 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 md:mb-0">Select Customer</h3>
              <button
                type="button"
                onClick={() => fetchUsers(searchTerm)}
                className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ↻ Refresh Users
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchUsers}
                  placeholder="Search by name, email, or phone..."
                  className="flex-1 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Type to search users from the database</p>
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600 mt-2">Loading users...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                  {users.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        formData.userId === user.id.toString()
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:shadow'
                      }`}
                    >
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="text-sm text-gray-600 truncate">{user.email}</div>
                      <div className="text-sm text-gray-500">Phone: {user.phone}</div>
                      {user.age && (
                        <div className="text-xs text-gray-500">Age: {user.age}</div>
                      )}
                    </button>
                  ))}
                </div>
                {users.length === 0 && !isLoadingUsers && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-2">No users found</p>
                    <p className="text-sm text-gray-400">
                      Try searching with different terms or check if users exist in the system
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Selected User Info */}
          {formData.userId && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Selected Customer</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{formData.name || 'Not available'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{formData.email || 'Not available'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium">{formData.mobileNumber || 'Not available'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">User ID:</span>
                  <p className="font-medium">{formData.userId}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={!!formData.userId}
                  className={`w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    formData.userId ? 'bg-gray-100' : ''
                  }`}
                  placeholder="Select user from above"
                />
                {formData.userId && (
                  <p className="text-sm text-gray-500 mt-1">User selected from database</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="16"
                  max="80"
                  disabled={!!formData.userId}
                  className={`w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    formData.userId ? 'bg-gray-100' : ''
                  }`}
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={!!formData.userId}
                  className={`w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    formData.userId ? 'bg-gray-100' : ''
                  }`}
                  placeholder="Select user from above"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  disabled={!!formData.userId}
                  className={`w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    formData.userId ? 'bg-gray-100' : ''
                  }`}
                  placeholder="Select user from above"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Training For *</label>
                <select
                  name="trainingFor"
                  value={formData.trainingFor}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Option</option>
                  {trainingForOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Training Needed For *</label>
                <select
                  name="trainingNeededFor"
                  value={formData.trainingNeededFor}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Option</option>
                  {trainingNeededForOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Address Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter landmark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter PIN code"
                />
              </div>
            </div>

            {/* Booking & Plan Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Booking & Plan</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking Time *</label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                <select
                  name="chosenPlan"
                  value={formData.chosenPlan}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Service Type</option>
                  {plans.map(plan => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package *</label>
                <select
                  name="chosenPackage"
                  value={formData.chosenPackage}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Package</option>
                  {packages.map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
                <select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Time Slot</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trainer Type *</label>
                <select
                  name="trainerType"
                  value={formData.trainerType}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Trainer Type</option>
                  {trainerTypeOptions.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Name</label>
                <input
                  type="text"
                  name="bookingName"
                  value={formData.bookingName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="e.g., Morning Yoga Session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status *</label>
                <select
                  name="payment"
                  value={formData.payment}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Status</option>
                  {paymentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Note: Payment status is stored separately in the payment system</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trial Session</label>
                <select
                  name="trialSession"
                  value={formData.trialSession}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Option</option>
                  {trialSessionOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">Note: Trial session status is managed separately</p>
              </div>
            </div>
          </div>

          {/* Trainer Assignment Section */}
          <div className="mt-8 p-4 md:p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Trainer Assignment</h3>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <p className="text-gray-600 mt-2">Loading trainers...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Trainer</label>
                    <input
                      type="text"
                      name="assignedTrainer"
                      value={formData.assignedTrainer}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 p-3 bg-gray-100"
                      placeholder="No trainer assigned"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trainer Contact</label>
                    <input
                      type="text"
                      name="trainerContact"
                      value={formData.trainerContact}
                      readOnly
                      className="w-full rounded-lg border border-gray-300 p-3 bg-gray-100"
                      placeholder="Trainer contact will appear here"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign Trainer Manually</label>
                  {trainers.length === 0 ? (
                    <p className="text-gray-500">No trainers available</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {trainers.map(trainer => (
                        <button
                          key={trainer.id}
                          type="button"
                          onClick={() => handleAssignTrainer(trainer)}
                          className={`p-3 rounded-lg border-2 text-center transition-colors ${
                            formData.assignedTrainer === trainer.name 
                              ? 'border-orange-500 bg-orange-50 text-orange-700' 
                              : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                          }`}
                        >
                          <div className="font-medium truncate">{trainer.name}</div>
                          <div className="text-sm text-gray-600 truncate">{trainer.contact}</div>
                          {trainer.email && (
                            <div className="text-xs text-gray-500 truncate">{trainer.email}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !formData.userId}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating Booking...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerManagementForm;
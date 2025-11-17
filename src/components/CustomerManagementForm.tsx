import React, { useState, useEffect } from 'react';

interface Trainer {
  id: number;
  name: string;
  contact: string;
  email?: string;
}

interface CustomerFormData {
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

// Import your API service (adjust the path as needed)
import { get, post } from '../services/apiService';

const CustomerManagementForm: React.FC = () => {
  const [formData, setFormData] = useState<CustomerFormData>({
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<string>(''); // You might want to get this from context or props

  // Fetch trainers from API
  useEffect(() => {
    const fetchTrainers = async (): Promise<void> => {
      setIsLoading(true);
      setError('');
      try {
        const response = await get('/trainer-list', { limit: 10000, offset: 0 });
        
        if (response && response.response && response.response.rows) {
          const trainersData = response.response.rows.map((trainer: any) => ({
            id: trainer.id,
            name: trainer.name || `${trainer.first_name || ''} ${trainer.last_name || ''}`.trim(),
            contact: trainer.phone || trainer.mobile || trainer.contact || 'N/A',
            email: trainer.email
          }));
          setTrainers(trainersData);
        } else {
          setError('Failed to load trainers');
        }
      } catch (err) {
        console.error('Error fetching trainers:', err);
        setError('Failed to load trainers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare data for API according to your Postman structure
      const submitData = {
        user_id: userId || "237", // You need to set this dynamically
        trainer_id: formData.trainerId?.toString() || "",
        service_booking_step: 1,
        service_type: formData.chosenPlan.toLowerCase(), // "fitness", "yoga", "diet"
        preferred_time_to_be_served: formData.bookingTime,
        training_for: formData.trainingFor, // "male", "female", "couple", "group"
        trial_date: formData.date,
        trial_time: formData.timeSlot,
        trainer_type: formData.trainerType, // "basic", "premium", etc.
        training_needed_for: formData.trainingNeededFor, // "self", "other"
        booking_name: formData.bookingName || `${formData.chosenPlan} ${formData.chosenPackage} Session`,
        address: formData.address,
        landmark: formData.landmark,
        area: formData.area,
        pincode: formData.pinCode,
        // Additional customer info that might be needed
        customer_name: formData.name,
        customer_age: formData.age,
        customer_email: formData.email,
        customer_phone: formData.mobileNumber,
        payment_status: formData.payment,
        trial_session: formData.trialSession
      };

      console.log('Submitting data:', submitData);

      // Submit to API
      const response = await post('/admin/connect-trainer', submitData);

      if (response && response.success) {
        alert('Customer booking created successfully!');
        handleReset();
      } else {
        throw new Error(response?.message || 'Failed to create booking');
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
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
  };

  const plans: string[] = ['Fitness', 'Yoga', 'Diet'];
  const packages: string[] = ['Monthly', 'Quarterly', 'Yearly', 'Lifetime'];
  const timeSlots: string[] = ['6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'];
  const trainingForOptions: string[] = ['male', 'female', 'couple', 'group'];
  const trainingNeededForOptions: string[] = ['self', 'other'];
  const trainerTypeOptions: string[] = ['basic', 'premium', 'pro'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Customer Management</h1>
          <p className="text-orange-100">Manage customer details and assignments</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
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
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="16"
                  max="80"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
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
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="email@address.com"
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
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="+91-9876543210"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
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
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                </select>
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
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trainer Assignment Section */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Trainer Assignment</h3>
            
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Loading trainers...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <div className="font-medium">{trainer.name}</div>
                          <div className="text-sm text-gray-600">{trainer.contact}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
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
import React, { useState, useEffect } from 'react';

interface Trainer {
  id: number;
  name: string;
  contact: string;
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
}

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
    trainerContact: ''
  });

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock trainers data - replace with actual API call
  useEffect(() => {
    const fetchTrainers = async (): Promise<void> => {
      // Simulate API call to fetch trainers
      const mockTrainers: Trainer[] = [
        { id: 1, name: 'John Doe', contact: '+91-9876543210' },
        { id: 2, name: 'Jane Smith', contact: '+91-9876543211' },
        { id: 3, name: 'Mike Johnson', contact: '+91-9876543212' },
        { id: 4, name: 'Sarah Wilson', contact: '+91-9876543213' }
      ];
      setTrainers(mockTrainers);
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
      trainerContact: trainer.contact
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsLoading(false);
      alert('Customer data saved successfully!');
    }, 1000);
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
      trainerContact: ''
    });
  };

  const plans: string[] = ['Basic', 'Premium', 'Pro', 'Custom'];
  const packages: string[] = ['Monthly', 'Quarterly', 'Yearly', 'Lifetime'];
  const timeSlots: string[] = ['6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Customer Management</h1>
          <p className="text-orange-100">Manage customer details and assignments</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Chosen Plan *</label>
                <select
                  name="chosenPlan"
                  value={formData.chosenPlan}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Select Plan</option>
                  {plans.map(plan => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chosen Package *</label>
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
            </div>
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
              disabled={isLoading}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Customer Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerManagementForm;
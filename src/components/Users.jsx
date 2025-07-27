import React, { useEffect, useState } from 'react';

import { get } from './../services/apiService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await get('/user-list', {
        search: debouncedSearch,
        limit: itemsPerPage,
        offset,
      });
      setUsers(response.response.rows || []); // Adjust based on API response structure
      setTotalEntries(response.response.count || 0); // Assuming API returns total entries count
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  return (
    <div className='mx-auto rounded-lg bg-white p-6 shadow-lg'>
      <h2 className='mb-4 text-3xl font-bold text-gray-700'>Users</h2>

      {/* Search & Entries Dropdown */}
      <div className='mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='flex items-center'>
          <label className='mr-2 text-gray-600'>Show</label>
          <select
            className='mx-2 rounded-md border focus:ring-2 focus:ring-orange-400'
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            value={itemsPerPage}
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='20'>20</option>
          </select>
          <span className='ml-2 text-gray-600'>entries</span>
        </div>
        <div className='relative'>
          <input
            type='text'
            className='w-64 rounded-md border p-2 pl-8 focus:ring-2 focus:ring-orange-400'
            placeholder='Search...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className='absolute top-2 left-2 text-gray-500'>🔍</span>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        {isLoading ? (
          <p className='text-center text-gray-500'>Loading users...</p>
        ) : error ? (
          <p className='text-center text-red-500'>{error}</p>
        ) : (
          <table className='w-full rounded-lg border border-gray-300 shadow-md'>
            <thead>
              <tr className='bg-orange-500 text-lg text-white'>
                <th className='p-3 text-left'>S.NO</th>
                <th className='p-3 text-left'>NAME</th>
                <th className='p-3 text-left'>AGE</th>
                <th className='p-3 text-left'>MAIL ID</th>
                <th className='p-3 text-left'>DATE</th>
                <th className='p-3 text-left'>TIME</th>
                <th className='p-3 text-left'>ADDRESS</th>
                <th className='p-3 text-left'>AREA/CITY/PIN CODE</th>
                <th className='p-3 text-left'>MOBILE NUMBER</th>
                <th className='p-3 text-left'>CHOSEN PLAN</th>
                <th className='p-3 text-left'>PAYMENT</th>
                <th className='p-3 text-left'>CHOSEN PACKAGE</th>
                <th className='p-3 text-left'>TIME SLOT</th>
                <th className='p-3 text-left'>ASSIGNED TRAINER NAME & CONTACT</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((item, index) => {
                  const payment = item.payments?.[0];
                  const serviceBooking = payment?.service_booking;
                  const trainer = payment?.trainer;
                  return (
                    <tr key={index} className='border-b transition-all hover:bg-gray-100'>
                      <td className='p-3'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className='p-3'>{item.name ?? '-'}</td>
                      <td className='p-3'>-</td>
                      <td className='p-3'>{item.email ?? '-'}</td>
                      <td className='p-3'>{serviceBooking?.trial_date ?? '-'}</td>
                      <td className='p-3'>{serviceBooking?.trial_time ?? '-'}</td>
                      <td className='p-3'>{serviceBooking?.address ?? item.address ?? '-'}</td>
                      <td className='p-3'>
                        {[serviceBooking?.area, serviceBooking?.pincode]
                          .filter(Boolean)
                          .join(' / ') || '-'}
                      </td>
                      <td className='p-3'>{item.mobile ?? '-'}</td>
                      <td className='p-3'>{serviceBooking?.booking_name ?? '-'}</td>
                      <td className='p-3'>{payment?.amount ?? '-'}</td>
                      <td className='p-3'>{payment?.service_type ?? '-'}</td>
                      <td className='p-3'>{serviceBooking?.preferred_time_to_be_served ?? '-'}</td>
                      <td className='p-3'>
                        {trainer
                          ? `${trainer.name ?? '-'}${trainer.phone ? ' / ' + trainer.phone : ''}`
                          : '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={14} className='p-4 text-center text-gray-500'>
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className='mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <span className='text-gray-600'>
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalEntries)} to{' '}
          {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
        </span>
        <div className='flex space-x-2'>
          <button
            className={`rounded-md px-4 py-2 text-white ${
              currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`rounded-md px-4 py-2 ${
                currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={`rounded-md px-4 py-2 text-white ${
              currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;

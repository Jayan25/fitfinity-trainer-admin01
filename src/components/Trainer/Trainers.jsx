import { Eye, Trash } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { del, get } from '../../services/apiService';

const Users = () => {
  const navigate = useNavigate();

  // Use useSearchParams hook to get and set URL parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // States
  const [kycStatusFilter, setKycStatusFilter] = useState(searchParams.get('kyc_status') || '');
  const [blockStatusFilter, setBlockStatusFilter] = useState(
    searchParams.get('block_status') || ''
  );
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(Number(searchParams.get('limit')) || 10);
  const [data, setData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [serviceTypeFilter, setServiceTypeFilter] = useState(
    searchParams.get('service_type') || ''
  );

  // Ref to track whether the search state is updated by user input
  const isUserInput = useRef(false);

  console.log('blockStatusFilter', blockStatusFilter, 'kycStatusFilter', kycStatusFilter);

  // Debounce search input to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      // Only reset page if search is updated by user input
      if (isUserInput.current) {
        setCurrentPage(1);
        isUserInput.current = false; // Reset the flag
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTrainers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await get('/trainer-list', {
        search: debouncedSearch,
        limit: itemsPerPage,
        offset,
        kyc_status: kycStatusFilter,
        block_status: blockStatusFilter,
        service_type: serviceTypeFilter,
      });

      setData(response.response.rows); // Adjust based on API response structure
      setTotalEntries(response.response.count); // Assuming API returns total entries count
    } catch {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Update URL parameters when state changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (kycStatusFilter) {
      newParams.set('kyc_status', kycStatusFilter);
    } else {
      newParams.delete('kyc_status');
    }

    if (blockStatusFilter) {
      newParams.set('block_status', blockStatusFilter);
    } else {
      newParams.delete('block_status');
    }

    if (serviceTypeFilter) {
      newParams.set('service_type', serviceTypeFilter);
    } else {
      newParams.delete('service_type');
    }

    if (search) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }

    newParams.set('page', String(currentPage));
    newParams.set('limit', String(itemsPerPage));

    setSearchParams(newParams);
  }, [
    kycStatusFilter,
    blockStatusFilter,
    serviceTypeFilter,
    debouncedSearch,
    currentPage,
    itemsPerPage,
    setSearchParams,
  ]);

  // Fetch data from API
  useEffect(() => {
    fetchTrainers();
  }, [
    debouncedSearch,
    currentPage,
    itemsPerPage,
    kycStatusFilter,
    blockStatusFilter,
    serviceTypeFilter,
  ]);

  const onView = (item) => {
    navigate(`/trainers/${item.id}`);
  };

  const onDelete = async (item) => {
    if (totalEntries === 1) {
      return;
    }
    try {
      await del(`/delete-trainer/${item.id}`);

      alert('Trainer deleted successfully!');
      fetchTrainers(); // Callback to refresh data
    } catch (error) {
      console.error('Delete error:', error);
      alert(error?.message || 'Error deleting trainer. Please try again.');
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser);
      setShowConfirm(false);
      setSelectedUser(null);
    }
  };

  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  return (
    <div className='mx-auto rounded-lg bg-white p-6 shadow-lg'>
      <h2 className='mb-4 text-3xl font-bold text-gray-700'>Trainers</h2>
      {/* Search & Entries Dropdown */}
      <div className='mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='flex items-center'>
          <label className='mr-2 text-gray-600'>Show</label>
          <select
            className='mx-2 rounded-md border'
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset page when items per page changes
            }}
            value={itemsPerPage}
          >
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='20'>20</option>
          </select>
          <span className='ml-2 text-gray-600'>entries</span>
        </div>
        <div className='flex items-center'>
          <label className='mr-2 text-gray-600'>KYC Status:</label>
          <select
            className='mx-2 rounded-md border'
            value={kycStatusFilter}
            onChange={(e) => {
              setKycStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on new filter
            }}
          >
            <option value=''>All</option>
            <option value='pending'>Pending</option>
            <option value='inprocess'>Inprocess</option>
            <option value='done'>Done</option>
            <option value='failed'>Failed</option>
          </select>
        </div>
        <div className='flex items-center'>
          <label className='mx-2 text-gray-600'>Block Status:</label>
          <select
            className='mx-2 rounded-md border'
            value={blockStatusFilter}
            onChange={(e) => {
              setBlockStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on new filter
            }}
          >
            <option value=''>All</option>
            <option value='Blocked'>Blocked</option>
            <option value='Unblocked'>Unblocked</option>
          </select>
        </div>
        <div className='flex items-center'>
          <label className='mx-2 text-gray-600'>Service Type:</label>
          <select
            className='mx-2 rounded-md border'
            value={serviceTypeFilter}
            onChange={(e) => {
              setServiceTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value=''>All</option>
            <option value='Fitness Trainer'>Fitness Trainer</option>
            <option value='Yoga Trainer'>Yoga Trainer</option>
          </select>
        </div>

        <div className='relative'>
          <input
            type='text'
            className='w-64 rounded-md border p-2 pl-8'
            placeholder='Search...'
            value={search}
            onChange={(e) => {
              isUserInput.current = true; // Set the flag on user input
              setSearch(e.target.value);
            }}
          />
          <span className='absolute top-2 left-2 text-gray-500'>🔍</span>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full rounded-lg border border-gray-300 shadow-md'>
          <thead>
            <tr className='bg-orange-500 text-lg text-white'>
              <th className='p-3 text-left'>S.NO</th>
              <th className='p-3 text-left'>NAME</th>
              <th className='p-3 text-left'>EMAIL</th>
              <th className='p-3 text-left'>MOBILE</th>
              <th className='p-3 text-left'>KYC STATUS</th>
              <th className='p-3 text-left'>BLOCK STATUS</th>
              <th className='p-3 text-left'>PIN</th>
              <th className='p-3 text-left'>ADDRESS</th>
              <th className='p-3 text-left'>SERVICE TYPE</th>
              <th className='p-3 text-left'>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className='p-4 text-center text-gray-500'>
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className='p-4 text-center text-red-500'>
                  {error}
                </td>
              </tr>
            ) : data?.length > 0 ? (
              data?.map((item, index) => (
                <tr key={index} className='border-b transition-all hover:bg-gray-100'>
                  <td className='p-3'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className='p-3'>{item?.name || '-'}</td>
                  <td className='p-3'>{item?.email || '-'}</td>
                  <td className='p-3'>{item?.phone || '-'}</td>
                  <td className='p-3'>{item?.kyc_status || '-'}</td>
                  <td className='p-3'>{item?.block_status || '-'}</td>
                  <td className='p-3'>{item?.pin || '-'}</td>
                  <td className='p-3'>{item?.service_type || '-'}</td>
                  <td className='p-3'>{item?.addhar_address || '-'}</td>
                  <td className='flex justify-center space-x-2 p-3'>
                    <button
                      className='rounded-lg bg-teal-500 p-2 text-white shadow-md hover:bg-teal-600'
                      onClick={() => onView(item)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className='rounded-lg bg-pink-500 p-2 text-white shadow-md hover:bg-pink-600'
                      onClick={() => handleDeleteClick(item)}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className='p-4 text-center text-gray-500'>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <span className='text-gray-600'>
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalEntries)}
          to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries}
          entries
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
      {showConfirm && (
        <div className='bg-opacity-50 fixed inset-0 flex items-center justify-center bg-gray-900'>
          <div className='w-96 rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>Confirm Deletion</h3>
            <p className='text-gray-600'>
              Are you sure you want to delete
              <strong>{selectedUser?.name}</strong>?
            </p>
            <div className='mt-4 flex justify-end space-x-3'>
              <button
                className='rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400'
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className='rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600'
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

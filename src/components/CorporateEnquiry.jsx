import React, { useEffect, useState } from 'react';

import { get } from '../services/apiService';

const CorporateEnquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await get('/corporate-enquiry', {
        search: debouncedSearch !== '' ? debouncedSearch : null,
        limit: itemsPerPage,
        offset,
      });
      setInquiries(response.response.rows || []);
      setTotalEntries(response.response.count || 0);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [debouncedSearch, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  return (
    <div className='mx-auto rounded-lg bg-white p-6 shadow-lg'>
      <h2 className='mb-4 text-3xl font-bold text-gray-700'>Neo Inquiries</h2>
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
      <div className='overflow-x-auto'>
        {isLoading ? (
          <p className='text-center text-gray-500'>Loading inquiries...</p>
        ) : error ? (
          <p className='text-center text-red-500'>{error}</p>
        ) : (
          <table className='w-full rounded-lg border border-gray-300 shadow-md'>
            <thead>
              <tr className='bg-orange-500 text-lg text-white'>
                <th className='p-3 text-left'>S.NO</th>
                <th className='p-3 text-left'>NAME</th>
                <th className='p-3 text-left'>EMAIL</th>
                <th className='p-3 text-left'>MOBILE</th>
                <th className='p-3 text-left'>COMPANY</th>
                <th className='p-3 text-left'>REQUIREMENT</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((item, index) => (
                  <tr key={index} className='border-b transition-all hover:bg-gray-100'>
                    <td className='p-3'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className='p-3'>{item.name}</td>
                    <td className='p-3'>{item.email}</td>
                    <td className='p-3'>{item.phone}</td>
                    <td className='p-3'>{item.company_name}</td>
                    <td className='p-3'>{item.requirement}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className='p-4 text-center text-gray-500'>
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
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

export default CorporateEnquiry;

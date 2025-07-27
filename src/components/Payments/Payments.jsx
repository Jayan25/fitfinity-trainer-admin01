import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { get } from '../../services/apiService';
import DietTable from './DietTable';
import FitnessTable from './FitnessTable';
import YogaTable from './YogaTable';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('fitness');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const apiEndpoints = {
    fitness: '/fitness-payment',
    yoga: '/yoga-payment',
    diet: '/diet-payment',
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (filterType !== 'custom') {
      let start, end;
      switch (filterType) {
        case 'today':
          start = dayjs().startOf('day');
          end = dayjs().endOf('day');
          break;
        case 'weekly':
          start = dayjs().startOf('week');
          end = dayjs().endOf('week');
          break;
        case 'monthly':
          start = dayjs().startOf('month');
          end = dayjs().endOf('month');
          break;
        case 'yearly':
          start = dayjs().startOf('year');
          end = dayjs().endOf('year');
          break;
        default:
          start = '';
          end = '';
      }
      setStartDate(start.format('YYYY-MM-DD'));
      setEndDate(end.format('YYYY-MM-DD'));
    }
  }, [filterType]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        let url = `${apiEndpoints[activeTab]}?limit=${itemsPerPage}&offset=${offset}&search=${debouncedSearch}`;
        if (filterType) {
          url += `&filterType=${filterType}`;
        }
        if (filterType === 'custom' && startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        } else if (filterType !== 'custom' && startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        const response = await get(url);
        setData(response.response.rows || []);
        setTotalEntries(response.response.count || 0);
      } catch {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab, debouncedSearch, currentPage, itemsPerPage, filterType, startDate, endDate]);

  const totalPages = Math.ceil(totalEntries / itemsPerPage);

  return (
    <div className='mx-w-full mx-auto rounded-lg bg-white p-6 shadow-lg'>
      <h2 className='mb-4 text-3xl font-bold text-gray-700'>Payments</h2>

      <div className='mb-4 flex space-x-4'>
        {['fitness', 'yoga', 'diet'].map((tab) => (
          <button
            key={tab}
            className={`rounded-md px-4 py-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Payment
          </button>
        ))}
      </div>

      {/* Search & Entries Dropdown */}
      <div className='mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='flex items-center gap-4'>
          <label className='mr-2 text-gray-600'>Filter by:</label>
          <select
            className='rounded-md border focus:ring-2 focus:ring-orange-400'
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value='today'>Today</option>
            <option value='weekly'>This Week</option>
            <option value='monthly'>This Month</option>
            <option value='yearly'>This Year</option>
            <option value='custom'>Custom</option>
          </select>
          {filterType === 'custom' && (
            <>
              <input
                type='date'
                className='ml-2 rounded-md border p-1 focus:ring-2 focus:ring-orange-400'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className='mx-1 text-gray-600'>to</span>
              <input
                type='date'
                className='rounded-md border p-1 focus:ring-2 focus:ring-orange-400'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}
        </div>
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
          <p className='text-center text-gray-500'>Loading payments...</p>
        ) : error ? (
          <p className='text-center text-red-500'>{error}</p>
        ) : activeTab === 'fitness' ? (
          <FitnessTable data={data} currentPage={currentPage} itemsPerPage={itemsPerPage} />
        ) : activeTab === 'yoga' ? (
          <YogaTable data={data} currentPage={currentPage} itemsPerPage={itemsPerPage} />
        ) : (
          <DietTable data={data} currentPage={currentPage} itemsPerPage={itemsPerPage} />
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

export default Payments;

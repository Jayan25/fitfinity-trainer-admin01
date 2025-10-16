import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { get } from '../services/apiService';

const periodOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'weekly' },
  { label: 'This Month', value: 'monthly' },
  { label: 'This Year', value: 'yearly' },
  { label: 'Custom', value: 'custom' },
];

const Dashboard = () => {
  const [period, setPeriod] = useState('today');
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [isLoading, setIsLoading] = useState(false);
  const [revenue, setRevenue] = useState({
    total: 0,
    fitness: 0,
    yoga: 0,
    diet: 0,
  });
  const [bookingCounts, setBookingCounts] = useState({ fitness_success: 0,fitness_failed: 0, yoga_success: 0, yoga_failed: 0, diet_success: 0, diet_failed: 0 });
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({ active: 0, inactive: 0 });
  const [trainerStats, setTrainerStats] = useState({ active: 0, inactive: 0 });

  useEffect(() => {
    const fetchUserAndTrainerStats = async () => {
      try {
        const [userRes, trainerRes] = await Promise.all([
          get('/user-list', { limit: 10000, offset: 0 }),
          get('/trainer-list', { limit: 10000, offset: 0 }),
        ]);
        const users = userRes.response.rows || [];
        const trainers = trainerRes.response.rows || [];
        const activeUsers = users.filter((u) => u.status === 1).length;
        const inactiveUsers = users.length - activeUsers;
        const activeTrainers = trainers.filter((t) => t.block_status === 'Unblocked').length;
        const inactiveTrainers = trainers.length - activeTrainers;
        setUserStats({ active: activeUsers, inactive: inactiveUsers });
        setTrainerStats({ active: activeTrainers, inactive: inactiveTrainers });
      } catch {
        setUserStats({ active: 0, inactive: 0 });
        setTrainerStats({ active: 0, inactive: 0 });
      }
    };
    fetchUserAndTrainerStats();
  }, []);

  useEffect(() => {
    if (period !== 'custom') {
      let start, end;
      switch (period) {
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
          start = dayjs();
          end = dayjs();
      }
      setStartDate(start.format('YYYY-MM-DD'));
      setEndDate(end.format('YYYY-MM-DD'));
    }
  }, [period]);

  useEffect(() => {
    const fetchRevenueAndBookings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fitnessRes, yogaRes, dietRes] = await Promise.all([
          get(
            `/fitness-payment?filterType=${period}&startDate=${startDate}&endDate=${endDate}&limit=10000&offset=0`
          ),
          get(
            `/yoga-payment?filterType=${period}&startDate=${startDate}&endDate=${endDate}&limit=10000&offset=0`
          ),
          get(
            `/diet-payment?filterType=${period}&startDate=${startDate}&endDate=${endDate}&limit=10000&offset=0`
          ),
        ]);

        const fitnessSuccessCount = fitnessRes.response.rows.filter(
          (row) => row.status === 'success'
        ).length;
        const fitnessFailedCount = fitnessRes.response.rows.filter(
          (row) => row.status !== 'success'
        ).length;

        const yogaSuccessCount = yogaRes.response.rows.filter(
          (row) => row.status === 'success'
        ).length;
        const yogaFailedCount = yogaRes.response.rows.filter(
          (row) => row.status !== 'success'
        ).length;

        const dietSuccessCount = dietRes.response.rows.filter(
          (row) => row.payments[0]?.status === 'success'
        ).length;
        const dietFailedCount = dietRes.response.rows.filter(
          (row) => row.payments[0]?.status !== 'success'
        ).length;

        const fitnessRows = fitnessRes.response.rows || [];
        const yogaRows = yogaRes.response.rows || [];
        const dietRows = dietRes.response.rows || [];
        const fitness = fitnessRows.reduce(
          (sum, p) => sum + (p?.status == 'success' ? Number(p.amount) || 0 : 0),
          0
        );
        const yoga = yogaRows.reduce(
          (sum, p) => sum + (p?.status == 'success' ? Number(p.amount) || 0 : 0),
          0
        );
        const diet = dietRows.reduce(
          (sum, p) => sum + (p.payments[0]?.status == 'success' ? Number(p.payments[0].amount) || 0 : 0),
          0
        );
        setRevenue({
          total: fitness + yoga + diet,
          fitness,
          yoga,
          diet,
        });
        setBookingCounts({
          fitness_success: fitnessSuccessCount,
          fitness_failed: fitnessFailedCount,
          yoga_success: yogaSuccessCount,
          yoga_failed: yogaFailedCount,
          diet_success: dietSuccessCount,
          diet_failed: dietFailedCount,
        });
      } catch (err) {
        setError('Failed to load revenue or booking data', err);
        console.error('Error fetching revenue or bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRevenueAndBookings();
  }, [period, startDate, endDate]);

  return (
    <div className='flex-1 p-8'>
      <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Active Users</span>
          <div className='mt-2 text-3xl font-bold text-green-600'>{userStats.active}</div>
        </div>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Inactive Users</span>
          <div className='mt-2 text-3xl font-bold text-red-500'>{userStats.inactive}</div>
        </div>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Active Trainers</span>
          <div className='mt-2 text-3xl font-bold text-green-600'>{trainerStats.active}</div>
        </div>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Inactive Trainers</span>
          <div className='mt-2 text-3xl font-bold text-red-500'>{trainerStats.inactive}</div>
        </div>
      </div>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8'>
        <div>
          <label className='mb-1 block font-semibold text-gray-700'>Period</label>
          <select
            className='w-64 rounded-md border p-2 pl-8'
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {period === 'custom' && (
          <div className='flex items-end gap-2'>
            <div>
              <label className='mb-1 block font-semibold text-gray-700'>Start Date</label>
              <input
                type='date'
                className='w-64 rounded-md border p-2 pl-8'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className='mb-1 block font-semibold text-gray-700'>End Date</label>
              <input
                type='date'
                className='w-64 rounded-md border p-2 pl-8'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      {error && <div className='mb-4 text-red-500'>{error}</div>}
      <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Fitness Bookings</span>
          <div className='mt-2 text-3xl font-bold text-blue-400'>
            SucessFul Bookings: {bookingCounts.fitness_success}
          </div>
          <div className='mt-2 text-3xl font-bold text-red-400'>
            Failed Bookings: {bookingCounts.fitness_failed}
          </div>
        </div>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Yoga Bookings</span>
          <div className='mt-2 text-3xl font-bold text-blue-400'>
            SucessFul Bookings: {bookingCounts.yoga_success}
          </div>
          <div className='mt-2 text-3xl font-bold text-red-400'>
            Failed Bookings:{bookingCounts.yoga_failed}
          </div>
        </div>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Diet Bookings</span>
          <div className='mt-2 text-3xl font-bold text-blue-400'>
            SucessFul Bookings: {bookingCounts.diet_success}
          </div>
          <div className='mt-2 text-3xl font-bold text-red-400'>
            Failed Bookings: {bookingCounts.diet_failed}
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Total Revenue</span>
          <div className='mt-2 text-3xl font-bold text-gray-600'>
            ₹{revenue.total.toLocaleString()}
          </div>
        </div>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Personal Trainer Revenue</span>
          <div className='mt-2 text-3xl font-bold text-gray-600'>
            ₹{revenue.fitness.toLocaleString()}
          </div>
        </div>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Yoga Trainer Revenue</span>
          <div className='mt-2 text-3xl font-bold text-gray-600'>
            ₹{revenue.yoga.toLocaleString()}
          </div>
        </div>
        <div className='flex flex-col items-start rounded-lg bg-white p-6 shadow-md'>
          <span className='text-lg font-semibold text-gray-700'>Diet Plan Revenue</span>
          <div className='mt-2 text-3xl font-bold text-gray-600'>
            ₹{revenue.diet.toLocaleString()}
          </div>
        </div>
      </div>
      {isLoading && <div className='mt-6 text-center text-gray-500'>Loading revenue data...</div>}
    </div>
  );
};

export default Dashboard;

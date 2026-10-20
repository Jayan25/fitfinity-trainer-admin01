import React, { useEffect, useState } from 'react';
import { get } from '../../services/apiService';
import {
  CreditCard,
  Search,
  RefreshCw,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  User,
} from 'lucide-react';

const ClassSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await get('/class-subscriptions');
      if (response && response.response && response.response.subscriptions) {
        setSubscriptions(response.response.subscriptions);
      } else {
        setSubscriptions([]);
      }
    } catch (err) {
      console.error('Failed to load class subscriptions:', err);
      setError('Failed to load class subscription history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    // Status filter
    if (statusFilter !== 'all' && sub.payment_status !== statusFilter) {
      return false;
    }

    // Search query
    if (!search.trim()) return true;
    const q = search.toLowerCase();

    const userName = (sub.user?.name || '').toLowerCase();
    const userEmail = (sub.user?.email || '').toLowerCase();
    const userMobile = (sub.user?.mobile || '').toLowerCase();
    const services = (sub.service_names || '').toLowerCase();
    const orderId = (sub.order_id || '').toLowerCase();
    const paymentId = (sub.payment_id || '').toLowerCase();

    return (
      userName.includes(q) ||
      userEmail.includes(q) ||
      userMobile.includes(q) ||
      services.includes(q) ||
      orderId.includes(q) ||
      paymentId.includes(q)
    );
  });

  // Calculate stats
  const totalRevenue = subscriptions
    .filter((s) => s.payment_status === 'success')
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);

  const successfulCount = subscriptions.filter(
    (s) => s.payment_status === 'success'
  ).length;

  const pendingCount = subscriptions.filter(
    (s) => s.payment_status === 'pending'
  ).length;

  return (
    <div className='mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-md'>
      {/* Header */}
      <div className='mb-6 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-bold text-gray-800'>
            <CreditCard className='h-6 w-6 text-blue-600' />
            Online Classes Payment & Subscription History
          </h1>
          <p className='text-sm text-gray-500'>
            Real-time purchase details, subscriber contact information, and membership status.
          </p>
        </div>

        <button
          onClick={fetchSubscriptions}
          disabled={isLoading}
          className='flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200'
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='rounded-xl border border-blue-100 bg-blue-50/50 p-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-blue-800'>Total Revenue (Classes)</span>
            <span className='rounded-full bg-blue-200/60 p-2 text-blue-700 font-bold'>₹</span>
          </div>
          <div className='mt-2 text-2xl font-extrabold text-blue-950'>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>

        <div className='rounded-xl border border-green-100 bg-green-50/50 p-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-green-800'>Active Subscriptions</span>
            <CheckCircle className='h-5 w-5 text-green-600' />
          </div>
          <div className='mt-2 text-2xl font-extrabold text-green-950'>
            {successfulCount}
          </div>
        </div>

        <div className='rounded-xl border border-amber-100 bg-amber-50/50 p-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-amber-800'>Pending Orders</span>
            <Clock className='h-5 w-5 text-amber-600' />
          </div>
          <div className='mt-2 text-2xl font-extrabold text-amber-950'>
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        {/* Search */}
        <div className='relative w-full sm:w-80'>
          <Search className='absolute top-2.5 left-3 h-4 w-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search by user, email, phone, order ID...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
          />
        </div>

        {/* Status Filter */}
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
            Status:
          </span>
          {['all', 'success', 'pending', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className='mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200'>
          {error}
        </div>
      )}

      {/* Subscriptions Table */}
      <div className='overflow-x-auto rounded-xl border border-gray-200 shadow-sm'>
        <table className='w-full text-left text-sm text-gray-600'>
          <thead className='bg-gray-50 text-xs font-bold uppercase text-gray-700 border-b'>
            <tr>
              <th className='px-4 py-3'>Subscriber Details</th>
              <th className='px-4 py-3'>Services Enrolled</th>
              <th className='px-4 py-3'>Duration</th>
              <th className='px-4 py-3'>Amount</th>
              <th className='px-4 py-3'>Status</th>
              <th className='px-4 py-3'>Validity Period</th>
              <th className='px-4 py-3'>Razorpay Details</th>
              <th className='px-4 py-3'>Purchased On</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {isLoading && subscriptions.length === 0 ? (
              <tr>
                <td colSpan={8} className='py-8 text-center text-gray-400'>
                  <RefreshCw className='mx-auto mb-2 h-6 w-6 animate-spin' />
                  Loading payment history...
                </td>
              </tr>
            ) : filteredSubscriptions.length === 0 ? (
              <tr>
                <td colSpan={8} className='py-8 text-center text-gray-400'>
                  No online class subscriptions found.
                </td>
              </tr>
            ) : (
              filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className='transition hover:bg-gray-50/80'>
                  {/* User details */}
                  <td className='px-4 py-3.5'>
                    <div className='font-bold text-gray-900 flex items-center gap-1.5'>
                      <User className='h-3.5 w-3.5 text-gray-400' />
                      {sub.user?.name || 'User #' + sub.user_id}
                    </div>
                    {sub.user?.email && (
                      <div className='text-xs text-gray-500 flex items-center gap-1 mt-0.5'>
                        <Mail className='h-3 w-3 text-gray-400' />
                        {sub.user.email}
                      </div>
                    )}
                    {sub.user?.mobile && (
                      <div className='text-xs text-gray-500 flex items-center gap-1 mt-0.5'>
                        <Phone className='h-3 w-3 text-gray-400' />
                        {sub.user.mobile}
                      </div>
                    )}
                  </td>

                  {/* Services */}
                  <td className='px-4 py-3.5'>
                    <div className='flex flex-wrap gap-1'>
                      {(sub.service_names || '')
                        .split(',')
                        .map((name, i) => (
                          <span
                            key={i}
                            className='rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200'
                          >
                            {name.trim()}
                          </span>
                        ))}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className='px-4 py-3.5 font-semibold text-gray-800'>
                    {sub.duration_months} Months
                  </td>

                  {/* Amount */}
                  <td className='px-4 py-3.5 font-bold text-gray-900'>
                    ₹{Number(sub.amount).toLocaleString('en-IN')}
                  </td>

                  {/* Status */}
                  <td className='px-4 py-3.5'>
                    {sub.payment_status === 'success' ? (
                      <span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800'>
                        <CheckCircle className='h-3.5 w-3.5' />
                        Success
                      </span>
                    ) : sub.payment_status === 'pending' ? (
                      <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800'>
                        <Clock className='h-3.5 w-3.5' />
                        Pending
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800'>
                        <AlertCircle className='h-3.5 w-3.5' />
                        Failed
                      </span>
                    )}
                  </td>

                  {/* Validity Period */}
                  <td className='px-4 py-3.5 text-xs text-gray-600'>
                    {sub.start_date && sub.expiry_date ? (
                      <div>
                        <div>From: <strong className='text-gray-800'>{formatDate(sub.start_date)}</strong></div>
                        <div>Till: <strong className='text-gray-800'>{formatDate(sub.expiry_date)}</strong></div>
                      </div>
                    ) : (
                      <span className='text-gray-400'>Awaiting activation</span>
                    )}
                  </td>

                  {/* Order & Payment ID */}
                  <td className='px-4 py-3.5 text-xs'>
                    <div className='font-mono text-gray-700' title='Order ID'>
                      Ord: {sub.order_id}
                    </div>
                    {sub.payment_id && (
                      <div className='font-mono text-gray-500 mt-0.5' title='Payment ID'>
                        Pay: {sub.payment_id}
                      </div>
                    )}
                  </td>

                  {/* Created At */}
                  <td className='px-4 py-3.5 text-xs text-gray-500'>
                    {formatDate(sub.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSubscriptions;

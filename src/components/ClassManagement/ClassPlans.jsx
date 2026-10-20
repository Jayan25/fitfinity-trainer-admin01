import React, { useEffect, useState } from 'react';
import { get, put } from '../../services/apiService';
import { Edit3, CheckCircle, XCircle, RefreshCw, Sparkles, Tag, DollarSign } from 'lucide-react';

const ClassPlans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Edit modal state
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await get('/class-plans');
      if (response && response.response && response.response.plans) {
        setPlans(response.response.plans);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error('Failed to load class plans:', err);
      setError('Failed to load class plans from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEditClick = (plan) => {
    setEditingPlan({ ...plan });
    setSuccessMsg('');
    setError(null);
  };

  const handleModalClose = () => {
    setEditingPlan(null);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    setIsSaving(true);
    setError(null);
    setSuccessMsg('');

    try {
      const sixMonthPrice = Number(editingPlan.six_month_price);
      const yearlyPrice = Number(editingPlan.yearly_price);
      const monthly6M =
        editingPlan.monthly_rate_6m !== "" && editingPlan.monthly_rate_6m !== undefined
          ? Number(editingPlan.monthly_rate_6m)
          : Math.round(sixMonthPrice / (6 * 1.18));
      const monthly12M =
        editingPlan.monthly_rate_12m !== "" && editingPlan.monthly_rate_12m !== undefined
          ? Number(editingPlan.monthly_rate_12m)
          : Math.round(yearlyPrice / (12 * 1.18));

      const payload = {
        name: editingPlan.name,
        six_month_price: sixMonthPrice,
        monthly_rate_6m: monthly6M,
        yearly_price: yearlyPrice,
        monthly_rate_12m: monthly12M,
        is_active: Boolean(editingPlan.is_active),
      };

      const response = await put(`/class-plans/${editingPlan.id}`, payload);
      setSuccessMsg(`Successfully updated pricing for ${editingPlan.name}!`);
      setEditingPlan(null);
      // Refresh list
      fetchPlans();
    } catch (err) {
      console.error('Failed to update class plan:', err);
      setError('Failed to update class plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-md'>
      {/* Header */}
      <div className='mb-6 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-bold text-gray-800'>
            <Sparkles className='h-6 w-6 text-yellow-500' />
            Online Classes (Plans & Pricing Management)
          </h1>
          <p className='text-sm text-gray-500'>
            Manage Zumba, Yoga, HIIT, and Dance subscription pricing for monthly and yearly plans.
          </p>
        </div>

        <button
          onClick={fetchPlans}
          disabled={isLoading}
          className='flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200'
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className='mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-200'>
          <CheckCircle className='h-5 w-5 text-green-500' />
          {successMsg}
        </div>
      )}

      {error && (
        <div className='mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200'>
          <XCircle className='h-5 w-5 text-red-500' />
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && plans.length === 0 ? (
        <div className='py-12 text-center text-gray-500'>
          <RefreshCw className='mx-auto mb-2 h-8 w-8 animate-spin text-gray-400' />
          Loading class plans from database...
        </div>
      ) : (
        /* Cards Grid */
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className='flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md'
            >
              <div>
                {/* Card Title & Code */}
                <div className='mb-3 flex items-start justify-between'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800'>{plan.name}</h3>
                    <span className='inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                      {plan.service_code}
                    </span>
                  </div>

                  {plan.is_active ? (
                    <span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>
                      Active
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600'>
                      Inactive
                    </span>
                  )}
                </div>

                {/* 6 Months Plan Box */}
                <div className='mb-3 rounded-lg bg-amber-50/60 border border-amber-200/60 p-3'>
                  <div className='flex items-center justify-between text-xs font-semibold text-amber-900'>
                    <span>6 Months Plan</span>
                    <span className='text-amber-700'>
                      ≈ ₹{Math.round(plan.six_month_price / (6 * 1.18)) || plan.monthly_rate_6m}/mo
                    </span>
                  </div>
                  <div className='mt-1 text-2xl font-black text-amber-950'>
                    ₹{plan.six_month_price}
                    <span className='ml-1 text-xs font-normal text-amber-800'>incl. GST</span>
                  </div>
                </div>

                {/* 12 Months Plan Box */}
                <div className='mb-4 rounded-lg bg-blue-50/60 border border-blue-200/60 p-3'>
                  <div className='flex items-center justify-between text-xs font-semibold text-blue-900'>
                    <span className='flex items-center gap-1'>
                      12 Months (Best Value) ⭐
                    </span>
                    <span className='text-blue-700'>
                      ≈ ₹{Math.round(plan.yearly_price / (12 * 1.18)) || plan.monthly_rate_12m}/mo
                    </span>
                  </div>
                  <div className='mt-1 text-2xl font-black text-blue-950'>
                    ₹{plan.yearly_price}
                    <span className='ml-1 text-xs font-normal text-blue-800'>incl. GST</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleEditClick(plan)}
                className='flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-95'
              >
                <Edit3 className='h-4 w-4' />
                Edit Plan & Pricing
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingPlan && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95'>
            <div className='mb-4 flex items-center justify-between border-b pb-3'>
              <h2 className='text-xl font-bold text-gray-800'>
                Edit Pricing: {editingPlan.name}
              </h2>
              <button
                onClick={handleModalClose}
                className='rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className='space-y-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                  Service Name
                </label>
                <input
                  type='text'
                  value={editingPlan.name}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, name: e.target.value })
                  }
                  required
                  className='mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                />
              </div>

              {/* 6 Months Group */}
              <div className='rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3'>
                <h4 className='text-sm font-bold text-amber-900'>6 Months Plan Settings</h4>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs font-semibold text-gray-700'>
                      Total Price (₹ incl. GST)
                    </label>
                    <input
                      type='number'
                      min='1'
                      value={editingPlan.six_month_price}
                      onChange={(e) => {
                        const val = e.target.value;
                        const autoMonthly = val ? Math.round(Number(val) / (6 * 1.18)) : '';
                        setEditingPlan({
                          ...editingPlan,
                          six_month_price: val,
                          monthly_rate_6m: autoMonthly,
                        });
                      }}
                      required
                      className='mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm font-semibold'
                    />
                  </div>
                  <div>
                    <div className='flex items-center justify-between'>
                      <label className='block text-xs font-semibold text-gray-700'>
                        Monthly Rate (₹/mo)
                      </label>
                      <span className='text-[10px] font-medium text-amber-700'>Auto</span>
                    </div>
                    <input
                      type='number'
                      min='1'
                      value={editingPlan.monthly_rate_6m}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          monthly_rate_6m: e.target.value,
                        })
                      }
                      required
                      className='mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm font-semibold'
                    />
                  </div>
                </div>
              </div>

              {/* 12 Months Group */}
              <div className='rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3'>
                <h4 className='text-sm font-bold text-blue-900'>12 Months (Yearly) Plan Settings</h4>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs font-semibold text-gray-700'>
                      Total Price (₹ incl. GST)
                    </label>
                    <input
                      type='number'
                      min='1'
                      value={editingPlan.yearly_price}
                      onChange={(e) => {
                        const val = e.target.value;
                        const autoMonthly = val ? Math.round(Number(val) / (12 * 1.18)) : '';
                        setEditingPlan({
                          ...editingPlan,
                          yearly_price: val,
                          monthly_rate_12m: autoMonthly,
                        });
                      }}
                      required
                      className='mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm font-semibold'
                    />
                  </div>
                  <div>
                    <div className='flex items-center justify-between'>
                      <label className='block text-xs font-semibold text-gray-700'>
                        Monthly Rate (₹/mo)
                      </label>
                      <span className='text-[10px] font-medium text-blue-700'>Auto</span>
                    </div>
                    <input
                      type='number'
                      min='1'
                      value={editingPlan.monthly_rate_12m}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          monthly_rate_12m: e.target.value,
                        })
                      }
                      required
                      className='mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm font-semibold'
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className='flex items-center gap-3 pt-1'>
                <input
                  type='checkbox'
                  id='is_active'
                  checked={editingPlan.is_active}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      is_active: e.target.checked,
                    })
                  }
                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <label htmlFor='is_active' className='text-sm font-medium text-gray-700'>
                  Service is active and available for booking
                </label>
              </div>

              {/* Buttons */}
              <div className='flex justify-end gap-3 border-t pt-4'>
                <button
                  type='button'
                  onClick={handleModalClose}
                  className='rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSaving}
                  className='rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700 disabled:opacity-50'
                >
                  {isSaving ? 'Saving Changes...' : 'Save & Update Pricing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPlans;

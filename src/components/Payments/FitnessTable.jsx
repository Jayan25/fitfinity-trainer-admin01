import React from 'react';

const FitnessTable = ({ data, currentPage, itemsPerPage }) => {
  return (
    <table className='w-full rounded-lg border border-gray-300 shadow-md'>
      <thead>
        <tr className='bg-orange-500 text-lg text-white'>
          <th className='p-3 text-left'>#</th>
          <th className='p-3 text-left'>Booking Name</th>
          <th className='p-3 text-left'>Amount</th>
          <th className='p-3 text-left'>Status</th>
          <th className='p-3 text-left'>Preferred Time</th>
          <th className='p-3 text-left'>Traial Date/Time</th>
          <th className='p-3 text-left'>Trainee Type</th>
          <th className='p-3 text-left'>Trainer Need For</th>
          <th className='p-3 text-left'>Training For</th>
          <th className='p-3 text-left'>Id/Order Id</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan='5' className='p-4 text-center'>
              No data available
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr key={item?.id} className='border'>
              <td className='p-3 text-left'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td className='p-3 text-left'>{item?.service_booking?.booking_name || 'N/A'}</td>
              <td className='p-3 text-left'>{item?.amount}</td>
              <td className='p-3 text-left'>{item?.status}</td>
              <td className='p-3 text-left'>
                {item?.service_booking?.preferred_time_to_be_served || 'N/A'}
              </td>
              <td className='p-3 text-left'>
                {item?.service_booking?.trial_date || 'N/A'}/
                {item?.service_booking?.trial_time || 'N/A'}
              </td>
              <td className='p-3 text-left'>{item?.service_booking?.trainer_type || 'N/A'}</td>
              <td className='p-3 text-left'>
                {item?.service_booking?.training_needed_for || 'N/A'}
              </td>
              <td className='p-3 text-left'>{item?.service_booking?.training_for || 'N/A'}</td>
              <td className='p-3 text-left'>
                {item?.id || 'N/A'}/{item?.order_id || 'N/A'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default FitnessTable;

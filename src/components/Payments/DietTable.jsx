import React from 'react';

const DietTable = ({ data, currentPage, itemsPerPage }) => {
  return (
    <table className='w-full max-w-min rounded-lg border border-gray-300 shadow-md'>
      <thead>
        <tr className='bg-orange-500 text-lg text-white'>
          <th className='p-3 text-left'>#</th>
          <th className='p-3 text-left'>Type</th>
          <th className='p-3 text-left'>Price</th>
          <th className='p-3 text-left'>Plan For</th>
          <th className='p-3 text-left'>Gender</th>
          <th className='p-3 text-left'>Name</th>
          <th className='p-3 text-left'>Number</th>
          <th className='p-3 text-left'>Age</th>
          <th className='p-3 text-left'>Height</th>
          <th className='p-3 text-left'>Weight</th>
          <th className='p-3 text-left'>Goal</th>
          <th className='p-3 text-left'>Diet Type</th>
          <th className='p-3 text-left'>Daily Physical Activity</th>
          <th className='p-3 text-left'>Allergy</th>
          <th className='p-3 text-left'>Plan Type</th>
          <th className='p-3 text-left'>User Name</th>
          <th className='p-3 text-left'>User Email</th>
          <th className='p-3 text-left'>User Mobile</th>
          <th className='p-3 text-left'>User Address</th>
          <th className='p-3 text-left'>Created At</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <tr key={item.id} className='border border-gray-300'>
              <td className='p-3 text-left'>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td className='p-3 text-left'>{item.type}</td>
              <td className='p-3 text-left'>{item.price}</td>
              <td className='p-3 text-left'>{item.plan_for}</td>
              <td className='p-3 text-left'>{item.gender}</td>
              <td className='p-3 text-left'>{item.name}</td>
              <td className='p-3 text-left'>{item.number}</td>
              <td className='p-3 text-left'>{item.age}</td>
              <td className='p-3 text-left'>{item.height}</td>
              <td className='p-3 text-left'>{item.weight}</td>
              <td className='p-3 text-left'>{item.goal}</td>
              <td className='p-3 text-left'>{item.diet_type}</td>
              <td className='p-3 text-left'>{item.daily_physical_activity}</td>
              <td className='p-3 text-left'>{item.allergy}</td>
              <td className='p-3 text-left'>{item.plan_type}</td>
              <td className='p-3 text-left'>{item.user?.name || 'N/A'}</td>
              <td className='p-3 text-left'>{item.user?.email || 'N/A'}</td>
              <td className='p-3 text-left'>{item.user?.mobile || 'N/A'}</td>
              <td className='p-3 text-left'>{item.user?.address || 'N/A'}</td>
              <td className='p-3 text-left'>{new Date(item.created_at).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan='19' className='py-4 text-center'>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DietTable;

import { useState, useEffect } from 'react';
import { patch, get } from '../../services/apiService';

import { Link, useParams } from 'react-router-dom';
import { User } from 'lucide-react';

export default function TrainerProfile({ trainerId = 34 }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await get(`/trainer-detail/${params.id}`); // Ensure the correct endpoint
        setTrainer(response?.response);
      } catch (err) {
        setError('Failed to load trainer details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) fetchTrainerDetails();
  }, [params?.id]);

  const updateKYCStatus = async (status) => {
    setLoading(true);
    try {
      const response = await patch(`/verify-kyc-step-trainer/${trainer.id}`, {
        kyc_status: status,
      });
      if (response?.success) {
        setTrainer((prev) => ({ ...prev, kyc_status: status }));
      } else {
        alert('Failed to update KYC status');
      }
    } catch (error) {
      console.error('Error updating KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTrainerStatus = async (status) => {
    try {
      const response = await patch(`/block-trainer/${trainer.id}`, { status: status });
      if (response?.success) {
        setTrainer((prev) => ({ ...prev, block_status: status }));
      } else {
        alert('Failed to update Block status');
      }
    } catch (error) {
      console.error('Error updating Block status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='p-8 text-center'>Loading...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>{error}</div>;

  const handleGoBack = () => window.history.back();


  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      {/* Profile Header */}
      <nav className='mb-6 flex items-center space-x-2 rounded-lg bg-white px-4 py-3 text-base text-gray-700 shadow-md'>
        <span onClick={handleGoBack} className='font-medium text-blue-600 hover:underline cursor-pointer'>
          Trainers
        </span>
        <span className='text-gray-400'>›</span>
        <span className='font-semibold text-gray-900'>{trainer?.name}</span>
      </nav>
      <div className='relative rounded-xl bg-blue-200 p-8 shadow-lg'>
        <div className='absolute top-4 right-4'>
          {trainer?.block_status === 'Unblocked' && (
            <>
              <button
                className='rounded-md bg-red-500 px-5 py-2 text-sm text-white shadow-md transition hover:bg-red-600'
                onClick={() => updateTrainerStatus('Blocked')}
              >
                Block
              </button>
            </>
          )}
          {trainer?.block_status !== 'Unblocked' && (
            <>
              <button
                className='rounded-md bg-green-500 px-5 py-2 text-sm text-white shadow-md transition hover:bg-green-600'
                onClick={() => updateTrainerStatus('Unblocked')}
              >
                Unblock
              </button>
            </>
          )}
        </div>
        <div className='flex items-center space-x-6'>
          {trainer?.profilePicture ? (
            <>
              <img
                src={trainer?.profilePicture || 'https://via.placeholder.com/100x100'}
                alt='Trainer'
                className='h-24 w-24 rounded-full border-4 border-white shadow-md'
              />
            </>
          ) : (
            <User size={80} />
          )}

          <div>
            <h2 className='text-2xl font-semibold text-gray-800'>
              {trainer?.name} &nbsp; ({trainer?.block_status})
            </h2>
            <p className='text-sm text-gray-600'>{trainer?.email}</p>
            <span
              className={`mt-2 inline-block rounded-md px-3 py-1 text-sm shadow-sm ${
                trainer?.kyc_status === 'done'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-400 text-white'
              }`}
            >
              {trainer?.kyc_status === 'done' ? 'KYC Completed' : 'KYC Pending'}
            </span>
            {trainer.kyc_status !== 'done' && (
              <>
                <button
                  onClick={() => updateKYCStatus('done')}
                  className='rounded-md bg-green-500 px-3 py-1 text-sm text-white'
                >
                  Accept
                </button>
                <button
                  onClick={() => updateKYCStatus('failed')}
                  className='rounded-md bg-red-500 px-3 py-1 text-sm text-white'
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='mt-8 flex space-x-6 border-b-2 pb-2'>
        {['basic', 'service', 'banking', 'documents'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'border-b-4 border-blue-600 font-semibold text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'basic' && 'Basic Info'}
            {tab === 'service' && 'Service Details'}
            {tab === 'banking' && 'Banking Details'}
            {tab === 'documents' && 'Documents'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='mt-6 rounded-lg bg-white p-8 shadow-lg'>
        {activeTab === 'basic' && trainer && (
          <div>
            <h3 className='mb-6 text-xl font-semibold text-gray-800'>Basic Information</h3>
            <div className='grid grid-cols-2 gap-6 text-gray-700'>
              <p>
                <strong>Phone:</strong> {trainer?.phone || 'N/A'}
              </p>
              <p>
                <strong>Alternate (Phone):</strong> {trainer?.alternate_phone || 'N/A'}
              </p>
              <p>
                <strong>Experience:</strong> {trainer?.experience || 'N/A'}
              </p>
              <p>
                <strong>Gender:</strong> {trainer?.gender || 'N/A'}
              </p>
              <p>
                <strong>Language:</strong> {trainer?.language || 'N/A'}
              </p>
              <p>
                <strong>Education:</strong> {trainer?.education || 'N/A'}
              </p>
              <p>
                <strong>Current Address:</strong> {trainer?.current_address || 'N/A'}
              </p>
              <p>
                <strong>Aadhar Address:</strong> {trainer?.addhar_address || 'N/A'}
              </p>
              <p>
                <strong>Account Created At:</strong>{' '}
                {new Date(trainer?.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'service' && trainer && (
          <div>
            <h3 className='mb-6 text-xl font-semibold text-gray-800'>Service Details</h3>
            <div className='space-y-2 text-gray-700'>
              <p>
                <strong>Service Type:</strong> {trainer?.service_type || 'N/A'}
              </p>
              <p>
                <strong>Service Area:</strong>{' '}
                {trainer?.servicing_area || trainer?.service_area || 'N/A'}
              </p>
              <p>
                <strong>Pin:</strong> {trainer?.pin || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'banking' && trainer && (
          <div>
            <h3 className='mb-6 text-xl font-semibold text-gray-800'>Banking Details</h3>
            <div className='grid grid-cols-2 gap-6 text-gray-700'>
              <p>
                <strong>Account Holder:</strong> {trainer?.account_holder_name || 'N/A'}
              </p>
              <p>
                <strong>Account Number:</strong> {trainer?.account_no || 'N/A'}
              </p>
              <p>
                <strong>Bank:</strong> {trainer?.bank_name || 'N/A'}
              </p>
              {/* <p><strong>Branch:</strong> {trainer?.bank_branch || "N/A"}</p> */}
              <p>
                <strong>IFSC Code:</strong> {trainer?.ifsc_code || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h3 className='mb-6 text-xl font-semibold text-gray-800'>Documents</h3>
            {trainer?.trainer_documents && trainer?.trainer_documents?.length > 0 ? (
              <ul className='list-disc pl-5 text-gray-700'>
                {trainer?.trainer_documents
                  .filter((doc) => doc.document_url)
                  .map((doc, index) => (
                    <li key={index}>
                      <a
                        href={doc.document_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 underline'
                      >
                        {doc.document_type}
                      </a>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className='text-gray-600'>No Documents Uploaded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

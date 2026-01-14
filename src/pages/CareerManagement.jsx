import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Upload, X, User, } from 'lucide-react';
import axios from 'axios';
import AddJobModal from '../components/customModals/AddJobModal';
import { toast } from 'react-toastify';

const CareerManagement = () => {
    const [loading, setLoading] = useState(false);
    const [jobList, setJobList] = useState([]);

    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false)
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [editingMember, setEditingMember] = useState(false);

    const fetchJobList = async () => {
        try {
            const res = await axios.get("https://ba-dastoor-backend.onrender.com/api/jobs/all-jobs");
            setJobList(res?.data?.data)
        } catch (error) {
            console.error("Error fetching job list:", error);
            // setLoading(false);
        }
    }

    useEffect(() => {
        fetchJobList()
    }, [])

    const handleAddClick = () => {
        setSelectedJob(null)
        setShowJobModal(true)
        setModalMode('add')
    }

    const handleEditClick = (job) => {
        setSelectedJob(job)
        setShowJobModal(true);
        setModalMode('edit');
    };

    const handleDeleteJob = async (id) => {
        toast.warning(
            ({ closeToast }) => (
                <div>
                    <p className="font-medium mb-3">
                        Are you sure you want to delete this content?
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={closeToast}
                            className="px-3 py-1 border rounded-md text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => confirmDeleteDish(id, closeToast)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
            }
        );
        // setLoading(true)
        // try {
        //     const response = await axios.delete(`http://localhost:3000/api/jobs/delete-job/${id}`);
        //     if (response) {
        //         alert("Job deleted successfully!");
        //         if (fetchJobList) {
        //             await fetchJobList();
        //         }
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
    }

    const confirmDeleteDish = async (id, closeToast) => {
        closeToast(); // close confirmation toast

        const toastId = toast.loading('Deleting Job...');

        try {
            const response = await axios.delete(`https://ba-dastoor-backend.onrender.com/api/jobs/delete-job/${id}`);
            toast.update(toastId, {
                render: 'Content deleted successfully 🗑️',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
            await fetchJobList();
            // if (response) {
            //     alert("Job deleted successfully!");
            //     if (fetchJobList) {
            //     }
            // }
        } catch (error) {
            console.log(error)
            toast.update(toastId, {
                render:
                    error?.response?.data?.message ||
                    'Failed to delete content ❌',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        } finally {

        }
    };


    return (
        <div>
            <div>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Career Management</h1>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="inline-flex w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                        <Plus className="w-5 h-5" />
                        Add Job
                    </button>
                </div>
            </div>
            {/* Jobs Table */}
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Job Title
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Location
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Experience
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Status (Active / Inactive)
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {jobList.length > 0 ? (
                                jobList?.map(job => (
                                    <tr key={job?._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{job?.jobTitle}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{job?.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{job?.location}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{job?.experience} years</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{job?.status === true ? 'Active' : 'InActive'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(job)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    // disabled={isLoading}
                                                    onClick={() => handleDeleteJob(job?._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        {"No jobs available"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
            {/* Mobile view */}
            {/* CARD VIEW (Below LG) */}
            <div className="block lg:hidden space-y-4">
                {
                    jobList.length > 0 ? (
                        jobList.map((job) => (
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{job?.jobTitle}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{job?.description}</p>
                                    </div>
                                    <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600">
                                        {job?.status === true ? 'Active' : 'InActive'}
                                    </span>
                                </div>

                                <div className="mt-3 text-sm">
                                    <span className="font-medium">Experience:</span> {job?.experience} years
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button onClick={() => handleEditClick(job)} className="flex-1 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteJob(job?._id)} className="flex-1 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))

                    ) : (
                        <div>
                            <span>
                                {"No jobs available"}
                            </span>
                        </div>
                    )
                }

            </div>


            <AddJobModal
                isModalOpen={showJobModal}
                closeModal={() => setShowJobModal(false)}
                mode={modalMode} // 'add' or 'edit'
                selectedJob={selectedJob}
                refreshList={fetchJobList} // Pass the refresh function
            />
        </div >
    )
}

export default CareerManagement
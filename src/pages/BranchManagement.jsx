import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Upload, X, User, } from 'lucide-react';
import AddBranchModal from '../components/customModals/AddBranchModal';
import axios from 'axios';
import { toast } from 'react-toastify';

const BranchManagement = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false)
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [branches, setBranches] = useState([])
    const [deleteLoading, setDeleteLoading] = useState(false)

    const fetchBranches = async () => {
        const res = await axios.get('https://ba-dastoor-backend.onrender.com/api/branches/get-branches');
        console.log(res?.data?.data)
        setBranches(res?.data?.data)
    }
    useEffect(() => {
        fetchBranches()
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

    const handleDeleteClick = async (branch) => {
        // console.log(branch?._id);
        // const id = branch?._id;
        // try {
        //     const res = await axios.delete(`http://localhost:3000/api/branches/delete-branches/${id}`);
        //     console.log(res)
        //     fetchBranches();
        // } catch (error) {
        //     console.error(error);
        // }
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
                            onClick={() => confirmDeleteDish(branch._id, closeToast)}
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
    }

    const confirmDeleteDish = async (id, closeToast) => {
        setDeleteLoading(true);
        closeToast(); // close confirmation toast

        const toastId = toast.loading('Deleting content...');

        try {

            await axios.delete(`https://ba-dastoor-backend.onrender.com/api/branches/delete-branches/${id}`);

            toast.update(toastId, {
                render: 'Branch deleted successfully',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });

            await fetchBranches();
        } catch (error) {
            toast.update(toastId, {
                render: error?.response?.data?.message || 'Delete failed',
                type: 'error',
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
                </div>
                <button
                    onClick={handleAddClick}
                    className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    Add Branch
                </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Photo
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Branch Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Address
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Contact
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {branches.map((branch) => (
                                <tr key={branch._id} className="hover:bg-gray-50 transition-colors">

                                    {/* <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {branch.images.slice(0, 3).map((img, index) => (
                                                <img
                                                    key={img._id}
                                                    src={img.url}
                                                    alt={branch.branchName}
                                                    className={`w-18 h-18 rounded-full object-cover border-2 border-white shadow-sm ${index !== 0 ? "-ml-3" : ""
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </td> */}
                                    <td className="px-4 py-4 w-[160px]">
                                        <div className="flex flex-row items-center gap-2">
                                            {branch.images.slice(0, 3).map((img) => (
                                                <img
                                                    key={img._id}
                                                    src={img.url}
                                                    alt={branch.branchName}
                                                    className="w-12 h-12 rounded-md object-cover border border-gray-200"
                                                />
                                            ))}
                                        </div>
                                    </td>


                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{branch.branchName}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{branch.address}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{branch.contact}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(branch)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                disabled={deleteLoading}
                                                onClick={() => handleDeleteClick(branch)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddBranchModal
                isModalOpen={showJobModal}
                closeModal={() => setShowJobModal(false)}
                mode={modalMode} // 'add' or 'edit'
                selectedJob={selectedJob}
                refreshList={fetchBranches} // Pass the refresh function
            />
        </div>
    )
}

export default BranchManagement
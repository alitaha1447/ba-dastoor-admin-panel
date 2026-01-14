import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';


const AddMenuModal = ({ isModalOpen, closeModal, mode = 'add', selectedContent, refreshList }) => {
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');
    const [isLoading, setIsLoading] = useState(false);

    const initialState = {
        heading: '',
        paragraph: ''
    }

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (mode === 'edit' && selectedContent) {
            setIsEditMode(true);
            // Populate form with selected job data
            setFormData({
                heading: selectedContent.heading || '',
                paragraph: selectedContent.paragraph || '',

            });
        } else {
            setIsEditMode(false);
            // Reset form for add mode
            // resetForm()
        }
    }, [mode, selectedContent, isModalOpen])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const resetForm = () => {
        setFormData(initialState);
        setIsEditMode(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const toastId = toast.loading(
            isEditMode ? 'Updating content...' : 'Saving content...'
        );
        try {
            if (isEditMode && selectedContent) {
                const res = await axios.put(`https://ba-dastoor-backend.onrender.com/api/content/update-content`, formData);
                toast.update(toastId, {
                    render: 'Content updated successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });

            } else {
                const res = await axios.post(`https://ba-dastoor-backend.onrender.com/api/content/create-content`, formData);
                toast.update(toastId, {
                    render: 'Content created successfully 🎉',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
            }
            refreshList?.();
            closeModal();
            resetForm(); // Reset form after successful submission
        } catch (error) {
            console.error(error);
            toast.update(toastId, {
                render: 'Something went wrong ❌',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        }
        finally {
            setIsLoading(false)
        }
    }

    if (!isModalOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Content' : 'Add New Content  '}
                    </h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className=" text-gray-500 hover:text-gray-700 text-xl" >
                        <X className="w-5 h-5" />

                    </button>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">

                    {/* Content Heading */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content Heading
                        </label>
                        <input
                            type="text" name='heading' value={formData.heading}
                            onChange={handleInputChange}
                            placeholder="Enter heading (e.g. About Our Cuisine)"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Paragraphs */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content Paragraphs
                        </label>
                        <textarea
                            type="text" name='paragraph' value={formData.paragraph} onChange={handleInputChange}
                            rows={6}
                            placeholder="Write detailed content here..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can write multiple paragraphs. Line breaks will be preserved.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition
                             ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
                        >
                            {isLoading
                                ? isEditMode
                                    ? 'Editing...'
                                    : 'Saving...'
                                : isEditMode
                                    ? 'Update Content'
                                    : 'Save Content'
                            }
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddMenuModal
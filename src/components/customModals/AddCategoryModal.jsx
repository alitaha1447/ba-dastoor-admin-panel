import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategoryModal = ({ closeModal, mode, selectedCategory, refetch }) => {

    const [isEditMode, setIsEditMode] = useState(mode === 'edit');
    const [category, setCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && selectedCategory) {
            setIsEditMode(true);
            // Populate form with selected job data
            setCategory(selectedCategory?.categoryName || '');
            // setFormData({
            //     dishName: selectedDish.dishName || '',
            //     description: selectedDish.description || '',
            //     fullPrice: selectedDish.fullPrice || '',
            //     halfPrice: selectedDish.halfPrice || '',

            // });
        } else {
            setIsEditMode(false);
            // Reset form for add mode
            // resetForm()
        }
    }, [mode, selectedCategory])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            categoryName: category
        }
        const id = selectedCategory ? selectedCategory._id : null;

        const toastId = toast.loading(
            isEditMode ? 'Updating categories...' : 'Saving categories...'
        );

        try {
            if (isEditMode) {

                await axios.put(`http://localhost:3000/api/categories/upate-category/${id}`, payload)
                toast.update(toastId, {
                    render: 'Category updated successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                await axios.post(`http://localhost:3000/api/categories/create-category`, payload)
                toast.update(toastId, {
                    render: 'Category created successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }
            refetch()
            closeModal();
        } catch (error) {
            console.log(error?.response)

        } finally {
            setIsLoading(false);
        }
    }

    // if (!isModalOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto'>
                <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Category' : 'Add New Category  '}
                    </h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className=" text-gray-500 hover:text-gray-700 text-xl" >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='px-6 py-6 space-y-6'>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name *
                        </label>

                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    {/* BUTTONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        {/* <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
                        >
                            {isEditMode ? "Update" : "Add"}
                        </button> */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-lg font-medium transition
        ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                        >
                            {isLoading
                                ? (isEditMode ? "Updating..." : "Adding...")
                                : (isEditMode ? "Update" : "Add")
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCategoryModal
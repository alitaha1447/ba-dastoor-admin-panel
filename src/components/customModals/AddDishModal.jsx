import React, { useEffect, useState, } from 'react'
import { X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddDishModal = ({ mode = 'add', closeModal, selectedCategory, selectedDish, refetch }) => {

    const categoryId = selectedCategory && selectedCategory._id;
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');
    const [isLoading, setIsLoading] = useState(false)

    // const toast = useRef(null);

    // Initial form state
    const initialFormData = {
        dishName: '',
        description: '',
        fullPrice: '',
        halfPrice: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    // Reset form function
    const resetForm = () => {
        setFormData(initialFormData);
        // setIsEditMode(false);
    };

    useEffect(() => {
        if (mode === 'edit' && selectedDish) {
            setIsEditMode(true);
            // Populate form with selected job data
            setFormData({
                dishName: selectedDish.dishName || '',
                description: selectedDish.description || '',
                fullPrice: selectedDish.fullPrice || '',
                halfPrice: selectedDish.halfPrice || '',

            });
        } else {
            setIsEditMode(false);
            // Reset form for add mode
            resetForm()
        }
    }, [mode, selectedDish])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            dishName: formData.dishName,
            description: formData.description,
            fullPrice: formData.fullPrice,
            halfPrice: formData.halfPrice,
        };

        const id = selectedDish?._id;


        const toastId = toast.loading(
            isEditMode ? 'Updating Dish...' : 'Saving Dish...'
        );

        try {
            if (isEditMode && id) {
                await axios.put(
                    `https://ba-dastoor-backend.onrender.com/api/dishes/update-dish/${id}`,
                    payload
                );
                toast.update(toastId, {
                    render: 'Dish updated successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
            } else {
                await axios.post(
                    `https://ba-dastoor-backend.onrender.com/api/dishes/create-dish/${categoryId}`,
                    payload
                );
                toast.update(toastId, {
                    render: 'Dish created successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
            }

            // ✅ SUCCESS CLEANUP
            resetForm();
            refetch();
            closeModal();

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>

            <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50'>
                <div className='bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto'>
                    <div className='sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
                        <h2 className="text-xl font-bold text-gray-900">
                            {/* Content */}
                            {isEditMode ? 'Edit Dish' : 'Add New Dish  '}
                        </h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className=" text-gray-500 hover:text-gray-700 text-xl" >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className='px-6 py-6 space-y-6'>
                        {/* Dish Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dish Name *
                            </label>
                            <input
                                type="text"
                                name="dishName"
                                value={formData.dishName}
                                onChange={handleChange}
                                placeholder="Enter dish name"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter dish description"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="fullPrice"
                                    value={formData.fullPrice}
                                    onChange={handleChange}
                                    placeholder="e.g. 250"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Half Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="halfPrice"
                                    value={formData.halfPrice}
                                    onChange={handleChange}
                                    placeholder="e.g. 150"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-5 py-2 rounded-lg text-white font-medium transition cursor-pointer
    ${isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isLoading
                                    ? 'Please wait...'
                                    : isEditMode
                                        ? 'Update Dish'
                                        : 'Add Dish'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </>
    )
}

export default AddDishModal
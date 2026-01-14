import React, { useEffect, useState, useRef } from 'react'
import { Plus, Edit, Trash2, Upload, X, User, } from 'lucide-react';
import AddMenuModal from '../../components/customModals/AddMenuModal';
import AddCategoryModal from '../../components/customModals/AddCategoryModal';
import AddDishModal from '../../components/customModals/AddDishModal';
import axios from 'axios';
// import { Toast } from 'primereact/toast';
// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { toast } from 'react-toastify';
// import dele

import { ProgressSpinner } from 'primereact/progressspinner';


const MenuContent = () => {

    const [selectedContent, setSelectedContent] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false)
    const [activeModal, setActiveModal] = useState(null);

    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [content, setContent] = useState({});

    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dishes, setDishes] = useState([])
    const [selectedDish, setSelectedDish] = useState(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);


    // const toast = useRef(null);

    const handleAddClick = () => {
        setShowJobModal(true)
        setModalMode('add')
    }


    const handleEditClick = (content) => {
        setSelectedContent(content)
        setShowJobModal(true);
        setModalMode('edit');
    };

    const fetchContent = async () => {
        try {
            const res = await axios.get(`https://ba-dastoor-backend.onrender.com/api/content/get-content`);
            setContent(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchCategory = async () => {
        try {
            const res = await axios.get(`https://ba-dastoor-backend.onrender.com/api/categories/get-categories`);
            setCategories(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchContent(),
                    fetchCategory(),
                ]);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        if (!categories || categories.length === 0) return;

        // select first category only if nothing is selected
        if (!selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories]);

    // fetch dishes based on category id when category changes

    const fetchDishesByCategory = async (categoryId) => {
        try {
            const res = await axios.get(`https://ba-dastoor-backend.onrender.com/api/dishes/get-dish/${categoryId}`);
            setDishes(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (selectedCategory?._id) {
            fetchDishesByCategory(selectedCategory._id);
        }
    }, [selectedCategory?._id]); // 



    // const handleDeleteContent = async () => {
    //     const confirmed = window.confirm(
    //         'Are you sure you want to delete this content?'
    //     );
    //     if (!confirmed) return;

    //     const toastId = toast.loading('Deleting content...');

    //     try {
    //         setDeleteLoading(true);
    //         await axios.delete(
    //             `http://localhost:3000/api/content/delete-content`
    //         );
    //         toast.update(toastId, {
    //             render: 'Content deleted successfully 🗑️',
    //             type: 'success',
    //             isLoading: false,
    //             autoClose: 3000,
    //         });
    //         refreshList?.();
    //     } catch (error) {
    //         console.log(error)
    //         toast.update(toastId, {
    //             render:
    //                 error?.response?.data?.message ||
    //                 'Failed to delete content ❌',
    //             type: 'error',
    //             isLoading: false,
    //             autoClose: 3000,
    //         });
    //     } finally {
    //         setDeleteLoading(false);
    //     }

    // };
    const handleDeleteContent = () => {
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
                            onClick={() => confirmDelete(closeToast)}
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
    };
    const confirmDelete = async (closeToast) => {
        closeToast(); // close confirmation toast

        const toastId = toast.loading('Deleting content...');

        try {
            await axios.delete(
                `https://ba-dastoor-backend.onrender.com/api/content/delete-content`
            );

            toast.update(toastId, {
                render: 'Content deleted successfully 🗑️',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });

            await fetchContent();
        } catch (error) {
            console.log(error);
            toast.update(toastId, {
                render:
                    error?.response?.data?.message ||
                    'Failed to delete content ❌',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        }
    };


    const hasContent = content && Object.keys(content).length > 0;

    const hanldeAddCategory = (type) => {
        setModalMode('add');
        setActiveModal(type);
    }
    const hanldeEditCategory = (data) => {
        setModalMode('edit');
        setActiveModal('category');
        setSelectedCategory(data);
    }

    const hanldeEditDish = (dish) => {
        setModalMode('edit');
        setActiveModal('dish');
        setSelectedDish(dish);
    };


    const handleDeleteDish = (dish) => {
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
                            onClick={() => confirmDeleteDish(dish._id, closeToast)}
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
    };


    const confirmDeleteDish = async (id, closeToast) => {
        closeToast(); // close confirmation toast

        const toastId = toast.loading('Deleting content...');

        try {
            setDeleteLoading(true);

            await axios.delete(
                `https://ba-dastoor-backend.onrender.com/api/dishes/delete-dish/${id}`
            );

            toast.update(toastId, {
                render: 'Dish deleted successfully',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });

            await fetchDishesByCategory(selectedCategory._id);
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
            <div className="">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Menu Content</h1>
                    </div>

                    {
                        hasContent ? (<button
                            onClick={() => handleEditClick(content)} style={{ width: '' }}
                            // onClick={() => hanldeAddCategory("menu")} style={{ width: '' }}
                            className="max-w-fit btn btn-lg btn-primary"
                        >
                            <Plus className="w-5 h-5" />
                            Edit Content's
                        </button>) : (<button
                            onClick={handleAddClick} style={{ width: '' }}
                            // onClick={() => hanldeAddCategory("menu")} style={{ width: '' }}
                            className="max-w-fit btn btn-lg btn-primary"
                        >
                            <Plus className="w-5 h-5" />
                            Add Content's
                        </button>)
                    }

                </div>
            </div>
            {/* Content List */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {hasContent ? (
                    <div className="space-y-6">
                        {/* Heading */}
                        <div>
                            <h3 className="text-lg font-bold text-black uppercase">
                                Heading
                            </h3>
                            <p className="mt-1 text-md font-medium text-gray-800">
                                {content.heading}
                            </p>
                        </div>
                        {/* Paragraph */}
                        <div>
                            <h3 className="text-lg font-semibold text-black uppercase">
                                Paragraph
                            </h3>
                            <p className="mt-1 text-md text-gray-700">
                                {content.paragraph}
                            </p>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                            {/* <button
                                disabled={deleteLoading}
                                onClick={handleDeleteContent}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                            >
                                {
                                    deleteLoading ? "Deleting" : "Delete"
                                }

                            </button> */}
                            <button
                                // disabled={deleteLoading}
                                onClick={handleDeleteContent}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-gray-500">
                        No content found
                    </div>
                )}
            </div>

            {/*  */}
            <AddMenuModal

                isModalOpen={showJobModal}
                closeModal={() => setShowJobModal(false)}
                mode={modalMode} // 'add' or 'edit'
                selectedContent={selectedContent}
                refreshList={fetchContent} // Pass the refresh function
            />
            {/* {
                activeModal === 'menu' && (
                    <AddMenuModal
                        mode={modalMode}
                        closeModal={() => setActiveModal(null)}
                    // selectedContent={selectedContent}
                    // refreshList={fetchContent} // Pass the refresh function
                    />
                )
            } */}
            {/* Menu list */}
            <div className=" my-6">
                <div className='mb-6'>
                    <h1 className="text-2xl font-bold text-gray-900">Menu List</h1>
                </div>
                <div className='flex  flex-col md:flex-row gap-4'>
                    {/* categories list */}
                    <div className=' w-full md:w-1/2'>
                        <div className="border border-gray-200 rounded-lg bg-white">

                            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                                <h1 className="text-sm font-semibold text-gray-800">
                                    Categories List
                                </h1>
                                <button
                                    onClick={() => hanldeAddCategory("category")}
                                    className="btn btn-sm btn-primary"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Category
                                </button>
                            </div>


                            <div className="divide-y divide-gray-200 p-4 text-sm text-gray-600">
                                {categories.map((category) => (
                                    <div key={category._id}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`flex justify-between items-center py-2 px-2 rounded-md cursor-pointer
    ${selectedCategory?._id === category._id
                                                ? "bg-blue-50 text-blue-700 font-medium"
                                                : "hover:bg-gray-50"
                                            }`}
                                    >                                        <span>{category.categoryName}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    hanldeEditCategory(category);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation() }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    {/* dishes list*/}
                    <div className=' w-full md:w-1/2'>
                        <div className="border border-gray-200 rounded-lg bg-white">
                            {/* Header */}
                            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                                <h1 className="text-sm font-semibold text-gray-800">
                                    {selectedCategory
                                        ? `Dishes – ${selectedCategory.categoryName}`
                                        : "Dish List"}
                                </h1>

                                <button
                                    disabled={!selectedCategory}
                                    onClick={() => hanldeAddCategory("dish")}

                                    className="btn btn-sm btn-primary"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Dishes
                                </button>
                            </div>

                            {/* Dishes */}
                            <div className="divide-y divide-gray-200 text-sm text-gray-700">
                                {dishes.length > 0 ? (
                                    dishes.map((dish) => (
                                        <div
                                            key={dish._id}
                                            className={`flex justify-between items-start px-4 py-3 gap-4
          ${selectedCategory?._id === dish._id
                                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                                    : "hover:bg-gray-50"
                                                }`}
                                        >
                                            {/* LEFT — NAME + PRICE + DESCRIPTION */}
                                            <div className="flex-1">
                                                {/* Name + Price */}
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className="font-semibold text-gray-900">
                                                        {dish.dishName}
                                                    </p>

                                                    {(dish.halfPrice || dish.fullPrice) && (
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            ₹{dish.fullPrice || "-"}
                                                            <span className="mx-1 text-gray-400">/</span>
                                                            ₹{dish.halfPrice || "-"}
                                                            <span className="text-xs text-gray-500 ml-1">
                                                                (Full / Half)
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                {dish.description && (
                                                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                                                        {dish.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* RIGHT — ACTIONS */}
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        hanldeEditDish(dish);
                                                    }}
                                                    className="p-2 rounded-md text-blue-600 hover:bg-blue-100"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteDish(dish);
                                                    }}
                                                    // disabled={}
                                                    className="p-2 rounded-md text-red-600 hover:bg-red-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 py-6">
                                        No dishes found for this category.
                                    </div>
                                )}
                            </div>


                        </div>

                    </div>
                </div>
            </div>
            {/*  */}
            {/* <AddCategoryModal
                isModalOpen={showCategoryModal}
                closeModal={() => setShowCategoryModal(false)}
                mode={modalMode} // 'add' or 'edit'
            // selectedContent={selectedContent}
            // refreshList={fetchContent} // Pass the refresh function
            /> */}
            {activeModal === 'category' && (
                <AddCategoryModal
                    mode={modalMode}
                    closeModal={() => setActiveModal(null)}
                    selectedCategory={selectedCategory}
                    refetch={fetchCategory}
                />
            )}
            {activeModal === 'dish' && (
                <AddDishModal
                    toast={toast}
                    mode={modalMode}
                    closeModal={() => setActiveModal(null)}
                    selectedCategory={selectedCategory}
                    selectedDish={selectedDish}
                    refetch={() => fetchDishesByCategory(selectedCategory._id)}
                />
            )}
        </div>
    )
}

export default MenuContent
import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Upload, X, User, } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddGalleryModal from '../components/customModals/AddGalleryModal';
import AddGalleryVideosModal from '../components/customModals/AddGalleryVideosModal';

const GalleryManagement = () => {
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [showGalleryVideoModal, setShowGalleryVideoModal] = useState(false);

    const [galleryImg, setGalleryImg] = useState([]);
    const [galleryVideo, setGalleryVideo] = useState([]);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedImg, setSelectedImg] = useState(null)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deletingId, setDeletingId] = useState(null);

    const [activeTab, setActiveTab] = useState("image")

    const handleAddClick = () => {
        console.log('first')
        setShowGalleryModal(true)
        setModalMode('add')
    }

    const handleEditClick = (galleryImg) => {
        // console.log(galleryImg)
        setSelectedImg(galleryImg)
        setShowGalleryModal(true);
        setModalMode('edit');
    };

    const handleAddVideoClick = () => {
        console.log('video')
        setShowGalleryVideoModal(true)
        setModalMode('add')
    }

    const fetchGalleyImg = async () => {
        try {
            const res = await axios.get(
                "https://ba-dastoor-backend.onrender.com/api/newGalleryImg/new-get-galleryImg"
            );
            setGalleryImg(res?.data?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchGalleryVideo = async () => {
        try {
            const res = await axios.get(
                "https://ba-dastoor-backend.onrender.com/api/newGalleryVideo/new-get-galleryVideo"
            );
            setGalleryVideo(res?.data?.data || []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchGalleyImg();
    }, []);
    useEffect(() => {
        fetchGalleryVideo();
    }, []);

    // console.log(galleryImg)

    const handleDelete = async (id) => {
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
        // const confirmDelete = window.confirm(
        //     "Are you sure you want to delete this gallery? This action cannot be undone."
        // );

        // if (!confirmDelete) return;

        // try {
        //     setDeletingId(id);

        //     await axios.delete(
        //         `http://localhost:3000/api/newGalleryImg/new-delete-galleryImg/${id}`
        //     );

        //     // Optimistic UI update (faster UX)
        //     setGalleryImg(prev => prev.filter(item => item._id !== id));

        //     // Optional refetch (safe)
        //     // fetchGalleyImg();

        //     alert("Gallery deleted successfully ✅");
        // } catch (error) {
        //     console.error("Delete failed", error);
        //     alert("Failed to delete gallery ❌");
        // } finally {
        //     setDeletingId(null);
        //     fetchGalleyImg()
        // }
    };

    const confirmDeleteDish = async (id, closeToast) => {
        closeToast(); // close confirmation toast

        const toastId = toast.loading('Deleting content...');

        try {
            // setDeleteLoading(true);

            await axios.delete(
                `https://ba-dastoor-backend.onrender.com/api/newGalleryImg/new-delete-galleryImg/${id}`
            );
            toast.update(toastId, {
                render: 'Photos deleted successfully',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });

            await fetchGalleyImg();
        } catch (error) {
            toast.update(toastId, {
                render: error?.response?.data?.message || 'Delete failed',
                type: 'error',
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            // setDeleteLoading(false);
        }
    };


    const handleDeleteVideo = async (id) => {
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
                            onClick={() => confirmDeleteVideo(id, closeToast)}
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
        // console.log(id)

        // const confirmDelete = window.confirm(
        //     "Are you sure you want to delete this gallery? This action cannot be undone."
        // );

        // if (!confirmDelete) return;

        // try {
        //     setDeletingId(id);

        //     await axios.delete(
        //         `http://localhost:3000/api/newGalleryVideo/new-delete-galleryVideo/${id}`
        //     );

        //     // Optimistic UI update (faster UX)
        //     setGalleryVideo(prev => prev.filter(item => item._id !== id));

        //     // Optional refetch (safe)
        //     fetchGalleyImg();

        //     alert("Gallery deleted successfully ✅");
        // } catch (error) {
        //     console.error("Delete failed", error);
        //     alert("Failed to delete gallery ❌");
        // } finally {
        //     // setDeletingId(null);
        //     fetchGalleryVideo()
        // }
    }

    const confirmDeleteVideo = async (id, closeToast) => {
        closeToast(); // close confirmation toast

        const toastId = toast.loading('Deleting content...');

        try {
            // setDeleteLoading(true);

            await axios.delete(
                `http://localhost:3000/api/newGalleryVideo/new-delete-galleryVideo/${id}`
            );
            toast.update(toastId, {
                render: 'Photos deleted successfully',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });

            await fetchGalleryVideo();
        } catch (error) {
            toast.update(toastId, {
                render: error?.response?.data?.message,
                type: 'error',
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            // setDeleteLoading(false);
        }
    };



    return (
        <div>
            <div>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Galley Management</h1>
                    </div>
                    <div className='flex flex-row gap-2'>

                        <button
                            onClick={handleAddClick}
                            className="inline-flex w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            Add Images
                        </button>
                        <button
                            onClick={handleAddVideoClick}
                            className="inline-flex w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            Add Videos
                        </button>
                    </div>
                    <div>
                        <div className="w-full sm:w-auto flex justify-end">
                            <div className="relative inline-flex w-full max-w-xs sm:w-auto rounded-full bg-gray-100 p-1 sm:p-1.5 border border-blue-500">
                                <span
                                    className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-full bg-blue-500 shadow-md transition-all duration-300 ease-out
                    ${activeTab === 'video' ? 'translate-x-[calc(100%-0.25rem)] sm:translate-x-[calc(100%-0.5rem)] w-1/2'
                                            : 'translate-x-0 w-1/2'}`} />
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('image')}
                                    className={`relative z-10 flex-1 px-4 sm:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-full
                    transition-colors text-center whitespace-nowrap min-w-[70px]
                    ${activeTab === 'image'
                                            ? 'text-white font-semibold'
                                            : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Image
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab('video')}
                                    className={`relative z-10 flex-1 px-4 sm:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-full
                    transition-colors text-center whitespace-nowrap min-w-[70px]
                    ${activeTab === 'video'
                                            ? 'text-gray-900 font-semibold'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }
                                                `}
                                >
                                    Video
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  */}
            {/* {activeTab} */}
            <div className='hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    S.No
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Image
                                </th>
                                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Media type
                                </th> */}
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        {activeTab === "image" ? (
                            <tbody className="divide-y divide-gray-200">
                                {galleryImg.length > 0 ? (
                                    galleryImg.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                            {/* S.No */}
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            {/* Images */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {/* Primary Image */}
                                                    <div className="w-20 h-14 rounded-md overflow-hidden border border-blue-500">
                                                        <img
                                                            src={item.primaryImage?.url}
                                                            alt="primary"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    {/* Sibling Images */}
                                                    {item.siblings?.map((sib, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-20 h-14 rounded-md overflow-hidden border border-gray-200"
                                                        >
                                                            <img
                                                                src={sib.url}
                                                                alt={`sibling-${i}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            {/* Media Type */}
                                            {/* <td className="px-6 py-4">
                                                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                                                    {item.mediaType}
                                                </span>
                                            </td> */}
                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button

                                                        onClick={() => handleEditClick(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        disabled={deletingId === item._id}
                                                        className={`p-2 rounded-lg transition-all
        ${deletingId === item._id
                                                                ? "text-gray-400 cursor-not-allowed"
                                                                : "text-red-600 hover:bg-red-50"
                                                            }
    `}
                                                        title="Delete"
                                                    >
                                                        {deletingId === item._id ? (
                                                            <span className="text-xs font-medium">Deleting...</span>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No Gallery images available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        ) : (
                            <tbody className="divide-y divide-gray-200">
                                {galleryVideo.length > 0 ? (
                                    galleryVideo.map((item, index) => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                            {/* S.No */}
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            {/* Images */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {/* Primary Image */}
                                                    <div className="w-20 h-14 rounded-md overflow-hidden border border-blue-500">
                                                        <video
                                                            src={item.primaryVideo?.url}
                                                            alt="primary"
                                                            className="w-full h-full object-cover"
                                                            controls={false}
                                                            muted
                                                            playsInline
                                                        />
                                                    </div>
                                                    {/* Sibling Images */}
                                                    {item.siblings?.map((sib, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-20 h-14 rounded-md overflow-hidden border border-gray-200"
                                                        >
                                                            <video
                                                                src={sib.url}
                                                                alt={`sibling-${i}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            {/* Media Type */}
                                            {/* <td className="px-6 py-4">
                                                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                                                    {item.mediaType}
                                                </span>
                                            </td> */}
                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button

                                                        onClick={() => handleEditClick(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVideo(item._id)}
                                                        disabled={deletingId === item._id}
                                                        className={`p-2 rounded-lg transition-all
                                                        ${deletingId === item._id
                                                                ? "text-gray-400 cursor-not-allowed"
                                                                : "text-red-600 hover:bg-red-50"
                                                            }`}
                                                        title="Delete"
                                                    >
                                                        {deletingId === item._id ? (
                                                            <span className="text-xs font-medium">Deleting...</span>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No Gallery videos available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        )}
                    </table>
                </div>
                {/* Pagination */}
                {/* {totalPages >= 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                        <p className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm rounded-lg border
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-100"
                            >
                                Prev
                            </button>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm rounded-lg border
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )} */}

            </div>
            {
                showGalleryModal && (
                    <AddGalleryModal
                        isModalOpen={showGalleryModal}
                        closeModal={() => setShowGalleryModal(false)}
                        mode={modalMode} // 'add' or 'edit'
                        selectedImg={selectedImg}
                        refreshList={fetchGalleyImg} // Pass the refresh function

                    />
                )
            }

            {showGalleryVideoModal && (

                <AddGalleryVideosModal
                    isModalOpen={showGalleryModal}
                    closeModal={() => setShowGalleryVideoModal(false)}
                    mode={modalMode} // 'add' or 'edit'
                    refreshList={fetchGalleryVideo} // Pass the refresh function
                />
            )
            }
        </div>
    )
}

export default GalleryManagement
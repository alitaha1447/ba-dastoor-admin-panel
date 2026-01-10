import React, { useState, useEffect } from 'react'
import { X, Upload, ImagePlus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddGalleryVideosModal = ({ closeModal, refreshList, mode = 'add', selectedVideos }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');

    const [videos, setVideos] = useState({
        primary: null,
        sibling1: null,
        sibling2: null,
        sibling3: null,
        sibling4: null,
        sibling5: null,
    });
    const [existingVideos, setExistingVideos] = useState([]);

    // useEffect(() => {
    //     if (mode === 'edit' && selectedVideos) {
    //         setIsEditMode(true);

    //         const filledVideos = {
    //             primary: selectedVideos.primaryImage || null,
    //             sibling1: null,
    //             sibling2: null,
    //             sibling3: null,
    //             sibling4: null,
    //             sibling5: null,
    //         };

    //         selectedImg.selectedVideos?.forEach(img => {
    //             if (img.slot) {
    //                 filledVideos[img.slot] = img;
    //             }
    //         });

    //         setExistingVideos(filledVideos);
    //     } else {
    //         setIsEditMode(false);
    //         setExistingVideos({
    //             primary: null,
    //             sibling1: null,
    //             sibling2: null,
    //             sibling3: null,
    //             sibling4: null,
    //             sibling5: null,
    //         });
    //     }
    // }, [mode, selectedVideos]);

    const handleVideoChange = (e, slot) => {
        // console.log(slot)
        const file = e.target.files[0];
        if (file) {
            setVideos(prev => ({ ...prev, [slot]: file }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        const fd = new FormData();



        Object.entries(videos).forEach(([slot, file]) => {
            if (file) {
                fd.append(slot, file); // ✅ SLOT NAME
            }
            // if (file instanceof File) {
            //     fd.append(slot, file); // ✅ SLOT NAME
            // }
        });

        const toastId = toast.loading(
            isEditMode ? 'Updating Videos...' : 'Uploading Videos...'
        );

        try {
            if (isEditMode && selectedVideos) {
                console.log(isEditMode)
                console.log('edit')
                // const id = selectedVideos._id; // ✅ FIX

                // const res = await axios.put(
                //     `http://localhost:3000/api/newGalleryImg/new-edit-galleryImg/${id}`,
                //     fd
                // );

                // if (res) {
                //     refreshList();
                //     closeModal();
                // }
            }
            else {
                const res = await axios.post(`http://localhost:3000/api/newGalleryVideo/new-upload-galleryVideo`, fd);
                console.log(res)
                toast.update(toastId, {
                    render: 'Videos uploaded successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
                // refreshList()
                // setFormData({ branchName: '', address: '', contact: '' });
                // setExistingImages([]);
                // setImages({ primary: null, secondary1: null, secondary2: null });
            }
            closeModal()
            refreshList()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {/* {isEditMode ? 'Edit Job' : 'Add New Job  '} */}
                        Add  Videos
                    </h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className=" text-gray-500 hover:text-gray-700 text-xl" >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className='p-6'>
                    <div>
                        <p className="text-sm font-medium mb-2">Primary Image</p>


                        <label className="block w-full h-48 border-2 border-dashed rounded-xl cursor-pointer relative overflow-hidden">

                            {videos.primary ? (
                                <video
                                    src={URL.createObjectURL(videos.primary)}
                                    className="w-full h-full object-cover rounded-xl"
                                    controls
                                />
                            ) : existingVideos.primary ? (
                                <video
                                    src={existingVideos.primary.url}
                                    className="w-full h-full object-cover rounded-xl"
                                    controls
                                />
                            ) : (
                                <>
                                    <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Primary Video</span>
                                </>
                            )}
                            <input type="file" hidden onChange={(e) => handleVideoChange(e, 'primary')} />

                        </label>
                    </div>
                    {/* SIBLING SLOTS */}
                    <div>
                        <p className="text-sm font-medium mb-2">Sibling Videos (Max 5)</p>

                        <div className="grid grid-cols-5 gap-3">
                            {['sibling1', 'sibling2', 'sibling3', 'sibling4', 'sibling5'].map((key, index) => (

                                <label key={key} className="flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 min-h-[105px]">
                                    {videos[key] ? (
                                        <video
                                            src={URL.createObjectURL(videos[key])}
                                            className="w-full h-full object-cover rounded-xl"
                                            controls={false}
                                        />
                                    ) : existingVideos[key] ? (
                                        <video
                                            src={existingVideos[key].url}
                                            className="w-full h-full object-cover rounded-xl"
                                            controls={false}
                                        />
                                    ) : (
                                        <>
                                            <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">
                                                Secondary {index + 1}
                                            </span>
                                        </>
                                    )}
                                    <input type="file" hidden onChange={(e) => handleVideoChange(e, key)} />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button

                        onClick={handleUpload}
                        // disabled={selectedImages.length === 0 || isLoading}
                        disabled={isLoading}

                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >

                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Submit...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddGalleryVideosModal
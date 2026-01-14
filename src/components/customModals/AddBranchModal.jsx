import React, { useEffect, useState } from 'react'
import { X, Upload, ImagePlus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';


const AddBranchModal = ({ isModalOpen, closeModal, mode = 'add', selectedJob, refreshList }) => {
    // const [branchId, setBranchId] = useState(null);
    // console.log(selectedJob)
    // const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');
    // console.log(isEditMode)
    const [images, setImages] = useState({
        primary: null,
        secondary1: null,
        secondary2: null,
    });

    const [formData, setFormData] = useState({
        branchName: '',
        address: '',
        contact: '',
        embedUrl: '',
    });
    const [existingImages, setExistingImages] = useState([])
    // console.log(existingImages)

    useEffect(() => {
        if (mode === 'edit' && selectedJob) {
            setIsEditMode(true);
            setFormData({
                branchName: selectedJob.branchName || '',
                address: selectedJob.address || '',
                contact: selectedJob.contact || '',
                embedUrl: selectedJob.embedUrl || '',
            });
            setExistingImages(selectedJob.images);
            // setImages(selectedJob.images)

        } else {
            setIsEditMode(false);
            setFormData({ branchName: '', address: '', contact: '' });
            setExistingImages([]);
            setImages({ primary: null, secondary1: null, secondary2: null });
        }
    }, [mode, selectedJob]);

    const handleImageChange = (e, slot) => {

        console.log(slot)
        const file = e.target.files[0];
        if (file) {
            setImages(prev => ({ ...prev, [slot]: file }));
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await axios.post('http://localhost:3000/api/branches/create-branch', formData);
    //         setBranchId(res?.data?.branchId)
    //         setStep(2);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const handleUpload = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        const fd = new FormData();

        fd.append("branchName", formData.branchName);
        fd.append("address", formData.address);
        fd.append("contact", formData.contact);
        fd.append("embedUrl", formData.embedUrl);


        console.log(images)
        Object.entries(images).forEach(([slot, file]) => {
            if (file) {
                fd.append(slot, file); // ✅ SLOT NAME
            }
            // if (file instanceof File) {
            //     fd.append(slot, file); // ✅ SLOT NAME
            // }
        });

        const toastId = toast.loading(
            isEditMode ? 'Updating Branch...' : 'Saving Branch...'
        );

        try {
            if (isEditMode && selectedJob) {

                const id = selectedJob?._id;
                const res = await axios.put(`https://ba-dastoor-backend.onrender.com/api/branches/edit-branches/${id}`, fd);
                toast.update(toastId, {
                    render: 'Branch updated successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
                // console.log(res)
                // if (res) {
                //     setFormData({ branchName: '', address: '', contact: '' });
                //     setExistingImages([]);
                //     setImages({ primary: null, secondary1: null, secondary2: null });
                //     refreshList()
                //     closeModal()

                // }
                // refreshList()
                // setFormData({ branchName: '', address: '', contact: '' });
                // setExistingImages([]);
                // setImages({ primary: null, secondary1: null, secondary2: null });
                // closeModal()

            } else {
                const res = await axios.post(`https://ba-dastoor-backend.onrender.com/api/branches/create-branch`, fd);
                toast.update(toastId, {
                    render: 'Branch added successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });
                // console.log(res)
                // refreshList()
                // setFormData({ branchName: '', address: '', contact: '' });
                // setExistingImages([]);
                // setImages({ primary: null, secondary1: null, secondary2: null });
                // closeModal()
            }
            setFormData({ branchName: '', address: '', contact: '' });
            setExistingImages([]);
            setImages({ primary: null, secondary1: null, secondary2: null });
            refreshList()
            closeModal()
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
            setIsLoading(false)
        }
    }

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Branch' : 'Add New Branch  '}
                    </h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className=" text-gray-500 hover:text-gray-700 text-xl" >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {/*  */}
                <div className="p-6 space-y-8">
                    <form>
                        <div> <h3 className="text-lg font-semibold mb-4">Branch Details</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch Name *
                                </label>
                                <input
                                    type="text"
                                    name="branchName"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.branchName}
                                    onChange={handleChange}
                                    placeholder="Enter Brach Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact
                                </label>
                                <input
                                    type="number"
                                    name="contact"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="Enter Contact Number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter Address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Add Embed Url
                                </label>
                                <input
                                    type="text"
                                    name="embedUrl"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.embedUrl}
                                    onChange={handleChange}
                                    placeholder="Enter Embed Url"
                                />
                            </div>
                        </div>
                        {/* <div className=''>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
                            >
                                Save
                            </button>
                        </div> */}
                    </form>
                    {/* {step === 1 &&
                        (
                    )} */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Branch Images</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {/* <label className="col-span-2 row-span-2 flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 min-h-[220px]">
                                {images.primary ? (
                                    <img
                                        src={URL.createObjectURL(images.primary)}
                                        alt="Primary"
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <>
                                        <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Primary Image</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleImageChange(e, 'primary')}
                                />
                            </label> */}

                            <label className="col-span-2 row-span-2 flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 min-h-[220px]">
                                {images.primary ? (
                                    <img src={URL.createObjectURL(images.primary)}
                                        alt="Primary"
                                        className="w-full h-full object-cover rounded-xl" />
                                ) : existingImages[0] ? (
                                    <img src={existingImages[0].url} alt="Primary"
                                        className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <>
                                        <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Primary Image</span>
                                    </>
                                )}
                                <input type="file" hidden onChange={(e) => handleImageChange(e, 'primary')} />
                            </label>
                            {/* Secondary Images */}
                            {['secondary1', 'secondary2'].map((key, index) => (
                                // <label
                                //     key={key}
                                //     className="flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 min-h-[105px]"
                                // >
                                //     {images[key] ? (
                                //         <img
                                //             src={URL.createObjectURL(images[key])}
                                //             alt="Secondary"
                                //             className="w-full h-full object-cover rounded-xl"
                                //         />
                                //     ) : (
                                //         <>
                                //             <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                                //             <span className="text-xs text-gray-500">
                                //                 Secondary {index + 1}
                                //             </span>
                                //         </>
                                //     )}
                                //     <input
                                //         type="file"
                                //         accept="image/*"
                                //         hidden
                                //         onChange={(e) => handleImageChange(e, key)}
                                //     />
                                // </label>
                                <label key={key} className="flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 min-h-[105px]">
                                    {images[key] ? (
                                        <img src={URL.createObjectURL(images[key])} alt="Secondary"
                                            className="w-full h-full object-cover rounded-xl" />
                                    ) : existingImages[index + 1] ? (
                                        <img src={existingImages[index + 1].url} />
                                    ) : (
                                        <>
                                            <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">
                                                Secondary {index + 1}
                                            </span>
                                        </>
                                    )}
                                    <input type="file" hidden onChange={(e) => handleImageChange(e, key)} />
                                </label>
                            ))}
                        </div>
                        {/* Upload Button */}
                        {/* <button
                            type="button"
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
                            onClick={handleUpload}
                        >
                            <Upload className="w-4 h-4" />
                            Upload Images
                        </button> */}
                    </div>
                    {/* {step === 2 && (
                    )} */}


                    {/* <div className='mt-4'> */}
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Submit...
                            </>
                        ) : (
                            "Submit"
                        )}
                        {/* {isLoading ? "Saving" : "Saved"}
                        Save Branch */}
                    </button>
                    {/* </div> */}
                </div>
            </div>
        </div >

    )
}

export default AddBranchModal
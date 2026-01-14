import React, { useState, useEffect } from 'react'
import { X, Upload, ImagePlus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';


// const MAX_IMAGES = 6;


const AddGalleryModal = ({ closeModal, refreshList, mode = 'add', selectedImg }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');
    // new code 
    const [images, setImages] = useState({
        primary: null,
        sibling1: null,
        sibling2: null,
        sibling3: null,
        sibling4: null,
        sibling5: null,
    });
    const [existingImages, setExistingImages] = useState([]);
    console.log('selected --> ', selectedImg)
    // useEffect(() => {
    //     if (mode === 'edit' && selectedImg) {
    //         setIsEditMode(true);

    //         setExistingImages(selectedJob.images);
    //         // setImages(selectedJob.images)

    //     } else {
    //         setIsEditMode(false);
    //         setExistingImages([]);
    //     }
    // }, [mode, selectedImg]);
    // useEffect(() => {
    //     if (mode === 'edit' && selectedImg) {
    //         setIsEditMode(true);

    //         const imagesArr = [];

    //         // 1️⃣ Primary image first
    //         if (selectedImg.primaryImage) {
    //             imagesArr.push(selectedImg.primaryImage);
    //         }

    //         // 2️⃣ Then siblings
    //         if (Array.isArray(selectedImg.siblings)) {
    //             imagesArr.push(...selectedImg.siblings);
    //         }

    //         setExistingImages(imagesArr);
    //     } else {
    //         setIsEditMode(false);
    //         setExistingImages([]);
    //         setImages({
    //             primary: null,
    //             sibling1: null,
    //             sibling2: null,
    //             sibling3: null,
    //             sibling4: null,
    //             sibling5: null,
    //         });
    //     }
    // }, [mode, selectedImg]);
    useEffect(() => {
        if (mode === 'edit' && selectedImg) {
            setIsEditMode(true);

            const filledImages = {
                primary: selectedImg.primaryImage || null,
                sibling1: null,
                sibling2: null,
                sibling3: null,
                sibling4: null,
                sibling5: null,
            };

            selectedImg.siblings?.forEach(img => {
                if (img.slot) {
                    filledImages[img.slot] = img;
                }
            });

            setExistingImages(filledImages);
        } else {
            setIsEditMode(false);
            setExistingImages({
                primary: null,
                sibling1: null,
                sibling2: null,
                sibling3: null,
                sibling4: null,
                sibling5: null,
            });
        }
    }, [mode, selectedImg]);


    const handleImageChange = (e, slot) => {

        // console.log(slot)
        const file = e.target.files[0];
        if (file) {
            setImages(prev => ({ ...prev, [slot]: file }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        const fd = new FormData();


        // console.log(images)
        Object.entries(images).forEach(([slot, file]) => {
            if (file) {
                fd.append(slot, file); // ✅ SLOT NAME
            }
            // if (file instanceof File) {
            //     fd.append(slot, file); // ✅ SLOT NAME
            // }
        });

        const toastId = toast.loading(
            isEditMode ? 'Updating Photos...' : 'Uploading Photos...'
        );

        try {
            if (isEditMode && selectedImg) {
                const id = selectedImg._id; // ✅ FIX

                const res = await axios.put(
                    `https://ba-dastoor-backend.onrender.com/api/newGalleryImg/new-edit-galleryImg/${id}`,
                    fd
                );
                toast.update(toastId, {
                    render: 'Photos updated successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });

                // if (res) {
                //     refreshList();
                //     closeModal();
                // }
            }
            else {
                const res = await axios.post(`https://ba-dastoor-backend.onrender.com/api/newGalleryImg/new-upload-galleryImg`, fd);
                toast.update(toastId, {
                    render: 'Photos uploaded successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
                // console.log(res)
                // refreshList()
                // setFormData({ branchName: '', address: '', contact: '' });
                // setExistingImages([]);
                // setImages({ primary: null, secondary1: null, secondary2: null });
                // closeModal()
            }
            refreshList();
            closeModal();
        } catch (error) {
            console.log(error)
            toast.update(toastId, {
                render: error?.response?.data?.message,
                type: 'error',
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            setIsLoading(false)
        }
    }




    // const [selectedImages, setSelectedImages] = useState([]);
    // new old code
    // const [images, setImages] = useState({
    //     primary: null,
    //     siblings: Array(5).fill(null),
    // });

    // useEffect(() => {
    //     return () => {
    //         if (images.primary?.preview) {
    //             URL.revokeObjectURL(images.primary.preview);
    //         }
    //         images.siblings.forEach(img => {
    //             if (img?.preview) URL.revokeObjectURL(img.preview);
    //         });
    //     };
    // }, []);

    // const handleSelect = (file, type, index = null) => {
    //     if (!file) return;

    //     const img = {
    //         file,
    //         preview: URL.createObjectURL(file),
    //         name: file.name,
    //         mediaType: file.type.startsWith("video") ? "video" : "image",
    //     };

    //     setImages(prev => {
    //         const updated = { ...prev };

    //         if (type === "primary") {
    //             if (prev.primary?.preview) {
    //                 URL.revokeObjectURL(prev.primary.preview);
    //             }
    //             updated.primary = img;
    //         } else {
    //             if (prev.siblings[index]?.preview) {
    //                 URL.revokeObjectURL(prev.siblings[index].preview);
    //             }
    //             updated.siblings[index] = img;
    //         }
    //         return updated;
    //     });
    // };
    // const handleSelect = (file, type, index = null) => {
    //     if (!file) return;

    //     // Check file type
    //     const mediaType = file.type.startsWith("video") ? "video" : "image";

    //     // Create object with file and preview
    //     const img = {
    //         file,
    //         preview: URL.createObjectURL(file),
    //         name: file.name,
    //         mediaType: mediaType,
    //     };

    //     setImages(prev => {
    //         const updated = { ...prev };

    //         if (type === "primary") {
    //             if (prev.primary?.preview) {
    //                 URL.revokeObjectURL(prev.primary.preview);
    //             }
    //             updated.primary = img;
    //         } else if (type === "sibling" && index !== null) {
    //             // Create a new array to ensure React detects the change
    //             const newSiblings = [...prev.siblings];

    //             if (newSiblings[index]?.preview) {
    //                 URL.revokeObjectURL(newSiblings[index].preview);
    //             }

    //             newSiblings[index] = img;
    //             updated.siblings = newSiblings;
    //         }

    //         return updated;
    //     });
    // };
    // const removeImage = (type, index = null) => {
    //     setImages(prev => {
    //         const updated = { ...prev };

    //         if (type === "primary") {
    //             if (prev.primary?.preview) {
    //                 URL.revokeObjectURL(prev.primary.preview);
    //             }
    //             updated.primary = null;
    //         } else if (type === "sibling" && index !== null) {
    //             // Create a new array to trigger re-render
    //             const newSiblings = [...prev.siblings];

    //             if (newSiblings[index]?.preview) {
    //                 URL.revokeObjectURL(newSiblings[index].preview);
    //             }

    //             newSiblings[index] = null;
    //             updated.siblings = newSiblings;
    //         }

    //         return updated;
    //     });
    // };



    // const handleImageChange = (e) => {
    //     const files = Array.from(e.target.files);

    //     // Create preview URLs for selected images
    //     const newImages = files.map(file => ({
    //         file: file,
    //         preview: URL.createObjectURL(file),
    //         name: file.name,
    //         mediaType: file.type.startsWith("video") ? "video" : "image",

    //     }));

    //     setSelectedImages(prev => [...prev, ...newImages]);
    // };

    // const removeImage = (indexToRemove) => {
    //     setSelectedImages(prev => {
    //         // Revoke the URL to free memory
    //         URL.revokeObjectURL(prev[indexToRemove].preview);
    //         return prev.filter((_, index) => index !== indexToRemove);
    //     });
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault(); // 🔥 REQUIRED
    //     // new 
    //     if (!images.primary) return;
    //     setIsLoading(true);

    //     try {
    //         const fd = new FormData();

    //         fd.append("images", images.primary.file);
    //         images.siblings.forEach(img => {
    //             if (img) fd.append("images", img.file);
    //         });
    //         // Debug(optional)
    //         for (let pair of fd.entries()) {
    //             console.log(pair[0], pair[1]);
    //         }
    //         console.log('.................')
    //         const res = await axios.post(
    //             "http://localhost:3000/api/newGalleryImg/new-upload-galleryImg",
    //             fd
    //         );
    //         console.log(res)
    //         console.log('.................')
    //         if (res) {
    //             closeModal();
    //         }

    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         setIsLoading(false);
    //     }

    //     // Handle form submission here
    //     // console.log('Selected images:', selectedImages);

    //     // try {
    //     //     const fd = new FormData();
    //     //     selectedImages.forEach((img) => {
    //     //         fd.append("images", img.file); // ✅ ONLY FILE
    //     //         fd.append("mediaTypes", img.mediaType); // 👈 parallel array
    //     //     });
    //     //     // Debug (optional)
    //     //     // for (let pair of fd.entries()) {
    //     //     //     console.log(pair[0], pair[1]);
    //     //     // }
    //     //     const res = await axios.post(`http://localhost:3000/api/galleryImg/upload-galleryImg`, fd)
    //     //     console.log(res)
    //     //     closeModal();
    //     // } catch (error) {
    //     //     console.error("Upload failed:", error);
    //     // } finally { setIsLoading(true) }
    // };
    // const handleSubmit = async (e) => {
    //     e.preventDefault(); // 🔥 REQUIRED

    //     if (!images.primary) return;

    //     setIsLoading(true);

    //     try {
    //         const fd = new FormData();

    //         fd.append("images", images.primary.file);
    //         images.siblings.forEach(img => {
    //             if (img) fd.append("images", img.file);
    //         });

    //         // 🔎 debug
    //         for (let pair of fd.entries()) {
    //             console.log(pair[0], pair[1]);
    //         }

    //         const res = await axios.post(
    //             "http://localhost:3000/api/newGalleryImg/new-upload-galleryImg",
    //             fd,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data", // ✅ force
    //                 },
    //             }
    //         );
    //         if (res) {
    //             refetch()
    //             closeModal();
    //         }



    //     } catch (err) {
    //         console.error("UPLOAD ERROR:", err);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {/* {isEditMode ? 'Edit Job' : 'Add New Job  '} */}
                        Add Images / Videos
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
                            {/* {images.primary ? (
                                <>
                                    <img
                                        src={images.primary.preview}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeImage("primary");
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Upload className="w-10 h-10" />
                                    <span className="text-xs mt-1">Upload Primary</span>
                                </div>
                            )} */}

                            {/* <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                    handleImageChange(e, "primary")
                                }
                            onChange={(e) =>
                                handleSelect(e.target.files[0], "primary")
                            }
                            /> */}
                            {images.primary ? (
                                <img src={URL.createObjectURL(images.primary)}
                                    alt="Primary"
                                    className="w-full h-full object-cover rounded-xl" />
                            ) : existingImages.primary ? (
                                <img
                                    src={existingImages.primary.url}
                                    alt="Primary"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <>
                                    <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Primary Image</span>
                                </>
                            )}
                            <input type="file" hidden onChange={(e) => handleImageChange(e, 'primary')} />

                        </label>
                    </div>

                    {/* SIBLING SLOTS */}
                    <div>
                        <p className="text-sm font-medium mb-2">Sibling Images (Max 5)</p>

                        <div className="grid grid-cols-5 gap-3">
                            {['sibling1', 'sibling2', 'sibling3', 'sibling4', 'sibling5'].map((key, index) => (
                                // <label
                                //     key={index}
                                //     className="relative aspect-[1/1] border-2 border-dashed rounded-lg cursor-pointer overflow-hidden"
                                // >
                                //     {img ? (
                                //         <>
                                //             <img
                                //                 src={img.preview}
                                //                 className="w-full h-full object-cover"
                                //             />
                                //             <button
                                //                 onClick={(e) => {
                                //                     e.preventDefault();
                                //                     removeImage("sibling", index);
                                //                 }}
                                //                 className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                //             >
                                //                 <X size={14} />
                                //             </button>
                                //         </>
                                //     ) : (
                                //         <div className="flex items-center justify-center h-full text-gray-400">
                                //             <Upload size={18} />
                                //         </div>
                                //     )}

                                //     <input
                                //         type="file"
                                //         accept="image/*"
                                //         hidden
                                //         onChange={(e) => {
                                //             handleSelect(e.target.files[0], "sibling", index);
                                //             e.target.value = ""; 
                                //         }}
                                //     />
                                // </label>
                                <label key={key} className="flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 min-h-[105px]">
                                    {images[key] ? (
                                        <img src={URL.createObjectURL(images[key])} alt="Secondary"
                                            className="w-full h-full object-cover rounded-xl" />
                                    ) : existingImages[key] ? (
                                        <img
                                            src={existingImages[key].url}
                                            alt={key}
                                            className="w-full h-full object-cover rounded-xl"
                                        />
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
                    </div>


                    {/* <div className='mb-6'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Images
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                
                            </label>

                        </div>
                    </div> */}
                    {/* Selected Images Display */}
                    {/* {selectedImages.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Selected Images ({selectedImages.length})
                            </label>
                            <div className="grid grid-cols-8 gap-2">
                                {selectedImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all"
                                    >
                                        <img
                                            src={image.preview}
                                            alt={image.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            {image.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>
                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        // onClick={handleSubmit}
                        onClick={handleUpload}
                        // disabled={selectedImages.length === 0 || isLoading}
                        disabled={isLoading}

                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {/* Upload {selectedImages.length > 0 && `(${selectedImages.length})`} */}
                        {/* {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            `Upload ${selectedImages.length > 0 ? `(${selectedImages.length})` : ''}`
                        )} */}
                        {/* Uploading */}
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

export default AddGalleryModal


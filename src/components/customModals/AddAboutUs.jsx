import React, { useState, useEffect } from 'react';
import { X, Upload, User, Plus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddAboutUs = ({
    isModalOpen,
    closeModal,
    mode = 'add',
    refreshData,
}) => {
    const isEditMode = mode === 'edit';

    const [formData, setFormData] = useState({
        heading: '',
        ownerName: '',
        description: '',
        aboutUsHeading: '',
        aboutUsPara: '',
    });

    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);


    /* =========================
       FETCH EXISTING ABOUT US
    ========================= */
    useEffect(() => {
        if (isEditMode && isModalOpen) {
            fetchAboutUs();
        }
    }, [isEditMode, isModalOpen]);

    const fetchAboutUs = async () => {
        try {
            const res = await axios.get('https://ba-dastoor-backend.onrender.com/api/aboutUs/get-aboutus');
            if (res.data?.data) {
                setFormData({
                    heading: res?.data?.data?.heading || '',
                    ownerName: res?.data?.data?.ownerName || '',
                    description: res?.data?.data?.description || '',
                    aboutUsHeading: res?.data?.data?.aboutUsHeading || '',
                    aboutUsPara: res?.data?.data?.aboutUsPara || '',
                });
                setPhotoPreview(res?.data?.data?.ownerImage?.url || null);
            }
        } catch (err) {
            console.error(err);
        }
    };
    console.log(isEditMode)
    /* =========================
       HANDLERS
    ========================= */
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    // const handleRemovePhoto = () => {
    //     setPhoto(null);
    //     setPhotoPreview(null);
    // };

    const resetForm = () => {
        setFormData({ heading: '', ownerName: '', description: '' });
        setPhoto(null);
        setPhotoPreview(null);
    };

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('heading', formData.heading);
        data.append('ownerName', formData.ownerName);
        data.append('description', formData.description);
        data.append('aboutUsHeading', formData.aboutUsHeading);
        data.append('aboutUsPara', formData.aboutUsPara);
        // if (photo) data.append('ownerImage', photo);
        if (photo) {
            data.append('ownerImage', photo);
        }

        const toastId = toast.loading(
            isEditMode ? 'Updating About US...' : 'Adding About US...'
        );

        try {
            if (isEditMode) {
                await axios.put(
                    'https://ba-dastoor-backend.onrender.com/api/aboutUs/update-aboutus',
                    data
                );
                toast.update(toastId, {
                    render: 'About US updated successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                await axios.post(
                    'https://ba-dastoor-backend.onrender.com/api/aboutUs/create-aboutus',
                    data
                );
                toast.update(toastId, {
                    render: 'About US added successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }

            refreshData?.();
            closeModal();
            // resetForm();

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode ? 'Edit About Us' : 'Add About Us'}
                    </h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Image */}
                    <label className="group cursor-pointer inline-block">
                        <div className="relative w-24 h-24 rounded-full border-2 border-dashed
                    flex items-center justify-center overflow-hidden
                    bg-gray-50 hover:bg-gray-100">

                            {photoPreview ? (
                                <>
                                    <img
                                        key={photoPreview}
                                        src={photoPreview}
                                        onLoad={() => setImageLoaded(true)}
                                        className="w-full h-full object-cover"
                                    />
                                    {imageLoaded && (
                                        <div className="absolute inset-0 bg-black/40
                                    flex items-center justify-center
                                    opacity-0 group-hover:opacity-100">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="relative">
                                    <User className="w-10 h-10 text-gray-400" />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6
                                bg-blue-600 text-white rounded-full
                                flex items-center justify-center">
                                        <Plus className="w-3 h-3" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
                    </label>

                    {/* Heading */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heading *
                        </label>
                        <input
                            type="text"
                            name="heading"
                            required
                            value={formData.heading}
                            onChange={handleInputChange}
                            placeholder="About Our Founder"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Owner Name *
                        </label>
                        <input
                            type="text"
                            name="ownerName"
                            required
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            placeholder="Enter ownerName"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description/Bio *
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Brief description about the team member's role, expertise, and experience..."
                        />

                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            About Us Heading *
                        </label>
                        <input
                            type="text"
                            name="aboutUsHeading"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            value={formData.aboutUsHeading}
                            onChange={handleInputChange}
                            placeholder="Brief description about the team member's role, expertise, and experience..."
                        />

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            About Us Para *
                        </label>
                        <textarea
                            type="text"
                            name="aboutUsPara"
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            value={formData.aboutUsPara}
                            onChange={handleInputChange}
                            placeholder="Brief description about the team member's role, expertise, and experience..."
                        />

                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddModal(false);
                                resetForm();
                            }}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddAboutUs;

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react';
import axios from 'axios';
import {
    FaInstagram,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa";

const AddSocialLinks = ({ isModalOpen, closeModal, mode = 'add', selectedLinks, refreshList }) => {
    console.log(selectedLinks)
    const [isEditMode, setIsEditMode] = useState(mode === 'edit');
    const [isLoading, setIsLoading] = useState(false);

    const [socialLinks, setSocialLinks] = useState({
        instagram: { url: "" },
        facebook: { url: "" },
        twitter: { url: "" },
        linkedin: { url: "" },
    });

    useEffect(() => {
        if (mode === "edit" && selectedLinks) {
            const data = Array.isArray(selectedLinks)
                ? selectedLinks[0]
                : selectedLinks;

            setIsEditMode(true);

            setSocialLinks({
                instagram: { url: data?.instagram?.url || "" },
                facebook: { url: data?.facebook?.url || "" },
                twitter: { url: data?.twitter?.url || "" },
                linkedin: { url: data?.linkedin?.url || "" },
            });
        } else {
            setIsEditMode(false);
            setSocialLinks({
                instagram: { url: "" },
                facebook: { url: "" },
                twitter: { url: "" },
                linkedin: { url: "" },
            });
        }
    }, [mode, selectedLinks, isModalOpen]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(socialLinks)
        try {
            if (isEditMode) {
                const res = await axios.put(
                    "http://localhost:3000/api/socialLinks/update-socialLinks",
                    socialLinks
                );

                // alert("Social links updated successfully!");
                if (res) {
                    // Show success message
                    alert("SocialLinks updated successfully!");
                    refreshList()
                    // Call the refresh function to update the list
                    // if (refreshList) {
                    //     await refreshList();
                    // }
                    // resetForm()
                    closeModal(); // Close modal after successful operation
                }
            } else {
                const res = await axios.post(`http://localhost:3000/api/socialLinks/create-socialLinks`, socialLinks);
                console.log(res)
                if (res) {
                    // Show success message
                    alert("SocialLinks added successfully!");
                    refreshList()
                    // Call the refresh function to update the list
                    // if (refreshList) {
                    //     await refreshList();
                    // }
                    // resetForm()
                    closeModal(); // Close modal after successful operation
                }
            }
        } catch (error) {
            console.log(error?.response?.data?.message)
            alert(error?.response?.data?.message)
        } finally {
            closeModal()
        }
    }

    const handleChange = (platform, value) => {
        setSocialLinks((prev) => ({
            ...prev,
            [platform]: { url: value },
        }));
    };

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
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Footer – Social Media Links
                    </h2>
                    <div className="space-y-4">
                        {/* Instagram */}
                        <div className="flex items-center gap-4">
                            <FaInstagram className="text-pink-500 text-xl" />
                            <input
                                type="url"
                                placeholder="https://instagram.com/yourpage"
                                value={socialLinks.instagram.url}
                                onChange={(e) =>
                                    handleChange("instagram", e.target.value)
                                }
                                className="flex-1 border rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Facebook */}
                        <div className="flex items-center gap-4">
                            <FaFacebookF className="text-blue-600 text-xl" />
                            <input
                                type="url"
                                placeholder="https://facebook.com/yourpage"
                                value={socialLinks.facebook.url}
                                onChange={(e) =>
                                    handleChange("facebook", e.target.value)
                                }
                                className="flex-1 border rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Twitter */}
                        <div className="flex items-center gap-4">
                            <FaTwitter className="text-sky-400 text-xl" />
                            <input
                                type="url"
                                placeholder="https://twitter.com/yourpage"
                                value={socialLinks.twitter.url}
                                onChange={(e) =>
                                    handleChange("twitter", e.target.value)
                                }
                                className="flex-1 border rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        {/* LinkedIn */}
                        <div className="flex items-center gap-4">
                            <FaLinkedinIn className="text-blue-500 text-xl" />
                            <input
                                type="url"
                                placeholder="https://linkedin.com/company/yourpage"
                                value={socialLinks.linkedin.url}
                                onChange={(e) =>
                                    handleChange("linkedin", e.target.value)
                                }
                                className="flex-1 border rounded-md px-3 py-2 text-sm"
                            />
                        </div>
                    </div>
                    {/* ================= SAVE BUTTON ================= */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddSocialLinks
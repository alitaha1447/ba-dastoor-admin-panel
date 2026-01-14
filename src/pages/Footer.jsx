import React, { useEffect, useState } from "react";
import {
    FaInstagram,
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
} from "react-icons/fa";
import axios from "axios";
import AddSocialLinks from "../components/customModals/AddSocialLinks";
import { Plus, Edit, Trash2, Upload, X, User, } from 'lucide-react';

const API = "http://localhost:3000/api/socialLinks";


const Footer = () => {
    const [selectedLinks, setSelectedLinks] = useState(null);
    const [showJobModal, setShowJobModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [socials, setSocials] = useState([]);

    const [isLoading, setIsLoading] = useState(false)

    const handleAddClick = () => {
        setShowJobModal(true)
        setModalMode('add')
    }

    const handleEditClick = (socials) => {
        const firstItem = Array.isArray(socials) ? socials[0] : socials;

        setSelectedLinks(firstItem)
        setShowJobModal(true)
        setModalMode('edit')
    }

    const fetchSocialLinks = async () => {
        try {
            const res = await axios.get(`https://ba-dastoor-backend.onrender.com/api/socialLinks/get-socialLinks`)

            setSocials(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { fetchSocialLinks() }, []);

    const handleDelete = async (id) => {
        console.log(id)
        try {
            const res = await axios.delete(`https://ba-dastoor-backend.onrender.com/socialLinks/delete-socialLinks/${id}`)
            if (res) {
                fetchSocialLinks()
            }

        } catch (error) {
            console.log(error)
        }
    }

    const SOCIAL_CONFIG = {
        facebook: {
            label: "Facebook",
            icon: FaFacebookF,
        },
        instagram: {
            label: "Instagram",
            icon: FaInstagram,
        },
        twitter: {
            label: "Twitter",
            icon: FaTwitter,
        },
        linkedin: {
            label: "LinkedIn",
            icon: FaLinkedinIn,
        },
    };



    const hasSocialLinks = socials && Object.keys(socials).length > 0;
    return (
        <div>
            <div className="">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Social Links</h1>
                    </div>
                    {
                        hasSocialLinks ? (<button
                            onClick={() => handleEditClick(socials)} style={{ width: '' }}
                            // onClick={() => hanldeAddCategory("menu")} style={{ width: '' }}
                            className="max-w-fit btn btn-lg btn-primary"
                        >
                            <Plus className="w-5 h-5" />
                            Edit Social Link's
                        </button>) : (<button
                            onClick={handleAddClick} style={{ width: '' }}
                            // onClick={() => hanldeAddCategory("menu")} style={{ width: '' }}
                            className="max-w-fit btn btn-lg btn-primary"
                        >
                            <Plus className="w-5 h-5" />
                            Add Social Link's
                        </button>)
                    }

                </div>
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                Platform
                            </th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                URL
                            </th>
                            {/* <th className="text-center px-4 py-3 text-sm font-semibold text-gray-700">
                                Actions
                            </th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {socials && socials.length > 0 ? (
                            socials.map((so) =>
                                Object.entries(SOCIAL_CONFIG).map(([key, config]) => {
                                    const link = so?.[key]?.url;
                                    if (!link) return null;

                                    const Icon = config.icon;
                                    console.log(so)
                                    return (
                                        <tr
                                            key={`${so._id}-${key}`}
                                            className="border-t hover:bg-gray-50 transition"
                                        >
                                            {/* Platform */}
                                            <td className="px-4 py-3 flex items-center gap-2">
                                                <Icon className="text-primary" size={16} />
                                                <span className="font-medium">
                                                    {config.label}
                                                </span>
                                            </td>

                                            {/* URL */}
                                            <td className="px-4 py-3 text-sm text-gray-600 break-all">
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {link}
                                                </a>
                                            </td>

                                            {/* Actions */}
                                            {/* <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLinks(so);
                                                        setModalMode("edit");
                                                        setShowJobModal(true);
                                                    }}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedLinks(so);
                                                        setModalMode("edit");
                                                        setShowJobModal(true);
                                                    }}
                                                    className="btn btn-sm btn-outline"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td> */}
                                        </tr>
                                    );
                                })
                            )
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-6 text-gray-500">
                                    No social links found
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {socials && socials.length > 0 && (
                        <tfoot className="bg-gray-50 border-t">
                            <tr>
                                <td colSpan="3" className="px-4 py-4 text-right">
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => handleDelete(socials[0]?._id)}
                                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>



            </div >
            <AddSocialLinks
                isModalOpen={showJobModal}
                closeModal={() => setShowJobModal(false)}
                mode={modalMode} // 'add' or 'edit'
                selectedLinks={selectedLinks}
                refreshList={fetchSocialLinks} // Pass the refresh function
            />
        </div >

    );
};

export default Footer;

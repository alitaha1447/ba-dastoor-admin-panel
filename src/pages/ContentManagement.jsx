import React, { useState, useEffect } from 'react'
import {
    Upload, Image as ImageIcon, Monitor, Smartphone, Edit, Trash2, Save, RotateCcw, CheckCircle, Plus
} from 'lucide-react';
import AddContent from '../components/customModals/AddContent';
import axios from 'axios';
import { toast } from 'react-toastify';

const ContentManagement = () => {
    // Website sections
    const websiteSections = [
        {
            id: 'home',
            name: 'Home Page',
        },
        {
            id: 'about',
            name: 'About Us',
        },
        // {
        //     id: 'career',
        //     name: 'Careers',
        // },
        // {
        //     id: 'services',
        //     name: 'Services',
        // },
        // {
        //     id: 'contact',
        //     name: 'Contact Us',
        // },
    ];
    // Color mapping for Tailwind CSS classes
    const SECTION_COLORS = {
        home: {
            selected: 'border-red-500 bg-red-50 text-red-700',
            unselected: 'border-red-200 bg-red-25 hover:bg-red-50',
        },
        about: {
            selected: 'border-blue-500 bg-blue-50 text-blue-700',
            unselected: 'border-blue-200 bg-blue-25 hover:bg-blue-50',
        },
        // career: {
        //     selected: 'border-purple-500 bg-purple-50 text-purple-700',
        //     unselected: 'border-purple-200 bg-purple-25 hover:bg-purple-50',
        // },
        // services: {
        //     selected: 'border-green-500 bg-green-50 text-green-700',
        //     unselected: 'border-green-200 bg-green-25 hover:bg-green-50',
        // },
        // contact: {
        //     selected: 'border-orange-500 bg-orange-50 text-orange-700',
        //     unselected: 'border-orange-200 bg-orange-25 hover:bg-orange-50',
        // },
    };

    const [selectedSection, setSelectedSection] = useState('home');
    const [selectedPage, setSelectedPage] = useState('home');
    const [showContentModal, setShowContentModal] = useState(false)
    const [generalContent, setGeneralContent] = useState({})
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [loading, setLoading] = useState(false);

    // Get current section
    const currentSection = websiteSections.find(section => section.id === selectedSection);
    // console.log(currentSection?.id)

    // Handle section change
    const handleSectionChange = (sectionId) => {
        setSelectedSection(sectionId);
    };

    const handleAdd = () => {
        setShowContentModal(true)
        setModalMode('add')
        // setSelectedPage(currentSection)
    }

    const fetchGeneralContent = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `http://localhost:3000/api/generalContent/get-content?page=${selectedSection}`
            );

            setGeneralContent(res.data?.data || {});
        } catch (error) {
            console.error(error);
            setGeneralContent({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGeneralContent();
    }, [selectedSection]);

    const handleDelete = (data) => {
        console.log(data.page)
        const page = data?.page
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
                            onClick={() => confirmDeleteContent(page, closeToast)}
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
    }
    const confirmDeleteContent = async (page, closeToast) => {
        closeToast(); // close confirmation toast
        setLoading(true);

        const toastId = toast.loading('Deleting content...');

        try {

            await axios.delete(`http://localhost:3000/api/generalContent/delete-content?page=${page}`);

            toast.update(toastId, {
                render: 'Content deleted successfully',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
            });

            await fetchGeneralContent();
        } catch (error) {
            console.log(error)
            toast.update(toastId, {
                render: error?.message || 'Delete failed',
                type: 'error',
                isLoading: false,
                autoClose: 4000,
            });
        } finally {
            setLoading(false);
        }
    };


    const hasContent = generalContent && Object.keys(generalContent).length > 0;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            </div>
            <div className='mb-8'>
                <div className="flex flex-wrap gap-2">
                    {websiteSections.map((section) => {
                        const isSelected = selectedSection === section.id;
                        const colors = SECTION_COLORS[section.id];

                        return (
                            <div
                                key={section.id}
                                onClick={() => handleSectionChange(section.id)}
                                className={`flex-1 min-w-[180px] p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
          ${isSelected ? colors.selected : colors.unselected}
        `}
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`font-semibold text-base ${isSelected ? '' : 'text-gray-800'
                                            }`}
                                    >
                                        {section.name}
                                    </span>

                                    {/* {savedBanners[section.id] && (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    )} */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Add Content */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="w-full sm:flex-1">
                            <h2 className="text-xl font-bold text-gray-900">Add Content {currentSection.name}</h2>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white font-medium rounded-lg hover: hover:bg-blue-800 transition-all duration-200 cursor-pointer"
                        >
                            <Plus className="w-5 h-5" />
                            Add Banner
                        </button>
                    </div>
                </div>
            </div>
            {/* display section */}
            <div className="mt-6">
                {
                    loading ? (
                        <p className="text-gray-500">Loading content...</p>
                    ) : hasContent ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">

                            {/* LOGO */}
                            {generalContent.logo?.url && (
                                <img
                                    src={generalContent.logo.url}
                                    alt="Logo"
                                    className="h-16 object-contain"
                                />
                            )}

                            {/* HEADING */}
                            <h3 className="text-2xl font-bold text-gray-900">
                                {generalContent.heading}
                            </h3>

                            {/* DESCRIPTION */}
                            <p className="text-gray-700 leading-relaxed">
                                {generalContent.description}
                            </p>

                            {/* MEDIA */}
                            {generalContent.mediaType === "image" ? (
                                <img
                                    src={generalContent.media.url}
                                    alt="Media"
                                    className="w-full rounded-lg"
                                />
                            ) : (
                                <video
                                    src={generalContent.media.url}
                                    controls
                                    className="w-full rounded-lg"
                                />
                            )}

                            {/* DELETE BUTTON */}
                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    disabled={loading}
                                    onClick={() => handleDelete(generalContent)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">
                            No content added for this section.
                        </p>
                    )
                }
            </div>


            <AddContent
                isModalOpen={showContentModal}
                closeModal={() => setShowContentModal(false)}
                mode={modalMode} // 'add' or 'edit'
                selectedSection={selectedSection}
                // selectedContent={selectedContent}
                refreshList={fetchGeneralContent} // Pass the refresh function
            />
        </div>
    )
}

export default ContentManagement
import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Upload, X, User, } from 'lucide-react';
import axios from 'axios';
import AddSEOModal from '../components/customModals/AddSEOModal';
import { toast } from 'react-toastify';

const Seo = () => {

    const [showSEOModal, setShowSEOModal] = useState(false)
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

    const [seo, setSeo] = useState({
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        slug: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        schemaJsonLd: ""
    });

    const handleAddClick = () => {
        // setSelectedJob(null)
        setShowSEOModal(true)
        setModalMode('add')
    }

    const handleEditClick = (job) => {
        // setSelectedJob(job)
        setShowSEOModal(true);
        setModalMode('edit');
    };

    return (
        <div>
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">About Us</h1>

                    </div>
                    {
                        false ? (
                            <button
                                onClick={handleEditClick} style={{ width: '' }}
                                className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                Edit SEO
                            </button>
                        ) : (
                            <button
                                onClick={handleAddClick} style={{ width: '' }}
                                className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                Add SEO
                            </button>
                        )
                    }
                </div>
            </div>
            {/* SEO MODAL */}
            <AddSEOModal
                isModalOpen={showSEOModal}
                closeModal={() => setShowSEOModal(false)}
                mode={modalMode} // 'add' or 'edit'
            // selectedJob={selectedJob}
            // refreshData={fetchAboutUs} // Pass the refresh function
            />
        </div>
    )
}

export default Seo
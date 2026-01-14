import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Upload, X, User, } from 'lucide-react';
import AddAboutUs from "../components/customModals/AddAboutUs";
import axios from "axios";

const AboutUs = () => {
    const [aboutData, setAboutData] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showAboutModal, setShowAboutModal] = useState(false)
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [loading, setLoading] = useState(true);

    const handleAddClick = () => {
        setSelectedJob(null)
        setShowAboutModal(true)
        setModalMode('add')
    }

    // const handleEditClick = (job) => {
    //     setSelectedJob(job)
    //     setShowAboutModal(true);
    //     setModalMode('edit');
    // };

    //   FETCH ABOUT US
    const fetchAboutUs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "https://ba-dastoor-backend.onrender.com/api/aboutUs/get-aboutus"
            );

            setAboutData(res?.data?.data || null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAboutUs() }, [])


    const handleEditClick = () => {
        console.log('first')
        setModalMode('edit');
        setShowAboutModal('dish');
        // setSelectedDish(dish);
    }

    const hasAbout = aboutData && Object.keys(aboutData).length > 0;

    return (
        <div>
            <div className="">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">About Us</h1>

                    </div>
                    {
                        hasAbout ? (
                            <button
                                onClick={handleEditClick} style={{ width: '' }}
                                className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                Edit Details
                            </button>
                        ) : (
                            <button
                                onClick={handleAddClick} style={{ width: '' }}
                                className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                Add Details
                            </button>
                        )
                    }



                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : aboutData ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">

                        {/* Owner Section */}
                        <div className="flex items-center gap-6">
                            <img
                                src={aboutData.ownerImage.url}
                                alt={aboutData.ownerName}
                                className="w-24 h-24 rounded-full object-cover border"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {aboutData.ownerName}
                                </h2>
                                <p className="text-gray-600">{aboutData.heading}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Founder Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {aboutData.description}
                            </p>
                        </div>

                        {/* About Us Section */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                About Heading
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {aboutData.aboutUsHeading}
                            </p>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                About Us Para
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {aboutData.aboutUsPara}
                            </p>
                        </div>

                        {/* Meta */}
                        {/* <div className="text-sm text-gray-400 pt-4 border-t">
                            Last updated:{" "}
                            {new Date(aboutData.updatedAt).toLocaleString()}
                        </div> */}
                    </div>
                ) : (
                    <div className="text-gray-500">
                        No About Us data found. Please add details.
                    </div>
                )}
            </div>

            {/*  */}
            <AddAboutUs
                isModalOpen={showAboutModal}
                closeModal={() => setShowAboutModal(false)}
                mode={modalMode} // 'add' or 'edit'
                // selectedJob={selectedJob}
                refreshData={fetchAboutUs} // Pass the refresh function
            />
            {/*  */}

        </div>

    );
};

export default AboutUs;

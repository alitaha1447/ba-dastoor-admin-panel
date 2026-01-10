import React, { useEffect, useState } from 'react'
import axios from 'axios';
export const enquirySections = [
    {
        id: 'catering',
        name: 'Catering Enquiry',
    },
    {
        id: 'career',
        name: 'Career Enquiry',
    },
    // {
    //     id: 'contact',
    //     name: 'Contact Enquiry',
    // },
    // {
    //     id: 'franchise',
    //     name: 'Franchise Enquiry',
    // },
    {
        id: 'all',
        name: 'All Enquiry',
    },

];
export const SECTION_COLORS = {
    catering: {
        selected: 'border-red-500 bg-red-50 text-red-700',
        unselected: 'border-red-200 bg-red-25 hover:bg-red-50',
    },
    career: {
        selected: 'border-blue-500 bg-blue-50 text-blue-700',
        unselected: 'border-blue-200 bg-blue-25 hover:bg-blue-50',
    },
    // contact: {
    //     selected: 'border-purple-500 bg-purple-50 text-purple-700',
    //     unselected: 'border-purple-200 bg-purple-25 hover:bg-purple-50',
    // },
    // franchise: {
    //     selected: 'border-green-500 bg-green-50 text-green-700',
    //     unselected: 'border-green-200 bg-green-25 hover:bg-green-50',
    // },
    all: {
        selected: 'border-orange-500 bg-orange-50 text-orange-700',
        unselected: 'border-orange-200 bg-orange-25 hover:bg-orange-50',
    },

};

const FormManagement = () => {
    const [selectedSection, setSelectedSection] = useState('catering');
    const [enquiries, setEnquiries] = useState([])

    const handleSectionChange = (sectionId) => {
        setSelectedSection(sectionId);
    };

    // Get current section
    const currentSection = enquirySections.find(section => section.id === selectedSection);

    // Get Enquiries
    const fetchEnquiries = async () => {
        const res = await axios.get(`http://localhost:3000/api/enquirys/get-enquiry?enquiryType=${currentSection?.id}`)
        // console.log(res?.data?.data)
        setEnquiries(res?.data?.data)
    }
    useEffect(() => { fetchEnquiries() }, [currentSection?.id])

    const handleViewCV = (cvUrl) => {
        if (!cvUrl) return;

        // Force download (works 100%)
        window.open(`${encodeURI(cvUrl)}?fl_attachment=true`, "_blank");
    };


    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Form Management</h1>
            </div>
            <div className='mb-8'>
                <div className='flex flex-wrap gap-2'>
                    {enquirySections.map((section) => {
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
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Phone
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Enquiry Type
                                </th>

                                {/* {enquiry.enquiryType === "career" && ( */}
                                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Download CV
                                </th> */}
                                {/* )} */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {enquiries.length > 0 ? (
                                enquiries.map((enquiry, index) => {
                                    console.log('-----------', enquiry?.resume)
                                    // console.log(enquiry?.resume?.path)
                                    // const cvUrl = enquiry?.resume?.path.replace(/\\/g, "/");
                                    // console.log(cvUrl)
                                    return (
                                        <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors">


                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{enquiry.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{enquiry.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{enquiry.phone}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">{enquiry.enquiryType}</p>
                                                </div>
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                {enquiry.enquiryType === "career" && enquiry.resume && (

                                                    <button
                                                        onClick={() => handleViewCV(enquiry?.resume?.public_id)}
                                                        className="text-blue-600 underline"
                                                    >
                                                        View CV
                                                    </button>
                                                )}
                                            </td> */}
                                            {/* <a
                                                href={resume.downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-success"
                                            >
                                                Download CV
                                            </a> */}





                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        No Enquiry available for this section.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </div >
    )
}

export default FormManagement


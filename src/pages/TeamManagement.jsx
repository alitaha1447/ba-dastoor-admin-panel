// components/TeamManagement.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Edit, Trash2, Upload, X, User, } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const TeamManagement = () => {
    // Mock data for team members
    const initialMembers = [
        {
            id: 1,
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            name: 'John Smith',
            role: 'CEO & Founder',
            description: 'Visionary leader with 15+ years of experience in tech industry.',

        },
    ];
    // const isEditMode = mode === 'edit';

    const [members, setMembers] = useState(initialMembers);
    // const [filteredMembers, setFilteredMembers] = useState(initialMembers);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [filterDepartment, setFilterDepartment] = useState('all');
    // const [filterStatus, setFilterStatus] = useState('all');
    // const [selectedMembers, setSelectedMembers] = useState([]);
    const [teamData, setTeamData] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [editingMember, setEditingMember] = useState(null);
    // const [sortBy, setSortBy] = useState('order');
    // const [sortOrder, setSortOrder] = useState('asc');
    // const [currentPage, setCurrentPage] = useState(1);
    // const [itemsPerPage, setItemsPerPage] = useState(10);

    // Form state
    const [formData, setFormData] = useState({
        teamName: '',
        role: '',
        description: '',
    });


    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Reset form
    const resetForm = () => {
        setFormData({
            teamName: '',
            role: '',
            description: '',
        });
        setPhoto(null);
        setPhotoPreview(null);
        setEditingMember(null);
    };


    // FETCH TEAM DATA
    const fetchTeam = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "https://ba-dastoor-backend.onrender.com/api/team/get-team"
            );
            console.log(res)
            setTeamData(res?.data?.data || null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTeam() }, [])


    // Open add modal
    const handleAddClick = (data) => {
        console.log(data)
        resetForm();
        setShowAddModal(true);
    };

    // Open edit modal
    const handleEditClick = (member) => {
        setFormData({
            teamName: member.teamName || member.name, // depending on API
            role: member.role || '',
            description: member.description || '',
        });

        setPhotoPreview(member.photo || member.teamImage?.url || null);
        setEditingMember(member);   // ✅ REQUIRED
        setShowAddModal(true);
    };


    // Open delete modal
    const handleDeleteClick = (member) => {
        setMemberToDelete(member);
        setShowDeleteModal(true);
    };

    // Handle form input change
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;

    //     if (name.startsWith('social.')) {
    //         const socialField = name.split('.')[1];
    //         setFormData(prev => ({
    //             ...prev,
    //             social: {
    //                 ...prev.social,
    //                 [socialField]: value
    //             }
    //         }));
    //     } else {
    //         setFormData(prev => ({
    //             ...prev,
    //             [name]: value
    //         }));
    //     }
    // };
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };
    // Handle photo upload
    // const handlePhotoUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setPhotoPreview(reader.result);
    //             // In real app, you would upload to server and get URL
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // Remove photo
    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        // Also clear photo from formData if editing
        setFormData(prev => ({ ...prev, photo: '' }));
    };

    // Submit form (add/edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();

        data.append('teamName', formData.teamName);
        data.append('description', formData.description);
        data.append('role', formData.role);
        if (photo) {
            data.append('teamImage', photo);
        }

        // const toastId = toast.loading(
        //     isEditMode ? 'Updating About US...' : 'Adding About US...'
        // );
        const toastId = toast.loading(
            editingMember ? "Updating team member..." : "Adding team member..."
        );

        try {
            if (editingMember) {

                await axios.put(`https://ba-dastoor-backend.onrender.com/api/team/edit-team`, data)
                toast.update(toastId, {
                    render: 'Team updated successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {

                await axios.post(`https://ba-dastoor-backend.onrender.com/api/team/create-team`, data)
                toast.update(toastId, {
                    render: 'Team added successfully ✅',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }
            fetchTeam?.();
            setShowAddModal(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }

        // const newMember = {
        //     ...formData,
        //     id: editingMember ? editingMember.id : members.length + 1,
        //     photo: photoPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + formData.name,
        //     joinedDate: editingMember ? formData.joinedDate : new Date().toISOString().split('T')[0]
        // };

        // if (editingMember) {
        //     // Update existing member
        //     setMembers(prev => prev.map(m =>
        //         m.id === editingMember.id ? newMember : m
        //     ));
        // } else {
        //     // Add new member
        //     setMembers(prev => [...prev, newMember]);
        // }

        // setShowAddModal(false);
        // resetForm();
    };

    // Confirm delete
    const confirmDelete = () => {
        if (memberToDelete) {
            setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
        }
        setShowDeleteModal(false);
        setMemberToDelete(null);
    };




    // Delete selected
    // const deleteSelected = () => {
    //     setMembers(prev => prev.filter(m => !selectedMembers.includes(m.id)));
    //     setSelectedMembers([]);
    // };

    // Apply filters
    // useEffect(() => {
    //     let filtered = members;

    //     Search filter
    //     if (searchTerm) {
    //         filtered = filtered.filter(member =>
    //             member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             member.email.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //     }

    //     Department filter
    //     if (filterDepartment !== 'all') {
    //         filtered = filtered.filter(member =>
    //             member.department === filterDepartment
    //         );
    //     }

    //     Status filter
    //     if (filterStatus !== 'all') {
    //         filtered = filtered.filter(member =>
    //             member.status === filterStatus
    //         );
    //     }

    //     Sorting
    //     filtered.sort((a, b) => {
    //         if (sortBy === 'name') {
    //             return sortOrder === 'asc'
    //                 ? a.name.localeCompare(b.name)
    //                 : b.name.localeCompare(a.name);
    //         }
    //         if (sortBy === 'order') {
    //             return sortOrder === 'asc'
    //                 ? a.order - b.order
    //                 : b.order - a.order;
    //         }
    //         if (sortBy === 'joinedDate') {
    //             return sortOrder === 'asc'
    //                 ? new Date(a.joinedDate) - new Date(b.joinedDate)
    //                 : new Date(b.joinedDate) - new Date(a.joinedDate);
    //         }
    //         return 0;
    //     });

    //     setFilteredMembers(filtered);
    // }, [members, searchTerm, filterDepartment, filterStatus, sortBy, sortOrder]);

    // Pagination
    // const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

    const hasTeam = teamData && Object.keys(teamData).length > 0;


    return (
        <div className="">
            {/* Header */}
            <div className="">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>

                    </div>
                    {
                        hasTeam ? (
                            <button
                                onClick={() => handleEditClick(teamData)} style={{ width: '' }}
                                className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                Edit Member
                            </button>
                        ) : (
                            <button
                                onClick={handleAddClick} style={{ width: '' }}
                                className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                            >
                                <Plus className="w-5 h-5" />
                                Add Member
                            </button>
                        )
                    }

                    {/* <button
                        onClick={handleAddClick} style={{ width: '' }}
                        className="inline-flex max-w-fit items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                        <Plus className="w-5 h-5" />
                        Add Member
                    </button> */}
                </div>
                {/* TEAM CONTENT */}
                {loading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : teamData ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">

                        {/* Owner Section */}
                        <div className="flex items-center gap-6">
                            <img
                                src={teamData.teamImage.url}
                                alt={teamData.ownerName}
                                className="w-24 h-24 rounded-full object-cover border"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {teamData.teamName}
                                </h2>
                                {/* <p className="text-gray-600">{aboutData.heading}</p> */}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Role
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {teamData.role}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Founder Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {teamData.description}
                            </p>
                        </div>

                        {/* About Us Section */}
                        {/* <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {aboutData.aboutUsHeading}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {aboutData.aboutUsPara}
                            </p>
                        </div> */}

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

            {/* Members Table */}
            {/* <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Photo
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Description
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 transition-colors">

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img
                                                    src={member.photo}
                                                    alt={member.name}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />

                                            </div>

                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{member.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{member.role}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{member.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                           
                                            <button
                                                onClick={() => handleDeleteClick(member)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> */}

            {/* Add/Edit Member Modal */}
            {
                showAddModal && (
                    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Profile Photo
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full border-2 border-gray-300 border-dashed flex items-center justify-center overflow-hidden bg-gray-50">
                                                {photoPreview ? (
                                                    <img
                                                        src={photoPreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-12 h-12 text-gray-400" />
                                                )}
                                            </div>
                                            {photoPreview && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="inline-flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                                                <Upload className="w-5 h-5" />
                                                Upload Photo
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handlePhotoUpload}
                                                />
                                            </label>

                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="teamName"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.teamName}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role/Position *
                                        </label>
                                        <input
                                            type="text"
                                            name="role"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            placeholder="e.g., CEO, Developer, Designer"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description/Bio *
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Brief description about the team member's role, expertise, and experience..."
                                    />

                                </div>



                                {/* Form Actions */}
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
                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                                    >
                                        {editingMember ? 'Update Member' : 'Add Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Delete Confirmation Modal */}
            {
                showDeleteModal && memberToDelete && (
                    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl w-full max-w-md">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                                    Delete Team Member
                                </h3>
                                <p className="text-gray-600 text-center mb-6">
                                    Are you sure you want to delete <span className="font-semibold">{memberToDelete.name}</span>? This action cannot be undone.
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setMemberToDelete(null);
                                        }}
                                        className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                                    >
                                        Delete Member
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TeamManagement;
import React, { useState, useEffect } from "react";
import { X, Upload, User, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AddTeam = ({ isModalOpen, closeModal, mode = "add", refreshData }) => {
  const isEditMode = mode === "edit";
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    teamName: "",
    role: "",
    description: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && isModalOpen) {
      fetchTeam();
    }
  }, [isEditMode, isModalOpen]);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(
        "https://ba-dastoor-backend.onrender.com/api/team/get-team",
      );
      if (res.data?.data) {
        setFormData({
          teamName: res?.data?.data?.teamName || "",
          role: res?.data?.data?.role || "",
          description: res?.data?.data?.description || "",
          // aboutUsHeading: res?.data?.data?.aboutUsHeading || '',
          // aboutUsPara: res?.data?.data?.aboutUsPara || '',
        });
        setPhotoPreview(res?.data?.data?.teamImage?.url || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      teamName: "",
      role: "",
      description: "",
    });
    setPhoto(null);
    setPhotoPreview(null);
    setEditingMember(null);
  };

  // FETCH TEAM DATA
  // const fetchTeam = async () => {
  //     try {
  //         setLoading(true);
  //         const res = await axios.get(
  //             "https://ba-dastoor-backend.onrender.com/api/team/get-team"
  //         );
  //         console.log(res)
  //         setTeamData(res?.data?.data || null);
  //     } catch (error) {
  //         console.log(error);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  // useEffect(() => { fetchTeam() }, [])

  // const handleAddClick = () => {
  //     console.log(data)
  //     resetForm();
  //     setShowAddModal(true);
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
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    // Also clear photo from formData if editing
    setFormData((prev) => ({ ...prev, photo: "" }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    data.append("teamName", formData.teamName);
    data.append("description", formData.description);
    data.append("role", formData.role);
    if (photo) {
      data.append("teamImage", photo);
    }

    const toastId = toast.loading(
      isEditMode ? "Updating team member..." : "Adding team member...",
    );
    // const toastId = toast.loading(
    //   editingMember ? "Updating team member..." : "Adding team member...",
    // );

    try {
      if (isEditMode) {
        await axios.put(
          `https://ba-dastoor-backend.onrender.com/api/team/edit-team`,
          data,
        );
        toast.update(toastId, {
          render: "Team updated successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        await axios.post(
          `https://ba-dastoor-backend.onrender.com/api/team/create-team`,
          data,
        );
        toast.update(toastId, {
          render: "Team added successfully ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
      closeModal();
      refreshData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? "Edit Team Member" : "Add New Team Member"}
          </h2>
          <button
            onClick={() => {
              //   setShowAddModal(false);
              closeModal();
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
                // setShowAddModal(false);
                closeModal();
                resetForm();
              }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              {isEditMode ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeam;

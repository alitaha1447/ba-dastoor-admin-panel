import { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Edit,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle,
  Plus,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const BannerManagement = () => {
  // Website sections
  const websiteSections = [
    {
      id: "home",
      name: "Home Page",
    },
    {
      id: "about",
      name: "About Us",
    },
    {
      id: "career",
      name: "Careers",
    },
    {
      id: "gallery",
      name: "Gallery",
    },
    {
      id: "catering",
      name: "Catering",
    },
    {
      id: "franchise",
      name: "Franchise",
    },
  ];
  // Color mapping for Tailwind CSS classes
  const SECTION_COLORS = {
    home: {
      selected: "border-red-500 bg-red-50 text-red-700",
      unselected: "border-red-200 bg-red-25 hover:bg-red-50",
    },
    about: {
      selected: "border-blue-500 bg-blue-50 text-blue-700",
      unselected: "border-blue-200 bg-blue-25 hover:bg-blue-50",
    },
    career: {
      selected: "border-purple-500 bg-purple-50 text-purple-700",
      unselected: "border-purple-200 bg-purple-25 hover:bg-purple-50",
    },
    gallery: {
      selected: "border-green-500 bg-green-50 text-green-700",
      unselected: "border-green-200 bg-green-25 hover:bg-green-50",
    },
    catering: {
      selected: "border-orange-500 bg-orange-50 text-orange-700",
      unselected: "border-orange-200 bg-orange-25 hover:bg-orange-50",
    },
    franchise: {
      selected: "border-orange-500 bg-orange-50 text-orange-700",
      unselected: "border-orange-200 bg-orange-25 hover:bg-orange-50",
    },
  };

  // State
  const [showAddBanner, setShowAddBanner] = useState(false);

  const [selectedSection, setSelectedSection] = useState("home");
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileUploading, setIsMobileUploading] = useState(false);
  const [desktopBanners, setDesktopBanners] = useState([]);
  const [mobileBanners, setMobileBanners] = useState([]);

  const [selectedDesktopBanners, setSelectedDesktopBanners] = useState([]);
  const [loadingBannerId, setLoadingBannerId] = useState(null);

  const [selectedMobileBanners, setSelectedMobileBanners] = useState([]);
  const [loadingMobileBannerId, setLoadingMobileBannerId] = useState(null);

  const [savedBanners, setSavedBanners] = useState({
    desktop: null,
    mobile: null,
  });

  // Get current section
  const currentSection = websiteSections.find(
    (section) => section.id === selectedSection
  );

  const fetchDesktopBanners = async () => {
    const res = await axios.get(
      `https://ba-dastoor-backend.onrender.com/api/banners/get-desktopBanner?page=${currentSection?.id}`
    );
    console.log(res?.data?.data);
    setDesktopBanners(res?.data?.data);
    const preSelectedIds = res?.data?.data
      .filter((banner) => banner.isSelected === true)
      .map((banner) => banner._id);
    console.log(preSelectedIds);

    setSelectedDesktopBanners(preSelectedIds);
  };
  console.log("desktopBanners --> ", desktopBanners);
  useEffect(() => {
    fetchDesktopBanners();
  }, [currentSection?.id]);

  const fetchMobileBanners = async () => {
    const res = await axios.get(
      `https://ba-dastoor-backend.onrender.com/api/banners/mobile/get-mobileBanner?page=${currentSection?.id}`
    );
    console.log(res?.data?.data);
    setMobileBanners(res?.data?.data);
    const preSelectedIds = res?.data?.data
      .filter((banner) => banner.isSelected === true)
      .map((banner) => banner._id);
    console.log(preSelectedIds);

    setSelectedMobileBanners(preSelectedIds);
  };

  useEffect(() => {
    fetchMobileBanners();
  }, [currentSection?.id]);

  // Handle section change
  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
    // Reset previews when changing sections
    setDesktopPreview(null);
    setMobilePreview(null);
  };

  // Handle file upload
  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "video/mp4",
    ];

    if (!validTypes.includes(file.type)) {
      alert("Please upload JPG, PNG, WebP image or MP4 video");
      return;
    }

    // store file for upload
    setSavedBanners((prev) => ({
      ...prev,
      [type]: file,
    }));

    // preview
    const previewUrl = URL.createObjectURL(file);
    const isVideo = file.type === "video/mp4";

    if (type === "desktop") {
      setDesktopPreview({
        url: previewUrl,
        isVideo,
      });
    } else {
      setMobilePreview({
        url: previewUrl,
        isVideo,
      });
    }
  };

  // Reset banners
  const handleResetBanners = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all banners for this section?"
      )
    ) {
      setDesktopPreview(null);
      setMobilePreview(null);
    }
  };

  // Remove image
  const handleRemoveImage = (type) => {
    if (type === "desktop") {
      setDesktopPreview(null);
    } else {
      setMobilePreview(null);
    }
  };

  // Save banners
  const handleSaveBanners = async () => {
    setIsUploading(true);

    if (!desktopPreview) {
      alert("Please upload desktop banner image");
      setIsUploading(false);
      return;
    }
    const toastId = toast.loading("Uploading Desktop Banner...");

    try {
      const formData = new FormData();

      if (savedBanners.desktop) {
        formData.append("desktop", savedBanners.desktop);
        formData.append(
          "desktopMediaType",
          savedBanners.desktop.type.startsWith("video/") ? "video" : "image"
        );
      }

      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            // size: value.size,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      const res = await axios.post(
        `https://ba-dastoor-backend.onrender.com/api/banners/upload-desktopBanner?page=${currentSection?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      // alert("Uploaded successfully");
      toast.update(toastId, {
        render: "Mobile banner uploaded successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      await fetchDesktopBanners();
      handleResetBanners();
    } catch (error) {
      console.log("Error while uploading banner --> ", error);
      toast.update(toastId, {
        render: error?.response?.data?.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsUploading(false);
    }
  };
  // Save Mobile Banners
  const handleSaveMobileBanners = async () => {
    setIsMobileUploading(true);
    if (!mobilePreview) {
      alert("Please upload mobile banner image");
      setIsUploading(false);
      return;
    }
    const toastId = toast.loading("Uploading Mobile Banner...");

    try {
      const formData = new FormData();
      if (savedBanners.mobile) {
        formData.append("mobile", savedBanners.mobile);
        formData.append(
          "mobileMediaType",
          savedBanners.mobile.type.startsWith("video/") ? "video" : "image"
        );
      }

      console.log("==== FormData Preview ====");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, {
            name: value.name,
            type: value.type,
            // size: value.size,
          });
        } else {
          console.log(`${key}:`, value);
        }
      }

      const res = await axios.post(
        `https://ba-dastoor-backend.onrender.com/api/banners/mobile/upload-mobileBanner?page=${currentSection?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      // fetchBanners()
      // handleResetBanners()
      // fetchMobileBanners();
      // ✅ SUCCESS TOAST UPDATE
      toast.update(toastId, {
        render: "Mobile banner uploaded successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      await fetchMobileBanners();
      handleResetBanners();
      // alert("Uploaded successfully");
    } catch (error) {
      console.log("Error while uploading mobile banner --> ", error);
      console.log("Error while uploading mobile banner --> ", error);
      toast.update(toastId, {
        render: error?.response?.data?.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setIsMobileUploading(false);
    }
  };

  // Delete banners
  const handleDeleteDesktopBanner = async (id) => {
    console.log(id);
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
              onClick={() => confirmDelete(id, closeToast)}
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
  };
  const confirmDelete = async (id, closeToast) => {
    closeToast(); // close confirmation toast

    const toastId = toast.loading("Deleting Banner...");

    try {
      await axios.delete(
        `https://ba-dastoor-backend.onrender.com/api/banners/delete-desktopBanner/${id}`
      );

      toast.update(toastId, {
        render: "Banner deleted successfully 🗑️",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      await fetchDesktopBanners();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to delete banner ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Mobile banners
  const handleDeleteMobileBanner = async (id) => {
    console.log(id);
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
              onClick={() => confirmMobileDelete(id, closeToast)}
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
  };

  const confirmMobileDelete = async (id, closeToast) => {
    closeToast(); // close confirmation toast

    const toastId = toast.loading("Deleting Banner...");

    try {
      await axios.delete(
        `https://ba-dastoor-backend.onrender.com/api/banners/mobile/delete-mobileBanner/${id}`
      );

      toast.update(toastId, {
        render: "Banner deleted successfully 🗑️",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      await fetchMobileBanners();
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: error?.response?.data?.message || "Failed to delete banner ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // selected desktop banners
  const toggleSelectDesktopBanner = async (id) => {
    setLoadingBannerId(id);
    const isCurrentlySelected = selectedDesktopBanners.includes(id);
    const nextState = !isCurrentlySelected;

    // ✅ Update UI instantly
    setSelectedDesktopBanners((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    const toastId = toast.loading(
      nextState ? "Showing banner on home..." : "Removing banner from home..."
    );
    try {
      await axios.patch(
        "https://ba-dastoor-backend.onrender.com/api/banners/patch-desktopBanner",
        {
          ids: [id],
          isSelected: nextState,
        }
      );
      toast.update(toastId, {
        render: "Banner updated successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
    } catch (error) {
      console.error(error);
      // ❌ Rollback UI on failure
      setSelectedDesktopBanners((prev) =>
        nextState ? prev.filter((item) => item !== id) : [...prev, id]
      );

      toast.update(toastId, {
        render: "Failed to update banner ❌",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoadingBannerId(null);
    }
  };

  // selected mobile banners
  const toggleSelectMobileBanner = async (id) => {
    setLoadingMobileBannerId(id);
    const isCurrentlySelected = selectedMobileBanners.includes(id);
    const nextState = !isCurrentlySelected;

    // ✅ Update UI instantly
    setSelectedMobileBanners((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    const toastId = toast.loading(
      nextState ? "Showing banner on home..." : "Removing banner from home..."
    );
    try {
      await axios.patch(
        "https://ba-dastoor-backend.onrender.com/api/banners/mobile/patch-mobileBanner",
        {
          ids: [id],
          isSelected: nextState,
        }
      );
      toast.update(toastId, {
        render: "Banner updated successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
    } catch (error) {
      console.error(error);
      // ❌ Rollback UI on failure
      setSelectedDesktopBanners((prev) =>
        nextState ? prev.filter((item) => item !== id) : [...prev, id]
      );

      toast.update(toastId, {
        render: "Failed to update banner ❌",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoadingMobileBannerId(null);
    }
  };

  // const handleUpdateSelectedDesktopBanners = async (isSelected) => {
  //     console.log(isSelected)
  //     if (selectedDesktopBanners.length === 0) {
  //         alert("Please select at least one banner");
  //         return;
  //     }

  //     const toastId = toast.loading(
  //         'Updating Banner...'
  //     );

  //     try {
  //         const res = await axios.patch(
  //             "http://localhost:3000/api/banners/patch-desktopBanner",
  //             {
  //                 ids: selectedDesktopBanners,
  //                 isSelected: isSelected,
  //             }
  //         );

  //         toast.update(toastId, {
  //             render: 'Banners updated successfully ✅',
  //             type: 'success',
  //             isLoading: false,
  //             autoClose: 2000,
  //         });

  //         // console.log("Selection updated:", res.data);
  //         // refetch
  //         fetchDesktopBanners();
  //         // 🧹 Clear selection after success
  //         setSelectedDesktopBanners([]);

  //     } catch (error) {
  //         console.error("Error updating selection:", error);
  //         alert("Failed to update banner selection");
  //     }
  // }

  // const handleToggleDesktopBanner = async (id, currentState) => {
  //     console.log(id, currentState);
  //     const nextState = !currentState;

  //     // ✅ Optimistic UI update (THIS fixes checkbox)
  //     setSelectedDesktopBanners(prev =>
  //         prev.map(banner =>
  //             banner._id === id
  //                 ? { ...banner, isSelected: nextState }
  //                 : banner
  //         )
  //     );
  // }

  console.log(selectedSection);
  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
      </div>

      {/*  */}
      <div className="mb-8">
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
                    className={`font-semibold text-base ${
                      isSelected ? "" : "text-gray-800"
                    }`}
                  >
                    {section.name}
                  </span>

                  {savedBanners[section.id] && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Banner Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header Actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                Upload Banner Images / Video for {currentSection.name}
              </h2>
            </div>

            {/* Tab Switch Indicator code */}
            {/* <div className="w-full sm:w-auto flex justify-end">
                            <div className="relative inline-flex w-full max-w-xs sm:w-auto rounded-full bg-gray-100 p-1 sm:p-1.5 border border-gray-200">

                              
                                <span
                                    className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-full bg-white shadow-md transition-all duration-300 ease-out
                    ${mediaType === 'video'
                                            ? 'translate-x-[calc(100%-0.25rem)] sm:translate-x-[calc(100%-0.5rem)] w-1/2'
                                            : 'translate-x-0 w-1/2'
                                        }
                `}
                                />

                               
                                <button
                                    type="button"
                                    onClick={() => setMediaType('image')}
                                    className={`relative z-10 flex-1 px-4 sm:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-full
                    transition-colors text-center whitespace-nowrap min-w-[70px]
                    ${mediaType === 'image'
                                            ? 'text-gray-900 font-semibold'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Image
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMediaType('video')}
                                    className={`relative z-10 flex-1 px-4 sm:px-5 py-1.5 sm:py-2 text-sm font-medium rounded-full
                    transition-colors text-center whitespace-nowrap min-w-[70px]
                    ${mediaType === 'video'
                                            ? 'text-gray-900 font-semibold'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    Video
                                </button>

                            </div>
                        </div> */}
            <button
              onClick={() => setShowAddBanner((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white font-medium rounded-lg hover: hover:bg-blue-800 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Banner
            </button>
          </div>
        </div>

        {/* Upload Areas */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out p-6
    ${
      showAddBanner
        ? "max-h-auto opacity-100 translate-y-0"
        : "max-h-0 opacity-0 -translate-y-4"
    }`}
        >
          {/* Desktop & Mobile Upload in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Desktop Banner Upload */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Monitor className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Desktop Banner
                    </h3>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-2 transition-colors
                  ${
                    desktopPreview
                      ? "border-green-200 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 bg-white"
                  }`}
              >
                {desktopPreview ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                      {desktopPreview.isVideo ? (
                        <video
                          src={desktopPreview.url}
                          controls
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <img
                          src={desktopPreview.url}
                          alt="Desktop Banner Preview"
                          className="w-full h-48 object-cover"
                        />
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRemoveImage("desktop")}
                          className="p-3 bg-white/90 rounded-lg hover:bg-white shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Upload className="w-10 h-10 text-gray-400" />
                    </div>
                    <label className="block mb-3">
                      {/* <span className="text-gray-600">Drag & drop or</span> */}
                      <span className="text-blue-600 cursor-pointer hover:text-blue-700 ml-1 font-medium">
                        browse files
                      </span>
                      <input
                        id="desktop-upload"
                        type="file"
                        className="hidden"
                        accept="image/*,video/mp4"
                        onChange={(e) => handleFileUpload("desktop", e)}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Banner Upload */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Smartphone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Mobile Banner
                    </h3>
                  </div>
                </div>
              </div>
              <div
                className={`border-2 border-dashed rounded-xl p-2 transition-colors
                                            ${
                                              mobilePreview
                                                ? "border-green-200 bg-green-50"
                                                : "border-gray-300 hover:border-blue-400 bg-white"
                                            }`}
              >
                {mobilePreview ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                      {mobilePreview.isVideo ? (
                        <video
                          src={mobilePreview.url}
                          controls
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <img
                          src={mobilePreview.url}
                          alt="Mobile Banner Preview"
                          className="w-full h-48 object-cover"
                        />
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRemoveImage("mobile")}
                          className="p-3 bg-white/90 rounded-lg hover:bg-white shadow-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Upload className="w-10 h-10 text-gray-400" />
                    </div>
                    <label className="block mb-3">
                      <span className="text-gray-600">Drag & drop or</span>
                      <span className="text-blue-600 cursor-pointer hover:text-blue-700 ml-1 font-medium">
                        browse files
                      </span>
                      <input
                        id="mobile-upload"
                        type="file"
                        className="hidden"
                        accept="image/*,video/mp4"
                        onChange={(e) => handleFileUpload("mobile", e)}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-2 mt-4">
            <button
              onClick={handleSaveBanners}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isUploading ? "Saving..." : "Save Desktop Banner"}
            </button>
            <button
              onClick={handleResetBanners}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>
            <button
              onClick={handleSaveMobileBanners}
              disabled={isMobileUploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isMobileUploading ? "Saving..." : "Save Mobile Banner"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {currentSection.name} Banners List
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Desktop Banner list */}
          <div>
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {" "}
                    Desktop Banner{" "}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {" "}
                    Media Type{" "}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {" "}
                    Action{" "}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {" "}
                    Select Media{" "}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {desktopBanners?.length > 0 ? (
                  desktopBanners.map((banner, index) => (
                    <tr
                      key={banner._id || index}
                      className="hover:bg-gray-50 transition"
                    >
                      {banner?.mediaType === "image" ? (
                        <td className="px-4 py-3">
                          <img
                            src={banner.desktop?.url}
                            alt="Desktop Banner"
                            className="h-16 w-32 rounded-md object-cover border border-gray-200 shadow-sm"
                          />
                        </td>
                      ) : (
                        <td className="px-4 py-3">
                          <video
                            src={banner.desktop?.url}
                            alt="Desktop Banner"
                            className="h-16 w-32 rounded-md object-cover border border-gray-200 shadow-sm"
                          />
                        </td>
                      )}

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 capitalize">
                          {banner.mediaType}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* <button
                                                        // onClick={() => handleEditClick(job)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button> */}
                          <button
                            onClick={() =>
                              handleDeleteDesktopBanner(banner?._id, "desktop")
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {/* <input
                                                    type="checkbox"
                                                    checked={selectedDesktopBanners.includes(banner._id)}
                                                    onChange={() => toggleSelectOne(banner._id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                /> */}
                        <input
                          type="checkbox"
                          checked={selectedDesktopBanners.includes(banner._id)}
                          onChange={() => toggleSelectDesktopBanner(banner._id)}
                          disabled={loadingBannerId === banner._id}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-gray-500"
                    >
                      No banners available for this section.
                    </td>
                  </tr>
                )}
              </tbody>
              {/* <div className="flex gap-2 mt-2 mb-2">
                                <button
                                    onClick={() => handleUpdateSelectedDesktopBanners(true)}
                                    disabled={selectedDesktopBanners.length === 0}
                                    className=" py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    Show on Home
                                </button>

                                <button
                                    onClick={() => handleUpdateSelectedDesktopBanners(false)}
                                    disabled={selectedDesktopBanners.length === 0}
                                    className=" py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Remove from Home
                                </button>
                            </div> */}
            </table>
          </div>
          {/* Mobile Banner list */}
          <div>
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Mobile Banner
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {" "}
                    Media Type{" "}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {" "}
                    Action{" "}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {" "}
                    Select Media{" "}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {mobileBanners?.length > 0 ? (
                  mobileBanners.map((banner, index) => (
                    <tr
                      key={banner._id || index}
                      className="hover:bg-gray-50 transition"
                    >
                      {banner?.mediaType === "image" ? (
                        <td className="px-4 py-3">
                          <img
                            src={banner.mobile?.url}
                            alt="Desktop Banner"
                            className="h-16 w-32 rounded-md object-cover border border-gray-200 shadow-sm"
                          />
                        </td>
                      ) : (
                        <td className="px-4 py-3">
                          <video
                            src={banner.mobile?.url}
                            alt="Desktop Banner"
                            className="h-16 w-32 rounded-md object-cover border border-gray-200 shadow-sm"
                          />
                        </td>
                      )}
                      {/* <td className="px-4 py-3">
                        <img
                          src={banner?.mobile?.url}
                          alt="Mobile Banner"
                          className="h-16 w-32 rounded-md object-cover border border-gray-200 shadow-sm"
                        />
                      </td> */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 capitalize">
                          {banner.mediaType}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* <button
                                                        // onClick={() => handleEditClick(job)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button> */}
                          <button
                            onClick={() =>
                              handleDeleteMobileBanner(banner?._id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedMobileBanners.includes(banner._id)}
                          onChange={() => toggleSelectMobileBanner(banner._id)}
                          disabled={loadingMobileBannerId === banner._id}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />

                        {/* type="checkbox"
                                                checked={selectedDesktopBanners.includes(banner._id)}
                                                onChange={() => toggleSelectDesktopBanner(banner._id)}
                                                disabled={loadingBannerId === banner._id}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-gray-500"
                    >
                      No banners available for this section.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;

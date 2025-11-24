import axios from "axios";
import { ArrowBigLeft, Edit2, XIcon } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BannerImage = () => {
  const NavTo = useNavigate();
  const fileInputRef = useRef(null);
  const [ListBannedImg, setListBannedImg] = useState([]);
  const [selectedBanner, setselectedBanner] = useState({
    isOpen: false,
    banner: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const getBannerFromDb = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://rsglobalsolutions.in/api/routes.php?action=addbanner",
        { type: "get" }
      );

      if (res.data.success) {
        setListBannedImg(res.data.data);
      }
    } catch (err) {
      console.error("Fetch banners error:", err);
      alert("Error loading banners. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fileUpload = useCallback(async (event) => {
    event.preventDefault();
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      event.target.value = "";
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file, file.name);

    try {
      const res = await axios.post(
        "https://rsglobalsolutions.in/api/routes.php?action=upload_banner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success && res.data.fileURL.trim() !== "") {
        setselectedBanner((prevBanner) => ({
          ...prevBanner,
          banner: {
            ...prevBanner.banner,
            imageLinks: [
              ...prevBanner.banner.imageLinks,
              res.data.fileURL.trim(),
            ],
          },
        }));
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert(
        "Error uploading image. Please check your connection and try again."
      );
    } finally {
      event.target.value = "";
      setIsUploading(false);
    }
  }, []);

  const UpdateToDb = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://rsglobalsolutions.in/api/routes.php?action=addbanner",
        {
          type: "update",
          id: selectedBanner.banner._id,
          banner_type: selectedBanner.banner.banner_type,
          imageLinks: selectedBanner.banner.imageLinks,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        alert("Banner updated successfully!");
        setselectedBanner({ isOpen: false, banner: null });
        await getBannerFromDb();
      } else {
        alert("Failed to update banner. Please try again.");
      }
    } catch (err) {
      console.error("Update banner error:", err);
      alert(
        "Error updating banner. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedBanner, getBannerFromDb]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await UpdateToDb();
    },
    [UpdateToDb]
  );

  const handleRemoveImageLink = useCallback((index) => {
    setselectedBanner((prevBanner) => ({
      ...prevBanner,
      banner: {
        ...prevBanner.banner,
        imageLinks: prevBanner.banner.imageLinks.filter((_, i) => i !== index),
      },
    }));
  }, []);

  useEffect(() => {
    getBannerFromDb();
  }, [getBannerFromDb]);

  return (
    <div className="relative h-screen bg-slate-950 ">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="h-full w-full absolute overflow-y-auto scroll-smooth">
        <header className=" bg-white sticky top-0 p-4 shadow-md z-20">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-black">
              Product Management System
            </h1>

            <div className="hidden sm:flex items-center space-x-0.5">
              <button
                className="bg-blue-500 text-white px-5 rounded text-xs h-7 cursor-pointer"
                onClick={() => {
                  NavTo(-1);
                }}
              >
                <ArrowBigLeft />
              </button>
            </div>
          </div>
        </header>

        {isLoading && (
          <div className="flex justify-center items-center p-5">
            <p className="text-white text-lg">Loading banners...</p>
          </div>
        )}

        <div className="grid gap-3 p-5 mt-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {ListBannedImg.map((banner) => {
            return (
              <div
                key={banner._id}
                className="bg-white z-10 p-4 rounded-lg shadow-md mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold">{banner.banner_type}</h2>
                  <button
                    onClick={() => {
                      setselectedBanner({
                        isOpen: true,
                        banner: banner,
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    title="Edit Banner"
                  >
                    <Edit2 size={10} />
                  </button>
                </div>

                <div className="imageoverflow flex space-x-2 overflow-auto">
                  {banner.imageLinks.map((link, index) => (
                    <img
                      key={index}
                      src={link}
                      alt={`${banner.banner_type} ${index + 1}`}
                      loading="lazy"
                      className="w-[100px] h-[50px] object-cover mb-2"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedBanner.isOpen && (
        <div className="fixed inset-0 bg-gray-800/50 flex  items-center z-40 justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-lg min-w-[40dvw] max-w-[40dvw] max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-4">Update Banner</h2>
              <XIcon
                onClick={() => {
                  setselectedBanner({ isOpen: false, banner: null });
                }}
                className="cursor-pointer"
              />
            </div>

            <form className="text-wrap" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-gray-700 text-sm"
                >
                  Banner Title
                </label>
                <input
                  id="category"
                  disabled
                  value={selectedBanner.banner.banner_type}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                ></input>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Upload Image
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={fileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-3 py-2 text-sm rounded cursor-pointer"
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Choose File"}
                  </button>
                </div>

                {selectedBanner &&
                  selectedBanner.banner.imageLinks.length > 0 && (
                    <ul className="list-disc ml-5">
                      {selectedBanner.banner.imageLinks.map(
                        (link, index, imageList) => {
                          return (
                            <li key={index} className="text-blue-500">
                              <div className="flex items-center justify-between w-[350px]">
                                <p className="text-blue-500 w-full truncate">
                                  {link}
                                </p>

                                {imageList.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImageLink(index)}
                                    className="text-red-500"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setselectedBanner({ isOpen: false, banner: null });
                  }}
                  className="bg-gray-500 text-white px-3 py-2 text-sm rounded mr-2 cursor-pointer"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-2 text-sm rounded cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={isLoading || isUploading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerImage;

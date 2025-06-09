import axios from "axios";
import { ArrowBigLeft, Edit2, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BannerImage = () => {
  const NavTo = useNavigate();
  const [ListBannedImg, setListBannedImg] = useState([]);
  const [selectedBanner, setselectedBanner] = useState({
    isOpen: false,
    banner: null,
  });

  const fileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file, file.name);
    await axios
      .post(
        "https://rsgratitudegifts.com/api/routes.php?action=upload_banner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          if (res.data.fileURL.trim() === "") return;
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
          event.target.value = "";
        } else {
          event.target.value = "";
        }
      })
      .catch((err) => {
        event.target.value = "";
      });
  };
  const UpdateToDb = () => {
    axios
      .post(
        "https://rsgratitudegifts.com/api/routes.php?action=addbanner",
        {
          type: "updated",
          bannerType: SelectedBanner,
          imageList: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          alert("Product added successfully!");
          fetchProdutFromDb();
        } else {
          alert("Product already exists.");
        }
      })
      .catch((err) => {});
  };
  const getBannerFromDb = () => {
    axios
      .post("https://rsgratitudegifts.com/api/routes.php?action=addbanner", {
        type: "get",
      })
      .then((res) => {
        if (res.data.success) {
          setListBannedImg(res.data.data);
        }
      })
      .catch((err) => {});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    UpdateToDb();
  };
  const handleRemoveImageLink = (index) => {
    setselectedBanner((prevBanner) => ({
      ...prevBanner,
      banner: {
        ...prevBanner.banner,
        imageLinks: prevBanner.banner.imageLinks.filter((_, i) => i !== index),
      },
    }));
  };
  useEffect(() => {
    getBannerFromDb();
  }, []);

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

        <div className="grid gap-3 p-5 mt-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {ListBannedImg.map((banner) => {
            return (
              <div
                key={banner.id}
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
                    title="Edit Category"
                  >
                    <Edit2 size={10} />
                  </button>
                </div>

                <div className="imageoverflow overflow-auto">
                  {banner.imageLinks.map((link, index) => (
                    <img
                      key={index}
                      src={link}
                      alt={link}
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
                <select
                  id="category"
                  value={selectedBanner.banner.banner_type}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                  required
                >
                  {["MainBanner", "CoporateBanner", "FestivalBanner"].map(
                    (Banner, index) => (
                      <option key={index} value={Banner}>
                        {Banner}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm">
                  Upload Image
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    onChange={fileUpload}
                    className="hidden" // Hide default file input
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("fileInput").click()}
                    className="bg-blue-500 text-white px-3 py-2 text-sm rounded cursor-pointer"
                  >
                    Choose File
                  </button>
                </div>

                {selectedBanner &&
                  selectedBanner.banner.imageLinks.length > 0 && (
                    <ul className="list-disc ml-5">
                      {selectedBanner.banner.imageLinks.map((link, index) => {
                        console.log("link", link);
                        return (
                          <li key={index} className="text-blue-500">
                            <div className="flex items-center justify-between w-[350px]">
                              <p className="text-blue-500 w-full truncate">
                                {link}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleRemoveImageLink(index)}
                                className="text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        );
                      })}
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-2 text-sm rounded cursor-pointer"
                >
                  Save
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

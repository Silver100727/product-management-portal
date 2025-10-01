import axios from "axios";
import { ArrowBigLeft, Edit2, Trash2, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const NavTo = useNavigate();
  const [OpenModal, setOpenModal] = useState(false);
  const [categoryList, setcategoryList] = useState([]);
  const [categoryName, setcategoryName] = useState("");
  const [selectedCategory, setselectedCategory] = useState({
    isModelOpen: false,
    category: null,
  });
  const [imageLinks, setimageLinks] = useState("");

  const fileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file, file.name);
    await axios
      .post(
        "https://rsglobalsolutions.in/api/routes.php?action=upload_category_thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setimageLinks(res.data.fileURL.trim());
          event.target.value = "";
        } else {
          event.target.value = "";
        }
      })
      .catch((err) => {
        event.target.value = "";
      });
  };

  const fileUpload2 = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file, file.name);
    await axios
      .post(
        "https://rsglobalsolutions.in/api/routes.php?action=upload_category_thumbnail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setselectedCategory({
            ...selectedCategory,
            category: {
              ...selectedCategory.category,
              thumbnail_image: res.data.fileURL.trim(),
            },
          });

          // setimageLinks(res.data.fileURL.trim());
          event.target.value = "";
        } else {
          event.target.value = "";
        }
      })
      .catch((err) => {
        event.target.value = "";
      });
  };

  const addToDb = () => {
    axios
      .post(
        "https://rsglobalsolutions.in/api/routes.php?action=addcategory",
        {
          category: categoryName,
          thumbnail_image: imageLinks,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          getCategoryFromDb();
          setOpenModal(false);
          setcategoryName(null);
        } else {
          alert("Category already exists.");
        }
      })
      .catch((err) => {});
  };
  const UpdateToDb = () => {
    axios
      .post(
        "https://rsglobalsolutions.in/api/routes.php?action=editcategory",
        {
          id: selectedCategory.category._id,
          category: selectedCategory.category.category,
          thumbnail_image: selectedCategory.category.thumbnail_image,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          getCategoryFromDb();
          setselectedCategory({
            isModelOpen: false,
            category: null,
          });
          alert("Category Updated successfully!");
        } else {
          alert("Category already exists.");
        }
      })
      .catch((err) => {});
  };
  const deleteToDb = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    axios
      .post(
        "https://rsglobalsolutions.in/api/routes.php?action=deletecategory",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          getCategoryFromDb();
        } else {
          alert("Category already exists.");
        }
      })
      .catch((err) => {});
  };
  const getCategoryFromDb = () => {
    axios
      .get("https://rsglobalsolutions.in/api/routes.php?action=getcategory", {})
      .then((res) => {
        if (res.data.success) {
          setcategoryList(res.data.data);
        }
      })
      .catch((err) => {});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    addToDb();
  };
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    UpdateToDb();
  };
  useEffect(() => {
    getCategoryFromDb();
  }, []);

  console.log("selectedCategory", selectedCategory);

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
                  setOpenModal(true);
                }}
              >
                + Category
              </button>
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

        <div className="grid gap-3 p-5 mt-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {categoryList?.map((category) => (
            <div
              key={category._id}
              className="bg-white z-10  rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200 overflow-hidden"
            >
              <div className="flex p-3 items-center justify-between">
                <div className="flex-1">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      {category.category}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="bg-slate-100 px-3 py-1 rounded-full">
                        ID: {category._id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setselectedCategory({
                        isModelOpen: true,
                        category: category,
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    title="Edit Category"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteToDb(category._id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    title="Delete Category"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {OpenModal && (
        <div className="fixed inset-0 bg-gray-800/50 flex  items-center z-40 justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-lg min-w-[40dvw] max-w-[40dvw] max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-4">Add Category</h2>

              <XIcon
                onClick={() => {
                  setOpenModal(false);
                }}
                className="cursor-pointer"
              />
            </div>

            <form className="text-wrap" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm">
                  Category Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Category Title..."
                  value={categoryName}
                  onChange={(e) => {
                    setcategoryName(e.target.value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                  required
                />
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

                {imageLinks && (
                  <div className="flex items-center space-x-2 justify-between mt-2">
                    <p className="text-blue-500 truncate">{imageLinks || ""}</p>
                    <span
                      className="text-red-600"
                      onClick={() => {
                        setimageLinks("");
                      }}
                    >
                      Remove
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
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

      {selectedCategory.isModelOpen && (
        <div className="fixed inset-0 bg-gray-800/50 flex  items-center z-40 justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-lg min-w-[40dvw] max-w-[40dvw] max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold mb-4">Update Category</h2>

              <XIcon
                onClick={() => {
                  setselectedCategory({
                    isModelOpen: false,
                    category: null,
                  });
                }}
                className="cursor-pointer"
              />
            </div>

            <form className="text-wrap" onSubmit={handleSubmit2}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm">
                  Category Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Category Title..."
                  value={selectedCategory.category?.category}
                  onChange={(e) => {
                    setselectedCategory({
                      ...selectedCategory,
                      category: {
                        ...selectedCategory.category,
                        category: e.target.value,
                      },
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                  required
                />
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
                    onChange={fileUpload2}
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

                {selectedCategory.category?.thumbnail_image && (
                  <div className="flex items-center space-x-2 justify-between mt-2">
                    <p className="text-blue-500 truncate">
                      {selectedCategory.category?.thumbnail_image || ""}
                    </p>
                    <span
                      className="text-red-600"
                      onClick={() => {
                        setselectedCategory({
                          ...selectedCategory,
                          category: {
                            ...selectedCategory.category,
                            thumbnail_image: "",
                          },
                        });
                      }}
                    >
                      Remove
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setselectedCategory({
                      isModelOpen: false,
                      category: null,
                    });
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

export default Category;

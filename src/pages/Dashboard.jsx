import axios from "axios";
import { Menu, Trash, UserRoundPen, X, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BaseUrl = "https://rsgratitudegifts.com/api/routes.php?action=addproduct";
const UploadURL =
  "https://rsgratitudegifts.com/api/routes.php?action=upload_image";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  features: [],
  imageLinks: [],
  specification: {},
  isLive: false,
  isTrending: false,
};

const Dashboard = () => {
  const NavTo = useNavigate();
  const [groupedProducts, setgroupedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [imageLinkInput, setImageLinkInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [specKeyInput, setSpecKeyInput] = useState("");
  const [specValueInput, setSpecValueInput] = useState("");

  const [MainCategory, setMainCategory] = useState([]);
  const [SubCategory, SubMainCategory] = useState([]);

  // State for toggling header content on mobile
  const [showHeaderContent, setShowHeaderContent] = useState(false);

  // Open the modal to add or edit a product.
  const openModal = (product) => {
    console.log("hello", product);
    setIsModalOpen(true);
    if (product) {
      setFormData(product);
      getsubCategoryFromDb(product.category);
    } else {
      setFormData(initialFormData);
      setEditIndex(product._id);
    }
    setImageLinkInput("");
    setFeatureInput("");
    setSpecKeyInput("");
    setSpecValueInput("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditIndex(null);
  };

  // Handle text input changes.
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRemoveImageLink = (index) => {
    setFormData({
      ...formData,
      imageLinks: formData.imageLinks.filter((_, i) => i !== index),
    });
  };

  // FEATURES
  const handleAddFeature = () => {
    if (featureInput.trim() === "") return;
    setFormData({
      ...formData,
      features: [...formData.features, featureInput.trim()],
    });
    setFeatureInput("");
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  // SPECIFICATIONS
  const handleAddSpecification = () => {
    if (specKeyInput.trim() === "" || specValueInput.trim() === "") return;
    setFormData({
      ...formData,
      specification: {
        ...formData.specification,
        [specKeyInput.trim()]: specValueInput.trim(),
      },
    });
    setSpecKeyInput("");
    setSpecValueInput("");
  };

  const handleRemoveSpecification = (keyToRemove) => {
    const newSpecs = { ...formData.specification };
    delete newSpecs[keyToRemove];
    setFormData({
      ...formData,
      specification: newSpecs,
    });
  };

  // Form submission for add/edit.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex == null) {
      addProdutToDb();
    } else {
      UpdateProdutToDb();
    }
    closeModal();
  };
  const addProdutToDb = () => {
    axios
      .post(
        BaseUrl,
        {
          type: "add",
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          description: formData.description,
          features: formData.features,
          specification: formData.specification,
          price: formData.price,
          imageLinks: formData.imageLinks,
          isLive: false,
          isTrending: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        alert("Product added successfully!");
        fetchProdutFromDb();
      })
      .catch((err) => {});
  };
  const UpdateProdutToDb = () => {
    axios
      .post(
        BaseUrl,
        {
          type: "update",
          id: formData._id,
          title: formData.title,
          category: formData.category,
          subcategory: formData.subcategory,
          description: formData.description,
          features: formData.features,
          specification: formData.specification,
          price: formData.price,
          imageLinks: formData.imageLinks,
          isLive: true,
          isTrending: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        fetchProdutFromDb();
      })
      .catch((err) => {});
  };
  const fetchProdutFromDb = () => {
    axios
      .post(
        BaseUrl,
        {
          type: "get",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          const products = res.data.data;
          const groupedProducts = products.reduce((acc, product) => {
            if (!acc[product.subcategory]) {
              acc[product.subcategory] = [];
            }
            acc[product.subcategory].push(product);
            return acc;
          }, {});

          console.log("groupedProducts", groupedProducts);
          setgroupedProducts(groupedProducts);
        }
      })
      .catch((err) => {});
  };
  const DeleteProdutFromDb = (id) => {
    // Show confirmation dialog before proceeding
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    axios
      .post(
        BaseUrl,
        {
          type: "delete",
          id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        fetchProdutFromDb();
      })
      .catch((err) => {});
  };
  const makeProductLiveorUnliveProdutToDb = (p) => {
    axios
      .post(
        BaseUrl,
        {
          type: "update",
          id: p._id,
          title: p.title,
          category: p.category,
          description: p.description,
          features: p.features,
          specification: p.specification,
          price: p.price,
          imageLinks: p.imageLinks,
          isLive: p.isLive,
          subcategory: p.subcategory,
          isTrending: p.isTrending,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        fetchProdutFromDb();
      })
      .catch((err) => {});
  };
  const fileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file, file.name);
    await axios
      .post(
        "https://rsgratitudegifts.com/api/routes.php?action=upload_image",
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
          setFormData((prevData) => ({
            ...prevData,
            imageLinks: [
              ...(prevData.imageLinks || []),
              res.data.fileURL.trim(),
            ],
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
  const getCategoryFromDb = () => {
    axios
      .get("https://rsgratitudegifts.com/api/routes.php?action=getcategory", {})
      .then((res) => {
        if (res.data.success) {
          setMainCategory(res.data.data);
        } else {
          setMainCategory([]);
        }
      })
      .catch((err) => {});
  };
  const getsubCategoryFromDb = (name) => {
    axios
      .post(
        "https://rsgratitudegifts.com/api/routes.php?action=getsubcategorybycategory",
        {
          category_id: MainCategory.find((c) => c.category == name)?._id || "",
        }
      )
      .then((res) => {
        if (res.data.success) {
          SubMainCategory(res.data.data);
        } else {
          SubMainCategory([]);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchProdutFromDb();
    getCategoryFromDb();
  }, []);


  return (
    <>
      {localStorage.getItem("signIn") === "true" && (
        <div className="relative h-screen bg-slate-950 ">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="h-full w-full absolute overflow-y-auto scroll-smooth">
            <header className=" bg-white sticky top-0 p-4 shadow-md z-20">
              <div className="flex items-center justify-between">
                {/* Always visible title */}
                <h1 className="text-xl font-bold text-black">
                  Product Management System
                </h1>

                {/* Search input and add button shown on big screens (sm and up) */}
                <div className="hidden sm:flex items-center space-x-0.5">
                  <input
                    type="text"
                    placeholder="Search Products..."
                    className="flex-1 text-gray-500 p-2 px-4 border h-7 text-xs border-gray-300 rounded focus:outline-none focus:ring-0"
                    onChange={(e) =>
                      setSearchTerm(e.target.value.toLowerCase())
                    }
                  />

                  <button
                    className="bg-blue-500 text-white px-5 rounded text-xs h-7 cursor-pointer"
                    onClick={() => {
                      openModal(null);
                    }}
                  >
                    Add Product
                  </button>

                  <button
                    className="bg-blue-500 text-white px-5 rounded text-xs h-7 cursor-pointer"
                    onClick={() => {
                      NavTo("/BannerImage");
                    }}
                  >
                    Banner Image
                  </button>

                  <button
                    className="bg-blue-500 text-white px-5 rounded text-xs h-7 cursor-pointer"
                    onClick={() => {
                      NavTo("/Category");
                    }}
                  >
                    Add Category
                  </button>

                  <button
                    className="bg-blue-500 text-white px-5 rounded text-xs h-7 cursor-pointer"
                    onClick={() => {
                      NavTo("/SubCategory");
                    }}
                  >
                    SubCategory
                  </button>
                </div>

                {/* Toggle button visible only on mobile */}
                <button
                  className="sm:hidden text-blue-500 focus:outline-none"
                  onClick={() => setShowHeaderContent(!showHeaderContent)}
                >
                  {showHeaderContent ? <X /> : <Menu />}
                </button>
              </div>

              {/* On mobile: Show search input and add button when toggle is active */}
              {showHeaderContent && (
                <div className="mt-4 flex flex-col items-center space-y-4 sm:hidden">
                  <input
                    type="text"
                    placeholder="Search Products..."
                    className="w-full text-gray-500 p-2 px-4 border text-sm border-gray-300 rounded focus:outline-none focus:ring-0"
                    onChange={(e) =>
                      setSearchTerm(e.target.value.toLowerCase())
                    }
                  />
                  <button
                    className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm cursor-pointer"
                    onClick={() => {
                      openModal(null);
                    }}
                  >
                    Add Product
                  </button>
                </div>
              )}
            </header>

            {/* Product List (Responsive Grid: 1 col on mobile, more on larger screens) */}
            {Object.entries(groupedProducts).map(([category], index) => (
              <div key={category} className="border p-4 rounded-lg shadow">
                <h3 className="text-2xl mb-5 font-semibold text-white">
                  {index + 1} . {category} :
                </h3>

                <div className="grid gap-y-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                  {groupedProducts[category]
                    .filter(
                      (product) =>
                        product.title.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm)
                    )
                    .map((product) => (
                      <div
                        className="min-w-[300px] max-w-[300px] max-sm:min-w-[350px] max-sm:max-w-[350px] h-96 mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col z-10"
                        key={product._id}
                      >
                        <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
                          <h1 className="text-xs font-bold capitalize">
                            {product.title}
                          </h1>
                          <div className="flex space-x-2">
                            <button
                              className="DeleteButton"
                              onClick={() => DeleteProdutFromDb(product._id)}
                            >
                              <Trash size={10} />
                            </button>
                            <button
                              className="EditButton"
                              onClick={() => openModal(product)}
                            >
                              <UserRoundPen size={10} />
                            </button>
                          </div>
                        </div>
                        <div className="px-4 py-3 overflow-y-auto flex-1">
                          <p className="text-gray-700 text-xs mb-2">
                            <strong>Category:</strong> {product.category}
                          </p>
                          <p className="text-gray-700 text-xs mb-4">
                            <strong>Description:</strong> {product.description}
                          </p>
                          <div className="mb-4">
                            <p className="font-bold mb-2 text-xs">
                              Product Features:
                            </p>
                            <ul className="list-disc list-inside text-xs">
                              {product.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="mb-4">
                            <p className="font-bold mb-2 text-xs">
                              Product Specifications:
                            </p>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {Object.entries(product.specification).map(
                                ([specKey, specValue], index) => (
                                  <React.Fragment key={index}>
                                    <div className="font-semibold">
                                      {specKey}
                                    </div>
                                    <div>{specValue}</div>
                                  </React.Fragment>
                                )
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 text-xs mb-4">
                            <strong>Price:</strong> {product.price}
                          </p>
                          <div className="mb-4">
                            <p className="font-bold mb-2 text-xs">
                              Image Gallery:
                            </p>
                            <div className="flex space-x-2 overflow-x-auto">
                              {product.imageLinks.map((link, index) => (
                                <img
                                  key={index}
                                  src={link}
                                  alt={`${product.title} image ${index + 1}`}
                                  className="object-cover w-16 h-16 rounded"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-100 flex gap-2 px-4 py-3">
                          <button
                            className="bg-green-600 hover:bg-green-400 text-white font-bold py-1 px-4 rounded-full text-xs cursor-pointer w-full"
                            onClick={() =>
                              makeProductLiveorUnliveProdutToDb({
                                ...product,
                                isLive: !product.isLive,
                              })
                            }
                          >
                            {product.isLive ? "UNLIVE" : "LIVE"}
                          </button>

                          <button
                            className="bg-green-600 hover:bg-green-400 text-white font-bold py-1 px-4 rounded-full text-xs cursor-pointer w-full"
                            onClick={() =>
                              makeProductLiveorUnliveProdutToDb({
                                ...product,
                                isTrending: !product.isTrending,
                              })
                            }
                          >
                            {product.isTrending
                              ? "Trending"
                              : "Not in Trending"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            {/* Modal for Add/Edit Product */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-800/50 flex  items-center z-40 justify-center overflow-y-auto">
                <div className="bg-white p-6 rounded-lg min-w-[40dvw] max-w-[40dvw] max-h-[90dvh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold mb-4">
                      {editIndex == null ? "Add Product" : "Edit Product"}
                    </h2>
                    <XIcon onClick={closeModal} className="cursor-pointer" />
                  </div>

                  <form className="text-wrap" onSubmit={handleSubmit}>
                    {/* Product Title */}
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-gray-700 text-sm"
                      >
                        Product Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        placeholder="Product Title..."
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <label
                        htmlFor="category"
                        className="block text-gray-700 text-sm"
                      >
                        Main Category
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => {
                          handleInputChange(e);
                          getsubCategoryFromDb(e.target.value);
                        }}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                        required
                      >
                        <option value="">Select a Main category...</option>
                        {MainCategory.map((category, index) => (
                          <option key={index} value={category.category}>
                            {category.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <label
                        htmlFor="subcategory"
                        className="block text-gray-700 text-sm"
                      >
                        Sub Category
                      </label>
                      <select
                        id="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                        required
                      >
                        <option value="">Select a Sub category...</option>
                        {SubCategory.map((subCat, index) => (
                          <option key={index} value={subCat.subcategory}>
                            {subCat.subcategory}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-gray-700 text-sm"
                      >
                        Product Description
                      </label>
                      <textarea
                        id="description"
                        placeholder="Product Description..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full h-[100px] p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                        required
                      />
                    </div>
                    {/* Features */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm">
                        Product Features
                      </label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          placeholder="Enter feature..."
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                        />
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="bg-green-500 text-white px-2 py-2 rounded ml-2 text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      {formData.features && formData.features.length > 0 && (
                        <ul className="list-disc ml-5">
                          {formData.features.map((feat, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span>{feat}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(index)}
                                className="text-red-500 text-sm"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {/* Specifications */}
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm">
                        Product Specification
                      </label>
                      <div className="flex mb-2 space-x-2">
                        <input
                          type="text"
                          value={specKeyInput}
                          onChange={(e) => setSpecKeyInput(e.target.value)}
                          placeholder="Specification name..."
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                        />
                        <input
                          type="text"
                          value={specValueInput}
                          onChange={(e) => setSpecValueInput(e.target.value)}
                          placeholder="Specification value..."
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                        />
                        <button
                          type="button"
                          onClick={handleAddSpecification}
                          className="bg-green-500 text-white px-2 py-2 rounded text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      {Object.keys(formData.specification).length > 0 && (
                        <ul className="list-disc ml-5">
                          {Object.entries(formData.specification).map(
                            ([key, value]) => (
                              <li
                                key={key}
                                className="flex items-center justify-between text-sm"
                              >
                                <span>
                                  {key}: {value}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecification(key)}
                                  className="text-red-500 text-sm"
                                >
                                  Remove
                                </button>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                    {/* Price */}
                    <div className="mb-4">
                      <label
                        htmlFor="price"
                        className="block text-gray-700 text-sm"
                      >
                        Product Price
                      </label>
                      <input
                        type="text"
                        id="price"
                        placeholder="Price..."
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-0"
                        required
                      />
                    </div>
                    {/* Image Links */}

                    {/* Image Upload */}
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
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                          className="bg-blue-500 text-white px-3 py-2 text-sm rounded cursor-pointer"
                        >
                          Choose File
                        </button>
                      </div>

                      {formData.imageLinks &&
                        formData.imageLinks.length > 0 && (
                          <ul className="list-disc ml-5">
                            {formData.imageLinks.map((link, index) => (
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
                            ))}
                          </ul>
                        )}
                    </div>

                    {/* Modal Buttons */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-500 text-white px-3 py-2 text-sm rounded mr-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-3 py-2 text-sm rounded cursor-pointer"
                      >
                        {editIndex == null ? "Save" : "Update"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Dashboard;

import axios from "axios";
import React, { useEffect, useState } from "react";

const BaseUrl = "https://api.rsgratitudegifts.com/api/addproduct";
const initialFormData = {
  title: "",
  description: "",
  category: "", // Added product type field
  price: "",
  features: [],
  imageLinks: [],
  specification: {}, // Kept as an object
  isLive: false,
};

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [imageLinkInput, setImageLinkInput] = useState("");
  // States for handling new feature input and new specification key/value inputs.
  const [featureInput, setFeatureInput] = useState("");
  const [specKeyInput, setSpecKeyInput] = useState("");
  const [specValueInput, setSpecValueInput] = useState("");

  // Open the modal to add or edit a product.
  const openModal = (id) => {
    setIsModalOpen(true);
    setEditIndex(id);
    if (id) {
      products.find((item) => item._id == id);
      setFormData(products.find((item) => item._id == id));
    } else {
      setFormData(initialFormData);
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

  // For text inputs (title, type, description, price).
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // IMAGE LINKS
  const handleImageLinkInputChange = (e) => {
    setImageLinkInput(e.target.value);
  };

  const handleAddImageLink = () => {
    if (imageLinkInput.trim() === "") return;
    setFormData({
      ...formData,
      imageLinks: [...formData.imageLinks, imageLinkInput.trim()],
    });
    setImageLinkInput("");
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

  // SPECIFICATIONS - Modified for object state.
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

  // Handle product add/edit form submission.
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
          type: "add", //add - update - delete - get
          title: formData.title,
          category: formData.category,
          description: formData.description,
          features: formData.features,
          specification: formData.specification,
          price: formData.price,
          imageLinks: formData.imageLinks,
          isLive: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            tenantId: localStorage.getItem("TenantId"),
          },
        }
      )
      .then((res) => {
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
          description: formData.description,
          features: formData.features,
          specification: formData.specification,
          price: formData.price,
          imageLinks: formData.imageLinks,
          isLive: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
            tenantId: localStorage.getItem("TenantId"),
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
          type: "get", //add - update - delete - get
        },
        {
          headers: {
            "Content-Type": "application/json",
            tenantId: localStorage.getItem("TenantId"),
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => {});
  };
  const DeleteProdutFromDb = (id) => {
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
            tenantId: localStorage.getItem("TenantId"),
          },
        }
      )
      .then((res) => {
        setProducts(products.filter((product) => product._id !== id));
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
        },
        {
          headers: {
            "Content-Type": "application/json",
            tenantId: localStorage.getItem("TenantId"),
          },
        }
      )
      .then((res) => {
        fetchProdutFromDb();
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchProdutFromDb();
  }, []);

  return (
    <>
      {localStorage.getItem("signIn") == "true" && (
        <div className="container mx-auto">
          {/* Header */}
          <header className="flex items-center bg-white py-4 px-4  space-x-4">
            <h1 className="text-2xl font-bold text-black whitespace-nowrap">
              Product Management System
            </h1>

            <input
              type="text"
              placeholder="Search Products..."
              className="flex-1 text-gray-500 p-2 px-4 border text-sm border-gray-300 rounded focus:outline-none focus:ring-0"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />

            <button
              className="bg-blue-500 text-white px-3 py-2 rounded text-sm cursor-pointer"
              onClick={() => openModal()}
            >
              Add Product
            </button>
          </header>

          {/* Search Input */}

          {/* Product List */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {products
              .filter(
                (product) =>
                  product.title.toLowerCase().includes(searchTerm) ||
                  product.description.toLowerCase().includes(searchTerm)
              )
              .map((product) => (
                <div
                  className="max-w-auto h-96 mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                  key={product._id}
                >
                  {/* Card Header (Static) */}
                  <div className="bg-blue-500 text-white px-4 py-3 flex space-x-13">
                    <h1 className="text-lg font-bold capitalize">          
                      {product.title}
                    </h1>

                    <div className="flex space-x-2">
                      <button
                        className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-4 rounded text-sm cursor-pointer"
                        onClick={() => {
                          DeleteProdutFromDb(product._id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="flex-1 bg-gray-700 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded text-sm cursor-pointer"
                        onClick={() => {
                          openModal(product._id);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Card Body */}
                  <div className="px-4 py-3 overflow-y-auto flex-1">
                    {/* Category */}
                    <p className="text-gray-700 text-sm mb-2">
                      <strong>Category:</strong> {product.category}
                    </p>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Description:</strong> {product.description}
                    </p>

                    {/* Product Features */}
                    <div className="mb-4">
                      <p className="font-bold mb-2 text-sm">
                        Product Features:
                      </p>
                      <ul className="list-disc list-inside text-xs">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Product Specifications */}
                    <div className="mb-4">
                      <p className="font-bold mb-2 text-sm">
                        Product Specifications:
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {Object.entries(product.specification).map(
                          ([specKey, specValue], index) => (
                            <React.Fragment key={index}>
                              <div className="font-semibold">{specKey}</div>
                              <div>{specValue}</div>
                            </React.Fragment>
                          )
                        )}
                      </div>
                    </div>

                    {/* Product Price */}
                    <p className="text-gray-700 text-sm mb-4">
                      <strong>Price:</strong> {product.price}
                    </p>

                    {/* Image Gallery with Horizontal Scroll */}
                    <div className="mb-4">
                      <p className="font-bold mb-2 text-sm">Image Gallery:</p>
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

                  {/* Card Footer (Static) */}
                  <div className="bg-gray-100 px-4 py-3 flex space-x-4">
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-400 text-white font-bold py-1 px-4 rounded text-sm cursor-pointer"
                      onClick={() => {
                        if (product.isLive == true) {
                          makeProductLiveorUnliveProdutToDb({
                            ...product,
                            isLive: false,
                          });
                        } else {
                          makeProductLiveorUnliveProdutToDb({
                            ...product,
                            isLive: true,
                          });
                        }
                      }}
                    >
                      {product.isLive == true ? "UnLive" : "Live"}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Modal for Add/Edit */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center overflow-y-auto">
              <div className="bg-white p-6 rounded-lg max-w-[90vw] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editIndex == null ? "Add Product" : " Edit Product"}
                </h2>
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

                  {/* Product Type */}
                  <div className="mb-4">
                    <label
                      htmlFor="type"
                      className="block text-gray-700 text-sm"
                    >
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      placeholder="Category..."
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                      required
                    />
                  </div>

                  {/* Product Description */}
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-gray-700 text-sm "
                    >
                      Product Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Product Description..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
                      required
                    />
                  </div>

                  {/* Product Features as List */}
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

                  {/* Product Specification as Object */}
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

                    {/* Display specifications from object */}
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

                  {/* Product Price */}
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

                  {/* Multiple Image Links */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm">
                      Image Links
                    </label>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={imageLinkInput}
                        onChange={handleImageLinkInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-0"
                        placeholder="Enter image URL..."
                      />
                      <button
                        type="button"
                        onClick={handleAddImageLink}
                        className="bg-green-500 text-white text-sm px-2 py-2 rounded ml-2 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Image Preview */}
                    {imageLinkInput && (
                      <div className="mb-4">
                        <p className="text-gray-700 mb-2">Image Preview:</p>
                        <img
                          src={imageLinkInput}
                          alt="Preview"
                          className="max-h-40 object-contain border p-1"
                          onError={(e) => {
                            // Optionally, handle image load errors (e.g., reset preview)
                            e.target.src = "";
                          }}
                        />
                      </div>
                    )}

                    {formData.imageLinks && formData.imageLinks.length > 0 && (
                      <ul className="list-disc ml-5">
                        {formData.imageLinks.map((link, index) => (
                          <li key={index} className="text-blue-500">
                            <div className="flex items-center justify-between w-50">
                              <p className="text-blue-500 text-wrap">{link}</p>
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
      )}
    </>
  );
};

export default Dashboard;

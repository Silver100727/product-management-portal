

{/* Product List (Responsive Grid: 1 col on mobile, more on larger screens) */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
{products
  .filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  )
  .map((product) => (
    <div
      className="min-w-[300px] max-w-[300px] h-96 mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
      key={product._id}
    >
      {/* Card Header */}
      <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold capitalize">
          {product.title}
        </h1>
        <div className="flex space-x-2">
          <button
            className="DeleteButton"
            onClick={() => DeleteProdutFromDb(product._id)}
          >
            <Trash size={15} />
          </button>
          <button
            className="EditButton"
            onClick={() => openModal(product._id)}
          >
            <UserRoundPen size={15} />
          </button>
        </div>
      </div>
      {/* Card Body */}
      <div className="px-4 py-3 overflow-y-auto flex-1">
        <p className="text-gray-700 text-sm mb-2">
          <strong>Category:</strong> {product.category}
        </p>
        <p className="text-gray-700 text-sm mb-4">
          <strong>Description:</strong> {product.description}
        </p>
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
        <p className="text-gray-700 text-sm mb-4">
          <strong>Price:</strong> {product.price}
        </p>
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
      {/* Card Footer */}
      <div className="bg-gray-100 px-4 py-3">
        <button
          className="bg-green-600 hover:bg-green-400 text-white font-bold py-1 px-4 rounded-full text-sm cursor-pointer w-full"
          onClick={() =>
            makeProductLiveorUnliveProdutToDb({
              ...product,
              isLive: !product.isLive,
            })
          }
        >
          {product.isLive ? "UNLIVE" : "LIVE"}
        </button>
      </div>
    </div>
  ))}
</div>

{/* Modal for Add/Edit Product */}
{isModalOpen && (
<div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center overflow-y-auto">
  <div className="bg-white p-6 rounded-lg max-w-[90vw] max-h-[90vh] overflow-y-auto">
    <h2 className="text-xl font-bold mb-4">
      {editIndex == null ? "Add Product" : "Edit Product"}
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
      {/* Category */}
      {/* Category */}
      <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-gray-700 text-sm"
        >
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
          required
        >
          <option value="">Select a category...</option>
          <option value="T-shirt">T-shirt</option>
          <option value="Shirt">Shirt</option>
          <option value="Phone">Phone</option>
          <option value="Pants">Pants</option>
          <option value="Jeans">Jeans</option>
          {/* Add more options as needed */}
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
          className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-0"
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
        {imageLinkInput && (
          <div className="mb-4">
            <p className="text-gray-700 mb-2">Image Preview:</p>
            <img
              src={imageLinkInput}
              alt="Preview"
              className="max-h-40 object-contain border p-1"
              onError={(e) => {
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
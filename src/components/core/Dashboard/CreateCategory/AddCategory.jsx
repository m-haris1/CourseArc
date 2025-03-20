import React, { useEffect, useState } from 'react';
import { apiConnector } from '../../../../services/apiConnector';
import { categories } from '../../../../services/apis.js';
import authSlice from '../../../../slices/authSlice';

const AddCategory = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDes, setNewDes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await apiConnector("GET", categories.CATEGORIES_API);
        const data = response.data.data;
        if (data.length === 0) setError("No categories found.");
        else {
          setAllCategory(data);
        }
      } catch (err) {
        setError("Failed to fetch categories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiConnector("POST", categories.POST_CATEGORY_API, {
        name: newCategory,
        description: newDes,
        token: JSON.parse(localStorage.getItem("token")),
      });

      const data = response.data.data;
      // console.log(data);
    } catch (err) {
      setError("Failed to add category.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-richblack-800 text-white shadow-lg rounded-lg">
      {/* Display loading or error messages */}
      {loading && <p className="text-yellow-500 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Display all categories */}
      <div className="space-y-4 mb-8">
        {allCategory.map((category, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-md">
            <h1 className="text-2xl text-teal-600 font-semibold">{category.name}</h1>
            <p className="text-teal-500">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Add Category Section */}
      <div className="space-y-4">
        <p className="text-xl font-semibold text-gray-700">Add New Category</p>

        {/* Category Name Input */}
        <input
          type="text"
          id="category"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        {/* Category Description Input */}
        <input
          type="text"
          id="description"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
          placeholder="Enter category description"
          value={newDes}
          onChange={(e) => setNewDes(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full p-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </div>
    </div>
  );
};

export default AddCategory;

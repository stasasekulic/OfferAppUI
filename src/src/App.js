import React, { useState, useEffect } from 'react';
import { Star, Settings, Plus, Edit2, Trash2, Save, X, FileText } from 'lucide-react';

const OfferAdminApp = () =>
{
  const [activeTab, setActiveTab] = useState('offers');
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' or 'edit'
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [showPdfMenu, setShowPdfMenu] = useState(null);

  // Mock API base URL - replace with your actual API URL
  const API_BASE = 'http://localhost:8080/api';

  // Fetch data functions
  const fetchOffers = async () =>
  {
    setLoading(true);
    try
    {
      // Mock data - replace with actual API call
      const mockOffers = [
        {
          id: 1,
          title: 'Summer Sale Offer',
          userId: 1,
          userEmail: 'john@example.com',
          status: 'ACTIVE',
          products: [
            { description: 'Laptop', price: 1200, type: 'ELECTRONICS', picture: 'laptop.jpg' },
            { description: 'Mouse', price: 25, type: 'ACCESSORIES', picture: 'mouse.jpg' }
          ]
        },
        {
          id: 2,
          title: 'Winter Collection',
          userId: 2,
          userEmail: 'jane@example.com',
          status: 'PENDING',
          products: [
            { description: 'Winter Jacket', price: 150, type: 'CLOTHING', picture: 'jacket.jpg' }
          ]
        }
      ];
      setOffers(mockOffers);
    } catch (error)
    {
      console.error('Error fetching offers:', error);
    } finally
    {
      setLoading(false);
    }
  };

  const fetchProducts = async () =>
  {
    setLoading(true);
    try
    {
      // Mock data - replace with actual API call
      const mockProducts = [
        { id: 1, description: 'Laptop', price: 1200, type: 'ELECTRONICS', picture: 'laptop.jpg' },
        { id: 2, description: 'Mouse', price: 25, type: 'ACCESSORIES', picture: 'mouse.jpg' },
        { id: 3, description: 'Winter Jacket', price: 150, type: 'CLOTHING', picture: 'jacket.jpg' },
        { id: 4, description: 'Smartphone', price: 800, type: 'ELECTRONICS', picture: 'phone.jpg' }
      ];
      setProducts(mockProducts);
    } catch (error)
    {
      console.error('Error fetching products:', error);
    } finally
    {
      setLoading(false);
    }
  };

  const fetchUsers = async () =>
  {
    setLoading(true);
    try
    {
      // Mock data - replace with actual API call
      const mockUsers = [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          role: 'ADMIN',
          offers: []
        },
        {
          id: 2,
          name: 'Jane',
          surname: 'Smith',
          email: 'jane@example.com',
          phoneNumber: '+0987654321',
          role: 'USER',
          offers: []
        }
      ];
      setUsers(mockUsers);
    } catch (error)
    {
      console.error('Error fetching users:', error);
    } finally
    {
      setLoading(false);
    }
  };

  // Effect to fetch data when tab changes
  useEffect(() =>
  {
    switch (activeTab)
    {
      case 'offers':
        fetchOffers();
        break;
      case 'products':
        fetchProducts();
        break;
      case 'users':
        fetchUsers();
        break;
      default:
        break;
    }
  }, [activeTab]);

  // Modal functions
  const openAddModal = (type) =>
  {
    setModalType('add');
    setCurrentItem(null);
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (item, type) =>
  {
    setModalType('edit');
    setCurrentItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const closeModal = () =>
  {
    setShowModal(false);
    setCurrentItem(null);
    setFormData({});
  };

  const handleDelete = async (id, type) =>
  {
    if (window.confirm('Are you sure you want to delete this item?'))
    {
      try
      {
        // Mock delete - replace with actual API call
        console.log(`Deleting ${type} with id: ${id}`);

        // Refresh data after delete
        switch (type)
        {
          case 'offer':
            setOffers(offers.filter(offer => offer.id !== id));
            break;
          case 'product':
            setProducts(products.filter(product => product.id !== id));
            break;
          case 'user':
            setUsers(users.filter(user => user.id !== id));
            break;
        }
      } catch (error)
      {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const handleSubmit = async () =>
  {
    try
    {
      // Mock submit - replace with actual API call
      console.log(`${modalType === 'add' ? 'Creating' : 'Updating'} ${activeTab}:`, formData);

      // Refresh data after submit
      switch (activeTab)
      {
        case 'offers':
          fetchOffers();
          break;
        case 'products':
          fetchProducts();
          break;
        case 'users':
          fetchUsers();
          break;
      }

      closeModal();
    } catch (error)
    {
      console.error(`Error ${modalType === 'add' ? 'creating' : 'updating'} ${activeTab}:`, error);
    }
  };

  // PDF Generation functions
  const generatePDF = async (offerId, pdfType) =>
  {
    try
    {
      console.log(`Generating ${pdfType} PDF for offer ${offerId}`);

      // API call to generate PDF
      const response = await fetch(`${API_BASE}/offers/${offerId}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: pdfType })
      });

      if (response.ok)
      {
        // Handle successful PDF generation
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pdfType}_offer_${offerId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else
      {
        console.error('Failed to generate PDF');
        alert('Failed to generate PDF');
      }
    } catch (error)
    {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF');
    }

    setShowPdfMenu(null);
  };

  // Render functions
  const renderOffers = () => (
    <div className="space-y-4">
      {offers.map(offer => (
        <div key={offer.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{offer.title}</h3>
              <p className="text-sm text-gray-600">User: {offer.userEmail}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${offer.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                {offer.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) =>
                {
                  e.stopPropagation();
                  setShowPdfMenu(showPdfMenu === offer.id ? null : offer.id);
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg relative"
                title="Generate PDF"
              >
                <FileText size={16} />
                {showPdfMenu === offer.id && (
                  <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                    <button
                      onClick={() => generatePDF(offer.id, 'invoice')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg"
                    >
                      Generate Invoice PDF
                    </button>
                    <button
                      onClick={() => generatePDF(offer.id, 'report')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Generate Report PDF
                    </button>
                    <button
                      onClick={() => generatePDF(offer.id, 'summary')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg"
                    >
                      Generate Summary PDF
                    </button>
                  </div>
                )}
              </button>
              <button
                onClick={() => openEditModal(offer, 'offer')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(offer.id, 'offer')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Products:</h4>
            <ul className="space-y-2">
              {offer.products.map((product, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.description}</p>
                    <p className="text-sm text-gray-600">{product.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${product.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{product.description}</h3>
              <p className="text-xl font-bold text-green-600">${product.price}</p>
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {product.type}
              </span>
              {product.picture && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Image: {product.picture}</p>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditModal(product, 'product')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(product.id, 'product')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user.name} {user.surname}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">{user.phoneNumber}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {user.role}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditModal(user, 'user')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(user.id, 'user')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderModal = () =>
  {
    if (!showModal) return null;

    const getFormFields = () =>
    {
      switch (activeTab)
      {
        case 'offers':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <input
                  type="number"
                  value={formData.userId || ''}
                  onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          );
        case 'products':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="CLOTHING">Clothing</option>
                  <option value="ACCESSORIES">Accessories</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Picture URL</label>
                <input
                  type="text"
                  value={formData.picture || ''}
                  onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          );
        case 'users':
          return (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
                <input
                  type="text"
                  value={formData.surname || ''}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {modalType === 'add' ? 'Add' : 'Edit'} {activeTab.slice(0, -1).toUpperCase()}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div>
            {getFormFields()}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100" onClick={() => setShowPdfMenu(null)}>
      {/* Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col">
        <div className="h-16 px-6 border-b border-gray-200 flex items-center">
          <div className="flex items-center space-x-3">
            <Star className="text-blue-600" size={32} />
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {['offers', 'products', 'users'].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === tab
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${activeTab === 'settings'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab === 'settings' ? 'Settings' : activeTab}
            </h2>
            {activeTab !== 'settings' && (
              <button
                onClick={() => openAddModal(activeTab)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add {activeTab.slice(0, -1)}</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          ) : (
            <>
              {activeTab === 'offers' && renderOffers()}
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Application Settings</h3>
                  <p className="text-gray-600">Settings panel - customize your application here.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {renderModal()}
    </div>
  );
};

export default OfferAdminApp;
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Vehicle } from '../../types';
import { FiEdit2, FiTrash2, FiPlus, FiAlertCircle, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  type: Vehicle['type'];
  transmission: 'automatic' | 'manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: string;
  location: string;
  ratePerDay: string;
  description: string;
  images: string[];
  features: string[];
  availabilityStatus: Vehicle['availabilityStatus'];
}

const initialFormData: VehicleFormData = {
  make: '',
  model: '',
  year: '',
  type: 'SUV',
  transmission: 'automatic',
  fuelType: 'Petrol',
  seats: '',
  location: '',
  ratePerDay: '',
  description: '',
  images: [''],
  features: [''],
  availabilityStatus: 'available'
};

const VehicleForm = memo(({ 
  formData, 
  onSubmit, 
  onChange, 
  onArrayChange, 
  onAddArray, 
  onRemoveArray, 
  isEdit,
  onClose 
}: {
  formData: VehicleFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onArrayChange: (index: number, value: string, field: 'images' | 'features') => void;
  onAddArray: (field: 'images' | 'features') => void;
  onRemoveArray: (index: number, field: 'images' | 'features') => void;
  isEdit: boolean;
  onClose: () => void;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Make</label>
        <input
          type="text"
          name="make"
          value={formData.make}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select type</option>
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Coupe">Coupe</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
          <option value="Convertible">Convertible</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Transmission</label>
        <select
          name="transmission"
          value={formData.transmission}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select transmission</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
        <select
          name="fuelType"
          value={formData.fuelType}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select fuel type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Seats</label>
        <input
          type="number"
          name="seats"
          value={formData.seats}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Rate per Day ($)</label>
        <input
          type="number"
          name="ratePerDay"
          value={formData.ratePerDay}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Location</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        rows={3}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Images URLs</label>
      {formData.images.map((url, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="url"
            value={url}
            onChange={(e) => onArrayChange(index, e.target.value, 'images')}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Image URL"
          />
          <button
            type="button"
            onClick={() => onRemoveArray(index, 'images')}
            className="text-red-600 hover:text-red-800"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onAddArray('images')}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        + Add Image URL
      </button>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
      {formData.features.map((feature, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={feature}
            onChange={(e) => onArrayChange(index, e.target.value, 'features')}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Feature"
          />
          <button
            type="button"
            onClick={() => onRemoveArray(index, 'features')}
            className="text-red-600 hover:text-red-800"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onAddArray('features')}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        + Add Feature
      </button>
    </div>

    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        {isEdit ? 'Update Vehicle' : 'Add Vehicle'}
      </button>
    </div>
  </form>
));

VehicleForm.displayName = 'VehicleForm';

const VehicleModal = memo(({ 
  isEdit, 
  formData, 
  onSubmit, 
  onChange, 
  onArrayChange, 
  onAddArray, 
  onRemoveArray,
  onClose 
}: {
  isEdit: boolean;
  formData: VehicleFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onArrayChange: (index: number, value: string, field: 'images' | 'features') => void;
  onAddArray: (field: 'images' | 'features') => void;
  onRemoveArray: (index: number, field: 'images' | 'features') => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <VehicleForm
        formData={formData}
        onSubmit={onSubmit}
        onChange={onChange}
        onArrayChange={onArrayChange}
        onAddArray={onAddArray}
        onRemoveArray={onRemoveArray}
        isEdit={isEdit}
        onClose={onClose}
      />
    </div>
  </div>
));

VehicleModal.displayName = 'VehicleModal';

const ManageVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const vehiclesQuery = query(collection(db, 'vehicles'));
      const querySnapshot = await getDocs(vehiclesQuery);
      const vehiclesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      setVehicles(vehiclesList);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async (vehicleId: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'vehicles', vehicleId));
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
      toast.success('Vehicle deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const handleStatusChange = async (vehicleId: string, newStatus: Vehicle['availabilityStatus']) => {
    try {
      await updateDoc(doc(db, 'vehicles', vehicleId), {
        availabilityStatus: newStatus
      });
      setVehicles(vehicles.map(vehicle =>
        vehicle.id === vehicleId
          ? { ...vehicle, availabilityStatus: newStatus }
          : vehicle
      ));
      toast.success('Vehicle status updated successfully');
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      toast.error('Failed to update vehicle status');
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleArrayInputChange = useCallback((index: number, value: string, field: 'images' | 'features') => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  }, []);

  const addArrayField = useCallback((field: 'images' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  }, []);

  const removeArrayField = useCallback((index: number, field: 'images' | 'features') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setFormData(initialFormData);
    setSelectedVehicle(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const vehicleData: Omit<Vehicle, 'id'> = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        type: formData.type,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        seats: parseInt(formData.seats),
        location: formData.location,
        ratePerDay: parseFloat(formData.ratePerDay),
        description: formData.description,
        images: formData.images.filter(Boolean),
        features: formData.features.filter(Boolean),
        availabilityStatus: formData.availabilityStatus,
        specifications: {
          engine: '',
          horsepower: 0,
          acceleration: '',
          fuelEfficiency: ''
        }
      };

      if (selectedVehicle) {
        await updateDoc(doc(db, 'vehicles', selectedVehicle.id), vehicleData);
        setVehicles(vehicles.map(v => 
          v.id === selectedVehicle.id ? { ...v, ...vehicleData } : v
        ));
        toast.success('Vehicle updated successfully');
      } else {
        const docRef = await addDoc(collection(db, 'vehicles'), vehicleData);
        setVehicles([...vehicles, { id: docRef.id, ...vehicleData }]);
        toast.success('Vehicle added successfully');
      }

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setFormData(initialFormData);
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error(selectedVehicle ? 'Failed to update vehicle' : 'Failed to add vehicle');
    }
  }, [formData, selectedVehicle, vehicles]);

  useEffect(() => {
    if (selectedVehicle && isEditModalOpen) {
      setFormData({
        make: selectedVehicle.make || '',
        model: selectedVehicle.model || '',
        year: selectedVehicle.year?.toString() || '',
        type: selectedVehicle.type || 'SUV',
        transmission: selectedVehicle.transmission || 'automatic',
        fuelType: selectedVehicle.fuelType || 'Petrol',
        seats: selectedVehicle.seats?.toString() || '',
        location: selectedVehicle.location || '',
        ratePerDay: selectedVehicle.ratePerDay?.toString() || '',
        description: selectedVehicle.description || '',
        images: selectedVehicle.images?.length ? selectedVehicle.images : [''],
        features: selectedVehicle.features?.length ? selectedVehicle.features : [''],
        availabilityStatus: selectedVehicle.availabilityStatus || 'available'
      });
    }
  }, [selectedVehicle, isEditModalOpen]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Vehicles</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Add Vehicle
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate/Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        src={vehicle.images?.[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.year}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={vehicle.availabilityStatus}
                    onChange={(e) => handleStatusChange(vehicle.id, e.target.value as Vehicle['availabilityStatus'])}
                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="rented">Rented</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${vehicle.ratePerDay}/day
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vehicle.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <VehicleModal
          isEdit={false}
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onArrayChange={handleArrayInputChange}
          onAddArray={addArrayField}
          onRemoveArray={removeArrayField}
          onClose={handleCloseModal}
        />
      )}

      {/* Edit Vehicle Modal */}
      {isEditModalOpen && (
        <VehicleModal
          isEdit={true}
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleInputChange}
          onArrayChange={handleArrayInputChange}
          onAddArray={addArrayField}
          onRemoveArray={removeArrayField}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default memo(ManageVehiclesPage);
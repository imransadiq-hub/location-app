import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { locationAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { MapPin, Plus } from 'lucide-react';
import L from 'leaflet';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapPage = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationAPI.getAll();
      setLocations(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await locationAPI.create({
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      });

      // Add new location to state immediately (no page refresh!)
      setLocations([...locations, response.data]);
      
      // Clear form
      setFormData({ name: '', latitude: '', longitude: '' });
      alert('Location added successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <MapPin className="text-blue-600" />
          My Locations
        </h1>

        {/* Add Location Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus size={24} className="text-green-600" />
            Add New Location
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Location Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Location'}
            </button>
          </form>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Map View</h2>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapContainer
              center={[3.139, 101.687]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {locations.map((location) => (
  <Marker
    key={location.id}
    position={[location.latitude, location.longitude]}
  >
    <Popup>
      <div className="text-center">
        <strong className="text-lg block mb-2">{location.name}</strong>
        <div className="text-sm text-gray-600">
          <div>📍 Lat: {location.latitude}</div>
          <div>📍 Lng: {location.longitude}</div>
        </div>
      </div>
    </Popup>
  </Marker>
))}
            </MapContainer>
          </div>
          <p className="text-gray-600 mt-4">
            Total Locations: <strong>{locations.length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
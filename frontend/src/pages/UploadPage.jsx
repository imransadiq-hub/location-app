import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { locationAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Upload, FileUp, CheckCircle, XCircle } from 'lucide-react';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.zip')) {
      setFile(selectedFile);
    } else {
      alert('Please select a ZIP file');
      e.target.value = '';
    }
  };

  const showNotification = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
      if (type === 'success') {
        navigate('/map');
      }
    }, 3000);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await locationAPI.uploadFile(formData);
      showNotification('Locations uploaded successfully!', 'success');
      setFile(null);
    } catch (err) {
      showNotification(
        err.response?.data?.error || 'Upload failed. ZIP must contain exactly one .txt file',
        'error'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <FileUp className="text-purple-600" />
          Upload Locations
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <div className="text-center mb-8">
            <Upload className="mx-auto text-purple-600 mb-4" size={64} />
            <h2 className="text-2xl font-semibold mb-2">Upload ZIP File</h2>
            <p className="text-gray-600">
              Upload a ZIP file containing a single .txt file with location data
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Choose ZIP File
            </label>
            {file && (
              <p className="mt-4 text-gray-700">
                Selected: <strong>{file.name}</strong>
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload Locations'}
          </button>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">File Format:</h3>
            <pre className="text-sm bg-white p-3 rounded border border-blue-200 overflow-x-auto">
{`Name, Latitude, Longitude
Suria KLCC,3.157324409,101.7121981
Zoo Negara,3.21054160,101.75920504`}
            </pre>
          </div>
        </div>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed top-8 right-8 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl ${
              popupType === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {popupType === 'success' ? (
              <CheckCircle size={24} />
            ) : (
              <XCircle size={24} />
            )}
            <span className="font-semibold">{popupMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
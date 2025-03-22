import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FileText, Search, Upload, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { pdfs } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { PDF } from '../types';


const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<PDF[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    onDrop: async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        const response = await pdfs.upload(file);
    
        const uploadedPdf = {
          ...response.data.pdf,
          size: file.size,
          name: file.name,
        };
    
        setFiles((prev) => [uploadedPdf, ...prev]);
        toast.success('PDF uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload PDF');
      }
    },
    // onDrop: async (acceptedFiles) => {
    //   try {
    //     const file = acceptedFiles[0];
    //     const response = await pdfs.upload(file);
    //     setFiles((prev) => [response.data, ...prev]);
    //     toast.success('PDF uploaded successfully!');
    //   } catch (error) {
    //     toast.error('Failed to upload PDF');
    //   }
    // },
  }
  );

  const isValidDate = (dateString: any): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await pdfs.getAll();
        setFiles(response.data);
      } catch (error) {
        toast.error('Failed to fetch PDFs');
      } finally {
        setLoading(false);
      }
    };
    fetchPDFs();
  }, []);


  const handleSearch = async () => {
    console.log('search text', search);
    try {
      setLoading(true);
      const response = await pdfs.search(search); 
      console.log('response of search', response.data);
      setFiles(response.data);
    } catch (error) {
      toast.error('Failed to search PDFs');
    } finally {
      setLoading(false);
    }
  };

  // const handleSearch = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await pdfs.search(encodeURIComponent(search));
  //     setFiles(response.data);
  //   } catch (error) {
  //     toast.error('Failed to search PDFs');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async (id: string) => {
    try {
      await pdfs.delete(id);
      setFiles((prev) => prev.filter((file) => file.id !== id));
      toast.success('PDF deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">PDF Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={() => logout()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search PDFs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`w-full sm:w-auto px-6 py-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-6 w-6 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop your PDF here'
                  : 'Drag & drop a PDF or click to select'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No PDFs</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading a PDF file.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
            {Array.isArray(files) &&
              files.map((file) => (
                <li
                  key={file.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/pdf/${file.id}`}
                      className="flex-1 min-w-0 flex items-center space-x-4"
                    >
                      <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-700 font-medium">{file.originalname}</p>
                        <p className="text-sm text-gray-500">
                          {isValidDate(file.createdAt)
                            ? format(new Date(file.createdAt), 'PPP')
                            : 'Unknown date'}{' '}
                          {/* · {(file.size / 1024 / 1024).toFixed(2)} MB */}
                        </p>
                        {/* <p className="text-sm text-gray-500">
                          {isValidDate(file.createdAt)
                            ? format(new Date(file.createdAt), 'PPP')
                            // : 'Unknown date'}{' '}
                             : 'Unknown date Aloo'}{' '}
                          · {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p> */}
                      </div>
                    </Link>
                    <div className="flex items-center space-x-4">
                      {file.shared && (
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          Shared
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
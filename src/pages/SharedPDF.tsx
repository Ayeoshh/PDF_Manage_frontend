import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { pdfs } from '../lib/api';
import type { PDF } from '../types';

const SharedPDF: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [pdf, setPdf] = useState<PDF | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedPDF = async () => {
      try {
        const response = await pdfs.getShared(token!);
        setPdf(response.data);
      } catch (error) {
        toast.error('Invalid or expired share link');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedPDF();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">PDF not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            This share link may have expired or been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in to view your PDFs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {pdf.name}
              </h1>
            </div>
            <Link
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <iframe
            src={pdf.url}
            className="w-full h-[calc(100vh-12rem)]"
            title={pdf.name}
          />
        </div>
      </main>
    </div>
  );
};

export default SharedPDF;
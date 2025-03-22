import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Share2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { pdfs, comments } from '../lib/api';
import type { PDF, Comment } from '../types';
import ReactMarkdown from 'react-markdown';

const PDFView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState<PDF | null>(null);
  const [pdfComments, setPdfComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const [pdfResponse, commentsResponse] = await Promise.all([
          pdfs.get(id!),
          comments.getAll(id!)
        ]);
        setPdf(pdfResponse.data);
        setPdfComments(commentsResponse.data); 
      } catch (error) {
        toast.error('Failed to load PDF');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchPDF();
  }, [id, navigate]);

  const handleShare = async () => {
    try {
      const response = await pdfs.share(id!); // Calls /share/:id
      console.log("***********", id, "**************")
      const shareid = response.data.shareableLink.id; // Make sure your backend returns this field
      const shareUrl = `${window.location.origin}/pdf/${id}`;
      console.log(response.data);
      console.log(shareid, "**************");
      console.log(shareUrl, "*****&&&&&&&&&&&&&&&&*");
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  // const handleShare = async () => {
  //   try {
  //     const response = await pdfs.share(id!);
  //     const shareUrl = `${window.location.origin}/shared/${response.data.token}`;
  //     await navigator.clipboard.writeText(shareUrl);
  //     toast.success('Share link copied to clipboard!');
  //   } catch (error) {
  //     toast.error('Failed to generate share link');
  //   }
  // };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await comments.create(id!, newComment);
      setPdfComments([response.data, ...pdfComments]);
      setNewComment('');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {pdf?.name}
              </h1>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {pdf?.fileUrl ? (
                <iframe
                    src={`https://pdfmanagebackend-production.up.railway.app${pdf.fileUrl}`}//////////////////////////////////////
                    className="w-full h-[calc(100vh-16rem)]"
                    title={pdf.name}
                  />
                  ) : (
                    <p className="text-center p-4 text-gray-500">PDF preview unavailable</p>
                  )}
              {/* <iframe
                src={pdf?.url}
                className="w-full h-[calc(100vh-16rem)]"
                title={pdf?.name}
              /> */}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Comments</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Post
                  </button>
                </div>
                {pdfComments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No comments yet</p>
                ) : (
                  <div className="space-y-4">
                    {pdfComments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {comment.userName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {/* <ReactMarkdown className="prose prose-sm mt-2 text-gray-700">
                          {comment.content}
                        </ReactMarkdown> */}
                        <div className="prose prose-sm mt-2 text-gray-700">
                          <ReactMarkdown>
                            {comment.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}

                    {/* {pdfComments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">
                              {comment.userName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                      </div>
                    ))} */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PDFView;
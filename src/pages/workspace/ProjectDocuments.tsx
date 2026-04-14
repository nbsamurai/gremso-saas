import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, Calendar, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function ProjectDocuments({ projectId }: { projectId: string }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isWorker = user?.role === 'Worker' || user?.role === 'member';
  const fileBaseUrl = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

  useEffect(() => {
    if (!projectId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    fetchDocuments(projectId);
  }, [projectId]);

  const fetchDocuments = async (
    activeProjectId = projectId,
    options?: { silent?: boolean; preserveLoadingState?: boolean }
  ) => {
    if (!activeProjectId) return;

    if (!options?.preserveLoadingState) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get(`/documents/project/${activeProjectId}`, config);
      setDocuments(res.data);
    } catch (error) {
      if (!options?.silent) {
        toast.error('Failed to load documents');
      }
    } finally {
      if (!options?.preserveLoadingState) {
        setLoading(false);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!projectId) {
      toast.error('Project not found');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('projectId', projectId);

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };
      const response = await api.post('/documents', formData, config);
      if (!response.data?.success) {
        throw new Error('Upload was not confirmed by the server');
      }

      const uploadedDocument = response.data.document;
      if (uploadedDocument) {
        setDocuments((prev) => {
          const withoutDuplicate = prev.filter((doc) => doc._id !== uploadedDocument._id);
          return [uploadedDocument, ...withoutDuplicate];
        });
      }

      toast.success('Document uploaded successfully');

      fetchDocuments(projectId, { silent: true, preserveLoadingState: true });
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // reset
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/documents/${id}`, config);
      toast.success('Document deleted');
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5DED6] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex flex-col gap-4 border-b border-[#E5DED6] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Documents</h2>
          <p className="text-[#6B7280] text-sm mt-1">Manage project drawings, photos, and reports.</p>
        </div>
        {!isWorker && (
          <div>
            <input 
              type="file" 
              id="doc-upload" 
              className="hidden" 
              onChange={handleFileUpload} 
              disabled={isUploading}
            />
            <label 
              htmlFor="doc-upload" 
              className={`flex cursor-pointer items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isUploading ? 'bg-gray-300 text-gray-500' : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'}`}
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
            </label>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-8">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 text-[#6B7280]">
            <FileText className="w-12 h-12 mx-auto text-[#E5DED6] mb-4" />
            No documents uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div key={doc._id} className="border border-[#E5DED6] rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 max-w-[80%]">
                    <div className="bg-[#EFE9E1] p-2 rounded-lg shrink-0">
                      <FileText className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <a 
                      href={doc.fileUrl?.startsWith('http') ? doc.fileUrl : `${fileBaseUrl}${doc.fileUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#1F2937] hover:text-[#2563EB] hover:underline truncate"
                      title={doc.title}
                    >
                      {doc.title}
                    </a>
                  </div>
                  {!isWorker && (
                    <button onClick={() => handleDelete(doc._id)} className="text-[#6B7280] hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-3 h-3" />
                    <span>Uploaded by: {doc.uploadedBy?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Download, FileText, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import UpgradePrompt from '../components/UpgradePrompt';
import { usePlan } from '../context/PlanContext';
import api from '../lib/api';
import { formatStorage, isLimitReached, willExceedLimit } from '../utils/planUtils';
import { isManagerRole } from '../utils/roleUtils';

export default function Documents() {
  const { planSnapshot, refreshPlan } = usePlan();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  const isManager = isManagerRole(user?.role);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newStatus, setNewStatus] = useState('Draft');
  const [isUploading, setIsUploading] = useState(false);
  const fileBaseUrl = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

  const storageUsedBytes = planSnapshot?.usage.storageUsedBytes ?? 0;
  const storageLimitBytes = planSnapshot?.limits?.storageBytes ?? null;
  const storageLimitReached = isLimitReached(storageUsedBytes, storageLimitBytes);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/documents', config);
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to grab documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (willExceedLimit(storageUsedBytes, storageLimitBytes, selectedFile.size)) {
      toast.error('Upgrade your plan to continue');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', newTitle || selectedFile.name);
      formData.append('status', newStatus);

      setIsUploading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await api.post('/documents', formData, config);

      if (!response.data?.success) {
        throw new Error('Upload was not confirmed by the server');
      }

      toast.success('Document uploaded');
      setIsModalOpen(false);
      setNewTitle('');
      setSelectedFile(null);
      setNewStatus('Draft');
      await fetchDocuments();
      await refreshPlan();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create document');
      await refreshPlan();
    } finally {
      setIsUploading(false);
    }
  };

  const getDocumentUrl = (fileUrl: string) =>
    fileUrl?.startsWith('http') ? fileUrl : `${fileBaseUrl}${fileUrl}`;

  const handleOpenDocument = (fileUrl: string) => {
    window.open(getDocumentUrl(fileUrl), '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/documents/${id}`, config);
      toast.success('Document deleted');
      await fetchDocuments();
      await refreshPlan();
    } catch {
      toast.error('Failed to delete document');
    }
  };

  return (
    <AppShell>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-[#1F2937] sm:text-3xl">Documents</h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            Manage all your project files, reports, and certifications. Storage usage: {formatStorage(storageUsedBytes)} / {formatStorage(storageLimitBytes)}.
          </p>
        </div>
        {storageLimitReached && isManager ? (
          <Link
            to="/pricing"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F2937] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#111827] sm:w-auto"
          >
            Upgrade Plan
          </Link>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={storageLimitReached}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Plus className="h-5 w-5" /> Upload Document
          </button>
        )}
      </div>

      {storageLimitReached && (
        <div className="mb-6">
          <UpgradePrompt
            compact
            message={isManager ? 'You have reached your storage limit. Upgrade to upload more documents.' : 'Your manager needs to upgrade the team plan to allow more storage.'}
            showButton={isManager}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#E5DED6] bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-[#6B7280]">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280]">
            <FileText className="mx-auto mb-4 h-12 w-12 text-[#E5DED6]" />
            No documents found. Upload one to get started.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="border-b border-[#E5DED6] bg-[#EFE9E1]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-[#6B7280]">Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#6B7280]">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#6B7280]">Date Added</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B7280]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DED6]">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="transition-colors hover:bg-[#F6F3EE]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-[#EFE9E1] p-2">
                            <FileText className="h-5 w-5 text-[#6B7280]" />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenDocument(doc.fileUrl)}
                              className="text-left font-medium text-[#1F2937] hover:text-[#2563EB] hover:underline"
                            >
                              {doc.title || doc.fileName}
                            </button>
                            <p className="truncate text-xs text-[#2563EB]">{doc.fileName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            doc.status === 'Published' ? 'border-[#E5DED6] bg-[#EFE9E1] text-[#1F2937]' : 'border-[#E5DED6] bg-[#EFE9E1] text-[#6B7280]'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <a
                            href={getDocumentUrl(doc.fileUrl)}
                            download={doc.fileName || doc.title}
                            className="rounded-lg p-2 text-[#6B7280] transition-colors hover:text-[#1F2937]"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => handleDelete(doc._id)}
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {documents.map((doc) => (
                <div key={doc._id} className="rounded-xl border border-[#E5DED6] p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-lg bg-[#EFE9E1] p-2">
                        <FileText className="h-5 w-5 text-[#6B7280]" />
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => handleOpenDocument(doc.fileUrl)}
                          className="text-left font-medium text-[#1F2937] hover:text-[#2563EB] hover:underline"
                        >
                          {doc.title || doc.fileName}
                        </button>
                        <p className="truncate text-xs text-[#2563EB]">{doc.fileName}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        doc.status === 'Published' ? 'border-[#E5DED6] bg-[#EFE9E1] text-[#1F2937]' : 'border-[#E5DED6] bg-[#EFE9E1] text-[#6B7280]'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <p className="mb-4 text-sm text-[#6B7280]">
                    Added on {new Date(doc.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <a
                      href={getDocumentUrl(doc.fileUrl)}
                      download={doc.fileName || doc.title}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E5DED6] px-3 py-2 text-sm text-[#1F2937]"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-[#1F2937]">Upload Document</h2>
            {storageLimitReached && (
              <div className="mb-4 rounded-lg border border-[#D7C7B3] bg-[#FFF7ED] p-3 text-sm text-[#6B7280]">
                Upgrade your plan to continue.
              </div>
            )}
            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="e.g. Safety Inspection Q1"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Upload File</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-[#6B7280] transition-colors hover:bg-[#EFE9E1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || storageLimitReached}
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

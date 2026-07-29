import React, { useState } from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Film,
  FileSpreadsheet,
  UploadCloud,
  Search,
  Filter,
  Eye,
  Tag,
  Clock,
  Lock,
  Download,
  Trash2,
  FolderPlus,
  Grid,
  List,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';

export interface EnterpriseFile {
  id: string;
  name: string;
  category: 'Images' | 'Videos' | 'Documents' | 'Invoices' | 'Reports' | 'Product Files' | 'Marketing Assets';
  size: string;
  folder: string;
  uploadedAt: string;
  version: string;
  permissions: 'Public' | 'Restricted' | 'Admin Only';
  tags: string[];
}

export const UnifiedFileManager: React.FC = () => {
  const [files, setFiles] = useState<EnterpriseFile[]>([
    {
      id: 'file-01',
      name: 'Product_3D_Render_Quantum_Headphones.png',
      category: 'Images',
      size: '4.2 MB',
      folder: 'Product Catalog',
      uploadedAt: '2026-07-28',
      version: 'v2.4',
      permissions: 'Public',
      tags: ['HD', '3D Asset', 'SKU-9902'],
    },
    {
      id: 'file-02',
      name: 'Tax_Invoice_INV-2026-0842.pdf',
      category: 'Invoices',
      size: '240 KB',
      folder: 'Finance & Taxes',
      uploadedAt: '2026-07-27',
      version: 'v1.0',
      permissions: 'Restricted',
      tags: ['Tax', 'Invoice', 'Audit'],
    },
    {
      id: 'file-03',
      name: 'Q2_Marketplace_GMV_Executive_Report.xlsx',
      category: 'Reports',
      size: '1.8 MB',
      folder: 'Executive BI',
      uploadedAt: '2026-07-25',
      version: 'v3.1',
      permissions: 'Admin Only',
      tags: ['GMV', 'Executive', 'Q2 2026'],
    },
    {
      id: 'file-04',
      name: 'Summer_Promo_Campaign_Banner_4K.mp4',
      category: 'Videos',
      size: '18.4 MB',
      folder: 'Marketing Assets',
      uploadedAt: '2026-07-24',
      version: 'v1.2',
      permissions: 'Public',
      tags: ['4K Video', 'Promo', 'Summer Sale'],
    },
    {
      id: 'file-05',
      name: 'Merchant_Onboarding_Agreement_Template.docx',
      category: 'Documents',
      size: '620 KB',
      folder: 'Legal & IAM',
      uploadedAt: '2026-07-20',
      version: 'v4.0',
      permissions: 'Restricted',
      tags: ['Legal', 'Merchant', 'KYC'],
    },
  ]);

  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [query, setQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<EnterpriseFile | null>(null);

  const folders = ['All', 'Product Catalog', 'Finance & Taxes', 'Executive BI', 'Marketing Assets', 'Legal & IAM'];

  const filteredFiles = files.filter((f) => {
    if (activeFolder !== 'All' && f.folder !== activeFolder) return false;
    if (!query) return true;
    return (
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.category.toLowerCase().includes(query.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    );
  });

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'Images': return ImageIcon;
      case 'Videos': return Film;
      case 'Reports': return FileSpreadsheet;
      case 'Invoices': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
            <Folder className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Enterprise Asset & File Manager</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Central asset repository • Version control, ACL permissions & Cloud S3 storage
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono transition flex items-center space-x-2">
            <FolderPlus className="w-4 h-4 text-amber-400" />
            <span>New Folder</span>
          </button>

          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-amber-500/10">
            <UploadCloud className="w-4 h-4" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Folder Sidebar + Files Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Folder Nav */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
            Repository Folders
          </div>
          <div className="space-y-1">
            {folders.map((folder) => {
              const count = files.filter((f) => folder === 'All' || f.folder === folder).length;
              return (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full text-left p-2.5 rounded-2xl text-xs font-mono transition flex items-center justify-between ${
                    activeFolder === folder
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span>{folder}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-500 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Explorer */}
        <div className="lg:col-span-3 space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search files by name, tag or SKU..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl text-xs transition border ${
                  viewMode === 'grid' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl text-xs transition border ${
                  viewMode === 'list' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Files Grid / List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.category);
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className="p-5 bg-slate-900 border border-slate-800 rounded-3xl hover:border-amber-500/50 transition cursor-pointer space-y-3 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-slate-950 border border-slate-800 text-amber-400 rounded-2xl group-hover:border-amber-500/50 transition">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 font-mono rounded">
                        {file.version}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-slate-100 text-xs truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {file.size} • {file.uploadedAt}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {file.tags.map((t) => (
                        <span key={t} className="text-[9px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>{file.permissions}</span>
                      </span>
                      <Download className="w-3.5 h-3.5 text-slate-500 hover:text-amber-400 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.category);
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className="p-4 hover:bg-slate-800/50 transition flex items-center justify-between cursor-pointer font-mono text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-slate-100 font-bold">{file.name}</div>
                        <div className="text-[10px] text-slate-500">{file.folder} • {file.size}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                        {file.version}
                      </span>
                      <Download className="w-4 h-4 text-slate-400 hover:text-amber-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

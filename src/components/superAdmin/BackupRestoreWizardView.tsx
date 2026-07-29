import React, { useState } from 'react';
import { MOCK_BACKUP_RECORDS } from '../../data/mockSuperAdmin';
import { BackupRecord } from '../../types/superAdmin';
import { Database, Download, CheckCircle2, RefreshCw, ShieldAlert, Play, HardDrive } from 'lucide-react';

export const BackupRestoreWizardView: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>(MOCK_BACKUP_RECORDS);
  const [notification, setNotification] = useState<string | null>(null);

  const handleTriggerBackup = () => {
    const newBackup: BackupRecord = {
      id: `BKP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
      backupType: 'Full Database',
      sizeMb: 14250,
      storageLocation: 's3://amz-backups-us-east-1/manual_snapshot_now.sql.gz',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Verified Healthy',
      durationSeconds: 195,
    };
    setBackups([newBackup, ...backups]);
    setNotification('Manual snapshot initiated and written to redundant S3 cold storage.');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSimulateRestore = (id: string) => {
    setNotification(`DR Restore Wizard: Point-in-time recovery test executed successfully on isolated staging cluster for ${id}. Integrity score 100%.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              Automated Database Snapshots & Disaster Recovery (DR)
            </h3>
            <p className="text-xs text-slate-400">
              Multi-Region PostgreSQL automated snapshots, Point-In-Time-Recovery (PITR) & S3 cold storage vault
            </p>
          </div>

          <button
            onClick={handleTriggerBackup}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Trigger Immediate Backup</span>
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {backups.map((bkp) => (
            <div key={bkp.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400 font-bold">{bkp.id}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
                    {bkp.backupType}
                  </span>
                  <span className="text-emerald-400 font-bold">({(bkp.sizeMb / 1024).toFixed(2)} GB)</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Location: <code className="text-slate-300">{bkp.storageLocation}</code>
                </div>
                <div className="text-[10px] text-slate-500">
                  Created: {bkp.createdAt} (Duration: {bkp.durationSeconds}s)
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <span className="text-[10px] px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full font-bold">
                  {bkp.status}
                </span>

                <button
                  onClick={() => handleSimulateRestore(bkp.id)}
                  className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-xl transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Simulate Restore</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

interface AdminSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SyncResult {
  success: boolean;
  stats?: {
    processed: number;
    added: number;
    updated: number;
    unchanged: number;
    errors?: string[];
  };
  error?: string;
}

export default function AdminSyncModal({ isOpen, onClose }: AdminSyncModalProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState('');

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Sync failed');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setResult(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Access</h2>

          {result ? (
            // Success state
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sync Complete</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Processed:</div>
                  <div className="font-medium">{result.stats?.processed}</div>
                  <div className="text-gray-600">Added:</div>
                  <div className="font-medium text-green-600">+{result.stats?.added}</div>
                  <div className="text-gray-600">Updated:</div>
                  <div className="font-medium text-blue-600">{result.stats?.updated}</div>
                  <div className="text-gray-600">Unchanged:</div>
                  <div className="font-medium text-gray-500">{result.stats?.unchanged}</div>
                </div>
                {result.stats?.errors && result.stats.errors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-red-600 mb-2">
                      Errors ({result.stats.errors.length}):
                    </p>
                    <ul className="text-xs text-red-500 space-y-1 max-h-24 overflow-y-auto">
                      {result.stats.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                      {result.stats.errors.length > 5 && (
                        <li>...and {result.stats.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <Button onClick={handleClose} className="mt-6 w-full">
                Close
              </Button>
            </div>
          ) : (
            // Form state
            <form onSubmit={handleSync}>
              <p className="text-sm text-gray-600 mb-4">
                Enter the admin password to sync data from Google Sheets.
              </p>

              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                autoFocus
              />

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!password}
                  className="flex-1"
                >
                  Sync Now
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

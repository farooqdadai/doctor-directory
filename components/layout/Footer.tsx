'use client';

import Link from 'next/link';
import { useState } from 'react';
import AdminSyncModal from '../AdminSyncModal';

export default function Footer() {
  const [showAdminModal, setShowAdminModal] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-xl font-bold text-white">Doctor Directory</span>
              </Link>
              <p className="text-sm max-w-md">
                Find the right doctor for your health needs. Browse verified healthcare
                professionals by specialty and location.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="hover:text-white transition-colors">
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/doctors?verified=true" className="hover:text-white transition-colors">
                    Verified Doctors
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Doctor Directory. All rights reserved.
            </p>
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors mt-4 sm:mt-0"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Sync Modal */}
      <AdminSyncModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </>
  );
}

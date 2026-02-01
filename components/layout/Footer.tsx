'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSyncModal from '../AdminSyncModal';

const footerLinks = {
  services: [
    { label: 'Find Doctors', href: '/doctors' },
    { label: 'Find Hospitals', href: '/hospitals' },
    { label: 'Verified Providers', href: '/doctors?verified=true' },
    { label: 'Browse by Specialty', href: '/doctors' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [showAdminModal, setShowAdminModal] = useState(false);

  return (
    <>
      <footer className="relative bg-gray-900 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 to-transparent pointer-events-none" />

        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
              {/* Brand Column */}
              <div className="lg:col-span-4">
                <Link href="/" className="inline-flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-white">DocFind</span>
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                  Your trusted healthcare directory. Find verified doctors, hospitals, and
                  specialists near you with comprehensive profiles and contact information.
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-700/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Links Columns */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {/* Services */}
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                      Services
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.services.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                          >
                            <span className="w-0 h-px bg-brand-400 group-hover:w-3 transition-all duration-200 mr-0 group-hover:mr-2" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Company */}
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                      Company
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.company.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                          >
                            <span className="w-0 h-px bg-brand-400 group-hover:w-3 transition-all duration-200 mr-0 group-hover:mr-2" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legal */}
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                      Legal
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.legal.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center group"
                          >
                            <span className="w-0 h-px bg-brand-400 group-hover:w-3 transition-all duration-200 mr-0 group-hover:mr-2" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} DocFind. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Powered by Next.js
                </span>
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>
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

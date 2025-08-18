import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import IlumentoLogo from '../assets/44017573ce36c7a1c4d764c7e271211f3edfeab9.png';

interface NavbarProps {
  username?: string;
  projectName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ username, projectName }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {}
    navigate('/login', { replace: true });
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center px-6 z-50">
      <div className="flex-1 flex items-center">
        <img src={IlumentoLogo} alt="Ilumento" className="h-12 mr-2" />
        <span style={{ color: '#3CB371' }}>
          ilumento
        </span>
        {projectName && (
          <span className="text-lg font-medium text-gray-700 ml-4">
            Project: {projectName}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3 relative" ref={menuRef}>
        {username && (
          <span className="text-gray-700">{username}</span>
        )}
        <button onClick={toggleMenu} className="p-2 hover:bg-gray-100 rounded-full" aria-haspopup="menu" aria-expanded={menuOpen}>
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={handleChangePassword}
            >
              Change password
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
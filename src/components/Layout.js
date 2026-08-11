import React from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserSidebar from './UserSidebar';
import ConsultantSidebar from './ConsultantSidebar';
import { normalizeRoles, readStoredUser } from '../auth/roles';

const Layout = ({ children }) => {
  const user = readStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roles = normalizeRoles(user.roles ?? user.role);

  const renderSidebar = () => {
    if (roles.includes('admin')) return <Sidebar />;
    if (roles.includes('consultant')) return <ConsultantSidebar />;
    if (roles.includes('user')) return <UserSidebar />;

    return null;
  };

  return (
    <div style={{ display: 'flex' }}>
      {renderSidebar()}
      <div className="flex-grow-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
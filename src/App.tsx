import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CRMProvider } from './context/CRMContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { CreateLeadModal } from './components/CreateLeadModal';
import { NotificationsModal } from './components/NotificationsModal';
import { UpgradeQuotaModal } from './components/UpgradeQuotaModal';
import { HelpModal } from './components/HelpModal';

import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Conversations } from './pages/Conversations';
import { Contacts } from './pages/Contacts';
import { Scheduled } from './pages/Scheduled';
import { Templates } from './pages/Templates';
import { BulkMessage } from './pages/BulkMessage';
import { Qualification } from './pages/Qualification';
import { TestChat } from './pages/TestChat';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <CRMProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex relative">
          <Sidebar />
          <Header />
          <main className="pl-64 pt-16 min-h-screen w-full">
            <div className="p-8 md:p-10 max-w-[1600px] mx-auto space-y-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/conversations" element={<Conversations />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/scheduled" element={<Scheduled />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/bulk-message" element={<BulkMessage />} />
                <Route path="/qualification" element={<Qualification />} />
                <Route path="/test-chat" element={<TestChat />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>

          {/* Global Action Modals */}
          <AuthModal />
          <CreateLeadModal />
          <NotificationsModal />
          <UpgradeQuotaModal />
          <HelpModal />
        </div>
      </Router>
    </CRMProvider>
  );
};

export default App;



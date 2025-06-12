import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataProcessing from './pages/DataProcessing';
import ProcessingDetail from './pages/ProcessingDetail';
import ProcessStep1 from './pages/ProcessStep1';
import ProcessStep2 from './pages/ProcessStep2';
import ProcessStep3 from './pages/ProcessStep3';
import DocumentValidation from './pages/DocumentValidation';
import DataCheck from './pages/DataCheck';
import DocumentEditor from './pages/DocumentEditor';
import RecycleBin from './pages/RecycleBin';

import PublicDatabase from './pages/databases/PublicDatabase';
import SharedDatabase from './pages/databases/SharedDatabase';
import PrivateDatabase from './pages/databases/PrivateDatabase';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  const [isAuthenticated] = useState(true); // Mocked authentication state

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="public-knowledge" element={<PublicDatabase />} />
            <Route path="process" element={<DataProcessing />} />
            <Route path="process-step1/:id" element={<ProcessStep1 />} />
            <Route path="process-step2/:id" element={<ProcessStep2 />} />
            <Route path="process-step3/:id" element={<ProcessStep3 />} />
            <Route path="my-workspace/process" element={<DataProcessing />} />
            <Route path="my-workspace/process/:id" element={<ProcessingDetail />} />
            <Route path="my-workspace/validation/:id" element={<DocumentValidation />} />
            <Route path="my-workspace/data-check/:id" element={<DataCheck />} />
            <Route path="my-workspace/private" element={<PrivateDatabase />} />
            <Route path="my-workspace/private/:projectId" element={<ProjectDetail />} />
            <Route path="my-workspace/recycle-bin" element={<RecycleBin />} />
            <Route path="shared-database" element={<SharedDatabase />} />
            <Route path="shared-database/:projectId" element={<ProjectDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          {/* 文档编辑器独立路由，不使用Layout */}
          <Route path="/my-workspace/editor/:documentId" element={<DocumentEditor />} />
          <Route path="/my-workspace/editor" element={<DocumentEditor />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default App;
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ConfirmSignUp from './pages/ConfirmSignUp';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import ProtectedLayout from './common/ProtectedLayout';
import { AppInitializer } from './common/AppInitializer';
import ProjectPage from './Projects/ProjectPage';
import { ProjectProvider } from './contexts/ProjectContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ConfigurationProvider>
          <AppInitializer>
            <BrowserRouter>
              <Routes>
                <Route element={<ProtectedLayout />}>
                  <Route
                    path="/"
                    element={
                      <ProjectProvider>
                        <ProjectPage />
                      </ProjectProvider>
                    }
                  />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/confirm" element={<ConfirmSignUp />} />
              </Routes>
            </BrowserRouter>
          </AppInitializer>
        </ConfigurationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

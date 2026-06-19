// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Landing from './pages/Landing';
import AllShows from './pages/AllShows';
import YourShows from './pages/YourShows';
import Layout from './components/Layout';
import CreateShow from './pages/CreateShow';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <Layout>
              <Landing />
            </Layout>
          } />
          
          <Route path="/all-shows" element={
            <Layout>
              <AllShows />
            </Layout>
          } />
          
          {/* Note: We removed the :hostId parameter so anyone can hit this route */}
          <Route path="/your-shows" element={
            <Layout>
              <YourShows />
            </Layout>
          } />

          <Route path="/create-show" element={
            <Layout>
              <CreateShow />
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
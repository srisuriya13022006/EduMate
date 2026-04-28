import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Chat from "./pages/Chat";
import Quiz from "./pages/Quiz";
// Ensure you import the component here
import QuizSetting from "./pages/Quizsetting"; 
import FutureUpdate from "./pages/futureupd";
import ResourcePage from "./pages/Resource"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Chat />} />
          <Route path="/quiz" element={<Quiz />} />
          {/* The QuizSetting route is now active */}
          <Route path="/quiz-settings" element={<QuizSetting />} />
          <Route path="/futureupdate" element={<FutureUpdate />} />
          <Route path="/resources" element={<ResourcePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
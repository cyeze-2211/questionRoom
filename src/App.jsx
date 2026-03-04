import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminModule from "./Pages/AdminModule";
import AdminCourse from "./Pages/AdminCourse";
import AdminStudent from "./Pages/AdminStudent";
import AdminQuiz from "./Pages/AdminQuiz";
import QuestionCreate from "./Components/AdminQuiz/QuestionCreate";
import ErrorPage from "./Pages/ErrorPage";
import StudentProfile from "./Pages/StudentProfile";
import QuestionEdit from "./Components/AdminQuiz/QuestionEdit";
import AdminRating from "./Pages/AdminRating";
import LightningPage from "./Pages/lightningPage";
import AdminTest from "./Pages/AdminTest";
import AdminTestCreate from "./Pages/AdminTestCreate";
import AdminTestView from "./Pages/AdminTestView";
import AdminUserCreate from "./Pages/AdminUserCreate";
import AdminGroup from "./Pages/AdminGroup";
import AdminUserEdit from "./Pages/AdminUserEdit";
import ResultDetail from "./Pages/ResultDetail";
import AdminResultDetail from "./Pages/AdminResultDetail";
import AdminTestEdit from "./Pages/AdminTestEdit";
import Register from "./Pages/Register";
import UserTest from "./Pages/UserTest";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");  // Check for token

  // Redirect to login page if no token is found
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Route */}
        <Route path="/" element={<AppLayout />}>
          {/* Main Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LightningPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/result" element={<ErrorPage />} />
            <Route path="/result/:id" element={<ResultDetail />} />
            <Route path="/user/tests" element={<UserTest />} />
          </Route>
          {/* Admin Routes - Protected */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="admin/module/:ID" element={<AdminModule />} />
            <Route path="admin/course" element={<AdminCourse />} />
            <Route path="admin/group" element={<AdminGroup />} />
            <Route path="admin/student" element={<AdminStudent />} />
            <Route path="admin/student/create" element={<AdminUserCreate />} />
            <Route path="admin/student/edit/:id" element={<AdminUserEdit />} />
            <Route path="admin/quiz/:ID" element={<AdminQuiz />} />
            <Route path="admin/rating" element={<AdminRating />} />
            <Route path="admin/quiz/create/:ID" element={<QuestionCreate />} />
            <Route path="admin/student/:id" element={<StudentProfile />} />
            <Route path="admin/result/detail/:id" element={<AdminResultDetail />} />
            <Route path="admin/test" element={<AdminTest />} />
            <Route path="admin/test/create" element={<AdminTestCreate />} />
            <Route path={`/admin/test/edit/:id`} element={<AdminTestEdit />} />
            <Route path="admin/test/:ID" element={<AdminTestView />} />
            {/* <Route path="/question/edit" element={<QuestionEdit/>}/> */}
          </Route>
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

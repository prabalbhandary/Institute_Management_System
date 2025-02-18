import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import Courses from './components/Courses';
import AddCourse from './components/AddCourse';
import Students from './components/Students';
import AddStudent from './components/AddStudent';
import CollectFee from './components/CollectFee';
import PaymentHistory from './components/PaymentHistory';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import CourseDetails from './components/CourseDetails';
import StudentDetails from './components/StudentDetails';

const myRouter = createBrowserRouter([
  {
    path: '',
    Component: PublicRoute,
    children: [
      { path: '', Component: Login },
      { path: 'login', Component: Login },
      { path: 'signup', Component: Signup },
    ],
  },
  {
    path: 'dashboard',
    Component: PrivateRoute,
    children: [
      {
        path: '',
        element: <Dashboard />,
        children: [
          { path: '', Component: Home },
          { path: 'home', Component: Home },
          { path: 'courses', Component: Courses },
          { path: 'add-course', Component: AddCourse },
          { path: 'students', Component: Students },
          { path: 'add-student', Component: AddStudent },
          { path: 'collect-fee', Component: CollectFee },
          { path: 'payment-history', Component: PaymentHistory },
          {path: "course-details/:id", Component: CourseDetails},
          {path: "update-course/:id", Component: AddCourse},
          {path: "student-details/:id", Component: StudentDetails},
          {path: "update-student/:id", Component: AddStudent},
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={myRouter} />
      <ToastContainer theme="colored" position="top-right" />
    </>
  );
};

export default App;

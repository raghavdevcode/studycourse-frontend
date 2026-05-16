import { Route, Routes } from "react-router-dom";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ErrorPage from "./ErrorPage";
import About from "./About";
import Contact from "./Contact";

import SearchUser from "./SearchUser";
import ListOfMembers from "./ListOfMembers";
import CreateAdmin from "./CreateAdmin";
import ManageCategory from "./ManageCategory";
import ManageSubCategory from "./ManageSubCategory";
import ManageLesson from "./ManageLesson";

import AdminDashboard from "./AdminDashboard";
import AdminLayout from "./AdminLayout";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Lessons from "./Lessons";
import Details from "./Details";

import ChangePassword from "./ChangePassword";
import SearchResults from "./SearchResults";
import ActivateAccount from "./ActivateAccount";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import CoursePayment from "./CoursePayment";

import StudentDashboard from "./StudentDashboard";
import MyCourses from "./MyCourses";
import Explore from "./Explore";
import Profile from "./Profile";
import Overview from "./Overview";
import STUChangePassword from "./STUChangePassword";
import StudentDetail from "./StudentDetail";
import RouteProtector from "./RouteProtector";


function SiteRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/homepage" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/subcategories" element={<SubCategories />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/details" element={<Details />} />
      <Route path="/payment" element={<CoursePayment />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/searchresults" element={<SearchResults />} />
      <Route path="/activateaccount" element={<ActivateAccount />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />

      {/* Student Protected Routes */}
      <Route
        path="/studentdashboard"
        element={<RouteProtector CompName={StudentDashboard} />}
      >
        <Route index element={<Overview />} />
        <Route path="mycourses" element={<MyCourses />} />
        <Route path="explore" element={<Explore />} />
        <Route path="profile" element={<Profile />} />
        <Route path="stuchangepassword" element={<STUChangePassword />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/adminlayout"
        element={
          <RouteProtector CompName={AdminLayout} adminOnly={true} />
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="searchuser" element={<SearchUser />} />
        <Route path="getallmembers" element={<ListOfMembers />} />
        <Route path="studentdetail/:userId" element={<StudentDetail />} />
        <Route path="createadmin" element={<CreateAdmin />} />
        <Route path="managecategory" element={<ManageCategory />} />
        <Route path="managesubcategory" element={<ManageSubCategory />} />
        <Route path="managelesson" element={<ManageLesson />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<ErrorPage />} />

    </Routes>
  );
}

export default SiteRoutes;
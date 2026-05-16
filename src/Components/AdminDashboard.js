// import axios from "axios";
// import { useEffect, useState } from "react";

// function AdminDashboard() {

//     useEffect(() => {
//         document.title = "Admin Dashboard - Study Course";
//     }, []);

//     const [totalUsers, setTotalUsers] = useState(0);

//     useEffect(() => {
//         getTotalUsers();
//     }, []);

//     const getTotalUsers = async () => {
//         try {
//             const res = await axios.get("http://localhost:9000/api/getallmembers");
//             if (res.data.code === 1) {
//                 setTotalUsers(res.data.udata.length);
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     return (
//         <>
//             <h2 className="text-center">Admin Dashboard</h2>
//             <br />
//             <div className="stats-admin">
//                 <div className="dbcard">
//                     <h3>Total Users</h3>
//                     <p>{totalUsers}</p>
//                 </div>
//                 <div className="dbcard">
//                     <h3>Total Courses</h3>
//                     <p>10</p>
//                 </div>
//                 <div className="dbcard">
//                     <h3>Total Enrollments</h3>
//                     <p>5</p>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default AdminDashboard;
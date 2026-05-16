import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

var RouteProtector = (props) => {
    const udata = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {

        // Not logged in
        if (!udata?.isLoggedIn) {
            navigate("/login");
            return;
        }

        // USER trying to access admin
        if (props.adminOnly && udata.utype !== "admin") {
            navigate("/studentdashboard");
            return;
        }

        // ADMIN trying to access student routes
        if (!props.adminOnly && udata.utype === "admin") {
            navigate("/adminlayout");
            return;
        }

    }, [udata, navigate, props.adminOnly]);

    return <props.CompName />;
};

export default RouteProtector;
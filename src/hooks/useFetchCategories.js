import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../api/api";

function useFetchCategories() {
    const [allcat, setallcat] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = useCallback(async () => {

        try {
            setLoading(true);

            const apiresp = await api.get("/api/category/getall", {
            });

            if (apiresp?.data?.code === 1) {
                setallcat(apiresp.data.cdata || []);
            } else {
                setallcat([]);
            }
        } catch (e) {
            if (e.name !== "CanceledError") {
                toast.error(e?.response?.data?.message || "Error Occurred");
            }
        } finally {
            setLoading(false);
        }

    }, []);

    return {
        allcat,
        setallcat,
        fetchCategories,
        loading
    };
}

export default useFetchCategories;
import api from "./api";

// activate account
export const activateAccountApi = (code, signal) => {
    if (!code) {
        return Promise.reject({
            message: "Activation code missing",
            status: null,
            data: null
        });
    }

    return api.get(`/api/auth/activate/${code}`, { signal });
};

// resend activation
export const resendActivationApi = (email) => {
    if (!email) {
        return Promise.reject({
            message: "Email is required",
            status: null,
            data: null
        });
    }

    return api.get(`/api/auth/resend/${email}`);
};

// login
export const loginApi = async (data) => {
    const res = await api.post("/api/auth/login", data);
    return res.data;
};

// signup
export const signupApi = (data) => {
    return api.post("/api/auth/signup", data);
};
import Cookies from "js-cookie";

export const setToken = (token: string) => {
	Cookies.set("jwtToken", token, {
		expires: 7,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
};

export const getToken = (): string | undefined => {
	return Cookies.get("jwtToken");
};

export const removeToken = () => {
	Cookies.remove("jwtToken");
};

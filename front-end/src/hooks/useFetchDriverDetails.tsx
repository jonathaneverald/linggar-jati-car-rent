import axios from "axios";

const useFetchDriverDetails = async (id: number, token: string) => {
    try {
        const res = await axios.get(`http://127.0.0.1:5000/drivers/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data; // axios stores response data in `data`
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};

export default useFetchDriverDetails;

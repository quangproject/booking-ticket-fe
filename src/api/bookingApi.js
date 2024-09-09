import axiosClient from "./axiosClient";

class BookingApi {
    getHome = () => {
        const url = "/api/home";
        return axiosClient.get(url);
    };

    getAllBooking = () => {
        const url = "/api/booking";
        return axiosClient.get(url);
    };

    createBooking = (data) => {
        const url = "/api/booking";
        return axiosClient.post(url, data);
    };

    Remove = (id) => {
        const url = `/api/booking/${id}`;
        return axiosClient.delete(url);
    };

    Search = (query) => {
        const url = `/api/booking/search?bookingId=${query}`;
        return axiosClient.get(url);
    };
}

const bookingApi = new BookingApi();
export default bookingApi;

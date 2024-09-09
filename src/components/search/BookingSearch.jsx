import { useState } from "react";
import swalService from "../../services/SwalService";
import bookingApi from "../../api/bookingApi";
import handleError from "../../services/HandleErrors";
import Loading from "../loading/Loading";

const BookingSearch = () => {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (bookingId === "") {
      swalService.showMessage(
        "The Warning!",
        "Please enter your booking ID to search.",
        "warning"
      );
      return;
    }

    setLoading(true); // Show loading overlay

    try {
      const response = await bookingApi.Search(bookingId);
      console.log("🚀 ~ handleSearch ~ response:", response);

      const message = `
          <ul class="text-start">
            <li><b>Student ID:</b> ${response.data[0].studentId || "N/A"}</li>
            <li><b>Full Name:</b> ${response.data[0].fullName}</li>
            <li><b>Email:</b> ${response.data[0].email}</li>
            <li><b>Phone Number:</b> ${response.data[0].phoneNumber}</li>
            <li><b>Season:</b> ${response.data[0].seat.season.name}</li>
            <li><b>Seat Number:</b> ${response.data[0].seat.number}</li>
          </ul>
        `;

      swalService.showHtmlMessage(
        "Your booking information!",
        message,
        "success"
      );
    } catch (error) {
      console.log("🚀 ~ handleSearch ~ error:", error);
      handleError.showError(error);
    } finally {
      setLoading(false); // Remove loading overlay
    }
  };

  return (
    <div className="d-flex mt-2 mt-md-0">
      <input
        className="form-control me-2"
        type="search"
        id="search-booking-id"
        placeholder="Your booking ID"
        aria-label="Search"
        onChange={(e) => setBookingId(e.target.value)}
      />
      <button
        className="btn btn-outline-warning"
        onClick={handleSearch}
        id="btn-search-booking-id"
      >
        Search
      </button>

      {loading && <Loading></Loading>}
    </div>
  );
};

export default BookingSearch;

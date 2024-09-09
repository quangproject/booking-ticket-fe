import BookingSearch from "../../components/search/BookingSearch";
import SeatingPlan from "../../components/seating-plan/SeatingPlan";
import UseTop from "../../hooks/UseTop";
import BaseLayout from "../../layouts/BaseLayout";

const HomePage = () => {
  UseTop();

  return (
    <BaseLayout>
      <h1 className="mt-3 fw-bold text-center">Mùa Miên Man Chair Booking</h1>
      <nav className="d-flex justify-content-between align-items-center flex-column flex-md-row mt-4">
        {/* Button trigger modal */}
        <button
          type="button"
          className="btn btn-outline-warning fw-bold"
          data-bs-toggle="modal"
          data-bs-target="#seatingChartModal"
        >
          Seating chart
        </button>
        <BookingSearch></BookingSearch>
      </nav>
      <SeatingPlan></SeatingPlan>
    </BaseLayout>
  );
};

export default HomePage;

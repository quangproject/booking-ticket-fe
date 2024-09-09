import PropTypes from "prop-types";

const Seat = ({ seat, seasonData, handleShowModalBooking }) => {
  return (
    <div
      className={`seat p-2 text-center ${seat.isBooked ? "seat-booked" : ""}`}
      data-season-id={seasonData.id}
      data-season-name={seasonData.name}
      data-seat-id={seat.id}
      data-seat-number={seat.number}
      onClick={() => handleShowModalBooking(seat, seasonData)}
    >
      {seat.number}
    </div>
  );
};

Seat.propTypes = {
  seat: PropTypes.object,
  seasonData: PropTypes.object,
  handleShowModalBooking: PropTypes.func
};

export default Seat;

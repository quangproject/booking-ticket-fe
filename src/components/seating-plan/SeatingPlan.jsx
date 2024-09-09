import { useState, useEffect } from "react";
import Seat from "../seat/Seat";
import handleError from "../../services/HandleErrors";
import * as yup from "yup";
import bookingApi from "../../api/bookingApi";
import QRious from "qrious";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import swalService from "../../services/SwalService";
import Loading from "../loading/Loading";

const SeatingPlan = () => {
  const [seatingPlan, setSeatingPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [showModalSeatingChart, setShowModalSeatingChart] = useState(false);
  const [showModalBooking, setShowModalBooking] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    seatId: "",
    seatNumber: "",
    seasonId: "",
    seasonName: "",
    fullName: "",
    studentId: "",
    email: "",
    phoneNumber: "",
    qrCodeImageSrc: ""
  });
  const [errors, setErrors] = useState({});
  const idPattern = /^(GCC|GBC|GDC)\d{6}$/;
  const phonePattern = /^(\(0\d{1,3}\)\d{7})|(0\d{9})$/;

  const handleCloseModalSeatingChart = () => setShowModalSeatingChart(false);
  const handleShowModalSeatingChart = () => setShowModalSeatingChart(true);

  const handleCloseModalBooking = () => setShowModalBooking(false);
  const handleShowModalBooking = (seat, seasonData) => {
    setFormData({
      ...formData,
      seatId: seat.id,
      seatNumber: seat.number,
      seasonId: seasonData.id,
      seasonName: seasonData.name
    });
    setShowModalBooking(true);
  };

  const handleShowPaymentModal = () => setShowPaymentModal(true);
  const handleClosePaymentModal = () => setShowPaymentModal(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchHome = await bookingApi.getHome();
        setSeatingPlan(fetchHome.data);
        // Show modal after data is fetched
        handleShowModalSeatingChart();
      } catch (error) {
        console.log("🚀 ~ fetchData ~ error:", error);
        handleError.showError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateRows = (seats) => {
    const rows = [
      seats.filter((seat) => seat.number <= 5),
      seats.filter((seat) => seat.number > 5 && seat.number <= 11),
      seats.filter((seat) => seat.number > 11 && seat.number <= 18),
      seats.filter((seat) => seat.number > 18 && seat.number <= 26),
      seats.filter((seat) => seat.number > 26 && seat.number <= 35),
      seats.filter((seat) => seat.number > 35 && seat.number <= 45)
    ];
    return rows;
  };

  // Yup validation
  const schema = yup.object().shape({
    studentId: yup
      .string()
      .matches(idPattern, "Invalid Student ID")
      .required("Student ID is required"),
    fullName: yup.string().required("Full Name is required"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(phonePattern, "Please enter a valid phone number")
      .required("Phone Number is required")
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });

      // Handle form submission logic here
      console.log("Booking confirmed:", formData);

      const seatInfo = `You selected Seat <b>${formData.seatNumber}</b> in the <b>${formData.seasonName}</b> season.<br>`;
      const bookingDetails = `
      <b>Full Name:</b> ${formData.fullName}<br>
      <b>Student Number:</b> ${formData.studentId || "Not available"}<br>
      <b>Email:</b> ${formData.email}<br>
      <b>Phone Number:</b> ${formData.phoneNumber}
      `;

      swalService.showWithBootstrapButtons(seatInfo + bookingDetails, () =>
        handleShowPaymentModal()
      );
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      const newError = {};
      error.inner.forEach((e) => {
        newError[e.path] = e.message;
      });
      setErrors(newError);
    }
  };

  const handlePayment = async () => {
    setLoadingBooking(true);

    const qrCode = new QRious({
      value: formData.seatId
    });
    setFormData({ ...formData, qrCodeImageSrc: qrCode.toDataURL() });

    try {
      const response = await bookingApi.createBooking(formData);
      console.log("🚀 ~ handlePayment ~ response:", response);

      handleClosePaymentModal();
      handleCloseModalBooking();

      const message = `
        Please present the QR code before entering the event (this code will be
        sent via email, please check your inbox including <b>spam</b> folder)
      `;
      swalService.showHtmlMessage("Booking Successful!", message, "success");

      // Reset form data
      setFormData({
        seatId: "",
        seatNumber: "",
        seasonId: "",
        seasonName: "",
        fullName: "",
        studentId: "",
        email: "",
        phoneNumber: "",
        qrCodeImageSrc: ""
      });
    } catch (error) {
      handleError.showError(error);
    } finally {
      setLoadingBooking(false);
    }
  };

  return (
    <div>
      {loading || seatingPlan.length == 0 ? (
        <div id="preloader"></div>
      ) : (
        <div className="seating-plan">
          {seatingPlan.length > 0 &&
            seatingPlan.map((seasonData) => (
              <div
                key={seasonData.id}
                className={`season ${seasonData.name.toLowerCase()} col-12 col-md-5`}
              >
                <h3 className="text-center fw-bold">
                  {seasonData.name} Chairs
                </h3>
                {generateRows(seasonData.seats).map((row, index) => (
                  <div key={index} className="seat-wrapper">
                    {row.map((seat) => (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        seasonData={seasonData}
                        handleShowModalBooking={handleShowModalBooking}
                      ></Seat>
                    ))}
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}

      {loadingBooking && <Loading></Loading>}

      {/* Modal Seating Chart */}
      <Modal
        show={showModalSeatingChart}
        onHide={handleCloseModalSeatingChart}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Seating Chart</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src="/img/seat-chart.png" fluid alt="Seating Chart" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalSeatingChart}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Booking */}
      <Modal show={showModalBooking} onHide={handleCloseModalBooking} centered>
        <Form className="needs-validation" noValidate onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Seat Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="seasonName">
                  <Form.Label>Season</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.seasonName}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="seatNumber">
                  <Form.Label>Seat</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.seatNumber}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="studentId">
              <Form.Label>Student ID (Leave blank if not available)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. GCC200030 (capital letters)"
                value={formData.studentId}
                onChange={handleChange}
                isInvalid={errors.studentId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.studentId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                isInvalid={errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                isInvalid={errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalBooking}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Confirm Booking
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Model Display Payment */}
      <Modal
        show={showPaymentModal}
        onHide={handleClosePaymentModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src="/img/qr-bank.jpg" fluid alt="QR Bank" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handlePayment}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SeatingPlan;

import { useEffect, useState } from "react";
import bookingApi from "../../api/bookingApi";
import BaseLayout from "../../layouts/BaseLayout";
import swalService from "../../services/SwalService";
import handleError from "../../services/HandleErrors";
import formatDateTime from "../../services/FormatDateTime";
import DynamicDataTable from "../../components/table/DynamicDataTable";

const ManagePage = () => {
  const [bookings, setBookings] = useState([]);

  const columns = [
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true
    },
    {
      name: "Student ID",
      selector: (row) => row.studentId,
      sortable: true
    },
    {
      name: "Fullname",
      selector: (row) => row.fullName,
      sortable: true
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true
    },
    {
      name: "Season",
      selector: (row) => row.seat.season.name,
      sortable: true
    },
    {
      name: "Seat",
      selector: (row) => row.seat.number,
      sortable: true
    },
    {
      name: "Date",
      selector: (row) => row.booking_date,
      sortable: true
    },
    {
      name: "Action",
      cell: (row) => (
        <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
          Delete
        </button>
      )
    }
  ];

  const handleDelete = (id) => {
    swalService.confirmDelete(async () => {
      try {
        await bookingApi.Remove(id);
        setBookings((previousState) => {
          return previousState.filter((booking) => booking.id !== id);
        });
      } catch (error) {
        handleError.showError(error);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getAllBooking = await bookingApi.getAllBooking();

        // Format date
        getAllBooking.data.forEach((res) => {
          res.booking_date = formatDateTime.toDateTimeString(res.dateCreated);
        });

        // Set data to state
        setBookings(getAllBooking.data);
      } catch (error) {
        handleError.showError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <BaseLayout>
      <h1 className="mt-3 fw-bold text-center">Manage Page</h1>
      <DynamicDataTable columns={columns} rows={bookings}></DynamicDataTable>
    </BaseLayout>
  );
};

export default ManagePage;

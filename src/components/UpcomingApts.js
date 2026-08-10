import { API_BASE_URL } from "../config/api";
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import AppointmentCalendar from './AppointmentCalendar';

const UserBookingsDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/Booking/my-bookings`, // ✅ correct API
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-4" />;

  const upcoming = bookings.filter(
    b => b.status === 'Accepted' || b.status === 'Upcoming'
  );

  const completed = bookings.filter(
    b => b.status === 'Completed' || b.status === 'Cancelled'
  );

  return (
    <div className="container mt-4">
      {/* 📊 Stats Cards */}
      <Row className="mb-4">
        <Col>
          <Card bg="primary" text="white" className="text-center">
            <Card.Body>
              <Card.Title>Total Bookings</Card.Title>
              <h2>{bookings.length}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card bg="success" text="white" className="text-center">
            <Card.Body>
              <Card.Title>Upcoming</Card.Title>
              <h2>{upcoming.length}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card bg="secondary" text="white" className="text-center">
            <Card.Body>
              <Card.Title>Completed</Card.Title>
              <h2>{completed.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ℹ️ Optional empty state message */}
      {bookings.length === 0 && (
        <Alert variant="info" className="text-center">
          You have no bookings yet.
        </Alert>
      )}

      {/* 📅 Calendar always visible */}
      <AppointmentCalendar bookings={bookings} />
    </div>
  );
};

export default UserBookingsDashboard;

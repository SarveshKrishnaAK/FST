import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Users, Edit2, Trash2, Plus, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTurfModal, setShowTurfModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingTurf, setEditingTurf] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(false);
  
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    phone: '',
    turfId: '',
    date: '',
    timeSlot: '',
    duration: 1,
    players: 10
  });

  const [turfForm, setTurfForm] = useState({
    name: '',
    location: '',
    pricePerHour: '',
    capacity: ''
  });

  useEffect(() => {
    loadBookings();
    loadTurfs();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      alert('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadTurfs = async () => {
    try {
      const response = await axios.get(`${API_URL}/turfs`);
      setTurfs(response.data);
    } catch (error) {
      console.error('Error loading turfs:', error);
      alert('Failed to load turfs');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const turf = turfs.find(t => t._id === bookingForm.turfId);
    if (!turf) {
        alert('Please select a valid turf');
        return;
    }
    const totalPrice = turf.pricePerHour * bookingForm.duration;
    
    const bookingData = {
        customerName: bookingForm.customerName,
        phone: bookingForm.phone,
        turfId: bookingForm.turfId, 
        turfName: turf.name,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        duration: parseInt(bookingForm.duration),
        players: parseInt(bookingForm.players),
        totalPrice: totalPrice,
        status: 'confirmed'
    };

    try {
      if (editingBooking) {
        await axios.put(`${API_URL}/bookings/${editingBooking._id}`, bookingData);
        alert('Booking updated successfully!');
      } else {
        await axios.post(`${API_URL}/bookings`, bookingData);
        alert('Booking created successfully!');
      }
      await loadBookings();
      resetBookingForm();
    } catch (error) {
      console.error('Error saving booking:', error);
      alert('Failed to save booking');
    }
  };

  const handleTurfSubmit = async (e) => {
    e.preventDefault();
    
    const turfData = {
      ...turfForm,
      pricePerHour: parseInt(turfForm.pricePerHour),
      capacity: parseInt(turfForm.capacity)
    };

    try {
      if (editingTurf) {
        await axios.put(`${API_URL}/turfs/${editingTurf._id}`, turfData);
        alert('Turf updated successfully!');
      } else {
        await axios.post(`${API_URL}/turfs`, turfData);
        alert('Turf created successfully!');
      }
      loadTurfs();
      resetTurfForm();
    } catch (error) {
      console.error('Error saving turf:', error);
      alert('Failed to save turf');
    }
  };

  const deleteBooking = async (id) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`${API_URL}/bookings/${id}`);
        loadBookings();
        alert('Booking deleted successfully!');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking');
      }
    }
  };

  const deleteTurf = async (id) => {
    if (confirm('Are you sure you want to delete this turf?')) {
      try {
        await axios.delete(`${API_URL}/turfs/${id}`);
        loadTurfs();
        alert('Turf deleted successfully!');
      } catch (error) {
        console.error('Error deleting turf:', error);
        alert('Failed to delete turf');
      }
    }
  };

  const editBooking = (booking) => {
    setEditingBooking(booking);
    setBookingForm({
      customerName: booking.customerName,
      phone: booking.phone,
      turfId: booking.turfId,
      date: booking.date,
      timeSlot: booking.timeSlot,
      duration: booking.duration,
      players: booking.players
    });
    setShowModal(true);
  };

  const editTurf = (turf) => {
    setEditingTurf(turf);
    setTurfForm({
      name: turf.name,
      location: turf.location,
      pricePerHour: turf.pricePerHour.toString(),
      capacity: turf.capacity.toString()
    });
    setShowTurfModal(true);
  };

  const resetBookingForm = () => {
    setBookingForm({
      customerName: '',
      phone: '',
      turfId: '',
      date: '',
      timeSlot: '',
      duration: 1,
      players: 10
    });
    setEditingBooking(null);
    setShowModal(false);
  };

  const resetTurfForm = () => {
    setTurfForm({
      name: '',
      location: '',
      pricePerHour: '',
      capacity: ''
    });
    setEditingTurf(null);
    setShowTurfModal(false);
  };

  const timeSlots = ['06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* Header */}
      <div className="bg-green-950 shadow-2xl border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">TurfBook Pro</h1>
                <p className="text-green-300 text-sm">Premium Turf Management System</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTurfModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Turf
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-green-500 to-lime-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-lime-600 transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> New Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-green-950 text-green-300 hover:bg-green-900'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('turfs')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'turfs'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-green-950 text-green-300 hover:bg-green-900'
            }`}
          >
            Turfs ({turfs.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center text-white text-xl py-12">Loading...</div>
        ) : activeTab === 'bookings' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.length === 0 ? (
              <div className="col-span-full bg-green-950 rounded-xl p-12 text-center border-2 border-green-800">
                <Calendar className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-green-300 text-lg">No bookings yet. Create your first booking!</p>
              </div>
            ) : (
              bookings.map(booking => (
                <div key={booking._id} className="bg-gradient-to-br from-green-950 to-green-900 rounded-xl p-5 shadow-xl border-2 border-green-700 hover:border-green-500 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-600 px-3 py-1 rounded-lg">
                      <p className="text-white font-bold text-sm">{booking.status.toUpperCase()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editBooking(booking)} className="text-green-400 hover:text-green-300 transition">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => deleteBooking(booking._id)} className="text-red-400 hover:text-red-300 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{booking.customerName}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-300">
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold">{booking.turfName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-300">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-300">
                      <Clock className="w-4 h-4" />
                      <span>{booking.timeSlot} ({booking.duration}h)</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-300">
                      <Users className="w-4 h-4" />
                      <span>{booking.players} players</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-green-700">
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-green-400">₹{booking.totalPrice}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turfs.map(turf => (
              <div key={turf._id} className="bg-gradient-to-br from-emerald-950 to-green-900 rounded-xl p-6 shadow-xl border-2 border-emerald-700 hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editTurf(turf)} className="text-green-400 hover:text-green-300 transition">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteTurf(turf._id)} className="text-red-400 hover:text-red-300 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{turf.name}</h3>
                <p className="text-green-300 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {turf.location}
                </p>
                
                <div className="space-y-3">
                  <div className="bg-green-900 rounded-lg p-3">
                    <p className="text-green-400 text-sm">Price per Hour</p>
                    <p className="text-2xl font-bold text-white">₹{turf.pricePerHour}</p>
                  </div>
                  <div className="bg-green-900 rounded-lg p-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-400 text-sm">Capacity</p>
                      <p className="text-xl font-bold text-white">{turf.capacity} players</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-green-950 to-green-900 rounded-2xl p-8 max-w-2xl w-full border-2 border-green-600 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">
                {editingBooking ? 'Edit Booking' : 'New Booking'}
              </h2>
              <button onClick={resetBookingForm} className="text-green-400 hover:text-green-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-300 font-semibold mb-2">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
                    className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-green-300 font-semibold mb-2">Select Turf</label>
                <select
                  required
                  value={bookingForm.turfId}
                  onChange={(e) => setBookingForm({...bookingForm, turfId: e.target.value})}
                  className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="">Choose a turf</option>
                  {turfs.map(turf => (
                    <option key={turf._id} value={turf._id}>
                      {turf.name} - ₹{turf.pricePerHour}/hr
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-300 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 font-semibold mb-2">Time Slot</label>
                  <select
                    required
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm({...bookingForm, timeSlot: e.target.value})}
                    className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-300 font-semibold mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({...bookingForm, duration: parseInt(e.target.value)})}
                    className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 font-semibold mb-2">Number of Players</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={bookingForm.players}
                    onChange={(e) => setBookingForm({...bookingForm, players: parseInt(e.target.value)})}
                    className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBookingSubmit}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
                <button
                  onClick={resetBookingForm}
                  className="px-8 bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Turf Modal */}
      {showTurfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-emerald-950 to-green-900 rounded-2xl p-8 max-w-xl w-full border-2 border-emerald-600 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">
                {editingTurf ? 'Edit Turf' : 'Add New Turf'}
              </h2>
              <button onClick={resetTurfForm} className="text-green-400 hover:text-green-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-green-300 font-semibold mb-2">Turf Name</label>
                <input
                  type="text"
                  required
                  value={turfForm.name}
                  onChange={(e) => setTurfForm({...turfForm, name: e.target.value})}
                  className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-green-300 font-semibold mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={turfForm.location}
                  onChange={(e) => setTurfForm({...turfForm, location: e.target.value})}
                  className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-green-300 font-semibold mb-2">Price per Hour (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={turfForm.pricePerHour}
                    onChange={(e) => setTurfForm({...turfForm, pricePerHour: e.target.value})}
                    className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-green-300 font-semibold mb-2">Capacity (players)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={turfForm.capacity}
                    onChange={(e) => setTurfForm({...turfForm, capacity: e.target.value})}
                    className="w-full bg-green-900 border-2 border-green-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleTurfSubmit}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg"
                >
                  {editingTurf ? 'Update Turf' : 'Add Turf'}
                </button>
                <button
                  onClick={resetTurfForm}
                  className="px-8 bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
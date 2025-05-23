import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or want to book an artist? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaMapMarkerAlt className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Our Address</h3>
                  <p className="text-gray-600">Fourways, Johannesburg, South Africa</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaPhone className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Phone Number</h3>
                  <p className="text-gray-600">+27 71 111 1111</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaEnvelope className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Email Address</h3>
                  <p className="text-gray-600">info@mygigguide.co.za</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaClock className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Working Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 - 17:00</p>
                  <p className="text-gray-600">Saturday: 10:00 - 14:00</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="font-medium text-gray-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-100 hover:bg-indigo-100 p-3 rounded-full transition-colors">
                  <FaFacebook className="text-indigo-600 text-xl" />
                </a>
                <a href="#" className="bg-gray-100 hover:bg-indigo-100 p-3 rounded-full transition-colors">
                  <FaTwitter className="text-indigo-600 text-xl" />
                </a>
                <a href="#" className="bg-gray-100 hover:bg-indigo-100 p-3 rounded-full transition-colors">
                  <FaInstagram className="text-indigo-600 text-xl" />
                </a>
                <a href="#" className="bg-gray-100 hover:bg-indigo-100 p-3 rounded-full transition-colors">
                  <FaLinkedin className="text-indigo-600 text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+27 12 345 6789"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Artist Booking</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback/Suggestions</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden">
          <iframe
            title="My Gig Guide Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.041955614843!2d28.01358231502896!3d-26.19373998344193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c1b6e36a3a5%3A0x3a8a6a5d1a3a3a3a!2sFourways%2C%20Johannesburg!5e0!3m2!1sen!2sza!4v1620000000000!5m2!1sen!2sza"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
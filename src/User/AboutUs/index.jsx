import React from 'react';
import Navbar from '../../components/Navbar';
import './style.css';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="about-container">

        {/* Hero Section */}
        <section className="about-hero">
          <h1 className="about-hero-title">About Easy Rental</h1>
          <p className="about-hero-subtitle">
            Nepal’s Most Convenient Rental Marketplace
          </p>
          <p className="about-hero-intro">
            At <strong>Easy Rental</strong>, we believe renting should be simple, stress-free, and accessible for everyone. Whether you're looking for a temporary stay, a long-term apartment, or a platform to list your own property, we provide a seamless and secure experience that puts your needs first. Our platform is designed to empower renters and vendors with all the tools and support they need — right at their fingertips.
          </p>
        </section>

        {/* Why Easy Rental */}
        <section className="about-section light-bg">
          <h2 className="section-title">Why Choose Easy Rental?</h2>
          <p>
            Easy Rental is more than just a platform — it's a commitment to reliability, innovation, and service. We’ve built a space where anyone, from travelers to students to working professionals, can find the perfect place to stay without hassle. For property owners, we offer visibility, simplicity, and a reliable way to manage and grow your rental business. Our focus on verified listings, transparent pricing, and responsive customer support ensures that every interaction on Easy Rental is a step toward trust and satisfaction. Join a growing network of users who believe in smarter renting.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="about-section">
          <h2 className="section-title">Our Mission & Vision</h2>
          <div className="section-grid">
            <div>
              <h3 className="section-subtitle">🎯 Our Mission</h3>
              <p>
                Our mission is to simplify the rental process for both renters and property owners through modern technology, trustworthy practices, and personalized support. We aim to eliminate the confusion and inefficiencies of traditional renting by providing a platform that makes searching, booking, and managing rentals easier than ever.
              </p>
            </div>
            <div>
              <h3 className="section-subtitle">🌍 Our Vision</h3>
              <p>
                We envision a future where anyone in Nepal can access comfortable and affordable rental spaces with confidence and convenience. Easy Rental aspires to be the leading digital rental marketplace in the country — not only through innovation and efficiency but by building a community rooted in trust, collaboration, and growth.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="about-section light-bg">
          <h2 className="section-title">Our Core Values</h2>
          <p>
            At the heart of Easy Rental are values that guide every decision we make. We believe in transparency — ensuring both renters and vendors feel informed and respected. Innovation drives our development, allowing us to continually enhance user experiences. We prioritize community by supporting local property owners and helping travelers explore Nepal comfortably. And above all, we believe in putting people first — making it our mission to understand and meet the needs of those who rely on our platform every day.
          </p>
        </section>

        {/* What We Offer */}
        <section className="about-section">
          <h2 className="section-title">What We Offer</h2>
          <div className="section-grid">
            <div className="offer-card renter">
              <h3 className="card-title">For Renters</h3>
              <p>
                As a renter, you gain access to a diverse collection of verified properties across Nepal. Our intuitive search and filter tools let you find homes, rooms, or short-term stays that match your needs and budget. With secure online bookings, real-time availability, and dedicated customer support, Easy Rental ensures your next stay is just a few clicks away — reliable, affordable, and exactly what you’re looking for.
              </p>
            </div>
            <div className="offer-card vendor">
              <h3 className="card-title">For Vendors</h3>
              <p>
                If you're a property owner or manager, Easy Rental gives you everything you need to grow your rental business. Create listings effortlessly, showcase your space with photos and details, and manage all bookings from a centralized vendor dashboard. With insights into earnings and performance, plus marketing tools to expand your reach, we help you turn your space into a consistent source of income — all with the support of our trusted platform.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <h2 className="section-title">Be Part of the Easy Rental Journey</h2>
          <p>
            Whether you’re a traveler looking for your next home away from home, or a vendor ready to share your property with the world — Easy Rental is here to support you. Join a platform designed for modern renters and forward-thinking vendors. Your rental journey begins here.
          </p>
          <div className="cta-buttons">
            <a href="Register" className="btn btn-primary">Get Started</a>
            <a href="Contact" className="btn btn-outline">Contact Us</a>
          </div>
        </section>

      </div>
    </>
  );
};

export default AboutUs;

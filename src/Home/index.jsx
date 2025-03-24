import React from 'react';
import Navbar from "../components/Navbar";
import SearchForm from '../components/SearchForm';
import "./style.css"; 

const Home = () => {
    return (
        <>
            <Navbar />
            <header>
                <div className = "header-content">
                    <h2>Find the best Places To Stay</h2>
                </div>
                
            </header>
            <SearchForm/>
        </>
    );
}

export default Home;
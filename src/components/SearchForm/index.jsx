import { useState } from "react";
import "./style.css";

const SearchForm = ({ onSearch }) => {
    const [city, setCity] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const searchData = {
            city,
            check_in: checkIn,
            check_out: checkOut,
            price
        };

        if (onSearch) {
            onSearch(searchData); // passes correct keys to backend
        } else {
            console.log("No onSearch handler provided:", searchData);
        }
    };

    return (
        <form className="search-form-horizontal" onSubmit={handleSubmit}>
            <div className="search-input">
                <label htmlFor="city">City</label>
                <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                />
            </div>

            <div className="search-input">
                <label htmlFor="check-in">Check-in</label>
                <input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                />
            </div>

            <div className="search-input">
                <label htmlFor="check-out">Check-out</label>
                <input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                />
            </div>

            <div className="search-input">
                <label htmlFor="price">Your Price</label>
                <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                />
            </div>

            <button type="submit" className="searchbox-button">
                Search
            </button>
        </form>
    );
};

export default SearchForm;

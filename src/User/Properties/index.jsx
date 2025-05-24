import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import Navbar from "../../components/Navbar";
import SearchForm from "../../components/SearchForm";
import { baseUrl } from "../../constants";
import toast from "react-hot-toast";
import PropertyCard from "../../components/PropertyCard";

const Properties = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [sortOption, setSortOption] = useState("");

  // filters for checkboxes & price input
  const [filters, setFilters] = useState({
    price: "",
    facilities: {
      parking: false,
      wifi: false,
      pets: false,
      pool: false,
    },
    rating: {
      one: false,
      two: false,
      three: false,
      four: false,
      five: false,
    },
  });

  // query params from URL (city, category, check_in, check_out, price)
  const [query, setQuery] = useState({
    city: "",
    category: "",
    check_in: "",
    check_out: "",
    price: "",
  });

  // On mount or location change: parse URL params and set query + filters.price
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city") || "";
    const category = params.get("category") || "";
    const check_in = params.get("check_in") || "";
    const check_out = params.get("check_out") || "";
    const price = params.get("price") || "";

    setQuery({ city, category, check_in, check_out, price });

    setFilters((prev) => ({
      ...prev,
      price: price,
    }));

    // Fetch properties with all filters combined (query + filters)
    fetchProperties({ city, category, check_in, check_out, price, ...filters });
  }, [location]);

  // Fetch properties helper
  const fetchProperties = async (customFilters = {}) => {
    try {
      const filterString = buildFilterQueryFrom(customFilters);
      const response = await fetch(`${baseUrl}getProperty.php?${filterString}`);
      const data = await response.json();
      if (data.success) {
        setProperties(data.properties);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Error fetching properties.");
    }
  };

  // Build URL params from filters & query combined
  const buildFilterQueryFrom = (customQuery) => {
    const urlParams = new URLSearchParams();

    if (customQuery.city) urlParams.append("city", customQuery.city);
    if (customQuery.category) urlParams.append("category", customQuery.category);
    if (customQuery.check_in) urlParams.append("check_in", customQuery.check_in);
    if (customQuery.check_out) urlParams.append("check_out", customQuery.check_out);
    if (customQuery.price) urlParams.append("price", customQuery.price);

    const facilities = customQuery.facilities || {};
    Object.entries(facilities).forEach(([key, value]) => {
      if (value) urlParams.append(key, "1");
    });

    const rating = customQuery.rating || {};
    const selectedRatings = Object.entries(rating)
      .filter(([_, checked]) => checked)
      .map(([key]) => {
        const map = { one: 1, two: 2, three: 3, four: 4, five: 5 };
        return map[key];
      });

    if (selectedRatings.length > 0) {
      urlParams.append("rating", selectedRatings.join(","));
    }

    return urlParams.toString();
  };

  // When filters change (facilities, rating, price input), update filters state and refetch
 const lastUrlRef = useRef("");

useEffect(() => {
  const combined = {
    ...query,
    price: filters.price,
    facilities: filters.facilities,
    rating: filters.rating,
  };
  fetchProperties(combined);

  const newParams = buildFilterQueryFrom(combined);

  // Avoid redundant navigation to the same URL
  if (lastUrlRef.current !== newParams) {
    lastUrlRef.current = newParams;
    navigate(`/User/Properties?${newParams}`, { replace: true });
  }
}, [filters.facilities, filters.rating, filters.price, query]);


  // Toggle favorite (optional feature, kept as-is)
  const toggleFavorite = (propertyId) => {
    setFavorites((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  // Handle checkbox filter changes for facilities & rating
  const handleFilterChange = (category, name, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value,
      },
    }));
  };

  // Handle price input change
  const handlePriceChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      price: value,
    }));
  };

  // Clear all filters and reset URL
  const clearFilters = () => {
    const clearedFilters = {
      price: "",
      facilities: {
        parking: false,
        wifi: false,
        pets: false,
        pool: false,
      },
      rating: {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false,
      },
    };

    setFilters(clearedFilters);
    setQuery({
      city: "",
      category: "",
      check_in: "",
      check_out: "",
      price: "",
    });

    navigate("/User/Properties", { replace: true });
    // fetchProperties({}); // fetch all properties with no filters
  };

  // Handle SearchForm submission
  const handleSearch = (searchData) => {
    const params = new URLSearchParams();

    if (searchData.city) params.append("city", searchData.city);
    if (searchData.checkIn) params.append("check_in", searchData.checkIn);
    if (searchData.checkOut) params.append("check_out", searchData.checkOut);
    if (searchData.price) params.append("price", searchData.price);

    navigate(`/User/Properties?${params.toString()}`);
  };

  // Sort properties based on selection
  const sortedProperties = useMemo(() => {
    const sorted = [...properties];

    if (sortOption === "price-low") {
      sorted.sort((a, b) => a.price_per_night - b.price_per_night);
    } else if (sortOption === "price-high") {
      sorted.sort((a, b) => b.price_per_night - a.price_per_night);
    } else if (sortOption === "rating-high") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "rating-low") {
      sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    }

    return sorted;
  }, [sortOption, properties]);

  return (
    <>
      <Navbar />
      <header className="header-head">
        <div className="search-form">
          <SearchForm onSearch={handleSearch} />
        </div>
      </header>

      <div className="property-container">
        <div className="properties-content">
          <div className="filter-section">
            <div className="filter-card">
              <div className="filter-title">Filter by:</div>
              <div className="budget-filter">
                <label>Your price range:</label>
                <input
                  type="number"
                  placeholder="Enter your price"
                  value={filters.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                />
                <div className="filter-buttons">
                  <button className="clear-button" onClick={clearFilters}>
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <div className="filter-card">
              <div className="filter-title">Facilities:</div>
              <div className="filter-group">
                {["parking", "wifi", "pets", "pool"].map((facility) => (
                  <div className="filter-option" key={facility}>
                    <input
                      type="checkbox"
                      id={facility}
                      checked={filters.facilities[facility]}
                      onChange={(e) =>
                        handleFilterChange("facilities", facility, e.target.checked)
                      }
                    />
                    <label htmlFor={facility}>
                      {facility.charAt(0).toUpperCase() + facility.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-card">
              <div className="filter-title">Property rating:</div>
              <div className="filter-group">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div className="filter-option" key={star}>
                    <input
                      type="checkbox"
                      id={`${star}-star`}
                      checked={filters.rating[["one", "two", "three", "four", "five"][star - 1]]}
                      onChange={(e) =>
                        handleFilterChange(
                          "rating",
                          ["one", "two", "three", "four", "five"][star - 1],
                          e.target.checked
                        )
                      }
                    />
                    <label htmlFor={`${star}-star`}>{star} star</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="property-list">
            <div className="properties-header">
              <div className="properties-count">{sortedProperties.length} properties found</div>
              <select
                className="sort-dropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating-high">Rating: High to Low</option>
                <option value="rating-low">Rating: Low to High</option>
              </select>
            </div>

            <div className="property-list">
              {sortedProperties.length > 0 ? (
                sortedProperties.map((property) => (
                  <PropertyCard key={property.property_id} property={property} />
                ))
              ) : (
                <p className="no-properties">No properties available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Properties;

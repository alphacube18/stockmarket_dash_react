const SearchBar = ({ onSearch }) => {
    const handleSearch = (e) => {
      if (e.key === "Enter") {
        onSearch(e.target.value.toUpperCase());
        e.target.value = "";
      }
    };
  
    return <input type="text" placeholder="Search Stock..." onKeyPress={handleSearch} />;
  };
  
  export default SearchBar;
  
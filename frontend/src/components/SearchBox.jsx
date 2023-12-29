import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };
  return (
    <>
      <form
        className="d-flex form-inline my-2 my-lg-0"
        onSubmit={submitHandler}
      >
        <input
          className=" form-control mr-sm-2 ml-sm-5"
          type="search"
          placeholder="Search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          className=" btn btn-outline-light mx-3 my-2 my-sm-0"
          type="submit"
        >
          Search
        </button>
      </form>
    </>
  );
};

export default SearchBox;

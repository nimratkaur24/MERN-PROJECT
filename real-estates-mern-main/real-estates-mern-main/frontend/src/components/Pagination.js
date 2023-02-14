import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../features/listings/listingsSlice";
import paginationStyles from "../pagination.css";

const Pagination = () => {
  const dispatch = useDispatch();
  const {
    page,
    pages,
    pagination: { next, prev },
  } = useSelector((state) => state.listings);

  const numOfPagesArr = Array.from({ length: pages }, (_, idx) => idx + 1);

  return (
    pages > 1 && (
      <div className="pagination">
        <ul>
          <li
            className={`btn ${prev ? "d-block" : "d-none"}`}
            onClick={() => dispatch(setPage(page - 1))}
          >
            <i className="fas fa-arrow-left"></i>
          </li>
          {numOfPagesArr?.map((idx) => {
            return (
              <li
                key={idx}
                className={idx === page ? "numb active" : "numb"}
                onClick={() => dispatch(setPage(idx))}
              >
                {idx}
              </li>
            );
          })}
          <li
            className={`btn ${next ? "d-block" : "d-none"}`}
            onClick={() => dispatch(setPage(page + 1))}
          >
            <i className="fas fa-arrow-right"></i>
          </li>
        </ul>
      </div>
    )
  );
};

export default Pagination;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";

export default function usePagination(collections, { pageSize = 12 } = {}) {
  const navigate = useNavigate();
  const query = useQuery();
  const page = Number(query.get("page") || "1");
  const [entries, setEntries] = useState([]);
  const [isTriggered, setTriggered] = useState(false);
  const [isPreviousPageDisabled, setPreviousPageDisabled] = useState(true);
  const [isNextPageDisabled, setNextPageDisabled] = useState(false);
  const entriesSize = collections.length;
  const pageCount = Math.ceil(entriesSize / pageSize);

  const nextPage = () => {
    if (isNextPageDisabled) return;

    const query = new URLSearchParams({ page: page + 1 });
    navigate({ pathname: window.location.pathname, search: query.toString() });
  };

  const previousPage = () => {
    if (isPreviousPageDisabled) return;

    const query = new URLSearchParams({ page: page - 1 });
    navigate({ pathname: window.location.pathname, search: query.toString() });
  };

  useEffect(() => {
    const entries = collections.slice((page - 1) * pageSize, page * pageSize);

    setEntries(entries);
    setNextPageDisabled(page === pageCount);
    setPreviousPageDisabled(page === 1);
  }, [page]);

  return {
    entries,
    setEntries,
    page,
    pageSize,
    pageCount,
    entriesSize,
    isPreviousPageDisabled,
    isNextPageDisabled,
    nextPage,
    previousPage,
  };
}

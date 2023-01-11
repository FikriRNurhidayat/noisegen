import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Noise from "../components/Noise";
import { useNoises } from "../contexts/NoiseContext";
import usePagination from "../hooks/usePagination";
import "./NoiseGallery.css";

export default function NoiseGallery() {
  const navigate = useNavigate();
  const [noises, setNoises] = useNoises();
  const {
    entries,
    page,
    pageCount,
    nextPage,
    previousPage,
    isNextPageDisabled,
    isPreviousPageDisabled,
    setEntries,
  } = usePagination(noises);

  const onNoiseError = async () => {
    await setNoises([]);
    await setEntries([]);
  };

  const getBlobId = (blobUrl) => {
    return blobUrl.split(`blob:${window.location.origin}/`)[1];
  };

  useEffect(() => {
    if (entries.length <= 0) navigate(window.location.pathname);
  }, [entries]);

  return (
    <MainLayout>
      <div className="NoiseGallery">
        <div className="NoiseGallery--header">
          <h1 className="NoiseGallery--title">Noises</h1>
          <div className="NoiseGallery--subtitle">
            Generated noises. We're using the perlin noise to generate this. And
            it is meant to be pixelated for artistic purposes.
          </div>

          <nav className="NoiseGallery--navigation">
            <Link to="/">Generate</Link>
          </nav>
        </div>

        {entries.length > 0 && (
          <>
            <div className="NoiseGallery--body">
              {entries.map((noiseURL, index) => (
                <Noise
                  key={index}
                  src={noiseURL}
                  onError={onNoiseError}
                  href={`/noises/${getBlobId(noiseURL)}`}
                />
              ))}
            </div>

            <nav className="NoiseGallery--pagination">
              <button
                onClick={() => previousPage()}
                disabled={isPreviousPageDisabled}
              >
                Previous
              </button>

              <div>
                Page {page} of {pageCount}
              </div>

              <button onClick={() => nextPage()} disabled={isNextPageDisabled}>
                Next
              </button>
            </nav>
          </>
        )}
      </div>
    </MainLayout>
  );
}

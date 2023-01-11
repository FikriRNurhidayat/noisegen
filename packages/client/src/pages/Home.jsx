import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Menu from "../components/Menu";
import Loading from "../components/Loading";
import { useNoises } from "../contexts/NoiseContext";
import { NOISEGEN_API_URL } from "../config";
import "./Home.css";

function Home() {
  const [isProcessing, setProcessing] = useState(false);
  const [process, setProcess] = useState(0);
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const [finished, setFinished] = useState(0);
  const [noises, setNoises] = useNoises();
  const navigate = useNavigate();

  const createNoise = async () => {
    const response = await fetch(`${NOISEGEN_API_URL}/noises:random`);
    if (!response.ok) return Promise.reject();

    return response;
  };

  const onNoiseCreated = async (response) => {
    if (finished % 100 !== 0) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    return setNoises((noises) => [...noises, url]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await setNoises([]);
    await setFinished(0);
    await setSuccess(0);
    await setFailed(0);

    const formData = new FormData(e.target);
    const form = new Object();
    for (var [key, value] of formData.entries()) form[key] = value;

    const requests = [];

    for (let i = 0; i < Number(form.total); i++) {
      const request = createNoise()
        .then(onNoiseCreated)
        .catch((err) => setFailed((e) => e + 1))
        .finally(() => setFinished((e) => e + 1));

      requests.push(request);
    }

    await setProcess(requests.length);
    await setProcessing(true);

    await Promise.all(requests);

    await setProcessing(false);

    await navigate("/noises");
  };

  return (
    <MainLayout>
      {!isProcessing && <Menu onSubmit={onSubmit} />}
      {isProcessing && <Loading value={finished} max={process} />}
    </MainLayout>
  );
}

export default Home;

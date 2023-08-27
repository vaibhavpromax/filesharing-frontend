import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [view, setView] = useState("UPLOAD");
  const [sessionInfo, setSessionInfo] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [uploadUrl, setUploadUrl] = useState("");
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const getSession = async () => {
    axios
      .get("http://localhost:3000/files/get-session")
      .then((response) => {
        setUploadUrl(response?.data?.uploadUrl);
        setSessionInfo(response?.data?.newFileData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    getSession();
  }, []);

  const handleFileUploaded = async (name, type) => {
    const patchUrl = `http://localhost:3000/files/markUploaded?machine_id=${sessionInfo?.machineid}&file_name=${name}&file_type=${type}`;
    axios
      .patch(patchUrl)
      .then((response) => {
        console.log(response);
        setShowCode(true);
        setView("DONE");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNewUpload = async () => {
    getSession();
    setView("UPLOAD");
    setShowCode(false);
    setSelectedFile(null);
    setUploadStatus("");
  };

  console.log(selectedFile);
  const handleUpload = async () => {
    if (selectedFile) {
      setUploadStatus("Uploading...");
      axios
        .put(uploadUrl, selectedFile, {
          headers: {
            "Content-Type": selectedFile.type,
          },
        })
        .then((response) => {
          setUploadStatus("File uploaded successfully!");
          handleFileUploaded(selectedFile.name, selectedFile.type);
        })
        .catch((error) => {
          console.log(error);
          setUploadStatus("Error uploading file.");
        });
    } else {
      setUploadStatus("Please select a file to upload.");
    }
  };

  return (
    <div className="App">
      <h1>File Sharing Website</h1>
      {view === "UPLOAD" && (
        <>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
          <p>{uploadStatus}</p>
        </>
      )}
      {view === "DONE" && (
        <>
          <p>File uploaded successfully</p>
          <button onClick={handleNewUpload}>Upload Another file</button>
        </>
      )}
      {showCode && (
        <h4 className="code">Your unique code is {sessionInfo?.unique_code}</h4>
      )}
    </div>
  );
}
export default App;

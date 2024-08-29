import React, { useState, useEffect, useRef } from "react";
import MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import axios from "axios";
import "./App.css";
import { format } from "timeago.js"; // Import format from timeago.js
import Register from "./pages/register";
import Login from "./pages/login";

function App() {
  const mapContainer = useRef(null);
  const popupContentRef = useRef(null);
  const [currentUser, setcurrentUser] = useState(null);
  // const currentUser = "Jessica";
  const [pinsData, setPinsData] = useState([]);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  var newPlace1 = { lat: 0, long: 0 };
  const [title, setTitle] = useState(null);
  const [desc, setdesc] = useState(null);
  const [rating, setrating] = useState(1);
  const [viewPort, setviewPort] = useState({
    width: "100vh",
    height: "100vh",
    lat: 74.1399,
    long: 26.1046,
    zoom: 5,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/pins")
      .then((response) => {
        setPinsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pins data:", error);
      });
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlace(id);
    setviewPort({ ...viewPort, lat: long, long: lat });
    console.log(id, lat, long);
  };
  const handleSubmit = async (e) => {
    if (newPlace) {
      e.preventDefault();
      const newPin = {
        username: currentUser,
        title: title,
        desc: desc,
        rating: rating,
        long: newPlace.long,
        lat: newPlace.lat,
      };
      console.log(newPin);
      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/pins",
          newPin
        );
        console.log(res.data);
        setPinsData([...pinsData, res.data]);
        setNewPlace(null);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("New place does not exist");
    }
  };
  const handleLogout = () => {
    setcurrentUser(null);
  };
  useEffect(() => {
    console.log("nkcwkj");
    const map = new MapLibreGL.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: [viewPort.lat, viewPort.long],
      zoom: viewPort.zoom,
      pitch: 30,
    });
    const handleDoubleClick = (e) => {
      const newLat = e.lngLat.lat;
      const newLng = e.lngLat.lng;
      console.log("hey");
      console.log(newLat, newLng);
      // const {newLat, newLng} = e.lngLat;
      // newPlace1 = { lat: newLat, long: newLng };
      setNewPlace({ lat: newLat, long: newLng });
      // console.log("h21");
      // const Popup = new MapLibreGL.Popup()
      //   .setLngLat(e.lngLat)
      //   .setDOMContent(popupContentRef.current)
      //   .addTo(map);
      console.log("h12");
      // console.log(newPlace);
    };
    newPlace &&
      new MapLibreGL.Popup()
        .setLngLat([newPlace.long, newPlace.lat])
        .setDOMContent(popupContentRef.current)
        .addTo(map);
    map.on("dblclick", handleDoubleClick);

    pinsData &&
      pinsData.map((pin) => {
        const formattedTime = format(pin.updatedAt, "en_US"); // Use format
        const popupContent = `
        <div className="card">
          <label>Place</label>
          <h4 className="place">${pin.title}</h4>
          <label>Review</label>
          <p className="desc">${pin.desc}</p>
          <label>Rating</label>
          <div className="stars">
            ${Array(pin.rating).fill(
              '<i className="fa-solid fa-star star"></i>'
            )}
          </div>
          <label>Information</label>
          <span className="Person"> Created By ${pin.username}</span>
          <span className="date">${formattedTime}</span>
        </div>
      `;

        const marker = new MapLibreGL.Marker({
          color: currentUser === pin.username ? "tomato" : "slateblue",
        })
          .setLngLat([pin.long, pin.lat])
          .addTo(map);
        marker.setPopup(new MapLibreGL.Popup().setHTML(popupContent));

        marker.getElement().addEventListener("click", () => {
          handleMarkerClick(pin._id, pin.lat, pin.long);
        });
      });
    return () => {
      map.remove();
    };
  }, [pinsData, currentPlace, newPlace]);

  return (
    <div>
      <div className="button-container">
        {currentUser ? (
          <button className="btn logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div>
            <button
              className="btn login"
              onClick={() => {
                setShowLogin(true);
              }}
            >
              Login
            </button>
            <button
              className="btn register"
              onClick={() => {
                setShowRegister(true);
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>
      <div
        ref={mapContainer}
        style={{ width: "100vw", height: "100vh", position: "absolute" }}
      >
        <div ref={popupContentRef} style={{ display: "flex" }}>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <label htmlFor="">Title</label>
              <input
                type="text"
                placeholder="Enter a Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <label htmlFor="">Review</label>
              <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                placeholder="Write a Review"
                onChange={(e) => {
                  setdesc(e.target.value);
                }}
              ></textarea>
              <label htmlFor="">Rating</label>
              <select
                name=""
                id=""
                onChange={(e) => {
                  setrating(e.target.value);
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button type="submit" className="submitButton">
                Add Pin
              </button>
            </form>
          </div>
        </div>
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login setShowLogin={setShowLogin} setcurrentUser={setcurrentUser} />
        )}
      </div>
    </div>
  );
}
export default App;

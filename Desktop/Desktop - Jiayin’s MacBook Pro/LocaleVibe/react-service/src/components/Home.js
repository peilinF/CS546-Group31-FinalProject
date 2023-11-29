import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import * as statesList from "../state.json";
import moment from "moment";
import "../styles/Home.css";
import { useGeolocated } from "react-geolocated";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";

import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Stack,
} from "@mui/material";

const Home = () => {
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const [date, setDate] = useState(new Date());
  const [state, setState] = useState("");
  const [coordsInfo, setCoords] = useState(undefined);

  const posters = [
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F560482929%2F254534975312%2F1%2Foriginal.20230723-200119?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C1225%2C3300%2C1650&s=50c0e5e35bfab03a3b3f01a7ac18272e",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F612368789%2F1761888616903%2F1%2Foriginal.20231003-214737?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=180%2C0%2C1486%2C743&s=644b255f70bc1f3c01ef1e375613ed5e",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F598563219%2F1010958667043%2F1%2Foriginal.20230915-043654?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C8%2C1284%2C642&s=4c8dafbdcf941ee77700f06e823266cf",
    "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F632082469%2F240047042758%2F1%2Foriginal.20231031-154943?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=669d4513fef4a8645e29ad2da3820237",
  ];

  const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };
    const goToPrevious = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };
    const goToImage = (index) => {
      setCurrentIndex(index);
    };

    // Automatically switch to the next image every 3 seconds
    useEffect(() => {
      const interval = setInterval(goToNext, 5000);
      // Clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, []);

    const transformValue = `translateX(-${currentIndex * 100}%)`;

    return (
      <div className="carousel-images" >
        <div className="carousel-wrapper">
        <div className="carousel-images-container" style={{ transform: transformValue }}>
          {images.map((image, index) => (
           <img key={index} src={image} alt={`Carousel ${index}`} />
          ))}
        </div>
        {/* <img key={currentIndex} src={images[currentIndex]} /> */}
        <div className="slide_direction">
          <button onClick={goToPrevious} className="left-arrow">
            <svg viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M4 12l8 8 1.5-1.5L8 13h12v-2H8l5.5-5.5L12 4z"></path>
            </svg> 
          </button>
          <button onClick={goToNext} className="right-arrow">
            <svg viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.5 5.5L16 11H4v2h12l-5.5 5.5L12 20l8-8-8-8z"></path>
            </svg>
          </button>
        </div>
        </div>
        <div className="carousel-indicator">
          {images.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => goToImage(index)}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  // To get the current location
  const navigate = useNavigate();
  let { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  // When the user only select state and click the calendlar, it will fire to events/date/?page=1&date=${dateParms}&state=${state}
  // When the user use geolocation and click the calendlar, it will fire to `events/date/?page=1&date=${dateParms}&state=${coordsInfo.nearest[0].prov}&city=${coordsInfo.nearest[0].city}
  const hadleClickDate = (event, value) => {
    let dateParms = `${event.getFullYear()}-${
      event.getUTCMonth() + 1
    }-${event.getDate()}`;

    if (coordsInfo) {
      let state = coordsInfo.nearest[0].prov[0];
      let city = coordsInfo.nearest[0].city[0];
      state = state ? state.replace(/\s+/g, "-") : state;
      city = city ? city.replace(/\s+/g, "-") : city;
      console.log(state, city);
      navigate(
        `events/date/?page=1&date=${dateParms}&state=${state}&city=${city}`
      );
      setState(coordsInfo.nearest[0].prov);
    } else if (state) {
      navigate(`events/date/?page=1&date=${dateParms}&state=${state}`);
    } else {
      navigate("/");
    }
  };

  // To handle state drop down list
  const handleChange = (event) => {
    event.preventDefault();
    setState(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(
      state,
      moment(new Date(startDate.$d), "YYYY-MM-DD HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      moment(new Date(endDate.$d), "YYYY-MM-DD HH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss"
      )
    );
    let start_date = moment(
      new Date(startDate.$d),
      "YYYY-MM-DD HH:mm:ss"
    ).format("YYYY-MM-DDTHH:mm:ss");
    let end_date = moment(new Date(endDate.$d), "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    if (coordsInfo) {
      let state = coordsInfo.nearest[0].prov[0];
      let city = coordsInfo.nearest[0].city[0];
      state = state ? state.replace(/\s+/g, "-") : state;
      city = city ? city.replace(/\s+/g, "-") : city;
      console.log(state, city);

      navigate(
        `events/date/?page=1&start_date=${start_date}&end_date=${end_date}&state=${state}&city=${city}`
      );
      setState(coordsInfo.nearest[0].prov);
    } else if (state) {
      navigate(
        `events/date/?page=1&start_date=${start_date}&end_date=${end_date}&state=${state}`
      );
    } else {
      navigate("/");
    }
  };

  // Get all the keys from stateList and create components for each state
  const values = Object.values(statesList.default);
  const statesData = values.map((ele) => {
    return (
      <MenuItem value={ele} key={ele}>
        {ele}
      </MenuItem>
    );
  });

  useEffect(() => {
    if (coords) {
      async function fetchDatabyId() {
        try {
          let data = await axios
            .get("http://localhost:4000/geo", {
              params: {
                latitude: coords.latitude,
                longitude: coords.longitude,
              },
            })
            .then((res) => {
              let geodata = res.data.geodata;
              setCoords(geodata);
            });
        } catch (error) {
          console.log(error);
        }
      }
      fetchDatabyId();
    }
  }, [coords]);

  return (
    <div className="main">
      <Carousel images={posters} />
      <div id="calendar">
        <form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "3%",
            }}
          >
            <Stack
              spacing={{ xs: 1, sm: 2 }}
              direction="row"
              useFlexGap
              flexWrap="wrap"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DateTimePicker", "DateTimePicker"]}
                >
                  <DateTimePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newDate) => setStartDate(newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DateTimePicker", "DateTimePicker"]}
                >
                  <DateTimePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newDate) => setEndDate(newDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>

              <Button
                variant="outlined"
                href="#outlined-buttons"
                type="submit"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "right",
                  color: "#6f48eb",
                  borderColor: "#6f48eb",
                  marginTop: '9px', 
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Stack>
          </Box>
        </form>
        <div
          className="calendar-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
          <Box
            sx={{
              display: "block",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "3%",
              minWidth: "5%",
            }}
          >
            <FormControl
              fullWidth
              sx={{
                marginBottom: "3%",
              }}
            >
              <InputLabel id="demo-simple-select-label">State</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="State"
                value={state}
                onChange={handleChange}
              >
                {statesData}
              </Select>
            </FormControl>

            <Calendar
              onChange={setDate}
              value={date}
              onClickDay={hadleClickDate}
            />
          </Box>
        </div>

        <p className="text-center">
          <span className="bold">{new Date().toString().slice(0, -18)}</span>
        </p>
      </div>
    </div>
  );
};

export default Home;

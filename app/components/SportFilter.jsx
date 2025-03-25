"use client";

import Image from "next/image";

// 📌 Images des sports
const sportImages = {
  Cross: "/photos/cross.jpeg",
  Trail: "/photos/trail.jpg",
  Marche: "/photos/marche.jpg",
  Trottinette: "/photos/trotinete.jpeg",
  VTT: "/photos/vtt.png",
};

const SportFilters = ({ selectedSport, onSportChange }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        padding: "15px",
        borderRadius: "50px",
        backgroundColor: "#3D4A89",
        marginBottom: "20px",
        width: "fit-content",
        margin: "auto",
      }}
    >
      {Object.keys(sportImages).map((sport) => (
        <div
          key={sport}
          onClick={() => onSportChange(sport === selectedSport ? null : sport)}
          style={{
            position: "relative",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            overflow: "hidden",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            border: selectedSport === sport ? "2px solid yellow" : "none",
          }}
        >
          <Image
            src={sportImages[sport]}
            alt={sport}
            width={70}
            height={70}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              opacity: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "opacity 0.3s ease",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "2px 2px 0px black, -2px -2px 0px black, -2px 2px 0px black, 2px -2px 0px black",
              }}
            >
              {sport}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.previousSibling.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.previousSibling.style.opacity = "0")}
          />
        </div>
      ))}
    </div>
  );
};

export default SportFilters;

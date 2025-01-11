// /routes/welcome.tsx
import Navbar from "../components/Navbar";

export default function Welcome() {
  return (
    <div
      style={{
        background: "linear-gradient(45deg, #2575fc 0%, #28a745 100%)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <Navbar />

      <div
        style={{
          textAlign: "center",
          fontSize: "3rem",
          fontWeight: "bold",
          padding: "20px",
          marginTop: "220px"
        }}
      >
        <h1>Welcome to Discutex!</h1>
      </div>
    </div>
  );
}

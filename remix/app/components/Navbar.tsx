// /remix/app/components/Navbar.tsx
import { Link } from "@remix-run/react";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#1e90ff",
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/images/icon.png"
          alt="Logo"
          style={{ height: "40px", marginRight: "10px" }}
        />
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Discutex</span>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/login"
          style={{
            textDecoration: "none",
            color: "white",
            marginRight: "15px",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            textDecoration: "none",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

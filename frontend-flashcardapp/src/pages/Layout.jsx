import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{ mt: 2 }}
      >
        <Outlet />
      </Container>
    </>
  );
}

import Cursor from "@/components/cursor/Cursor";
import Footer from "@/components/layouts/footer/footer";
import Navbar from "@/components/layouts/navbar/navbar";
import Form from "@/components/Register/registration/Form";
import React from "react";

const page = () => {
  return (
    <div>
      <Cursor />
      <Navbar />
      <Form />
      <Footer />
    </div>
  );
};

export default page;

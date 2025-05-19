import { TextInput } from "flowbite-react";
import React from "react";

function HeaderProject({ filter, setFilter }: any) {
  return (
    <header
      className="py-12 text-center"
      style={{
        backgroundImage: "url(/assets/images/background.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1
        className="z-10 text-4xl font-bold text-slate-700"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
      >
        Projects
      </h1>
      <div className="mt-4 flex justify-center">
        <TextInput
          type="text"
          placeholder="You can search project by name here"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-1/3"
        />
      </div>
    </header>
  );
}

export default HeaderProject;

import  { useState } from "react";
import axios from "axios";

const CountryForm = ({ token, onCountryAdded }) => {
  const [name, setName] = useState("");
  const [iso2, setIso2] = useState("");
  const [iso3, setIso3] = useState("");
  const [localName, setLocalName] = useState("");
  const [continent, setContinent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3003/api/countries",
        {
          name,
          iso2,
          iso3,
          local_name: localName,
          continent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setName("");
        setIso2("");
        setIso3("");
        setLocalName("");
        setContinent("");
        onCountryAdded(); 
      } else {
        console.error("Failed to add country");
      }
    } catch (error) {
      console.error("Error adding country:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Country Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="iso2">ISO2</label>
        <input
          id="iso2"
          type="text"
          value={iso2}
          onChange={(e) => setIso2(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="iso3">ISO3</label>
        <input
          id="iso3"
          type="text"
          value={iso3}
          onChange={(e) => setIso3(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="localName">Local Name</label>
        <input
          id="localName"
          type="text"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="continent">Continent</label>
        <input
          id="continent"
          type="text"
          value={continent}
          onChange={(e) => setContinent(e.target.value)}
        />
      </div>
      <button type="submit">Add Country</button>
    </form>
  );
};

export default CountryForm;

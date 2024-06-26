import { useEffect, useState } from "react";
import axios from "axios";

const CountriesTable = ({ token, refreshTable }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3003/api/countries",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [token, refreshTable]); 

    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:3003/api/countries/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCountries(countries.filter((country) => country.id !== id));
      } catch (error) {
        console.error("Error deleting country:", error);
      }
    };

    const checkToken = () => {
      console.log(token)
    }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">ISO2</th>
            <th className="py-2 px-4 border-b">ISO3</th>
            <th className="py-2 px-4 border-b">Local Name</th>
            <th className="py-2 px-4 border-b">Continent</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <tr
              key={country.id}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="py-2 px-4 border-b">{country.id}</td>
              <td className="py-2 px-4 border-b">{country.name}</td>
              <td className="py-2 px-4 border-b">{country.iso2}</td>
              <td className="py-2 px-4 border-b">{country.iso3}</td>
              <td className="py-2 px-4 border-b">{country.local_name}</td>
              <td className="py-2 px-4 border-b">{country.continent}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleDelete(country.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={checkToken}>TESTI</button>
    </div>
  );
};

export default CountriesTable;

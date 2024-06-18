import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CountriesTable from "./components/CountriesTable";
import CountryForm from "./components/CountryForm";

const App = () => {
  const [token, setToken] = useState("");
  const [refreshTable, setRefreshTable] = useState(false);

    const handleCountryAdded = () => {
      setRefreshTable((prev) => !prev); 
    };


  

  return (
    <div className="App">
      {!token ? (
        <>
          <Signup />
          <Login setToken={setToken} />
        </>
      ) : (
        <div>
          <CountryForm token={token} onCountryAdded={handleCountryAdded} />
          <CountriesTable token={token} refreshTable={refreshTable} />
        </div>
      )}
    </div>
  );
};

export default App;

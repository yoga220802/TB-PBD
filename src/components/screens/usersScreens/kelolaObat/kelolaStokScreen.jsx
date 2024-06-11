import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../../../../styles/dashboard/kelolaStock/kelolaStockDashboard.css"; // Import the CSS file for styling
import AddObat from "./addObat";
import EditObat from "./editObat";

const formatRupiah = (amount) => {
 const numberAmount = Number(amount); // Konversi amount ke tipe data number
 return (
  "Rp. " +
  numberAmount
   .toFixed(2)
   .replace(/\d(?=(\d{3})+\.)/g, "$&,")
   .slice(0, -3)
 );
};

const formatDate = (dateString) => {
 const date = new Date(dateString);
 return date.toISOString().split("T")[0];
};

function KelolaStokScreen({ userDetails, logout }) {
 const navigate = useNavigate();
 const { username, fullname } = userDetails;
 const [dropdownVisible, setDropdownVisible] = useState(false);
 const dropdownRef = useRef(null);
 const [medicines, setMedicines] = useState([]);
 const [sortConfig, setSortConfig] = useState({
  key: null,
  direction: "ascending",
 });
 const [searchID, setSearchID] = useState("");
 const [searchName, setSearchName] = useState("");
 const [searchBrand, setSearchBrand] = useState("");
 const [searchPrice, setSearchPrice] = useState("");
 const [searchStock, setSearchStock] = useState("");
 const [searchUnit, setSearchUnit] = useState("");
 const [searchExpiration, setSearchExpiration] = useState("");
 const [isAddModalVisible, setIsAddModalVisible] = useState(false);
 const [isEditModalVisible, setIsEditModalVisible] = useState(false);
 const [selectedMedicine, setSelectedMedicine] = useState(null);

 const fetchMedicines = () => {
  fetch("http://localhost:8080/medicine/get-medicines")
   .then((response) => response.json())
   .then((data) => {
    setMedicines(data);
   })
   .catch((error) => console.error("Error fetching medicines:", error));
 };

 useEffect(() => {
  console.log("KelolaStokScreen userDetails:", userDetails); // Debug: Log userDetails
 }, [userDetails]);

 useEffect(() => {
  fetchMedicines();
 }, []);

 const handleLogout = () => {
  logout();
  navigate("/");
 };

 const toggleDropdown = () => {
  setDropdownVisible(!dropdownVisible);
 };

 useEffect(() => {
  const handleClickOutside = (event) => {
   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setDropdownVisible(false);
   }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
  };
 }, [dropdownRef]);

 const sortedMedicines = useMemo(() => {
  let sortableItems = [...medicines];
  if (sortConfig !== null) {
   sortableItems.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
     return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
     return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
   });
  }
  return sortableItems;
 }, [medicines, sortConfig]);

 const filteredMedicines = useMemo(() => {
  return sortedMedicines.filter(
   (medicine) =>
    String(medicine.medicineID)
     .toLowerCase()
     .includes(searchID.toLowerCase()) &&
    medicine.medicineName.toLowerCase().includes(searchName.toLowerCase()) &&
    medicine.brand.toLowerCase().includes(searchBrand.toLowerCase()) &&
    (searchPrice
     ? Number(medicine.medicinePrice) <= Number(searchPrice)
     : true) &&
    (searchStock ? Number(medicine.stock) <= Number(searchStock) : true) &&
    medicine.medicineUnit.toLowerCase().includes(searchUnit.toLowerCase()) &&
    (searchExpiration
     ? new Date(medicine.expirationDate) < new Date(searchExpiration)
     : true) // Periksa jika searchExpiration tidak kosong
  );
 }, [
  sortedMedicines,
  searchID,
  searchName,
  searchBrand,
  searchPrice,
  searchStock,
  searchUnit,
  searchExpiration,
 ]);
 const requestSort = (key) => {
  let direction = "ascending";
  if (sortConfig.key === key && sortConfig.direction === "ascending") {
   direction = "descending";
  }
  setSortConfig({ key, direction });
 };

 const handleOpenAddModal = () => setIsAddModalVisible(true);
 const handleCloseAddModal = () => {
  setIsAddModalVisible(false);
 };

 const handleOpenEditModal = (medicine) => {
  setIsEditModalVisible(true);
  setSelectedMedicine(medicine.medicineID);
 };

 const handleCloseEditModal = () => {
  setIsEditModalVisible(false);
 };

 return (
  <div>
   <div className='topbar'>
    <div className='topbar-left'>
     <span className='apotek-sehat'>APOTEK SEHAT</span>
    </div>
    <div className='user-dropdown-container' ref={dropdownRef}>
     <button className='user-button' onClick={toggleDropdown}>
      <span className='user-fullname'>{username}</span>{" "}
      <Icon icon='gridicons:dropdown' className='icon' />
     </button>
     {dropdownVisible && (
      <div className='user-dropdown'>
       <button onClick={handleLogout} className='logout-button'>
        <Icon icon='el:off' className='icon' />{" "}
        <span className='logout-text'>Logout</span>
       </button>
      </div>
     )}
    </div>
   </div>
   <div className='user-container'>
    <div className='user-header'>
     <div className='user-welcome'>
      Selamat Datang, {fullname}{" "}
      <span role='img' aria-label='wave'>
       👋
      </span>
     </div>
    </div>
    <div className='search-container'>
     <button
      onClick={() => {
       setSearchID("");
       setSearchName("");
       setSearchBrand("");
       setSearchPrice("");
       setSearchStock("");
       setSearchUnit("");
       setSearchExpiration("");
      }}>
      Clear Filters
     </button>
    </div>
    <div className='table-container'>
     <table className='medicine-table'>
      <thead>
       <tr>
        <th>
         <span onClick={() => requestSort("medicineID")}>Medicine ID</span>
         <input
          type='text'
          placeholder='Search...'
          value={searchID}
          onChange={(e) => setSearchID(e.target.value)}
          style={{ maxWidth: "100px" }}
         />
        </th>
        <th>
         <span onClick={() => requestSort("medicineName")}>Medicine Name</span>
         <br />
         <input
          type='text'
          placeholder='Search...'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ maxWidth: "100px" }}
         />
        </th>
        <th>
         <span onClick={() => requestSort("brand")}>Brand</span>
         <input
          type='text'
          placeholder='Search...'
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
          style={{ maxWidth: "100px" }}
         />
        </th>
        <th>
         <span onClick={() => requestSort("medicinePrice")}>Harga</span>
         <input
          type='text'
          placeholder='Search...'
          value={searchPrice}
          onChange={(e) => setSearchPrice(e.target.value)}
          style={{ maxWidth: "100px" }}
         />
        </th>
        <th>
         <span onClick={() => requestSort("stock")}>Stok</span>
         <input
          type='text'
          placeholder='Search...'
          value={searchStock}
          onChange={(e) => setSearchStock(e.target.value)}
          style={{ maxWidth: "100px" }}
         />
        </th>
        <th>
         <span onClick={() => requestSort("medicineUnit")}>Satuan</span>
         <input
          type='text'
          placeholder='Search...'
          value={searchUnit}
          onChange={(e) => setSearchUnit(e.target.value)}
          style={{ maxWidth: "100px" }}
         />
        </th>
        <th>
         <span onClick={() => requestSort("expirationDate")}>
          Expiration Date
         </span>
         <input
          type='date'
          placeholder='Search...'
          value={searchExpiration}
          onChange={(e) => setSearchExpiration(e.target.value)}
          style={{ maxWidth: "100px" }}
         />
        </th>
        <th>Edit</th>
       </tr>
      </thead>
      <tbody>
       {filteredMedicines.length > 0 ? (
        filteredMedicines.map((medicine) => (
         <tr key={medicine.medicineID}>
          <td>{medicine.medicineID}</td>
          <td>{medicine.medicineName}</td>
          <td>{medicine.brand}</td>
          <td>{formatRupiah(medicine.medicinePrice)}</td>
          <td>{medicine.stock}</td>
          <td>{medicine.medicineUnit}</td>
          <td>{formatDate(medicine.expirationDate)}</td>
          <td>
           <button
            className='edit-button'
            onClick={() => handleOpenEditModal(medicine)}>
            <Icon icon='mdi:pencil' className='icon' />
           </button>
          </td>
         </tr>
        ))
       ) : (
        <tr>
         <td colSpan='8' style={{ textAlign: "center" }}>
          Belum ada Obat
         </td>
        </tr>
       )}
      </tbody>
     </table>
    </div>
    <div className='add-button-container'>
     <button className='add-button' onClick={handleOpenAddModal}>
      <Icon icon='mdi:plus' className='icon' />
     </button>
    </div>
   </div>
   {isAddModalVisible && (
    <AddObat close={handleCloseAddModal} onAddSuccess={fetchMedicines} />
   )}
   {isEditModalVisible && (
    <EditObat
     selectedMedicineId={selectedMedicine}
     close={handleCloseEditModal}
     onEditSuccess={fetchMedicines}
    />
   )}
  </div>
 );
}

export default KelolaStokScreen;

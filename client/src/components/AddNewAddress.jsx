/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { IoSearch } from "react-icons/io5";
import home from "../assets/home.avif"
import hotel from "../assets/hotel.avif"
import other from "../assets/other.avif"
import work from "../assets/work.avif"
import location from "../assets/location.avif"
import { AiFillCloseCircle } from "react-icons/ai";
import TextField from '@mui/material/TextField';
import { BiCurrentLocation } from "react-icons/bi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import AxiosToastError from '../utils/AxiosToastError';
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { useAddress } from "../provider/AddressContext";

function AddNewAddress({ setOpenAddNewAddressMenu, setIsAddressMenuOpen }) {

    const user = useSelector((state) => state?.user)
    const { fetchAddress } = useAddress();

    const modalRef = useRef(null);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);

    const [center, setCenter] = useState({ lat: 22.3039, lng: 70.8022 });
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");
    const [map, setMap] = useState(null);
    const [saveAddressAs, setSaveAddressAs] = useState("")
    const [openOtherAsSaveAddressAs, setOpenOtherAsSaveAddressAs] = useState(false)
    const [isManualEditing, setIsManualEditing] = useState(false);
    const [addressData, setAddressData] = useState({
        saveAs: "",
        flatHouseNumber: "",
        floor: "",
        street: "",
        area: area,
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        name: user.name || "",
        mobileNumber: user.mobile || "",
        latitude: null,  // Add this
        longitude: null, // Add this
    });

    // console.warn = () => { };
    // console.error = () => { };

    // useEffect(() => {
    //     console.log("addressData", addressData);
    // }, [addressData])

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: ["places"],  // Make sure "places" is included
    });
    
    const handleChange = (field) => (event) => {
        setAddressData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const updateAddressData = (place) => {
        if (!place.geometry || !place.geometry.location) {
            console.error("Invalid place object", place);
            return;
        }

        // Extract latitude and longitude
        const newLat = place.geometry.location.lat(); // Call the function
        const newLng = place.geometry.location.lng(); // Call the function


        // console.log("Extracted Lat/Lng:", newLat, newLng); // Debugging

        // Extract additional address components
        let newCity = "";
        let newState = "";
        let newPincode = "";
        let newCountry = "";
        let newStreet = "";

        for (const component of place.address_components) {
            if (component.types.includes("locality")) {
                newCity = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
                newState = component.long_name;
            }
            if (component.types.includes("postal_code")) {
                newPincode = component.long_name;
            }
            if (component.types.includes("country")) {
                newCountry = component.long_name;
            }
            if (
                component.types.includes("sublocality_level_1") ||
                component.types.includes("sublocality_level_2") ||
                component.types.includes("route")
            ) {
                newStreet = component.long_name;
            }
        }

        // ✅ Update addressData state
        setAddressData((prev) => ({
            ...prev,
            latitude: newLat,
            longitude: newLng,
            city: newCity,
            state: newState,
            pincode: newPincode,
            country: newCountry,
            street: newStreet,
        }));
    };

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (modalRef.current && !modalRef.current.contains(event.target)) {
    //             setOpenAddNewAddressMenu(false);
    //         }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, [setOpenAddNewAddressMenu]);

    const onLoadMap = useCallback((mapInstance) => {
        setMap(mapInstance);
        mapInstance.setCenter(center);
        mapInstance.setZoom(15);
        fetchAddressFromMap(center.lat, center.lng);
    }, [center]);

    const onUnmountMap = useCallback(() => {
        setMap(null);
    }, []);

    useEffect(() => {
        if (!isLoaded || !window.google || !window.google.maps || autocompleteRef.current) return;
    
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["geocode"], 
            componentRestrictions: { country: "IN" } // Restrict to India (optional)
        });
    
        autocompleteRef.current.addListener("place_changed", () => {
            setIsManualEditing(false);
            const place = autocompleteRef.current.getPlace();
            
            if (place.geometry) {
                const newLat = place.geometry.location.lat();
                const newLng = place.geometry.location.lng();
                setCenter({ lat: newLat, lng: newLng });
                setAddress(place.formatted_address);
                extractArea(place);
                updateAddressData(place); 
                if (map) map.setCenter({ lat: newLat, lng: newLng });
            }
        });
    }, [isLoaded]);  // Depend on `isLoaded` to prevent issues

    const fetchAddressFromMap = (lat, lng) => {
        if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    setAddress(results[0].formatted_address);
                    extractArea(results[0]); // Keeps the original function
                    updateAddressData(results[0]); // New function to update addressData
                } else {
                    console.error("Geocoder failed:", status);
                }
            });
        }
    };

    useEffect(() => {
        setAddressData((prev) => ({ ...prev, saveAs: saveAddressAs }));
    }, [saveAddressAs]);
    

    const extractArea = (place) => {
        for (const component of place.address_components) {
            // console.log(place);
            if (component.types.includes("sublocality_level_1") || component.types.includes("locality")) {
                const newArea = component.long_name;
                setArea(newArea);
                setAddressData((prev) => ({
                    ...prev,
                    area: newArea
                }));
                return;
            }
        }

        setArea("");
        setAddressData((prev) => ({
            ...prev,
            area: ""
        }));
    };

    const handleMapIdle = useCallback(() => {
        if (!map || isManualEditing) return; // Don't update if user is typing

        const newCenter = map.getCenter();
        if (!newCenter) return;

        const lat = newCenter.lat();
        const lng = newCenter.lng();
        setCenter({ lat, lng });
        fetchAddressFromMap(lat, lng);
    }, [map, isManualEditing]);

    useEffect(() => {
        if (inputRef.current && !autocompleteRef.current && window.google && window.google.maps) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ["geocode"],
                componentRestrictions: { country: "IN" },
            });

            autocompleteRef.current.addListener("place_changed", () => {
                setIsManualEditing(false); // Allow auto-updating again
                const place = autocompleteRef.current.getPlace();
                if (place.geometry) {
                    const newLat = place.geometry.location.lat();
                    const newLng = place.geometry.location.lng();
                    setCenter({ lat: newLat, lng: newLng });
                    setAddress(place.formatted_address);
                    extractArea(place);
                    if (map) map.setCenter({ lat: newLat, lng: newLng });
                }
            });
        }
    }, []);

    const handleManualAddressChange = (e) => {
        setIsManualEditing(true); // Stop auto-updating from the map
        setAddress(e.target.value);
    };

    const handleAddressSubmit = () => {
        setIsManualEditing(false);
        if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === "OK" && results[0].geometry.location) {
                    const newLat = results[0].geometry.location.lat();
                    const newLng = results[0].geometry.location.lng();
                    setCenter({ lat: newLat, lng: newLng });
                    extractArea(results[0]);
                    if (map) map.setCenter({ lat: newLat, lng: newLng });
                } else {
                    console.error("Geocode failed:", status);
                }
            });
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLat = position.coords.latitude;
                    const newLng = position.coords.longitude;
                    setCenter({ lat: newLat, lng: newLng });
                    if (map) map.setCenter({ lat: newLat, lng: newLng });
                    fetchAddressFromMap(newLat, newLng);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await Axios({
                ...summaryApi.addNewAddress,
                data: {
                    saveAs: addressData.saveAs,
                    flatHouseNumber: addressData.flatHouseNumber,
                    floor: addressData.floor,
                    street: addressData.street,
                    area: addressData.area,
                    landmark: addressData.landmark,
                    city: addressData.city,
                    state: addressData.state,
                    pincode: addressData.pincode,
                    country: addressData.country,
                    name: addressData.name,
                    mobileNumber: addressData.mobileNumber,
                    latitude: addressData.latitude,
                    longitude: addressData.longitude,
                }
            })

            // console.log("response: ", response);
            if (response.data.success) {
                fetchAddress()
                toast.success(response.data.message)
                setOpenAddNewAddressMenu(false)
                setIsAddressMenuOpen(true)
                // dispatch(addAddress(response.data.data))
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    if (!isLoaded) {
        return (
            <div className="fixed inset-0 bg-neutral-800/70 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
                    <p>Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-neutral-800/70 flex justify-center items-center z-40 overflow-y-auto w-full p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-lg w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] flex flex-col md:flex-row gap-4 relative h-[82vh]"
            >
                {/* Left Side (Map) */}
                <div className="relative w-full md:w-1/2 min-h-[60vh] md:min-h-[90vh]">
                    {/* Search Bar */}
                    <div className="absolute top-2 z-50 w-[90%] max-w-md left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2 border border-gray-300">
                        <IoSearch size={20} className="text-[#318616]" />
                        <input
                            type="text"
                            ref={inputRef}
                            value={address}
                            onChange={handleManualAddressChange}
                            onKeyDown={(e) => e.key === "Enter" && handleAddressSubmit()}
                            placeholder="Search for an address..."
                            className="w-full bg-transparent outline-none"
                        />
                    </div>
                    {/* Map Container */}
                    <div className="relative mt-2 px-2">
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "65vh" }}
                            center={center}
                            zoom={14}
                            onLoad={onLoadMap}
                            onUnmount={onUnmountMap}
                            onIdle={handleMapIdle}
                            options={{
                                mapTypeControl: false,
                                fullscreenControl: false,
                                streetViewControl: false,
                                gestureHandling: "greedy"
                            }}
                        />
                        {/* Static Center Marker */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <img
                                src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                alt="Marker"
                                className="w-8 h-8"
                            />
                        </div>
                        {/* Current Location Button */}
                        <div className="absolute bottom-5 left-4 z-50">
                            <button
                                onClick={getCurrentLocation}
                                className="bg-white px-3 py-2 rounded-xl shadow flex items-center gap-2 border text-sm font-medium text-[#318616]"
                            >
                                <BiCurrentLocation size={18} />
                                Use Current Location
                            </button>
                        </div>
                    </div>
                    <div className="absolute bg-white p-3 w-full">
                        <p className="text-md font-semibold pb-1">Delivering your order to</p>
                        <div className="bg-[#F6FCFC] flex gap-2 items-center p-2 rounded-xl border border-gray-300">
                            <img src={location} alt="" className="w-8 h-8" />
                            <div className="text-sm">
                                <p>{area}</p>
                                <p className="line-clamp-1">{address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side (Form) */}
                <div className="w-full md:w-1/2 p-4 h-[80vh] bg-white overflow-y-scroll mt-25 md:mt-0">
                    <div className="border-b border-gray-200 flex justify-between items-center pb-3">
                        <h2 className="text-lg font-bold">Enter complete address</h2>
                        <button
                            className="text-gray-500 cursor-pointer"
                            onClick={() => setOpenAddNewAddressMenu(false)}
                        >
                            <IoCloseCircleSharp size={25} />
                        </button>
                    </div>
                    <div className="mt-4 pb-8">
                        <p className="text-sm text-gray-400 pb-2">Save address as *</p>
                        {/* Address Save Options */}
                        {
                            openOtherAsSaveAddressAs ? (
                                <div className="pb-5 flex items-baseline gap-2">
                                    <button
                                        className={`flex items-center shadow-md p-2 gap-1 rounded-lg  border-1 bg-[#EBFFEF] border-green-700`}
                                        onClick={() => setOpenOtherAsSaveAddressAs(false)}
                                    >
                                        <img src={other} alt="" className="w-5 h-5" />
                                        <span>Other</span>
                                    </button>
                                    <div className="border-b-2 border-gray-400">
                                        <input
                                            type="text"
                                            className=" focus:outline-none"
                                            placeholder="Save as"
                                            onChange={(e) => setSaveAddressAs(e.target.value)}
                                        />
                                        {saveAddressAs.length > 0 && (
                                            <button
                                                className="pr-4"
                                                onClick={() => {
                                                    setSaveAddressAs("home")
                                                    setOpenOtherAsSaveAddressAs(false)
                                                }}
                                            >
                                                <AiFillCloseCircle size={20} className="text-gray-300" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        className={`flex items-center shadow-md p-2 gap-1 rounded-lg  border-1  ${saveAddressAs === "home" ? "bg-[#EBFFEF] border-green-700" : "bg-white border-gray-200"}`}
                                        onClick={() => setSaveAddressAs("home")}
                                    >
                                        <img src={home} alt="" className="w-5 h-5" />
                                        <span>Home</span>
                                    </button>
                                    <button
                                        className={`flex items-center shadow-md p-2 gap-1 rounded-lg  border-1  ${saveAddressAs === "work" ? "bg-[#EBFFEF] border-green-700" : "bg-white border-gray-200"}`}
                                        onClick={() => setSaveAddressAs("work")}

                                    >
                                        <img src={work} alt="" className="w-5 h-5" />
                                        <span>Work</span>
                                    </button>
                                    <button
                                        className={`flex items-center shadow-md p-2 gap-1 rounded-lg  border-1  ${saveAddressAs === "hotel" ? "bg-[#EBFFEF] border-green-700" : "bg-white border-gray-200"}`}
                                        onClick={() => setSaveAddressAs("hotel")}
                                    >
                                        <img src={hotel} alt="" className="w-5 h-5" />
                                        <span>Hotel</span>
                                    </button>
                                    <button
                                        className={`flex items-center shadow-md p-2 gap-1 rounded-lg  border-1  ${saveAddressAs === "other" ? "bg-[#EBFFEF] border-green-700" : "bg-white border-gray-200"}`}
                                        onClick={() => {
                                            setSaveAddressAs("other")
                                            setOpenOtherAsSaveAddressAs(true)
                                        }}
                                    >
                                        <img src={other} alt="" className="w-5 h-5" />
                                        <span>Other</span>
                                    </button>
                                </div>
                            )
                        }
                        {/* Address Fields */}
                        <div className="flex flex-col gap-3 mt-3">
                            {/* Flat / House No / Building Name */}
                            <TextField
                                id="outlined-basic"
                                label="Flat / House no / Building name"
                                variant="outlined"
                                fullWidth
                                value={addressData.flatHouseNumber}
                                onChange={handleChange("flatHouseNumber")}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'gray',
                                        }
                                    },
                                    '& .MuiInputLabel-root': { color: 'gray' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: 'black' }
                                }}
                            />

                            {/* Floor (Optional) */}
                            <TextField
                                id="outlined-basic"
                                label="Floor (optional)"
                                variant="outlined"
                                fullWidth
                                value={addressData.floor}
                                onChange={handleChange("floor")}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'gray',
                                        }
                                    },
                                    '& .MuiInputLabel-root': { color: 'gray' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: 'black' }
                                }}
                            />

                            {/* Area / Sector / Locality Field (Read-Only) */}
                            <TextField
                                id="outlined-basic"
                                label="Area / Sector / Locality *"
                                value={area}
                                variant="outlined"
                                fullWidth
                                focused
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        backgroundColor: '#f5f5f5', // Light gray background
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent', // Removes the blue border
                                        }
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'transparent', // Removes the default border
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'gray',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'black',
                                    }
                                }}
                            />

                            {/* Nearby Landmark (Optional) */}
                            <TextField
                                id="outlined-basic"
                                label="Nearby landmark (optional)"
                                variant="outlined"
                                fullWidth
                                value={addressData.landmark}
                                onChange={handleChange("landmark")}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'gray',
                                        }
                                    },
                                    '& .MuiInputLabel-root': { color: 'gray' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: 'black' }
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-3 mt-3">
                            <p className="text-sm text-gray-400">Enter your details for seamless delivery experience</p>
                            {/* Name */}
                            <TextField
                                id="outlined-basic"
                                label="Name"
                                variant="outlined"
                                fullWidth
                                value={addressData.name}
                                onChange={handleChange("name")}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'gray',
                                        }
                                    },
                                    '& .MuiInputLabel-root': { color: 'gray' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: 'black' }
                                }}
                            />
                            {/* Mobile Number */}
                            <TextField
                                id="outlined-basic"
                                label="Mobile number"
                                variant="outlined"
                                fullWidth
                                value={addressData.mobileNumber}
                                onChange={handleChange("mobileNumber")}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '15px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'gray',
                                        }
                                    },
                                    '& .MuiInputLabel-root': { color: 'gray' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: 'black' }
                                }}
                            />
                        </div>
                    </div>
                    {/* Submit Section inside the modal */}
                    <div className="sticky bottom-0 left-0 bg-white p-4 shadow-md z-50">
                        <button
                            className="w-full bg-[#318616] text-white py-3 rounded-lg text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={handleSubmit}
                            disabled={
                                !addressData.saveAs ||
                                !addressData.flatHouseNumber ||
                                !addressData.area ||
                                !addressData.city ||
                                !addressData.pincode ||
                                !addressData.state ||
                                !addressData.country ||
                                !addressData.mobileNumber ||
                                !addressData.name ||
                                !addressData.latitude ||
                                !addressData.longitude
                            }
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AddNewAddress;

import { useEffect, useState, useRef } from "react"; 
import { GoogleMap, HeatmapLayer, Marker, useLoadScript } from "@react-google-maps/api"; 
import { db, collection, onSnapshot } from "../firebase"; 
// import ReportForm from "./ReportForm";

const mapContainerStyle = {
    width: "900px", 
    // height: "100vh", 
    height: "300px", 
}; 

const center = {lat: 32.7501, lng: -84.3885}; // default to Atlanta, GA

const Map = ( { setSelectedLocation, selectedLocation }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "YOUR-API-KEY", 
        libraries: ["visualization", "places"], // places library for auto complete 
    });

    const [heatmapData, setHeatmapData] = useState([]); 
    // const [selectedLocation, setSelectedLocation] = useState(null); 
    const inputRef = useRef(null); // to reference the addr input field 

    // handling click event on the map 
    const handleMapClick = (e) => {
        const latLng = e.latLng; 
        setSelectedLocation({
            lat: latLng.lat(), 
            lng: latLng.lng(),
        });
        // console.log("map clicked, setting setSelectedLocation: ", selectedLocation); 
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
            const newData = snapshot.docs.map((doc) => {
                const { latitude, longitude, severity, comment } = doc.data();  // get data from database 
                const latLng = new window.google.maps.LatLng(latitude, longitude);
                
                let weight;
                switch (severity) {
                    case "low":
                        weight = 1;
                        break;
                    case "medium":
                        weight = 2;
                        break;
                    case "high":
                        weight = 3;
                        break;
                    default: // default is low severity 
                        weight = 1;
                        break;
                }

                return { location: latLng, weight, comment, lat: latitude, lng: longitude };  
            });
            // const formattedHeatmapData = new window.google.maps.MVCArray(
            //     newData.map(({ location, weight }) => ({ location, weight }))
            // );
            // setHeatmapData(formattedHeatmapData);
            setHeatmapData(newData);
        });

        return () => unsubscribe(); 
    }, []); 

    useEffect(() => {
        if (isLoaded && inputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current); 
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace(); 
                
                if (place.geometry && place.geometry.location) {
                    setSelectedLocation({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    });
                } else {
                    alert("Place does not have geometry or location data.");
                }
            });
        }
    }, [isLoaded]); 

    // Get dynamic heatmap gradient based on severity
    const getHeatmapGradient = () => {
        return [
            "rgba(0, 255, 0, 0)",  
            "rgba(0, 255, 0, 1)",  // green for low severity
            "rgba(255, 255, 0, 1)",  // yellow for medium severity
            "rgba(255, 0, 0, 1)"  // red for high severity
        ];
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div style={{ textAlign: "center"}}>
            <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center"}}>
                {/* title */}
                <h3 style={{ marginBottom: "10px", fontSize: "20px", fontWeight: "bold", marginRight: "10px"}}>
                    Search for a Location
                </h3>
                {/* search input field */}
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder="Enter an address..." 
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        width: "300px",
                        marginBottom: "10px",
                        borderRadius: "4px",
                        textAlign: "center",
                        fontSize: "16px",
                    }}
                />
            </div>

            {/* map Component */}
            <GoogleMap 
                mapContainerStyle={mapContainerStyle} 
                zoom={13} 
                center={selectedLocation || center}
                onClick={handleMapClick}
            >
                {heatmapData.length > 0 && (
                    <HeatmapLayer
                        data={heatmapData}
                        options={{
                            gradient: getHeatmapGradient(),
                            radius: 40,
                        }}
                    />
                )}

                {/* add a marker for the selected location */}
                {selectedLocation && (
                    <Marker position={selectedLocation} />
                )}
            </GoogleMap>           
        </div>
    );
};

export default Map;

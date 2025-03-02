import { useState } from "react"; 
import { db, collection, addDoc } from "../firebase"; 
import Map from "./Map"; 

const ReportForm = () => {
    const [type, setType] = useState("harassment");  
    const [severity, setSeverity] = useState("low");  
    const [comment, setComment] = useState("");  
    const [selectedLocation, setSelectedLocation] = useState(null); 


    const reportIncident = async () => {
        console.log("report form: ", selectedLocation);
        if (selectedLocation) {
            const { lat, lng } = selectedLocation; 
            

            try {
                // add to firebase
                await addDoc(collection(db, "reports"), {
                    latitude: lat, 
                    longitude: lng, 
                    type, 
                    severity, 
                    comment,  
                    timestamp: new Date(),  // add timestamp
                }); 
                alert("Incident reported successfully!");  
                setComment("");  // clear the comment input after submission
            } catch (error) {
                console.error("Error reporting incident: ", error);  
            }
        } else {
            alert("Please select a location on the map first.");
       
    }; 
    console.log("selected location: ", selectedLocation);
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginTop: "20px" }}>
            < Map setSelectedLocation = {setSelectedLocation }  selectedLocation={selectedLocation}/>
            <h3>Report an Incident</h3>
            
            {/* incident type */}
            <div style={{ display: "flex", alignItems: "center"}}>
                <p style={{ marginRight: "10px" }}>Select Incident Type:</p>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="harassment">Harassment</option>
                    <option value="poor lighting">Poor Lighting</option>
                    <option value="stalking">Stalking</option>
                    <option value="unsafe area">Unsafe Area</option>
                </select>
            </div>

            {/* severity */}
            <div style={{ display: "flex", alignItems: "center"}}>
                <p style={{ marginRight: "10px" }}>Select Severity:</p>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            {/* comment Section */}
            <div style={{ marginTop: "10px" }}>
                <textarea 
                    placeholder="Add a comment..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    rows="4" 
                    cols="40" 
                    style={{ marginTop: "10px" }}
                ></textarea>
            </div>

            <button onClick={reportIncident} style={{ marginLeft: "10px", marginTop: "10px", backgroundColor: "#0ecf3b" }}>Submit</button>
        </div>
    );
};

export default ReportForm;

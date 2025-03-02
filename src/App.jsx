import Map from './components/Map';
import ReportForm from './components/ReportForm';

const App = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",      
            justifyContent: "center",     
            alignItems: "center",         
            height: "100vh",              
            textAlign: "center",          
            padding: "3vw"
        }}>
            <h2>Safety Heat Map</h2>
            {/* <Map /> */}
            <ReportForm />
        </div>
    );
};

export default App;

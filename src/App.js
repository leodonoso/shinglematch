import { useState, useEffect } from 'react'
import Roofers from './components/Roofers/Roofers';
import Navigation from './components/Navigation/Navigation';
import axios from 'axios';

function App() {
  const [addressQuery, setAddressQuery] = useState("")
  const [area, setArea] = useState("")
  const [roofers, setRoofers] = useState([])
  const [roofersAvailable, setRoofersAvailable] = useState([])
  const [locationA, setLocationA] = useState(null)
  const [currentRadiusIndex, setCurrentRadiusIndex] = useState(0)
  const [locationB, setLocationB] = useState(null)
  const [distanceMiles, setDistanceMiles] = useState(0)
  const [isInRadius, setIsInRadius] = useState(false)
  const [radiusResults, setRadiusResults] = useState([])
  const [isCalculatingRadius, setIsCalculatingRadius] = useState(false)

  // Get roofers' list from firebase db
  useEffect(() => {
    const roofersList = []

    const options = {
      method: 'GET',
      url: 'http://localhost:8000/roofers',
    }

    axios.request(options).then((response) => {
      response.data.forEach((doc) => {
        roofersList.push(doc)
      })
      setRoofers(roofersList)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  // Filter roofers by area
  useEffect(() => {
    const areaInput = document.getElementById("areaInput")
    areaInput.value = area
    const processedArea = area.replace(/\s/g, '').toLowerCase()
    const roofersInArea = roofers.filter((roofer) => {
      return roofer.state.includes(processedArea)
    })
    setRoofersAvailable(roofersInArea)
    }, [area, roofers])
  
// Calculate distance between location A and location B
  useEffect(() => {
    console.log("Location A or B have changed", locationB, locationA)
    if (locationB === null) return
    if (locationA === null) return
    console.log("Only do this if Location A and Location B exist")
    const calculateRadius = async () => {
      const options = {
        method: 'GET',
        url: 'http://localhost:8000/directions',
        params: {
          locationA: locationA,
          locationB: locationB
        }
      }
  
      await axios.request(options).then((response) => {
        const results = response.data
        const distanceKm = results.routes[0].distance / 1000;
        const distanceMi = distanceKm / 1.609;
        setDistanceMiles(distanceMi);
        console.log(`Distance from current location to ${locationB.location}: ${distanceMi.toPrecision(3)} miles`);
      });
    }
    try {
      calculateRadius()
    } catch (error) {
      console.log("There was an error: ", error)
    }
  }, [locationB, locationA])

  return (
    <div className="App">

      <Navigation 
        setArea={setArea} 
        setAddressQuery={setAddressQuery} 
        setLocationA={setLocationA} 
        setLocationB={setLocationB} 
        setRadiusResults={setRadiusResults}
        setIsInRadius={setIsInRadius}
      />
    
      <Roofers 
        addressQuery={addressQuery} 
        area={area} 
        roofersAvailable={roofersAvailable}
        setCurrentRadiusIndex={setCurrentRadiusIndex}
        currentRadiusIndex={currentRadiusIndex}
        setLocationB={setLocationB}
        locationB={locationB}
        distanceMiles={distanceMiles}
        isInRadius={isInRadius} 
        setIsInRadius={setIsInRadius}
        locationA={locationA}
        radiusResults={radiusResults}
        setRadiusResults={setRadiusResults}
        isCalculatingRadius={isCalculatingRadius}
        setIsCalculatingRadius={setIsCalculatingRadius}
      />
    </div>
  );

  // TO DO July 30th 2024
  // - Make address and state sync up and calculate radius dynamically ✅ Done Monday July 29th
  // - Store API keys properly ✅ Done Thursday August 22nd
  // - Calculate radius dynamically. ✅ Done Wednesday July 31th 
  // - Upload to github
  // - Create proper firestore settings.
  
  // - Upload backend to render
  // - Display UI properly ✅ Done August 26th
  // - Record loom to show how to share google calendar and outlook calendar for R ✅ Done August 26th

  // - Add Squares to roofers filter
  // - Look for filtering through county
  // - Optimize for API calls

}

export default App;

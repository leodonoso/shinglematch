import {useState, useCallback} from 'react'
import axios from 'axios'
import "./RooferCard.css"

const RooferCard = ({roofer, locationA, isCalculatingRadius, setIsCalculatingRadius, radiusResults, setRadiusResults}) => {
  const [isHidden, setIsHidden] = useState(true)
  
  // Click the button
  const handleOnClick = useCallback(async () => {
  // 1.- Is calculating radius turns true
    if (locationA === null) return
    const radiusDistances = []
    setIsCalculatingRadius(true)
  // 3.- Grab first element in radius lenght
    for (const place of roofer.radius) {
      let isInRadius = false

      console.log(radiusResults)
      // console.log(index, place, place.longitude, locationA)
    // 4.- Calculate distance, check if it's radius

      const options = {
        method: 'GET',
        // Production server
        url: 'https://fourhomeowners-apt-coordinator-server.onrender.com/directions',
        // Local Server
        // url: 'http://localhost:8080/directions',

        params: {
          locationA: locationA,
          locationB: place
        }
      }
      
      await axios.request(options).then((response) => {
        const results = response.data
        const distanceKm = results.routes[0].distance / 1000;
        const distanceMi = distanceKm / 1.609;
        radiusDistances.push(distanceMi)

        if (distanceMi <= place.miles) {
          console.log(`Roofer is in radius! DistanceMi: ${distanceMi}, Perimeter: ${place.miles}, Radius Results: ${radiusResults}`)
          setIsCalculatingRadius(false)
          isInRadius = true
          return    
        } else {
          console.log(`Roofer is not in radius. DistanceMi: ${distanceMi}, Perimeter: ${place.miles}, Radius Results: ${radiusResults}`)
        }
      });
      setRadiusResults(radiusDistances)  
      if (isInRadius === true) break
    }
    setIsCalculatingRadius(false)
  }, [locationA, radiusResults, setRadiusResults, roofer.radius, setIsCalculatingRadius])

  return (
    <li className='card'>
        <h3>{roofer.name}</h3>
        <div className='img-container'>
            <img className='card-img' src={roofer.logo} alt={roofer.name} />
        </div>
        <div className='card-container'>
            <p>Financing? {roofer['financing?'] ? "Yes" : "No"}</p>
            {radiusResults.length === 0 ? <></> : 
              <ul>
                {radiusResults.map((result, i) => 
                <li key={result+i}>
                  <h4>Lead must be {roofer.radius[i].miles} miles around {roofer.radius[i].location}</h4>
                  <p>Distance from current location to {roofer.radius[i].location}: <span>{result.toPrecision(3)}</span> miles</p>
                  {result > roofer.radius[i].miles ? <span>Out of radius ❌</span> : <span>Qualified ✅</span>}
                </li>
                )}
              </ul>
            }
            {isCalculatingRadius ? 
            <p>Calculating...</p> 
            :
            <button onClick={handleOnClick}>Calculate Radius </button>}
            
        </div>
        <div className='card-container'>
          <p>Calendars</p>
          <button onClick={() => {if(isHidden){setIsHidden(false)} else setIsHidden(true)}}>{isHidden ? "Show" : "Hide"} google calendar</button>
          {isHidden ? <></> : <iframe src={roofer.calendar} title={`${roofer.name} G-cal`} width="800" height="600" frameBorder="0" scrolling="no"></iframe>}
          <button><a target='_blank' rel='noreferrer' href='https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/d879192f-ab8b-4079-a4dc-e434600f1046/cid-DAFBE65BF8D5EF21/index.html'>Show outlook calendar</a></button>
        </div>
    </li>
  )

}

export default RooferCard
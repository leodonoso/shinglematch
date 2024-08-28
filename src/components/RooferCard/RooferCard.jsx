import {useState, useEffect} from 'react'
import "./RooferCard.css"

const RooferCard = ({roofer, setCurrentRadiusIndex, currentRadiusIndex, setLocationB, isInRadius, setIsInRadius, distanceMiles, locationA, isCalculatingRadius, setIsCalculatingRadius, radiusResults, setRadiusResults}) => {
  const [isHidden, setIsHidden] = useState(true)

  useEffect(() => {
    if(currentRadiusIndex === 0) return
    if(isInRadius === true) {
      setCurrentRadiusIndex(0)
      return
    }

    if (currentRadiusIndex < roofer.radius.length && isInRadius === false) {
      console.log("There's still locations left to calculate")
      setTimeout(handleOnClick, 500)
    }
  }, [isInRadius, currentRadiusIndex])
  
    
// Check if the lead is in radius
  useEffect(() => {
    if(distanceMiles === 0) {setIsInRadius(false); return}

    if (roofer.radius[currentRadiusIndex].miles > distanceMiles) {
      console.log("Lead is inside the client's radius. Distance miles: ", distanceMiles)
      setRadiusResults([...radiusResults, distanceMiles])
      setIsInRadius(true)
      setCurrentRadiusIndex(0)
      setIsCalculatingRadius(false)
    } else {
      console.log("Lead is out of radius. Distance miles: ", distanceMiles)
      setRadiusResults([...radiusResults, distanceMiles])
      setIsInRadius(false)
    }
  }, [distanceMiles])

  const handleOnClick = () => {
    if (locationA === null) return
    console.log("Step 1")

    setIsCalculatingRadius(true)
    console.log("Current Radius Index ", currentRadiusIndex)
    // Check if there's still locations left to calculate
    if (currentRadiusIndex < roofer.radius.length) {
        // Grab coordinates from the current radius location and set it to location B
        setLocationB(roofer.radius[currentRadiusIndex])
        // Console log the radius for the current location B to check if the lead in location A is in range
        console.log(`The radius is ${roofer.radius[currentRadiusIndex].miles} miles around ${roofer.radius[currentRadiusIndex].location}`)
        // Wait for the location to be calculated
        setTimeout(() => {
          // If there's still locations left to calcutate, add 1 to the currentRadiusIndex
          if (currentRadiusIndex < roofer.radius.length-1) {
            console.log("There's still locations left to calculate")
            setCurrentRadiusIndex(currentRadiusIndex+1)
          }
          // If not, set it to 0
          else {
            console.log("There are no more locations to calculate")
            setCurrentRadiusIndex(0); 
            setIsCalculatingRadius(false)
          }
        }, 500)   
    }
  }


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
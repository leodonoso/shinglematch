import React from 'react'
import RooferCard from '../RooferCard/RooferCard'
import "./Roofers.css"

const Roofers = ({locationA, area, roofersAvailable, isCalculatingRadius, setIsCalculatingRadius, radiusResults, setRadiusResults}) => {

  return (
    <div>
        {area === "" ?
          <h2>Roofers available</h2>
          :
          <h2>Available roofers in {area}</h2>
        }
        {roofersAvailable.length === 0 ?
        <h3>We do not have any roofers in this area</h3> 
        : roofersAvailable.length === 1 ? 
        <ul className='roofer'>
        {roofersAvailable.map((roofer) =>
          <RooferCard 
            roofer={roofer} 
            key={roofer.key}
            radiusResults={radiusResults}
            setRadiusResults={setRadiusResults}
            isCalculatingRadius={isCalculatingRadius}
            setIsCalculatingRadius={setIsCalculatingRadius}
            locationA={locationA}
          />
        )}
        </ul> :
        <ul className='roofers'>
        {roofersAvailable.map((roofer) =>
          <RooferCard 
            roofer={roofer} 
            key={roofer.key} 
            locationA={locationA}
            radiusResults={radiusResults}
            setRadiusResults={setRadiusResults}
            isCalculatingRadius={isCalculatingRadius}
            setIsCalculatingRadius={setIsCalculatingRadius}
          />
        )}
        </ul>}
    </div>
  )
}

export default Roofers



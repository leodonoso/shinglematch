import {useState} from 'react'
import axios from 'axios';
import './Navigation.css';

const Navigation = ({setArea, setAddressQuery, setLocationA, setLocationB, setRadiusResults, setIsInRadius}) => {
  const [suggestions, setSuggestions] = useState([])

  const handleAddress = async (e) => {
    try {
      setAddressQuery(e.target.value)

      const options = {
        method: 'GET',
        url: 'https://fourhomeowners-apt-coordinator-server.onrender.com/maps',
        params: {
          addressQuery: e.target.value
        }
      }
      
      await axios.request(options).then((response) => {
        const results = response.data
        setSuggestions(results.features);
      });
    } catch (err) {
      console.log("Error fetching data: ", err.message);
    }
  }

  const handleArea = (e) => {
    setArea(e.target.value)
  }

  return (
    <div className='nav-container'>
        <h1>4Homeowners</h1>
        <div className='nav'>
          <div className='address-container'>
            <input name="address" id='address-input' type='text' placeholder='Address' onChange={handleAddress}/>
            { suggestions.length === 0 ? <></> : 
            <div className="suggestion-box" id="suggestion-box">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className='suggestion'
                  onClick={() => {
                    const addressInput = document.getElementById("address-input");
                    addressInput.value = suggestion.properties.name
                    setAddressQuery(suggestion.properties.name)
                    const coma = suggestion.properties.place_formatted.search(",")
                    const firstNumber = suggestion.properties.place_formatted.search(/[0-9]/)
                    const addressState = suggestion.properties.place_formatted.substring(coma+2, firstNumber)
                    setLocationB(null)
                    setLocationA({
                      longitude: suggestion.properties.coordinates.longitude,
                      latitude: suggestion.properties.coordinates.latitude,
                    })
                    setArea(addressState)
                    setIsInRadius(false)
                    setSuggestions([])
                    setRadiusResults([])
                  }}
                >
                  <h4>{suggestion.properties.name}</h4>
                  <p>{suggestion.properties.place_formatted}</p>
                </div>
              )) }
            </div>
            }
          </div>
          <input id="areaInput" name="state" type='text' placeholder='State' onChange={handleArea} />
        </div>
      </div>
  )
}

export default Navigation
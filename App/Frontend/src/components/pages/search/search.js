import React, { useState, useEffect } from 'react';
import Map from './map.js';
import Healers from './healers.js';
import './search.css';
import axios from 'axios';

//These three variables need to be here otherwise getHealersWithFilter() won't work
//If there's a way for these to be persistent AND be located inside getHealersWithFilter() then that'd be cool, I'm not gonna look into it though
let city = null;
let service = null;
let deliveryFormat = '0';

const Search = () => {
    const victoria = { view:{ "lat": 48.407326,"lng": -123.329773 } }, //default location :)
    [initHealers, setInitHealers] = useState(null),
    [markers, setMarkers] = useState(null), //map markers
    [currMarkers, setCurrMarkers] = useState(null),
    [healers, setHealers] = useState(null), //healers to place on the map
    [active, setActive] = useState(null), //state for which marker is open
    [range, setRange] = useState(50), //healer search radius (units determined by google)
	[location, setLocation] = useState(victoria); //the user's location
	
	const handleActiveMarker = (marker) => {
    if (marker === active) {
        return;
    }
        setActive(marker);
    };

    //using the response from the healers API, sets the healer and marker states based on the filtered response
    const getHealersWithFilter = async (filters) => {
		if (filters.Cities) {
			//console.log("city found: " + filters.param);
			city = filters.param;
		}
		if (filters.Services) {
			//console.log("service found: " + filters.param);
			service = filters.param;
		}
		if (filters.deliveryFormat !== undefined) {
			//console.log("delivery format found: " + filters.deliveryFormat);
			deliveryFormat = filters.deliveryFormat;
		}
		
		filters = {
			Cities: 'Cities', cityParam: city, 
			Services: 'Services', serviceParam: service,
			deliveryFormat: deliveryFormat
		};

        await axios.post('http://localhost:8080/users/healers', filters)
        .then((response) => {
            //filter the healer response by the selected range (default 50)
			// TODO: error in cmd prompt here; "Expected to return a value at the end of arrow function  array-callback-return"
            let inRangeResponse = response.data.filter((healer) => {
                let currMarkerPos = markers.find(mrkrObj => mrkrObj.id === healer.uid);
                if(currMarkerPos){
                    let distanceBetweenPoints = window.google.maps.geometry.spherical.computeDistanceBetween(
                        {lat: parseFloat(location.view.lat), lng: parseFloat(location.view.lng)},
                        {lat: parseFloat(currMarkerPos.position.lat), lng: parseFloat(currMarkerPos.position.lng)}
                    ) / 1000;
                    
                    if(distanceBetweenPoints <= range){
                        return healer;
                    }
                }
            });

            setHealers(inRangeResponse);
            getMarkers(inRangeResponse, ).then(() => {
                return inRangeResponse;
            });
        });
    };

    //uses healers to get each individual id, saves those to an array, 
    //and passes that as the parameter to the location api.
    //'first' parameter indicates whether to get all markers or just those associated
    //with the current healers array. 
    const getMarkers = async (returnedHealers, first) => {
        console.log('getMarkers called with healers: ', returnedHealers);
        let ids = returnedHealers.map((healer) => {
            return healer.uid;
        });
        
        await axios.post('http://localhost:8080/locations', ids)
            .then((markerResponse) => {
                let responseMarkers = markerResponse.data.map((mrkr) => {
                    let currHealer = returnedHealers.find(healerObj => healerObj.uid === mrkr.uid);
                    return {
                        id: mrkr.uid, 
                        position: { 
                        lat: mrkr.lat, 
                        lng: mrkr.lng 
                        },
                        healer: `${currHealer.firstName} ${currHealer.lastName}`,
                        description: currHealer.description
                    };
                });

                if(first){
                    setMarkers(responseMarkers);
                    setCurrMarkers(responseMarkers);
                } else {
                    setCurrMarkers(responseMarkers);
                }
            
            return responseMarkers;
        });
    };


    //will execute once when the page loads. rerenders occur on the array
    //second argument.  
    useEffect(() => {
        // //gets the initial list of healers (will eventually be all in range)
        const getInitialHealers = async () => { //add range param when ready. 
            await axios.get('http://localhost:8080/users/healers')
            .then((response) => {
                setInitHealers(response.data);
                setHealers(response.data);
                getMarkers(response.data, true);
            });
        };

        getInitialHealers();
    }, []);

    return(
		<div className='body'>
			<div className='healerFrame'>
				{
				initHealers ?
				<Healers 
					data={{healers: healers, initHealers: initHealers, markers: currMarkers}}
					getHealersWithFilter={getHealersWithFilter}
					setHealers={setHealers}
                    range={range}
                    setRange={setRange}
                    getMarkers={getMarkers}
                /> : 	<div className="loaderContainer">
							<div className="loader"></div>
						</div>
				}
			</div>
			<div className='mapFrame'>
				<div className='center_bar'>   
				</div>
				{
					markers && initHealers ?
					<Map 
						data={{healers: initHealers, markers: currMarkers}}
						handleActiveMarker={handleActiveMarker}
						active={active}
						setActive={setActive}
                        range={range}
                        location={location}
                        setLocation={setLocation}
                    /> : <div className="loaderContainer">
							<div className="loader"></div>
						</div>
				}
			</div>
		</div>
    );
}

export default Search
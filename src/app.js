/* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/



//Importing classes class from @googlemaps/js-api-loader >>> stored in package.json
import { Loader } from '@googlemaps/js-api-loader';
import MarkerClusterer from '@google/markerclustererplus';

//Creating an apiOptions object.
const apiOptions = {
    // apiKey: "YOUR API KEY"
    apiKey: "AIzaSyA-IPtTLGSgovH_q3RBhYT6adJ3CPSmBbU"
  }

//Creating a Loader object, passing it the apiOptions object.
const loader = new Loader(apiOptions);

//Calling the load() method on the Loader object.
loader.load().then(() => {
    console.log('Maps JS API loaded');
    const map = displayMap(); //displaying the map
    // const markers = addMarkers(map); // displaying markers
    // const clusters = clusterMarkers(map, markers); //displaying marker clusters
    addPanToMarker(map, markers); // centering map view on a clicked marker
});

// Displaying the map taking into account location
function displayMap() {
  // Checking if the browser supports the Geolocation API
  if (navigator.geolocation) {
    // Use the Geolocation API to get the current position
    navigator.geolocation.getCurrentPosition(
      function (position) {
        // getting the latitude and longitude from the position object
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Creating a LatLng object for the current location
        var currentLocation = new google.maps.LatLng(latitude, longitude);

        // Map options
        const mapOptions = {
          // center: currentLocation,
          center: { lat: 45.7640, lng: 4.8357 }, // Lyon
          // center: { lat: -33.860664, lng: 151.208138 }, // Sydney
          zoom: 14, // Adjust the zoom level as desired
          mapId: 5e1
        };

        // Create a new map instance
        const mapDiv = document.getElementById('map');
        const map = new google.maps.Map(mapDiv, mapOptions);
        
        // var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Add a marker at the current location
        var marker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          icon: './img/location-marker.png',
          title: "Current Location"
        });

        const markers = addMarkers(map); // displaying markers
        const clusters = clusterMarkers(map, markers); //displaying marker clusters

        return map;
      },
      function (error) {
        // Handle any errors that occur while retrieving the position
        console.log("Error: " + error.message);
      }
    );
  } else {
    // Display an error message if Geolocation is not supported
    console.log("Geolocation is not supported by this browser.");
  }
}


// // Displaying the map without current location
// function displayMap() {
//   const mapOptions = {
//     // center: { lat: -33.860664, lng: 151.208138 }, // Sydney
//     center: { lat: 45.7640, lng: 4.8357 }, // Lyon
//     zoom: 14,
//     mapId: 5e1 // supposed to be "5e1b516f321e1640"...
//   };
//   const mapDiv = document.getElementById('map');
//   const map = new google.maps.Map(mapDiv, mapOptions);
//   return map;
// }


// Adding markers to the map.
function addMarkers(map) {
    // const locations = {
    //   operaHouse: { lat: -33.8567844, lng: 151.213108 },
    //   tarongaZoo: { lat: -33.8472767, lng: 151.2188164 },
    //   manlyBeach: { lat: -33.8209738, lng: 151.2563253 },
    //   hyderPark: { lat: -33.8690081, lng: 151.2052393 },
    //   theRocks: { lat: -33.8587568, lng: 151.2058246 },
    //   circularQuay: { lat: -33.858761, lng: 151.2055688 },
    //   harbourBridge: { lat: -33.852228, lng: 151.2038374 },
    //   kingsCross: { lat: -33.8737375, lng: 151.222569 },
    //   botanicGardens: { lat: -33.864167, lng: 151.216387 },
    //   museumOfSydney: { lat: -33.8636005, lng: 151.2092542 },
    //   maritimeMuseum: { lat: -33.869395, lng: 151.198648 },
    //   kingStreetWharf: { lat: -33.8665445, lng: 151.1989808 },
    //   aquarium: { lat: -33.869627, lng: 151.202146 },
    //   darlingHarbour: { lat: -33.87488, lng: 151.1987113 },
    //   barangaroo: { lat: - 33.8605523, lng: 151.1972205 }
    // }

    // defining locations data
    // const locations = {
    //   operaHouse: [{ lat: -33.8567844, lng: 151.213108 },"My description...", "https://mywebsite", "creation_date"],
    //   tarongaZoo: [{ lat: -33.8472767, lng: 151.2188164 },"My description...", "https://mywebsite", "creation_date"],
    //   manlyBeach: [{ lat: -33.8209738, lng: 151.2563253 },"My description...", "https://mywebsite", "creation_date"],
    //   hyderPark: [{ lat: -33.8690081, lng: 151.2052393 },"My description...", "https://mywebsite", "creation_date"],
    //   theRocks: [{ lat: -33.8587568, lng: 151.2058246 },"My description...", "https://mywebsite", "creation_date"],
    //   circularQuay: [{ lat: -33.858761, lng: 151.2055688 },"My description...", "https://mywebsite", "creation_date"],
    //   harbourBridge: [{ lat: -33.852228, lng: 151.2038374 },"My description...", "https://mywebsite", "creation_date"],
    //   kingsCross: [{ lat: -33.8737375, lng: 151.222569 },"My description...", "https://mywebsite", "creation_date"],
    //   botanicGardens: [{ lat: -33.864167, lng: 151.216387 },"My description...", "https://mywebsite", "creation_date"],
    //   museumOfSydney: [{ lat: -33.8636005, lng: 151.2092542 },"My description...", "https://mywebsite", "creation_date"],
    //   maritimeMuseum: [{ lat: -33.869395, lng: 151.198648 },"My description...", "https://mywebsite", "creation_date"],
    //   kingStreetWharf: [{ lat: -33.8665445, lng: 151.1989808 },"My description...", "https://mywebsite", "creation_date"],
    //   aquarium: [{ lat: -33.869627, lng: 151.202146 },"My description...", "https://mywebsite", "creation_date"],
    //   darlingHarbour: [{ lat: -33.87488, lng: 151.1987113 },"My description...", "https://mywebsite", "creation_date"],
    //   barangaroo: [{ lat: -33.8605523, lng: 151.1972205 },"My description...", "https://mywebsite", "creation_date"],
    //   marcheDesCharpennes: [{ lat: 45.77368819287403, lng: 4.8678173295917695 },"My description...", "https://mywebsite", "creation_date"],
    //   marcheDeCroixLuizet: [{ lat: 45.78068542790973, lng: 4.883081666499264 },"My description...", "https://mywebsite", "creation_date"]
    // }
    
    //inserting 2 location
    
    const locations = {
      marcheDesCharpennes: [{ lat: 45.77368819287403, lng: 4.8678173295917695 },"My description...", "https://mywebsite", "creation_date"],
      marcheDeCroixLuizet: [{ lat: 45.78068542790973, lng: 4.883081666499264 },"My description...", "https://mywebsite", "creation_date"]
    }

    // for (const market in markets) {
    //   //load markets into the db
    //   loadDataBase('insert', markets[market]);
    // }




    // // loading mongodb database
    // const MongoClient = require('mongodb').MongoClient;

    // // Connection URL
    // // const url = 'mongodb://localhost:27017';
    // // const uri = "mongodb+srv://Cluster92300:<password>@marketscluster.zimqrlh.mongodb.net/?retryWrites=true&w=majority"; // SCRAM
    // const url = "mongodb+srv://marketscluster.zimqrlh.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority"; // X.509

    // // Database Name
    // const dbName = 'myDb';

    // // Connect to the server
    // MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    //   if (err) {
    //     console.error('Failed to connect to MongoDB:', err);
    //     return;
    //   }

    //   console.log('Connected successfully to MongoDB');

    //   const db = client.db(dbName);

    //   // Performing database operations

    //   // Insert a document
    //   const collection = db.collection('users');
    //   const document = { name: 'John Doe', email: 'john@example.com', age: 30 };
    //   collection.insertOne(document, (err, result) => {
    //     if (err) {
    //       console.error('Failed to insert document:', err);
    //       return;
    //     }

    //     console.log('Document inserted successfully:', result.insertedId);
    //   });
    // });


    



    // function loadDataBase(action, data){
    //    // loading mongodb database
    //   const MongoClient = require('mongodb').MongoClient;

    //   // Connection URL
    //   // const url = 'mongodb://localhost:27017';
    //   // const uri = "mongodb+srv://Cluster92300:<password>@marketscluster.zimqrlh.mongodb.net/?retryWrites=true&w=majority"; // SCRAM
    //   // const url = "mongodb+srv://marketscluster.zimqrlh.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority"; // X.509
    //   const url = "mongodb+srv://visitor:bC3HCSBz6gNy4FJF@marketscluster.zimqrlh.mongodb.net/?retryWrites=true&w=majority"; // Password (SCRAM)


    //   // Database Name
    //   const dbName = 'myDb';

    //   // Connect to the server
    //   MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    //     if (err) {
    //       console.error('Failed to connect to MongoDB:', err);
    //       return;
    //     }

    //     console.log('Connected successfully to MongoDB');

    //     const db = client.db(dbName);

    //     // Performing database operations

    //     //inserting markers in db
    //     if(action == 'insert'){
    //       const collection = db.collection('markets');
    //       const document = data;
    //       collection.insertOne(document, (err, result) => {
    //       if (err) {
    //         console.error('Failed to insert document:', err);
    //         return;
    //       }
    //       console.log('Document inserted successfully:', result.insertedId);
    //     });

    //     //loading markers from db
    //     }else if(action == 'load'){
    //       const collection = db.collection('markers');
    //       collection.find({}).toArray(function(err, docs) {
    //         assert.equal(err, null);
    //         console.log("Found the following records");
    //         console.log(docs)
    //         return docs;
    //       });
    //     }
    //     // else if(action == 'find'){
    //     //   findDocuments(db, function() {
    //     //     client.close();
    //     //   });
    //     // }else if(action == 'update'){
    //     //   updateDocument(db, function() {
    //     //     client.close();
    //     //   });
    //     // }else if(action == 'remove'){
    //     //   removeDocument(db, function() {
    //     //     client.close();
    //     //   });
    //     // }else if(action == 'index'){
    //     //   indexCollection(db, function() {
    //     //     client.close();
    //     //   });
    //     // }else{
    //     //   console.log('No action specified');
    //     // }
    //   });
    // }






    const markers = [];   //array to store markers
    var infoWindow;       // Reference to the currently open info window

    //creating markers from locations
    for (const location in locations) {
        const markerOptions = {
            map: map,
            position: locations[location][0]
            // icon: './img/custom_pin.png'
        }
        const marker = new google.maps.Marker(markerOptions);

        //creating content for info window
        const contentString =
          '<div id="content">' +
          '<div id="siteNotice">' +
          "</div>" +
          '<h1 id="firstHeading" class="firstHeading">'+
          location+
          '</h1>' +
          '<div id="bodyContent">' +
          locations[location][1]+
          '<p>Website: <a href="'+
          locations[location][2]+
          '">' +
          locations[location][2]+
          '</a>' +
          ".</p>" +
          '<p>(created on '+
          locations[location][3]+
          ").</p>" +
          "</div>" +
          "</div>";

        //creating info window for each marker
        const infowindow = new google.maps.InfoWindow({
          content: contentString,
          ariaLabel: location,
        });
        
        //adding info window to each marker
        marker.addListener("click", () => {

          // Close the currently open info window (if any)
          if (infoWindow) {
            infoWindow.close();
          }

          infowindow.open({
            anchor: marker,
            map,
          });

          // Set the clicked marker's info window as the currently open info window
          infoWindow = infowindow;

        });

        
        markers.push(marker);
    }
    return markers;
}

// Adding a marker clusterer to manage the markers.
function clusterMarkers(map, markers) {
    const clustererOptions = { imagePath: './img/m' }
    const markerCluster = new MarkerClusterer(map, markers, clustererOptions);
    return markerCluster
}

//centering the map on markers
function addPanToMarker(map, markers) {
    markers.map(marker => {
      marker.addListener('click', event => {
        const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        map.panTo(location);
      });
    });
    return markers
}
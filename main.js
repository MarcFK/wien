/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup(),
  lines: L.featureGroup(),
  stops: L.featureGroup(),
  zones: L.featureGroup(),
  hotels: L.markerClusterGroup({
    disableClusteringAtZoom: 17
  }),

}

// Hintergrundlayer
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "OpenSnowMap": L.tileLayer.provider("OpenSnowMap.pistes"),
  }, {
    "Sehenswürdigkeiten": themaLayer.sights,
    "Vienna Sightseeing Linien": themaLayer.lines,
    "Haltestellen Sightseeing": themaLayer.stops,
    "Fußgängerzonen": themaLayer.zones,
    "Hotels": themaLayer.hotels

  })
  .addTo(map);

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

L.control
  .fullscreen()
  .addTo(map);

// function addiere (zahl1, zahl2) {
//   let summe = zahl1 + zahl2;
//   console.log("Summe: ", summe);
// }

// addiere(4, 7);

async function loadSights(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson); // nicht unbedingt nötig
  L.geoJSON(geojson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: "icons/photo.png",
          iconAnchor: [16, 37],
          popupAnchor: [0, -37]

        })
      });
    },

    onEachFeature: function (feature, layer) {
      // console.log(feature);
      // console.log(feature.properties.NAME);
      layer.bindPopup(`
        <img src = "${feature.properties.THUMBNAIL}" alt ="*">
        <h4><a href = "${feature.properties.WEITERE_INF}" 
        target = "wien" > ${feature.properties.NAME}</a></h4>
        <adress> ${feature.properties.ADRESSE}<address>
        `);
    }
  }).addTo(themaLayer.sights);
}

loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")

/* Sightseeing */

// Touristische Kraftfahrlinien
// lines

async function loadLines(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    style: function (feature) {
      // console.log(feature.properties.LINE_NAME);
      let lineName = feature.properties.LINE_NAME;
      let lineColor = "black";
      if (lineName == "Red Line") {
        lineColor = "#FF4136";
      } else if (lineName == "Yellow Line") {
        lineColor = "#FFDC00";
      } else if (lineName == "Blue Line") {
        lineColor = "#0074D9";
      } else if (lineName == "Green Line") {
        lineColor = "#2ECC40";
      } else if (lineName == "Grey Line") {
        lineColor = "#AAAAAA";
      } else if (lineName == "Orange Line") {
        lineColor = "#FF851B";
      } else {
        // vielleicht kommen noch andere Linien dazu...
      }

      return {
        color: lineColor,
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0.5,

      };

    },

    onEachFeature: function (feature, layer) {
      // console.log(feature);
      layer.bindPopup(`
      <h4><i class = "fa-solid fa-bus"></i> ${feature.properties.LINE_NAME} </h4>
      <start><i class = "fa-regular fa-circle-stop"></i> ${feature.properties.FROM_NAME} </start>
      <br><i class = "fa-solid fa-arrow-down"></i>
      <br><finish><i class = "fa-regular fa-circle-stop"></i> ${feature.properties.TO_NAME} </finish>
      `);
    }
  }).addTo(themaLayer.lines);
}

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")

// Touristische Kraftfahrlinien Haltestellen Vuenna Sightseeing linie Standorte Wien
// stops
/*
bus_1.png // Red
bus_2.png // Yellow
bus_3.png // Blue
bus_4.png // Green
bus_5.png // Grey
bus_6.png // Orange
*/

async function loadStops(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson); // nicht unbedingt nötig
  L.geoJSON(geojson, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
          iconAnchor: [16, 37],
          popupAnchor: [0, -37]
        })
      })

    },

    onEachFeature: function (feature, layer) {
      console.log(feature.properties);
      layer.bindPopup(`
      <h4><i class = "fa-solid fa-bus"></i> ${feature.properties.LINE_NAME} </h4>
      <statid> ${feature.properties.STAT_ID} </statid>
      <station> ${feature.properties.STAT_NAME} </station>
      `);
    }
  }).addTo(themaLayer.stops);
}

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")

// Fußgängerzone Wien
// zones

async function loadZones(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson);
  L.geoJSON(geojson, {
    style: function (feature) {
      return {
        color: "#F012BE",
        weight: 1,
        opacity: 0.4,
        fillOpacity: 0.1,

      };

    },

    onEachFeature: function (feature, layer) {
      // console.log(feature);
      layer.bindPopup(`
      <h4> Fußgängerzone ${feature.properties.ADRESSE} </h4>
      <time><i class = "fa-regular fa-clock"></i> ${feature.properties.ZEITRAUM} </time>
      <p><info><i class = "fa-solid fa-circle-info"></i> ${feature.properties.AUSN_TEXT} </info></p>
      `);
    }
  }).addTo(themaLayer.zones);
}

loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")

// Hotels und Unterkünfte Wien
// hotels

async function loadHotels(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  // console.log(geojson); // nicht unbedingt nötig
  L.geoJSON(geojson, {
    pointToLayer: function (feature, latlng) {
      // console.log(feature.properties.LINE_NAME);
      let hotelKat = feature.properties.KATEGORIE_TXT;
      console.log(hotelKat)
      let hotelicon;

      if (hotelKat == "nicht kategorisiert") {
        hotelicon = "icons/hotel_0star.png";
      } else if (hotelKat == "1*") {
        hotelicon = "icons/hotel_1star.png";
      } else if (hotelKat == "2*") {
        hotelicon = "icons/hotel_2stars.png";
      } else if (hotelKat == "3*") {
        hotelicon = "icons/hotel_3stars.png";
      } else if (hotelKat == "4*") {
        hotelicon = "icons/hotel_4stars.png";
      } else if (hotelKat == "5*") {
        hotelicon = "icons/hotel_5stars.png";
      } else {
        hotelicon = "icons/hotel_0star.png"
      }

     return L.marker(latlng, {
      icon: L.icon({
        iconUrl: hotelicon,
        iconAnchor: [16, 37],
        popupAnchor: [0, -37]
      })
    });

  },

    onEachFeature: function (feature, layer) {
      // console.log(feature);
      layer.bindPopup(`
      <h2> ${feature.properties.BETRIEB} </h2>
      <h4> ${feature.properties.BETRIEBSART_TXT} ${feature.properties.KATEGORIE_TXT} </h4>
      <adress> Addr.: ${feature.properties.ADRESSE} </adress>
      <br><tel> Tel.: <a href = "${feature.properties.KONTAKT_TEL}"> ${feature.properties.KONTAKT_TEL} </a></tel>
      <br><a href = "${feature.properties.KONTAKT_EMAIL}"> ${feature.properties.KONTAKT_EMAIL} </a>
      <br><a href = "${feature.properties.WEBLINK1}"> Homepage </a>
      `);
    }
  }).addTo(themaLayer.hotels);
}

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")


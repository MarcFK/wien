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
  sights: L.featureGroup().addTo(map),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup().addTo(map),
  zones: L.featureGroup().addTo(map),
  hotels: L.featureGroup().addTo(map)

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

  })
  .addTo(map);

// Marker Stephansdom
L.marker([stephansdom.lat, stephansdom.lng])
  .addTo(map)
  .bindPopup(stephansdom.title)
  .openPopup();

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
  console.log(geojson); // nicht unbedingt nötig
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      console.log(feature);
      console.log(feature.properties.NAME);
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


/* suche Sightseeing */

// loadLines
// Touristische Kraftfahrlinien
// lines

async function loadLines(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson); // nicht unbedingt nötig
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      
    }
  }).addTo(themaLayer.lines);
}

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")


// loadStops
// Touristische Kraftfahrlinien Haltestellen Vuenna Sightseeing linie Standorte Wien
// stops

async function loadStops(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson); // nicht unbedingt nötig
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      
    }
  }).addTo(themaLayer.stops);
}

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")


// "fußgängerzone"
// loadZones
// Fußgängerzone Wien

async function loadZones(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson); // nicht unbedingt nötig
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      
    }
  }).addTo(themaLayer.zones);
}

loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")


// hotels
// loadHotels
// Hotesl und Unterkünfte Wien
// hotels

async function loadHotels(url) {
  // console.log("Loading", url)
  let response = await fetch(url);
  let geojson = await response.json();
  console.log(geojson); // nicht unbedingt nötig
  L.geoJSON(geojson, {
    onEachFeature: function (feature, layer) {
      
    }
  }).addTo(themaLayer.hotels);
}

loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")


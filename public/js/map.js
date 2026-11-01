(function () {
  if (typeof mapboxgl === "undefined" || typeof mapToken === "undefined" || !mapToken) return;
  if (typeof listing === "undefined" || !listing.geometry || !listing.geometry.coordinates) return;
  const container = document.getElementById("map");
  if (!container) return;

  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // [lng, lat]
    zoom: 12,
  });
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");


  const popup = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = listing.location;
  const note = document.createElement("p");
  note.style.margin = "4px 0 0";
  note.textContent = "Approximate location";
  popup.append(title, note);

  new mapboxgl.Marker({ color: "#0f4c45" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setDOMContent(popup))
    .addTo(map);
})();

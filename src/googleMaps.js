function AppViewModel() {
    var self = this;

    this.searchOption = ko.observable("");
    this.markers = [];

    $(document).ready(function() {
        function setHeight() {
          windowHeight = $(window).innerHeight();
          $('#map').css('min-height', windowHeight);
          $('#sidebar').css('min-height', windowHeight);
        };
        setHeight();

        $(window).resize(function() {
          setHeight();
        });
      });

    // This function populates the infowindow when the marker is clicked.
    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;

    // Foursquare API Client
    clientID = "HCTWUC33UYT4GLEEWFWK4H4UQTRLIDITAFTZZCOUQJORRJTA";
    clientSecret =
                "GE1D2W004CROWIJBHEMNDKTTFPEZ5V0121F5NAN5VYPQ2ES0";

    // URL for Foursquare API
    var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + clientID +
                '&client_secret=' + clientSecret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';

    // Foursquare API
    $.getJSON(apiUrl).done(function(marker) {
                var response = marker.response.venues[0];
                self.street = response.location.formattedAddress[0];
                self.city = response.location.formattedAddress[1];


                self.htmlContentFoursquare =
                    '<div>' +
                    '<h6 class="iw_address_title"> Address: </h6>' +
                    '<p class="iw_address">' + self.street + '</p>' +
                    '<p class="iw_address">' + self.city + '</p>' +
                    '</div>' + '</div>';

                infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {

    // sends an alert if the foursquare API is down.
    alert( "There was an issue loading the Foursquare API. Please refresh your page to try again."
                );
            });

            this.htmlContent = '<div>' + '<h4 class="iw_title">' + marker.title +
                '</h4>';

            infowindow.open(map, marker);

            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };

    this.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    initMap = () => {
        var mapAustin = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(30.316056, -97.724944),
            zoom: 12,
        };

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(mapAustin, mapOptions);

    // Set InfoWindow
    this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < locations.length; i++) {
            this.markerTitle = locations[i].title;
            this.markerLat = locations[i].lat;
            this.markerLng = locations[i].lng;

    // Google Maps marker setup
    this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.populateAndBounceMarker);
        }
    };

    initMap();

    // This block appends our locations to a list using data-bind
    this.myLocationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

googleError = function googleError() {
    alert(
        'Oops. Google Maps did not load. Please refresh the page and try again!'
    );
};

function startApp() {
    ko.applyBindings(new AppViewModel());
}

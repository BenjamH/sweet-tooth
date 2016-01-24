var Main = React.createClass({
  getInitialState: function(){
    return {
      data:null,
      longitude:'',
      latitude:'',
      location:'',
      showCone:true
    }
  },
  componentDidMount(){
    console.log('initial state:', this.state)

    this.getLocation();
  },
  sendStateData: function(){
    var formData = {
      location: {
        longitude:this.state.longitude,
        latitude:this.state.latitude
      }
    }
    $.ajax({
      url: "/searches",
      dataType: 'json',
      type: 'POST',
      data: formData,
      success: function(result) {
        this.setState({data:result.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error( status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    if (this.state.showCone) {
      return (
        <div>
        <image className="ice-cream" onClick={this.handleIceCreamClick} src={this.props.img_src} />
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  },
  handleIceCreamClick: function(){
    this.setLocation();
    var map = $('#map');
    map.removeClass('hide-map');
    map.addClass('show-map');
    this.setState({showCone:false})
  },
  getLocation: function(){
    var lng = $("#user_long");
    var lat = $("#user_lat");
    function getCoordinates() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
      }
    }
    function setPosition(position) {
      lat.val(position.coords.latitude)
      lng.val(position.coords.longitude)
      console.log('inside set location', this.state)
    }
    getCoordinates();
  },
  setLocation: function(){
    var long=$("#user_long").val()
    var lat=$("#user_lat").val()
    this.setState({longitude:long})
    this.setState({latitude:lat})
  },
  componentDidUpdate: function(){
    if(this.state.data===null) {
      if (this.state.longitude && this.state.latitude) {
        this.sendStateData();
      }
    } else {
      this.showMap();
    }
  },
  showMap: function(){

    function initMap(longitude,latitude,dataArray) {
      var latitude = parseFloat(latitude)
      var longitude = parseFloat(longitude)
      var mapCenter = new google.maps.LatLng({lat: latitude, lng: longitude})
      var mapOptions = {
        zoom: 16,
        center: mapCenter,
        scrollwheel: false,
        draggable:false
      }
      map = new google.maps.Map(document.getElementById("map"), mapOptions);


      var selfMarker = new google.maps.Marker({
        position: mapCenter,
        map: map
      });

      var IceCreamCoords = [];
      var iceCreamMarkers = [];

      for (var i = 0; i < dataArray.length; i++) {
        var coords= {lat: dataArray[i]['latitude'], lng: dataArray[i]['longitude']}
        iceCreamMarkers[i] = createMarker({
          position:new google.maps.LatLng(coords),
          map: map,
          title: 'ice cream',
          icon: "http://31.media.tumblr.com/tumblr_ls9k18YAcI1qg66hv.gif",
          optimized: false
        },);
        iceCreamMarkers[i].addListener('click', toggleBounce);
        iceCreamMarkers[i].addListener('mouseover', openInfoWindow);
        iceCreamMarkers[i].addListener('mouseout', closeInfoWindow);
      };
    }

    function createMarker(options, html) {
      var marker = new google.maps.Marker(options);
      if (html) {
        google.maps.event.addListener(marker, "click", function() {
          infoWindow.setContent(html);
          infoWindow.open(options.map, this);
        });
      }
      return marker;
    }

    function toggleBounce() {
      if (this.getAnimation()) {
        this.setAnimation(null);
      } else {
        this.setAnimation(google.maps.Animation.BOUNCE);
      }
    }

    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">Bi-Rite Creamery</h1>'+
    '<div id="bodyContent">'+
    '<p><b>Bi-Rite Creamery</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the '+
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
    'south west of the nearest large town, Alice Springs; 450&#160;km '+
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
    'features of the Uluru - Kata Tjuta National Park. Uluru is '+
    'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
    'Aboriginal people of the area. It has many springs, waterholes, '+
    'rock caves and ancient paintings. Uluru is listed as a World '+
    'Heritage Site.</p>'+
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    '(last visited June 22, 2009).</p>'+
    '</div>'+
    '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    function openInfoWindow() {
      infoWindow.open(map, this);
    }

    function closeInfoWindow() {
      infoWindow.close(map, this);
    }


    initMap(this.state.longitude,this.state.latitude, this.state.data)
    console.log(this.state.data.length);
  }
});

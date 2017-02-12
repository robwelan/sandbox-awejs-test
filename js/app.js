navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var latitude, longitude;

function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    //output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;

    // output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
    //
    // var img = new Image();
    // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
    //
    // output.appendChild(img);
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  // output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}

window.addEventListener('load', function() {
    geoFindMe();
    // initialize awe after page loads
    window.awe.init({
      // automatically detect the device type
      device_type: awe.AUTO_DETECT_DEVICE_TYPE,
      // populate some default settings
      settings: {
      	container_id: 'container',
        fps: 30,
//        default_camera_position: { x:0, y:0, z:0 },
          default_camera_position: { x: latitude, y: longitude, z: 200 },
        default_lights:[
          {
            id: 'hemisphere_light',
            type: 'hemisphere',
            color: 0xCCCCCC
          },
        ],
      },
      ready: function() {
        var d = '?_='+Date.now();
        var dirCore = 'libraries/js/';
        var dirPlugins = dirCore + 'plugins/'
        // load js files based on capability detection then setup the scene if successful
        awe.util.require([
          {
            capabilities: ['webgl','gum'],
            files: [
              [dirCore + 'awe-standard-dependencies.js'+d, dirCore + 'awe-standard.js'+d ], // core dependencies for this app
              [dirPlugins + 'StereoEffect.js'+d, dirPlugins + 'VREffect.js'+d], // dependencies for render effects
              dirPlugins + 'awe.rendering_effects.js'+d,
              dirPlugins + 'awe-standard-object_clicked_or_focused.js'+d, // object click/tap handling plugin
              dirCore + 'awe.gyro.js'+d, // basic gyro handling
              dirCore + 'awe.mouse.js'+d, // basic mouse handling
            ],
            success: function() {
              // setup and paint the scene
			        awe.setup_scene();
  						var click_plugin = awe.plugins.view('object_clicked');
  						if (click_plugin) {
    						click_plugin.register();
    						click_plugin.enable();
  						}
  						var gyro_plugin = awe.plugins.view('gyro');
  						if (gyro_plugin) {
    						gyro_plugin.enable();
  						}
  						var mouse_plugin = awe.plugins.view('gyro');
  						if (gyro_plugin) {
    						gyro_plugin.enable();
  						}
              awe.settings.update({data:{value: 'ar'}, where:{id: 'view_mode'}})
  						var render_effects_plugin = awe.plugins.view('render_effects');
  						if (render_effects_plugin) {
    						render_effects_plugin.enable();
  						}

              // setup some code to handle when an object is clicked/tapped
              window.addEventListener('object_clicked', function(e) {
                var p = awe.projections.view(e.detail.projection_id);
                awe.projections.update({ // rotate clicked object by 180 degrees around x and y axes over 10 seconds
                  data:{
                    animation: {
                      duration: 10,
                    },
                    rotation:{ y: p.rotation.y+180, x: p.rotation.x+180 }
                  },
                  where:{ id:e.detail.projection_id }
                });
              }, false);
			        // add some points of interest (poi) for each of the compass points
            //  -27.6156320,152.7544890
			      //  awe.pois.add({ id:'north', position: { x:0, y:0, z:200 } });
              awe.pois.add({ id:'north', position: { x:-27.6156320, y:152.7544890, z:200 } });
			        awe.pois.add({ id:'north_east', position: { x:200, y:0, z:200 } });
			        awe.pois.add({ id:'east', position: { x:200, y:0, z:0 } });
			        awe.pois.add({ id:'south_east', position: { x:200, y:0, z:-200 } });
			        awe.pois.add({ id:'south', position: { x:0, y:0, z:-200 } });
			        awe.pois.add({ id:'south_west', position: { x:-200, y:0, z:-200 } });
			        awe.pois.add({ id:'west', position: { x:-200, y:0, z:0 } });
			        awe.pois.add({ id:'north_west', position: { x:-200, y:0, z:200 } });

			        // add projections to each of the pois
			        awe.projections.add({
			          id:'n',
			          geometry:{ shape:'cube', x:50, y:50, z:50 },
                rotation:{ x:30, y:30, z:0 },
			          material:{
			            type: 'phong',
			            color:0xFF0000,
			          },
			        }, { poi_id: 'north' });
			        awe.projections.add({
			          id:'ne',
			          geometry:{ shape:'sphere', radius:10 },
			          material:{
			            type: 'phong',
			            color:0xCCCCCC,
			          },
			        }, { poi_id: 'north_east' });
			        awe.projections.add({
			          id:'e',
			          geometry:{ shape:'cube', x:50, y:50, z:50 },
                rotation:{ x:30, y:30, z:0 },
			          material:{
			            type: 'phong',
			            color:0x00FF00,
			          },
			        }, { poi_id: 'east' });
			        awe.projections.add({
			          id:'se',
			          geometry:{ shape:'sphere', radius:10 },
			          material:{
			            type: 'phong',
			            color:0xCCCCCC,
			          },
			        }, { poi_id: 'south_east' });
			        awe.projections.add({
			          id:'s',
			          geometry:{ shape:'cube', x:50, y:50, z:50 },
                rotation:{ x:30, y:30, z:0 },
			          material:{
			            type: 'phong',
			            color:0xFFFFFF,
			          },
			        }, { poi_id: 'south' });
			        awe.projections.add({
			          id:'sw',
			          geometry:{ shape:'sphere', radius:10 },
			          material:{
			            type: 'phong',
			            color:0xCCCCCC,
			          },
			        }, { poi_id: 'south_west' });
			        awe.projections.add({
			          id:'w',
			          geometry:{ shape:'cube', x:50, y:50, z:50 },
                rotation:{ x:30, y:30, z:0 },
			          material:{
			            type: 'phong',
			            color:0x0000FF,
			          },
			        }, { poi_id: 'west' });
			        awe.projections.add({
			          id:'nw',
			          geometry:{ shape:'sphere', radius:10 },
			          material:{
			            type: 'phong',
			            color:0xCCCCCC,
			          },
			        }, { poi_id: 'north_west' });

            },
          },
          { // else create a fallback
            capabilities: [],
            files: [],
            success: function() {
              document.body.innerHTML = '<p>This demo currently requires a standards compliant mobile browser.';
              return;
            },
          },
        ]);
      }
    });
  });

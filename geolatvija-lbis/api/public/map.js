(function () {
  var scriptEls = document.getElementsByTagName("script");
  var thisScriptEl = scriptEls[scriptEls.length - 1];
  var scriptPath = thisScriptEl.src;
  var link = document.createElement("a");
  link.setAttribute("href", scriptPath);
  var appDomain = link.protocol + "//" + link.hostname;
  link = null;

  window.mapAPI = function (id, callback) {
    function mapObj(iframe, domain) {
      var events = [];
      this.RegisterForEvent = function (event, callback) {
        events.push({
          event: event,
          callback: callback,
        });
        var data = {
          mapApiAction: "REGISTER_FOR_EVENT",
          params: [event],
        };
        iframe.postMessage(data, domain);
      };
      this.UnRegisterForEvent = function (event) {
        for (var i = events.length - 1; i >= 0; i--) {
          if (events[i].event == event) {
            events.splice(i, 1);
          }
        }
        var data = {
          mapApiAction: "UNREGISTER_FOR_EVENT",
          params: [event],
        };
        iframe.postMessage(data, domain);
      };
      this.ZoomToPoint = function (x, y) {
        var data = {
          mapApiAction: "ZOOM_TO_POINT",
          params: [x, y],
        };
        iframe.postMessage(data, domain);
      };
      this.ZoomToAddress = function (ATVK, addressCode) {
        var data = {
          mapApiAction: "ZOOM_TO_ADDRESS",
          params: [ATVK, addressCode],
        };
        iframe.postMessage(data, domain);
      };
      this.EnableAddressPopups = function (state) {
        var data = {
          mapApiAction: "ENABLE_ADDRESS_POPUPS",
          params: [state],
        };
        iframe.postMessage(data, domain);
      };
      this.ShowMarkers = function (array) {
        var data = {
          mapApiAction: "SHOW_MARKERS",
          params: [array],
        };
        iframe.postMessage(data, domain);
      };
      this.EnableMarkerPopups = function (state) {
        var data = {
          mapApiAction: "ENABLE_MARKER_POPUPS",
          params: [state],
        };
        iframe.postMessage(data, domain);
      };
      this.EnableApplicationMarkerPopups = function (state) {
        var data = {
          mapApiAction: "ENABLE_APPLICATION_MARKER_POPUPS",
          params: [state],
        };
        iframe.postMessage(data, domain);
      };

      var map = this;
      window.addEventListener(
        "message",
        function (event) {
          if (event.origin !== domain) return;

          if (event.data.mapEvent == "MAP_INIT") {
            var data = { frameId: id, mapApiAction: "mapApiOnLoad" };
            iframe.postMessage(data, domain);
          }

          if (
            event.data != null &&
            event.data.mapEvent != null &&
            event.data.frameId == id
          ) {
            var mapEvent = event.data.mapEvent;
            var params = mapEvent == "MAP_LOADED" ? [map] : event.data.params;
            for (var i in events) {
              if (events[i].event == mapEvent) {
                events[i].callback.apply(this, params);
              }
            }
            if (mapEvent == "MAP_LOADED") map.UnRegisterForEvent("MAP_LOADED");
          }
        },
        false
      );
    }

    var docReady = function (callback) {
      if (document.readyState !== "loading") {
        return callback();
      }
      return window.addEventListener("load", callback);
    };

    docReady(function () {
      var iframe = document.querySelector("#" + id);
      var iframeWindow = iframe.contentWindow;
      var data = { frameId: id, mapApiAction: "mapApiOnLoad" };
      var obj = new mapObj(iframeWindow, appDomain);
      obj.RegisterForEvent("MAP_LOADED", callback);
      iframeWindow.postMessage(data, appDomain);
    });
  };
})();

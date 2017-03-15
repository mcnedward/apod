function AstroPicOfDay(service) {
  var self = this;

  self.date = ko.observable(moment());
  self.error = ko.observable();
  self.alert = $('.alert');
  self.loading = ko.observable(true);

  self.loadCount = ko.observable();
  self.apods = ko.observableArray();
  self.rows = ko.observableArray();

  /**
   * Creates the grids for the apods
   * @param {*[]} apods - An array of apod objects
   */
  function layoutImages(apods) {
    var cols = [];
    for (var i = 1; i <= apods.length; i++) {
      cols.push(apods[i - 1]);
      if (i % 7 === 0) {
        // Create a row of 12
        self.rows.push(cols);
        cols = [];
      }
    }
    if (cols.length > 0) {
      self.rows.push(cols);
    }
    self.loading(false);

    // Toggle the tooltips, need the timeout...
    setTimeout(() => {
      $('[data-toggle="popover"]').popover({
        trigger: 'focus',
        container: 'body'
      });
    }, 500)
  }

  function successCallback(apod) {
    self.apods.push(apod);
  }
  function errorCallback(text) {
    self.error(text);
    self.alert.fadeIn('slow');
  }

  self.loadCount(31);
  for (var i = 1; i <= self.loadCount(); i++) {
    var date = i < 10 ? '0' + i : i;
    var requestDate = '2017-01-' + date;
    service.getApod(requestDate, successCallback, errorCallback);
  }

  ko.computed(() => {
    var apodCount = self.apods().length;
    if (apodCount >= self.loadCount()) {
      // All images should be ready (might need to update this, in case some of the images could not be loaded)
      layoutImages(self.apods());
    }
  })

  self.closeAlert = () => {
    self.alert.fadeOut('slow');
  }
}
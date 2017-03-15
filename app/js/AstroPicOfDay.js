function AstroPicOfDay(service) {
  var self = this;

  self.fromDate = ko.observable(moment().subtract(1, 'M'));
  self.toDate = ko.observable(moment());
  self.loading = ko.observable(true);
  self.loadCount = ko.observable();
  self.apods = ko.observableArray();
  self.rows = ko.observableArray();
  self.error = ko.observable();
  self.warning = ko.observable();
  var alertError = $('#alertError');
  var alertWarning = $('#alertWarning');

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
    showError(text);
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

  // Validate the fromDate
  ko.computed(() => {
    var fromDate = moment(self.fromDate());
    var monthBefore = moment(self.toDate.peek()).subtract(1, 'M');
    if (fromDate.isBefore(monthBefore, 'day')) {
      showWarning('Too far in the past!');
      self.fromDate(monthBefore);
    }
    var dayBefore = moment(self.toDate.peek()).subtract(1, 'd');
    if (fromDate.isAfter(dayBefore, 'day')) {
      showWarning('Too far in the future!');
      self.fromDate(dayBefore);
    }
  });
  // Validate the toDate
  ko.computed(() => {
    var toDate = moment(self.toDate());
    var monthAfter = moment(self.fromDate.peek()).add(1, 'M');
    if (toDate.isAfter(monthAfter, 'day')) {
      showWarning('Too far in the future!');
      self.toDate(monthAfter);
    }
    var dayAfter = moment(self.fromDate.peek()).add(1, 'd');
    if (toDate.isBefore(dayAfter, 'day')) {
      showWarning('Too far in the past!');
      self.toDate(dayAfter);
    }
  });

  function showError(text) {
    self.error(text);
    alertError.fadeIn('slow');
  }
  function showWarning(text) {
    self.warning(text);
    alertWarning.fadeIn('slow');
  }
  self.closeAlertError = () => {
    alertError.fadeOut('slow');
  }
  self.closeAlertWarning = () => {
    alertWarning.fadeOut('slow');
  }
}
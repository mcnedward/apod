function AstroPicOfDay() {
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
      if (i % 12 === 0) {
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

  function requestImage(requestDate) {
    fetch('/api/apod?date=' + requestDate).then((response) => {
      if (!response.ok) {
        response.text().then((text) => {
          self.error(text);
          self.alert.fadeIn('slow');
        });
        return;
      }
      response.json().then((data) => {
        self.apods.push(new Apod(data));
      });
    });
  }

  self.loadCount(31);
  for (var i = 1; i <= self.loadCount(); i++) {
    var date = i < 10 ? '0' + i : i;
    var requestDate = '2017-01-' + date;
    // requestImage(requestDate);

    self.apods.push(new Apod({
      title: 'Something ' + i,
      url: '/img/face.png'
    }));
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
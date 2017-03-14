function APOD() {
  var self = this;

  self.explanation = ko.observable();
  self.title = ko.observable();
  self.hdUrl = ko.observable();
  self.url = ko.observable();
  self.date = ko.observable(moment());
  self.error = ko.observable();
  self.alert = $('.alert');
  self.loading = ko.observable(false);

  function requestImage(requestDate) {
    self.loading(true);
    fetch('/api/apod?date=' + requestDate).then((response) => {
      self.loading(false);
      if (!response.ok) {
        response.text().then((text) => {
          self.error(text);
          self.alert.fadeIn('slow');
          return;
        });
      }
      response.json().then((data) => {
        self.explanation(data.explanation);
        self.title(data.title);
        self.hdUrl(data.hdurl);
        self.url(data.url);
      });
    });
  }

  ko.computed(() => {
    var requestDate = moment(self.date()).format('YYYY-MM-DD');
    requestImage(requestDate);
  })

  self.closeAlert = () => {
    self.alert.fadeOut('slow');
  }
}
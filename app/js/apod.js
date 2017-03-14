function APOD() {
  var self = this;

  self.explanation = ko.observable();
  self.title = ko.observable();
  self.hdUrl = ko.observable();
  self.url = ko.observable();
  self.date = ko.observable(moment());
  self.error = ko.observable();
  self.alert = $('.alert');

  // fetch('/api/apod').then((response) => {
  //   if (!response.ok) {
  //     response.text().then((text) => {
  //       self.error(text);
  //       self.alert.fadeIn('slow');
  //       return;
  //     });
  //   }
  //   response.json().then((data) => {
  //     self.explanation(data.explanation);
  //     self.title(data.title);
  //     self.hdUrl(data.hdurl);
  //     self.url(data.url);
  //   });
  // });

  self.closeAlert = () => {
    self.alert.fadeOut('slow');
  }
}
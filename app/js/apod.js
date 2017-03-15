function Apod(data) {
  var self = this;

  self.date = ko.observable(data ? data.date : null);
  self.explanation = ko.observable(data ? data.explanation : null);
  self.title = ko.observable(data ? data.title : null);
  self.hdUrl = ko.observable(data ? data.hdurl : null);
  self.url = ko.observable(data && data.url ? data.url : '');
}
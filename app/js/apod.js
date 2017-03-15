function Apod(data) {
  var self = this;

  self.date = ko.observable(data ? data.date : null);
  self.explanation = ko.observable(data ? data.explanation : null);
  self.title = ko.observable(data ? data.title : null);
  self.hdUrl = ko.observable(data ? data.hdurl : null);
  self.url = ko.observable(data && data.url ? data.url : '');
  self.mediaType = ko.observable(data ? data.media_type : null);

  self.isVideo = () => {
    return self.mediaType() === 'video';
  }

  self.toJSON = () => {
    return {
      data: self.date(),
      explanation: self.explanation(),
      title: self.title(),
      hdUrl: self.hdUrl(),
      url: self.url(),
      mediType: self.mediaType(),
      isVideo: self.isVideo()
    };
  }
}
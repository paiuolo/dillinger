
'use strict';

describe("pubblicareService", function() {

  var
      service      = null,
      $httpBackend = null,
      diNotify     = null;

  beforeEach(window.angular.mock.module('Dillinger'));

  beforeEach( inject(function(_pubblicareService_, _$httpBackend_, _diNotify_) {
    service = _pubblicareService_;
    $httpBackend = _$httpBackend_;
    diNotify = _diNotify_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should save the current file to pubblicare and return success message', function() {

    var markDownDocument = {
      content:   '#Dillinger Test',
      title:   'Pubblicare Dillinger'
    };

    $httpBackend.expectPOST('save/pubblicare').respond(200);

    service.saveFile(markDownDocument);

    $httpBackend.flush();

    var diNotifyElements = document.getElementsByClassName('diNotify-message');
    var diNotifyElementsText = '';
    for (var i= 0; i < diNotifyElements.length; ++i) {
      diNotifyElementsText = diNotifyElementsText + diNotifyElements[i].innerHTML;
    }
    expect(diNotifyElementsText).toContain('Successfully saved to Pubblicare');
  });


});
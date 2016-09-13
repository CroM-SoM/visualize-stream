(function() {
  'use strict';

  describe('service dataService', function() {
    var dtservice;

    beforeEach(module('test'));
    beforeEach(inject(function(_dtservice_) {
      dtservice = _dtservice_;
    }));

    it('should be registered', function() {
      expect(dtservice).not.toEqual(null);
    });

    describe('apiMethod function', function() {
      it('should exist', function() {
        expect(dtservice.apiMethod).not.toEqual(null);
      });

      it('should return array of object', function() {
        var data = dtservice.apiMethod();
        expect(data).toEqual(jasmine.any(Array));
        expect(data[0]).toEqual(jasmine.any(Object));
        expect(data.length > 5).toBeTruthy();
      });
    });
  });
})();

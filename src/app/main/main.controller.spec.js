(function() {
  'use strict';

  describe('controllers', function(){
    var vm;
    var $timeout;

    beforeEach(module('test'));
    beforeEach(inject(function(_$controller_, _$timeout_) {
      vm = _$controller_('MainController');
      $timeout = _$timeout_;
    }));

    it('should have a timestamp creation date', function() {
      expect(vm.creationDate).toEqual(jasmine.any(Number));
    });

    it('should define animate class after delaying timeout ', function() {
      $timeout.flush();
      expect(vm.classAnimation).toEqual('rubberBand');
    });

  });
})();

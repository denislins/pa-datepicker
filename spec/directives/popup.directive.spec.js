/* jshint multistr: true */
describe('directive: pa-datepicker-popup', function() {

  beforeEach(function() {
    module('pa-datepicker');
  });

  afterEach(function() {
    angular.element('body').empty();
  });

  describe('open/close', function() {

    beforeEach(inject(function($rootScope, $compile, $timeout) {
      this.element = angular.element('\
        <pa-datepicker-popup is-open="isPopupOpen">\
          <pa-datepicker ng-model="date.selected"></pa-datepicker>\
        </pa-datepicker-popup>\
      ');

      this.scope = $rootScope.$new();
      this.scope.date = { selected: new Date('2015-03-02 00:00:00') };

      $compile(this.element)(this.scope);
      this.scope.$digest();

      $timeout.flush();

      angular.element(document.querySelector('body')).append(this.element);
    }));

    it('starts up hidden', function() {
      expect(this.element).toBeHidden();
    });

    it('shows up when the flag is true', function() {
      this.scope.isPopupOpen = true;
      this.scope.$digest();

      expect(this.element).not.toBeHidden();
    });

    it('closes the popup when a date is selected', function() {
      this.scope.isPopupOpen = true;
      this.scope.$digest();

      angular.element('tr:nth-child(2) td:nth-child(2)').click();
      var expected = new Date('2015-03-09 00:00:00');

      expect(this.element).toBeHidden();
      expect(this.scope.date.selected.getTime()).toBe(expected.getTime());
    });

  });

  describe('outside click closes popup', function() {

    function checkPopupClosing() {
      it('closes when clicking outside of datepicker', function() {
        $(document).click();
        expect(this.element).toBeHidden();
      });

      it('keeps the popup opened when the datepicker is clicked', function() {
        this.element.find('th.active-month').click();
        expect(this.element).not.toBeHidden();
      });
    }

    describe('when the datepicker is in single date mode', function() {

      beforeEach(inject(function($rootScope, $compile, $timeout) {
        this.element = angular.element('\
          <pa-datepicker-popup is-open="isPopupOpen">\
            <pa-datepicker ng-model="date"></pa-datepicker>\
          </pa-datepicker-popup>\
        ');

        this.scope = $rootScope.$new();
        this.scope.isPopupOpen = true;

        $compile(this.element)(this.scope);
        this.scope.$digest();

        $timeout.flush();

        angular.element('body').append(this.element);
      }));

      checkPopupClosing();

    });

    describe('when the datepicker is in range mode', function() {

      beforeEach(inject(function($rootScope, $compile, $timeout) {
        this.element = angular.element('\
          <pa-datepicker-popup is-open="isPopupOpen">\
            <pa-datepicker ng-model="date" mode="range"></pa-datepicker>\
          </pa-datepicker-popup>\
        ');

        this.rootScope = $rootScope;

        this.scope = $rootScope.$new();
        this.scope.isPopupOpen = true;
        this.scope.date = {
          base: {
            start: new Date('2015-04-06 00:00:00'),
            end: new Date('2015-04-10 00:00:00'),
          }
        };

        $compile(this.element)(this.scope);
        this.scope.$digest();

        $timeout.flush();

        angular.element('body').append(this.element);
      }));

      describe('when there is no selection', function() {

        checkPopupClosing();

      });

      describe('when there is a selection started', function() {

        beforeEach(function() {
          this.element
            .find('.date-panel:nth-child(1) tbody tr:nth-child(2) td:nth-child(2)')
            .click();
        });

        it('keeps the popup opened when clicking outside of datepicker', function() {
          $(document).click();
          expect(this.element).not.toBeHidden();
        });

        it('broadcasts an event', function() {
          this.rootScope.$broadcast = jasmine.createSpy();
          $(document).click();

          expect(this.rootScope.$broadcast)
            .toHaveBeenCalledWith('paDatepicker.popup.unfinishedSelection');
        });

        it('closes the popup after the selection', function() {
          this.element
            .find('.date-panel:nth-child(1) tbody tr:nth-child(2) td:nth-child(3)')
            .click();

          expect(this.element).toBeHidden();
        });

      });

    });

  });

  describe('closeAfterSelection option', function() {

    beforeEach(inject(function($rootScope, $compile, $timeout) {
      this.element = angular.element('\
        <pa-datepicker-popup is-open="isPopupOpen" close-after-selection="false">\
          <pa-datepicker ng-model="date.selected"></pa-datepicker>\
        </pa-datepicker-popup>\
      ');

      this.scope = $rootScope.$new();
      this.scope.isPopupOpen = true;
      this.scope.date = { selected: new Date('2015-03-02 00:00:00') };

      $compile(this.element)(this.scope);
      this.scope.$digest();

      $timeout.flush();

      angular.element('body').append(this.element);
      angular.element('tr:nth-child(2) td:nth-child(2)').click();
    }));

    it('selects a date', function() {
      var expected = new Date('2015-03-09 00:00:00');
      expect(this.scope.date.selected.getTime()).toBe(expected.getTime());
    });

    it('keeps the popup opened', function() {
      expect(this.element).not.toBeHidden();
    });

  });

});

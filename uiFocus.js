'use strict';

(function() {

    angular.module('uiFocus', []).
          
    constant('keyNames', {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'insert',
        46: 'delete'
    }).

    directive('uiFocusInit', function(
        $timeout
    ){
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.attr('tabindex', 0);

                // defer execution to the next event loop
                $timeout(function() {
                    _isDisplayed(element[0]) ? element[0].focus() : void 0;
                }, 0);
            }
        };
    }).

    directive('uiFocusKeymap', function(
        keyNames
    ){
        var _currentEvent;

        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var keymap = scope.$eval(attr.uiFocusKeymap);

                element.attr('tabindex', 0);

                element.bind('keydown', function(event) {
                    var _rawNewElement,
                        _boundingClientRect;

                    event instanceof KeyboardEvent ? _currentEvent = event : void 0;

                    13 === _currentEvent.keyCode ? element.triggerHandler('click') : void 0;

                    if (_rawNewElement = document.querySelector('[ui-focus="' + (keymap[_currentEvent.keyCode] || keymap[keyNames[_currentEvent.keyCode]]) + '"]')) {
                        if (_isDisplayed(_rawNewElement)) {
                            _rawNewElement.focus();
                        } else {
                            angular.element(_rawNewElement).triggerHandler('keydown');
                        }
                    } else if (13 === event.keyCode) {
                        if (!_isDisplayed(element[0])) {
                            document.querySelector('[ui-focus-init]').focus();
                        }
                    }
                });
            }
        };
    });

    function _isDisplayed(rawElement) {
        var _boundingClientRect = rawElement.getBoundingClientRect();

        return 0 !== _boundingClientRect.width || 0 !== _boundingClientRect.height;
    }

})();

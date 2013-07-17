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

                // Defer execution to the next event loop
                $timeout(function() {
                    _isDisplayed(element[0]) ? element[0].focus() : void 0;
                }, 0);
            }
        };
    }).

    directive('uiFocusKeymap', function(
        $rootElement,
        keyNames
    ){
        var _currentEvent;

        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var keymap = scope.$eval(attr.uiFocusKeymap);

                element.attr('tabindex', 0);

                element.bind('keydown', function(event) {
                    var _selectors,
                        _rawNewElement,
                        _displayedElements = [];

                    _currentEvent || (_currentEvent = event);

                    13 === _currentEvent.keyCode ? element.triggerHandler('click') : void 0;

                    _selectors = (keymap[_currentEvent.keyCode] || keymap[keyNames[_currentEvent.keyCode]] || '').split(/[\s]*\|\|[\s]*/);

                    // Remove empty string from array
                    if (_selectors.join('').split('').length) {

                        // #1 Loop through all user-defined destinations
                        while (_selectors.length) {
                            if (_rawNewElement = $rootElement[0].querySelector('[ui-focus="' + _selectors.shift() + '"]')) {
                                if (_isDisplayed(_rawNewElement)) {
                                    _rawNewElement.focus();

                                    break;
                                } else {
                                    _displayedElements.push(_rawNewElement);

                                    _rawNewElement = null;
                                }
                            }
                        }

                        // #2 If a suitable destination cannot be decided in #1, attempt to deduce the most likely destination
                        if (!_rawNewElement && _displayedElements.length) {
                            return angular.element(_displayedElements[0]).triggerHandler('keydown');
                        }
                    } else if (13 === event.keyCode) {
                        if (!_isDisplayed(element[0])) {
                            $rootElement[0].querySelector('[ui-focus-init]').focus();
                        }
                    }

                    _currentEvent = null;
                });
            }
        };
    });

    function _isDisplayed(rawElement) {
        var _boundingClientRect = rawElement.getBoundingClientRect();

        return 0 !== _boundingClientRect.width || 0 !== _boundingClientRect.height;
    }

})();

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
      
directive('ui-focus', function(
    $document,
    keyNames
){
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            var _boundingClientRect;

            scope.currentElement = document.querySelector('[ui-focus-init]');
            _boundingClientRect = scope.currentElement.getBoundingClientRect();

            element.css({
                display: 'block',
                width: _boundingClientRect.width + 'px',
                height: _boundingClientRect.height + 'px',
                position: 'absolute',
                top: _boundingClientRect.top + 'px',
                left: _boundingClientRect.left +'px'
            });

            $document.bind('keydown', function(event) {
                var keymap = scope.$eval(scope.currentElement.getAttribute('ui-focus-keymap'))
                    _selector = keymap[event.keyCode] || keymap[keyNames[event.keyCode]],
                    _$currentElement = angular.element(scope.currentElement),
                    _$currentElementSiblings = _$currentElement.parent().children();

                if (_selector) {
                    scope.currentElement.removeAttribute('focus-init');

                    if ('++' === _selector) {
                        scope.currentElement = _$currentElementSiblings[(_$currentElement.scope().$index + 1) % _$currentElementSiblings.length];
                    } else if ('--' === _selector) {
                        scope.currentElement = _$currentElementSiblings[(_$currentElement.scope().$index + _$currentElementSiblings.length - 1) % _$currentElementSiblings.length];
                    } else {
                        scope.currentElement = document.querySelector(_selector);
                    }

                    _boundingClientRect = scope.currentElement.getBoundingClientRect();

                    element.css({
                        width: _boundingClientRect.width + 'px',
                        height: _boundingClientRect.height + 'px',
                        top: _boundingClientRect.top + 'px',
                        left: _boundingClientRect.left +'px'
                    });
                }
            });
        }
    };
});

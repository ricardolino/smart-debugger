(function () {
    'use strict';

    var smartDebugger = {
            id: 'smartDebugger',
            active: false,
            visible: false,
            activationSequence: [38, 38, 40, 38],
            styles: {
                fontSize: '200%',
                size: '50%',
                logColor: '#ffff55',
                errorColor: '#ff5555'
            }
        },
        aux = 0;

    document.addEventListener('keydown', tryActiveSequence);

    function _createElement (elementType, textChild) {
        var
            element,
            split
        ;

        if (elementType.indexOf('#') >= 0) {
            split = elementType.split('#');
            element = document.createElement(split[0]);
            element.id = split[1];
        } else if (elementType.indexOf('.') >= 0) {
            split = elementType.split('.');
            element = document.createElement(split[0]);
            element.className = split[1];
        } else {
            element = document.createElement(elementType);
        }

        if (textChild) {
            element.appendChild(document.createTextNode(textChild));
            return element;
        }

        return element;
    }

    function _addStyles () {
        var styleElement = document.createElement('STYLE');
        var textStyle = '#' + smartDebugger.id + ' {position: fixed; overflow: scroll; top: 0; background: rgba(0, 0, 0, 0.75); width: '+ smartDebugger.styles.size + '; height: '+ smartDebugger.styles.size + '; z-index: 999999999; font-size: '+ smartDebugger.styles.fontSize + '; padding: 2%; margin: 0; left: 0; top: 0; } #' + smartDebugger.id + ' li { display: block; padding: 10px 0; color: #FFFFFF; word-wrap: break-word; } #' + smartDebugger.id + ' li.error { color: '+ smartDebugger.styles.errorColor + '; } #' + smartDebugger.id + ' li.log { color: '+ smartDebugger.styles.logColor + '; } #' + smartDebugger.id + ' li:nth-child(odd) { background: rgba(0, 0, 0, 0.1) }';

        document.body.appendChild(_createElement('style', textStyle));
    }

    function _createDebuggerElement () {
        document.body.appendChild(_createElement('ul#' + smartDebugger.id));
    }

    function smartErrorLog (errorMsg, url, lineNumber, column, errorObj) {
        if (errorMsg.indexOf('Script error.') > -1) {
            return;
        }

        var date = new Date(),
            time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            textError = '[Error at ' + time + '] ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj
        ;

        elementDebugger.appendChild(_createElement('li.error', textError));
    }

    function smartDebuggerLog () {
        var elementDebugger = document.getElementById(smartDebugger.id),
            textError = '',
            i,
            date = new Date(),
            time = date.getHours() + ':' + (date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds())
        ;

        for (i = 0; i < arguments.length; i++) {
            textError += ((i === 0) ? '[' + time + '] ' : ', ');

            if (typeof arguments[i] === 'object') {
                textError += (JSON && JSON.stringify) ? JSON.stringify(arguments[i]) : arguments[i];
            } if (typeof arguments[i] === 'string') {
                textError += '\'' + arguments[i] + '\'';
            } else {
                textError += arguments[i];
            }
        }

        elementDebugger.appendChild(_createElement('li.log', textError));
        elementDebugger.scrollTop = elementDebugger.scrollHeight;
    }

    function activateSmartDebugger () {
        if (smartDebugger.active) {
            toggleSmartDebuggerVisibility();
            return;
        }

        _addStyles();
        _createDebuggerElement();

        try {
            window.onerror = smartErrorLog;
        } catch (err) {
            console.log('Can\'t add Errors to SmartDebugger.');
        }

        try {
            window.console.log = smartDebuggerLog;
        } catch (err) {
            console.log('Can\'t add DebuggerLog to SmartDebugger.');
        }

        smartDebugger.active = true;
        smartDebugger.visible = true;
    }

    function tryActiveSequence (e) {
        if (smartDebugger.activationSequence[aux] === e.keyCode) {
            aux = aux + 1;
            if (aux === smartDebugger.activationSequence.length) {
                activateSmartDebugger();
                aux = 0;
            }
        } else {
            aux = 0;
        }
    }

    function toggleSmartDebuggerVisibility () {
        var elementDebugger = document.getElementById(smartDebugger.id);

        smartDebugger.visible = !smartDebugger.visible;
        smartDebugger.visible ? elementDebugger.style.display = '' : elementDebugger.style.display = 'none';
    }
})();
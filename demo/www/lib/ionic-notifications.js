'use strict';
angular.module('ionic-notification', ['ionic'])

  .provider('ionicNotification', function () {

    function closeNotification(item, $document) {
        item = angular.element(item);
        if (item.length === 0) return;
        if (item.hasClass('notification-item-removing')) return;
        var container = angular.element($document[0].querySelector('.notifications'))
    
        var itemHeight = outerHeight(item);
        item.css('height', itemHeight + 'px')
        transition(item, 0);
    
        item.css('height', '0px')
        transition(item,'')
        item.addClass('notification-item-removing');
    
        if (container.find('.notification-item:not(.notification-item-removing)').length === 0) {
            transform(container, '');
        }
    
        addClass(item, 'notification-hidden')
        transitionEnd(item, function () {
            item.remove();
            if (container.find('.notification-item').length === 0) {
                hide(container);
            }
        });
    }
    function transition(element, duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < element.length; i++) {
            var elStyle = element[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return element;
    }
    function is(element, selector) {
        if (!element[0] || typeof selector === 'undefined') return false;
        var compareWith, i;
        if (typeof selector === 'string') {
            var el = element[0];
            if (el === document) return selector === document;
            if (el === window) return selector === window;

            if (el.matches) return el.matches(selector);
            else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
            else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            else {
                compareWith = $(selector);
                for (i = 0; i < compareWith.length; i++) {
                    if (compareWith[i] === element[0]) return true;
                }
                return false;
            }
        }
        else if (selector === document) return element[0] === document;
        else if (selector === window) return element[0] === window;
        else {
            if (selector.nodeType || selector instanceof Dom7) {
                compareWith = selector.nodeType ? [selector] : selector;
                for (i = 0; i < compareWith.length; i++) {
                    if (compareWith[i] === element[0]) return true;
                }
                return false;
            }
            return false;
        }
    }
    function parents(element, selector) {
        var parents = [];
        for (var i = 0; i < element.length; i++) {
            var parent = element[i].parentNode;
            while (parent) {
                if (selector) {
                    if (is(angular.element(parent), selector)) parents.push(parent);
                }
                else {
                    parents.push(parent);
                }
                parent = parent.parentNode;
            }
        }
        // return angular.element($.unique(parents));
        return angular.element(parents);
    }    

    function addClass(element, className) {
        if (typeof className === 'undefined') {
            return element;
        }
        var classes = className.split(' ');
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < element.length; j++) {
                if (typeof element[j].classList !== 'undefined') element[j].classList.add(classes[i]);
            }
        }
        return element;
    }
    function transform(element, transform) {
        for (var i = 0; i < element.length; i++) {
            var elStyle = element[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return element;
    }
    function transitionEnd(element, callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, j, dom = element;
        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== element) return;
            callback.call(element, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return element;
    }
    function show(element) {
        for (var i = 0; i < element.length; i++) {
            element[i].style.display = 'block';
        }
        return element;
    }
    function hide(element) {
        for (var i = 0; i < element.length; i++) {
            element[i].style.display = 'none';
        }
        return element;
    }

    function outerHeight(element, includeMargins) {
        if (element.length > 0) {
            if (includeMargins)
                return element[0].offsetHeight + parseFloat(element.css('margin-top')) + parseFloat(element.css('margin-bottom'));
            else
                return element[0].offsetHeight;
        }
        else return null;
    }
   this.$get = ['$compile', '$document', '$interval', '$rootScope', '$timeout',
      function ($compile, $document, $interval, $rootScope, $timeout) {
        return {

          show: function (params) {
            
            if (!params) return;
            if (typeof params.title        === 'undefined') params.title        = "";
            if (typeof params.subtitle     === 'undefined') params.subtitle     = "";
            if (typeof params.message      === 'undefined') params.message      = "";
            if (typeof params.media        === 'undefined') params.media        = "";
            if (typeof params.closeIcon    === 'undefined') params.closeIcon    = true;
            if (typeof params.closeOnClick === 'undefined') params.closeOnClick = true;


            var _tempNotificationElement;

            if (!_tempNotificationElement) _tempNotificationElement = document.createElement('div');
            var container = angular.element($document[0].querySelector('.notifications'))
            if (container.length === 0) {
                var body = angular.element($document[0].querySelector('body'))
                body.append('<div class="notifications list-block media-list"><ul></ul></div>');
                container = angular.element($document[0].querySelector('.notifications'))
            }
            var list = container.children('ul');
        
            var itemHTML;
            if (params.custom) {
                itemHTML = '<li>' + params.custom + '</li>';
            }
            else {
                itemHTML = '<li class="notification-item notification-hidden"><div class="item-content">' +
                                (params.media ?
                                '<div class="item-media">' +
                                    params.media +
                                '</div>' : '') +
                                '<div class="item-inner">' +
                                    '<div class="item-title-row">' +
                                        (params.title ? '<div class="item-title">' + params.title + '</div>' : '') +
                                        (params.closeIcon ? '<div class="item-after"><a href="javascript:void(0);" class="close-notification"><span></span></a></div>' : '') +
                                    '</div>' +
                                    (params.subtitle ? '<div class="item-subtitle">' + params.subtitle + '</div>' : '') +
                                    (params.message ? '<div class="item-text">' + params.message + '</div>' : '') +
                                '</div>' +
                            '</div></li>';
            }
            _tempNotificationElement.innerHTML = itemHTML;
        
            var item = angular.element(_tempNotificationElement).children();
            item.on('click', function ($e) {
                var close = false;
                var currentTarget = angular.element($e.currentTarget)
                if (is(currentTarget, '.close-notification') 
                    || parents(currentTarget, '.close-notification').length > 0) 
                {
                    close = true;
                }
                else {
                    if (params.onClick) params.onClick(e, item[0]);
                    if (params.closeOnClick) close = true;
                }
                if (close) closeNotification(item[0], $document);
            });            

            list.prepend(item[0]);
            show(container);
            
            var itemHeight = outerHeight(item);
            item.css('marginTop', -itemHeight + 'px');
            
            transition(item, 0);
        
            transition(item, '');
            item.css('marginTop', '0px');
        
            transform(container, 'translate3d(0, 0,0)')
            item.removeClass('notification-hidden');
        
            return item[0];
          },
          hideAll: function () {
            closeNotification(".notification-item")
          }
        };

      }
    ];
  });
'use strict';
angular.module('ionic-notification', ['ionic'])

  .provider('ionicNotification', function () {

    function closeNotification(item) {
        item = angular.element(item);
        if (item.length === 0) return;
        if (item.hasClass('notification-item-removing')) return;
        // var container = $('.notifications');
        var container = angular.element($document[0].querySelector('.notifications'))
    
        // var itemHeight = item.outerHeight();
        var itemHeight = outerHeight(item);
        item.css('height', itemHeight + 'px')
        transition(item, 0);
        // var clientLeft = item[0].clientLeft;
    
        item.css('height', '0px')
        transition(item,'')
        item.addClass('notification-item-removing');

        if (item.data('f7NotificationOnClose')) item.data('f7NotificationOnClose')();
    
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


            var _tempNotificationElement = angular.element("<div></div>")
            // _tempNotificationElement.append("<div></div>");

            if (!_tempNotificationElement) _tempNotificationElement = document.createElement('div');
            // var container = $('.notifications');
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
            // _tempNotificationElement.innerHTML = itemHTML;
            _tempNotificationElement.append(itemHTML);
        
            // var item = $(_tempNotificationElement).children();
            var item = angular.element(_tempNotificationElement).children();
            item.on('click', function (e) {
                var close = false;
                if (angular.element(e.target).is('.close-notification') || angular.element(e.target).parents('.close-notification').length > 0) {
                    close = true;
                }
                else {
                    if (params.onClick) params.onClick(e, item[0]);
                    if (params.closeOnClick) close = true;
                }
                if (close) closeNotification(item[0]);
            });            

            list.prepend(item[0]);
            show(container);
            
            // var itemHeight = item.outerHeight();
            var itemHeight = outerHeight(item);
            item.css('marginTop', -itemHeight + 'px');
            
            transition(item, 0);
        
            // var clientLeft = item[0].clientLeft;
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
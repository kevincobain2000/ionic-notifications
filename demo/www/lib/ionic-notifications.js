'use strict';
angular.module('ionic-notification', ['ionic'])

  .provider('ionicNotification', function () {

    this.$get = ['$compile', '$document', '$interval', '$rootScope', '$templateCache', '$timeout',
      function ($compile, $document, $interval, $rootScope, $templateCache, $timeout) {
        return {

          show: function (params) {
            var _tempNotificationElement;
            if (!params) return;
            if (typeof params.title === 'undefined') params.title = "app.params.notificationTitle";
            if (typeof params.subtitle === 'undefined') params.subtitle = "app.params.notificationSubtitle";
            if (typeof params.message === 'undefined') params.message = "app.params.message";
            if (typeof params.media === 'undefined') params.media = "app.params.notificationMedia";
            if (typeof params.closeOnClick === 'undefined') params.closeOnClick = "app.params.notificationCloseOnClick";

            if (!_tempNotificationElement) _tempNotificationElement = document.createElement('div');
            var container = $('.notifications');
            if (container.length === 0) {
                $('body').append('<div class="notifications list-block media-list"><ul></ul></div>');
                container = $('.notifications');
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
        
            var item = $(_tempNotificationElement).children();

            list.prepend(item[0]);
            container.show();
            
            var itemHeight = item.outerHeight();
            item.css('marginTop', -itemHeight + 'px');

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

            function transform(element, transform) {
                for (var i = 0; i < element.length; i++) {
                    var elStyle = element[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return element;
            }     
            
            transition(item, 0);
        
            var clientLeft = item[0].clientLeft;
            transition(item, '');
            item.css('marginTop', '0px');
        
            transform(container, 'translate3d(0, 0,0)')
            item.removeClass('notification-hidden');
        
            return item[0];
          },
          hide: function () {
            
          }
        };

      }
    ];
  });
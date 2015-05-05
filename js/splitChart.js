(function($) {
    "use strict";

    (function ($) {
        var options = {
            splitChart: {

            }
        };

        function init(plot) {
            var $placeholder = plot.getPlaceholder();
            var splitIndex = 0;

            var onMouseMove = function(event, pos, item) {
                var data = plot.getData();
                if(data.length > 0) {
                    var posX = pos.x;
                    var firstSeries = data[0];
                    var dataset = firstSeries.data;
                    var nearPoint = {
                        x: null,
                        index: null
                    };
                    for (var i = 0; i < dataset.length; i++) {
                        var point = dataset[i];
                        var x = point[0];
                        if(i === 0) {
                            nearPoint = {x: x, index: i};
                        }
                        else if(Math.abs(x - posX) < Math.abs(nearPoint.x - posX)) {
                            nearPoint = {x: x, index: i};
                        }
                    }
                    splitIndex = nearPoint.index;
                }
            };

            var split = function() {
                if(splitIndex) {
                    var data = plot.getData();
                    var leftHalf = [];
                    var rightHalf = [];
                    for (var j = 0; j < data.length; j++) {
                        var oldSeries = data[j].data.splice(0);
                        var firstPart = oldSeries.splice(0, splitIndex);
                        leftHalf.push(firstPart);
                        rightHalf.push(oldSeries);
                    }

                    var options = $.extend({}, plot.getOptions());
                    delete options.crosshair;

                    $.plot("#chart", [
                        { data: leftHalf[0] },
                        { data: leftHalf[1] }
                    ], options);

                    $.plot("#second-chart", [
                        { data: rightHalf[0] },
                        { data: rightHalf[1] }
                    ], options);

                }
            };

            $placeholder.bind("plothover", onMouseMove);
            $placeholder.bind("plotclick", split);

        }

        $.plot.plugins.push({
            init: init,
            options: options,
            name: 'splitChart'
        });
    })(jQuery);

})(jQuery);
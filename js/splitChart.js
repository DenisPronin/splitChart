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
                    var newData = [[], []];
                    for (var j = 0; j < data.length; j++) {
                        var oldSeries = data[j].data.splice(0);
                        var firstPart = oldSeries.splice(0, splitIndex);
                        newData[0].push(firstPart);
                        newData[1].push(oldSeries);
                    }
                    console.log(newData);
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
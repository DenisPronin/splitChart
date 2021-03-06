(function() {
    "use strict";

    $(document).ready(function(){

        var sin = [], cos = [];
        for (var i = 0; i < 14; i += 0.1) {
            sin.push([i, Math.sin(i)]);
            cos.push([i, Math.cos(i)]);
        }

        var plot = $.plot("#chart", [
            { data: sin },
            { data: cos }
        ], {
            series: {
                lines: {
                    show: true
                }
            },
            crosshair: {
                mode: "x"
            },
            splitchart: {
                leftHalfId: 'left-chart',
                rightHalfId: 'right-chart'
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            yaxis: {
                min: -1.2,
                max: 1.2
            }
        });

        $('#left-chart,#right-chart').hide();
        $('#undoSplit').click(function() {
            plot.undoSplit();
        });

        $('#toImage').click(function() {
            html2canvas($('.demo-container')[0], {
                onrendered: function(canvas) {
                    var image = canvas.toDataURL();
                    $('#image-container').empty().append('<img src="' + image + '">');
                }
            });
        });


    });
})();
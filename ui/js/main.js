(function ($) {
    "use strict";

    var jsonData = {};

    $('#modelSearch').on('input', function () {
        var searchQuery = $(this).val().trim();
        filterTableBySearchQuery(searchQuery);
    });


    $('#versionFilter').on('change', function () {
      var selectedVersion = $(this).val();
      filterTableByVersion(selectedVersion);
    });

    function filterTableByVersion(selectedVersion) {
      var tableRows = $('.table-responsive tbody tr');

      tableRows.each(function () {
        var row = $(this);
        var modelCellText = row.find('td:eq(1)').text().trim().toLowerCase();

        var versionFound = false;

        if (selectedVersion === 'Regular') {
          if (!modelCellText.includes('mini') && !modelCellText.includes('max') && !modelCellText.includes('pro') && !modelCellText.includes('plus')) {
            versionFound = true;
          }
        } else if (selectedVersion === 'Mini') {
          if (modelCellText.includes('mini')) {
            versionFound = true;
          }
        } else if (selectedVersion === 'Plus') {
          if (modelCellText.includes('plus')) {
            versionFound = true;
          }
        } else if (selectedVersion === 'Max') {
          if (modelCellText.includes('max') && !modelCellText.includes('pro max')) {
            versionFound = true;
          }
        } else if (selectedVersion === 'Pro') {
          if (modelCellText.includes('pro') && !modelCellText.includes('pro max')) {
            versionFound = true;
          }
        } else if (selectedVersion === 'Pro Max') {
          if (modelCellText.includes('pro max')) {
            versionFound = true;
          }
        }

        if (versionFound) {
          row.show();
        } else {
          row.hide();
        }
      });
    }




  function filterTableBySearchQuery(searchQuery) {
        var tableRows = $('.table-responsive tbody tr');

        tableRows.each(function () {
            var row = $(this);
            var model = row.find('td:eq(1)').text().trim().toLowerCase();

            if (model.includes(searchQuery.toLowerCase())) {
                row.show();
            } else {
                row.hide();
            }
        });
    }

    function populateTable(data) {
        var tableBody = $('.table-responsive tbody');
        $.each(data, function(key, phone) {
            var row = $('<tr></tr>');
            row.append($('<td></td>').html(`<input class="form-check-input" type="checkbox">`));
            row.append($('<td></td>').text(phone.model));
            row.append($('<td></td>').text(phone.capacity + ' GB'));
            row.append($('<td></td>').text(phone.battery_health + '%'));
            row.append($('<td></td>').text(phone.price + ' сом'));
            row.append($('<td></td>').html(`<a href="${phone.link}" target="_blank" class="btn btn-sm btn-primary">Линк</a>`));
            row.append($('<td></td>').text(phone.date));
            tableBody.append(row);
        });
    }

    $(document).ready(function () {
        populateTable(jsonData);
    });

    function containsUpToNCharacters(str1, str2, n) {
        return str1.indexOf(str2.substring(0, n)) !== -1;
    }

    function filterTableByModelAndGB(model, gb) {
        var tableRows = $('.table-responsive tbody tr');

        tableRows.each(function () {
            var row = $(this);
            var rowData = {
                model: row.find('td:eq(1)').text().trim(),
                gb: row.find('td:eq(2)').text().trim()
            };

            var modelMatch = model === '' || containsUpToNCharacters(rowData.model, model, 10);
            var gbMatch = gb === '' || rowData.gb === gb;

            if (modelMatch && gbMatch) {
                row.show();
            } else {
                row.hide();
            }
        });
    }

    $('#modelFilter, #gbFilter').on('change', function () {
        var selectedModel = $('#modelFilter').val();
        var selectedGB = $('#gbFilter').val();
        filterTableByModelAndGB(selectedModel, selectedGB);
    });

    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });

    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});

    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });

    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav: false
    });

    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";

    var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    var myChart1 = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            datasets: [{
                    label: "USA",
                    data: [15, 30, 55, 65, 60, 80, 95],
                    backgroundColor: "rgba(235, 22, 22, .7)"
                },
                {
                    label: "UK",
                    data: [8, 35, 40, 60, 70, 55, 75],
                    backgroundColor: "rgba(235, 22, 22, .5)"
                },
                {
                    label: "AU",
                    data: [12, 25, 45, 55, 65, 70, 60],
                    backgroundColor: "rgba(235, 22, 22, .3)"
                }
            ]
        },
        options: {
            responsive: true
        }
    });

    var ctx2 = $("#salse-revenue").get(0).getContext("2d");
    var myChart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            datasets: [{
                    label: "Salse",
                    data: [15, 30, 55, 45, 70, 65, 85],
                    backgroundColor: "rgba(235, 22, 22, .7)",
                    fill: true
                },
                {
                    label: "Revenue",
                    data: [99, 135, 170, 130, 190, 180, 270],
                    backgroundColor: "rgba(235, 22, 22, .5)",
                    fill: true
                }
            ]
        },
        options: {
            responsive: true
        }
    });

    var ctx3 = $("#line-chart").get(0).getContext("2d");
    var myChart3 = new Chart(ctx3, {
        type: "line",
        data: {
            labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
            datasets: [{
                label: "Salse",
                fill: false,
                backgroundColor: "rgba(235, 22, 22, .7)",
                data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
            }]
        },
        options: {
            responsive: true
        }
    });

    var ctx4 = $("#bar-chart").get(0).getContext("2d");
    var myChart4 = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });

    var ctx5 = $("#pie-chart").get(0).getContext("2d");
    var myChart5 = new Chart(ctx5, {
        type: "pie",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });

    var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: ["Italy", "France", "Spain", "USA", "Argentina"],
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                ],
                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });

})(jQuery);

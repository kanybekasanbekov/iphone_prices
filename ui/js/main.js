(function ($) {
    "use strict";

    var jsonData = {};

    // Unified filter function
function applyFilters() {
    var searchQuery = $('#modelSearch').val().trim().toLowerCase();
    var selectedVersion = $('#versionFilter').val();
    var selectedModel = $('#modelFilter').val().toLowerCase(); // Ensure case-insensitive comparison
    var selectedGB = $('#gbFilter').val();

    var tableRows = $('.table-responsive tbody tr');

    tableRows.each(function () {
        var row = $(this);

        var modelCellText = row.find('td:eq(1)').text().trim().toLowerCase();
        var gbCellText = row.find('td:eq(2)').text().trim();

        var versionMatch = true;
        var modelMatch = (!searchQuery || modelCellText.includes(searchQuery)) &&
                         (!selectedModel || modelCellText.includes(selectedModel));
        var gbMatch = !selectedGB || gbCellText.includes(selectedGB);

        if (selectedVersion === 'Regular') {
            versionMatch = !(modelCellText.includes('mini') || modelCellText.includes('max') || modelCellText.includes('pro') || modelCellText.includes('plus'));
        } else if (selectedVersion) {
            versionMatch = modelCellText.includes(selectedVersion.toLowerCase());
        }

        if (modelMatch && gbMatch && versionMatch) {
            row.show();
        } else {
            row.hide();
        }
    });
}


    // Event handlers for filter inputs
    $('#modelSearch, #versionFilter, #modelFilter, #gbFilter').on('input change', applyFilters);

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
    

})(jQuery);

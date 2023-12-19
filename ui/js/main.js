(function ($) {
    "use strict";

    var jsonData = {};

// Attach event listeners to filter elements
$('#modelSearch, #versionFilter, #modelFilter, #gbFilter').on('change', applyFilters);

function applyFilters() {
    var searchQuery = $('#modelSearch').val().trim().toLowerCase();
    var selectedVersion = $('#versionFilter').val();
    var selectedModel = $('#modelFilter').val().toLowerCase();
    var selectedGB = $('#gbFilter').val();

    var tableRows = $('.table-responsive tbody tr');

    tableRows.each(function () {
        var row = $(this);
        var modelCellText = row.find('td:eq(0)').text().trim().toLowerCase();
        var gbCellText = row.find('td:eq(1)').text().trim().toLowerCase();

        var modelMatch = selectedModel === "" || modelCellText.includes(selectedModel);
        var versionMatch = selectedVersion === "" || modelCellText.includes(selectedVersion.toLowerCase());
        var gbMatch = selectedGB === "" || gbCellText.includes(selectedGB.toLowerCase());

        if (modelMatch && versionMatch && gbMatch) {
            row.show();
        } else {
            row.hide();
        }
    });
}

$('#modelSearch, #versionFilter, #modelFilter, #gbFilter').on('input change', applyFilters);

function hideTdo() {
  var timer = null;
  var target = document.querySelector('#tidio-chat iframe');
  if(!target) {
    if(timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(hideTdo, 500);
    return;
  } else {
    var timer2 = null;
    var tdo = document.querySelector('#tidio-chat iframe')
                .contentDocument
                .querySelector('a[href*="tidio.com/powered"]');
    if(!tdo) {
      if(timer2 !== null) {
        clearTimeout(timer2);
      }
      timer2 = setTimeout(hideTdo, 1);
      return;
    }
    document.querySelector('#tidio-chat iframe')
      .contentDocument
      .querySelector('a[href*="tidio.com/powered"]')
      .remove();
    return true;
  }
}



    // Event handlers for filter inputs

   function populateTable(data) {
    var tableBody = $('.table-responsive tbody');
    $.each(data, function(key, phone) {
        var row = $('<tr></tr>');
        row.append($('<td></td>').text(phone.model));
        row.append($('<td></td>').text(phone.capacity + ' GB'));
        row.append($('<td></td>').text(phone.battery_health + '%'));
        row.append($('<td></td>').text(phone.price + ' сом'));


        var instagramLogo = '<a href="' + phone.link + '" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" class="instagram-logo" style="width: 25px; height: 25px;"></a>';

        row.append($('<td></td>').html(instagramLogo));

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

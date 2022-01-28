jQuery(document).ready(function($) {
    // Codigo para escolher data check-in
    $(function() {
        $("#datepickercheckin").datepicker({
            format: 'dd/mm/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '-100y:c+nn',
            todayHighlight: true,
        }).on('changeDate', function(ev) {
            dataCheckinObject = $('#datepickercheckin').datepicker('getDate');

            if (dataCheckoutObject != null) {
                $(".apartamento").each(function(i) {
                    filterData();
                });
            }

            noResults();
        });
    });

    // Codigo para escolher data check-out
    $(function() {
        $("#datepickercheckout").datepicker({
            format: 'dd/mm/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '-100y:c+nn',
            todayHighlight: true,
        }).on('changeDate', function(ev) {
            dataCheckoutObject = $('#datepickercheckout').datepicker('getDate');

            if (dataCheckinObject != null) {
                $(".apartamento").each(function(i) {
                    filterData();
                });
            }

            noResults();
        });
    });


    $('.pagamento-paypal').hide();
    $('.pagamento-mbway').hide();

    $('#cartao-btn').click(function() {
        $('#paypal-btn input').attr('checked', false);
        $('#mbway-btn input').attr('checked', false);
        $('#cartao-btn input').attr('checked', true);
        $('#paypal-btn').css('background-color', 'white');
        $('#mbway-btn').css('background-color', 'white');
        $('#cartao-btn').css('background-color', '#ced4da');
        $('.pagamento-paypal').hide();
        $('.pagamento-mbway').hide();
        $('.pagamento-cartao').show();
    })

    $('#paypal-btn').click(function() {
        $('#cartao-btn input').attr('checked', false);
        $('#mbway-btn input').attr('checked', false);
        $('#paypal-btn input').attr('checked', true);
        $('#cartao-btn').css('background-color', 'white');
        $('#paypal-btn').css('background-color', '#ced4da');
        $('#mbway-btn').css('background-color', 'white');
        $('.pagamento-cartao').hide();
        $('.pagamento-mbway').hide();
        $('.pagamento-paypal').show();
    })

    $('#mbway-btn').click(function() {
        $('#cartao-btn input').attr('checked', false);
        $('#mbway-btn input').attr('checked', true);
        $('#paypal-btn input').attr('checked', false);
        $('#cartao-btn').css('background-color', 'white');
        $('#paypal-btn').css('background-color', 'white');
        $('#mbway-btn').css('background-color', '#ced4da');
        $('.pagamento-cartao').hide();
        $('.pagamento-paypal').hide();
        $('.pagamento-mbway').show();

    })

    $('input[type=radio].metodo-pagamento').remove();

    ko.applyBindings(new HTMLwriter())

});

function HTMLwriter() {
    self.nome = ko.observable()
    self.mail = ko.observable()
    self.nome = localStorage.getItem('nome')
    self.mail = localStorage.getItem('email')

}

function validate() {
    controlo = true
        /* nome */
    if ($('#nome').val().trim().length < 2 || $('#nome').val().trim().length > 100) {
        $('#nomeError').removeClass('d-none')
        controlo = false
    } else {
        $('#nomeError').addClass('d-none')
    }

    /* cartao */
    if ($('#cartao').val().trim().length < 13 || $('#cartao').val().trim().length > 16) {
        $('#cartaoError').removeClass('d-none')
        controlo = false
    } else {
        $('#cartaoError').addClass('d-none')
        controlo = true
    }

    /* pais */
    if ($('#pais option:selected').val().length < 1) {
        $('#paisError').removeClass('d-none')
        controlo = false
    } else {
        $('#paisError').addClass('d-none')
        controlo = true
    }

    /* sobrenome */

    if ($('#sobrenome').val().trim().length < 2 || $('#sobrenome').val().trim().length > 100) {
        $('#sobrenomeError').removeClass('d-none')
        controlo = false
    } else {
        $('#sobrenomeError').addClass('d-none')
        controlo = true
    }

    /* validade */

    if ($('#datavalidade').val().trim().length != 5) {
        $('#datavalidadeError').removeClass('d-none')
        controlo = false
    } else {
        $('#datavalidadeError').addClass('d-none')
        controlo = true
    }

    /* CVV */
    if ($('#cvv').val().trim().length != 3) {
        $('#cvvError').removeClass('d-none')
        controlo = false
    } else {
        $('#cvvError').addClass('d-none')
        controlo = true
    }

    /* codigo postal */
    if ($('#postal').val().trim().length != 8) {
        $('#postalError').removeClass('d-none')
        controlo = false
    } else {
        $('#postalError').addClass('d-none')
        controlo = true
    }

    /* telemovel */
    if ($('#tele').val().trim().length != 9) {
        $('#teleError').removeClass('d-none')
    } else {
        $('#teleError').addClass('d-none')
        controlo = true
    }

    if (controlo == true) {
        $("#myModal").modal("show");
    } else {
        return controlo
    }


}
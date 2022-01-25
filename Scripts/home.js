jQuery(document).ready(function($) {
    var numeroPessoas = "destination";
    var localizacaoSelecionada = "destination";
    var dataCheckinObject;
    var dataCheckoutObject;
    var precominimo = 0;
    var precomaximo = 1000000;

    // Filtro por localizacao
    $(".localizacoes").change(function() {
        filtroLocalizacoes($(this));

        noResults();
    });

    var filtroLocalizacoes = function(t) {
        localizacaoSelecionada = t.children("option:selected").attr("value");

        $("h2.destination").parent().parent().parent().hide();
        $("h2.destination").filter("." + localizacaoSelecionada.toLowerCase() + "." + numeroPessoas).parent().parent().parent().show();

        if (dataCheckinObject != null && dataCheckoutObject != null) {
            filterData();
        }

        hidePreco();

        if (localizacaoSelecionada === "Localizacao") {
            $("h2.destination").parent().parent().parent().show();
        }
    }

    $(".numeroDePessoas").change(function() {
        filtroNumeroPessoas($(this));

        noResults();
    });

    var filtroNumeroPessoas = function(t) {
        numeroPessoas = t.children("option:selected").val();

        $("h2.destination").parent().parent().parent().hide();
        $("h2.destination").filter("." + numeroPessoas + "." + localizacaoSelecionada.toLowerCase()).parent().parent().parent().show();

        if (dataCheckinObject != null && dataCheckoutObject != null) {
            filterData();
        }

        hidePreco();

        if (numeroPessoas === "Numero de pessoas") {
            $("h2.destination").parent().parent().parent().show();
        }
    }

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
                $(".destination").each(function(i) {
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
                $(".destination").each(function(i) {
                    filterData();
                });
            }

            noResults();
        });
    });

    var filterData = function() {
        $(".destination").each(function(i) {
            if ($(this).is("h2")) {
                $(this).parent().parent().parent().hide();
                if (d1MaiorQued2(dataCheckinObject, $(this).attr("id")) || !d1MaiorQued2(dataCheckoutObject, $(this).attr("id"))) {
                    $(this).filter("." + numeroPessoas + "." + localizacaoSelecionada.toLowerCase()).parent().parent().parent().show();
                }
            } else {
                if (parseInt($(this).attr("id")) < precominimo || parseInt($(this).attr("id")) > precomaximo) {
                    $(this).filter("." + numeroPessoas + "." + localizacaoSelecionada.toLowerCase()).parent().parent().parent().hide();
                }
            }
        });
    }

    var d1MaiorQued2 = function(d1, d2) {
        var ano1 = parseInt(d1.getFullYear());
        var mes1 = parseInt(d1.getMonth() + 1);
        var dia1 = parseInt(d1.getDate());
        var d2 = d2.split("/");
        var ano2 = parseInt(d2[2]);
        var mes2 = parseInt(d2[1]);
        var dia2 = parseInt(d2[0]);

        if (ano1 > ano2) {
            return true;
        } else if (ano1 < ano2) {
            return false;
        } else {
            if (mes1 > mes2) {
                return true;
            } else if (mes1 < mes2) {
                return false;
            } else {
                if (dia1 > dia2) {
                    return true;
                } else if (dia1 < dia2) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

    var precoPorNoite = parseInt($("#preco-total").text().replace("€", ""));
    $("#alugar").click(function() {
        $("#preco-total").text(precoPorNoite + "€");

        var checkIn = $("#datepickercheckin").datepicker('getDate');
        var checkOut = $("#datepickercheckout").datepicker('getDate');

        var differenceInTime = checkOut.getTime() - checkIn.getTime();
        var differenceInDays = differenceInTime / (1000 * 3600 * 24);

        $("#preco-total").text(differenceInDays * parseInt($("#preco-total").text().replace("€", "")) + "€");
    })

    var hidePreco = function() {
        $("h3.destination").each(function(i) {
            if (parseInt($(this).attr("id")) < precominimo || parseInt($(this).attr("id")) > precomaximo) {
                $(this).filter("." + numeroPessoas + "." + localizacaoSelecionada.toLowerCase()).parent().parent().parent().hide();
            }
        });
    }

    // Filtro preço minimo
    $(".preco-minimo").change(function() {
        filtroPrecoMinimo($(this));

        if (dataCheckinObject != null && dataCheckoutObject != null) {
            filterData();
        }

        noResults();
    });

    var filtroPrecoMinimo = function(t) {
        precominimo = t.children("option:selected").val();
        $(".nome-destination").each(function(i) {
            $(this).parent().parent().parent().hide();
            if (parseInt($(this).attr("id")) >= precominimo && parseInt($(this).attr("id")) <= precomaximo) {
                $(this).filter("." + numeroPessoas + "." + localizacaoSelecionada.toLowerCase()).parent().parent().parent().show();
            }
        });
    }


    // Filtro preço maximo
    $(".preco-maximo").change(function() {
        filtroPrecoMaximo($(this));

        if (dataCheckinObject != null && dataCheckoutObject != null) {
            filterData();
        }

        noResults();
    });

    var filtroPrecoMaximo = function(t) {
        precomaximo = t.children("option:selected").val();
        $(".nome-destination").each(function(i) {
            $(this).parent().parent().parent().hide();
            if (parseInt($(this).attr("id")) <= precomaximo && parseInt($(this).attr("id")) >= precominimo) {
                $(this).filter("." + numeroPessoas + "." + localizacaoSelecionada.toLowerCase()).parent().parent().parent().show();
            }
        });
    }
    $("#no-results").hide();
    var noResults = function() {
        var thereAreNoResults = true;

        $("h2.destination").each(function(i) {
            if (!$(this).is(":hidden")) {
                thereAreNoResults = false;
            }
        });

        if (thereAreNoResults) {
            $("#no-results").show();
        }
    };
    var $form_modal = $('.cd-user-modal'),
        $form_login = $form_modal.find('#cd-login'),
        $form_signup = $form_modal.find('#cd-signup'),
        $form_forgot_password = $form_modal.find('#cd-reset-password'),
        $form_modal_tab = $('.cd-switcher'),
        $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
        $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
        $forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
        $back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
        $main_nav = $('.main-nav');

    //open modal
    $main_nav.on('click', function(event) {

        if ($(event.target).is($main_nav)) {
            // on mobile open the submenu
            $(this).children('ul').toggleClass('is-visible');
        } else {
            // on mobile close submenu
            $main_nav.children('ul').removeClass('is-visible');
            //show modal layer
            $form_modal.addClass('is-visible');
            //show the selected form
            ($(event.target).is('.cd-signup')) ? signup_selected(): login_selected();
        }

    });

    //close modal
    $('.cd-user-modal').on('click', function(event) {
        if ($(event.target).is($form_modal) || $(event.target).is('.cd-close-form')) {
            $form_modal.removeClass('is-visible');
        }
    });
    //close modal when clicking the esc keyboard button
    $(document).keyup(function(event) {
        if (event.which == '27') {
            $form_modal.removeClass('is-visible');
        }
    });

    //switch from a tab to another
    $form_modal_tab.on('click', function(event) {
        event.preventDefault();
        ($(event.target).is($tab_login)) ? login_selected(): signup_selected();
    });

    //hide or show password
    $('.hide-password').on('click', function() {
        var $this = $(this),
            $password_field = $this.prev('input');

        ('password' == $password_field.attr('type')) ? $password_field.attr('type', 'text'): $password_field.attr('type', 'password');
        ('Hide' == $this.text()) ? $this.text('Show'): $this.text('Hide');
        //focus and move cursor to the end of input field
        $password_field.putCursorAtEnd();
    });

    //show forgot-password form 
    $forgot_password_link.on('click', function(event) {
        event.preventDefault();
        forgot_password_selected();
    });

    //back to login from the forgot-password form
    $back_to_login_link.on('click', function(event) {
        event.preventDefault();
        login_selected();
    });

    function login_selected() {
        $form_login.addClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.addClass('selected');
        $tab_signup.removeClass('selected');
    }

    function signup_selected() {
        $form_login.removeClass('is-selected');
        $form_signup.addClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.removeClass('selected');
        $tab_signup.addClass('selected');
    }

    function forgot_password_selected() {
        $form_login.removeClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.addClass('is-selected');
    }

    $form_login.find('input[type="submit"]').on('click', function(event) {
        event.preventDefault();
        $form_login.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    });
    $form_signup.find('input[type="submit"]').on('click', function(event) {
        event.preventDefault();
        $form_signup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
    });

    if (!Modernizr.input.placeholder) {
        $('[placeholder]').focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.val(input.attr('placeholder'));
            }
        }).blur();
        $('[placeholder]').parents('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            })
        });
    }

});

jQuery.fn.putCursorAtEnd = function() {
    return this.each(function() {
        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;
            this.setSelectionRange(len, len);
        } else {
            // ... otherwise replace the contents with itself
            // (Doesn't work in Google Chrome)
            $(this).val($(this).val());
        }
    });
};



// modal

outroModal = function() {
    $('#modal1').addClass('d-none')
    $('#modal2').removeClass('d-none')
}

resetModal = function() {
    $('#modal1').removeClass('d-none')
    $('#modal2').addClass('d-none')
}

validate = function() {
    console.log('aqui')
    var retVal = true;

    //nome
    var nome = $.trim($("#InputName").val()).length
    if (nome < 10 || nome > 100) {
        $('#nomeError').removeClass('d-none');
        retVal = false;
    } else {
        $('#nomeError').addClass('d-none');
    }

    //destino
    var destino = $.trim($("#InputDestino").val()).length
    if (destino < 10 || destino > 100) {
        $('#destinoError').removeClass('d-none');
        retVal = false;
    } else {
        $('#destinoError').addClass('d-none');
    }


    //preco
    var preco = $.trim($("#inputpreco").val()).length
    var local = ($('#inputpreco').val()).lastIndexOf('€')
    if (preco < 1 || local != (preco - 1)) {
        $('#precoError').removeClass('d-none');
        retVal = false;
    } else {
        $('#precoError').addClass('d-none');
    }

    //pessoas
    var pessoas = $.trim($("#inputpessoas").val()).length
    if (pessoas == 0) {
        $('#pessoasError').removeClass('d-none');
        retVal = false;
    } else {
        $('#pessoasError').addClass('d-none');
    }

    //duracao
    var duracao = $.trim($("#inputduracao").val()).length
    if (duracao == 0) {
        $('#duraçãoError').removeClass('d-none');
        retVal = false;
    } else {
        $('#duraçãoError').addClass('d-none');
    }

    //fim

    if (retVal == true) {
        outroModal();
    }

    return retVal
}
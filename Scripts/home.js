jQuery(document).ready(function($) {
    var numeroPessoas = "destination";
    var localizacaoSelecionada = "destination";
    var dataCheckinObject;
    var dataCheckoutObject;
    var precominimo = 0;
    var precomaximo = 1000000;

    var self = this;
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

    ko.applyBindings(new HTMLwriter())
});


function HTMLwriter() {
    self.nome = ko.observable()
    self.mail = ko.observable()
    self.nome = localStorage.getItem('nome')
    self.mail = localStorage.getItem('email')

}


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
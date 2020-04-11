
AS.FORMS.bus.on(AS.FORMS.EVENT_TYPE.formShow, function (event, model, view) {
    if (model.formName == "Служебная записка") {
        var signDialogs = $(".buttonTable");
        if (signDialogs.length > 0) {
            for (var i = 0; i < signDialogs.length; i++) {
                //console.log("Сработал signhandler");
                var signDialog = jQuery(signDialogs[i]);
                if (signDialog.attr('document_id') != undefined && ($("div.button-brightgreen-text").text() == "Согласовать")) {
                    initSignDialog(signDialog, model);
                }
            }
        }

        // let closeBtn = $(".gwt-Image");

        // if (closeBtn.length > 0) {
        //     for (var i = 0; i < closeBtn.length; i++) {
        //         //console.log("Сработал signhandler");
        //         var closeButton = jQuery(closeBtn[i]);
        //         if (closeButton.attr('src') == "images/close.png") {
        //             console.log(closeButton);
        //             setTimeout(function(){
        //                 closeButton.trigger("click");
        //                 console.log(closeButton.parent());
        //                 console.log(closeButton.parent().parent());
        //                 console.log(closeButton.parent().parent().parent());
        //                 console.log(closeButton.parent().parent().parent().parent());
        //                 closeButton.parent().parent().parent().parent().trigger("click");
        //                 console.log("click");
        //             }, 5000);
        //         }
        //     }
        // }
    }
});

function initSignDialog(signDialog, model) {

    if (signDialog[0].inited) return;
    var instance = this;
    var newRow = '<tr><td align="left" style="vertical-align: top;"><table cellspacing="0" cellpadding="0" class="naDorabotku" document_id=' + signDialog.attr('document_id') + ' style="width: 100%;"><colgroup><col></colgroup><tbody><tr><td align="right" style="vertical-align: top;"><img src="images/simple.button/bright.green/left.png" class="gwt-Image"></td><td class="button-center-brightgreen" align="center" width="100%" style="vertical-align: top;"><table cellspacing="0" cellpadding="0" border="0" class="buttonTable" style="height: 25px;"><colgroup><col></colgroup><tbody><tr><td class="button-brightgreen-text button-brightgray-text" align="center" style="vertical-align: middle; white-space: nowrap;"><div class="button-brightgreen-text">На доработку</div></td></tr></tbody></table></td><td align="left" style="vertical-align: top;"><img src="images/simple.button/bright.green/right.png" class="gwt-Image"></td></tr></tbody></table></td></tr>';
    var otstup = '<tr><td align="left" style="vertical-align: top;"><div class="gwt-HTML" style="width: 9px; height: 9px;"></div></td></tr>';
    signDialog.parent().parent().parent().append(newRow);
    signDialog.parent().parent().parent().append(otstup);

    var naDorabotku = $(".naDorabotku");
    if (naDorabotku.length > 0) {
        for (var i = 0; i < naDorabotku.length; i++) {
            var butt = jQuery(naDorabotku[i]);
            if (signDialog.attr('document_id') == butt.attr('document_id')) {
                buttClick(butt, model);
            }
        }
    }

    signDialog[0].inited = true;
}

function buttClick(button, model) {
    let personID = AS.OPTIONS.currentUser.userId;

    var statusValue;

    button.click(function () {
        showPrompt("Оставьте ваш комментарий", function (value) {
            //alert("Отправлено на доработку");
            try {
                if (value != null) {
                    AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/asforms/data/document?dataUUID=' + model.playerModel.asfDataId)
                        .then(Ddata => {
                            AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/workflow/get_execution_process?documentID=' + Ddata[model.playerModel.asfDataId].documentID)
                                .then(actions => {
                                    let actionID = "";
                                    let itemID = "";
                                    let pass = true;
                                    actions.forEach(item => {
                                        if (item.name == "На согласовании" && pass) {
                                            actionID = item.actionID;
                                            itemID = item.itemID;
                                            pass = false;
                                        }
                                    });
                                    AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/workflow/work/create_defaults')
                                        .then(date => {
                                            AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/workflow/process_info?workID=' + actionID)
                                                .then(processInfo => {
                                                    var settings2 = {
                                                        "url": "https://arta.kaztrk.kz/Synergy/rest/api/workflow/work/start_route",
                                                        "method": "POST",
                                                        "timeout": 0,
                                                        "headers": {
                                                            "Content-Type": "application/x-www-form-urlencoded",
                                                            "Authorization": "Basic " + btoa(AS.OPTIONS.login + ":" + AS.OPTIONS.password)
                                                        },
                                                        "data": {
                                                            "documentID": Ddata[model.playerModel.asfDataId].documentID,
                                                            "finishDate": date.finish_date,
                                                            "name": "Отправлено на доработку:"+ model.playerModel.getModelWithId("comment").getValue(),
                                                            "resUserID": model.playerModel.getModelWithId("cmp-27").getValue()[0].personID,
                                                            "completionFormCode": "comment",
                                                            "type": "2"
                                                        }
                                                    };

                                                    $.ajax(settings2).done(function (response) {
                                                        var settings = {
                                                            "url": "https://arta.kaztrk.kz/Synergy/rest/api/workflow/finish_process",
                                                            "method": "POST",
                                                            "timeout": 0,
                                                            "headers": {
                                                                "Content-Type": "application/x-www-form-urlencoded",
                                                                "Authorization": "Basic " + btoa(AS.OPTIONS.login + ":" + AS.OPTIONS.password)
                                                            },
                                                            "data": {
                                                                "comment": "На доработку",
                                                                "signal": "got_refuse",
                                                                "procInstID": itemID,
                                                                "addSignature": "true",
                                                                "rawdata": processInfo.raw_data
                                                            }
                                                        };

                                                        $.ajax(settings).done(function (response) {
                                                            console.log(response);
                                                        });
                                                        //model.playerModel.getModelWithId("comment").setValue(model.playerModel.getModelWithId("comment").getValue() + " 3 " + response.errorMessage);
                                                    });

                                                    var notification = new Notification(value);
                                                });
                                        });
                                });
                        });
                }
            } catch (err) {
                console.log("notification error");
            }

        });
    });

    function showCover() {
        //let coverDiv = document.createElement('div');
        //coverDiv.id = 'cover-div';

        // убираем возможность прокрутки страницы во время показа модального окна с формой
        //document.body.style.overflowY = 'hidden';

        //document.body.append(coverDiv);
    }

    function hideCover() {
        //document.getElementById('cover-div').remove();
        //document.body.style.overflowY = '';
    }

    function showPrompt(text, callback) {
        showCover();
        let form = document.getElementById('prompt-form');
        let container = document.getElementById('prompt-form-container');
        document.getElementById('prompt-message').innerHTML = text;
        form.text.value = '';

        function complete(value) {
            hideCover();
            container.style.display = 'none';
            document.onkeydown = null;
            callback(value);
        }

        form.onsubmit = function () {
            // let value = form.text.value;
            // if (value == '') return false; // игнорируем отправку пустой формы

            // complete(value);
            // return false;
        };

        form.submitComment.onclick = function () {
            let value = form.text.value;
            model.playerModel.getModelWithId("comment").setValue(form.text.value); // айди коммента
            //model.playerModel.getModelWithId("dorabotka").setValue(["02"]); // айди выпадающего списка
            //model.playerModel.getModelWithId("userID").setValue(personID + "");
            //view.playerView.getViewWithId("table-dorabotka").setVisible(true);
            complete("Отправлено на доработку");
        };

        form.cancel.onclick = function () {
            complete(null);
        };

        document.onkeydown = function (e) {
            if (e.key == 'Escape') {
                complete(null);
            }
        };

        let lastElem = form.elements[form.elements.length - 1];
        let firstElem = form.elements[0];

        lastElem.onkeydown = function (e) {
            if (e.key == 'Tab' && !e.shiftKey) {
                firstElem.focus();
                return false;
            }
        };

        firstElem.onkeydown = function (e) {
            if (e.key == 'Tab' && e.shiftKey) {
                lastElem.focus();
                return false;
            }
        };

        container.style.display = 'block';
        form.elements.text.focus();
    }
}

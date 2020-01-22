jQuery(view.container).children("[innerId='deal']").click(() => { //данные сохроняються по нажатию кнопки
    let data = [];
    AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/registry/create_doc', false, 'json', {//идет запрос на создание нового документа в реестре
        registryCode: 'purchase_requisition_shavketov_eldar1'//код реестра
    }).then(response => response)
        .then(newDocument => {
            AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/asforms/data/get?dataUUID=' + newDocument.dataUUID).then(ASFdata => {// запрос на получение данных о документе
                ASFdata[0].data.forEach(Aitem => {//итерация по компонентам формы
                    if (Aitem.id == "juridical") // если код компонента juridical по изменяеться значение value на значение компонента
                        Aitem.value = model.playerModel.getModelWithId('juridical').getValue();
                    if (Aitem.id == "production") {
                        Aitem.data.forEach(item => {
                            if (item.type == "label")
                                data.push(item)
                        })
                        model.playerModel.getModelWithId('production').modelBlocks.forEach(a => {//итерация по компонентам дин таблицы
                            a.forEach(b => {
                                switch (b.asfProperty.type) {
                                    case "custom":
                                        data.push({ "id": b.asfProperty.id + "-b" + a.tableBlockIndex, "type": b.asfProperty.type })
                                        break;
                                    case "listbox":
                                        data.push({ "id": b.asfProperty.id + "-b" + a.tableBlockIndex, "type": b.asfProperty.type, "value": b.asfProperty.data.value, "key": b.asfProperty.data.key })
                                        break;
                                    case "textbox":
                                        data.push({ "id": b.asfProperty.id + "-b" + a.tableBlockIndex, "type": b.asfProperty.type, "value": b.getValue() != null ? b.getValue() : "" })
                                        break;
                                    case "numericinput":
                                        data.push({ "id": b.asfProperty.id + "-b" + a.tableBlockIndex, "type": b.asfProperty.type, "value": b.getValue() != null ? b.getValue() : "", "key": b.getValue() })
                                        break;
                                }
                            })
                        })
                        Aitem.data = data;
                        console.log(data)
                        AS.FORMS.ApiUtils.simpleAsyncPost('rest/api/asforms/data/save?uuid=' + newDocument.dataUUID, false, 'json', {//запрос на сохранение данных формы
                            data: '"data":' + JSON.stringify(ASFdata[0].data)
                        }).then(re => {
                            AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/registry/activate_doc', false, 'json', {// активация записи реестра по маршруту
                                        dataUUID: newDocument.dataUUID
                                    }).then(response => {
                                        $(".ui-widget-overlay.ui-front")[0].remove();
                                        $('#form_player_container').dialog('destroy').remove();
                                        $("[aria-describedby='form_player_container']")[0].remove();
                                    });
                            })
                        }
                })
            });
        });
});

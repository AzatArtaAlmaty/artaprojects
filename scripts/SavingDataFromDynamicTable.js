jQuery(view.container).children("[innerId='deal']").click(() => {
    let data = [];
    AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/registry/create_doc', false, 'json', {
        registryCode: 'purchase_requisition_shavketov_eldar1'
    }).then(response => response)
        .then(newDocument => {
            AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/asforms/data/get?dataUUID=' + newDocument.dataUUID).then(ASFdata => {
                ASFdata[0].data.forEach(Aitem => {
                    if (Aitem.id == "juridical")
                        Aitem.value = model.playerModel.getModelWithId('juridical').getValue();
                    if (Aitem.id == "production") {
                        Aitem.data.forEach(item => {
                            if (item.type == "label")
                                data.push(item)
                        })
                        model.playerModel.getModelWithId('production').modelBlocks.forEach(a => {
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
                        AS.FORMS.ApiUtils.simpleAsyncPost('rest/api/asforms/data/save?uuid=' + newDocument.dataUUID, false, 'json', {
                            data: '"data":' + JSON.stringify(ASFdata[0].data)
                        }).then(re => {
                            AS.FORMS.ApiUtils.simpleAsyncGet('rest/api/registry/activate_doc', false, 'json', {
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

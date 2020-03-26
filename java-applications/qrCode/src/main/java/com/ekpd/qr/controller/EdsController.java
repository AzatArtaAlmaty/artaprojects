package com.ekpd.qr.controller;

import com.ekpd.qr.service.EdsService;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class EdsController {
    @Autowired
    EdsService es;

    public EdsController() {
    }

//    @PreAuthorize("")
    @ResponseBody
    @RequestMapping(
            value = {"/photo"},
            method = {RequestMethod.GET},
            produces = {"image/jpeg"}
    )
    public byte[] testphoto(@RequestParam String userId, @RequestParam String data) throws IOException, WriterException {
        byte[] image = this.es.findEds(userId, data);
        return image;
    }
}


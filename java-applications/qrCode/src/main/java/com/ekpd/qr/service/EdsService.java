package com.ekpd.qr.service;

import com.ekpd.qr.entity.EdsInfo;
import com.ekpd.qr.repo.edsRepository;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Calendar;
import java.util.Hashtable;

@Service
public class EdsService {
    @Autowired
    edsRepository er;

    public EdsService() {
    }

    @Transactional
    public byte[] findEds(String userid, String data) throws WriterException, IOException {
        String delimeter = " ";
        String result = "";

        try {
            String[] subStr = userid.split(delimeter);
            String[] var6 = subStr;
            int var7 = subStr.length;

            for(int var8 = 0; var8 < var7; ++var8) {
                String subStr1 = var6[var8];
                System.out.println("" + subStr1);
                EdsInfo ex = null;

                try {
                    ex = this.er.getOne(Integer.parseInt(subStr1));
                    Calendar calendar = Calendar.getInstance();
                    String info = ex.getInfoEDS();
                    result = info;
                    System.out.println(Long.parseLong(ex.getTimeEnd()));
                    calendar.setTimeInMillis(Long.parseLong(ex.getTimeEnd()));
                    int mYear = calendar.get(1);
                    int mMonth = calendar.get(2);
                    int mDay = calendar.get(5);
                    System.out.println(mYear + ":" + mMonth + ":" + mDay);
                    int index = info.indexOf("null");
                    System.out.println("" + index);
                    if (index != -1) {
                        result = info.substring(0, index - 2);
                    }

                    System.out.println("" + result);
                    String date = "";
                    if (mMonth < 10 && mDay < 10) {
                        date = date + mYear + ":0" + mMonth + ":0" + mDay;
                    } else if (mMonth < 10) {
                        date = date + mYear + ":0" + mMonth + ":" + mDay;
                    } else if (mDay < 10) {
                        date = date + mYear + ":" + mMonth + ":0" + mDay;
                    } else {
                        date = date + mYear + ":" + mMonth + ":" + mDay;
                    }

                    data = data + " Серийный номер:" + ex.getIdKeyEds() + " Информация о владелце:" + result + " дата окончания:" + date + "\n";
                } catch (Exception var18) {
                    data = data + " Серийный номер:" + ex.getIdKeyEds() + " Информация о владелце:" + result;
                }
            }
        } catch (Exception var19) {
            System.out.println("" + data);
        }

        Hashtable hints = new Hashtable();
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
        return QrGenerater.generateQRCodeImage(data, 400, 400, hints);
    }
}

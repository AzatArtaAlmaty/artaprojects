package com.ekpd.qr.repo;

import com.ekpd.qr.entity.EdsInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.io.Serializable;

@Repository
public interface edsRepository extends JpaRepository<EdsInfo, Serializable> {
}
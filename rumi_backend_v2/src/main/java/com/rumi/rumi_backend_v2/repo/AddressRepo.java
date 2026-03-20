package com.rumi.rumi_backend_v2.repo;

import com.rumi.rumi_backend_v2.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepo extends JpaRepository<Address, Long> {
}
